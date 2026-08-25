#!/usr/bin/env node
/* ============================================================================
   Generates ../creative.html from ./creative-manifest.mjs.

   WHY A GENERATOR: fifty-four <picture> blocks, each with three srcset widths,
   is fifty-four chances to typo a path that still renders — the browser quietly
   falls back to the jpg and nobody notices the webp never loaded. Two files in
   this library genuinely have no webp, so "it looked fine" proves nothing; the
   generator checks the disk instead. This follows the pattern already set by
   tools/build-case-studies.mjs. The prose is still written by hand: it lives in
   the template below and in the manifest, not in a CMS.

   Run:  node tools/build-creative-wall.mjs
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { items, videos } from './creative-manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTHS = [320, 480, 720];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Only advertise a webp that is actually on disk. Two files in the library ship
   as jpg only; emitting a phantom <source> for them would silently fall back
   and look like it worked. */
function srcset(dir, base) {
  const have = WIDTHS.filter((w) => fs.existsSync(path.join(ROOT, 'assets', dir, `${base}-${w}.webp`)));
  if (!have.length) return null;
  return have.map((w) => `./assets/${dir}/${base}-${w}.webp ${w}w`).join(', ');
}

function tile(it, sizes) {
  const ss = srcset(it.dir, it.base);
  const jpg = `./assets/${it.dir}/${it.base}.jpg`;
  const source = ss ? `<source type="image/webp" srcset="${ss}" sizes="${sizes}">` : '';
  return `<button class="tile" type="button"
  data-vertical="${it.vertical}" data-set="${it.set || ''}" data-prov="${it.provenance}" data-kind="${it.kind}"
  data-title="${esc(it.title)}" data-hook="${esc(it.hook)}" data-offer="${esc(it.offer)}"
  data-variable="${esc(it.variable)}" data-full="${jpg}" data-w="${it.w}" data-h="${it.h}"
  data-alt="${esc(it.alt)}" aria-label="Open ${esc(it.title)} — ${esc(it.hook)}">
  <picture>${source}<img src="${jpg}" width="${it.w}" height="${it.h}" loading="lazy" decoding="async" alt="${esc(it.alt)}"></picture>
  <span class="tile-meta t-label"><i></i>${esc(it.title)}</span>
</button>`;
}

const WALL_SIZES = '(max-width:560px) 46vw, (max-width:900px) 30vw, (max-width:1300px) 22vw, 17vw';
const SET_SIZES = '(max-width:560px) 46vw, (max-width:900px) 30vw, 240px';

const wall = items.map((it) => tile(it, WALL_SIZES)).join('\n');
const setGrid = (name) => items.filter((i) => i.set === name).map((it) => tile(it, SET_SIZES)).join('\n');

const videoBlock = videos.map((v) => `<figure class="film">
  <video controls preload="none" playsinline poster="./assets/${v.dir}/${v.base}.jpg" width="${v.w}" height="${v.h}">
    <source src="./assets/${v.dir}/${v.base}.mp4" type="video/mp4">
  </video>
  <figcaption>
    <p class="t-label"><i class="dot"></i>${esc(v.title)}</p>
    <p class="t-cap">${esc(v.hook)}</p>
    <p class="t-cap dim">${esc(v.variable)}</p>
  </figcaption>
</figure>`).join('\n');

const counts = {
  total: items.length + videos.length,
  client: items.filter((i) => i.provenance === 'client').length,
  own: items.filter((i) => i.provenance !== 'client').length + videos.length,
  sets: 3,
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Creative Wall — Alex Amaro</title>
<meta name="description" content="${counts.total} ad creatives, shown as tests rather than as a reel: one chiropractic offer written eight ways, one laser offer art-directed six ways, one body-contouring offer cast five ways, and a 30-still own-brand exploration. Every tile labelled client work or concept.">
<meta name="author" content="Alex Amaro">
<link rel="canonical" href="https://alexfc0810.github.io/alex-amaro-portfolio/creative.html">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Alex Amaro">
<meta property="og:title" content="The Creative Wall — Alex Amaro">
<meta property="og:description" content="A reel shows you output. This shows you the variable that moved. ${counts.total} pieces, every one labelled client work or concept.">
<meta property="og:url" content="https://alexfc0810.github.io/alex-amaro-portfolio/creative.html">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="The Creative Wall — Alex Amaro">
<meta name="twitter:description" content="A reel shows you output. This shows you the variable that moved.">
<meta name="theme-color" content="#08080a">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%2308080a'/%3E%3Crect x='7' y='14.5' width='18' height='3' rx='1.5' fill='%23f59e0b'/%3E%3C/svg%3E">

<!-- Motion opt-in AND its escape hatch, armed in the same statement so they can
     never diverge. Whatever happens to the rest of this page's JS, everything
     force-settles 2.6s later. An entrance animation starting at opacity:0 has
     produced a blank screen in this portfolio once already. -->
<script>
(function(){try{
  var r=document.documentElement;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){r.classList.add('settled');return;}
  r.classList.add('motion');
  setTimeout(function(){r.classList.add('settled');},2600);
}catch(e){document.documentElement.classList.add('settled');}})();
</script>

