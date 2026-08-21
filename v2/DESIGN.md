# Portfolio v2 — design system

> "Instrument panel at night" · theme: dark · one accent
> Benchmarks: **Linear** (structural analog — dark tool surface, restraint) and
> **Vercel** (aspirational — discipline: six type steps, three radii, no drop shadow).
> Both cached at `doctrine-hub/swipes/design-systems/`.

## Why this system and not another

This is not a new palette. It is **the system Alex already shipped twice** —
`sc-upwork-engine/proof-site` and the Upwork command dashboard both run near-black
canvas / hairline borders / one amber accent / narrow measure / Inter + mono. The
old portfolio was the outlier (light navy, four-colour status system, 1140px
measure). Unifying costs nothing and reads as *builder* rather than *marketer*,
which is the repositioning this page exists to make.

It also solves the creative problem for free: ad creative is saturated because
that is what ad creative is. On a near-monochrome near-black chrome, **the
creative is the only saturated thing on the page** — it carries the visual load
instead of fighting the UI for it.

**Every token below carries its role.** A token whose role is unwritten gets
misused by the next agent, and drift restarts.

---

## Colour

Every value was measured with a WCAG contrast calculator against the ground it
actually sits on. Nothing here was chosen by eye. Measurements at the bottom.

### Grounds — depth is tonal, never cast

Four steps of near-black. A raised surface reads raised because it is *lighter*,
not because it casts a shadow. This is the Vercel move (`#fafafa → #ebebeb →
#171717`) inverted for a dark canvas.

```css
--bg:        #0a0a0b;  /* page substrate — the floor everything sits on */
--bg-soft:   #111114;  /* alternating section bands; the quiet lift that
                          separates one section from the next without a rule */
--bg-card:   #161619;  /* card and panel fill — one step up from any band */
--bg-raise:  #1c1c21;  /* the top of the ladder: hover state, input fill,
                          the inside of a card that already sits on a card */
```

### Hairlines — the separation strategy

Linear's finding, adopted whole: hairline borders *"let geometry do the work that
shadows usually would."* **There is no `box-shadow` anywhere in this page.** Not
one. Separation is a 1px border or a tonal step, never a cast shadow.

```css
--border:      #26262c;  /* the default 1px edge — visible at rest, invisible at speed */
--border-soft: #1d1d22;  /* section dividers and internal rules; quieter than --border
                            so a divider never competes with a card edge */
--border-lit:  rgba(245,158,11,.34);  /* hover/active ring. The accent as a RING,
                            never as a glow — a glow is a shadow wearing a costume */
```

### Type colours

```css
--text:       #ececf1;  /* headings and body — the reading colour */
--text-dim:   #a1a1aa;  /* secondary copy, standfirsts, card body */
--text-faint: #8b8b96;  /* captions, meta, timestamps — the floor of the ramp */
```

**`--text-faint` is `#8b8b96` and must never be lowered to `#6b6b76`.** Alex's
dashboard carries the note: *"#6b6b76 measured 3.76:1 and failed; this measures
5.87:1."* The `sc-upwork-engine` proof-site still ships the failing value. This
page inherits the fix, not the bug. Re-measured here: **3.76:1 vs 5.87:1** on
`--bg`. Confirmed by calculation, not by memory.

### The one accent

```css
--accent: #f59e0b;  /* THE accent. Functional only: the active nav marker, the
                       eyebrow rule, the live-status dot, the calculator's own
                       output. Never decorative, never a gradient, never a fill
                       behind body text. */
--link:   #fbbf24;  /* interactive text only — one step brighter than --accent
                       so a link is legible at body size (10.8:1 on --bg-card)
                       where the accent proper is tuned for 1–2px rules and dots */
```

There is no second accent. No success-green, no danger-red, no info-blue. Status
is carried by **words** (`live`, `no public URL`) and by the presence or absence
of the accent dot. A four-colour status system was one of the things the old site
did that made it read as a template.

---

## Type

**Two families, ten sizes, eleven bound styles** (the token rip counts ten — see the note under the table). Size and tracking and leading
and weight travel together — a size never appears at two weights. Hierarchy comes
from **size and colour**, never from bold.

### Families

```css
--sans: 'Inter', 'Inter Fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
```

Inter is **self-hosted** (`../assets/fonts/inter-latin-var.woff2`, one variable
file, preloaded) with the metric-matched `Inter Fallback` face inherited from
`index.html` — Arial with Inter's own metrics forced onto it, the 103.74%
size-adjust derived from 433 real text runs on that page rather than from a
published constant. Zero off-origin font requests.

**Deviation from the brief, stated:** the brief names **JetBrains Mono**. There is
no JetBrains Mono file anywhere in the estate (searched), and fetching it from
Google Fonts would break the zero-off-origin-requests property this repo has
earned. The mono role is therefore filled by the **system mono stack**, which
costs nothing and never fails to load. If a JetBrains Mono woff2 is ever added to
`assets/fonts/`, prepend it to `--mono` and nothing else changes.

