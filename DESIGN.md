# Portfolio v2 — design system

> "Instrument panel at night" · theme: dark · one accent
> Benchmarks: **Linear** (structural analog — dark tool surface, restraint) and
> **Vercel** (aspirational — discipline: six type steps, three radii, no drop shadow).
> Both cached at `doctrine-hub/swipes/design-systems/`.

> ### 2026-08-21 — corrected benchmark, corrected amplitude
> Alex looked at v2 and preferred the old site. Both causes are written down here
> rather than argued about, and only one of them is taste.
>
> **1. Wrong benchmark register.** Linear is a *developer tool*: deliberately
> impersonal, engineered to disappear behind the work. A portfolio cannot
> disappear — it IS the work. Linear stays the reference for restraint and for
> the geometry-over-shadow rule. It is no longer the reference for temperature.
> That is now the v1 site's `#16365C` navy family, borrowed for its **presence**,
> not for its hue.
>
> **2. The ladder shipped at roughly 40% of the amplitude it was designed for.**
> The four grounds stepped 1.044:1 and 1.050:1 apart. On a phone at 40% screen
> brightness that is one flat plane — so a system whose entire depth strategy is
> tonal rendered as a single sheet of near-black behind 1.2:1 hairlines. The
> direction was right. The intensity was the defect.

> ### 2026-09-04 — re-synced to the second raise
> The ladder was raised a second time on 2026-08-22 and this file did not follow.
> `index.html` measured itself against ORYZO AI — whose own ground pairs run
> 1.347 / 1.260 / 1.881 — and found that a ladder which cleared 1.15 and stopped
> there was still the shallowest thing in the room. 1.15 was the floor, not the
> target. Every token, both measurement tables and the two type-role notes below
> now describe what actually ships, and every ratio here was recomputed rather
> than copied across from the CSS comments.
>
> The re-measure turned up two things worth naming. `--text-faint` on
> `--bg-raise` passes at **4.63:1**, which is 0.13 above the bar where the first
> raise had 0.61 in hand. And the tightest cell on the page was, at that moment,
> not in the text ramp at all: `--accent` on `--bg-raise` measured **4.51:1** —
> the ROI calculator's own answer, clearing the flat bar by 0.01.
>
> ### 2026-09-04, later the same day — the calculator left the page
> The missed-call ROI calculator was removed from `index.html`. It modelled the
> READER's hypothetical loss, it claimed nothing about Alex, and it occupied
> 1,328px of the first two screens on a phone while the managed-spend figure sat
> on screen 13 of 19. Three consequences for this document, which is why the
> removal is recorded here and not only in a commit message:
>
> 1. **`--accent` on `--bg-raise` no longer occurs.** The accent is now set as
>    text only on `--bg-card` (the hero figure) and `--bg` (one section eyebrow),
>    so the 4.51:1 cell above is history rather than a live risk. The tightest
>    cell is back inside the text ramp: `--text-faint` on `--bg-raise` at
>    **4.63:1**, which is a tag inside a hovered card.
> 2. **There is no `<input>` left on this page.** The input floor below still
>    binds — it binds the next input anyone adds — but it currently governs
>    nothing, and a rule that governs nothing has to say so, or the next reader
>    mistakes it for a description of the page.
> 3. **There is no `<noscript>` element left either.** The four-layer no-JS
>    contract is unaffected, because it never depended on one.

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

### Grounds — depth is tonal, at an amplitude you can actually see

Four steps of deep navy. A raised surface reads raised because it is *lighter*,
not because it casts a shadow. This is the Vercel move (`#fafafa → #ebebeb →
#171717`) inverted for a dark canvas — but the step size is the whole ballgame,
and the first cut got it wrong by about 40%.

```css
--bg:        #090c17;  /* page substrate — the floor everything sits on */
--bg-soft:   #1f2435;  /* alternating section bands;  1.265:1 above --bg */
--bg-card:   #2d344e;  /* card and panel fill;        1.258:1 above --bg-soft */
--bg-raise:  #3a4364;  /* top of the ladder — hover, input fill, the inside of a
                          card that already sits on a card. 1.265:1 above
                          --bg-card, 2.013:1 end to end */
```

