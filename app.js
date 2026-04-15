const statusEl = document.querySelector('#status');
const formEl = document.querySelector('#lookup-form');
const inputEl = document.querySelector('#ipc-input');
const listEl = document.querySelector('#result-list');
const metaEl = document.querySelector('#result-meta');
const template = document.querySelector('#result-item-template');
const quickButtons = document.querySelectorAll('[data-code]');
const modeInputs = document.querySelectorAll('input[name="lookup-mode"]');
const childTargetInputs = document.querySelectorAll('input[name="children-target"]');
const childTargetField = document.querySelector('#children-target-field');

const DATASETS = {
  ipc: { dir: './data', prefix: 'ipc-shard', label: 'IPC' },
  fi: { dir: './data', prefix: 'fi-shard', label: 'FI' },
  cpc: { dir: './data', prefix: 'cpc-shard', label: 'CPC' },
};

const dataCache = {
  ipc: {},
  fi: {},
  cpc: {},
};

let lookupTimer = null;
let currentOverlayMode = 'ancestors';

function normalizeInputText(value) {
  return (value || '').normalize('NFKC');
}

function normalizeCode(value) {
  return normalizeInputText(value).toUpperCase().replace(/\s+/g, '');
}

function formatCodeForDisplay(code) {
  return code.replace(/\\$/, '');
}

function getSelectedViewMode() {
  const checked = Array.from(modeInputs).find((input) => input.checked);
  return checked ? checked.value : 'lookup';
}

function getSelectedChildTarget() {
  const checked = Array.from(childTargetInputs).find((input) => input.checked);
  return checked ? checked.value : 'ipc';
}

function syncModeFields() {
  childTargetField.hidden = false;
}

function getShardKey(code) {
  if (/^[A-HY]\d{2}[A-Z]/.test(code)) return code.slice(0, 4);
  if (/^[A-HY]\d{2}/.test(code)) return code.slice(0, 1);
  if (/^[A-HY]/.test(code)) return code.slice(0, 1);
  return 'misc';
}

function extractCodes(rawText) {
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
    const code = normalizeCode(match).replace(/[、，,]/g, '');
    if (!code || seen.has(code)) continue;
    seen.add(code);
    codes.push(code);
  }

  if (!codes.length) {
    const fallback = normalizeCode(rawText).replace(/[、，,]/g, '');
    if (fallback) {
      codes.push(fallback);
    }
  }

  return codes;
}

function extractCodes(rawText) {
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
    const code = normalizeCode(match).replace(/[、，,]/g, '');
    if (!code || seen.has(code)) continue;
    seen.add(code);
    codes.push(code);
  }

  if (!codes.length) {
    const fallback = normalizeCode(rawText).replace(/[、，,]/g, '');
    if (fallback) {
      codes.push(fallback);
    }
  }

  return codes;
}

function formatHierarchyInfo(depth) {
  if (depth <= 0) return '';
  return '・'.repeat(depth);
}

function clearResults() {
  listEl.innerHTML = '';
  metaEl.textContent = '';
}

function setStatus(message, type = 'neutral') {
  statusEl.textContent = message;
  statusEl.dataset.state = type;
}

function resolveLookupCode(mode, dataset, code) {
  if (dataset.entries[code]) {
    return code;
  }

  if (mode === 'fi') {
    const anchorCode = `${code}\\`;
    if (dataset.entries[anchorCode]) {
      return anchorCode;
    }
  }

  return code;
}

function getDepth(mode, dataset, code) {
  let depth = 0;
  let current = dataset.entries[code];

  while (current && current.parent) {
    depth += 1;
    current = dataset.entries[current.parent] || null;
    if (mode === 'ipc' && current && current.level === 0) {
      break;
    }
  }

  return depth;
}

function getAncestorItems(mode, dataset, code) {
  const items = [];
  let current = dataset.entries[code];

  while (current && current.parent) {
    const parent = dataset.entries[current.parent] || null;
    if (!parent) break;
    items.unshift(parent);
    current = parent;
    if (mode === 'ipc' && current.level === 0) {
      break;
    }
  }

  return items;
}

function getChildItems(dataset, code) {
  return Object.values(dataset.entries)
    .filter((item) => item.parent === code)
    .sort((left, right) => {
      const levelDiff = (left.level || 0) - (right.level || 0);
      if (levelDiff !== 0) {
        return levelDiff;
      }
      return left.code.localeCompare(right.code, 'en');
    });
}