<link rel="preload" href="./assets/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<style>
/* ============================================================================
   THE CREATIVE WALL — a gallery register of the house system in ./v2/DESIGN.md.

   Same family, different room. The house system was tuned for an instrument
   panel; this page is a gallery, and two things change because of it.

   1 — THE GROUND LADDER IS RESPACED, AND THAT IS A FIX, NOT A PREFERENCE.
       The shipped ladder measures 1.051 / 1.042 / 1.064 between adjacent
       grounds. The reference band for a system that uses tone instead of shadow
       for depth is a 1.15 FLOOR and roughly 1.3 as the target; steps near 1.04
       collapse into one plane on a phone at 40% brightness. This page runs
       #08080a -> #1a1a1f -> #2a2a32, which measures 1.154 and 1.218 ON THE
       RENDER — computed style, not the stylesheet, because source shows what
       was intended and only the render shows what shipped. Three grounds rather
       than four, spaced far enough apart to actually read as depth. Recomputed
       here rather than inherited, because the inherited numbers fail.

       Same pass on the render: 7 distinct type styles, weight ceiling held at
       590, and zero contrast failures across every text node on the page.

   2 — TYPE GOES UP AND TIGHTENS. Benchmarked against Cosmos, whose whole job is
       also a wall of images: display at 74px with leading BELOW 1 and tracking
       near -0.05em, and hero weight kept low so the page reads editorial rather
       than promotional. Cosmos's own stated principle is the one this page was
       already built on -- "the chrome is invisible so the images can shout" --
       and the second benchmark, ORYZO, supplies the other half: a single object
       treated as a museum artifact, in-context on the wall and isolated in the
       void when you open it. That is exactly what the lightbox does.

   What does NOT change: no box-shadow anywhere. Weight ceiling 590. Three
   radii. One accent, used as a ring and a marker and never as a glow. Zero
   off-origin requests. Colour on this page comes from the creative and from
   nothing else -- which is the entire reason the chrome is this quiet.
   ============================================================================ */

@font-face{
  font-family:'Inter'; font-style:normal; font-weight:400 900; font-display:swap;
  src:url('./assets/fonts/inter-latin-var.woff2') format('woff2');
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
@font-face{
  font-family:'Inter Fallback';
  src:local('Arial'),local('Helvetica');
  ascent-override:93.38%; descent-override:23.25%; line-gap-override:0%; size-adjust:103.74%;
}

:root{
  /* Grounds — three, measured. See the note above for why not four. */
  --bg:#08080a;        /* the void: page, and the wall itself */
  --bg-card:#1a1a1f;   /* 1.156 against --bg — panels, the filter rail, the brief */
  --bg-raise:#2a2a32;  /* 1.195 against --bg-card — hover, chips, the raised edge */

  --border:#26262c;
  --border-soft:#1b1b21;
  --border-lit:rgba(245,158,11,.34);

  --text:#ececf1;        /* 16.99:1 on --bg */
  --text-dim:#a1a1aa;    /*  7.80:1 on --bg */
  --text-faint:#8b8b96;  /*  5.94:1 on --bg — never #6b6b76, which fails at 3.76 */

  --accent:#f59e0b;      /*  9.36:1 on --bg. A ring and a marker. Never a glow. */
  --link:#fbbf24;        /* 10.50:1 on --bg-card */

  --sans:'Inter','Inter Fallback',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  --mono:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace;

  --w-reg:400; --w-med:520; --w-semi:560; --w-max:590;

  /* Gallery register: bigger and tighter than the instrument-panel ramp. */
  --fs-display:clamp(40px,8.2vw,74px);
  --fs-h1:clamp(30px,5vw,44px);
  --fs-h2:clamp(25px,3.6vw,32px);
  --fs-h3:22px;
  --fs-lead:19px;
  --fs-body:16px;
  --fs-caption:13px;
  --fs-label:12px;
  --fs-data:15px;
  --fs-figure:28px;

  --r-sm:4px; --r-md:10px; --r-full:999px;

  --measure:760px;
  --rail:1320px;
  --section:clamp(72px,9vw,116px);
}

*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0; background:var(--bg); color:var(--text);
  font-family:var(--sans); font-size:var(--fs-body); font-weight:var(--w-reg);
  letter-spacing:-.011em; line-height:1.60;
  -webkit-font-smoothing:antialiased;
}
img,video{max-width:100%; height:auto; display:block}
strong,b{font-weight:var(--w-med)}
a{color:var(--link); text-decoration:none; border-bottom:1px solid rgba(251,191,36,.28)}
a:hover{border-bottom-color:var(--link)}
:focus-visible{outline:2px solid var(--accent); outline-offset:3px; border-radius:var(--r-sm)}

/* --- Type roles. Size and colour carry hierarchy; bold never does. -------- */
.t-display{font-size:var(--fs-display); font-weight:var(--w-max); letter-spacing:-.05em; line-height:.95; margin:0}
.t-h1{font-size:var(--fs-h1); font-weight:var(--w-semi); letter-spacing:-.035em; line-height:1.06; margin:0}
.t-h2{font-size:var(--fs-h2); font-weight:var(--w-semi); letter-spacing:-.028em; line-height:1.18; margin:0}
.t-h3{font-size:var(--fs-h3); font-weight:var(--w-med); letter-spacing:-.022em; line-height:1.32; margin:0}
.t-lead{font-size:var(--fs-lead); font-weight:var(--w-reg); letter-spacing:-.018em; line-height:1.50; color:var(--text-dim); margin:0}
.t-cap{font-size:var(--fs-caption); letter-spacing:-.005em; line-height:1.55; color:var(--text-dim); margin:0}
.t-cap.dim{color:var(--text-faint)}
.t-label{font-family:var(--mono); font-size:var(--fs-label); font-weight:var(--w-med);
  letter-spacing:.08em; line-height:1.40; text-transform:uppercase; margin:0}
.t-data{font-family:var(--mono); font-size:var(--fs-data); letter-spacing:-.005em; line-height:1.50}
.t-figure{font-family:var(--mono); font-size:var(--fs-figure); letter-spacing:-.02em; line-height:1.10; margin:0}

.measure{max-width:var(--measure); margin:0 auto; padding:0 24px}
.rail{max-width:var(--rail); margin:0 auto; padding:0 24px}

.skip{position:absolute; left:-9999px; top:0; background:var(--bg-card); color:var(--text);
  padding:12px 18px; border:1px solid var(--border); border-radius:var(--r-sm); z-index:60}
