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
  resolveLookupCode,
  getChildItems,
  createEmptyNote,
  buildResultModel,
  createResultItemNode,
} = shared;

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

async function renderLineage(mode, dataset, code) {
  const lineageCodes = [];
  let current = dataset.entries[code] || null;

  while (current) {
    lineageCodes.push(current.code);
    if (mode === 'ipc' && current.level === 0) {
      break;
    }
    current = current.parent ? dataset.entries[current.parent] || null : null;
  }

  lineageCodes.reverse();

  setStatus(`「${formatCodeForDisplay(code)}」の上位階層を表示しています。`, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${lineageCodes.length}階層`;

  const results = await Promise.all(
    lineageCodes.map((lineageCode, index) =>
      buildResultModel(mode, dataset, lineageCode, {
        showThemes: mode === 'fi' && index === lineageCodes.length - 1,
      })
    )
  );

  for (const result of results.filter(Boolean)) {
    listEl.appendChild(createResultItemNode(template, result, overlayMode));
  }
}

async function renderChildren(mode, dataset, code) {
  const sourceResult = await buildResultModel(mode, dataset, code, {
    showThemes: mode === 'fi',
  });
  const children = await Promise.all(
    getChildItems(dataset, code).map((child) =>
      buildResultModel(mode, dataset, child.code, {
        showThemes: false,
      })
    )
  );

  setStatus(`「${formatCodeForDisplay(code)}」の1つ下の階層を表示しています。`, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${children.filter(Boolean).length}件`;

  if (sourceResult) {
    listEl.appendChild(createResultItemNode(template, sourceResult, overlayMode));
  }

  if (!children.some(Boolean)) {
    listEl.appendChild(createEmptyNote('この分類コードの直下には定義済みの分類コードが見つかりませんでした。'));
    return;
  }

  for (const child of children.filter(Boolean)) {
    listEl.appendChild(createResultItemNode(template, child, overlayMode));
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
