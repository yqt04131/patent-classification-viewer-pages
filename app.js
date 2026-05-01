const statusEl = document.querySelector('#status');
const formEl = document.querySelector('#lookup-form');
const inputEl = document.querySelector('#ipc-input');
const listEl = document.querySelector('#result-list');
const metaEl = document.querySelector('#result-meta');
const template = document.querySelector('#result-item-template');
const quickButtons = document.querySelectorAll('[data-code]');
const modeInputs = document.querySelectorAll('input[name="lookup-mode"]');
const targetInputs = document.querySelectorAll('input[name="children-target"]');
const targetField = document.querySelector('#children-target-field');
const targetModeLabelEl = document.querySelector('#target-mode-label');
const targetModeGroupEl = document.querySelector('#children-target-group');

const shared = window.ClassificationShared;

if (!shared) {
  statusEl.textContent =
    '必要なスクリプトの読み込みに失敗しました。classification-common.js を含めて更新し、ページを再読み込みしてください。';
  statusEl.dataset.state = 'error';
  throw new Error('ClassificationShared is not available');
}

const {
  DATASETS,
  loadShard,
  formatCodeForDisplay,
  resolveLookupCode,
  getChildItems,
  createEmptyNote,
  buildResultModel,
  createResultItemNode,
} = shared;

const VIEW_COPY = {
  lookup: {
    targetLabel: '参照する分類',
    targetGroupLabel: '参照する分類',
  },
  children: {
    targetLabel: '1つ下の階層で参照する分類',
    targetGroupLabel: '1つ下の階層で参照する分類',
  },
};

let lookupTimer = null;
let currentOverlayMode = 'ancestors';
const FTERM_INLINE_GAP = '[ \\t\\u3000]*';
const FTERM_TERM_SEPARATOR = `(?:${FTERM_INLINE_GAP}[^0-9A-Z\\s\\u3000]${FTERM_INLINE_GAP})?`;
const FTERM_PATTERN = new RegExp(
  `\\d${FTERM_INLINE_GAP}[A-Z](?:${FTERM_INLINE_GAP}\\d){3}(?:${FTERM_TERM_SEPARATOR}(?:[A-Z](?:${FTERM_INLINE_GAP}[A-Z]))(?:${FTERM_INLINE_GAP}\\d){2})?`,
  'gi'
);

function normalizeFtermCode(value) {
  if (window.FtermLookup && typeof window.FtermLookup.normalizeFtermCode === 'function') {
    return window.FtermLookup.normalizeFtermCode(value);
  }

  return normalizeCode(value);
}

function isFtermLikeCode(value) {
  return /^\d[A-Z]\d{3}(?:[A-Z]{2}\d{2})?$/.test(normalizeFtermCode(value));
}

function normalizeInputText(value) {
  return (value || '').normalize('NFKC');
}

function normalizeCode(value) {
  return normalizeInputText(value)
    .toUpperCase()
    .replace(/[ \t\r\n\u3000]/g, '')
    .replace(/[、，,]/g, '');
}

function getSelectedViewMode() {
  const checked = Array.from(modeInputs).find((input) => input.checked);
  return checked ? checked.value : 'lookup';
}

function getSelectedTargetMode() {
  const checked = Array.from(targetInputs).find((input) => input.checked);
  return checked ? checked.value : 'ipc';
}

function setSelectedTargetMode(mode) {
  const matched = Array.from(targetInputs).find((input) => input.value === mode);
  if (matched) {
    matched.checked = true;
  }
}

function syncModeFields() {
  const viewMode = getSelectedViewMode();
  const copy = VIEW_COPY[viewMode] || VIEW_COPY.lookup;
  targetField.hidden = false;
  targetModeLabelEl.textContent = copy.targetLabel;
  targetModeGroupEl.setAttribute('aria-label', copy.targetGroupLabel);
}

function findFtermCodes(rawText) {
  const matches = normalizeInputText(rawText).toUpperCase().match(FTERM_PATTERN) || [];
  const codes = [];
  const seen = new Set();

  for (const match of matches) {
    const code = normalizeFtermCode(match);
    if (!isFtermLikeCode(code) || seen.has(code)) {
      continue;
    }
    seen.add(code);
    codes.push(code);
  }

  if (!codes.length) {
    const fallback = normalizeFtermCode(rawText);
    if (isFtermLikeCode(fallback)) {
      codes.push(fallback);
    }
  }

  return codes;
}

