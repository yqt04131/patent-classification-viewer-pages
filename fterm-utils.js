(function () {
  const ftermState = {
    cache: {},
  };

  function normalizeFtermCode(value) {
    const normalized = (value || '')
      .normalize('NFKC')
      .toUpperCase()
      .replace(/[ \t\r\n\u3000]/g, '')
      .replace(/[縲・ｼ・]/g, '');

    return normalized.replace(/^(\d[A-Z]\d{3})[^0-9A-Z]([A-Z]{2}\d{2})$/, '$1$2');
  }

  function getThemeCode(code) {
    const normalized = normalizeFtermCode(code);
    return /^[0-9][A-Z][0-9]{3}/.test(normalized) ? normalized.slice(0, 5) : '';
  }

  function getWindowKey(themeCode) {
    return `FTERM_TERM_${themeCode}`;
  }

  async function loadDatasetFile(basePath, windowKey) {
    try {
      const response = await fetch(`${basePath}.json`, { cache: 'no-store' });
      if (response.ok) {
        return response.json();
      }
      if (window.location.protocol !== 'file:') {
        throw new Error(`Failed to load ${basePath}.json`);
      }
    } catch (error) {
      if (window.location.protocol !== 'file:') {
        throw error;
      }
    }

    if (window[windowKey]) {
      return window[windowKey];
    }

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${basePath}.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${basePath}.js`));
      document.body.appendChild(script);
    });

    if (!window[windowKey]) {
      throw new Error(`${windowKey} is not available`);
    }

    return window[windowKey];
  }

  async function loadFtermDataset(code) {
    const themeCode = getThemeCode(code);
    if (!themeCode) {
      return { entries: {} };
    }

    if (ftermState.cache[themeCode]) {
      return ftermState.cache[themeCode];
    }

    const basePath = `./data/fterm-term-${themeCode}`;
    const dataset = await loadDatasetFile(basePath, getWindowKey(themeCode));
    ftermState.cache[themeCode] = dataset;
    return dataset;
  }

  window.FtermLookup = {
    normalizeFtermCode,
    getThemeCode,
    loadFtermDataset,
  };
})();
