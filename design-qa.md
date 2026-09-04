# Design QA — Visual Synthesis Pass

**Route:** `/challenger/`

**Date:** 2026-09-04

**Release state:** isolated challenger branch, `noindex, nofollow`, unlinked from production

## Comparison target and evidence

- **Primary source visual truth:** local `/v4/#creative` — proof-room artifact framing and cinematic editorial hierarchy.
- **Secondary source visual truth:** `https://alex-amaro-creative.alexfc10.chatgpt.site/` — fast visual cadence and cross-market creative presentation.
- **Implementation:** `http://127.0.0.1:4173/challenger/`.
- **Source and implementation screenshot path:** current-run Codex in-app Browser captures. The browser surface does not expose a filesystem export path, so the source and implementation URLs above are the reproducible paths.
- **Combined comparison evidence:** a current-run, browser-rendered side-by-side harness placed local v4 and the challenger in the same visual input at matching states and viewports. The temporary harness was not included in the shipped branch.
- **Desktop viewport:** exact 1440 × 900 CSS px for each iframe, device pixel ratio 1, normalized to 576 × 360 px at 40% only for the combined review canvas.
- **Mobile viewport:** exact 375 × 812 CSS px for each iframe, device pixel ratio 1, normalized to 262.5 × 568.4 px at 70% only for the combined review canvas.
- **States captured:** hero/proof-room framing, creative-section entry, cross-market sampler, campaign-system collage, mobile creative entry, exact-width mobile campaign content, creative lightbox open/closed, and revenue-system tab states.

## Findings and comparison history

- **[P1 resolved] Creative proof was materially underweighted.**
  - Earlier evidence: the challenger devoted six tiles to creative and immediately returned to systems/proof, while the selected references gave performance creative the dominant visual chapter.
  - Earlier fix: moved creative directly after the metric rail and expanded it into three named campaign systems using real approved assets.
  - Current fix: added an immediate six-market visual sampler before the strategic breakdown, expanded the hero contact sheet to eight creative routes, and gave the aesthetics campaign a dark gallery-room treatment.
  - Post-fix evidence: the 1440 × 900 combined comparison shows the challenger reaching real creative faster than v4 while retaining the challenger’s clearer positioning. The 375 × 812 comparison shows the editorial headline, explanation, library link, sampler entry, and subsequent campaign-system content without overlap or clipped controls.

- **[P1 resolved] Revenue cockpit proof terminated at a login wall.**
  - Earlier evidence: the public CTA opened an authenticated login page.
  - Fix: replaced the login CTA and login-screen image with a public-safe on-page walkthrough that separates campaign truth, lifecycle/handoff state, and the evidence boundary.
  - Post-fix evidence: the walkthrough opens as a native dialog with no login and no private client data.

- **[P2 resolved] Hero buttons rendered as empty outlines.**
  - Earlier evidence: the base button rule overrode the variant colors.
  - Fix: added variant-specific rules after the base component.
  - Post-fix evidence: both hero actions render with distinct filled and outlined treatments.

- **[P2 resolved] Prior QA lacked a same-input comparison and valid mobile evidence.**
  - Earlier evidence: source and implementation were inspected separately at 1280 × 720, and the connected browser viewport could not be resized directly.
  - Fix: rendered source and implementation together in one browser comparison surface using exact-size 1440 × 900 and 375 × 812 same-origin frames, then normalized only their presentation scale.
  - Post-fix evidence: both full desktop and focused mobile comparisons were visible in the same browser input. No actionable P0/P1/P2 mismatch remained.

## Required fidelity surfaces

- **Fonts and typography:** local Inter and Instrument Serif remain intact. Display text uses a controlled serif/sans contrast, readable optical weights, intentional wrapping, and compact uppercase labels. The 375 px view preserves hierarchy without truncating headings or controls.
- **Spacing and layout rhythm:** the challenger uses a wide editorial intro, immediate visual sampler, three operating-principle cells, campaign headers, and asymmetric artwork grids. Desktop density is cinematic; mobile collapses to readable single-column narrative plus a deliberate horizontal creative rail.
- **Colors and tokens:** the existing paper, black, purple, gold, orange, ink, and muted tokens are reused. The dark aesthetics gallery creates chapter-level contrast without introducing a competing palette.
- **Image quality and asset fidelity:** all visible campaign creative is real repository media using responsive WebP thumbnails with original JPEGs in the full-size viewer. Crops are purposeful, aspect ratios are preserved, and no placeholder, CSS art, inline SVG, or generated substitute was added.
- **Copy and content:** creative craft remains explicitly separate from campaign causation. Performance stays attached to the campaign record, and the site does not imply that an individual image caused the result.
- **Icons:** no new icon dependency or approximate iconography was introduced; text-led controls remain consistent with the source language.
- **Accessibility:** semantic buttons open the creative viewer; the dialog has a labeled close control; tab states expose `aria-selected`; keyboard arrow navigation changes stages; focus styles and reduced-motion handling remain present; images have descriptive alt text; mobile controls remain usable.

## Interaction and browser checks

- Creative navigation reaches the expanded chapter.
- All six sampler tiles expose full-size artwork in the existing native dialog; the close control dismisses it successfully.
- Revenue-system tabs update visible content and `aria-selected`; keyboard Arrow Right moves from Capture to Convert.
- No console event appeared during the tested page load.
- Exact 1440 × 900 and 375 × 812 comparison frames rendered without visible page-level overflow, overlap, clipped persistent controls, or broken typography.
- The hero’s selected evidence remains eager; gallery imagery remains responsive and lazy-loaded where appropriate.

## Privacy and evidence checks

- No raw GoHighLevel screenshot, testimonial, phone record, lead record, appointment note, or private client message was added.
- No CareLine work-in-progress animation was added.
- The public cockpit treatment exposes no private workspace data and makes no unmeasured lift claim.
- Production remains untouched.

## Focused-region comparison

The creative-section entry and exact-width mobile campaign content were reviewed as focused regions because typography, image cadence, labels, and controls were too small to judge from the normalized desktop overview. The focused views confirmed readable type, intentional crops, preserved labels, working controls, and stable mobile stacking.

## Follow-up polish

- **P3:** Additional approved Canva or Drive assets can be added later only when they clear the same privacy, permission, and claim-adjacency checks.

## Final result

passed