**The rule that replaces the old one: every adjacent ground pair must measure
≥ 1.15:1.** That is the sixth check in the audit and it is not optional — a
tonal system with no tonal amplitude is a flat page carrying extra tokens. Read
it as a floor rather than a target: the shipped ladder steps about 1.26 per
rung, which is where the second raise put it.

The ladder also has a temperature now, which it did not before. Pure-neutral
near-black reads switched off rather than lit, and the warmth is the one thing
the old site had that this page did not.

### Hairlines — the separation strategy

Linear's finding, adopted whole: hairline borders *"let geometry do the work that
shadows usually would."* **There is still no drop shadow anywhere on this page.**
Separation is a 1px border or a tonal step.

With the ladder widened, the borders became a supporting act rather than the
entire strategy — and they got brighter along with the grounds, because a 1.2:1
hairline on a flat ground was the other half of why the page read as one sheet.

```css
--border:      #4a5474;  /* the default 1px edge — 2.61:1 on --bg, 1.64:1 on --bg-card,
                            1.30:1 on --bg-raise */
--border-soft: #353d55;  /* section dividers and internal rules; quieter than --border
                            so a divider never competes with a card edge */
--border-lit:  rgba(245,158,11,.38);  /* hover/active ring. The accent as a RING,
                            never as a glow — a glow is a shadow wearing a costume */
```

### Type colours

```css
--text:       #eef0f7;  /* headings and body — the reading colour */
--text-dim:   #c3c9d8;  /* secondary copy, standfirsts, card body */
--text-faint: #adb3c4;  /* captions, meta, timestamps — the floor of the ramp */
```

**Every one of these moved when the grounds moved, and that is the point.** The
worst pairing on this page is no longer `--text-faint` on `--bg`; it is
`--text-faint` on `--bg-raise`, which is now a genuinely lighter surface. The
first raise's floor `#a6acbf` measures **4.28:1** against the shipped
`--bg-raise` and would have shipped a failure — which is why the floor moved a
second time, to `#adb3c4`. The older candidates fall further: `#95959f` at
**3.27:1**, `#8b8b96` at **2.88:1**. A palette change is exactly when to
re-measure every token, because the ground moved underneath all of them.

**The inherited floor is `#8b8b96`, and it must never be lowered to `#6b6b76`.**
Alex's dashboard carries the note: *"#6b6b76 measured 3.76:1 and failed; this
measures 5.87:1."* Those two figures belong to the dashboard's own near-neutral
`#0a0a0a` ground, not to this page's. Re-measured here against `--bg`:
**3.71:1 vs 5.79:1** — same verdict, different substrate. The earlier claim
that 3.76 / 5.87 had been re-measured on `--bg` was the dashboard note being
quoted rather than recalculated, and the matrix below always disagreed with it.
The `sc-upwork-engine` proof-site still ships the failing value. This page
inherits the fix and then goes past it: on the shipped `--bg-raise`, `#8b8b96`
is only **2.88:1**, which is why the floor here is `#adb3c4` and not the value
it was inherited from.

### The one accent

