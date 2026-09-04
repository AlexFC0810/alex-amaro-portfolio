#!/usr/bin/env node
/**
 * check-home-claims — every figure inside a [data-claim] block must be licensed
 * by that claim in claims.json, and every status pill must print the claim's
 * own status and tier.
 *
 *   node tools/check-home-claims.mjs [file ...]     # default: index.html and every v<n>/index.html
 *
 * WHY. The case pages are rendered FROM the contract by a build that refuses
 * unapproved figures. The home page is hand-written, so until now a digit could
 * drift there without anything noticing — which is the one place "every number
 * stands cross-examination" is read first. This is the home page's twin of the
 * case builder's assertContracted(): for each element carrying
 * data-claim="C3", every numeric token in its text must appear somewhere in
 * that claim's headline, qualifier, wording, boundary or provenance strings;
 * and a nested data-status must read exactly "<status> · <tier>". Exit 1
 * otherwise.
 *
 * Neutral tokens (never checked): years, and integers 0–19, which are prose.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const contract = JSON.parse(fs.readFileSync(path.join(ROOT, 'claims.json'), 'utf8'));
const byId = Object.fromEntries(contract.claims.map(c => [c.id, c]));

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const files = args.length ? args : ['index.html', ...fs.readdirSync(ROOT)
  .filter(d => /^v\d+$/.test(d) && fs.existsSync(path.join(ROOT, d, 'index.html')))
  .map(d => d + '/index.html')];

const norm = s => s.replace(/&times;/g, 'x').replace(/×/g, 'x').replace(/&ndash;|–|—|&mdash;/g, '-')
  .replace(/&rsquo;|’/g, "'").replace(/&nbsp;/g, ' ').replace(/,/g, '');
const numsIn = s => (norm(s).match(/\$?~?\d+(?:\.\d+)?[xX%+]?/g) || []).map(t => t.replace(/^[~$]+/, '').replace(/X$/, 'x'));
const neutral = t => {
  const n = parseFloat(t);
  return (n >= 1990 && n <= 2035) || (Number.isInteger(n) && n >= 0 && n <= 19 && !/[x%+]$/.test(t));
};
function licensed(claim) {
  const h = claim.headline || {};
  const parts = [h.value, h.unit, h.qualifier, ...Object.values(claim.wording || {}), ...(claim.boundaries || []), claim.provenance || '', claim.client || ''].filter(Boolean);
  return norm(parts.join(' '));
}
/* Find the end of the element that opens at `start` (index just after the
   opening tag) by counting same-name open/close tags. */
function innerOf(html, tag, start) {
  const openTok = '<' + tag, closeTok = '</' + tag + '>';
  let depth = 1, i = start;
  while (depth > 0) {
    const o = html.indexOf(openTok, i), c = html.indexOf(closeTok, i);
    if (c < 0) return html.slice(start);
    if (o >= 0 && o < c && /[\s>/]/.test(html[o + openTok.length])) { depth++; i = o + openTok.length; }
    else { depth--; if (depth === 0) return html.slice(start, c); i = c + closeTok.length; }
  }
  return '';
}

let failures = 0, blocks = 0;
for (const f of files) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const m of html.matchAll(/<([a-z]+)\b[^>]*\sdata-claim="([A-Z]+\d+)"[^>]*>/g)) {
    blocks++;
    const tag = m[1], id = m[2];
    const claim = byId[id];
    if (!claim) { console.error(`${f}: data-claim="${id}" is not in claims.json`); failures++; continue; }
    const start = m.index + m[0].length;
    const raw = innerOf(html, tag, start);
    const inner = raw.replace(/<[^>]+>/g, ' ');
    const lic = licensed(claim);
    for (const tok of numsIn(inner)) {
      if (neutral(tok)) continue;
      const core = tok.replace(/[x%+]$/, '');
      if (!lic.includes(core)) { console.error(`${f}: [data-claim="${id}"] prints "${tok}" which ${id} does not license`); failures++; }
    }
    const st = raw.match(/data-status="([^"]+)"/);
    if (st) {
      const want = `${claim.status} · ${claim.evidence_tier}`;
      if (st[1] !== want) { console.error(`${f}: [data-claim="${id}"] status pill "${st[1]}" should read "${want}"`); failures++; }
    }
  }
}

if (failures) { console.error(`check-home-claims: ${failures} problem(s) across ${blocks} block(s)`); process.exit(1); }
console.log(`check-home-claims: clean — ${blocks} claim block(s) in ${files.join(', ')} all licensed by claims.json v${contract.contract_version}`);
