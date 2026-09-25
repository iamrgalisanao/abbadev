# Project history

Main has 66 commits, running from 2026-07-28 ("Initial ABBADev website", `7b9ba3d`) to 2026-09-25 ("Ignore .dmg installer files", `389cda2`).

## Timeline

| When | What |
|---|---|
| **Jul 28–29** | First site. Hostinger/Apache deploy configs. Consultation form with email validation. n8n lead workflow docs. Branded HTML emails. Notion lead storage (`85a0661`). Case studies, dedicated case pages and downloadable PDFs. Design and accessibility audits. TSMS transaction-intake story replaces the old operations case (`91a9cfa`). Footer content-architecture routes (`731c357`) |
| **Aug** (PR #1, `feat/chat-assistant-and-branding`) | Chat assistant with lead capture and an n8n backend (`00fcf36`). Branding refresh and founder section (`eee3d49`). Guardrailed-assistant case study with an animated pipeline. Filterable `/cases` directory made canonical (`f0fe1cd`). Founder headshot. CRM showcase (`4250f33`). Vite `/api` dev proxy (`e22e639`) |
| **Aug 30 – Sep 3** | `/seminar` Facebook-ad landing page with reserve-then-pay and legal pages (`8624651`). Two-step registration with receipt upload against the events API (`9a6b5ae`). PH mobile number formatting and autofill hardening. Featured sessions and event-aware `/seminar` (`625fb3a`). Dynamic `/register` (`49e63e5`). Grounded Ollama assistant via n8n (`317359b`). Project Scoper quiz (`30f1754`). Nav overhaul and breadcrumbs. Rebrand from **Tech Solutions → IT Solutions** (`62a6c56`). Seminar price shown as ₱500 → ₱399 |
| **Sep 5** | The flagship seminar is held at Twinniz Cafe, Olongapo (the local photos and deck come from it) |
| **Sep 5–6** | Stockora added as a second product and case study (`1de7d5c` … `53288ff`). **v2 homepage added and made the default route** (`a976b0c`). Case-study stack tweaks |
| **Sep 25** | `*.dmg` added to `.gitignore` (`389cda2`). Header "Classic site" link removed (uncommitted at the time of writing) |

## Branches

| Branch | State |
|---|---|
| `main` | Current, and what's deployed |
| `origin/v1-legacy` | Points at `53288ff`, the last commit before v2 became the homepage. A snapshot of the classic site |
| `origin/feat/chat-assistant-and-branding` | Points at `e22e639`. Fully merged; main is 34 commits ahead. Safe to delete |