function buildChildOverlayText(result) {
  if (result.notFound || !result.dataset) {
    return '';
  }

  const children = getChildItems(result.dataset, result.code);
  if (!children.length) {
    return '1つ下の階層はありません。';
  }

  return children
    .map((item) => {
      const absoluteDepth = getDepth(result.mode, result.dataset, item.code);
      return formatOverlayLine(item, absoluteDepth > 0 ? '・'.repeat(absoluteDepth) : '');
    })
    .join('\n');
}

function formatOverlayLine(item, hierarchy = '') {
  const parts = [formatCodeForDisplay(item.code)];
  if (hierarchy) {
    parts.unshift(hierarchy);
  }
  if (item.ja) {
    parts.push(item.ja);
  } else if (item.en) {
    parts.push(item.en);
  }
  return parts.join(' : ');
}

function buildOverlayText(result) {
  if (result.notFound || !result.dataset) {
    return '';
  }

  if (currentOverlayMode === 'children') {
    return buildChildOverlayText(result);
  }

  const ancestors = getAncestorItems(result.mode, result.dataset, result.code);
  const lines = [];

  for (const [index, item] of ancestors.entries()) {
    const hierarchy = index === 0 ? '' : '・'.repeat(index);
    lines.push(formatOverlayLine(item, hierarchy));
  }

  lines.push(formatOverlayLine(result.item, result.depth > 0 ? '・'.repeat(result.depth) : ''));
  return lines.join('\n');
}

function openDetailWindow(result) {
  const params = new URLSearchParams({
    code: result.code,
    mode: result.mode,
    overlay: currentOverlayMode,
  });
  window.open(`./detail.html?${params.toString()}`, '_blank', 'noopener');
}

function bindDetailTrigger(element, result) {
  element.tabIndex = 0;
  element.setAttribute('role', 'button');
  element.setAttribute('aria-label', `${formatCodeForDisplay(result.code)} の上位階層を別ウィンドウで開く`);
  element.addEventListener('click', () => {
    openDetailWindow(result);
  });
  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    openDetailWindow(result);
  });
}

function createResultItem(result) {
  const node = template.content.firstElementChild.cloneNode(true);
  const codeWrap = node.querySelector('.code-wrap');
  const codeEl = node.querySelector('.code');
  const typeTag = node.querySelector('.tag.type');
  const hierarchyTag = node.querySelector('.tag.hierarchy');
  const jaPane = node.querySelector('.definition-pane-ja');
  const enPane = node.querySelector('.definition-pane-en');
  const jaEl = node.querySelector('.definition.ja');
  const enEl = node.querySelector('.definition.en');
  const themeBlock = node.querySelector('.theme-block');
  const themeList = node.querySelector('.theme-list');

  codeEl.textContent = formatCodeForDisplay(result.code);
  typeTag.textContent = result.typeLabel;

  if (result.notFound) {
    hierarchyTag.textContent = '未検出';
    jaEl.textContent = '一致する分類コードが見つかりませんでした。';
    enEl.textContent = '';
    enPane.hidden = true;
    node.classList.add('result-item-missing');
    return node;
  }

  hierarchyTag.textContent = formatHierarchyInfo(result.depth);
  hierarchyTag.hidden = !hierarchyTag.textContent;
  jaEl.textContent = result.item.ja || '';
  enEl.textContent = result.item.en || '';

  const overlayText = buildOverlayText(result);
  if (overlayText) {
    codeWrap.title = overlayText;
  }

  bindDetailTrigger(codeWrap, result);

  if (result.mode === 'fi') {
    enPane.hidden = true;
  } else if (result.mode === 'ipc') {
    enPane.hidden = true;
    if (!result.item.ja) {
      jaPane.hidden = true;
    }
  } else {
    node.classList.add('result-item-cpc');
    jaPane.hidden = false;
    enPane.hidden = false;
  }

  if (!result.item.ja) {
    jaPane.classList.add('is-empty');
    if (result.mode !== 'cpc') {
      jaPane.hidden = true;
    }
  } else {
    jaPane.classList.remove('is-empty');
  }

  if (!result.item.en) {
    enPane.classList.add('is-empty');
    if (result.mode !== 'cpc') {
      enPane.hidden = true;
    }
  } else {
    enPane.classList.remove('is-empty');
  }

  populateThemeBlock(themeBlock, themeList, result);

  return node;
}