### The ramp — tracking tightens as size grows

Linear's constant-ratio rule (~-0.022em at heading sizes, tightening toward
-0.045em at display) and Vercel's leading rule (exactly 1.0 at display, ~1.5 at
body), both applied.

| Token | Size | Weight | Tracking | Leading | Role |
|---|---|---|---|---|---|
| `--fs-display` | 64px | 590 | -0.045em | 1.00 | The hero claim. Used **once** on the page. |
| `--fs-h1` | 44px | 560 | -0.035em | 1.06 | One use only: the creative-wall heading, which needs a bigger moment than the other four sections because the wall itself is full-bleed. |
| `--fs-h2` | 32px | 560 | -0.028em | 1.18 | Section headings. Five on the page. |
| `--fs-h3` | 22px | 520 | -0.022em | 1.32 | Card titles, sub-heads. |
| `--fs-lead` | 19px | 400 | -0.018em | 1.50 | Section standfirst — the one paragraph under a heading. |
| `--fs-body` | 16px | 400 | -0.011em | 1.60 | Body copy. Also the **input floor** (see below). |
| `--fs-caption` | 13px | 400 | -0.005em | 1.55 | Captions, card meta, footnotes. |
| `--fs-label` | 12px | 520 | +0.08em | 1.40 | **Mono.** Uppercase eyebrows, nav, tags. Positive tracking because uppercase mono at 12px closes up without it. |
| `--fs-data` | 15px | 400 | -0.005em | 1.50 | **Mono.** Inline figures and URLs inside body copy. |
| `--fs-figure` | 28px | 400 | -0.020em | 1.10 | **Mono.** The numbers section, and the calculator's own output. Monospace so a changing figure does not reflow its row. |

Plus one bound emphasis style: `strong` = `--fs-body` at weight 520. `<b>` and
`<strong>` are **reset from their 700 default** — an unreset `<strong>` is the
single most common way a weight ceiling gets broken without anyone noticing.

> **Why the rip reports 10 and not 11.** `_audit/token-ripper.js` samples the
> selector list `h1,h2,h3,h4,h5,h6,p,li,a,span,div,button,small,td,th,label`.
> `strong` is not in it, so the emphasis style renders on the page but is never
> counted. Eleven styles are declared; ten are measurable with that tool.

### Weight band — the ceiling is 590

```css
--w-reg:  400;  /* all body, all mono, all lead paragraphs */
--w-med:  520;  /* card titles, inline emphasis */
--w-semi: 560;  /* h1, h2 */
--w-max:  590;  /* display only — Linear's ceiling, and the page's */
```

No 700. No 800. No 900. The old `proof.html` shipped 900 and 800 against a
declared ceiling of 700; a ceiling that is not enforced by construction is not a
ceiling. Here the only way to get weight is to use one of four tokens.

### Input floor — non-negotiable

Every `<input>` and `<select>` renders at **16px minimum**. Below 16px, iOS Safari
auto-zooms the viewport on focus and the user is dumped into a scrolled, magnified
page they did not ask for. The ROI calculator's number inputs are `--fs-body`
(16px) for exactly this reason, and no smaller value may be substituted.

---

## Radius — three values

```css
--r-sm:   4px;    /* tags, chips, inputs, the accent rule caps */
--r-md:   10px;   /* cards, media tiles, panels — the workhorse */
--r-full: 999px;  /* pills and the range track/thumb only */
```

Three, not five. The old site declared 10/14/18/24/999 plus a raw `50%` and a raw
`2px` — seven values, three of them within 4px of each other, which is the
signature of radii being chosen per-component instead of from a ladder. **Do not
use `50%`**: it computes to a distinct value in a token rip and reads as a fourth
radius.

---

## Elevation — there is none, and that is the point

**Zero `box-shadow` declarations.** Depth comes from:

1. the four-step tonal ground ladder, and
2. 1px hairlines.

The old site shipped four multi-layer drop-shadow tokens (2–4 layers each). Both
benchmarks use neither: Vercel uses two 1px *rings*, Linear uses 0.5px hairlines
and no shadow at all. This was the axis the old site failed hardest, and a rebuild
fixes it by construction rather than by another subtractive pass.

Focus rings use `outline` (`2px solid var(--link)`, `outline-offset: 2px`), not
`box-shadow` — so the "no shadows" property survives keyboard navigation.

---

## Layout

```css
--measure:  760px;   /* the reading rail. Every run of prose sits inside this. */
--rail:     1080px;  /* the card rail — live-surface cards and the work grid.
                        Wider than the measure because a card is scanned, not read. */
--gap:      16px;    /* the base gap; multiples used for everything else */
--section:  clamp(72px, 9vw, 116px);  /* vertical rhythm between sections */
```