function inferTargetMode(rawText, viewMode, selectedTargetMode) {
  if (selectedTargetMode === 'fterm') {
    return 'fterm';
  }

  if (viewMode !== 'lookup') {
    return selectedTargetMode;
  }

  const ftermCodes = findFtermCodes(rawText);
  if (!ftermCodes.length) {
    return selectedTargetMode;
  }

  const hasPatentClassificationHead = /[A-HY]\s*\d\s*\d\s*[A-Z]/i.test(normalizeInputText(rawText));
  return hasPatentClassificationHead ? selectedTargetMode : 'fterm';
}

function extractCodes(rawText, targetMode) {
  if (targetMode === 'fterm') {
    return findFtermCodes(rawText);
  }

  const preparedText = normalizeInputText(rawText)
    .replace(/\r\n?/g, '\n')
    .replace(/[、，,]+(?=\s*[A-HY]\s*\d\s*\d\s*[A-Z])/gi, '\n')
    .replace(/[ \t\u3000]+(?=[A-HY]\s*\d\s*\d\s*[A-Z])/gi, '\n');

  const inlineGap = '[ \\t\\u3000]*';
  const headDigits = `\\d${inlineGap}\\d`;
  const digitSeq = `\\d(?:${inlineGap}\\d)*`;
  const tailSeq = `[0-9A-Z,](?:${inlineGap}[0-9A-Z,])*`;
  const pattern = new RegExp(
    `[A-HY]${inlineGap}${headDigits}${inlineGap}[A-Z](?:${inlineGap}${digitSeq})?(?:${inlineGap}\\/${inlineGap}${tailSeq})?(?:${inlineGap}\\\\)?`,
    'gi'
  );

  const matches = preparedText.match(pattern) || [];
  const codes = [];
  const seen = new Set();

  for (const match of matches) {
    const code = normalizeCode(match).replace(/[・･]/g, '');
    if (!code || seen.has(code)) {
      continue;
    }
    seen.add(code);
    codes.push(code);
  }

  if (!codes.length) {
    const fallback = normalizeCode(rawText).replace(/[・･]/g, '');
    if (fallback) {
      codes.push(fallback);
    }
  }

  return codes;
}

function clearResults() {
  listEl.innerHTML = '';
  metaEl.textContent = '';
}

function setStatus(message, type = 'neutral') {
  statusEl.textContent = message;
  statusEl.dataset.state = type;
}

function getFtermReplacementInfo(code, mode) {
  if (mode !== 'fterm') {
    return null;
  }

  if (!window.FtermLookup || typeof window.FtermLookup.getReplacementInfo !== 'function') {
    return null;
  }

  return window.FtermLookup.getReplacementInfo(code);
}

function formatNotFoundSummary(result) {
  const displayCode = formatCodeForDisplay(result.code);
  if (result.replacementInfo && result.replacementInfo.message) {
    return `${displayCode}: ${result.replacementInfo.message}`;
  }
  return displayCode;
}

function createMatchGroupTitle(title, summary) {
  const header = document.createElement('div');
  header.className = 'match-group-header';

  const titleEl = document.createElement('h3');
  titleEl.textContent = title;

  const summaryEl = document.createElement('p');
  summaryEl.textContent = summary;

  header.append(titleEl, summaryEl);
  return header;
}

function createNotFoundResult(code, mode) {
  return {
    code,
    mode,
    typeLabel: DATASETS[mode].label,
    notFound: true,
    replacementInfo: getFtermReplacementInfo(code, mode),
  };
}

async function lookupCodeInMode(code, mode) {
  const dataset = await loadShard(mode, code);
  const resolvedCode = resolveLookupCode(mode, dataset, code);
  return buildResultModel(mode, dataset, resolvedCode, {
    showThemes: mode === 'fi' || mode === 'fterm',
  });
}