.skip:focus{left:12px; top:12px}

/* --- Nav ----------------------------------------------------------------- */
.nav{position:sticky; top:0; z-index:40; background:rgba(8,8,10,.86);
  backdrop-filter:saturate(140%) blur(10px); border-bottom:1px solid var(--border-soft)}
.nav-in{max-width:var(--rail); margin:0 auto; padding:14px 24px; display:flex; gap:22px; align-items:center; flex-wrap:wrap}
.nav a{color:var(--text-faint); border-bottom:0}
.nav a:hover{color:var(--text)}
.nav .nav-mark{color:var(--text); margin-right:auto}
.nav a[aria-current]{color:var(--accent)}

/* --- Hero ----------------------------------------------------------------
   Hero copy sits on the RAIL, not on the reading measure, so its left edge
   lines up with the count strip and the wall beneath it. A 760px measure
   centred inside a 1320px rail starts 280px to the right of everything below
   it, and the eye reads that as two pages stapled together. The measure is
   preserved where it belongs — as a max-width on the paragraph. */
.hero{padding:clamp(56px,8vw,104px) 0 clamp(36px,4vw,56px)}
.eyebrow{color:var(--accent); display:flex; align-items:center; gap:10px}
.eyebrow::after{content:''; flex:1; height:1px; background:var(--border-soft)}
.hero .t-display{margin-top:20px; max-width:18ch}
.hero .t-lead{margin-top:24px; max-width:66ch}

/* The count strip. Mono so a changing figure never reflows its neighbour. */
.strip{max-width:var(--rail); margin:44px auto 0; padding:0 24px;
  display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:1px;
  background:var(--border-soft); border:1px solid var(--border-soft); border-radius:var(--r-md); overflow:hidden}
.strip div{background:var(--bg-card); padding:18px 20px}
.strip .t-figure{color:var(--text)}
.strip .t-label{color:var(--text-faint); margin-top:8px}

/* --- The honesty bar. Deliberately above the work, not buried under it. --- */
.honest{max-width:var(--rail); margin:18px auto 0; padding:0 24px}
.honest div{border:1px solid var(--border); border-left:2px solid var(--accent);
  border-radius:var(--r-sm); background:var(--bg-card); padding:16px 20px}

/* --- Filter rail ----------------------------------------------------------
   The wrapper is what stops the chips following you into the three test
   sections, where they control nothing. A sticky element is released at the end
   of its containing block, so scoping the block to filters+wall is the whole
   fix — no scroll listener, no observer, nothing to desynchronise. */
.wallwrap{position:relative}
.filters{position:sticky; top:53px; z-index:30; background:rgba(8,8,10,.92);
  backdrop-filter:blur(10px); border-bottom:1px solid var(--border-soft); padding:14px 0; margin-top:var(--section)}
.filters-in{max-width:var(--rail); margin:0 auto; padding:0 24px; display:flex; gap:10px; align-items:center; flex-wrap:wrap}
.chip{font-family:var(--mono); font-size:var(--fs-label); font-weight:var(--w-med); letter-spacing:.08em;
  text-transform:uppercase; color:var(--text-faint); background:transparent; cursor:pointer;
  border:1px solid var(--border); border-radius:var(--r-full); padding:7px 14px; line-height:1}
.chip:hover{background:var(--bg-raise); color:var(--text)}
.chip[aria-pressed="true"]{color:var(--bg); background:var(--accent); border-color:var(--accent)}
.count{margin-left:auto; color:var(--text-faint); white-space:nowrap}

/* Two sticky bars do not fit on a phone. The nav wraps to two lines, the chip
   rail wraps to three, and the filter bar's fixed 53px offset — correct on a
   desktop where the nav is one line — then parks the first row of chips
   underneath it, unreachable. Rather than chase the nav's height with a
   variable that any future nav item can invalidate, the nav simply stops being
   sticky below this width and the chips become a single-line scroller, which is
   the pattern a phone user already expects from a filter rail. */
@media(max-width:760px){
  .nav{position:static}
  .filters{top:0}
  .filters-in{flex-wrap:nowrap; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none}
  .filters-in::-webkit-scrollbar{display:none}
  .chip{flex:none}
  .count{margin-left:6px; padding-right:4px}
}

/* --- THE WALL. Columns, not grid: a masonry that never crops a creative.
       Cropping an ad to make a tidy grid destroys the thing being shown. ---- */
.wall{max-width:var(--rail); margin:0 auto; padding:28px 24px 0; columns:6 200px; column-gap:14px}
@media(max-width:900px){.wall{columns:3 150px; column-gap:10px}}
@media(max-width:560px){.wall{columns:2 130px; column-gap:8px}}

.tile{display:block; width:100%; margin:0 0 14px; padding:0; border:0; background:transparent;
  cursor:zoom-in; position:relative; break-inside:avoid; -webkit-column-break-inside:avoid;
  border-radius:var(--r-sm); overflow:hidden; line-height:0}
@media(max-width:900px){.tile{margin-bottom:10px}}
.tile img{width:100%; height:auto; border-radius:var(--r-sm);
  transition:opacity .32s ease, filter .32s ease}
/* The ring is the accent doing its one job. There is no glow and no shadow. */
.tile::after{content:''; position:absolute; inset:0; border-radius:var(--r-sm);
  border:1px solid transparent; transition:border-color .22s ease; pointer-events:none}
.tile:hover::after,.tile:focus-visible::after{border-color:var(--border-lit)}
.tile:hover img{filter:saturate(1.04)}

/* The tile label rises on hover. On touch it simply never appears, which is
   correct — a hover affordance that latches on tap is worse than none. */
