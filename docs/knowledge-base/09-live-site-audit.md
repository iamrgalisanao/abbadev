# Live site audit: abbadev.com (2026-09-25)

> **Snapshot.** This describes abbadev.com as it was on 2026-09-25, **before** the fixes in
> [10-known-issues.md](10-known-issues.md) were deployed. It is kept as the baseline those fixes were made against.

## Method

- **Pages:** crawled every route linked from the site in the built-in browser (30 paths, plus one made-up URL), and recorded
  each page's headings, images and PDF links.
- **Files:** fetched every image, icon and PDF, and compared its SHA-256 hash with the file in `public/`.

## Result: the live site is current `main`

- The page content and the links match the code.
- All 29 static files are byte-identical to the repo.
- The one visible difference is the header "Classic site" link. It's still live on abbadev.com, but it has been removed in the working tree and not deployed yet.

## Route inventory

| Route | Renders | Images |
|---|---|---|
| `/` | v2 homepage | logo, hero-sky, cloud, layer01–03, card-bg-1/2, 4 service photos, CRM mockup, Stockora board |
| `/v1` | Classic homepage | logo, ai-connection, CRM mockup, Stockora board, founder |
| `/services` | Services page | logo, all 8 service photos |
| `/cases` | Case directory | logo, 4 case badges, CRM mockup, Stockora board |
| `/cases/operations-command-center` … `guardrailed-site-assistant` | Case page, with PDF download | none |
| `/cases/abbadev-crm`, `/cases/stockora` | Case page, with live-app link | CRM mockup / Stockora board |
| `/about` | About page | logo, founder |
| `/register` | Sessions list and form | logo |
| `/seminar?event=…` | Ad landing page with countdown | none |
| `/services/*` (4), `/insights` + 3, `/community`, `/contact`, `/consulting-intake`, `/business-solutions`, `/workflow-demos`, `/implementation-notes` | Generic `ContentPage` template | logo |
| `/does-not-exist` | **The homepage** (no 404) | — |

Events listed on `/register` at the time of the crawl:

| Event | Date | Location | Price |
|---|---|---|---|
| Build Your First AI Chatbot | Oct 8 | Online | ₱750 |
| Intro to Software Development | Oct 18 | Metro Manila | Free |
| Digital Transformation for SMEs | Nov 5 | Metro Manila | ₱1,200 |
| No-Code Automation with n8n | Nov 19 | Online | ₱750 |
| Project Management Fundamentals | Dec 3 | Online | Free |

The Sep 5 flagship seminar is no longer listed.

## Findings

Findings 1, 2, 3, 4, 5, 6 and 7 were fixed in the code on 2026-09-25. They stay live on abbadev.com until the next deploy.

1. **`sitemap.xml` is stale.** It lists `/` plus hash anchors such as `/#platform` and `/#resources`, which search engines ignore. It doesn't list
   `/services`, `/cases`, the six case pages, `/about` or `/register`.
2. **Every page has the same `<title>` and meta description**: "ABBADev IT Solutions | AI Automation and Software Architecture".
   No page sets its own title, description or canonical URL, which hurts search results and link previews.
3. **No 404.** Unknown URLs, and case URLs with an unknown slug, return the homepage with status 200. Search engines can index these as duplicate content.
4. **14 routes are thin placeholder pages.** They all use the same `ContentPage` template: a title and the same "Representative use
   cases" block. That includes all four `/services/*` detail pages and all the insights pages.
5. **The header "Book a consultation" links to `#contact`, but the final CTA links to `/consulting-intake`.** That page is also a
   template page with **no form**. Visitors to the v2 homepage have no direct consultation form; only `/v1#contact` and the
   `/services` quiz collect a full brief.
6. **The OG image still says "ABBADev Tech Solutions"**, the old company name.
7. **The chat assistant is out of date.** It appears on every page except `/seminar`, `/privacy` and `/terms`, and in deterministic mode it still says there are "three representative case studies".
8. **Event pages read `?event=` only once, when the page first loads.** Direct links work. In-app history navigation between two events doesn't re-render,
   which only matters if client-side routing is added later.
