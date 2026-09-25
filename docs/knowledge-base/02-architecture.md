# Architecture

## System overview

```
Browser (React SPA, dist/)
  │  static files ──────────────── Nginx / Apache on the VPS
  │  /api/*  ───────────────────── Node proxy :8787 (server/consultation-proxy.mjs)
  │                                   │  Bearer JWT per pipeline
  │                                   ▼
  │                                n8n (n8nautomation.abbadev.com)
  │                                   ├─ Notion (consultation leads)
  │                                   ├─ Postgres (chat_leads, event_registrations)
  │                                   ├─ Email (internal + client confirmations)
  │                                   ├─ Telegram (alerts to Rommel)
  │                                   └─ Ollama qwen3:1.7b (assistant replies)
  │
  └─ VITE_EVENTS_API (Laravel "abbadev-events", api.abbadev.com)
        GET /api/events · POST /api/registrations · POST /api/registrations/{id}/payment
```

Webhook URLs and tokens are never sent to the browser. The browser only ever calls `/api/*` on its own origin, apart from the
events API, which it calls directly.

## Stack

| Layer | Choice |
|---|---|
| UI | React 19.2 function components, no router, no state library |
| Build | Vite 8, `@vitejs/plugin-react`, `@tailwindcss/vite` (Tailwind 4 is installed, but v1 styling is plain CSS) |
| Motion | `lenis` smooth scroll plus hand-written IntersectionObserver/rAF helpers (v2). `framer-motion` is installed but unused (it froze the in-app preview) |
| Icons | `lucide-react` |
| Lint | ESLint 10 flat config: `js.recommended`, react-hooks, react-refresh (vite) |
| Server | Node 20+, `node:http` only, no dependencies |
| Tests | None. Vitest + React Testing Library is the suggested setup (`AGENTS.md`) |

## Repository layout

```
index.html                SEO meta, OG/Twitter tags, JSON-LD, theme pre-paint script
tokens.css                OKLCH design tokens (light/dark) shared by v1 and the assistant
src/
  main.jsx                createRoot → <App/> in StrictMode
  App.jsx                 ~4,950 lines: routing, all v1 pages, data arrays, forms
  App.css                 ~7,600 lines: all v1 page styles
  index.css               fonts (Plus Jakarta Sans, IBM Plex Mono), tokens import, grid background
  Assistant.jsx           floating chat assistant (deterministic + optional AI)
  CaseWorkflow.jsx        animated n8n-style pipeline diagram used on case pages
  lib/patterns.js         EMAIL_PATTERN (the proxy keeps its own copy)
  v2/                     current homepage (see 03-v2-homepage.md)
server/consultation-proxy.mjs
deploy/                   systemd unit, nginx + apache vhosts, env template
automation/n8n/           workflow write-ups and SQL schemas
docs/                     n8n assistant and event workflow guides, this knowledge base
public/                   images, OG image, case-study PDFs, robots.txt, sitemap.xml
```

## Routing

`App()` (`src/App.jsx:3994`) keeps `window.location.pathname` in state and listens for `popstate`. Links are plain `<a href>`
tags, so each navigation is a full page load, and the web server must fall back to `index.html` for every route (the SPA fallback).
Trailing slashes are removed before matching.

| Path | Component | Chat widget |
|---|---|---|
| `/` (and `/index.html`) | `V2Home` | yes (inside V2) |
| `/v1` | Classic v1 homepage (inline JSX, `App.jsx:4223-4952`) | yes |
| `/v2` | `V2Home` | yes |
| `/cases` | `CasesIndexPage` | yes |
| `/cases/:slug` | `CaseStudyPage` (an unknown slug shows the 404 page) | yes |
| `/work` | Rewritten to `/cases` with `history.replaceState` | — |
| `/about` | `AboutPage` | yes |
| `/services` | `ServicesPage` | yes |
| `/register` | `RegisterPage` | yes |
| `/seminar?event=<slug>` | `SeminarLandingPage` (ad landing page) | **no** |
| `/privacy`, `/terms` | `LegalPage` | no |
| 6 `contentPages` keys | `ContentPage` (service/community template) | yes |
| 8 `routeRedirects` keys | Redirect with `location.replace` | — |
| anything else | `NotFoundPage` (404, `noindex`) | no |

