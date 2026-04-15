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

const {
  DATASETS,
  loadShard,
  formatCodeForDisplay,
  formatHierarchyInfo,
  resolveLookupCode,
  getDepth,
  getAncestorItems,
  getChildItems,
  formatOverlayLine,
  createEmptyNote,
  populateThemeBlock,
} = window.ClassificationShared;
let lookupTimer = null;
let currentOverlayMode = 'ancestors';

function normalizeInputText(value) {
  return (value || '').normalize('NFKC');
}

function normalizeCode(value) {
  return normalizeInputText(value).toUpperCase().replace(/\s+/g, '');
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
function extractCodes(rawText) {
  const preparedText = normalizeInputText(rawText)
    .replace(/\r\n?/g, '\n')
    .replace(/[縲・ｼ・]+(?=\s*[A-HY]\s*\d\s*\d\s*[A-Z])/gi, '\n')
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
    const code = normalizeCode(match).replace(/[縲・ｼ・]/g, '');
    if (!code || seen.has(code)) continue;
    seen.add(code);
    codes.push(code);
  }

  if (!codes.length) {
    const fallback = normalizeCode(rawText).replace(/[縲・ｼ・]/g, '');
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
function buildChildOverlayText(result) {
  if (result.notFound || !result.dataset) {
    return '';
  }

  const children = getChildItems(result.dataset, result.code);
  if (!children.length) {
    return '1縺､荳九・髫主ｱ､縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・;
  }

  return children
    .map((item) => {
      const absoluteDepth = getDepth(result.mode, result.dataset, item.code);
      return formatOverlayLine(item, absoluteDepth > 0 ? '繝ｻ'.repeat(absoluteDepth) : '');
    })
    .join('\n');
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
    const hierarchy = index === 0 ? '' : '繝ｻ'.repeat(index);
    lines.push(formatOverlayLine(item, hierarchy));
  }

  lines.push(formatOverlayLine(result.item, result.depth > 0 ? '繝ｻ'.repeat(result.depth) : ''));
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
  element.setAttribute('aria-label', `${formatCodeForDisplay(result.code)} 縺ｮ荳贋ｽ埼嚴螻､繧貞挨繧ｦ繧｣繝ｳ繝峨え縺ｧ髢九￥`);
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
    hierarchyTag.textContent = '譛ｪ讀懷・';
    jaEl.textContent = '荳閾ｴ縺吶ｋ蛻・｡槭さ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲・;
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

  populateThemeBlock(themeBlock, themeList, result.mode, result.themes || [], result.showThemes !== false);

  return node;
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
    setStatus('荳閾ｴ縺吶ｋ繧ｳ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲・, 'error');
    return;
  }

  const foundCount = results.filter((result) => !result.notFound).length;
  const notFoundCodes = results
    .filter((result) => result.notFound)
    .map((result) => formatCodeForDisplay(result.code));

  metaEl.textContent = `${inputCodes.length} 繧ｳ繝ｼ繝・/ ${results.length} 莉ｶ陦ｨ遉ｺ`;

  if (notFoundCodes.length) {
    setStatus(
      `${foundCount} 莉ｶ繧定｡ｨ遉ｺ縺励※縺・∪縺吶よ悴讀懷・: ${notFoundCodes.join(', ')}`,
      foundCount ? 'success' : 'error'
    );
  } else {
    setStatus(`${results.length} 莉ｶ繧定｡ｨ遉ｺ縺励※縺・∪縺吶Ａ, 'success');
  }

  for (const group of groupedResults) {
    const section = document.createElement('section');
    section.className = 'match-group';
    const foundInGroup = group.matches.filter((result) => !result.notFound).length;
    section.append(
      createMatchGroupTitle(
        formatCodeForDisplay(group.inputCode),
        foundInGroup ? `${foundInGroup} 莉ｶ荳閾ｴ` : '荳閾ｴ縺ｪ縺・
      )
    );

    const list = document.createElement('div');
    list.className = 'group-list';

    if (!group.matches.length) {
      list.append(createEmptyNote('荳閾ｴ縺吶ｋ蛻・｡槭さ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲・));
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

  metaEl.textContent = `${inputCodes.length} 繧ｳ繝ｼ繝・/ ${totalChildren} 莉ｶ陦ｨ遉ｺ`;

  if (totalChildren) {
    const suffix = unresolvedCodes.length ? ` 譛ｪ讀懷・: ${unresolvedCodes.join(', ')}` : '';
    setStatus(`${DATASETS[targetMode].label} 縺ｧ ${matchedSources} 莉ｶ縺ｮ蛻・｡槭さ繝ｼ繝峨↓縺､縺・※縲・縺､荳九・髫主ｱ､繧定｡ｨ遉ｺ縺励※縺・∪縺吶・{suffix}`, 'success');
  } else if (matchedSources) {
    setStatus(`${DATASETS[targetMode].label} 縺ｧ縺ｯ荳閾ｴ縺励◆蛻・｡槭さ繝ｼ繝峨′縺ゅｊ縺ｾ縺吶′縲・縺､荳九・髫主ｱ､縺ｯ隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲Ａ, 'error');
  } else {
    setStatus(`${DATASETS[targetMode].label} 縺ｧ縺ｯ荳閾ｴ縺吶ｋ蛻・｡槭さ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲よ悴讀懷・: ${unresolvedCodes.join(', ')}`, 'error');
  }

  for (const group of groupedResults) {
    const section = document.createElement('section');
    section.className = 'match-group';
    section.append(
      createMatchGroupTitle(
        formatCodeForDisplay(group.inputCode),
        group.matches.length ? `${group.matches.length} 莉ｶ荳閾ｴ` : '荳閾ｴ縺ｪ縺・
      )
    );

    const list = document.createElement('div');
    list.className = 'group-list';

    if (!group.matches.length) {
      list.append(createEmptyNote(`${DATASETS[targetMode].label} 縺ｧ縺ｯ荳閾ｴ縺吶ｋ蛻・｡槭さ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲Ａ));
    } else {
      for (const match of group.matches) {
        list.appendChild(createResultItem(match.source));

        const childGroup = document.createElement('section');
        childGroup.className = 'child-group';

        const heading = document.createElement('div');
        heading.className = 'child-group-header';

        const title = document.createElement('h4');
        title.textContent = '1縺､荳九・髫主ｱ､';

        const summary = document.createElement('p');
        summary.textContent = match.children.length
          ? `${match.children.length} 莉ｶ`
          : '1縺､荳九・髫主ｱ､縺ｯ縺ゅｊ縺ｾ縺帙ｓ';

        heading.append(title, summary);
        childGroup.appendChild(heading);

        if (!match.children.length) {
          childGroup.append(createEmptyNote('縺薙・蛻・｡槭さ繝ｼ繝峨・逶ｴ荳九↓縺ｯ螳夂ｾｩ貂医∩縺ｮ蛻・｡槭さ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲・));
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
      setStatus('繧ｳ繝ｼ繝峨ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞縲・, 'error');
      return;
    }

    setStatus(
      viewMode === 'children'
        ? `${DATASETS[childTarget].label} 縺ｮ1縺､荳九・髫主ｱ､繧呈､懃ｴ｢荳ｭ縺ｧ縺・..`
        : '繝・・繧ｿ繧定ｪｭ縺ｿ霎ｼ縺ｿ荳ｭ縺ｧ縺・..'
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
    setStatus(`讀懃ｴ｢蜃ｦ逅・〒繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆: ${error.message || String(error)}`, 'error');
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