function createEmptyNote(message) {
  const note = document.createElement('p');
  note.className = 'empty-note';
  note.textContent = message;
  return note;
}

function createThemeItem(theme) {
  const item = document.createElement('article');
  item.className = 'theme-item';

  const codeEl = document.createElement('p');
  codeEl.className = 'theme-code';
  codeEl.textContent = `${theme.themeCode}${theme.type ? ` / ${theme.type}` : ''}`;

  const nameEl = document.createElement('p');
  nameEl.className = 'theme-name';
  nameEl.textContent = theme.name || '';

  item.append(codeEl, nameEl);

  if (theme.themeCode) {
    const linkEl = document.createElement('a');
    linkEl.className = 'theme-link';
    linkEl.href = `https://www.j-platpat.inpit.go.jp/cache/classify/patent/PMGS_HTML/jpp/F_TERM/ja/fTermList/fTermList${theme.themeCode}.html`;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener noreferrer';
    linkEl.textContent = 'Fタームリストを開く';
    item.appendChild(linkEl);
  }

  if (theme.coverage) {
    const coverageEl = document.createElement('p');
    coverageEl.className = 'theme-coverage';
    coverageEl.textContent = theme.coverage;
    item.appendChild(coverageEl);
  }

  return item;
}

function populateThemeBlock(themeBlock, themeList, result) {
  if (!themeBlock || !themeList) {
    return;
  }

  if (result.mode !== 'fi' || !result.showThemes) {
    themeBlock.hidden = true;
    return;
  }

  themeBlock.hidden = false;
  themeList.innerHTML = '';

  const themes = result.themes || [];
  if (!themes.length) {
    themeList.appendChild(createEmptyNote('対応するテーマコードは見つかりませんでした。'));
    return;
  }

  for (const theme of themes) {
    themeList.appendChild(createThemeItem(theme));
  }
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

function renderLookupResults(inputCodes, groupedResults) {
  const results = groupedResults.flatMap((group) => group.matches);
  if (!results.length) {
    setStatus('一致するコードが見つかりませんでした。', 'error');
    return;
  }

  const foundCount = results.filter((result) => !result.notFound).length;
  const notFoundCodes = results
    .filter((result) => result.notFound)
    .map((result) => formatCodeForDisplay(result.code));

  metaEl.textContent = `${inputCodes.length} コード / ${results.length} 件表示`;

  if (notFoundCodes.length) {
    setStatus(
      `${foundCount} 件を表示しています。未検出: ${notFoundCodes.join(', ')}`,
      foundCount ? 'success' : 'error'
    );
  } else {
    setStatus(`${results.length} 件を表示しています。`, 'success');
  }

  for (const group of groupedResults) {
    const section = document.createElement('section');
    section.className = 'match-group';
    const foundInGroup = group.matches.filter((result) => !result.notFound).length;
    section.append(
      createMatchGroupTitle(
        formatCodeForDisplay(group.inputCode),
        foundInGroup ? `${foundInGroup} 件一致` : '一致なし'
      )
    );

    const list = document.createElement('div');
    list.className = 'group-list';

    if (!group.matches.length) {
      list.append(createEmptyNote('一致する分類コードが見つかりませんでした。'));
    } else {
      for (const result of group.matches) {
        list.appendChild(createResultItem(result));
      }
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
      unresolvedCodes.push(formatCodeForDisplay(group.inputCode));
      continue;
    }
    matchedSources += group.matches.length;
    totalChildren += group.matches.reduce((sum, match) => sum + match.children.length, 0);
  }

  metaEl.textContent = `${inputCodes.length} コード / ${totalChildren} 件表示`;

  if (totalChildren) {
    const suffix = unresolvedCodes.length ? ` 未検出: ${unresolvedCodes.join(', ')}` : '';
    setStatus(`${DATASETS[targetMode].label} で ${matchedSources} 件の分類コードについて、1つ下の階層を表示しています。${suffix}`, 'success');
  } else if (matchedSources) {
    setStatus(`${DATASETS[targetMode].label} では一致した分類コードがありますが、1つ下の階層は見つかりませんでした。`, 'error');
  } else {
    setStatus(`${DATASETS[targetMode].label} では一致する分類コードが見つかりませんでした。未検出: ${unresolvedCodes.join(', ')}`, 'error');
  }

  for (const group of groupedResults) {
    const section = document.createElement('section');
    section.className = 'match-group';
    section.append(
      createMatchGroupTitle(
        formatCodeForDisplay(group.inputCode),
        group.matches.length ? `${group.matches.length} 件一致` : '一致なし'
      )
    );

    const list = document.createElement('div');
    list.className = 'group-list';

    if (!group.matches.length) {
      list.append(createEmptyNote(`${DATASETS[targetMode].label} では一致する分類コードが見つかりませんでした。`));
    } else {
      for (const match of group.matches) {
        list.appendChild(createResultItem(match.source));

        const childGroup = document.createElement('section');
        childGroup.className = 'child-group';

        const heading = document.createElement('div');
        heading.className = 'child-group-header';

        const title = document.createElement('h4');
        title.textContent = '1つ下の階層';

        const summary = document.createElement('p');
        summary.textContent = match.children.length
          ? `${match.children.length} 件`
          : '1つ下の階層はありません';

        heading.append(title, summary);
        childGroup.appendChild(heading);

        if (!match.children.length) {
          childGroup.append(createEmptyNote('この分類コードの直下には定義済みの分類コードが見つかりませんでした。'));
        } else {
          const childList = document.createElement('div');
          childList.className = 'group-list';
          for (const child of match.children) {
            childList.appendChild(createResultItem(child));
          }
          childGroup.appendChild(childList);
        }

        list.appendChild(childGroup);
      }
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

async function loadShard(mode, code) {
  const shardKey = getShardKey(code);
  if (dataCache[mode][shardKey]) {
    return dataCache[mode][shardKey];
  }

  const basePath = `${DATASETS[mode].dir}/${DATASETS[mode].prefix}-${shardKey}`;

  try {
    const response = await fetch(`${basePath}.json`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      dataCache[mode][shardKey] = payload;
      return payload;
    }
    if (window.location.protocol !== 'file:') {
      throw new Error(`Failed to load ${basePath}.json`);
    }
  } catch (error) {
    if (window.location.protocol !== 'file:') {
      throw error;
    }
  }

  const windowKey = `${DATASETS[mode].prefix}-${shardKey}`.replace(/-/g, '_').toUpperCase();
  const existing = window[windowKey];
  if (existing) {
    dataCache[mode][shardKey] = existing;
    return existing;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${basePath}.js`;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${basePath}.js`));
    document.body.appendChild(script);
  });

  const loaded = window[windowKey];
  if (!loaded) {
    throw new Error(`${windowKey} is not available`);
  }

  dataCache[mode][shardKey] = loaded;
  return loaded;
}

function getCandidateModes(code) {
  if (code.includes('\\') || /\/.*[A-Z]$/i.test(code) || /[A-Z]$/.test(code)) {
    return ['fi', 'ipc', 'cpc'];
  }

  return ['ipc', 'cpc', 'fi'];
}

async function lookupCode(code) {
  const results = [];

  try {
    const ipcDataset = await loadShard('ipc', code);
    const resolvedIpcCode = resolveLookupCode('ipc', ipcDataset, code);

    if (ipcDataset.entries[resolvedIpcCode]) {
      results.push({
        code: resolvedIpcCode,
        mode: 'ipc',
        typeLabel: DATASETS.ipc.label,
        depth: getDepth('ipc', ipcDataset, resolvedIpcCode),
        item: ipcDataset.entries[resolvedIpcCode],
        dataset: ipcDataset,
      });
      return results;
    }
  } catch (error) {
    console.warn('Skipped IPC lookup:', error);
  }

  for (const mode of getCandidateModes(code)) {
    if (mode === 'ipc') {
      continue;
    }

    try {
      const dataset = await loadShard(mode, code);
      const resolvedCode = resolveLookupCode(mode, dataset, code);
      if (!dataset.entries[resolvedCode]) {
        continue;
      }

      const themes =
        mode === 'fi' && typeof window.findThemeMatchesForFi === 'function'
          ? await window.findThemeMatchesForFi(dataset, resolvedCode)
          : [];

      results.push({
        code: resolvedCode,
        mode,
        typeLabel: DATASETS[mode].label,
        depth: getDepth(mode, dataset, resolvedCode),
        item: dataset.entries[resolvedCode],
        dataset,
        themes,
        showThemes: mode === 'fi',
      });
    } catch (error) {
      console.warn(`Skipped ${mode} lookup:`, error);
    }
  }

  return results;
}

async function lookupPreferredMode(code, preferredMode) {
  if (!preferredMode || !DATASETS[preferredMode]) {
    return null;
  }

  try {
    const dataset = await loadShard(preferredMode, code);
    const resolvedCode = resolveLookupCode(preferredMode, dataset, code);
    if (!dataset.entries[resolvedCode]) {
      return null;
    }

    return {
      code: resolvedCode,
      mode: preferredMode,
      typeLabel: DATASETS[preferredMode].label,
      depth: getDepth(preferredMode, dataset, resolvedCode),
      item: dataset.entries[resolvedCode],
      dataset,
      themes:
        preferredMode === 'fi' && typeof window.findThemeMatchesForFi === 'function'
          ? await window.findThemeMatchesForFi(dataset, resolvedCode)
          : [],
      showThemes: preferredMode === 'fi',
    };
  } catch (error) {
    console.warn(`Skipped preferred ${preferredMode} lookup:`, error);
    return null;
  }
}

async function lookupCodeWithPreference(code, preferredMode) {
  if (!preferredMode || !DATASETS[preferredMode]) {
    return lookupCode(code);
  }

  const preferredResult = await lookupPreferredMode(code, preferredMode);
  if (preferredResult) {
    return [preferredResult];
  }

  return [];
}

async function lookupChildrenForMode(code, targetMode) {
  try {
    const dataset = await loadShard(targetMode, code);
    const resolvedCode = resolveLookupCode(targetMode, dataset, code);
    const sourceItem = dataset.entries[resolvedCode];
    if (!sourceItem) {
      return [];
    }

    const source = {
      code: resolvedCode,
      mode: targetMode,
      typeLabel: DATASETS[targetMode].label,
      depth: getDepth(targetMode, dataset, resolvedCode),
      item: sourceItem,
      dataset,
      themes:
        targetMode === 'fi' && typeof window.findThemeMatchesForFi === 'function'
          ? await window.findThemeMatchesForFi(dataset, resolvedCode)
          : [],
      showThemes: targetMode === 'fi',
    };

    const children = [];
    for (const item of getChildItems(dataset, resolvedCode)) {
      children.push({
        code: item.code,
        mode: targetMode,
        typeLabel: DATASETS[targetMode].label,
        depth: getDepth(targetMode, dataset, item.code),
        item,
        dataset,
        themes: [],
        showThemes: false,
      });
    }

    return [{ source, children }];
  } catch (error) {
    console.warn(`Skipped ${targetMode} child lookup:`, error);
    return [];
  }
}

function getRequestedText() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ipc') || params.get('code') || '';
}