```css
--accent: #f59e0b;  /* THE accent. Functional only: the one primary action, the
                       single hero metric and its rule, the live-status dot, and
                       exactly one section eyebrow (the pointer to the creative
                       wall). Never decorative, never a gradient, never a fill
                       behind body text. It had a fifth job until 2026-09-04 —
                       the ROI calculator's answer — and did not get the budget
                       back when the calculator was removed. */
--link:   #fbbf24;  /* interactive text only — one step brighter than --accent
                       so a link is legible at body size (7.34:1 on --bg-card,
                       5.81:1 on --bg-raise) where the accent proper is tuned
                       for 1–2px rules and dots */
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
| `--fs-h1` | 44px | 560 | -0.035em | 1.06 | One use only: the `#numbers` heading ("Fewer, and sourced."). This note used to name the creative-wall heading; that heading is `--fs-h2` like every other section, and the larger step is spent on the numbers instead. |
| `--fs-h2` | 32px | 560 | -0.028em | 1.18 | Section headings. Four on the page: `#running`, `#creative`, `#work`, `#record`. (`#numbers` takes `--fs-h1`.) |
| `--fs-h3` | 22px | 520 | -0.022em | 1.32 | Card titles, sub-heads. |
| `--fs-lead` | 19px | 400 | -0.018em | 1.50 | Section standfirst — the one paragraph under a heading. |
| `--fs-body` | 16px | 400 | -0.011em | 1.60 | Body copy. Also the **input floor** (see below). |
| `--fs-caption` | 13px | 400 | -0.005em | 1.55 | Captions, card meta, footnotes. |
| `--fs-label` | 12px | 520 | +0.08em | 1.40 | **Mono.** Uppercase eyebrows, nav, tags. Positive tracking because uppercase mono at 12px closes up without it. |
| `--fs-data` | 15px | 400 | -0.005em | 1.50 | **Mono.** Inline figures and URLs inside body copy. |
| `--fs-figure` | 28px | 400 | -0.020em | 1.10 | **Mono.** The numbers section. Monospace because these figures sit in a column, and a proportional face makes a column of numbers ragged. |

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
page they did not ask for.

**`index.html` currently has no input at all** — the ROI calculator that used to
justify this rule was removed on 2026-09-04. The rule stays, because it binds the
next input somebody adds and because the sibling pages still carry controls. But
it is a standing constraint here rather than a description of the page, and the
difference between those two is the difference between a live rule and a stale
one.

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

## Elevation — one lit edge, and still zero drop shadows

**Zero drop shadows. One inset highlight.** Depth comes from:

1. the four-step tonal ground ladder,
2. 1px hairlines, and
3. `--lit` — a single 1px inset top highlight.

```css
--lit: inset 0 1px 0 rgba(255,255,255,.075);
```

This is the one thing borrowed back from `index.html`, where **every** elevation
token ends in `inset 0 1px 0 rgba(255,255,255,.92)`. That inset hairline — not
the drop shadows stacked in front of it — is what makes those cards read as *lit*
rather than merely *outlined*. It casts nothing, so the property this page was
built on survives intact: `elevation_variants: 1`, one value, six surfaces, no
blur radius anywhere on the page.

It lives on `.card-body`, not on `.card`. Measured rather than assumed: in
Chromium an inset shadow is painted **underneath** a top-edge `<img>`, and moving
it onto the `<img>` does not paint either — so on `.card` it would have been
invisible on the four image cards and visible only on the one without an image.
On `.card-body` it lands at the top of the body on every card.

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
links, card links and the section links all clear it. Measured, not assumed:
`_audit/measure.js` reports `tap.under44`, and the number has to be 0. It was 1
on 2026-09-04 — an inline URL inside a card paragraph — and the fix was to
promote it to a `.card-link`, not to argue that inline links are exempt.

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
4. **No `<noscript>` dependency for anything structural**: reveal styles only
   apply *under* `html.motion`, so with JS disabled the class is never added and
   every section renders at full opacity by default. The page carried exactly one
   `<noscript>` element, a courtesy note beside the ROI calculator; it left with
   the calculator on 2026-09-04 and nothing structural noticed, which was always
   the point. Re-verified after the removal by stripping every class the head
   script adds: all six sections render at `opacity: 1`, `transform: none`.

`requestAnimationFrame` is paused in background tabs. An entrance animation that
starts at `opacity:0` and waits for a frame has already produced a blank screen in
this portfolio once. It will not do it again.

---

## Measured, not asserted

Contrast, computed against each ground (flat 4.5:1 bar, no large-text exemption):