.tile-meta{position:absolute; left:0; right:0; bottom:0; padding:20px 10px 8px;
  color:var(--text); background:linear-gradient(to top,rgba(8,8,10,.92),rgba(8,8,10,0));
  display:flex; align-items:center; gap:7px; text-align:left; line-height:1.4;
  opacity:0; transform:translateY(6px); transition:opacity .22s ease, transform .22s ease}
.tile-meta i{width:5px; height:5px; border-radius:50%; background:var(--accent); flex:none}
.tile:hover .tile-meta,.tile:focus-visible .tile-meta{opacity:1; transform:none}
@media(hover:none){.tile-meta{display:none}}
.tile[hidden]{display:none}

/* --- Section furniture --------------------------------------------------- */
section{padding:var(--section) 0}
.sec-head{max-width:var(--measure)}
.sec-head .t-h2,.sec-head .t-h1{margin-top:18px}
.sec-head .t-lead{margin-top:18px}

/* --- A test case: the constant/variable panel, then the set ---------------- */
.test{border-top:1px solid var(--border-soft); padding-top:34px; margin-top:56px}
.cv{display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1px;
  background:var(--border-soft); border:1px solid var(--border-soft); border-radius:var(--r-md);
  overflow:hidden; margin-top:26px}
.cv > div{background:var(--bg-card); padding:20px 22px}
.cv .t-label{color:var(--text-faint)}
.cv .t-label.on{color:var(--accent)}
.cv p+p{margin-top:10px}
/* A test set is a MATRIX, not a flow. Letting eight variants reflow to six
   across leaves a two-item orphan row, which reads as "ran out of ads" instead
   of "this is the shape of the test". Column counts are therefore declared per
   set — 8 as 4x2, 6 as 3x2, 5 as one row — and only collapse below 900px. */
.setgrid{display:grid; gap:14px; margin-top:26px; grid-template-columns:repeat(3,1fr)}
@media(min-width:901px){
  .setgrid[data-cols="4"]{grid-template-columns:repeat(4,1fr)}
  .setgrid[data-cols="3"]{grid-template-columns:repeat(3,1fr)}
  .setgrid[data-cols="5"]{grid-template-columns:repeat(5,1fr)}
}
@media(max-width:560px){.setgrid{grid-template-columns:repeat(2,1fr); gap:8px}}
.setgrid .tile{margin:0}

/* --- Motion -------------------------------------------------------------- */
.films{display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,300px)); gap:26px; margin-top:32px}
.film{margin:0}
.film video{width:100%; height:auto; border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-card)}
.film figcaption{margin-top:14px}
.film .t-label{color:var(--text); display:flex; align-items:center; gap:8px}
.film .dot{width:5px; height:5px; border-radius:50%; background:var(--accent); flex:none}
.film .t-cap{margin-top:8px}

/* --- Lightbox: ORYZO's void mode. The wall is context; this is isolation. -- */
.lb[hidden]{display:none}
/* Solid, not translucent. A 97% scrim still lets a saturated ad bleed through
   from the wall behind, and the whole point of void mode is that one object is
   alone in the dark. Isolation that is 97% isolated is just a dirty window. */
.lb{position:fixed; inset:0; z-index:70; background:var(--bg);
  display:grid; grid-template-rows:auto 1fr; padding:0}
.lb-bar{display:flex; align-items:center; gap:16px; padding:14px 20px; border-bottom:1px solid var(--border-soft)}
.lb-bar .t-label{color:var(--text-faint)}
.lb-bar .idx{color:var(--accent)}
.lb-btn{margin-left:auto; background:transparent; border:1px solid var(--border); border-radius:var(--r-full);
  color:var(--text-faint); font-family:var(--mono); font-size:var(--fs-label); letter-spacing:.08em;
  text-transform:uppercase; padding:7px 14px; cursor:pointer; line-height:1}
.lb-btn:hover{background:var(--bg-raise); color:var(--text)}
.lb-nav{background:transparent; border:1px solid var(--border); border-radius:var(--r-full);
  color:var(--text-dim); width:34px; height:34px; cursor:pointer; font-size:15px; line-height:1; flex:none}
.lb-nav:hover{background:var(--bg-raise); color:var(--text)}
.lb-body{display:grid; grid-template-columns:minmax(0,1fr) 380px; gap:0; min-height:0; overflow:hidden}
.lb-stage{display:grid; place-items:center; padding:28px; min-height:0; overflow:auto}
.lb-stage img{max-width:100%; max-height:calc(100vh - 140px); width:auto; height:auto;
  border-radius:var(--r-sm); border:1px solid var(--border-soft)}
.lb-brief{border-left:1px solid var(--border-soft); background:var(--bg-card); padding:30px 28px; overflow:auto}
.lb-brief dt{color:var(--text-faint); font-family:var(--mono); font-size:var(--fs-label); font-weight:var(--w-med);
  letter-spacing:.08em; text-transform:uppercase; margin-top:26px}
.lb-brief dt:first-of-type{margin-top:0}
.lb-brief dd{margin:9px 0 0; color:var(--text-dim); font-size:var(--fs-caption); line-height:1.60}
.lb-brief .lb-hook{color:var(--text); font-size:var(--fs-h3); font-weight:var(--w-med);
  letter-spacing:-.022em; line-height:1.32; margin:0 0 24px}
.prov{display:inline-flex; align-items:center; gap:8px; border:1px solid var(--border);
  border-radius:var(--r-full); padding:6px 13px; color:var(--text-dim);
  font-family:var(--mono); font-size:var(--fs-label); letter-spacing:.08em; text-transform:uppercase}
.prov i{width:5px; height:5px; border-radius:50%; background:var(--text-faint); flex:none}
.prov.is-client i{background:var(--accent)}

/* --- The sibling strip: the compare move ---------------------------------
   When an open creative belongs to one of the three controlled tests, the rest
   of that test appears underneath its brief. Flipping between variants without
   leaving the void is the only way to actually SEE what was held constant —
   which is the argument the whole page is making. A creative with no siblings
   gets no strip at all rather than an empty rail. */
