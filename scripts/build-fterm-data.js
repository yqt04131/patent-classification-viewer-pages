#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const THEME_CODES_PATH = path.join(DATA_DIR, 'theme-codes.json');
const FTERM_BASE_URL =
  'https://www.j-platpat.inpit.go.jp/cache/classify/patent/PMGS_HTML/jpp/F_TERM/ja/fTermList';

function getArgValue(name) {
  const prefix = `${name}=`;
  const matched = process.argv.slice(2).find((arg) => arg === name || arg.startsWith(prefix));
  if (!matched) {
    return '';
  }
  return matched === name ? 'true' : matched.slice(prefix.length);
}

function decodeHtml(value) {
  const named = {
    amp: '&',
    gt: '>',
    lt: '<',
    quot: '"',
    apos: "'",
    nbsp: ' ',
  };

  return String(value || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (token, entity) => {
    const lower = entity.toLowerCase();
    if (lower.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(lower.slice(2), 16));
    }
    if (lower.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(lower.slice(1), 10));
    }
    return named[lower] || token;
  });
}

function stripTags(value) {
  return decodeHtml(String(value || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ' '))
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t\u3000]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}

function normalizeCode(value) {
  return String(value || '').normalize('NFKC').toUpperCase().replace(/[^0-9A-Z]/g, '');
}

function extractFiCoverage(text) {
  const normalized = String(text || '').normalize('NFKC');
  const matches = normalized.match(/[A-HY]\d{2}[A-Z]\s*\d+\/[0-9A-Z,@\-; ]+/g) || [];
  return matches.map((match) => match.replace(/\s+/g, '')).join(';');
}

function collectRows(html) {
  const rows = [];
  const rowPattern = /<tr\b[\s\S]*?<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowPattern.exec(html))) {
    const rowHtml = rowMatch[0];
    const cells = [];
    const cellPattern = /<t[dh]\b[\s\S]*?<\/t[dh]>/gi;
    let cellMatch;

    while ((cellMatch = cellPattern.exec(rowHtml))) {
      cells.push(stripTags(cellMatch[0]));
    }

    if (cells.length) {
      rows.push(cells);
    }
  }

  return rows;
}

function inferLevel(label, termCode) {
  const bulletCount = (label.match(/[・･]/g) || []).length;
  if (termCode.endsWith('00')) {
    return 1;
  }
  return bulletCount + 1;
}

function buildDataset(theme, html) {
  const entries = {};
  const themeCode = theme.themeCode;
  const stack = [];

  entries[themeCode] = {
    code: themeCode,
    ja: theme.name || '',
    en: '',
    parent: null,
    level: 0,
    themeCode,
    termCode: '',
    themeType: theme.type || '',
    coverage: theme.coverage || '',
  };

  for (const cells of collectRows(html)) {
    const joined = cells.join(' ');
    const codeMatch = joined.match(new RegExp(`${themeCode}\\s*([A-Z]{2}\\s*\\d{2})|\\b([A-Z]{2}\\s*\\d{2})\\b`, 'i'));
    if (!codeMatch) {
      continue;
    }

    const termCode = normalizeCode(codeMatch[1] || codeMatch[2]);
    if (!/^[A-Z]{2}\d{2}$/.test(termCode)) {
      continue;
    }

    const code = `${themeCode}${termCode}`;
    const label = cells.find((cell) => /[・･]/.test(cell) || cell.includes(termCode)) || joined;
    const codeLabelPattern = new RegExp(`(?:${themeCode}\\s*)?${termCode}`, 'i');
    const ja =
      cells
        .map((cell) => cell.replace(codeLabelPattern, '').replace(/[・･]/g, '').trim())
        .find((cell) => cell && !/^[A-HY]\d{2}[A-Z]/.test(cell)) || '';
    const level = inferLevel(label, termCode);

    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    const parent = stack.length ? stack[stack.length - 1].code : themeCode;
    const entry = {
      code,
      ja,
      en: '',
      parent,
      level,
      themeCode,
      termCode,
      themeType: theme.type || '',
    };

    const fiCoverage = extractFiCoverage(joined);
    if (fiCoverage) {
      entry.fiCoverage = fiCoverage;
    }

    entries[code] = entry;
    stack.push(entry);
  }

  return { themeCode, entries };
}

async function writeDataset(theme, dataset) {
  const jsonPath = path.join(DATA_DIR, `fterm-term-${theme.themeCode}.json`);
  const jsPath = path.join(DATA_DIR, `fterm-term-${theme.themeCode}.js`);
  const json = JSON.stringify(dataset);

  await fs.writeFile(jsonPath, json, 'utf8');
  await fs.writeFile(jsPath, `window.FTERM_TERM_${theme.themeCode} = ${json};\n`, 'utf8');
}

async function buildTheme(theme) {
  const url = `${FTERM_BASE_URL}/fTermList${theme.themeCode}.html`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const dataset = buildDataset(theme, html);
  await writeDataset(theme, dataset);
  return Object.keys(dataset.entries).length;
}

async function main() {
  const only = getArgValue('--only');
  const limit = Number.parseInt(getArgValue('--limit') || '0', 10);
  const themes = JSON.parse(await fs.readFile(THEME_CODES_PATH, 'utf8')).filter((theme) =>
    only ? theme.themeCode === only : true
  );
  const targets = limit > 0 ? themes.slice(0, limit) : themes;

  for (const theme of targets) {
    const count = await buildTheme(theme);
    console.log(`${theme.themeCode}: ${count} entries`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