async function lookupCodeGroup(code, mode) {
  try {
    const result = await lookupCodeInMode(code, mode);
    return result ? [result] : [createNotFoundResult(code, mode)];
  } catch (error) {
    console.warn(`Skipped ${mode} lookup:`, error);
    return [createNotFoundResult(code, mode)];
  }
}

async function lookupChildrenForMode(code, mode) {
  try {
    const dataset = await loadShard(mode, code);
    const resolvedCode = resolveLookupCode(mode, dataset, code);
    const source = await buildResultModel(mode, dataset, resolvedCode, {
      showThemes: mode === 'fi' || mode === 'fterm',
    });
    if (!source) {
      return [];
    }

    const children = await Promise.all(
      getChildItems(dataset, resolvedCode).map((item) =>
        buildResultModel(mode, dataset, item.code, {
          showThemes: false,
        })
      )
    );

    return [{ source, children: children.filter(Boolean) }];
  } catch (error) {
    console.warn(`Skipped ${mode} child lookup:`, error);
    return [];
  }
}

function renderLookupResults(inputCodes, groupedResults) {
  const results = groupedResults.flatMap((group) => group.matches);
  const foundCount = results.filter((result) => !result.notFound).length;
  const notFoundCodes = results
    .filter((result) => result.notFound)
    .map(formatNotFoundSummary);

  metaEl.textContent = `${inputCodes.length}コード / ${results.length}件表示`;

  if (!foundCount) {
    setStatus(
      `一致する分類コードが見つかりませんでした。${notFoundCodes.length ? ` 未検出: ${notFoundCodes.join(', ')}` : ''}`,
      'error'
    );
  } else if (notFoundCodes.length) {
    setStatus(`${foundCount}件を表示しています。未検出: ${notFoundCodes.join(', ')}`, 'success');
  } else {
    setStatus(`${results.length}件を表示しています。`, 'success');
  }

  for (const group of groupedResults) {
    const section = document.createElement('section');
    section.className = 'match-group';

    const foundInGroup = group.matches.filter((result) => !result.notFound).length;
    section.appendChild(
      createMatchGroupTitle(
        formatCodeForDisplay(group.inputCode),
        foundInGroup ? `${foundInGroup}件一致` : '一致なし'
      )
    );

    const list = document.createElement('div');
    list.className = 'group-list';

    for (const result of group.matches) {
      list.appendChild(createResultItemNode(template, result, currentOverlayMode));
    }

    section.appendChild(list);
    listEl.appendChild(section);
  }
}

function renderChildrenResults(inputCodes, groupedResults, targetMode) {
  let totalChildren = 0;
  let matchedSources = 0;
  const unresolvedCodes = [];

  for (const group of groupedResults) {
    if (!group.matches.length) {
      unresolvedCodes.push(formatNotFoundSummary(createNotFoundResult(group.inputCode, targetMode)));
      continue;
    }
    matchedSources += group.matches.length;
    totalChildren += group.matches.reduce((sum, match) => sum + match.children.length, 0);
  }

  metaEl.textContent = `${inputCodes.length}コード / ${totalChildren}件表示`;

  if (totalChildren) {
    const suffix = unresolvedCodes.length ? ` 未検出: ${unresolvedCodes.join(', ')}` : '';
    setStatus(`${DATASETS[targetMode].label} で ${matchedSources}件の分類コードについて、1つ下の階層を表示しています。${suffix}`, 'success');
  } else if (matchedSources) {
    setStatus(`${DATASETS[targetMode].label} では一致した分類コードがありますが、1つ下の階層は見つかりませんでした。`, 'error');
  } else {
    setStatus(
      `${DATASETS[targetMode].label} では一致する分類コードが見つかりませんでした。${unresolvedCodes.length ? ` 未検出: ${unresolvedCodes.join(', ')}` : ''}`,
      'error'
    );
  }

  for (const group of groupedResults) {
    const section = document.createElement('section');
    section.className = 'match-group';

    section.appendChild(
      createMatchGroupTitle(
        formatCodeForDisplay(group.inputCode),
        group.matches.length ? `${group.matches.length}件一致` : '一致なし'
      )
    );

    const list = document.createElement('div');
    list.className = 'group-list';

    if (!group.matches.length) {
      list.appendChild(createEmptyNote(`${DATASETS[targetMode].label} では一致する分類コードが見つかりませんでした。`));
      section.appendChild(list);
      listEl.appendChild(section);
      continue;
    }

    for (const match of group.matches) {
      const childGroup = document.createElement('section');
      childGroup.className = 'child-group';

      const heading = document.createElement('div');
      heading.className = 'child-group-header';

      const title = document.createElement('h4');
      title.textContent = `${DATASETS[targetMode].label}: ${formatCodeForDisplay(match.source.code)}`;

      const summary = document.createElement('p');
      summary.textContent = `${match.children.length}件`;

      heading.append(title, summary);
      childGroup.appendChild(heading);
      childGroup.appendChild(createResultItemNode(template, match.source, currentOverlayMode));

      if (!match.children.length) {
        childGroup.appendChild(createEmptyNote('この分類コードの直下には定義済みの分類コードが見つかりませんでした。'));
      } else {
        const childList = document.createElement('div');
        childList.className = 'group-list';
        for (const child of match.children) {
          childList.appendChild(createResultItemNode(template, child, currentOverlayMode));
        }
        childGroup.appendChild(childList);
      }

      list.appendChild(childGroup);
    }

    section.appendChild(list);
    listEl.appendChild(section);
  }
}

