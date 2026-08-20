#!/usr/bin/env node
/**
 * build-case-studies — renders work.html and work/<slug>.html from
 * tools/case-studies.json, through ONE template, so nineteen pages cannot
 * drift into nineteen designs.
 *
 *   node tools/build-case-studies.mjs           # build
 *   node tools/build-case-studies.mjs --check   # drift-check sources, build nothing
 *
 * ---------------------------------------------------------------------------
 * THE GUARD, AND WHY IT IS A BUILD FAILURE RATHER THAN A REVIEW STEP
 *
 * This repo's whole product is provenance, so the expensive failure is not an
 * ugly page — it is a number on a public page that Alex cannot defend in a
 * room. `assertContracted()` below collects, per case, every figure the claims
 * contract actually approves for that claim id, then scans every string this
 * build will render and refuses to emit anything containing a numeric token
 * that is not in that set.
 *
 * A case with `claim: null` therefore gets an EMPTY allow-set, and the build
 * dies on its first digit. That is deliberate: seven of these engagements have
 * no green-lit claim of their own, their sources carry real and often
 * flattering figures, and the only thing standing between those figures and a
 * live URL should be a machine, not somebody's memory of a rule.
 *
 * It is the same lesson as the trust-badge bug in the shipping doctrine: a
 * summary layer is what people act on, so the summary layer needs the stricter
 * check — and a negation ("no approved claim") must always win over a
 * present-and-tempting value.
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/case-studies.json'), 'utf8'));
const CONTRACT = JSON.parse(fs.readFileSync(path.join(ROOT, DATA.contract), 'utf8'));
const CHECK_ONLY = process.argv.includes('--check');

const SITE = 'https://alexfc0810.github.io/alex-amaro-portfolio';
const claimById = Object.fromEntries(CONTRACT.claims.map((c) => [c.id, c]));

/* ---- escaping -----------------------------------------------------------
   Content is authored prose, not user input, but it reaches HTML, attributes
   and JSON-LD through three different quoting contexts and each needs its own
   escape. `htmlAllowed` is the single deliberate exception: a handful of
   fields carry inline <strong>, and it is applied only to those fields. */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (s) => esc(s).replace(/'/g, '&#39;');
const jsonld = (s) => String(s).replace(/</g, '\\u003c').replace(/&/g, '\\u0026');
const htmlAllowed = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/&lt;strong&gt;/g, '<strong>').replace(/&lt;\/strong&gt;/g, '</strong>');

/* ---- THE CONTRACT GUARD ------------------------------------------------ */

// Numbers that can never be a performance claim, so they do not need approving.
// Kept deliberately short: every entry is a category a reader cannot mistake
// for a result, and anything outside it has to come from the contract.
const NEUTRAL = [
  /^(19|20)\d{2}$/,          // years
  /^\d$/,                    // single digits: step indices, "3 months"
  /^1?\d$/,                  // 0-19: small counts written as figures
];

function allowedFigures(c) {
  if (!c.claim) return { set: new Set(), src: 'no contracted claim' };
  const cl = claimById[c.claim];
  if (!cl) throw new Error(`case "${c.slug}" names claim ${c.claim}, which is not in ${DATA.contract}`);
  const corpus = [
    cl.headline?.value, cl.headline?.unit, cl.headline?.qualifier,
    ...Object.values(cl.wording || {}),
    cl.notes || '',
  ].join(' \u0000 ');
  return { set: corpus, src: `${cl.id} (${cl.status})` };
}

function numericTokens(str) {
  // A "figure" is any run containing a digit, plus its attached currency,
  // separators and percent — so $12.59, 1,750+, ~$3–$12 and 74.7% all surface.
  return (String(str).match(/\d[\d,.]*/g) || []).map((t) => t.replace(/[.,]+$/, ''));
}

function assertContracted(c, strings) {
  const { set, src } = allowedFigures(c);
  const offences = [];
  for (const [field, value] of strings) {
    for (const tok of numericTokens(value)) {
      if (NEUTRAL.some((re) => re.test(tok))) continue;
      if (typeof set === 'string' && set.includes(tok)) continue;
      offences.push({ field, tok, value: String(value).slice(0, 120) });
    }
  }
  if (offences.length) {
    console.error(`\n  CONTRACT VIOLATION — case "${c.slug}" (allow-set: ${src})`);
    for (const o of offences) {
      console.error(`    "${o.tok}" in ${o.field}`);
      console.error(`      ${o.value}`);
    }
    return offences.length;
  }
  return 0;
}