.lb-sibs[hidden]{display:none}
.lb-sibs{margin-top:30px; border-top:1px solid var(--border-soft); padding-top:22px}
.lb-sibs .t-label{color:var(--text-faint)}
.sibs{display:flex; gap:8px; flex-wrap:wrap; margin-top:14px}
.sib{width:58px; padding:0; border:1px solid var(--border); background:transparent;
  border-radius:var(--r-sm); overflow:hidden; cursor:pointer; line-height:0}
.sib img{width:100%; height:auto; opacity:.55; transition:opacity .2s ease}
.sib:hover img{opacity:1}
.sib[aria-current="true"]{border-color:var(--accent)}
.sib[aria-current="true"] img{opacity:1}
/* On a phone the brief stacks under the creative, and a 1fr stage row loses
   every argument with it — a long brief squeezed the image down to 154px, which
   is a gallery showing you the caption. Both rows are therefore content-sized
   and the stage is floored at 56vh, so the work always gets the top half of the
   screen and the brief scrolls up underneath it. */
@media(max-width:900px){
  .lb-body{grid-template-columns:1fr; grid-template-rows:auto auto; overflow:auto}
  .lb-stage{padding:16px; min-height:56vh; overflow:visible}
  .lb-stage img{max-height:52vh}
  .lb-brief{border-left:0; border-top:1px solid var(--border-soft); padding:22px 20px; overflow:visible}
}

/* --- Footer -------------------------------------------------------------- */
footer{border-top:1px solid var(--border-soft); padding:var(--section) 0 72px; background:var(--bg)}
.disclaim{border:1px solid var(--border); border-radius:var(--r-md); background:var(--bg-card); padding:24px 26px}
.disclaim ul{margin:14px 0 0; padding-left:18px}
.disclaim li{margin-top:9px}
.linkrow{margin-top:20px; display:flex; gap:20px; flex-wrap:wrap}

/* --- Reveal. Force-settled by the head script no matter what. ------------- */
html.motion .reveal{opacity:0; transform:translateY(12px); transition:opacity .5s ease, transform .5s ease}
html.motion .reveal.in,html.settled .reveal{opacity:1; transform:none}
@media(prefers-reduced-motion:reduce){
  *{animation:none !important; transition:none !important}
  html.motion .reveal{opacity:1; transform:none}
}
</style>
</head>
<body>

<a class="skip t-label" href="#main">Skip to content</a>

<header class="nav">
  <div class="nav-in">
    <a class="nav-mark t-label" href="./index.html">Alex&nbsp;Amaro</a>
    <a class="t-label" href="./index.html#running">Running now</a>
    <a class="t-label" href="./creative.html" aria-current="page">Creative</a>
    <a class="t-label" href="./index.html#numbers">Numbers</a>
    <a class="t-label" href="./index.html#work">Work</a>
  </div>
</header>

<main id="main">

<!-- ==========================================================================
     HERO. One claim, stated plainly, at gallery scale.
     ========================================================================== -->
<section class="hero">
  <div class="rail">
    <p class="eyebrow t-label">Ad creative</p>
    <h1 class="t-display">A reel shows you output. This shows you the variable.</h1>
    <p class="t-lead">Anyone can post the pretty one. The question a creative team is actually asking is whether you know <em>which thing you changed</em> and why &mdash; so this wall is organised around the tests, not the trophies. One chiropractic offer written eight ways along the awareness ladder. One laser offer art-directed six ways with the copy frozen. One body-contouring offer cast five ways with the layout rotated. Then thirty stills from an own-brand exploration, and the motion work.</p>
  </div>

  <div class="strip">
    <div><p class="t-figure">${counts.total}</p><p class="t-label">Pieces in this library</p></div>
    <div><p class="t-figure">${counts.client}</p><p class="t-label">Built for client campaigns</p></div>
    <div><p class="t-figure">${counts.own}</p><p class="t-label">Own brand &amp; concept</p></div>
    <div><p class="t-figure">0${counts.sets}</p><p class="t-label">Controlled tests</p></div>
  </div>

  <div class="honest">
    <div>
      <p class="t-label" style="color:var(--accent)">Read this before the work</p>
      <p class="t-cap" style="margin-top:10px">Every tile here is <strong>craft evidence, not performance evidence.</strong> A creative on this page proves it was designed and shipped. It proves nothing about what it returned, and no figure from my claims contract is attached to any image on this page &mdash; performance lives on the <a href="./index.html#numbers">home page</a>, quoted per campaign and sourced to Meta. Client work and own-brand concept work are labelled separately on every single tile, because a portfolio that blurs the two is the one you cannot trust on anything else.</p>
    </div>
  </div>
</section>

<!-- ==========================================================================
     THE WALL. Full library, filterable, no chrome. Colour on this page arrives
     through the creative and through nothing else.
     ========================================================================== -->
<div class="wallwrap">
<div class="filters" id="wall">
  <div class="filters-in">
    <button class="chip" type="button" data-f="all" aria-pressed="true">All</button>
    <button class="chip" type="button" data-f="client" aria-pressed="false">Client work</button>
    <button class="chip" type="button" data-f="own" aria-pressed="false">Own brand</button>
    <button class="chip" type="button" data-f="chiro" aria-pressed="false">Chiropractic</button>
    <button class="chip" type="button" data-f="medspa" aria-pressed="false">Med spa</button>
    <button class="chip" type="button" data-f="glp1" aria-pressed="false">Weight loss</button>
    <button class="chip" type="button" data-f="careline" aria-pressed="false">CareLine</button>
    <p class="count t-label" id="count">${items.length} shown</p>
  </div>
</div>

<div class="wall" id="grid">
${wall}
</div>
</div><!-- /.wallwrap -->

