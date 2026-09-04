# Agent Instructions — `alex-amaro-portfolio`
**Status:** canonical entrypoint for agents and contributors
**Owner:** Alex Amaro (GitHub: AlexFC0810)
**Last Updated:** 2026-09-04

> `AGENTS.md` is the canonical entrypoint; `CLAUDE.md` is a thin pointer (`@AGENTS.md`).

## What this repo is

The source for **Alex Amaro's public portfolio render/deployment** — static HTML, no build step for the pages themselves, served by GitHub Pages from `main` at
`https://alexfc0810.github.io/alex-amaro-portfolio/`.

This repo is deliberately **not an independent positioning brain**. The canonical professional identity / market positioning / portfolio strategy lives in private `career-capital-os`; the canonical claims/evidence authority lives in private `proof`. This repo consumes those upstream decisions and makes the approved truth legible, interactive, public-safe, and memorable.

It is also an **evidence surface with a contract behind it**: every public figure resolves to `claims.json`, and three separate guards exist to stop a number, a name or a dead link reaching the live URL. Treat those guards as the product, not as ceremony — they are the reason the numbers on this site are worth more than the same numbers on anyone else's.

**Positioning rule:** do not invent or canonize Alex's professional category in this repo. Read the current approved/challenger framing from `career-capital-os` and the allowed claim language from `proof`. This repo may solve the public expression of that positioning — hierarchy, storytelling, interaction, design, and evidence presentation — but a compelling page is not authority to mutate the upstream identity.

## The pages

| Path | What it is |
|---|---|
| `index.html` | The final canonical portfolio, promoted from V4 on 2026-09-04 at Alex’s request. Hero → proof tour → creative/video → `#running` (including `#voice`) → evidence → strategy → work → record. Hand-edited; styles in `assets/portfolio.css`. |
| `work.html`, `work/*.html` | 18 case studies. **Generated** — edit `tools/case-studies.json` and run the builder, never the HTML. |
| `creative.html` | The creative wall. **Generated** by `tools/build-creative-wall.mjs`. |
| `proof.html` | The Proof Room — claims with verification status. |
| `audit.html` | The published cross-examination, including the attacker's prompt. |
| `model.html` | The unit-economics model. Claims nothing; runs entirely client-side. |
| `v1.html`, `v2/`, `v3/` | History and drafts. `v3/` is `noindex` and unlinked. |
| `v4/` | Retained noindex source snapshot of the proof-room design. The canonical final version is now `index.html`; do not overwrite its voice/CRM improvements with this older snapshot. Guards: `tools/check-home-claims.mjs`, `tools/gate-ledger.mjs`. |
| `claims.json`, `llms.txt` | The machine-readable record. **Compiled in the private vault** — never hand-edit; the sha256 will catch you. |
| `Alex-Amaro-Resume.pdf` | Downloadable résumé. **See the warning below.** |

Assets, fonts and media live in `assets/`. `robots.txt` and `sitemap.xml` must stay in sync when routes change.

## Hard rules

1. **`claims.json` is binding.** Every public figure comes from a claim's `wording` field, used verbatim, and the commit message names the claim id. No performance figure that is not in the contract reaches a page — at any size, however flattering. If a stronger statement is less defensible, ship the defensible one. *Inventory and process counts* (pieces on a wall, generations logged / accepted / rejected) are not claims: each is sourced to a named manifest with a dated snapshot in `proof/`, checked by a tool on every push, and never placed within 300 characters of a spend, lead or booking figure. Wrap every claim-bearing block in `data-claim="<id>"` so `tools/check-home-claims.mjs` can hold it to the contract.
2. **Never hand-edit `claims.json` or `llms.txt`.** They are compiled in `proof-os` and integrity-hashed. Sync the local lint config with `cp ../proof-os/shareable/greenlit.json proof/greenlit.json` (gitignored — it carries real client names and must never be committed).
3. **Cost per lead is per campaign.** Never total spend ÷ total leads. Never place a managed-spend total within 300 characters of a lead total without "per campaign" nearby — there is a lint rule for exactly this.
4. **Clients by vertical and market, never by name.** This applies to variable names, preset ids, comments and filenames, not just prose. GitHub Pages serves every tracked file, and an HTML comment is served too.
5. **Never add a screenshot of an internal surface** without opening it at full size and reading every legible string first. This repo has already published three complete generation prompts inside a picture that no text search could find.
6. **Zero off-origin requests.** No CDN font, no analytics, no remote image, no embedded player. Self-host or do without.
7. **`DESIGN.md` is binding** for tokens: one accent, weight ceiling 590, three radii, zero drop shadows, ground pairs ≥ 1.15:1, 16px input floor, 44×44 tap targets. Add a token and you write its role in `DESIGN.md` **in the same commit**.
8. **Content is never gated on a frame that might not run.** Reveal styles apply only under `html.motion`; the head script arms its own force-settle timer in the same statement.
9. **Substantive professional repositioning is upstream work.** Propose/decide it in `career-capital-os`, then implement the approved public expression here. Copy fixes, evidence reordering, design experiments and defect repair may remain local when they do not change the underlying identity.
10. **One fact, one home.** Identity/role framing → Career Capital. Claim truth/provenance → Proof. Public expression/deployment → this repo.

