const statusEl = document.querySelector('#status');
const listEl = document.querySelector('#result-list');
const metaEl = document.querySelector('#result-meta');
const template = document.querySelector('#result-item-template');
const pageTitleEl = document.querySelector('#detail-page-title');
const pageLeadEl = document.querySelector('#detail-page-lead');
const sectionTitleEl = document.querySelector('#detail-section-title');

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

let currentDataset = null;
let overlayMode = 'ancestors';

function formatCodeForDisplay(code) {
  return code.replace(/\\$/, '');
}

function getShardKey(code) {
  if (/^[A-HY]\d{2}[A-Z]/.test(code)) return code.slice(0, 4);
  if (/^[A-HY]\d{2}/.test(code)) return code.slice(0, 1);
  if (/^[A-HY]/.test(code)) return code.slice(0, 1);
  return 'misc';
}

function formatHierarchyInfo(depth) {
  if (depth <= 0) return '';
  return '・'.repeat(depth);
}

function setStatus(message, type = 'neutral') {
  statusEl.textContent = message;
  statusEl.dataset.state = type;
}

function syncPageCopy() {
  if (overlayMode === 'children') {
    pageTitleEl.textContent = '下位階層情報を確認する';
    pageLeadEl.textContent = '選択した分類コードについて、1つ下の階層を一覧表示します。';
    sectionTitleEl.textContent = '下位階層';
    return;
  }

  pageTitleEl.textContent = '上位階層情報を確認する';
  pageLeadEl.textContent = '選択した分類コードについて、上位階層をルートまで表示します。';
  sectionTitleEl.textContent = '上位階層';
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

function getLineage(mode, dataset, code) {
  const lineage = [];
  let current = dataset.entries[code];

  while (current) {
    lineage.push(current);
    if (mode === 'ipc' && current.level === 0) {
      break;
    }
    current = current.parent ? dataset.entries[current.parent] : null;
  }

  return lineage.reverse();
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

function buildOverlayText(mode, dataset, code) {
  const currentItem = dataset.entries[code];
  if (!currentItem) {
    return '';
  }

  if (overlayMode === 'children') {
    const children = getChildItems(dataset, code);
    if (!children.length) {
      return '1つ下の階層はありません。';
    }
    return children
      .map((item) => {
        const absoluteDepth = getDepth(mode, dataset, item.code);
        return formatOverlayLine(item, absoluteDepth > 0 ? '・'.repeat(absoluteDepth) : '');
      })
      .join('\n');
  }

  const ancestors = getAncestorItems(mode, dataset, code);
  const lines = [];

  for (const [index, item] of ancestors.entries()) {
    const hierarchy = index === 0 ? '' : '・'.repeat(index);
    lines.push(formatOverlayLine(item, hierarchy));
  }

  const currentDepth = ancestors.length;
  lines.push(formatOverlayLine(currentItem, currentDepth > 0 ? '・'.repeat(currentDepth) : ''));

  return lines.join('\n');
}

function openDetailWindow(mode, code) {
  const params = new URLSearchParams({
    code,
    mode,
    overlay: overlayMode,
  });
  window.open(`./detail.html?${params.toString()}`, '_blank', 'noopener');
}

function bindDetailTrigger(element, mode, code) {
  element.tabIndex = 0;
  element.setAttribute('role', 'button');
  element.setAttribute('aria-label', `${formatCodeForDisplay(code)} の詳細を別ウィンドウで開く`);
  element.addEventListener('click', () => {
    openDetailWindow(mode, code);
  });
  element.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    openDetailWindow(mode, code);
  });
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

function createResultItem(mode, item, index) {
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

  codeEl.textContent = formatCodeForDisplay(item.code);
  typeTag.textContent = DATASETS[mode].label;
  hierarchyTag.textContent = formatHierarchyInfo(index);
  hierarchyTag.hidden = !hierarchyTag.textContent;
  jaEl.textContent = item.ja || '';
  enEl.textContent = item.en || '';

  const overlayText = buildOverlayText(mode, currentDataset, item.code);
  if (overlayText) {
    codeWrap.title = overlayText;
  }
  bindDetailTrigger(codeWrap, mode, item.code);

  if (mode === 'fi') {
    enPane.hidden = true;
  } else if (mode === 'ipc') {
    enPane.hidden = true;
    if (!item.ja) {
      jaPane.hidden = true;
    }
  } else {
    node.classList.add('result-item-cpc');
  }

  if (!item.ja) {
    jaPane.classList.add('is-empty');
    if (mode !== 'cpc') {
      jaPane.hidden = true;
    }
  } else {
    jaPane.classList.remove('is-empty');
  }

  if (!item.en) {
    enPane.classList.add('is-empty');
    if (mode !== 'cpc') {
      enPane.hidden = true;
    }
  } else {
    enPane.classList.remove('is-empty');
  }

  populateThemeBlock(themeBlock, themeList, mode, item.themes || [], item.showThemes !== false);

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

function populateThemeBlock(themeBlock, themeList, mode, themes, showThemes = true) {
  if (!themeBlock || !themeList) {
    return;
  }

  if (mode !== 'fi' || !showThemes) {
    themeBlock.hidden = true;
    return;
  }

  themeBlock.hidden = false;
  themeList.innerHTML = '';

  if (!themes.length) {
    themeList.appendChild(createEmptyNote('対応するテーマコードは見つかりませんでした。'));
    return;
  }

  for (const theme of themes) {
    themeList.appendChild(createThemeItem(theme));
  }
}

async function renderLineage(mode, dataset, code) {
  const lineage = getLineage(mode, dataset, code);
  setStatus(`「${formatCodeForDisplay(code)}」の上位階層を表示しています。`, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${lineage.length} 階層`;

  for (const [index, lineageItem] of lineage.entries()) {
    const item = {
      ...lineageItem,
      themes:
        mode === 'fi' && typeof window.findThemeMatchesForFi === 'function'
          ? await window.findThemeMatchesForFi(dataset, lineageItem.code)
          : [],
      showThemes: mode === 'fi',
    };
    listEl.appendChild(createResultItem(mode, item, index));
  }
}

async function renderChildren(mode, dataset, code) {
  const children = getChildItems(dataset, code);
  setStatus(`「${formatCodeForDisplay(code)}」の1つ下の階層を表示しています。`, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${children.length} 件`;

  if (!children.length) {
    listEl.appendChild(createEmptyNote('この分類コードの直下には定義済みの分類コードが見つかりませんでした。'));
    return;
  }

  for (const child of children) {
    const item = {
      ...child,
      themes: [],
      showThemes: false,
    };
    listEl.appendChild(createResultItem(mode, item, getLineage(mode, dataset, child.code).length - 1));
  }
}

async function run() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const code = params.get('code');
  overlayMode = params.get('overlay') === 'children' ? 'children' : 'ancestors';
  syncPageCopy();

  if (!mode || !code || !DATASETS[mode]) {
    setStatus('表示対象のコード情報が不足しています。', 'error');
    return;
  }

  try {
    const dataset = await loadShard(mode, code);
    const resolvedCode = resolveLookupCode(mode, dataset, code);
    const item = dataset.entries[resolvedCode];
    currentDataset = dataset;

    if (!item) {
      setStatus('一致する分類コードが見つかりませんでした。', 'error');
      return;
    }

    if (overlayMode === 'children') {
      await renderChildren(mode, dataset, resolvedCode);
      return;
    }

    await renderLineage(mode, dataset, resolvedCode);
  } catch (error) {
    console.error(error);
    setStatus(`詳細ページの表示でエラーが発生しました: ${error.message || String(error)}`, 'error');
  }
}

run();