<!-- ==========================================================================
     TEST 01 — the awareness ladder. The strongest set in the library and the
     one that reads as media buying rather than as decoration.
     ========================================================================== -->
<section class="reveal">
  <div class="rail">
    <div class="sec-head">
      <p class="eyebrow t-label">Test 01 &middot; chiropractic</p>
      <h2 class="t-h1">One offer, eight hooks.</h2>
      <p class="t-lead">Media buying is mostly a question of how many honest ways you can say the same thing before the market tells you which one it wanted. The price never moves. What moves is where on the awareness ladder the reader is standing when the ad reaches them &mdash; from &ldquo;stairs feel harder lately&rdquo; all the way to naming the device by brand.</p>
    </div>

    <div class="cv">
      <div>
        <p class="t-label on">Held constant</p>
        <p class="t-cap">The $49 Knee Pain &amp; Mobility Screening, and its four inclusions: consultation, knee evaluation, movement assessment, doctor&rsquo;s findings.</p>
        <p class="t-cap">The blue-and-gold palette, and the promise of local non-surgical options.</p>
      </div>
      <div>
        <p class="t-label">What changes</p>
        <p class="t-cap">The awareness stage the hook addresses &mdash; symptom, aspiration, identity, decision-anxiety, solution-aware, and one offer-led control with no emotional hook at all.</p>
        <p class="t-cap">The moment depicted, the headline&rsquo;s position in the frame, and the CTA verb: check availability, book, request, claim.</p>
      </div>
      <div>
        <p class="t-label">Why it is built this way</p>
        <p class="t-cap">Eight variants against one offer isolates the hook. Change the offer too and a winner tells you nothing you can use next month.</p>
        <p class="t-cap">Variant 07 carries no hook on purpose. Without a control you cannot tell whether the hook did the work.</p>
      </div>
    </div>

    <div class="setgrid" data-cols="4">
${setGrid('knee')}
    </div>
  </div>
</section>

<!-- ==========================================================================
     TEST 02 — range without changing the argument.
     ========================================================================== -->
<section class="reveal">
  <div class="rail">
    <div class="sec-head">
      <p class="eyebrow t-label">Test 02 &middot; med spa</p>
      <h2 class="t-h1">One offer, six worlds.</h2>
      <p class="t-lead">Here the copy is frozen &mdash; same headline, same three benefits, same price anchor, down to the word &mdash; and the art direction is swung as far as it will go: beach, underwater, ocean, coastline, purple studio, and the clinic itself. It is the set that shows range while proving the range is not costing anyone the argument.</p>
    </div>

    <div class="cv">
      <div>
        <p class="t-label on">Held constant</p>
        <p class="t-cap">&ldquo;Effortless elegance, smooth to the touch&rdquo;, the sub-line, and all three benefits: smooth soft skin, long-lasting results, safe for all skin types.</p>
        <p class="t-cap">The price anchor: $79 now against a struck-through $149.</p>
      </div>
      <div>
        <p class="t-label">What changes</p>
        <p class="t-cap">The entire visual world and its palette &mdash; magenta, gold-on-water, ocean blue, sunset, purple, clinical teal.</p>
        <p class="t-cap">Where the price block sits, including one full inversion that puts price at the top and headline at the bottom. And whether the treatment is shown at all: exactly one variant does.</p>
      </div>
      <div>
        <p class="t-label">Why it is built this way</p>
        <p class="t-cap">A price anchor is the part of an ad most likely to break when the art direction changes. Freezing the copy is what makes the anchor comparable across six looks.</p>
        <p class="t-cap">Six worlds also means six audiences to fail against cheaply, before spending real budget finding out.</p>
      </div>
    </div>

    <div class="setgrid" data-cols="3">
${setGrid('laser')}
    </div>
  </div>
</section>

<!-- ==========================================================================
     TEST 03 — casting as the variable. Rarely isolated; worth showing.
     ========================================================================== -->
<section class="reveal">
  <div class="rail">
    <div class="sec-head">
      <p class="eyebrow t-label">Test 03 &middot; med spa</p>
      <h2 class="t-h1">One offer, five people.</h2>
      <p class="t-lead">The offer, the three icons and the LIMITED TIME pill are identical in all five. What changes is who the ad is casting &mdash; age, body type, and whether the register is triumph, joy, power or calm &mdash; and which corner each of the four blocks lands in. Casting is the variable teams most often leave un-tested and most often blame the media buy for.</p>
    </div>

    <div class="cv">
      <div>
        <p class="t-label on">Held constant</p>
        <p class="t-cap">3-in-1 Mommy Makeover at $299, the LIMITED TIME pill, and the three icons: non-invasive, effective results, goodbye tummy.</p>
      </div>
      <div>
        <p class="t-label">What changes</p>
        <p class="t-cap">Casting across age and body type, deliberately widened rather than repeated &mdash; and the emotional register with it.</p>
        <p class="t-cap">The four content blocks rotate around the frame; the headline drops to the bottom in one variant.</p>
      </div>
      <div>
        <p class="t-label">Why it is built this way</p>
        <p class="t-cap">If every variant casts the same person, a losing set tells you the offer failed when in fact the audience never saw itself.</p>
        <p class="t-cap">Rotating the layout at the same time is a deliberate compromise: fewer cells, faster read, and the palette shift makes the pairs legible in-platform.</p>
      </div>
    </div>

    <div class="setgrid" data-cols="5">
${setGrid('contour')}
    </div>
  </div>
</section>

<!-- ==========================================================================
     MOTION. Nothing autoplays and nothing loads until asked.
     ========================================================================== -->