| | `--bg` #090c17 | `--bg-soft` #1f2435 | `--bg-card` #2d344e | `--bg-raise` #3a4364 |
|---|---|---|---|---|
| `--text` #eef0f7 | 17.13 | 13.54 | 10.77 | 8.51 |
| `--text-dim` #c3c9d8 | 11.77 | 9.30 | 7.40 | 5.85 |
| `--text-faint` #adb3c4 | 9.31 | 7.36 | 5.85 | **4.63** |
| `--accent` #f59e0b | 9.08 | 7.18 | 5.71 | **4.51** |
| `--link` #fbbf24 | 11.68 | 9.24 | 7.34 | 5.81 |
| ~~#95959f~~ (rejected) | 6.57 | 5.20 | 4.13 | **3.27** |
| ~~#8b8b96~~ (the previous floor) | 5.79 | 4.58 | 3.64 | **2.88** |

Tightest passing pair in the text ramp: `--text-faint` on `--bg-raise` at
**4.63:1** — 0.13 above the bar, where the first raise had 0.61 in hand at
5.11:1, and now measured against a surface 2.013:1 lighter than `--bg`.

That is now the tightest cell on the page, full stop. Until 2026-09-04 it was
beaten by `--accent` on `--bg-raise` at **4.51:1** — the ROI calculator's answer
on the raised panel it sat in, real text held to the flat bar and clearing it by
0.01. The calculator was removed, and with it the only place on this page where
the accent was ever set as text on the top of the ladder. `--text-faint` on
`--bg-raise` is therefore the cell to check first if a ground moves again: it is
a tag inside a hovered card, and it has 0.13 in hand.

**The ground ladder itself — the check this page previously had no bar for:**

| pair | ratio | bar |
|---|---|---|
| `--bg` → `--bg-soft` | **1.265** | ≥ 1.15 ✔ |
| `--bg-soft` → `--bg-card` | **1.258** | ≥ 1.15 ✔ |
| `--bg-card` → `--bg-raise` | **1.265** | ≥ 1.15 ✔ |
| `--bg` → `--bg-raise` (end to end) | **2.013** | — |

Previously (first raise, 2026-08-21): 1.163 / 1.193 / 1.215, and 1.687 end to
end. Before that: 1.050 / 1.044 / 1.064, and 1.166.

`--border` is 2.61:1 against `--bg`, 1.64:1 against `--bg-card` and 1.30:1
against `--bg-raise`, and is a *border*, never a text colour.

---

## The five axes, against the benchmarks

| Axis | World-class | Linear | Vercel | **v2 target** |
|---|---|---|---|---|
| Distinct type styles | 6–12 | 8 steps | 6 steps | **11 measured** |
| Weight band | 400–600 | 400–590 | 400–450 | **400 / 520 / 560 / 590** |
| Radius values | 2–3 | 6px, 12px | 2 / 6 / 9999 | **3 — 4px / 10px / 999px** |
| Elevation | one ladder, or hairlines | hairlines, no shadow | two rings | **1 — one inset hairline, zero drop shadows** |
| Tracking | scales negatively with size | -0.022em constant | -0.050 → -0.060em | **+0.080em at 12px → -0.045em at 64px** |

Measured on the rendered page with `_audit/token-ripper.js`, not asserted:

```
distinct_type_styles: 11        weight_band: 400/520/560/590
max_weight: 590                 radius_values: 3   (4px · 999px · 10px)
elevation_variants: 1           families: Inter, ui-monospace
```

The eleventh style is `--fs-hero` — mono, `clamp(50px, 9vw, 78px)` — and it
exists for exactly one element: the `9.5×` in the hero. One focal object per
screen, and a focal object needs a step of its own or it is not focal.

The full rendered ramp, largest to smallest, with the tracking each size got:

| 78 | 64 | 44 | 32 | 28 | 22 | 19 | 16 | 15 | 13 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|
| -0.045 | -0.035 | -0.028 | -0.020 | -0.022 | -0.018 | -0.011 | -0.005 | -0.005 | +0.080 |

