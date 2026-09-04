# Design QA — Creative-Weighted Challenger Revision

**Route:** `/challenger/`

**Date:** 2026-09-04

**Release state:** isolated challenger branch, `noindex, nofollow`, unlinked from production

## Comparison target

- **Source visual truth:** `https://alex-amaro-creative.alexfc10.chatgpt.site/` — live creative-led reference selected by Alex.
- **Implementation:** `http://127.0.0.1:4173/challenger/` — revised local challenger.
- **Source screenshot path:** current-run Codex in-app Browser capture; the browser surface does not expose a local screenshot path.
- **Implementation screenshot path:** current-run Codex in-app Browser capture; the browser surface does not expose a local screenshot path.
- **Desktop viewport:** 1280 × 720 CSS px, 1280 × 720 captured px, device pixel ratio 1.
- **States captured:** reference hero, challenger hero, challenger creative-section entry, campaign-system collage, creative lightbox, and cockpit walkthrough.
- **Mobile target:** 375 × 812 requested; the in-app Browser viewport override did not change the connected surface, so a valid mobile capture was not produced in this run.

## Findings and iteration history

- **[P1] Creative proof was materially underweighted.**
  - Earlier evidence: the challenger devoted six tiles to creative and immediately returned to systems/proof, while the selected reference gave performance creative the dominant visual chapter.
  - Fix: moved creative directly after the metric rail and expanded it into three named campaign systems using 19 real approved assets: eight chiropractic routes, six aesthetics routes, and five B2B refrigeration routes.
  - Post-fix evidence: the 1280 × 720 creative-section capture shows the cream editorial register, purple typographic interruption, operating principles, and campaign narrative; the campaign-system capture shows large, legible creative with asymmetric desktop composition.

- **[P1] Revenue cockpit proof terminated at a login wall.**
  - Earlier evidence: the public CTA opened `revops.superchargedroi.com/login`; the portfolio image was also only the sign-in screen.
  - Fix: removed the external login CTA and the login-screen image from both the hero reel and system card. Replaced them with an on-page, public-safe walkthrough that explicitly separates campaign truth, lifecycle/handoff state, and the evidence boundary.
  - Post-fix evidence: the walkthrough opens as a native dialog with no login and no client data. The hero reel now uses the public evidence-system artifact instead.

- **[P2] Hero buttons rendered as empty outlines.**
  - Earlier evidence: the base `.button` rule followed the variant rules and overwrote their background and foreground colors.
  - Fix: added variant-specific rules after the base component.
  - Post-fix evidence: the hero capture visibly renders both “Call the live AI” and “Explore the ad work.”

## Required fidelity surfaces

- **Fonts and typography:** local Inter and Instrument Serif remain intact. The revised creative chapter carries the source’s blunt sans-serif/editorial serif contrast without copying its headline or narrowing the full portfolio identity to creative alone.
- **Spacing and layout rhythm:** desktop uses a wide editorial intro, three operating-principle cells, campaign headers, asymmetric artwork grids, and a dramatic purple performance bridge. No horizontal overflow at 1280 px.
- **Colors and tokens:** the existing paper, black, purple, gold, and orange tokens were reused; no new visual token was introduced.
- **Image quality and asset fidelity:** all visible creative is real repository media in 480/720 WebP variants with original JPEGs in the lightbox. No placeholder, CSS art, inline SVG, or generated substitute was added.
- **Copy and content:** creative craft is kept separate from campaign causation. The 9.5× / ~75% comparison remains campaign-level and links to the detailed case. The cockpit copy identifies the authenticated boundary instead of implying public access.

## Interaction and browser checks

- Creative navigation reaches the expanded chapter.
- Creative tiles open a native dialog at full size and return focus on close.
- The cockpit walkthrough opens without leaving the site, resets to the top, and returns focus on close.
- Browser console: no warnings or errors in the tested 1280 × 720 session.
- Horizontal overflow: 0 px at 1280 × 720.
- Image posture: 21 of 28 images are lazy-loaded; the hero’s selected evidence remains immediately available.
- Approximate initial local payload: 92.1 KB HTML/CSS/JS + 128.1 KB eager hero imagery = 220.2 KB before font transfer.

## Privacy and evidence checks

- No raw GoHighLevel screenshot, testimonial, phone number, lead record, appointment note, or private client message was added.
- No CareLine work-in-progress animation was added.
- The public cockpit treatment exposes no private workspace data and makes no unmeasured lift claim.
- Production remains untouched.

## Residual blocker

The selected remote reference refuses to render in the local side-by-side comparison frame, and the in-app Browser did not honor the 375 × 812 viewport override. The source and implementation were captured and inspected separately at 1280 × 720, but the Product Design QA contract requires a same-input comparison and a valid requested mobile capture before handoff. Those two evidence gaps prevent a passing QA declaration in this run.

## Final result

blocked
