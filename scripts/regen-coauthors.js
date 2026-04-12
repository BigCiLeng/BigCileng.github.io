#!/usr/bin/env node
'use strict';

/**
 * Rebuild scripts/coauthors-backup.js from scripts/research-projects-data.js
 * (unique coauthors, same object shape as portfolio author entries, no highlight/you).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const srcPath = path.join(__dirname, 'research-projects-data.js');
const outPath = path.join(__dirname, 'coauthors-backup.js');

const code = fs.readFileSync(srcPath, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const research = sandbox.window.PORTFOLIO_CONTENT.research;
const byKey = new Map();

function normKey(name) {
  return name.replace(/\*\s*$/, '').trim().toLowerCase();
}

for (const item of research) {
  if (!item.authors) continue;
  for (const a of item.authors) {
    if (!a || !a.name || a.highlight) continue;
    const key = normKey(a.name);
    const displayName = a.name.replace(/\*\s*$/, '').trim();
    const entry = { name: displayName };
    if (a.href) entry.href = a.href;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, entry);
    } else if (a.href && !existing.href) {
      existing.href = a.href;
    }
  }
}

const list = [...byKey.values()].sort(function (x, y) {
  return x.name.localeCompare(y.name);
});

const today = new Date().toISOString().slice(0, 10);
const json = JSON.stringify(list, null, 2);

const fileBody = `'use strict';

/**
 * Deduplicated coauthor directory in the same object shape as \`authors[]\` entries in
 * \`research-projects-data.js\`: \`{ "name": string, "href"?: string }\`.
 *
 * Refreshed from portfolio research cards (excludes \`highlight: true\`; merges * suffix).
 * Regenerate: \`node scripts/regen-coauthors.js\`
 *
 * Snapshot date: ${today}
 */
window.COAUTHORS_BACKUP = Object.freeze(${json});
`;

fs.writeFileSync(outPath, fileBody, 'utf8');
console.log('Wrote', outPath, '(' + list.length + ' coauthors)');
