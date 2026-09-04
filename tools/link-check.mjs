#!/usr/bin/env node
/**
 * link-check — every internal target on this site resolves to a file that
 * exists; optionally, every external URL still answers.
 *
 *   node tools/link-check.mjs              # internal only — safe for CI, no network
 *   node tools/link-check.mjs --external   # also HEAD/GET every off-site URL
 *   node tools/link-check.mjs --quiet      # only failures
 *
 * WHY. This repo already guards what it SAYS — a hashed leak tripwire, a
 * contract-integrity hash, a case-study build that refuses unapproved figures.
 * It had nothing guarding what it POINTS AT, and the failure mode is specific
 * and has happened here: a nav link shipped to a page that did not exist yet,
 * and four links pointed at a section that had been deleted. Both were caught
 * by a human reading the page, which is not a mechanism.
 *
 * Checked per tracked .html file: href, src, poster, and every candidate in a
 * srcset. Fragment-only links (#work) are resolved against the ids in the same
 * document, so a nav pointing at a section that no longer exists is a failure
 * rather than a silent no-op — that is the exact bug this repo shipped before.
 *
 * NOT checked, deliberately: mailto:, tel:, and data: URIs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXTERNAL = process.argv.includes('--external');
const QUIET = process.argv.includes('--quiet');
const SKIP_DIRS = new Set(['node_modules', '.git', '.github', '.claude', '_audit', 'assets']);

// revops correctly bounces an anonymous visitor to its sign-in page, and the
// counsel API is POST-only, so a GET is a 405 and that is the endpoint working.
// Both are documented on the page itself; neither is a broken link.
const EXPECTED = {
  'https://proof-counsel.vercel.app/api/counsel': [200, 405],
};

function* walkHtml(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const p = path.join(dir, entry);
    if (fs.statSync(p).isDirectory()) yield* walkHtml(p);
    else if (/\.html?$/i.test(entry)) yield p;
  }
}

const targets = [];
for (const file of walkHtml(ROOT)) {
  const source = fs.readFileSync(file, 'utf8');
  // Ids come from the whole document; REFERENCES come from the markup only.
  // A selector built by string concatenation inside a <script> is not a link,
  // and reporting it as a dead one teaches people to ignore this tool — which
  // is the only way a checker ever actually fails.
  const ids = new Set([...source.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const text = source
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const refs = new Set();

  for (const m of text.matchAll(/(?:href|src|poster)="([^"]+)"/g)) refs.add(m[1]);
  for (const m of text.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) refs.add(url);
    }
  }

  for (const raw of refs) {
    const ref = raw.trim();
    if (!ref || /^(mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    targets.push({ file, ref, ids });
  }
}

// THE TRAP THIS TOOL FELL INTO ON ITS FIRST CI RUN.
// It passed locally and failed in CI, because "the file exists" was answered
// against the working tree. Six responsive image variants sat on the author's
// disk, unstaged, while a TRACKED page referenced them — so the check was
// green on the machine that could not see the problem and red on the server
// that served the 404s. A checker whose answer depends on your uncommitted
// state is worse than no checker: it teaches you to trust a green run.
// So a resolved target is now also asked whether git knows about it. This is a
// WARNING rather than a failure, because a legitimately untracked file (a
// draft, a local scratch page) should not block a commit — but it is loud, and
// it names the exact thing CI is about to fail on.
let trackedFiles = null;
try {
  trackedFiles = new Set(
    execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter(Boolean).map((p) => path.resolve(ROOT, p)),
  );
} catch {
  // No git, or not a checkout. Skip the tracking check rather than fail on it.
}

let fails = 0;
let warns = 0;
let checked = 0;
const externals = new Map();

for (const { file, ref, ids } of targets) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');

  if (/^https?:\/\//i.test(ref)) {
    // A self-referencing absolute URL is an internal page in disguise; check it
    // as one, so canonical tags and og:url cannot rot unnoticed.
    const SITE = 'https://alexfc0810.github.io/alex-amaro-portfolio';
    if (ref.startsWith(SITE)) {
      let p = ref.slice(SITE.length).split('#')[0].split('?')[0];
      if (p === '' || p === '/') p = '/index.html';
      const abs = path.join(ROOT, decodeURIComponent(p));
      checked++;
      if (!fs.existsSync(abs)) {
        fails++;
        console.log(`FAIL  ${rel} -> ${ref}  (self-URL, no such file)`);
      }
      continue;
    }
    if (!externals.has(ref)) externals.set(ref, []);
    externals.get(ref).push(rel);
    continue;
  }

  if (ref.startsWith('#')) {
    checked++;
    const id = decodeURIComponent(ref.slice(1));
    if (id && id !== 'top' && !ids.has(id)) {
      fails++;
      console.log(`FAIL  ${rel} -> ${ref}  (no element with that id in this document)`);
    }
    continue;
  }

  const [clean, frag] = ref.split('#');
  if (!clean) continue;
  const abs = path.resolve(path.dirname(file), decodeURIComponent(clean.split('?')[0]));
  checked++;
  if (!fs.existsSync(abs)) {
    fails++;
    console.log(`FAIL  ${rel} -> ${ref}  (missing: ${path.relative(ROOT, abs).replace(/\\/g, '/')})`);
  } else if (trackedFiles && fs.statSync(abs).isFile() && !trackedFiles.has(abs)) {
    warns++;
    console.log(`WARN  ${rel} -> ${ref}  (on your disk but NOT tracked by git — this will 404 once deployed)`);
  } else if (frag && /\.html?$/i.test(abs)) {
    const targetIds = new Set(
      [...fs.readFileSync(abs, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]),
    );
    if (frag !== 'top' && !targetIds.has(decodeURIComponent(frag))) {
      fails++;
      console.log(`FAIL  ${rel} -> ${ref}  (target file exists, fragment #${frag} does not)`);
    }
  }
}

if (!QUIET || warns) {
  console.log(
    `link-check: ${checked} internal target(s) checked, ${fails} failure(s)` +
    (warns ? `, ${warns} untracked-target warning(s)` : '') + '.',
  );
}

if (EXTERNAL) {
  console.log(`link-check: checking ${externals.size} external URL(s)…`);
  for (const [url, files] of externals) {
    let status = 0;
    let note = '';
    try {
      const ctrl = AbortSignal.timeout(20000);
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl });
      // Plenty of hosts refuse HEAD but answer GET; a 405 on HEAD is not a dead link.
      if (res.status === 405 || res.status === 501) {
        res = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(20000) });
      }
      status = res.status;
      if (res.url && res.url !== url) note = ` -> ${res.url}`;
    } catch (e) {
      note = ` (${e.name}: ${e.message})`;
    }
    const ok = EXPECTED[url] ? EXPECTED[url].includes(status) : status >= 200 && status < 400;
    if (!ok) {
      fails++;
      console.log(`FAIL  ${status || 'ERR'}  ${url}${note}\n      linked from: ${files.join(', ')}`);
    } else if (!QUIET) {
      console.log(`  ${status}  ${url}${note}`);
    }
  }
}

if (fails) {
  console.log(`\nlink-check: ${fails} failure(s).`);
  process.exit(1);
}
console.log('link-check: pass — every target resolves.');
