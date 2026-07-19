# Agent Instructions — `alex-amaro-portfolio`
**Status:** canonical entrypoint for agents and contributors
**Owner:** Alex Amaro (GitHub: AlexFC0810)
**Last Updated:** 2026-07-19

> `AGENTS.md` is the canonical entrypoint; `CLAUDE.md` is a thin pointer (`@AGENTS.md`).

## What this repo is

The source for **Alex Amaro's public portfolio site** — a static, hand-built site served via GitHub Pages. It presents Alex's work as a growth / lead-generation marketer and agentic-AI builder: hard campaign numbers, full-funnel work, live demos, and contact paths. The whole site is plain HTML/CSS/JS plus assets — no build step.

- `index.html` — the single-page site; every section lives here and is edited in place.
- `assets/` — styles, scripts, images, and media.
- `Alex-Amaro-Resume.pdf` — the downloadable résumé.
- `robots.txt` / `sitemap.xml` — crawl and indexing hints; keep them in sync when routes change.

## How to work here

- Read `index.html` before changing anything — sections are self-labeled and edited directly.
- This site is **live and public-facing**. Keep it polished: verify links, check the mobile layout, and make sure no placeholder or draft copy ships. Preview locally before pushing.
- Changes land as commits or pull requests with clear messages — decisions live in the repo, not in chat.
- Treat published claims and numbers as load-bearing: do not alter metrics, testimonials, or credentials without the owner's explicit sign-off.
- Substantive direction changes (new sections, repositioning) should be proposed as issues, not pushed directly.

## Boundaries

Use this repo for: the public portfolio site itself — content, layout, assets, and SEO. It is a presentation surface, not an application backend; data, automation, and business logic live outside this repo.