(28px and 15px are monospace figures; 12px is the uppercase mono label, the one
step that takes *positive* tracking because uppercase mono closes up without it.)

---

## Rules for whoever touches this next

1. **No new colour** without measuring it against all four grounds first.
2. **No weight above 590.** If something needs more emphasis, make it bigger or
   make it `--text` against `--text-dim` — do not reach for bold.
3. **No drop shadow, ever.** There is exactly one `box-shadow` token, `--lit`,
   and it is an inset 1px top highlight with no blur and no offset. If a thing
   needs to look raised: step it up the ground ladder, give it a hairline, and
   give it `--lit`. Do not add a second elevation value.
4. **Every adjacent ground pair stays ≥ 1.15:1.** Touch a ground token and you
   re-measure all three pairs *and* every text token against all four grounds.
   The first version of this page failed exactly here, and looked flat for it.
5. **No fourth radius**, and no `border-radius: 50%`.
6. **No off-origin request** — no CDN font, no analytics, no remote image. The
   zero-off-origin property is a feature of this repo, and one Higgsfield clip is
   already permanently lost to a hotlinked CloudFront URL.
7. **No input below 16px.**
8. If you add a token, **write its role in this file in the same commit**.

---

# Portfolio v3 draft — "the darkroom" (`/v3/`, 2026-08-27)

> Register shift, not a token tweak: instrument panel → **gallery**. The page's
> argument is the work itself, hung at full size. Draft status: **noindex,
> unlinked from every nav** until Alex promotes it.
>
> Benchmarks (both cached in `doctrine-hub/swipes/design-systems/`):
> **monopo saigon** — a creative agency portfolio, the same JOB as this page:
> the interface never picks up a hue, all colour lives in the work, and scale
> does the shouting so weight never has to (display at weight 400, 225px).
> **ORYZO AI** — warm-dark museum ground, cream type, hairline separation, one
> ember accent "earning its rarity", tonal grounds ≥1.15:1 adjacent.

## v3 tokens, measured

Grounds (warm near-black): `#0f0c09 → #221c14 → #332a1e → #453a2a` —
adjacent pairs **1.155 / 1.198 / 1.269**, end-to-end **1.757** (v2 ships 2.013 after its second raise; 1.687 was the first).

Text: `--text #f4ecdd` (9.46:1 worst), `--text-dim #c9bda9` (5.99 worst),
`--text-faint #b5a993` (4.79 worst, on `--bg-raise`).

Accent, two tiers: `--accent #ee7524` (ember — text-safe on bg/soft/card,
**rules and dots only on --bg-raise**, never a fill) and `--link #ffa14e`
(interactive text, 5.53:1 worst). The serif-italic-in-ember is the page's
signature gesture and is spent exactly twice: the hero line and the close.

Type: **three families** — Instrument Serif (display, weight 400 only, both
woff2 self-hosted in `assets/fonts/`), Inter (body, shared file with v2),
system mono (labels/figures). **Weight ceiling 560** — lower than v2's 590,
because the serif does its work with size (`--fs-mega` up to 164px), not weight.

Radii 4/12/999. Zero drop shadows; depth = ground ladder + hairlines + the one
`--lit` inset. Zero off-origin requests holds.

## Motion — safer than v2 by construction

Reveals are **CSS scroll-driven** (`animation-timeline: view()`) inside
`@supports` inside `prefers-reduced-motion: no-preference`. Default state is
fully visible; no JS is involved; a browser without support gets a static
page. The v2 four-layer force-settle contract is therefore unnecessary here —
there is no state to force-settle. Known artifact: full-page screenshots show
below-viewport `.rv` sections at opacity 0; live scrolling is unaffected.

## Content contract

