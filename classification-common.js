(function () {
  const DATASETS = {
    ipc: { dir: './data', prefix: 'ipc-shard', label: 'IPC' },
    fi: { dir: './data', prefix: 'fi-shard', label: 'FI' },
    cpc: { dir: './data', prefix: 'cpc-shard', label: 'CPC' },
    fterm: { dir: './data', prefix: 'fterm-term', label: 'Fターム' },
  };

  const dataCache = {
    ipc: {},
    fi: {},
    cpc: {},
    fterm: {},
  };

  function formatCodeForDisplay(code) {
    return (code || '').replace(/\\$/, '');
  }

  function getShardKey(code) {
    if (/^[A-HY]\d{2}[A-Z]/.test(code)) {
      return code.slice(0, 4);
    }
    if (/^[A-HY]/.test(code)) {
      return code.slice(0, 1);
    }
    return 'misc';
  }

  function formatHierarchyInfo(depth) {
    if (depth <= 0) {
      return '';
    }
    return '・'.repeat(depth);
  }

  function resolveLookupCode(mode, dataset, code) {
    const candidates = [code];

    if (!code.includes('/')) {
      candidates.push(`${code}/00`);
    }

    if (code.endsWith('/')) {
      candidates.push(`${code}00`);
    }

    for (const candidate of candidates) {
      if (dataset.entries[candidate]) {
        return candidate;
      }

      if (mode === 'fi') {
        const anchorCode = `${candidate}\\`;
        if (dataset.entries[anchorCode]) {
          return anchorCode;
        }
      }
    }

    return code;
  }

  function getDepth(mode, dataset, code) {
    let depth = 0;
    let current = dataset.entries[code] || null;

    while (current && current.parent) {
      depth += 1;
      current = dataset.entries[current.parent] || null;
      if (mode === 'ipc' && current && current.level === 0) {
        break;
      }
    }

    return depth;
  }

  function getDisplayDepth(mode, dataset, code) {
    const depth = getDepth(mode, dataset, code);
    if (mode === 'fterm') {
      return Math.max(0, depth - 1);
    }
    return depth;
  }

  function getAncestorItems(mode, dataset, code) {
    const items = [];
    let current = dataset.entries[code] || null;

    while (current && current.parent) {
      const parent = dataset.entries[current.parent] || null;
      if (!parent) {
        break;
      }
      items.unshift(parent);
      current = parent;
      if (mode === 'ipc' && current.level === 0) {
        break;
      }
    }

    return items;
  }

  function getLineage(mode, dataset, code) {
    const lineage = [];
    let current = dataset.entries[code] || null;

    while (current) {
      lineage.push(current);
      if (mode === 'ipc' && current.level === 0) {
        break;
      }
      current = current.parent ? dataset.entries[current.parent] || null : null;
    }

    return lineage.reverse();
  }

  function getChildItems(dataset, code) {
    return Object.values(dataset.entries)
      .filter((item) => item.parent === code)
      .sort((left, right) => {
        const depthDiff = (left.level || 0) - (right.level || 0);
        if (depthDiff !== 0) {
          return depthDiff;
        }
        return left.code.localeCompare(right.code, 'en');
      });
  }

  function formatOverlayLine(item, hierarchy = '') {
    const parts = [];
    if (hierarchy) {
      parts.push(hierarchy);
    }
    parts.push(formatCodeForDisplay(item.code));
    if (item.ja) {
      parts.push(item.ja);
    } else if (item.en) {
      parts.push(item.en);
    }
    return parts.join(' : ');
  }

  async function loadShard(mode, code) {
    if (mode === 'fterm') {
      if (!window.FtermLookup || typeof window.FtermLookup.loadFtermDataset !== 'function') {
        throw new Error('FtermLookup is not available');
      }
      return window.FtermLookup.loadFtermDataset(code);
    }

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

  function createEmptyNote(message) {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = message;
    return note;
  }

  function createThemeItem(theme) {
    const item = document.createElement('article');
    item.className = 'theme-item';

    const codeText = `${theme.themeCode}${theme.type ? ` / ${theme.type}` : ''}`;
    let codeEl;

    if (theme.themeCode) {
      codeEl = document.createElement('a');
      codeEl.className = 'theme-code theme-code-link';
      codeEl.href = `https://www.j-platpat.inpit.go.jp/cache/classify/patent/PMGS_HTML/jpp/F_TERM/ja/fTermList/fTermList${theme.themeCode}.html`;
      codeEl.target = '_blank';
      codeEl.rel = 'noopener noreferrer';
      codeEl.textContent = codeText;
    } else {
      codeEl = document.createElement('p');
      codeEl.className = 'theme-code';
      codeEl.textContent = codeText;
    }

    const nameEl = document.createElement('p');
    nameEl.className = 'theme-name';
    nameEl.textContent = theme.name || '';

    item.append(codeEl, nameEl);

    if (theme.coverage) {
      const coverageEl = document.createElement('p');
      coverageEl.className = 'theme-coverage';
      coverageEl.textContent = theme.coverage;
      item.appendChild(coverageEl);
    }

    return item;
  }

  function buildNarabeToolUrlFromFiCoverage(coverage) {
    const normalized = (coverage || '').replace(/\s+/g, '');
    if (!normalized) {
      return '';
    }

    const firstSegment = normalized.split(';').find(Boolean) || '';
    const firstEndpoint = firstSegment.split('-', 1)[0] || '';
    const ipcLikeCode = firstEndpoint.replace(/[,@].*$/, '').replace(/\\$/, '');

    if (!/^[A-HY]\d{2}[A-Z]\d+\/\d+[A-Z0-9]*$/i.test(ipcLikeCode)) {
      return '';
    }

    const keyword = `${ipcLikeCode}Z`;
    return `https://www.jpo.go.jp/cgi/cgi-bin/search-portal/narabe_tool/narabe.cgi?keyword=${encodeURIComponent(keyword)}`;
  }

  function createRelatedFiItem(relatedFi) {
    const item = document.createElement('article');
    item.className = 'theme-item';

    const narabeUrl = buildNarabeToolUrlFromFiCoverage(relatedFi.coverage || '');
    let coverageEl;

    if (narabeUrl) {
      coverageEl = document.createElement('a');
      coverageEl.className = 'theme-code theme-code-link';
      coverageEl.href = narabeUrl;
      coverageEl.target = '_blank';
      coverageEl.rel = 'noopener noreferrer';
      coverageEl.textContent = relatedFi.coverage || '';
    } else {
      coverageEl = document.createElement('p');
      coverageEl.className = 'theme-code';
      coverageEl.textContent = relatedFi.coverage || '';
    }

    item.appendChild(coverageEl);

    const metaParts = [relatedFi.themeCode];
    if (relatedFi.themeType) {
      metaParts.push(relatedFi.themeType);
    }

    if (metaParts.some(Boolean)) {
      const metaEl = document.createElement('p');
      metaEl.className = 'theme-name';
      metaEl.textContent = metaParts.filter(Boolean).join(' / ');
      item.appendChild(metaEl);
    }

    if (relatedFi.themeName) {
      const nameEl = document.createElement('p');
      nameEl.className = 'theme-coverage';
      nameEl.textContent = relatedFi.themeName;
      item.appendChild(nameEl);
    }

    return item;
  }

  function populateThemeBlock(themeBlock, themeTitle, themeList, mode, themes, showThemes = true, relatedFi = null) {
    if (!themeBlock || !themeTitle || !themeList) {
      return;
    }

    if (!showThemes) {
      themeBlock.hidden = true;
      themeList.innerHTML = '';
      return;
    }

    if (mode === 'fi') {
      themeTitle.textContent = '対応テーマコード';
    } else if (mode === 'fterm') {
      themeTitle.textContent = '対応FI';
    } else {
      themeBlock.hidden = true;
      themeList.innerHTML = '';
      return;
    }

    themeBlock.hidden = false;
    themeList.innerHTML = '';

    if (mode === 'fterm') {
      if (!relatedFi || !relatedFi.coverage) {
        themeList.appendChild(createEmptyNote('対応するFIが見つかりませんでした。'));
        return;
      }

      themeList.appendChild(createRelatedFiItem(relatedFi));
      return;
    }

    if (!themes.length) {
      themeList.appendChild(createEmptyNote('対応するテーマコードが見つかりませんでした。'));
      return;
    }

    for (const theme of themes) {
      themeList.appendChild(createThemeItem(theme));
    }
  }

  async function loadThemesForCode(mode, dataset, code, showThemes = mode === 'fi') {
    if (mode !== 'fi' || !showThemes || typeof window.findThemeMatchesForFi !== 'function') {
      return [];
    }

    return window.findThemeMatchesForFi(dataset, code);
  }

  async function loadRelatedFiForFterm(mode, dataset, code, showThemes = mode === 'fterm') {
    if (mode !== 'fterm' || !showThemes) {
      return null;
    }

    const item = dataset.entries[code];
    if (!item) {
      return null;
    }

    const rootTheme = dataset.entries[item.themeCode] || null;
    const fiCoverage = item.fiCoverage || (rootTheme ? rootTheme.fiCoverage : '') || (rootTheme ? rootTheme.coverage : '');
    if (!rootTheme || !fiCoverage) {
      return null;
    }

    return {
      coverage: fiCoverage,
      themeCode: rootTheme.themeCode || item.themeCode || '',
      themeType: rootTheme.themeType || item.themeType || '',
      themeName: rootTheme.ja || '',
    };
  }

  async function buildResultModel(mode, dataset, code, options = {}) {
    const item = dataset.entries[code];
    if (!item) {
      return null;
    }

    const showThemes = options.showThemes ?? mode === 'fi';

    return {
      code,
      mode,
      typeLabel: DATASETS[mode].label,
      depth: getDisplayDepth(mode, dataset, code),
      item,
      dataset,
      themes: await loadThemesForCode(mode, dataset, code, showThemes),
      relatedFi: await loadRelatedFiForFterm(mode, dataset, code, showThemes),
      showThemes,
    };
  }

  function buildAncestorOverlayText(mode, dataset, code) {
    const lineage = getLineage(mode, dataset, code);
    return lineage
      .map((item) => formatOverlayLine(item, formatHierarchyInfo(getDisplayDepth(mode, dataset, item.code))))
      .join('\n');
  }

  function buildChildOverlayText(mode, dataset, code) {
    const children = getChildItems(dataset, code);
    if (!children.length) {
      return '1つ下の階層はありません。';
    }

    return children
      .map((item) => formatOverlayLine(item, formatHierarchyInfo(getDisplayDepth(mode, dataset, item.code))))
      .join('\n');
  }

  function buildOverlayText(overlayMode, mode, dataset, code) {
    return overlayMode === 'children'
      ? buildChildOverlayText(mode, dataset, code)
      : buildAncestorOverlayText(mode, dataset, code);
  }

  function openDetailWindow(mode, code, overlayMode) {
    const params = new URLSearchParams({
      code,
      mode,
      overlay: overlayMode,
    });
    window.open(`./detail.html?${params.toString()}`, '_blank', 'noopener');
  }

  function bindDetailTrigger(element, mode, code, overlayMode) {
    element.tabIndex = 0;
    element.setAttribute('role', 'button');
    element.setAttribute('aria-label', `${formatCodeForDisplay(code)} の詳細を別ウィンドウで開く`);
    element.addEventListener('click', () => {
      openDetailWindow(mode, code, overlayMode);
    });
    element.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
      openDetailWindow(mode, code, overlayMode);
    });
  }

  function applyDefinitionVisibility(mode, node, item, jaPane, enPane) {
    if (mode === 'fi' || mode === 'fterm') {
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

  function createResultItemNode(template, result, overlayMode) {
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
    const themeTitle = node.querySelector('.theme-title');
    const themeList = node.querySelector('.theme-list');

    codeEl.textContent = formatCodeForDisplay(result.code);
    typeTag.textContent = result.typeLabel;

    if (result.notFound) {
      hierarchyTag.textContent = result.replacementInfo ? '変更' : '未検出';
      jaEl.textContent = result.replacementInfo?.message || '一致する分類コードが見つかりませんでした。';
      enPane.hidden = true;
      themeBlock.hidden = true;
      node.classList.add('result-item-missing');
      return node;
    }

    hierarchyTag.textContent = formatHierarchyInfo(result.depth);
    hierarchyTag.hidden = !hierarchyTag.textContent;
    jaEl.textContent = result.item.ja || '';
    enEl.textContent = result.item.en || '';

    const overlayText = buildOverlayText(overlayMode, result.mode, result.dataset, result.code);
    if (overlayText) {
      codeWrap.title = overlayText;
    } else {
      codeWrap.removeAttribute('title');
    }
    bindDetailTrigger(codeWrap, result.mode, result.code, overlayMode);

    applyDefinitionVisibility(result.mode, node, result.item, jaPane, enPane);

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

    populateThemeBlock(
      themeBlock,
      themeTitle,
      themeList,
      result.mode,
      result.themes || [],
      result.showThemes === true,
      result.relatedFi || null
    );

    return node;
  }

  window.ClassificationShared = {
    DATASETS,
    loadShard,
    formatCodeForDisplay,
    formatHierarchyInfo,
    resolveLookupCode,
    getDepth,
    getDisplayDepth,
    getAncestorItems,
    getLineage,
    getChildItems,
    formatOverlayLine,
    createEmptyNote,
    loadThemesForCode,
    loadRelatedFiForFterm,
    buildResultModel,
    buildOverlayText,
    bindDetailTrigger,
    applyDefinitionVisibility,
    createResultItemNode,
    populateThemeBlock,
  };
})();
