#!/usr/bin/env node
/**
 * claims-lint — guards Alex's outward surfaces against held/corrected claims.
 * Zero-dep, no shell, pure fs. Reads do_not_say + proximity_rules from greenlit.json.
 *
 * Usage:
 *   node tools/claims-lint.mjs [--config path/to/greenlit.json] <file|dir> [...]
 *   node tools/claims-lint.mjs --list            # show active patterns
 *   --strict  → warnings also fail the run
 *
 * Dirs are walked recursively for: .html .htm .md .txt .js .mjs .json
 * Skips: node_modules, .git, _raw_private, .vercel, dist, out, this tool, greenlit files.
 * Exit 1 on any ERROR hit (or WARN with --strict).
 */
import fs from 'node:fs';
import path from 'node:path';

const EXT = new Set(['.html', '.htm', '.md', '.txt', '.js', '.mjs', '.json']);
const SKIP_DIRS = new Set(['node_modules', '.git', '_raw_private', '.vercel', 'dist', 'out']);
const args = process.argv.slice(2);

let configPath = null;
let strict = false;
let listOnly = false;
const targets = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--config') configPath = args[++i];
  else if (args[i] === '--strict') strict = true;
  else if (args[i] === '--list') listOnly = true;
  else targets.push(args[i]);
}

function findConfig() {
  if (configPath) return configPath;
  const candidates = [
    path.join(process.cwd(), 'proof', 'greenlit.json'),
    path.join(process.cwd(), 'shareable', 'greenlit.json'),
    path.join(process.cwd(), 'greenlit.json'),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  console.error('claims-lint: greenlit.json not found (use --config).');
  process.exit(2);
}

const cfg = JSON.parse(fs.readFileSync(findConfig(), 'utf8'));
const rules = (cfg.do_not_say || []).map((r) => ({ ...r, re: new RegExp(r.pattern, 'gi') }));
const proxRules = (cfg.proximity_rules || []).map((r) => ({
  ...r,
  reA: new RegExp(r.a, 'gi'),
  reB: new RegExp(r.b, 'i'),
  reUnless: r.unless ? new RegExp(r.unless, 'i') : null,
}));

if (listOnly) {
  console.log(`greenlit v${cfg.version} (${cfg.updated}) — ${rules.length} do-not-say patterns, ${proxRules.length} proximity rules`);
  for (const r of rules) console.log(`  ERROR  /${r.pattern}/i — ${r.reason}`);
  for (const r of proxRules) console.log(`  WARN   "${r.a}" near "${r.b}" (≤${r.window_chars} chars, unless /${r.unless}/) — ${r.reason}`);
  process.exit(0);
}

function* walk(target) {
  const st = fs.statSync(target);
  if (st.isFile()) { yield target; return; }
  if (!st.isDirectory()) return;
  for (const entry of fs.readdirSync(target)) {
    if (SKIP_DIRS.has(entry)) continue;
    const p = path.join(target, entry);
    const s = fs.statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (
      EXT.has(path.extname(entry).toLowerCase()) &&
      !entry.endsWith('claims-lint.mjs') &&
      !entry.includes('greenlit')
    ) yield p;
  }
}

let errors = 0;
let warns = 0;

for (const target of targets.length ? targets : ['.']) {
  if (!fs.existsSync(target)) { console.error(`claims-lint: no such path: ${target}`); process.exit(2); }
  for (const file of walk(target)) {
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);

    lines.forEach((line, i) => {
      for (const r of rules) {
        const hits = [...line.matchAll(r.re)];
        if (hits.length) {
          errors++;
          console.log(`ERROR ${file}:${i + 1} — "${hits[0][0]}"`);
          console.log(`      why: ${r.reason}`);
          console.log(`      use: ${r.replacement}`);
        }
      }
    });

    for (const pr of proxRules) {
      for (const m of text.matchAll(pr.reA)) {
        const start = Math.max(0, m.index - pr.window_chars);
        const end = Math.min(text.length, m.index + pr.window_chars);
        const windowText = text.slice(start, end);
        if (pr.reB.test(windowText) && !(pr.reUnless && pr.reUnless.test(windowText))) {
          warns++;
          const lineNo = text.slice(0, m.index).split(/\r?\n/).length;
          console.log(`WARN  ${file}:${lineNo} — "${m[0]}" appears near "${pr.b}" without "${pr.unless}"`);
          console.log(`      why: ${pr.reason}`);
        }
      }
    }
  }
}

if (errors || warns) console.log(`\nclaims-lint: ${errors} error(s), ${warns} warning(s). greenlit v${cfg.version}`);
else console.log(`claims-lint: clean. greenlit v${cfg.version}`);
process.exit(errors > 0 || (strict && warns > 0) ? 1 : 0);
