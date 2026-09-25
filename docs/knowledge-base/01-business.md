# Business and content

## Company

- **Name:** ABBADev IT Solutions. It was renamed from "ABBADev Tech Solutions" in commit `62a6c56`.
- **Wordmark:** "ABBADEV" with an "IT Solutions" line underneath.
- **Logo:** a glossy blue/cyan triangle "A" built from network nodes, with a tree growing inside it (`/images/abbadev-logo.png`).
- **Positioning (v2 hero):** "Systems for work that outgrew manual effort."
- **Stance:** organizations should not replace people with AI. They should build systems where people and
  intelligent technology work together. Judgement stays visible, software stays predictable, and AI is limited to the places
  where it genuinely speeds up the work.
- **Recurring themes:** "Architecture first", "AI with guardrails", "Business readable", "Production, not slideware",
  and "People + software + automation + AI".
- **Operating model:** work is split into three modes.

  | Mode | What it covers | Deliverable |
  |---|---|---|
  | Human-led | Strategy, approval, risk calls | Decision map with roles, policies and review points |
  | Deterministic | Routing, validation, audit trails, integrations | Workflow engine, integration contracts, monitoring |
  | Agentic | Summaries, document intake, triage, drafts with human checks | AI workflow with prompts, evals and escalation rules |

- **Audience:** SMEs, growing companies, entrepreneurs and startups, digital-transformation teams, students and professionals.
- **Legal:** the privacy policy follows the Philippine Data Privacy Act of 2012 (RA 10173). The terms have 11 sections and cover
  seminar registration, payment and refunds. Both were last updated on August 31, 2026.
- **Contact:** `info@abbadev.com` (`LEGAL_CONTACT`, `src/App.jsx`).
- **JSON-LD** (`index.html`): type `ProfessionalService`, areaServed "Global". Service types: software architecture, AI automation,
  digital transformation, workflow automation, enterprise solution design.

## Founder

**Rommel Galisanao**, Founder & Principal Systems Architect (`founderProfile`, `src/App.jsx:600`; `src/v2/content.js`).

- **Bio:** turns business complexity into practical software systems. The work combines software architecture, AI automation,
  project leadership and business process analysis, and bridges executive clarity with developer-ready implementation. Accountability stays human at every step.
- **Three focus points:** software architecture and enterprise systems; AI automation with governance and guardrails;
  business-to-technical translation for leaders and teams.
- **Title everywhere:** "Founder & Principal Systems Architect" (`FOUNDER_TITLE` in `src/App.jsx`, also in `src/v2/content.js` and the seminar deck).
- **About page:** approach Understand → Simplify → Automate → Build for growth → Measure. Values: Purpose, Excellence,
  Integrity, Continuous learning, Service, Innovation.
- **Headshot:** `/images/founder.png`, used on v1 and `/about` only. The v2 homepage shows a "credential plate" card instead.

## Services

**The four on the homepage** (v2 `#services` and the v1 homepage):

1. **AI automation strategy:** find the few workflows where AI removes busywork without adding operational risk.
2. **Enterprise architecture:** connect teams, tools, data and decision points with maintainable boundaries.
3. **Custom software builds:** internal tools, portals, dashboards, workflow apps and APIs.
4. **Governance and review:** audit data flow, permissions, prompts, service boundaries, reliability and security before scaling.

**The six categories on `/services`** (`serviceCategories`, `src/App.jsx:1335`):

| # | Category | Links to |
|---|---|---|
| 1 | AI & Automation | `/services/ai-automation` |
| 2 | Custom Software Development | `/services/custom-systems` |
| 3 | Business Systems & Internal Tools | `/business-solutions` |
| 4 | Systems Integration | `/consulting-intake` |
| 5 | Software Architecture & Technology Consulting | `/services/software-architecture` |
| 6 | Project Management & Digital Transformation | `/services/technical-advisory` |

`/services` also has a band for training and workshops.

**Pricing** (from the chat assistant): scoped per workflow, "from a small advisory scope to $50k+ for full builds". The v1
consultation form offers these budget bands: To be scoped, Under $5k, $5k–$15k, $15k–$50k, $50k+.

## Case studies

The data is in `caseStudies` (`src/App.jsx:114-561`), and the v2 homepage has its own copy in `src/v2/content.js`.
Each case has a page at `/cases/<slug>`. Cases 001–003 are anonymized "representative scenarios".

