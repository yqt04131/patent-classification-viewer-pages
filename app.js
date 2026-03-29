const statusEl = document.querySelector('#status');
const formEl = document.querySelector('#lookup-form');
const inputEl = document.querySelector('#ipc-input');
const listEl = document.querySelector('#result-list');
const metaEl = document.querySelector('#result-meta');
const template = document.querySelector('#result-item-template');
const quickButtons = document.querySelectorAll('[data-code]');

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

function normalizeCode(value) {
  return (value || '').toUpperCase().replace(/\s+/g, '');
}

function formatCodeForDisplay(code) {
  return code.replace(/\\$/, '');
}

function getShardKey(code) {
  if (/^[A-HY]\d{2}[A-Z]/.test(code)) return code.slice(0, 4);
  if (/^[A-HY]\d{2}/.test(code)) return code.slice(0, 1);
  if (/^[A-HY]/.test(code)) return code.slice(0, 1);
  return 'misc';
}

function extractCodes(rawText) {
  const preparedText = (rawText || '')
    .replace(/\r\n?/g, '\n')
    .replace(/[、，,]+(?=\s*[A-HY]\s*\d{2}\s*[A-Z])/gi, '\n')
    .replace(/[ \t\u3000]+(?=[A-HY]\s*\d{2}\s*[A-Z])/gi, '\n');

  const inlineGap = '[ \\t\\u3000]*';
  const pattern = new RegExp(
    `[A-HY]${inlineGap}\\d{2}${inlineGap}[A-Z](?:${inlineGap}\\d+)?(?:${inlineGap}\\/${inlineGap}[0-9A-Z,]+(?:${inlineGap}[0-9A-Z,]+)*)?(?:${inlineGap}\\\\)?`,
    'gi'
  );
  const matches = preparedText.match(pattern) || [];
  const codes = [];
  const seen = new Set();

  for (const match of matches) {
    const code = normalizeCode(match).replace(/[、，,]/g, '');
    if (!code || seen.has(code)) {
      continue;
    }
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

  return node;
}

function renderResults(inputCodes, results) {
  clearResults();

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

  for (const result of results) {
    listEl.appendChild(createResultItem(result));
  }
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

      results.push({
        code: resolvedCode,
        mode,
        typeLabel: DATASETS[mode].label,
        depth: getDepth(mode, dataset, resolvedCode),
        item: dataset.entries[resolvedCode],
        dataset,
      });
    } catch (error) {
      console.warn(`Skipped ${mode} lookup:`, error);
    }
  }

  if (!results.length) {
    return [
      {
        code,
        notFound: true,
        typeLabel: '未検出',
      },
    ];
  }

  return results;
}

function getRequestedText() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ipc') || params.get('code') || '';
}

async function runLookup(rawText) {
  try {
    const codes = extractCodes(rawText);
    if (!codes.length) {
      clearResults();
      setStatus('コードを入力してください。', 'error');
      return;
    }

    setStatus('データを読み込み中です...');
    const groupedResults = await Promise.all(codes.map((code) => lookupCode(code)));
    renderResults(codes, groupedResults.flat());
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

for (const button of quickButtons) {
  button.addEventListener('click', async () => {
    inputEl.value = button.dataset.code;
    window.clearTimeout(lookupTimer);
    await runLookup(inputEl.value);
  });
}

const requestedText = getRequestedText();
if (requestedText) {
  inputEl.value = requestedText;
  runLookup(requestedText);
} else {
  inputEl.value = 'H04N1/029';
}
