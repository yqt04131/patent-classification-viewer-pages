(function () {
  const themeState = {
    data: null,
    promise: null,
    parsedCache: new Map(),
    matchCache: new Map(),
  };

  function normalizeText(value) {
    return (value || '').normalize('NFKC').toUpperCase().replace(/\s+/g, '');
  }

  function normalizeFiCode(code) {
    return normalizeText(code).replace(/[()]/g, '').replace(/@Z/g, '').replace(/\\/g, '');
  }

  function parseFiCode(code) {
    const normalized = normalizeFiCode(code);
    const match = normalized.match(/^([A-HY])(\d{2})([A-Z])(\d+)\/(.+)$/);
    if (!match) {
      return null;
    }

    return {
      normalized,
      prefix: `${match[1]}${match[2]}${match[3]}`,
      mainGroup: match[4],
      subGroup: match[5],
    };
  }

  function compareFractionStrings(left, right) {
    const maxLength = Math.max(left.length, right.length);
    const paddedLeft = left.padEnd(maxLength, '0');
    const paddedRight = right.padEnd(maxLength, '0');
    if (paddedLeft < paddedRight) return -1;
    if (paddedLeft > paddedRight) return 1;
    return 0;
  }

  function tokenizeSubGroup(subGroup) {
    return (subGroup.match(/\d+|[A-Z]+/g) || []).map((token) => ({
      type: /^\d+$/.test(token) ? 'fraction' : 'alpha',
      value: token,
    }));
  }

  function compareSubGroups(left, right) {
    const leftTokens = tokenizeSubGroup(left);
    const rightTokens = tokenizeSubGroup(right);
    const length = Math.max(leftTokens.length, rightTokens.length);

    for (let index = 0; index < length; index += 1) {
      const leftToken = leftTokens[index];
      const rightToken = rightTokens[index];

      if (!leftToken) return -1;
      if (!rightToken) return 1;

      if (leftToken.type === rightToken.type) {
        if (leftToken.type === 'fraction') {
          const diff = compareFractionStrings(leftToken.value, rightToken.value);
          if (diff !== 0) {
            return diff;
          }
        } else {
          const diff = leftToken.value.localeCompare(rightToken.value, 'en');
          if (diff !== 0) {
            return diff;
          }
        }
        continue;
      }

      return leftToken.type === 'fraction' ? -1 : 1;
    }

    return 0;
  }

  function compareFiCodes(leftCode, rightCode) {
    const left = parseFiCode(leftCode);
    const right = parseFiCode(rightCode);
    if (!left || !right) {
      return normalizeFiCode(leftCode).localeCompare(normalizeFiCode(rightCode), 'en');
    }

    const prefixDiff = left.prefix.localeCompare(right.prefix, 'en');
    if (prefixDiff !== 0) {
      return prefixDiff;
    }

    const mainDiff = Number(left.mainGroup) - Number(right.mainGroup);
    if (mainDiff !== 0) {
      return mainDiff;
    }

    return compareSubGroups(left.subGroup, right.subGroup);
  }

  function splitCoverageSpec(spec) {
    return spec.split(/,(?=(?:[A-HY]\d{2}[A-Z])?\d+\/)/).filter(Boolean);
  }

  function expandCoverageCode(rawCode, contextPrefix) {
    const normalized = normalizeFiCode(rawCode);
    if (!normalized) {
      return '';
    }

    if (/^[A-HY]\d{2}[A-Z]\d+\/.+$/.test(normalized)) {
      return normalized;
    }

    if (/^\d+\/.+$/.test(normalized) && contextPrefix) {
      return `${contextPrefix}${normalized}`;
    }

    return normalized;
  }

  function parseCoverageSegments(coverage) {
    const cacheKey = normalizeText(coverage);
    if (themeState.parsedCache.has(cacheKey)) {
      return themeState.parsedCache.get(cacheKey);
    }

    const segments = [];
    let contextPrefix = '';

    for (const part of normalizeFiCode(coverage).split(';')) {
      if (!part) {
        continue;
      }

      for (const spec of splitCoverageSpec(part)) {
        const [rawStart, rawEnd] = spec.split('-', 2);
        const start = expandCoverageCode(rawStart, contextPrefix);
        const startParsed = parseFiCode(start);
        if (!startParsed) {
          continue;
        }

        contextPrefix = startParsed.prefix;
        const end = expandCoverageCode(rawEnd || rawStart, contextPrefix);
        const endParsed = parseFiCode(end);
        if (endParsed) {
          contextPrefix = endParsed.prefix;
        }

        segments.push({
          start,
          end,
        });
      }
    }

    themeState.parsedCache.set(cacheKey, segments);
    return segments;
  }

  function coverageContainsCode(coverage, code) {
    const normalizedCode = normalizeFiCode(code);
    if (!normalizedCode) {
      return false;
    }

    return parseCoverageSegments(coverage).some((segment) => {
      return compareFiCodes(segment.start, normalizedCode) <= 0 && compareFiCodes(normalizedCode, segment.end) <= 0;
    });
  }

  async function loadThemeData() {
    if (themeState.data) {
      return themeState.data;
    }

    if (themeState.promise) {
      return themeState.promise;
    }

    themeState.promise = (async () => {
      try {
        const response = await fetch('./data/theme-codes.json', { cache: 'no-store' });
        if (response.ok) {
          themeState.data = await response.json();
          return themeState.data;
        }

        if (window.location.protocol !== 'file:') {
          throw new Error('Failed to load ./data/theme-codes.json');
        }
      } catch (error) {
        if (window.location.protocol !== 'file:') {
          throw error;
        }
      }

      if (!window.THEME_CODES_DATA) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = './data/theme-codes.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load ./data/theme-codes.js'));
          document.body.appendChild(script);
        });
      }

      themeState.data = window.THEME_CODES_DATA || [];
      return themeState.data;
    })();

    return themeState.promise;
  }

  function getLineageCodes(dataset, code) {
    const codes = [];
    const seen = new Set();
    let current = dataset.entries[code] || null;

    while (current) {
      const normalized = normalizeFiCode(current.code);
      if (normalized && !seen.has(normalized)) {
        seen.add(normalized);
        codes.push(normalized);
      }
      current = current.parent ? dataset.entries[current.parent] || null : null;
    }

    return codes;
  }

  async function findThemeMatchesForFi(dataset, code) {
    const normalizedCode = normalizeFiCode(code);
    const cacheKey = normalizedCode || code;
    if (themeState.matchCache.has(cacheKey)) {
      return themeState.matchCache.get(cacheKey);
    }

    const themes = await loadThemeData();
    const lineageCodes = getLineageCodes(dataset, code);
    const matches = themes.filter((theme) => {
      return lineageCodes.some((lineageCode) => coverageContainsCode(theme.coverage, lineageCode));
    });

    matches.sort((left, right) => left.themeCode.localeCompare(right.themeCode, 'en'));
    themeState.matchCache.set(cacheKey, matches);
    return matches;
  }

  window.loadThemeData = loadThemeData;
  window.findThemeMatchesForFi = findThemeMatchesForFi;
})();