The live `contentPages` routes are `/community`, `/business-solutions` and the four `/services/*` pages.

`routeRedirects` (`src/App.jsx`) sends these paths elsewhere before anything renders:

| From | To |
|---|---|
| `/contact`, `/consulting-intake` | `/#contact` (homepage form) |
| `/insights`, `/workflow-demos`, `/implementation-notes` | `/cases` |
| `/insights/system-design` | `/services/software-architecture` |
| `/insights/ai-operations` | `/services/ai-automation` |
| `/insights/digital-transformation` | `/services/technical-advisory` |

On the server these paths also return a real 301: Apache reads `public/.htaccess` (copied into `dist/`), and
`deploy/abbadev.nginx.conf` has the same rules. The browser-side redirect is the fallback if the server rules
aren't active.

The Insights, Workflow demos and Implementation notes pages are hidden until real articles exist. Their content is still in
`contentPages`; delete a path from `routeRedirects` to publish it again.

Each route sets its own `<title>`, meta description, Open Graph/Twitter title and description, canonical URL and robots tag
through `applyPageMeta` (`routeMeta` in `src/App.jsx`). Case studies and content pages take theirs from their own data. `/v1` and `/v2`
point their canonical URL at `/`. Because this runs in JavaScript, Google sees the per-page values, but link previews on Facebook and
LinkedIn still show the `index.html` defaults.

### Navigation

- **One header for the whole site:** `src/v2/SiteHeader.jsx`, in the v2 design. The links live in `nav` in `src/v2/content.js`:
  What we do, Work, Products, Sessions, About, and a "Book a consultation" button.
  - **On the homepage** (`<SiteHeader onHome />`) each link scrolls to its section (`anchor`); Sessions opens `/register`.
  - **On interior pages** (`CasePageHeader` renders `<SiteHeader theme setTheme />`) each link opens its page (`href`), the
    current section is underlined (`match` prefixes), and a light/dark toggle appears.
  - **At 900px and below** the links move into a drop-down opened by a menu button (Escape closes it). At 560px and below the
    consultation button moves into that menu too.
- **Not using it:** `/seminar`, `/privacy` and `/terms` keep their distraction-free `lp-header`; the legacy `/v1` homepage keeps
  its original `SiteNav` (`primaryNav` in `src/App.jsx`).
- **Breadcrumbs:** `Breadcrumbs` / `buildBreadcrumbs` (`App.jsx:2477`).

## Theming

- **Tokens:** `tokens.css` defines the colour tokens in OKLCH, plus fonts, spacing (8–112 px), radii, easing and durations.
- **Dark theme selection:** the dark values apply under `prefers-color-scheme: dark` or `:root[data-theme="dark"]`, and
  `:root[data-theme="light"]` forces the light values back.
- **Stored preference:** `localStorage['abba-theme']`. An inline script in `index.html` sets `data-theme` before first paint to
  avoid a flash, and a Sun/Moon toggle in every v1 header changes it.
- **v2 homepage:** always dark. It sets its own `--v2-*` tokens under `.v2-shell` and overrides the shared tokens there, so the
  assistant renders dark too.

## Conventions (from `AGENTS.md`)

- **Code style:** 2-space indent, single quotes, **no semicolons**.
- **Naming:** PascalCase components, camelCase hooks and variables, lowercase descriptive asset names.
- **Import order:** external packages, then local assets, then styles.
- **Commits:** imperative commit messages, one logical change per commit.
- **Before submitting:** run `npm run lint` and `npm run build`.
- **Never commit:** secrets, `.env*` files (except `.env.example`), `dist/`, or lead CSV exports (`public/images/*.csv` is gitignored).
