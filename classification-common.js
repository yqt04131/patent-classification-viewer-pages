(function () {
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

  function populateThemeBlock(themeBlock, themeList, mode, themes, showThemes = true) {
    if (!themeBlock || !themeList) {
      return;
    }

    if (mode !== 'fi' || !showThemes) {
      themeBlock.hidden = true;
      themeList.innerHTML = '';
      return;
    }

    themeBlock.hidden = false;
    themeList.innerHTML = '';

    if (!themes.length) {
      themeList.appendChild(createEmptyNote('対応するテーマコードが見つかりませんでした。'));
      return;
    }

    for (const theme of themes) {
      themeList.appendChild(createThemeItem(theme));
    }
  }

  window.ClassificationShared = {
    DATASETS,
    loadShard,
    formatCodeForDisplay,
    formatHierarchyInfo,
    resolveLookupCode,
    getDepth,
    getAncestorItems,
    getLineage,
    getChildItems,
    formatOverlayLine,
    createEmptyNote,
    populateThemeBlock,
  };
})();
