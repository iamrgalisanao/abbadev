# Known issues and cleanup candidates

Grouped by impact. Each item names the file to change. Items marked **Fixed** were resolved on 2026-09-25 and are kept here for reference.

## Higher impact

| # | Issue | Where |
|---|---|---|
| 1 | **Fixed 2026-09-25.** Sitemap lists only hash anchors; the real routes are missing | `public/sitemap.xml` |
| 2 | **Fixed 2026-09-25.** Same `<title>` and description on every page | `index.html`; needs per-route `document.title` / meta |
| 3 | **Fixed 2026-09-25.** No 404 page: unknown paths render the homepage | `src/App.jsx` routing (the fallthrough at ~4218) |
| 4 | **Fixed 2026-09-25** (homepage now has a consultation brief form at `#contact`). The v2 homepage has no working consultation form. Its CTAs go to `#contact` (a CTA card) or `/consulting-intake` (a template page with no form) | `src/v2/V2Home.jsx:364`, `contentPages['/consulting-intake']` |
| 5 | **Fixed 2026-09-25** (per-client rate limits, field allow-lists, server honeypot check). The proxy has no rate limiting or bot protection, and forwards the whole payload to n8n | `server/consultation-proxy.mjs` |
| 6 | **Fixed 2026-09-25** (listens on `127.0.0.1` by default; `HOST` overrides). The proxy binds all interfaces, so port 8787 must be firewalled | same |

## Content drift

| # | Issue | Where |
|---|---|---|
| 7 | **Fixed 2026-09-25.** Assistant says "three representative case studies"; the site has six | `src/Assistant.jsx` ("proof" intent), n8n assistant node 3 |
| 8 | **Fixed 2026-09-25.** OG image and `profile.webp` said "ABBADev Tech Solutions"; replaced by `og-abbadev.png` and `profile-fb.png` | `public/og-abbadev.png`, `public/images/profile-fb.png` |
| 9 | **Fixed 2026-09-25** (About page now reads `founderProfile.title`). Founder title differs: "Principal Systems Architect" on the homepage vs "Technology Solutions Architect" on About | `App.jsx:2358` vs `founderProfile` |
| 10 | Event data is duplicated in several places that must be kept in sync by hand | `eventOfferings` / `flagshipSeminar` (App.jsx), n8n `EVENTS`, events API |
| 11 | GCash details are duplicated | `paymentMethods` (App.jsx) and n8n `PAYMENT` |
| 12 | The privacy policy mentions advertising pixels, but no pixel or analytics is installed | `privacyDoc` vs `index.html` |
| 13 | The Stockora demo password is in a public disclaimer string (intentional for a public demo, but worth knowing) | `caseStudies` → stockora |
| 14 | The flagship seminar (Sep 5, 2026) is past, but it is still the default `/seminar` offer and is still in `eventOfferings` | `App.jsx:1876`, `2727` |
| 15 | **Fixed 2026-09-25.** The footer still links "Classic site" (`/v1`) after the header link was removed | `src/v2/content.js` (footer) |

## Documentation drift

| # | Issue | Where |
|---|---|---|
| 16 | **Fixed 2026-09-25.** README says Tailwind and Framer Motion; v1 is plain CSS and framer-motion is unused | `README.md` |
| 17 | **Fixed 2026-09-25.** `.env.example` says `ASSISTANT_TIMEOUT_MS` defaults to 24000; the code default is 30000 | `.env.example` vs `consultation-proxy.mjs:25` |
| 18 | **Fixed 2026-09-25.** DEPLOYMENT.md leaves out the assistant env vars and the build-time `VITE_*` vars | `DEPLOYMENT.md`, `deploy/abbadev.env.example` |
| 19 | **Fixed 2026-09-25.** AGENTS.md says the repo "has no existing commit history" | `AGENTS.md` |
| 20 | Event schema docs mention `lead_source`, `flow` and `utm_campaign` columns that aren't in the SQL | `docs/n8n-event-workflow.md` vs `event-registrations-schema.sql` |
| 21 | `CaseWorkflow` kicker is hard-coded to "n8n pipeline", even on the CRM, Stockora and transaction cases | `src/CaseWorkflow.jsx` |

## Dead code and assets

- **v2 fields and helpers that are never used:**
  - `hero.sub`
  - `nav.brand`
  - `work.cases[].metric.label`
  - `work.cases[].screenshot`
  - `finalCta.button.href`
  - `TypewriterHeading`
  - the `.v2-hero-sub` and `.v2-type*` CSS
- **Unused dependency:** `framer-motion`. Tailwind is only wired into Vite.
- **Unused assets:**
  - the WebP versions of `hero`, `project-delivery`, `software-architecture` and `training`
  - `favicon.svg`, `icons.svg`
  - `src/assets/react.svg`, `src/assets/vite.svg`
- **Missing font:** IBM Plex Mono is used as the v2 mono font, but `v2.css` doesn't import it. It only renders because `index.css` imports it.
- **Stale branch:** `origin/feat/chat-assistant-and-branding` is fully merged and could be deleted.

## Performance

- Four PNGs are over 1 MB: `founder`, `ai-connection`, `mockup_crm` and `cloud`. Serve WebP or AVIF instead.
- `App.jsx` is about 4,950 lines and `App.css` about 7,600 lines, all in one bundle (431 KB JS / 163 KB CSS before gzip). Splitting routes
  with `React.lazy` would make the homepage load faster.
