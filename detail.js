const statusEl = document.querySelector('#status');
const listEl = document.querySelector('#result-list');
const metaEl = document.querySelector('#result-meta');
const template = document.querySelector('#result-item-template');
const pageTitleEl = document.querySelector('#detail-page-title');
const pageLeadEl = document.querySelector('#detail-page-lead');
const sectionTitleEl = document.querySelector('#detail-section-title');

const {
  DATASETS,
  loadShard,
  formatCodeForDisplay,
  formatHierarchyInfo,
  resolveLookupCode,
  getDepth,
  getLineage,
  getAncestorItems,
  getChildItems,
  formatOverlayLine,
  createEmptyNote,
  populateThemeBlock,
} = window.ClassificationShared;
let currentDataset = null;
let overlayMode = 'ancestors';
function setStatus(message, type = 'neutral') {
  statusEl.textContent = message;
  statusEl.dataset.state = type;
}

function syncPageCopy() {
  if (overlayMode === 'children') {
    pageTitleEl.textContent = '荳倶ｽ埼嚴螻､諠・ｱ繧堤｢ｺ隱阪☆繧・;
    pageLeadEl.textContent = '驕ｸ謚槭＠縺溷・鬘槭さ繝ｼ繝峨↓縺､縺・※縲・縺､荳九・髫主ｱ､繧剃ｸ隕ｧ陦ｨ遉ｺ縺励∪縺吶・;
    sectionTitleEl.textContent = '荳倶ｽ埼嚴螻､';
    return;
  }

  pageTitleEl.textContent = '荳贋ｽ埼嚴螻､諠・ｱ繧堤｢ｺ隱阪☆繧・;
  pageLeadEl.textContent = '驕ｸ謚槭＠縺溷・鬘槭さ繝ｼ繝峨↓縺､縺・※縲∽ｸ贋ｽ埼嚴螻､繧偵Ν繝ｼ繝医∪縺ｧ陦ｨ遉ｺ縺励∪縺吶・;
  sectionTitleEl.textContent = '荳贋ｽ埼嚴螻､';
}
function buildOverlayText(mode, dataset, code) {
  const currentItem = dataset.entries[code];
  if (!currentItem) {
    return '';
  }

  if (overlayMode === 'children') {
    const children = getChildItems(dataset, code);
    if (!children.length) {
      return '1縺､荳九・髫主ｱ､縺ｯ縺ゅｊ縺ｾ縺帙ｓ縲・;
    }
    return children
      .map((item) => {
        const absoluteDepth = getDepth(mode, dataset, item.code);
        return formatOverlayLine(item, absoluteDepth > 0 ? '繝ｻ'.repeat(absoluteDepth) : '');
      })
      .join('\n');
  }

  const ancestors = getAncestorItems(mode, dataset, code);
  const lines = [];

  for (const [index, item] of ancestors.entries()) {
    const hierarchy = index === 0 ? '' : '繝ｻ'.repeat(index);
    lines.push(formatOverlayLine(item, hierarchy));
  }

  const currentDepth = ancestors.length;
  lines.push(formatOverlayLine(currentItem, currentDepth > 0 ? '繝ｻ'.repeat(currentDepth) : ''));

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
  element.setAttribute('aria-label', `${formatCodeForDisplay(code)} 縺ｮ隧ｳ邏ｰ繧貞挨繧ｦ繧｣繝ｳ繝峨え縺ｧ髢九￥`);
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
async function renderLineage(mode, dataset, code) {
  const lineage = getLineage(mode, dataset, code);
  setStatus(`縲・{formatCodeForDisplay(code)}縲阪・荳贋ｽ埼嚴螻､繧定｡ｨ遉ｺ縺励※縺・∪縺吶Ａ, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${lineage.length} 髫主ｱ､`;

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
  const sourceItem = {
    ...dataset.entries[code],
    themes:
      mode === 'fi' && typeof window.findThemeMatchesForFi === 'function'
        ? await window.findThemeMatchesForFi(dataset, code)
        : [],
    showThemes: mode === 'fi',
  };
  setStatus(`縲・{formatCodeForDisplay(code)}縲阪・1縺､荳九・髫主ｱ､繧定｡ｨ遉ｺ縺励※縺・∪縺吶Ａ, 'success');
  metaEl.textContent = `${DATASETS[mode].label} / ${children.length} 莉ｶ`;

  listEl.appendChild(createResultItem(mode, sourceItem, getLineage(mode, dataset, code).length - 1));

  if (!children.length) {
    listEl.appendChild(createEmptyNote('縺薙・蛻・｡槭さ繝ｼ繝峨・逶ｴ荳九↓縺ｯ螳夂ｾｩ貂医∩縺ｮ蛻・｡槭さ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲・));
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
    setStatus('陦ｨ遉ｺ蟇ｾ雎｡縺ｮ繧ｳ繝ｼ繝画ュ蝣ｱ縺御ｸ崎ｶｳ縺励※縺・∪縺吶・, 'error');
    return;
  }

  try {
    const dataset = await loadShard(mode, code);
    const resolvedCode = resolveLookupCode(mode, dataset, code);
    const item = dataset.entries[resolvedCode];
    currentDataset = dataset;

    if (!item) {
      setStatus('荳閾ｴ縺吶ｋ蛻・｡槭さ繝ｼ繝峨′隕九▽縺九ｊ縺ｾ縺帙ｓ縺ｧ縺励◆縲・, 'error');
      return;
    }

    if (overlayMode === 'children') {
      await renderChildren(mode, dataset, resolvedCode);
      return;
    }

    await renderLineage(mode, dataset, resolvedCode);
  } catch (error) {
    console.error(error);
    setStatus(`隧ｳ邏ｰ繝壹・繧ｸ縺ｮ陦ｨ遉ｺ縺ｧ繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｾ縺励◆: ${error.message || String(error)}`, 'error');
  }
}

run();
