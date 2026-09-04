#!/usr/bin/env node
/**
 * make-og — render assets/og-*.html to the PNG beside it, at exactly 1200x630.
 *
 * ZERO DEPENDENCIES, DELIBERATELY. This repo has no package.json and no
 * node_modules, and that is a feature: every tool here runs on a clean checkout
 * with nothing but Node. So this shells out to a Chrome that is already on the
 * machine rather than pulling in puppeteer.
 *
 *   node tools/make-og.mjs                 # renders assets/og-v2.html
 *   node tools/make-og.mjs og-v3           # renders assets/og-v3.html
 *   CHROME=/path/to/chrome node tools/make-og.mjs
 *
 * WHY THIS EXISTS AT ALL. The card is rendered from HTML that shares the site's
 * tokens, so the social preview cannot drift away from the page it advertises.
 * That only holds if regenerating it is one command. It was not, and the source
 * accumulated two silent bugs: a font path resolving outside the repository
 * (so a regeneration would have rendered the whole card in a fallback face) and
 * a footer advertising a URL that had since become a redirect stub. Both are
 * the kind of thing you find by running the tool, which is the argument for
 * having one.
 *
 * The size check at the end is not decoration. A social card that is not
 * exactly 1200x630 is cropped by the networks in ways nobody reviews.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = (process.argv[2] || 'og-v2').replace(/\.html$/, '');
const src = path.join(ROOT, 'assets', `${name}.html`);
const out = path.join(ROOT, 'assets', `${name}.png`);

if (!fs.existsSync(src)) {
  console.error(`make-og: no such source: assets/${name}.html`);
  process.exit(2);
}

const CANDIDATES = [
  process.env.CHROME,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const chrome = CANDIDATES.find((c) => fs.existsSync(c));
if (!chrome) {
  console.error('make-og: no Chrome found. Set CHROME=/path/to/chrome.');
  console.error('  looked in:\n    ' + CANDIDATES.join('\n    '));
  process.exit(2);
}

// --hide-scrollbars matters: without it Chrome reserves gutter width and the
// card renders 1185px wide, which no reviewer notices and every network crops.
execFileSync(chrome, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  `--screenshot=${out}`,
  pathToFileURL(src).href,
], { stdio: ['ignore', 'ignore', 'inherit'] });

if (!fs.existsSync(out)) {
  console.error('make-og: Chrome exited without writing a file.');
  process.exit(1);
}

// PNG header: width and height are big-endian uint32 at byte 16 and 20.
const buf = fs.readFileSync(out);
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
const kb = Math.round(buf.length / 1024);
console.log(`make-og: assets/${name}.png — ${w}x${h}, ${kb}KB`);

if (w !== 1200 || h !== 630) {
  console.error(`make-og: FAIL — expected 1200x630, got ${w}x${h}.`);
  process.exit(1);
}
console.log('make-og: pass — dimensions are exact. Now OPEN IT AND READ IT: a card is an image, and no automated check in this repo can tell you it says the right thing.');