The creative wall is the only thing that escapes both rails — it is full-bleed by
design, because a wall that stops at 1080px is a grid, not a wall.

### Spacing
4px grid. Used steps: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 72.

### Tap targets
Every interactive element is **≥ 44 × 44 CSS px**, enforced with `min-height:44px`
and padding rather than by hoping the text is tall enough. Nav links, tags, card
links, calculator inputs and the reset button all clear it. Measured, not assumed.

---

## Motion

Motion must communicate. Three uses, and no others:

1. **Section reveal** — a 12px rise and fade as a section enters, which
   communicates *sequence* (the page has an argument and it is ordered).
2. **Hover on a live-surface card** — the border lights to `--border-lit` and the
   ground steps to `--bg-raise`. Communicates *this is clickable and it goes
   somewhere real*.
3. **Nothing else.** No parallax, no counters, no marquee, no decorative float.

### The four-layer no-JS contract, inherited verbatim

Content is **never** gated on a frame that might not run. This exact pattern
already shipped on `index.html` and is copied here without modification:

1. `prefers-reduced-motion: reduce` → jump straight to the settled state.
2. Otherwise add `.motion` and arm a **2600ms force-settle timer in the same
   statement**, so the escape hatch can never diverge from the opt-in.
3. `try/catch` → settle on any error.
4. **No `<noscript>` dependency**: reveal styles only apply *under* `html.motion`,
   so with JS disabled the class is never added and every section renders at full
   opacity by default.

`requestAnimationFrame` is paused in background tabs. An entrance animation that
starts at `opacity:0` and waits for a frame has already produced a blank screen in
this portfolio once. It will not do it again.

---

## Measured, not asserted

Contrast, computed against each ground (flat 4.5:1 bar, no large-text exemption):

| | `--bg` #0a0a0b | `--bg-soft` #111114 | `--bg-card` #161619 | `--bg-raise` #1c1c21 |
|---|---|---|---|---|
| `--text` #ececf1 | 16.81 | 16.01 | 15.34 | 14.41 |
| `--text-dim` #a1a1aa | 7.72 | 7.35 | 7.05 | 6.62 |
| `--text-faint` #8b8b96 | **5.87** | 5.59 | 5.36 | **5.04** |
| `--accent` #f59e0b | 9.21 | 8.78 | 8.41 | 7.90 |
| `--link` #fbbf24 | 11.85 | 11.29 | 10.82 | 10.17 |
| ~~#6b6b76~~ (rejected) | **3.76** | 3.58 | 3.43 | 3.22 |

Tightest passing pair on the page: `--text-faint` on `--bg-raise` at **5.04:1**.
`--border` is 1.32:1 against `--bg` and is a *border*, never a text colour.

---

## The five axes, against the benchmarks

| Axis | World-class | Linear | Vercel | **v2 target** |
|---|---|---|---|---|
| Distinct type styles | 6–12 | 8 steps | 6 steps | **10 measured** |
| Weight band | 400–600 | 400–590 | 400–450 | **400 / 520 / 560 / 590** |
| Radius values | 2–3 | 6px, 12px | 2 / 6 / 9999 | **3 — 4px / 10px / 999px** |
| Elevation | one ladder, or hairlines | hairlines, no shadow | two rings | **0 — no shadow at all** |
| Tracking | scales negatively with size | -0.022em constant | -0.050 → -0.060em | **+0.080em at 12px → -0.045em at 64px** |

Measured on the rendered page with `_audit/token-ripper.js`, not asserted:

```
distinct_type_styles: 10        weight_band: 400/520/560/590
max_weight: 590                 radius_values: 3   (4px · 999px · 10px)
elevation_variants: 0           families: Inter, ui-monospace
```

The full rendered ramp, largest to smallest, with the tracking each size got:

| 64 | 44 | 32 | 28 | 22 | 19 | 16 | 15 | 13 | 12 |
|---|---|---|---|---|---|---|---|---|---|
| -0.045 | -0.035 | -0.028 | -0.020 | -0.022 | -0.018 | -0.011 | -0.005 | -0.005 | +0.080 |

(28px and 15px are monospace figures; 12px is the uppercase mono label, the one
step that takes *positive* tracking because uppercase mono closes up without it.)

---

## Rules for whoever touches this next

1. **No new colour** without measuring it against all four grounds first.
2. **No weight above 590.** If something needs more emphasis, make it bigger or
   make it `--text` against `--text-dim` — do not reach for bold.
3. **No `box-shadow`.** If a thing needs to look raised, step it up the ground
   ladder and give it a hairline.
4. **No fourth radius**, and no `border-radius: 50%`.
5. **No off-origin request** — no CDN font, no analytics, no remote image. The
   zero-off-origin property is a feature of this repo, and one Higgsfield clip is
   already permanently lost to a hotlinked CloudFront URL.
6. **No input below 16px.**
7. If you add a token, **write its role in this file in the same commit**.