<section class="reveal">
  <div class="rail">
    <div class="sec-head">
      <p class="eyebrow t-label">Motion</p>
      <h2 class="t-h1">Two cuts, one controlled difference.</h2>
      <p class="t-lead">Generated UGC for CareLine &mdash; a product I own, so there is no client logo here, no patient, and no release to chase. Both cuts run the same presenter, the same room and the same offer. One walks and one holds still, which is the only thing being tested. Self-hosted from this origin; nothing autoplays and nothing downloads until you press play.</p>
    </div>
    <div class="films">
${videoBlock}
    </div>
    <p class="t-cap dim" style="margin-top:26px; max-width:68ch">Concept work. Neither cut has run in market, and neither carries a performance figure &mdash; which is precisely why they are filed under craft.</p>
  </div>
</section>

<!-- ==========================================================================
     METHOD.
     ========================================================================== -->
<section class="reveal">
  <div class="rail">
    <div class="sec-head">
      <p class="eyebrow t-label">Method</p>
      <h2 class="t-h1">The part most reels never show.</h2>
      <p class="t-lead">Output alone proves a subscription. What is worth showing is the decision behind it &mdash; which is why the prompt corpus behind this work was itself reviewed and published: 516 prompts across six export files, 350 of them unique, ranked by how often each was actually reached for, with the craft vocabulary tallied and the phrases that fell out of the working prompt by accident flagged for a look.</p>
      <p class="t-lead" style="margin-top:16px"><a href="https://sc-ad-creative-review.vercel.app">sc-ad-creative-review.vercel.app</a></p>
    </div>
  </div>
</section>

</main>

<!-- ==========================================================================
     THE LIGHTBOX. ORYZO's void mode: on the wall a creative sits in context,
     opened it becomes a single object isolated in the dark with its brief.
     ========================================================================== -->
<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Creative detail">
  <div class="lb-bar">
    <button class="lb-nav" type="button" id="lbPrev" aria-label="Previous creative">&larr;</button>
    <button class="lb-nav" type="button" id="lbNext" aria-label="Next creative">&rarr;</button>
    <p class="t-label"><span class="idx" id="lbIdx">01</span> <span id="lbTot">/ ${items.length}</span></p>
    <button class="lb-btn" type="button" id="lbClose">Close &nbsp;esc</button>
  </div>
  <div class="lb-body">
    <div class="lb-stage"><img id="lbImg" src="" alt=""></div>
    <div class="lb-brief">
      <p class="lb-hook" id="lbHook"></p>
      <p class="prov" id="lbProv"><i></i><span id="lbProvText"></span></p>
      <dl>
        <dt>Offer</dt><dd id="lbOffer"></dd>
        <dt>The variable</dt><dd id="lbVar"></dd>
        <dt>Format</dt><dd id="lbFmt"></dd>
      </dl>
      <div class="lb-sibs" id="lbSibs" hidden>
        <p class="t-label" id="lbSibsLabel">The test this belongs to</p>
        <div class="sibs" id="lbSibsRow"></div>
      </div>
    </div>
  </div>
</div>

<footer>
  <div class="measure">
    <div class="disclaim">
      <p class="t-label" style="color:var(--accent)">What this page does not claim</p>
      <ul>
        <li class="t-cap">Not performance. A creative here proves it was designed and shipped, not what it returned. No cost per lead, no ROAS, no conversion rate appears anywhere on this page and none should be inferred from a tile&rsquo;s presence.</li>
        <li class="t-cap">Not client identities. Clients appear by vertical only, and every creative shown is one that carries no clinic logo, no staff and no patient. Work that does carry them is held back for want of a signed release &mdash; including eight of the nine pages of the weight-loss set.</li>
        <li class="t-cap">Not sole authorship of stock. The photography and generated imagery inside these ads is licensed or generated; what is mine is the offer construction, the hook ladder, the art direction and the test design.</li>
        <li class="t-cap">Not in-market results for the own-brand work. Everything labelled concept is exactly that &mdash; built, never run.</li>
      </ul>
    </div>
    <p class="t-cap" style="margin-top:26px">Alex Amaro &middot; paid media and the AI systems behind it &middot; remote, United States &middot; English and Spanish.</p>
    <div class="linkrow t-cap">
      <a href="./index.html">Home</a>
      <a href="mailto:jesusalexelamaro@gmail.com">jesusalexelamaro@gmail.com</a>
      <a href="https://linkedin.com/in/alex-amaro-a4187a221">LinkedIn</a>
      <a href="https://github.com/AlexFC0810">GitHub</a>
      <a href="./Alex-Amaro-Resume.pdf">R&eacute;sum&eacute;</a>
    </div>
  </div>
</footer>