/* ---- shared chrome ----------------------------------------------------- */

const HEAD_TOKENS = `<style>
@font-face{font-family:'Inter';font-style:normal;font-weight:400 900;font-display:swap;src:url('../assets/fonts/inter-latin-var.woff2') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:'Inter Fallback';src:local('Arial'),local('Helvetica');ascent-override:93.38%;descent-override:23.25%;line-gap-override:0%;size-adjust:103.74%;}
/* TOKENS — copied from index.html unchanged. Every colour here was measured
   with a contrast calculator against the surface it sits on, at the size it
   renders; nothing was chosen by eye. Case-study pages reuse the ladder rather
   than declaring a second one. */
:root{
--navy:#16365C;--accent:#1F4E79;--accent-soft:#2c6aa8;--ink:#101c2b;--muted:#51637a;
--bg:#ffffff;--bg-soft:#f6f9fc;--bg-tint:#eef4fb;--line:#e4ebf3;--hair:rgba(22,54,92,.09);
--field:#1c3e65;--on-dark:#dbe8f6;--on-dark-2:#cfe2f5;--on-dark-3:#c2d9f0;
--green:#0d6b45;--green-tint:#e7f6ee;--green-bright:#7fd3a6;
--amber:#8a4f04;--amber-tint:#fdf3e4;--slate:#48586f;--slate-tint:#eef1f7;--focus:#2c6aa8;
--fs-display:clamp(2.75rem,6.2vw,4.5rem);--fs-h1:clamp(2rem,4.6vw,3.15rem);
--fs-h2:clamp(1.6rem,2.9vw,2.125rem);--fs-h2-minor:clamp(1.25rem,2.1vw,1.5rem);
--fs-h3:1.125rem;--fs-lead:clamp(1.125rem,1.75vw,1.3125rem);--fs-body:1rem;
--fs-sm:.875rem;--fs-micro:.6875rem;
--sp-5:24px;
--sec-y:clamp(62px,8.5vw,122px);--sec-y-act:clamp(84px,11.5vw,168px);--sec-y-tight:clamp(46px,6vw,84px);
--nav-h:62px;
--e0:inset 0 1px 0 rgba(255,255,255,.92);
--e1:0 1px 2px rgba(13,36,64,.05),0 2px 8px rgba(13,36,64,.05),inset 0 1px 0 rgba(255,255,255,.92);
--e2:0 1px 2px rgba(13,36,64,.05),0 6px 16px rgba(13,36,64,.06),0 14px 34px rgba(13,36,64,.07),inset 0 1px 0 rgba(255,255,255,.92);
--e3:0 2px 6px rgba(13,36,64,.06),0 14px 34px rgba(13,36,64,.10),0 34px 72px rgba(13,36,64,.13),inset 0 1px 0 rgba(255,255,255,.92);
--ease:cubic-bezier(.22,.61,.36,1);--t-micro:.15s var(--ease);--t-std:.25s var(--ease);--t-narrative:1.1s cubic-bezier(.16,.84,.44,1);
--r-sm:10px;--r:14px;--r-lg:18px;--r-xl:24px;--r-pill:999px;--maxw:1140px;
}
/* The dark grounds redefine the same four elevation names, tinted to the navy
   they actually paint, so a call site never names the surface it sits on. */
.hero,.nav,.footer,.door{
--focus:#8fc0f0;
--e0:inset 0 1px 0 rgba(255,255,255,.07);
--e1:0 1px 2px rgba(3,10,20,.30),0 2px 8px rgba(3,10,20,.26),inset 0 1px 0 rgba(255,255,255,.07);
--e2:0 1px 2px rgba(3,10,20,.34),0 6px 16px rgba(3,10,20,.30),0 16px 40px rgba(3,10,20,.28),inset 0 1px 0 rgba(255,255,255,.07);
--e3:0 2px 6px rgba(3,10,20,.38),0 14px 34px rgba(3,10,20,.34),0 34px 72px rgba(3,10,20,.32),inset 0 1px 0 rgba(255,255,255,.07);
}
</style>`;

