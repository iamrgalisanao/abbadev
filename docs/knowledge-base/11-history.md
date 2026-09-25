# Project history

Main runs from 2026-07-28 ("Initial ABBADev website", `7b9ba3d`). On 2026-09-25 it had 66 commits up to `389cda2`, followed the same day by the fix-up series below (through `dd6951f`).

## Timeline

| When | What |
|---|---|
| **Jul 28–29** | First site. Hostinger/Apache deploy configs. Consultation form with email validation. n8n lead workflow docs. Branded HTML emails. Notion lead storage (`85a0661`). Case studies, dedicated case pages and downloadable PDFs. Design and accessibility audits. TSMS transaction-intake story replaces the old operations case (`91a9cfa`). Footer content-architecture routes (`731c357`) |
| **Aug** (PR #1, `feat/chat-assistant-and-branding`) | Chat assistant with lead capture and an n8n backend (`00fcf36`). Branding refresh and founder section (`eee3d49`). Guardrailed-assistant case study with an animated pipeline. Filterable `/cases` directory made canonical (`f0fe1cd`). Founder headshot. CRM showcase (`4250f33`). Vite `/api` dev proxy (`e22e639`) |
| **Aug 30 – Sep 3** | `/seminar` Facebook-ad landing page with reserve-then-pay and legal pages (`8624651`). Two-step registration with receipt upload against the events API (`9a6b5ae`). PH mobile number formatting and autofill hardening. Featured sessions and event-aware `/seminar` (`625fb3a`). Dynamic `/register` (`49e63e5`). Grounded Ollama assistant via n8n (`317359b`). Project Scoper quiz (`30f1754`). Nav overhaul and breadcrumbs. Rebrand from **Tech Solutions → IT Solutions** (`62a6c56`). Seminar price shown as ₱500 → ₱399 |
| **Sep 5** | The flagship seminar is held at Twinniz Cafe, Olongapo (the local photos and deck come from it) |
| **Sep 5–6** | Stockora added as a second product and case study (`1de7d5c` … `53288ff`). **v2 homepage added and made the default route** (`a976b0c`). Case-study stack tweaks |
| **Sep 25** | `*.dmg` added to `.gitignore` (`389cda2`), then the knowledge base and a series of fixes for every item in [10-known-issues.md](10-known-issues.md): |
| | `d7e09ea` 404 page, per-route titles and meta, real sitemap; "Classic site" link removed · `f36ff6c` README, deployment docs and env templates · `01e1bdc` knowledge base |
| | `593646a` consultation form on the homepage · `6994d3f` real service and community pages, content hubs redirected · `3df4afe` Apache/Nginx 301s |
| | `c6b19eb` proxy rate limits, field allow-lists, loopback bind · `2dec9ba` new brand tile and share image · `81bdcfa` one founder title |
| | `8a7ed83` shared v2 header on every page · `e585410` events API as the single source · `85c5966` one booking path, GCash copies removed |
| | `7b2f796` accurate privacy policy · `aa945d5` Stockora demo password pointer · `237c17b` `/seminar` stops selling the ended seminar |
| | `188b15d` ad-attribution columns in the registrations schema · `dd6951f` per-case diagram labels |

## Branches

| Branch | State |
|---|---|
| `main` | Current. As of 2026-09-25 the server still runs an older build; deploy with the steps in [07-deployment.md](07-deployment.md) |
| `origin/v1-legacy` | Points at `53288ff`, the last commit before v2 became the homepage. A snapshot of the classic site |
| `origin/feat/chat-assistant-and-branding` | Points at `e22e639`. Fully merged; main is 34 commits ahead. Safe to delete |
