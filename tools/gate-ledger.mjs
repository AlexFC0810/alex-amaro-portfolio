#!/usr/bin/env node
/**
 * gate-ledger — keep the creative review-gate counts on the page honest.
 *
 *   node tools/gate-ledger.mjs [--check] [file ...]   # default: every .html at the root and one level down
 *
 * WHY. The page prints four inventory counts — generations logged, accepted on
 * craft, rejected with a written reason, still unjudged — that come from a
 * PRIVATE manifest the guards cannot read. claims.json does not hold them (they
 * are process counts, not performance claims), so nothing else would notice if
 * the page drifted from the manifest, or if the four numbers stopped adding up.
 * This does both, from a tracked snapshot in proof/gate-ledger.json that is
 * re-derived from the manifest whenever the counts are refreshed.
 *
 * The page marks each figure with data-ledger="total|accepted|rejected|unjudged".
 * Exit 1 on any mismatch or on a snapshot whose parts do not sum to its total.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const snap = JSON.parse(fs.readFileSync(path.join(ROOT, 'proof', 'gate-ledger.json'), 'utf8'));
const KEYS = ['total', 'accepted', 'rejected', 'unjudged'];
const SKIP = new Set(['node_modules', '.git', '.claude', 'assets', '_audit', 'proof', 'tools']);
let failures = 0;

if (snap.accepted + snap.rejected + snap.unjudged !== snap.total) {
  console.error(`gate-ledger: snapshot does not sum — ${snap.accepted}+${snap.rejected}+${snap.unjudged} != ${snap.total}`);
  failures++;
}

function walk(dir, depth) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (depth < 1 && !SKIP.has(entry.name)) out.push(...walk(path.join(dir, entry.name), depth + 1));
    } else if (entry.name.endsWith('.html')) {
      out.push(path.relative(ROOT, path.join(dir, entry.name)));
    }
  }
  return out;
}

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const files = args.length ? args : walk(ROOT, 0);

const re = /data-ledger="(total|accepted|rejected|unjudged)"[^>]*>\s*([\d,]+)\s*</g;
let marked = 0;
for (const f of files) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  let m;
  while ((m = re.exec(html))) {
    marked++;
    const key = m[1], val = Number(m[2].replace(/,/g, ''));
    if (val !== snap[key]) {
      console.error(`gate-ledger: ${f} prints ${key}=${val}, snapshot says ${snap[key]} (as of ${snap.as_of})`);
      failures++;
    }
  }
}

if (failures) { console.error(`gate-ledger: ${failures} problem(s)`); process.exit(1); }
console.log(`gate-ledger: clean — ${marked} marked figure(s) match the ${snap.as_of} snapshot (${KEYS.map(k => `${k}=${snap[k]}`).join(', ')})`);
