# ABBADev knowledge base

Reference for the `abbadev` repository: the marketing site, lead pipeline and event
registration system behind **https://abbadev.com**, run by ABBADev IT Solutions.

Compiled on 2026-09-25 from three sources:

- the source code on `main` (commit `389cda2`), plus the uncommitted removal of the header "Classic site" link
- a crawl of the live site at abbadev.com: every linked route, and every image and PDF it serves
- the untracked local files in the repo root (`AI_Software_Delivery.html`, `images/`)

Every image, PDF and icon served by abbadev.com was byte-compared (SHA-256) with the copy in
`public/`, and all 29 matched. The live site is running the current `main`.

## Contents

| File | What it covers |
|---|---|
| [01-business.md](01-business.md) | Company, founder, positioning, services, case studies, products, events and pricing |
| [02-architecture.md](02-architecture.md) | Tech stack, repo layout, routing, theming, build tooling, conventions |
| [03-v2-homepage.md](03-v2-homepage.md) | The current homepage (`/`): sections, content model, motion system, design tokens |
| [04-pages.md](04-pages.md) | Every other route: v1 homepage, cases, services, about, register, seminar, content and legal pages |
| [05-forms-assistant-proxy.md](05-forms-assistant-proxy.md) | Forms, the chat assistant, the Node API proxy, environment variables |
| [06-automation-n8n.md](06-automation-n8n.md) | n8n workflows, lead scoring, Postgres and Notion schemas, the Ollama assistant |
| [07-deployment.md](07-deployment.md) | VPS layout, systemd, Nginx/Apache, HTTPS, the update procedure |
| [08-assets-and-images.md](08-assets-and-images.md) | Every image and download: dimensions, what it shows, where it's used |
| [09-live-site-audit.md](09-live-site-audit.md) | Findings from crawling abbadev.com |
| [10-known-issues.md](10-known-issues.md) | Inconsistencies, gaps and cleanup candidates, grouped by priority |
| [11-history.md](11-history.md) | How the project evolved, and the branches |

## Quick facts

| | |
|---|---|
| Business | ABBADev IT Solutions: systems architecture, AI automation, custom software (Philippines, serves globally) |
| Founder | Rommel Galisanao, Founder & Principal Systems Architect |
| Contact | `info@abbadev.com` |
| Frontend | React 19 + Vite 8 single-page app with no router library; plain CSS (v1) plus a scoped `v2.css` |
| Backend | `server/consultation-proxy.mjs`, a dependency-free Node HTTP proxy on port 8787 |
| Automation | n8n at `n8nautomation.abbadev.com`, with Postgres, Notion, email, Telegram and Ollama |
| Events API | Separate Laravel service (`VITE_EVENTS_API`, `api.abbadev.com`) |
| Hosting | Hostinger Ubuntu VPS, `/var/www/abbadev`, Nginx or Apache in front of `dist/` |
| Products | ABBADev CRM (`crm.abbadev.com`), Stockora (`stockora.abbadev.com`) |
| Repo | `github.com/iamrgalisanao/abbadev` |

## Commands

```bash
npm install          # or npm ci
npm run dev          # Vite dev server (proxies /api to :8787)
npm run dev:proxy    # Node API proxy on :8787 (needs env vars to forward anything)
npm run lint
npm run build        # output in dist/
npm run preview
```

There is no test framework. The quality bar is `npm run lint && npm run build` (see `AGENTS.md`).
