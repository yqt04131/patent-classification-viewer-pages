const statusEl = document.querySelector('#status');
const listEl = document.querySelector('#result-list');
const metaEl = document.querySelector('#result-meta');
const template = document.querySelector('#result-item-template');
const pageTitleEl = document.querySelector('#detail-page-title');
const pageLeadEl = document.querySelector('#detail-page-lead');
const sectionTitleEl = document.querySelector('#detail-section-title');

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
  formatHierarchyInfo,
  resolveLookupCode,
  getDepth,
  getLineage,
  getChildItems,
  formatOverlayLine,
  createEmptyNote,
  populateThemeBlock,
} = shared;

let currentDataset = null;
let overlayMode = 'ancestors';

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

function buildAncestorOverlayText(mode, dataset, code) {
  const lineage = getLineage(mode, dataset, code);
  return lineage
    .map((item) => formatOverlayLine(item, formatHierarchyInfo(getDepth(mode, dataset, item.code))))
    .join('\n');
}

function buildChildOverlayText(mode, dataset, code) {
  const children = getChildItems(dataset, code);
  if (!children.length) {
    return '1つ下の階層はありません。';
  }

  return children
    .map((item) => formatOverlayLine(item, formatHierarchyInfo(getDepth(mode, dataset, item.code))))
    .join('\n');
}

function buildOverlayText(mode, dataset, code) {
  return overlayMode === 'children'
    ? buildChildOverlayText(mode, dataset, code)
    : buildAncestorOverlayText(mode, dataset, code);
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

function applyDefinitionVisibility(mode, node, item, jaPane, enPane) {
  if (mode === 'fi') {
    enPane.hidden = true;
  } else if (mode === 'ipc') {
    enPane.hidden = true;
    if (!item.ja) {
      jaPane.hidden = true;
    }
  } else {
    node.classList.add('result-item-cpc');
    jaPane.hidden = false;
    enPane.hidden = false;
  }
}

function createResultItem(mode, item, depth) {
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
  hierarchyTag.textContent = formatHierarchyInfo(depth);
  hierarchyTag.hidden = !hierarchyTag.textContent;
  jaEl.textContent = item.ja || '';
  enEl.textContent = item.en || '';

  const overlayText = buildOverlayText(mode, currentDataset, item.code);
  if (overlayText) {
    codeWrap.title = overlayText;
  }
  bindDetailTrigger(codeWrap, mode, item.code);

  applyDefinitionVisibility(mode, node, item, jaPane, enPane);

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

  populateThemeBlock(themeBlock, themeList, mode, item.themes || [], item.showThemes === true);

  return node;
}

async function renderLineage(mode, dataset, code) {
  const lineage = getLineage(mode, dataset, code);
  setStatus(`「${formatCodeForDisplay(code)}」の上位階層を表示しています。`, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${lineage.length}階層`;

  for (const [index, lineageItem] of lineage.entries()) {
    const isSelected = index === lineage.length - 1;
    const item = {
      ...lineageItem,
      themes:
        isSelected && mode === 'fi' && typeof window.findThemeMatchesForFi === 'function'
          ? await window.findThemeMatchesForFi(dataset, lineageItem.code)
          : [],
      showThemes: isSelected && mode === 'fi',
    };
    listEl.appendChild(createResultItem(mode, item, index));
  }
}

async function renderChildren(mode, dataset, code) {
  const children = getChildItems(dataset, code);
  const sourceItem = {
    ...dataset.entries[code],
    themes:
      mode === 'fi' && typeof window.findThemeMatchesForFi === 'function'
        ? await window.findThemeMatchesForFi(dataset, code)
        : [],
    showThemes: mode === 'fi',
  };

  setStatus(`「${formatCodeForDisplay(code)}」の1つ下の階層を表示しています。`, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${children.length}件`;

  listEl.appendChild(createResultItem(mode, sourceItem, getDepth(mode, dataset, code)));

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
    listEl.appendChild(createResultItem(mode, item, getDepth(mode, dataset, child.code)));
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