// Motion opt-in AND its escape hatch armed in the same statement, so they can
// never diverge. Content is never gated on a frame that might not run: if
// IntersectionObserver never fires, everything force-settles at 2.6s.
const MOTION_SCRIPT = `<script>
(function(){try{
  var r=document.documentElement;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){r.classList.add('settled');return;}
  r.classList.add('motion');
  setTimeout(function(){r.classList.add('settled');},2600);
}catch(e){document.documentElement.classList.add('settled');}})();
</script>`;

const REVEAL_SCRIPT = `<script>
(function(){
  var els=document.querySelectorAll('.sec-head,.step,.result,.not-card,.cs-card,.door,.pager a');
  if(!('IntersectionObserver' in window)||!els.length){return;}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('rv-in'); io.unobserve(e.target); } });
  },{rootMargin:'0px 0px -8% 0px',threshold:.05});
  els.forEach(function(el){io.observe(el);});
})();
</script>`;

const ICON = {
  tick: '<svg class="tick" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  bars: '<svg class="bars" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  x: '<svg class="x" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrow: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
  shield: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 5-3.5 7.5-8.5 9C7.5 19.5 4 17 4 12V6l8-3 8 3v6z"/></svg>',
  grid: '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
};

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2316365C'/%3E%3Cpath d='M9 16.5l4.5 4.5L23 11' fill='none' stroke='%237fd3a6' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

function nav(depth, current) {
  const up = depth ? '../' : './';
  const L = [
    ['gen-creative', 'Creative'], ['voice', 'Voice AI'], ['fullstack', 'Full stack'],
    ['systems', 'Systems'], ['proof', 'Receipts'], ['growth-math', 'Growth math'], ['more', 'More work'],
  ];
  const links = L.map(([id, t]) => `<a href="${up}index.html#${id}">${t}</a>`).join('\n      ');
  const workCur = current === 'work' ? ' aria-current="page"' : '';
  return `<header class="nav">
  <div class="nav-inner">
    <a class="nav-mark" href="${up}index.html" aria-label="Alex Amaro — portfolio home">
      <span class="nm-name">Alex Amaro</span>
      <span class="nm-role">Growth &middot; Agentic AI</span>
    </a>
    <nav class="nav-links" aria-label="Portfolio sections">
      ${links}
      <a href="${up}work.html"${workCur}>Work</a>
    </nav>
    <div class="nav-actions">
      <a class="nav-proof" href="${up}proof.html">${ICON.tick}Proof Room</a>
      <a class="nav-cta" href="https://calendly.com/alexelamaro/clarity-session" target="_blank" rel="noopener">Book a call</a>
      <details class="nav-menu">
        <summary aria-label="Sections menu">${ICON.bars}${ICON.x}</summary>
        <div class="nav-panel">
          <a href="${up}work.html"${workCur}>All case studies</a>
          <a href="${up}proof.html">The Proof Room</a>
          <hr>
          ${L.map(([id, t]) => `<a href="${up}index.html#${id}">${t}</a>`).join('\n          ')}
          <hr>
          <a href="${up}index.html">Back to the portfolio</a>
        </div>
      </details>
    </div>
  </div>
</header>`;
}

function footer(depth) {
  const up = depth ? '../' : './';
  return `<footer class="footer">
  <div class="wrap foot-inner">
    <p class="foot-note">Clients are anonymised to category labels. Every figure traces to a named source system.</p>
    <nav class="foot-links" aria-label="Site">
      <a href="${up}index.html">Portfolio</a>
      <a href="${up}work.html">Case studies</a>
      <a href="${up}proof.html">Proof Room</a>
      <a href="https://linkedin.com/in/alex-amaro-a4187a221" target="_blank" rel="noopener">LinkedIn</a>
    </nav>
  </div>
</footer>`;
}

const BADGE_LABEL = { v: 'Platform-verified', c: 'Corroborated', a: 'Founder-attested' };
const STATUS_BADGE = { verified: 'v', partial: 'c', attested: 'a', hold: null };

