#!/usr/bin/env node
/**
 * public-selftest — the leak-regression tripwire for this PUBLIC repo.
 *
 * WHAT IT IS, HONESTLY
 * A salted-hash scan, not secrecy. proof/banlist.public.json carries sha256
 * hashes of tokens that must never appear here — client names and retired
 * figures. Hashing keeps the list itself from being the leak (the full
 * contract, patterns and all, was served from this repo's Pages URL for four
 * weeks once — see the vault's public-contract-exposure incident). A
 * determined reader can dictionary-guess tokens; the tripwire's job is the
 * accident class, and the full context-aware sweep runs nightly from the
 * private vault against this repo's public content.
 *
 * ALSO CHECKS
 *  - claims.json integrity: the embedded sha256 matches the content, so a
 *    hand-edit of the published contract cannot ship silently.
 *  - claims.json version consistency with any published audit runs.
 *
 * Usage: node tools/public-selftest.mjs   (exit 1 on any hit)
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const EXT = new Set(['.html', '.htm', '.md', '.txt', '.js', '.mjs', '.json', '.xml', '.css']);
const SKIP_DIRS = new Set(['node_modules', '.git', '.claude', '.vercel', 'assets']);
// banlist.public.json is the hash list itself; proof/greenlit.json is the
// GITIGNORED private contract snapshot — never tracked, never served, and by
// design full of the names this tripwire hunts. Everything else is fair game,
// including the untracked: a file becomes public the moment someone adds it,
// and this tool exists to fire BEFORE that moment.
const SKIP_FILES = new Set(['banlist.public.json', 'greenlit.json']);

const sha256 = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

const banlistPath = path.join(ROOT, 'proof', 'banlist.public.json');
if (!fs.existsSync(banlistPath)) {
  console.error('public-selftest: proof/banlist.public.json missing — sync it from the vault.');
  process.exit(2);
}
const banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));
const HASHES = new Set(banlist.hashes);
const SALT = banlist.salt;

let failures = 0;
let checks = 0;

// Normalization mirrors the vault's: lowercase; keep word chars, spaces and
// dots between digits; collapse whitespace.
function normalizeText(s) {
  return s.toLowerCase()
    .replace(/[^\w\s.]/g, ' ')
    .replace(/\.(?!\d)/g, ' ')
    .replace(/(?<!\d)\./g, ' ')
    .replace(/[\s_]+/g, ' ')
    .trim();
}

function* ngrams(words, maxN) {
  for (let n = 1; n <= maxN; n++) {
    for (let i = 0; i + n <= words.length; i++) yield words.slice(i, i + n).join(' ');
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry) || SKIP_FILES.has(entry)) continue;
    const p = path.join(dir, entry);
    const st = fs.statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (EXT.has(path.extname(entry).toLowerCase())) yield p;
  }
}

// Filenames leak too (the vault's evidence files are NAMED after clients), so
// every tracked path is swept — including under assets/, whose contents are
// binary and skipped.
function* walkNames(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry === '.git' || entry === 'node_modules' || entry === '.claude') continue;
    const p = path.join(dir, entry);
    if (fs.statSync(p).isDirectory()) yield* walkNames(p);
    else yield p;
  }
}
for (const file of walkNames(ROOT)) {
  const words = normalizeText(path.relative(ROOT, file).replace(/[\\/.-]/g, ' ')).split(' ').filter(Boolean);
  checks++;
  for (const gram of ngrams(words, 4)) {
    if (HASHES.has(sha256(`${SALT}|${gram}`))) {
      failures++;
      console.log(`FAIL  filename carries a banned token: ${path.relative(ROOT, file)}`);
    }
  }
}

for (const file of walk(ROOT)) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const words = normalizeText(line).split(' ').filter(Boolean);
    if (!words.length) return;
    checks++;
    const seen = new Set();
    for (const gram of ngrams(words, 4)) {
      if (seen.has(gram)) continue;
      seen.add(gram);
      if (HASHES.has(sha256(`${SALT}|${gram}`))) {
        failures++;
        console.log(`FAIL  ${path.relative(ROOT, file)}:${i + 1} — a banned token is present (matched the tripwire; the vault's private sweep names it).`);
      }
    }
  });
}

// ── claims.json integrity ────────────────────────────────────────────────────
const claimsPath = path.join(ROOT, 'claims.json');
if (fs.existsSync(claimsPath)) {
  checks++;
  const artifact = JSON.parse(fs.readFileSync(claimsPath, 'utf8'));
  const stated = artifact.integrity?.canonical;
  const clone = JSON.parse(fs.readFileSync(claimsPath, 'utf8'));
  clone.integrity.canonical = '';
  if (sha256(JSON.stringify(clone, null, 2)) !== stated) {
    failures++;
    console.log('FAIL  claims.json integrity hash does not match its content — it was edited by hand. The contract is compiled in the vault, never edited here.');
  }
  // Any published audit run must be stamped with THIS contract's hash.
  const auditDir = path.join(ROOT, 'audit');
  if (fs.existsSync(auditDir)) {
    for (const f of fs.readdirSync(auditDir).filter((f) => f.endsWith('.json'))) {
      checks++;
      const run = JSON.parse(fs.readFileSync(path.join(auditDir, f), 'utf8'));
      if (run.contract_sha256 && run.contract_sha256 !== stated) {
        console.log(`WARN  audit/${f} was run against a different contract version — re-audit pending.`);
      }
    }
  }
} else {
  checks++;
  failures++;
  console.log('FAIL  claims.json is missing from the repo root.');
}

if (failures) {
  console.log(`\npublic-selftest: ${failures} failure(s) across ${checks} checks.`);
  process.exit(1);
}
console.log(`public-selftest: pass — ${checks} checks, no banned token, contract integrity holds.`);