Every claim inherited verbatim from the v2 root (greenlit v1.11.2);
`node tools/claims-lint.mjs v3/index.html` is clean and must stay clean.
The gate-ledger counts (109 / 12 / 25 / 72) were verified against
`sc-ad-creative-os/creative/index.json` on 2026-08-25 — re-verify before
editing them. The three new films in `assets/motion/` were frame-extracted,
read at full size, and transcoded with `-map_metadata -1`; their soundbeds
are machine-gated but **unheard by a human** — Alex listens once on a phone
before sharing the /v3/ link (the content engine's own go-live gate).

---

# Portfolio v4 draft — "the proof room" (`/v4/`, 2026-09-04)

> A static port of the Codex-built prototype (`proof-os/flagship-proof/`, 2026-08-27 — the design
> Alex rated highest), made canonical: every figure bound to `claims.json`, every guard able to read
> it, every token measured. Draft status: **noindex, unlinked** until Alex promotes it. Tokens and
> the reasoning live at the top of `v4/style.css`; this section is the measured record.

## v4 tokens, measured

Grounds: `--ink #050505 → --panel #1a1917 → --raised #2a2825` — adjacent pairs **1.160 / 1.195**;
the paper band `--paper #e9e3d9 → --paper-deep #d8cfbf` 1.210. Separation is hairlines plus the
paper inversion; there is no drop shadow anywhere (`elevation_variants: 0` on the rip).

Text on ink / panel / raised: `--white #eeeae3` 17.0 / 15.5 / 13.7 · `--muted #a39f98` 7.7 / 7.1 / 6.2 ·
`--quiet #8c8882` 5.8 / 5.3 / **4.2 — never used on `--raised`**. Gold `#cea15a` 8.6 on ink,
`--gold-bright #e2b972` 11.1. On paper: `--ink-text #15120f` 14.6 · `--paper-body #5f5950` 5.4 ·
`--paper-gold #80551e` 5.1 · `--paper-figure #7a5218` 5.4 (the prototype's `#9b6b29` measured 3.63
and failed the flat 4.5 bar — there is no large-text exemption on this estate).

Type: **three families** — Instrument Serif (display, weight 400 only), Inter (body), system mono
(labels). Ramp: `--fs-mega` (h1, once) · `--fs-display` (section h2) · `--fs-sub` (every serif
sub-head) · `--fs-figure` (every serif numeral) · `--fs-lead` · `--fs-body 16` · `--fs-cap 14` ·
mono `--fs-label 11` at 520 · `--fs-ui 12` at 560. **Weight ceiling 560.** The prototype's 5–9px
chrome and 650/700 labels were raised and clamped. Rip on 2026-09-04 at 375: 29 rendered styles,
band 400/520/560, radius values 1 (the play discs), families 3.

## Measured on the render (2026-09-04, `_audit/measure.js`)

| | 1440×900 | 375×812 |
|---|---|---|
| tap targets under 44px | 0 of 116 | 0 of 105 |
| text below 4.5:1 | 0 of 438 | 0 of 419 |
| horizontal overflow | none | none |
| first screen | specialty at y≈165, $225K+ rail at y≈790 | specialty y=102, $225K+ y=709 |

## Guards this page adds

- `tools/check-home-claims.mjs` — every `[data-claim]` block's numeric tokens must be licensed by
  that claim's contract strings; every `data-status` pill must read `<status> · <tier>`. Runs on
  `index.html` and every `v<n>/index.html`.
- `tools/gate-ledger.mjs` — the four review-gate counts (109 / 12 / 25 / 72, inventory counts, not
  performance claims) must equal `proof/gate-ledger.json` and sum. Re-derive the snapshot from the
  private creative manifest before editing the counts.
- `proof/called-shots.json` — the dated, falsifiable forecast register the strategy block renders.
  A verdict is printed on the resolution date, hit or miss, and never deleted.

## Motion

CSS scroll-driven reveals under `@supports (animation-timeline: view())` inside
`prefers-reduced-motion: no-preference`; default state visible; no JavaScript involved. Tabs and
the lightbox are progressive enhancement — every panel is in the DOM and every tile is a real link.