async function runLookup(rawText) {
  try {
    const codes = extractCodes(rawText);
    const viewMode = getSelectedViewMode();
    const childTarget = getSelectedChildTarget();
    currentOverlayMode = viewMode === 'children' ? 'children' : 'ancestors';
    syncModeFields();

    if (!codes.length) {
      clearResults();
      setStatus('コードを入力してください。', 'error');
      return;
    }

    setStatus(
      viewMode === 'children'
        ? `${DATASETS[childTarget].label} の1つ下の階層を検索中です...`
        : 'データを読み込み中です...'
    );

    const groupedResults = await Promise.all(
      codes.map(async (code) => ({
        inputCode: code,
        matches:
          viewMode === 'children'
            ? await lookupChildrenForMode(code, childTarget)
            : await lookupCodeWithPreference(code, childTarget),
      }))
    );

    renderResults(codes, groupedResults, viewMode, childTarget);
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

for (const targetInput of childTargetInputs) {
  targetInput.addEventListener('change', () => {
    window.clearTimeout(lookupTimer);
    runLookup(inputEl.value);
  });
}

for (const button of quickButtons) {
  button.addEventListener('click', async () => {
    inputEl.value = button.dataset.code;
    window.clearTimeout(lookupTimer);
    await runLookup(inputEl.value);
  });
}

syncModeFields();

const requestedText = getRequestedText();
if (requestedText) {
  inputEl.value = requestedText;
  runLookup(requestedText);
} else {
  inputEl.value = 'H04N1/029';
}
