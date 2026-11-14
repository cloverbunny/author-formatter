#!/usr/bin/env node
// Reproduces Tables 1 and 2 of the manuscript by running the parsing and
// numbering code from ../index.html on the synthetic rosters in this folder.
// Usage: node examples/reproduce.js     (Node 18+, no packages needed)
const fs = require('fs'), path = require('path'), vm = require('vm');
const here = __dirname;

// Take the app's own logic straight from index.html so results always match the live tool.
const html = fs.readFileSync(path.join(here, '..', 'index.html'), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('function buildModel'));
const core = script.slice(script.indexOf('/* ---------- parsing'), script.indexOf('/* ---------- render'));
const app = vm.runInNewContext(core + '\n({ buildModel, format, toPlain })');

// Minimal RFC 4180 CSV reader (the app itself uses Papa Parse in the browser).
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const opts = { style: 'num', name: 'asis', last: ', ', marks: '*|†', split: true, range: true, notes: true, period: false };
const rosters = [
  ['01_messy_affiliations.csv', 'Inconsistent spelling, missing affiliation, duplicate author'],
  ['02_first_last_names.csv', 'First, middle and last name columns'],
  ['03_semicolon_cells.csv', 'Several affiliations in one cell'],
  ['04_no_header.csv', 'No header row'],
  ['05_large_consortium.csv', '40-author consortium with typos'],
];
const load = f => parseCSV(fs.readFileSync(path.join(here, f), 'utf8').replace(/^﻿/, ''));

console.log('Table 1. Results on five synthetic rosters\n');
const t1 = []; let strings = 0, insts = 0;
rosters.forEach(([file, problem], i) => {
  const m = app.buildModel(load(file), opts, []);
  const distinct = new Set(m.authors.flatMap(a => a.raw)).size;
  strings += distinct; insts += m.affs.length;
  t1.push({ Roster: i + 1, Problem: problem, Authors: m.authors.length, 'Distinct affiliation strings': distinct,
    'Institutions listed': m.affs.length, Merges: m.warnings.filter(w => w.startsWith('Merged')).length, Warnings: m.warnings.length });
});
console.table(t1);
console.log(`Total: ${strings} distinct affiliation strings -> ${insts} institutions\n`);

console.log('Table 2. Superscripts in roster 1 before and after moving the fifth author to first position\n');
const rows = load(rosters[0][0]);
const before = app.buildModel(rows, opts, []);
const fBefore = app.format(before, opts);
const order = before.authors.map(a => a.key);
order.unshift(order.splice(4, 1)[0]);
const fAfter = app.format(app.buildModel(rows, opts, order), opts);
const afterByKey = new Map(fAfter.authors.map(a => [a.key, a.sup]));
const t2 = fBefore.authors.map(a => ({ Author: a.name, Before: a.sup || 'none', After: afterByKey.get(a.key) || 'none' }));
console.table(t2);
console.log(`Superscripts changed for ${t2.filter(r => r.Before !== r.After).length} of ${t2.length} authors\n`);

console.log('Roster 1 formatted output:\n');
console.log(app.toPlain(fBefore, opts));
console.log('\nWarnings:\n - ' + before.warnings.join('\n - '));