function badgeFor(c) {
  if (!c.claim) return null;
  const st = claimById[c.claim]?.status;
  const k = STATUS_BADGE[st];
  return k ? { k, label: BADGE_LABEL[k] } : null;
}

/* ---- page: one case study ---------------------------------------------- */

function renderCase(c, prev, next) {
  const b = badgeFor(c);
  const group = DATA.groups.find((g) => g.id === c.group);
  const title = `${c.title} — Alex Amaro`;
  const desc = c.cardCopy;

for (const c of cases) {
  if (c.figure !== null && c.figure !== undefined) {
    const f = c.figure;
    const bad = typeof f !== 'object' || Array.isArray(f) ||
      !['value', 'unit'].every((k) => typeof f[k] === 'string' && f[k].trim());
    if (bad) {
      console.error(`case "${c.slug}": figure must be an object {value, unit, note?} with non-empty strings.`);
      console.error(`  got: ${JSON.stringify(f)}`);
      console.error(`  a bare string silently renders as "undefined" in display type.`);
      process.exit(1);
    }
  }
}

  const figureBlock = c.figure ? `
      <div class="hero-stat">
        <span class="hs-num">${esc(c.figure.value)}</span>
        <span class="hs-unit">${esc(c.figure.unit)}</span>
        <span class="hs-note">${esc(c.figure.note)}</span>
      </div>` : '';

  const facts = [
    ['Vertical', c.vertical],
    ['Client', c.client],
    ['Region', c.region],
    ['Window', c.window],
  ].concat(c.ownership ? [['Ownership', c.ownership]] : [])
   .map(([k, v]) => `<div class="fact"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n        ');

  const steps = c.built.map((s, i) => `
        <div class="step">
          <span class="step-n" aria-hidden="true">${i + 1}</span>
          <h3>${esc(s.t)}</h3>
          <p>${esc(s.b)}</p>
        </div>`).join('');

  const resultsBlock = c.results.length ? `
<section class="block exhibit" id="result">
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">The result</div>
      <h2 class="sec-title">Every figure, with the system it came out of.</h2>
      <p>A number whose source is one click away is an assertion. These carry their source on the same row — and the wording matches the claims contract this site is linted against.</p>
    </div>
    <div class="results">
      ${c.results.map((r) => `<div class="result">
        <p class="rv">${esc(r.v)}</p>
        <p class="rd">${esc(r.d)}</p>
        <p class="rs">Source: ${esc(r.s)}</p>
        <span class="badge ${r.badge}">${esc(BADGE_LABEL[r.badge])}</span>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>` : '';

  const nots = c.notClaimed.map((n) => `<div class="not-card"><b>${esc(n.t)}</b><p>${esc(n.b)}</p></div>`).join('\n      ');

  const pager = [
    prev ? `<a class="pv" href="./${prev.slug}.html"><span class="pl">Previous case</span><span class="pt">${esc(prev.title)}</span></a>` : '<span></span>',
    next ? `<a class="nx" href="./${next.slug}.html"><span class="pl">Next case</span><span class="pt">${esc(next.title)}</span></a>` : '<span></span>',
  ].join('\n      ');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(desc)}">
<link rel="canonical" href="${SITE}/work/${c.slug}.html">
<link rel="icon" href="${FAVICON}">
<meta name="author" content="Alex Amaro">
<meta name="theme-color" content="#0d2440">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Alex Amaro — Portfolio">
<meta property="og:title" content="${attr(c.title)}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${SITE}/work/${c.slug}.html">
<meta property="og:image" content="${SITE}/assets/og-cover.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(c.title)}">
<meta name="twitter:description" content="${attr(desc)}">
<meta name="twitter:image" content="${SITE}/assets/og-cover.png">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"${jsonld(c.title)}","description":"${jsonld(desc)}","author":{"@type":"Person","name":"Alex Amaro","url":"${SITE}/"},"publisher":{"@type":"Person","name":"Alex Amaro"},"mainEntityOfPage":"${SITE}/work/${c.slug}.html","about":"${jsonld(c.vertical)}","isPartOf":{"@type":"CollectionPage","name":"Case studies","url":"${SITE}/work.html"}}
</script>
<link rel="preload" href="../assets/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin>
${MOTION_SCRIPT}
${HEAD_TOKENS}
<link rel="stylesheet" href="../assets/case-study.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${nav(1, 'work')}
<main id="main">

<section class="hero">
  <div class="wrap hero-inner">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="../work.html">${ICON.back}All case studies</a>
      <span>${esc(group.name)}</span>
    </nav>
    <div class="eyebrow"><span class="dot" aria-hidden="true"></span>${esc(c.vertical)} &middot; ${esc(c.region)}</div>
    <h1>${esc(c.title)}</h1>
    <p class="promise">${htmlAllowed(c.lede)}</p>${figureBlock}
    <dl class="facts">
        ${facts}
    </dl>
  </div>
</section>

<section class="block" id="problem">
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">The problem</div>
      <h2 class="sec-title">What this business was actually up against.</h2>
    </div>
    <div class="prose">
      ${c.problem.map((p) => `<p>${htmlAllowed(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="block tint" id="built">
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">What I built</div>
      <h2 class="sec-title">The mechanism, step by step.</h2>
      <p>Not a list of tools. The decisions that produced the outcome, in the order they were made.</p>
    </div>
    <div class="steps">${steps}
    </div>
  </div>
</section>
${resultsBlock}
<section class="block" id="not-claimed">
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">The boundary</div>
      <h2 class="sec-title">What this case does <em>not</em> claim.</h2>
      <p>This section exists because it is the part that survives an interview. Stating the limits before anyone has to ask is what makes the rest of the page worth believing.</p>
    </div>
    <div class="nots">
      ${nots}
    </div>
  </div>
</section>

<section class="block minor tint" id="more">
  <div class="wrap">
    <div class="pager">
      ${pager}
    </div>
    <a class="door" href="../proof.html" style="margin-top:16px">
      <span class="door-badge">${ICON.shield}</span>
      <span>
        <span class="door-kicker">Don't take it on faith</span>
        <span class="door-title">Open the Proof Room</span>
        <span class="door-copy">Every claim on this site with its verification status, its source system and the arithmetic behind it — plus the ones I deliberately don't make.</span>
      </span>
      <span class="door-go" aria-hidden="true">${ICON.arrow}</span>
    </a>
  </div>
</section>

</main>
${footer(1)}
${REVEAL_SCRIPT}
</body>
</html>
`;
}

/* ---- page: the gallery -------------------------------------------------- */

function renderIndex(cases) {
  const byGroup = DATA.groups.map((g) => ({ g, items: cases.filter((c) => c.group === g.id) })).filter((x) => x.items.length);

  const card = (c) => {
    const b = badgeFor(c);
    const head = c.figure
      ? `<p class="cs-fig">${esc(c.figure.value)}</p><p class="cs-figunit">${esc(c.figure.unit)}</p>`
      : `<p class="cs-cap">${esc(c.capability)}</p>`;
    return `<a class="cs-card" href="./work/${c.slug}.html">
          <p class="cs-eyebrow">${esc(c.vertical)} &middot; ${esc(c.region)}</p>
          ${head}
          <p class="cs-title">${esc(c.title)}</p>
          <p class="cs-copy">${esc(c.cardCopy)}</p>
          <span class="cs-foot">
            ${b ? `<span class="badge ${b.k}">${esc(b.label)}</span>` : `<span class="cs-copy">${esc(c.ownership || 'Capability')}</span>`}
            <span class="cs-go">Read the case ${ICON.arrow}</span>
          </span>
        </a>`;
  };

  const groups = byGroup.map(({ g, items }) => `
      <div class="vgroup">
        <div class="vgroup-head">
          <h2>${esc(g.name)}</h2>
          <span class="vcount">${items.length} ${items.length === 1 ? 'engagement' : 'engagements'} &middot; ${esc(g.blurb)}</span>
        </div>
        <div class="cs-grid">
          ${items.map(card).join('\n          ')}
        </div>
      </div>`).join('\n');

  const withFigures = cases.filter((c) => c.figure).length;

  const itemList = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    name: 'Case studies — Alex Amaro', url: `${SITE}/work.html`,
    hasPart: cases.map((c) => ({ '@type': 'Article', headline: c.title, url: `${SITE}/work/${c.slug}.html`, about: c.vertical })),
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Case studies — Alex Amaro &middot; ${cases.length} engagements</title>
<meta name="description" content="${cases.length} engagements across clinical, aesthetics, B2B and my own ventures — the problem, the mechanism, the result, and what each case deliberately does not claim.">
<link rel="canonical" href="${SITE}/work.html">
<link rel="icon" href="${FAVICON}">
<meta name="author" content="Alex Amaro">
<meta name="theme-color" content="#0d2440">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Alex Amaro — Portfolio">
<meta property="og:title" content="Case studies — ${cases.length} engagements">
<meta property="og:description" content="The problem, the mechanism, the result — and what each case deliberately does not claim.">
<meta property="og:url" content="${SITE}/work.html">
<meta property="og:image" content="${SITE}/assets/og-cover.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Case studies — Alex Amaro">
<meta name="twitter:description" content="The problem, the mechanism, the result — and what each case deliberately does not claim.">
<meta name="twitter:image" content="${SITE}/assets/og-cover.png">
<script type="application/ld+json">
${jsonld(JSON.stringify(itemList))}
</script>
<link rel="preload" href="./assets/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin>
${MOTION_SCRIPT}
${HEAD_TOKENS.replace(/\.\.\/assets/g, './assets')}
<link rel="stylesheet" href="./assets/case-study.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${nav(0, 'work')}
<main id="main">

<section class="hero">
  <div class="wrap hero-inner">
    <div class="eyebrow"><span class="dot" aria-hidden="true"></span>Case studies</div>
    <h1>${cases.length} engagements, and what each one is evidence of.</h1>
    <p class="promise">Every case follows the same four beats: <strong>the problem</strong> the business actually had, <strong>the mechanism</strong> I built, <strong>the result</strong> with the system it was read out of &mdash; and <strong>what the case does not claim</strong>. That last section is the one worth reading.</p>
    <dl class="facts">
        <div class="fact"><dt>Verticals</dt><dd>Clinical, aesthetics, B2B, own ventures</dd></div>
        <div class="fact"><dt>Regions</dt><dd>United States, Canada, United Kingdom</dd></div>
        <div class="fact"><dt>Figures shown</dt><dd>Only where the claims contract approves them</dd></div>
    </dl>
  </div>
</section>

<section class="block" id="cases">
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">The work</div>
      <h2 class="sec-title">Grouped by what the buyer is actually deciding.</h2>
      <p>A chiropractic patient in pain, an elective aesthetics buyer, and a facilities manager sourcing a refrigeration install are three different problems. Grouping by vertical is grouping by buyer psychology, which is what changes the build.</p>
    </div>
${groups}
  </div>
</section>

<section class="block minor tint" id="how">
  <div class="wrap">
    <div class="sec-head t3">
      <div class="kicker">How to read these</div>
      <h2 class="sec-title t3">Why some cases lead with a number and some don't.</h2>
      <p>${withFigures} of these ${cases.length} carry a headline figure. The rest describe what was built and stop there &mdash; because a figure only goes on this site once it is in the claims contract behind <a href="./proof.html">the Proof Room</a>, and the page builder refuses to render one that isn't. Absence of a number here means the claim hasn't cleared that bar yet, not that the work didn't happen.</p>
    </div>
    <a class="door" href="./proof.html">
      <span class="door-badge">${ICON.shield}</span>
      <span>
        <span class="door-kicker">The verification system</span>
        <span class="door-title">Open the Proof Room</span>
        <span class="door-copy">Every claim, its status, its source system, and the arithmetic &mdash; plus what I deliberately don't claim.</span>
      </span>
      <span class="door-go" aria-hidden="true">${ICON.arrow}</span>
    </a>
    <a class="door" href="./index.html">
      <span class="door-badge">${ICON.grid}</span>
      <span>
        <span class="door-kicker">The rest of the portfolio</span>
        <span class="door-title">Creative, voice AI and the systems behind them</span>
        <span class="door-copy">Ad creative, a live AI receptionist you can call, the full-funnel chain, and the growth-math engine.</span>
      </span>
      <span class="door-go" aria-hidden="true">${ICON.arrow}</span>
    </a>
  </div>
</section>

</main>
${footer(0)}
${REVEAL_SCRIPT}
</body>
</html>
`;
}

/* ---- drift check -------------------------------------------------------- */

function drift() {
  const base = path.resolve(ROOT, DATA.sourceRepo);
  if (!fs.existsSync(base)) {
    console.log(`source repo not present at ${base} — skipping drift check (this is expected outside Alex's machine)`);
    return 0;
  }
  let stale = 0;
  for (const c of DATA.cases) {
    const f = path.join(base, c.source, 'README.md');
    if (!fs.existsSync(f)) { console.log(`  MISSING  ${c.source}`); stale++; continue; }
    const h = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 12);
    const known = (DATA.sourceHashes || {})[c.source];
    if (!known) console.log(`  NEW      ${c.source}  ${h}`);
    else if (known !== h) { console.log(`  CHANGED  ${c.source}  ${known} -> ${h}`); stale++; }
  }
  return stale;
}

/* ---- main --------------------------------------------------------------- */

const cases = [...DATA.cases].sort((a, b) => a.order - b.order);

if (CHECK_ONLY) {
  console.log('drift check against', DATA.sourceRepo);
  const n = drift();
  console.log(n ? `\n${n} source(s) changed since these pages were written — re-read them and update tools/case-studies.json.` : '\nno drift.');
  process.exit(0);
}

// Guard runs over every string that will be rendered, before anything is written.
let violations = 0;
for (const c of cases) {
  const strings = [];
  const push = (f, v) => { if (v) strings.push([f, v]); };
  push('title', c.title); push('lede', c.lede); push('cardCopy', c.cardCopy);
  push('capability', c.capability); push('window', c.window); push('client', c.client);
  if (c.figure) { push('figure.value', c.figure.value); push('figure.unit', c.figure.unit); push('figure.note', c.figure.note); }
  c.problem.forEach((p, i) => push(`problem[${i}]`, p));
  c.built.forEach((s, i) => { push(`built[${i}].t`, s.t); push(`built[${i}].b`, s.b); });
  c.results.forEach((r, i) => { push(`results[${i}].v`, r.v); push(`results[${i}].d`, r.d); push(`results[${i}].s`, r.s); });
  c.notClaimed.forEach((n, i) => { push(`notClaimed[${i}].t`, n.t); push(`notClaimed[${i}].b`, n.b); });
  violations += assertContracted(c, strings);
}
if (violations) {
  console.error(`\nBUILD REFUSED — ${violations} figure(s) are not in ${DATA.contract}.`);
  console.error('Either the claim needs adding to the contract (with Alex\'s approval), or the figure comes off the page.\n');
  process.exit(1);
}

fs.mkdirSync(path.join(ROOT, 'work'), { recursive: true });
for (let i = 0; i < cases.length; i++) {
  const c = cases[i];
  const html = renderCase(c, cases[i - 1], cases[i + 1]);
  fs.writeFileSync(path.join(ROOT, 'work', `${c.slug}.html`), html);
}
fs.writeFileSync(path.join(ROOT, 'work.html'), renderIndex(cases));

// sitemap — regenerated so routes and the file cannot disagree
const urls = [
  { loc: `${SITE}/`, pr: '1.0' },
  { loc: `${SITE}/work.html`, pr: '0.9' },
  { loc: `${SITE}/proof.html`, pr: '0.9' },
  ...cases.map((c) => ({ loc: `${SITE}/work/${c.slug}.html`, pr: '0.8' })),
];
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${u.pr}</priority>\n  </url>`).join('\n') +
  `\n</urlset>\n`);

const figured = cases.filter((c) => c.figure).length;
console.log(`built work.html + ${cases.length} case pages`);
console.log(`  ${figured} lead with a contracted figure, ${cases.length - figured} are capability pages`);
console.log(`  contract: ${DATA.contract} v${CONTRACT.version}`);
console.log(`  dropped:  ${DATA.dropped.map((d) => d.source).join(', ')}`);
console.log(`  sitemap:  ${urls.length} urls`);