| # | Slug | Title | Type | Headline metric | Notes |
|---|---|---|---|---|---|
| 001 | `operations-command-center` | Transaction intake command center | Transaction operations | Submission traceability: Manual lookup → Status endpoints | Multi-tenant retail/transport POS intake; 8–12 weeks; Laravel 11, Sanctum, MySQL, Redis, Horizon, React. Pipeline: POS → intake gate → SHA-256 integrity → Horizon queue → status endpoints → exceptions. Has a PDF |
| 002 | `document-intake-assistant` | Document intake assistant | AI implementation | Manual review load: 100% → Exception-only | 6 weeks; LLM extraction, review queues, audit log. Has a PDF |
| 003 | `integration-foundation` | Integration foundation | Solution architecture | Duplicate entry: 3 systems → 1 source | 10 weeks; APIs, sync jobs, monitoring. Has a PDF |
| 004 | `guardrailed-site-assistant` | Guardrailed site assistant | Applied AI | Escalation to a human: Every visitor → Qualified leads | This website's own assistant: React, Node proxy, n8n, Postgres, Telegram. Has a PDF |
| 005 | `abbadev-crm` | ABBADev CRM | Product | Lead visibility: Spreadsheets → Live pipeline | Own product; Laravel, React/Vite, MySQL, Sanctum. Live at crm.abbadev.com |
| 006 | `stockora` | Stockora — warehouse intelligence | Full-stack SaaS | Inventory movements: Overwritten → 100% traceable | Own product; NestJS, Prisma, PostgreSQL, Next.js 14, Turborepo, Docker, PWA; FIFO cost layers, ABC cycle counts; 406 automated tests; 9 role-scoped views. Public demo resets nightly |

The one-page summary PDFs are in `public/downloads/case-studies/` and exist for 001–004 only.

## Products

| Product | What it is | Links |
|---|---|---|
| **ABBADev CRM** | One governed pipeline for contacts, deals and follow-ups. Stage governance, role-based access, audit trails, n8n automations | https://crm.abbadev.com/ · `/cases/abbadev-crm` |
| **Stockora** | Warehouse intelligence: multi-warehouse stock, FIFO costing, role-based approvals, offline-first scanner PWA | https://stockora.abbadev.com/ · `/cases/stockora` |

## Events and training

These are listed on `/register` and sold through `/seminar`. The data comes from the events API when `VITE_EVENTS_API` is set, and
otherwise from the static fallback `eventOfferings` (`src/App.jsx:1876`).

| Event id | Title | Format | Date (PHT) | Price |
|---|---|---|---|---|
| `idea-to-intelligent-system` | From Idea to Intelligent System | In-person seminar, Twinniz Cafe, Olongapo | Sat Sep 5, 2026, 2:00 PM, 3 h | ₱399 (down from ₱500), 40 seats, snack included. **Already held** |
| `first-chatbot` | Build Your First AI Chatbot | Online workshop | Oct 8, 2026, 10:00 AM, 3 h | ₱750 |
| `intro-software-dev` | Intro to Software Development | Seminar, Metro Manila | Oct 18, 2026, 9:00 AM, half day | Free |
| `digital-transformation-smes` | Digital Transformation for SMEs | Seminar, Metro Manila | Nov 5, 2026, 1:00 PM, half day | ₱1,200 |
| `no-code-automation` | No-Code Automation with n8n | Online workshop | Nov 19, 2026, 2:00 PM, 3 h | ₱750 |
| `project-management` | Project Management Fundamentals | Webinar | Dec 3, 2026, 3:00 PM, 2 h | Free |

Payment is GCash only. Paid seats are reserved first and confirmed once payment arrives; see [04-pages.md](04-pages.md#seminar).

### The Sep 5, 2026 seminar: local materials (untracked)

- **`AI_Software_Delivery.html`:** the 16-slide deck from that seminar, "From Idea to Intelligent System". It is a self-contained 1920×1080
  HTML presentation with keyboard, touch and wheel navigation. It walks through the delivery loop Discover → Plan → Architect → Build (with AI) →
  Validate → Deliver → Operate/Learn, based on PMBOK 6 and 8. Its message: "AI assists every stage — accountability stays human".
  It closes on "The system is not done at deploy. That is when evidence begins."
- **`images/`:** 98 event photos (`DSC08701–DSC08808.JPG`), about 603 MB, taken on a Sony α6000 at 6000×4000 on 2026-09-05 between
  14:26 and 16:58. They show the presenter, the audience, the break and a group photo of about 25 people. **They show identifiable attendees**, so get consent
  before publishing, and resize them first (about 6 MB each).