function renderResults(inputCodes, groupedResults, viewMode, targetMode) {
  clearResults();
  if (viewMode === 'children') {
    renderChildrenResults(inputCodes, groupedResults, targetMode);
    return;
  }
  renderLookupResults(inputCodes, groupedResults);
}

function getRequestedText() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ipc') || params.get('code') || '';
}

async function runLookup(rawText) {
  try {
    const viewMode = getSelectedViewMode();
    const targetMode = inferTargetMode(rawText, viewMode, getSelectedTargetMode());
    if (targetMode === 'fterm') {
      setSelectedTargetMode('fterm');
    }
    const codes = extractCodes(rawText, targetMode);
    currentOverlayMode = viewMode === 'children' ? 'children' : 'ancestors';
    syncModeFields();

    if (!codes.length) {
      clearResults();
      setStatus('コードを入力してください。', 'error');
      return;
    }

    setStatus(
      viewMode === 'children'
        ? `${DATASETS[targetMode].label} の1つ下の階層を検索中です...`
        : `${DATASETS[targetMode].label} コードを検索中です...`
    );

    const groupedResults = await Promise.all(
      codes.map(async (code) => ({
        inputCode: code,
        matches:
          viewMode === 'children'
            ? await lookupChildrenForMode(code, targetMode)
            : await lookupCodeGroup(code, targetMode),
      }))
    );

    renderResults(codes, groupedResults, viewMode, targetMode);
  } catch (error) {
    console.error(error);
    setStatus(`検索処理でエラーが発生しました: ${error.message || String(error)}`, 'error');
  }
}

function scheduleLookup(rawText) {
  window.clearTimeout(lookupTimer);
  lookupTimer = window.setTimeout(() => {
    runLookup(rawText);
  }, 350);
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  window.clearTimeout(lookupTimer);
  await runLookup(inputEl.value);
});

inputEl.addEventListener('input', () => {
  scheduleLookup(inputEl.value);
});

for (const modeInput of modeInputs) {
  modeInput.addEventListener('change', () => {
    syncModeFields();
    window.clearTimeout(lookupTimer);
    runLookup(inputEl.value);
  });
}

for (const targetInput of targetInputs) {
  targetInput.addEventListener('change', () => {
    window.clearTimeout(lookupTimer);
    runLookup(inputEl.value);
  });
}

for (const button of quickButtons) {
  button.addEventListener('click', async () => {
    if (isFtermLikeCode(button.dataset.code || '')) {
      setSelectedTargetMode('fterm');
    }
    inputEl.value = button.dataset.code;
    window.clearTimeout(lookupTimer);
    await runLookup(inputEl.value);
  });
}

syncModeFields();

const requestedText = getRequestedText();
if (requestedText) {
  if (isFtermLikeCode(requestedText)) {
    setSelectedTargetMode('fterm');
  }
  inputEl.value = requestedText;
  runLookup(requestedText);
} else {
  inputEl.value = 'H04N1/029';
}