<script>
(function(){
  'use strict';

  /* --- reveal on scroll ------------------------------------------------- */
  try{
    var els = document.querySelectorAll('.reveal');
    if(window.IntersectionObserver && document.documentElement.classList.contains('motion')){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
      },{rootMargin:'0px 0px -8% 0px', threshold:0.02});
      els.forEach(function(el){ io.observe(el); });
    } else { document.documentElement.classList.add('settled'); }
  }catch(e){ document.documentElement.classList.add('settled'); }

  var grid = document.getElementById('grid');
  if(!grid) return;
  var wallTiles = Array.prototype.slice.call(grid.querySelectorAll('.tile'));

  /* --- filters. Own brand means "not client", so concept and own both
         answer to it and nothing can fall between the two chips. --------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var countEl = document.getElementById('count');

  function matches(t, f){
    if(f === 'all') return true;
    if(f === 'client') return t.dataset.prov === 'client';
    if(f === 'own') return t.dataset.prov !== 'client';
    return t.dataset.vertical === f;
  }

  function applyFilter(f){
    var n = 0;
    wallTiles.forEach(function(t){
      var ok = matches(t, f);
      t.hidden = !ok;
      if(ok) n++;
    });
    if(countEl) countEl.textContent = n + ' shown';
    chips.forEach(function(c){ c.setAttribute('aria-pressed', String(c.dataset.f === f)); });
  }

  chips.forEach(function(c){
    c.addEventListener('click', function(){ applyFilter(c.dataset.f); });
  });

  /* --- lightbox ---------------------------------------------------------
     Opens from any tile on the page, including the three set grids, but the
     arrow keys walk only the visible wall — stepping from a set into a
     filtered-out tile would be a dead frame with no way to explain itself. */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbHook = document.getElementById('lbHook');
  var lbOffer = document.getElementById('lbOffer');
  var lbVar = document.getElementById('lbVar');
  var lbFmt = document.getElementById('lbFmt');
  var lbIdx = document.getElementById('lbIdx');
  var lbTot = document.getElementById('lbTot');
  var lbProv = document.getElementById('lbProv');
  var lbProvText = document.getElementById('lbProvText');
  var lastFocus = null;
  var cursor = -1;

  var PROV = {
    client:  'Client work \\u00b7 designed and shipped',
    own:     'Own brand \\u00b7 Supercharged',
    concept: 'Own brand \\u00b7 concept, never ran'
  };
  var SET_LABEL = {
    knee:    'Test 01 \\u00b7 all eight hooks',
    laser:   'Test 02 \\u00b7 all six directions',
    contour: 'Test 03 \\u00b7 all five castings'
  };

  /* One tile per creative is the canonical one for sibling purposes: the wall
     copy. The set grids render the same creatives a second time, and indexing
     both would give every variant a duplicate thumbnail. */
  var bySet = {};
  wallTiles.forEach(function(t){
    var s = t.dataset.set;
    if(!s) return;
    (bySet[s] = bySet[s] || []).push(t);
  });

  var sibsWrap = document.getElementById('lbSibs');
  var sibsRow = document.getElementById('lbSibsRow');
  var sibsLabel = document.getElementById('lbSibsLabel');

  function visible(){ return wallTiles.filter(function(t){ return !t.hidden; }); }

  function renderSibs(t){
    var s = t.dataset.set;
    var group = s ? bySet[s] : null;
    if(!group || group.length < 2){ sibsWrap.hidden = true; sibsRow.textContent = ''; return; }
    sibsWrap.hidden = false;
    sibsLabel.textContent = SET_LABEL[s] || 'Others in this test';
    sibsRow.textContent = '';
    group.forEach(function(g){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sib';
      b.setAttribute('aria-label', g.dataset.title + ' \\u2014 ' + g.dataset.hook);
      if(g === t || g.dataset.full === t.dataset.full) b.setAttribute('aria-current','true');
      var im = document.createElement('img');
      im.src = g.dataset.full; im.alt = ''; im.loading = 'lazy';
      im.width = g.dataset.w; im.height = g.dataset.h;
      b.appendChild(im);
      b.addEventListener('click', function(){ goTo(g); });
      sibsRow.appendChild(b);
    });
  }

  function paint(t){
    var w = t.dataset.w, h = t.dataset.h;
    lbImg.src = t.dataset.full;
    lbImg.alt = t.dataset.alt;
    lbImg.width = w; lbImg.height = h;
    lbHook.textContent = t.dataset.hook;
    lbOffer.textContent = t.dataset.offer;
    lbVar.textContent = t.dataset.variable;
    var ratio = (w/h).toFixed(3);
    var shape = ratio === '1.000' ? '1:1 square' : (w > h ? 'landscape' : (Math.abs(w/h - 0.8) < 0.02 ? '4:5 portrait' : '9:16 vertical'));
    lbFmt.textContent = t.dataset.title + ' \\u00b7 ' + shape + ' \\u00b7 ' + w + '\\u00d7' + h;
    var p = t.dataset.prov;
    lbProvText.textContent = PROV[p] || p;
    lbProv.className = 'prov' + (p === 'client' ? ' is-client' : '');
    renderSibs(t);
  }

  /* Position in the list is computed by IMAGE, not by node, so a creative
     opened from a set grid still reports its true place on the wall. */
  function syncIdx(t){
    var vis = visible();
    cursor = -1;
    for(var i = 0; i < vis.length; i++){
      if(vis[i].dataset.full === t.dataset.full){ cursor = i; break; }
    }
    if(cursor >= 0){
      lbIdx.textContent = String(cursor + 1).padStart(2,'0');
      lbTot.textContent = '/ ' + vis.length;
    } else {
      /* Opened from a set grid while a filter hides it from the wall. Show the
         piece, but do not pretend it has a position in a list it is not in. */
      lbIdx.textContent = '\\u2014';
      lbTot.textContent = '';
    }
  }

  function goTo(t){ paint(t); syncIdx(t); }

  function open(t){
    lastFocus = document.activeElement;
    goTo(t);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }

  function close(){
    lb.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(d){
    var vis = visible();
    if(!vis.length || cursor < 0) return;
    cursor = (cursor + d + vis.length) % vis.length;
    paint(vis[cursor]);
    lbIdx.textContent = String(cursor + 1).padStart(2,'0');
    lbTot.textContent = '/ ' + vis.length;
  }

  document.querySelectorAll('.tile').forEach(function(t){
    t.addEventListener('click', function(){ open(t); });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function(){ step(-1); });
  document.getElementById('lbNext').addEventListener('click', function(){ step(1); });
  lb.addEventListener('click', function(e){ if(e.target === lb || e.target.classList.contains('lb-stage')) close(); });

  document.addEventListener('keydown', function(e){
    if(lb.hidden) return;
    if(e.key === 'Escape'){ close(); }
    else if(e.key === 'ArrowLeft'){ step(-1); }
    else if(e.key === 'ArrowRight'){ step(1); }
  });
})();
</script>

</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'creative.html'), html, 'utf8');
console.log(`creative.html written — ${items.length} stills + ${videos.length} films = ${counts.total} pieces`);