## The résumé PDF is a public claims surface

`Alex-Amaro-Resume.pdf` is linked from the hero and the footer. It is served from this repo, so it makes public claims exactly like a page does — **and no guard reads it**, because `public-selftest` and `claims-lint` walk text files.

That gap has already cost something: a corrected source sat in `career-capital-os/resumes/` for seventeen days while a stale render carrying retired figures stayed linked from the live site. Before shipping any résumé change, extract its text and lint it:

```bash
python -c "from pypdf import PdfReader; import io; open('/tmp/r.txt','w',encoding='utf-8').write('\n'.join(p.extract_text() for p in PdfReader('Alex-Amaro-Resume.pdf').pages))"
node tools/claims-lint.mjs --strict --config ../proof-os/shareable/greenlit.json /tmp/r.txt
```

The PDF is generated from `career-capital-os/resumes/Alex-Amaro-Resume.html`; the `.docx` from `generate-resume.js`. **Both carry the content separately** — edit both, regenerate both, then copy the PDF here.

## Verify before you ship

Run all of it. In order. Nothing here needs network except step 4.

```bash
node tools/public-selftest.mjs                      # leak tripwire + contract integrity (this is CI)
node tools/claims-lint.mjs --strict --config ../proof-os/shareable/greenlit.json \
     index.html model.html work.html proof.html creative.html audit.html llms.txt DESIGN.md AGENTS.md work
node tools/build-case-studies.mjs --check           # case-page source drift
node tools/check-home-claims.mjs                    # every [data-claim] block on index.html / v*/index.html is licensed by the contract
node tools/gate-ledger.mjs                          # the review-gate counts match proof/gate-ledger.json and sum
node tools/link-check.mjs --external                # internal targets, #fragments, and live URLs
node tools/make-og.mjs                              # only if assets/og-*.html changed
```

Then, in a browser at **375×812 and 1440×900** against `python -m http.server 8791`:

- paste `_audit/measure.js`, run `window.__auditMeasure()` → `tap.under44` and `text.below45` must both be **0**;
- paste `_audit/token-ripper.js` → max weight 590, 3 radii, 1 elevation variant, families Inter + ui-monospace;
- `document.documentElement.scrollWidth === clientWidth` at 375 (no sideways scroll, ever);
- strip every class the head script adds (`document.documentElement.className = ''`) → every section still renders at `opacity: 1`;
- confirm the first screen communicates the currently approved professional identity and strongest allowed proof rather than a local/stale positioning variant.

Finally, **read the page as three people** — a hiring manager for a senior growth role, an agency owner looking for specialist capacity, and an AI-native operator — and ask what each still misunderstands after thirty seconds. Fix the most expensive misunderstanding before you commit.

If you touched a social card, **open the PNG and read it**. No check in this repo can tell you an image says the right thing.

## Boundaries

Use this repo for the **public rendering** of the portfolio: content implementation, layout, assets, SEO, interactions and public guards. It is a presentation/deployment surface, not an application backend and not the canonical professional-strategy source. Data, automation and business logic live elsewhere. Growth strategy, content production and fulfilment SOPs route to their own engines.

## Final portfolio release — 2026-09-04

Alex authorized the final version in chat. V4’s design is now the canonical root, with the existing callable demo integrated into the client-systems panel. `#voice` deep links reopen the correct tab. The neutral demo label is deliberate: the agent-name mapping was not independently established. The phone number was previously confirmed by Alex; this release tests the website affordance, not a phone call. No CRM settings, routing or messages are changed.

Keep three evidence classes distinct: configured platform capability, public-demo behavior, and proven client deployment. The workflow illustration is not a live log. Existing B11 and every other contracted evidence block are preserved. The own-brand video is labelled component/concept work, not an approved complete ad or a client result. No new off-origin resource is introduced. The existing guards workflow now also runs the home-claims and gate-ledger checks that the page describes.
