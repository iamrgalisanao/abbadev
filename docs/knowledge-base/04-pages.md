# Pages (everything except the v2 homepage)

All of these pages live in `src/App.jsx` and are styled by `src/App.css`. Interior pages share the `CasePageHeader`
header, which has the logo, theme toggle and `primaryNav`, and most of them show breadcrumbs.

## `/v1`: classic homepage

This is the homepage from before v2. It is preserved as a snapshot on the `v1-legacy` branch, and it's still live at `/v1`.

**Section order:**

1. Hero: "Systems for work that has outgrown manual effort." with an animated **workflow blueprint**. The stages run Client portal → Operations
   (rules engine) → AI review → Data layer → Leadership approval. Each stage takes 1.5 s. The loop pauses on hover or when off-screen, and shows
   the end state when reduced motion is on.
2. Proof strip: Architecture first · AI with guardrails · Business readable.
3. `#platform`: Command center, Automation map, AI workbench.
4. `#workflow`: tabs for the three modes (Human-led, Deterministic, Agentic).
5. `#services`: the four services.
6. `#work`: a grid of the six cases.
7. `FeaturedSessions`: up to 3 featured events from the API. The whole band is hidden if the API isn't configured or returns nothing.
8. `#product`: ABBADev CRM and Stockora. Each has a screenshot that tilts toward the cursor.
9. A mid-page CTA.
10. `#resources`: Case studies, Architecture notes, Training library ("Coming soon") and Automation examples.
11. `#founder`: photo and bio.
12. `#contact`: the full **consultation form** (see [05](05-forms-assistant-proxy.md#v1-consultation-form)).
13. Footer with four link groups: Services, Work, Learn, ABBADev.
14. The chat assistant.

## `/cases` and `/cases/:slug`

**`CasesIndexPage`**
- Filter pills built from each case `type`, each with a count.
- The cards show the badge image or product mockup, category, result and metric.
- A CTA to `/consulting-intake`.

**`CaseStudyPage`** sections, in order:
1. Breadcrumbs.
2. Hero, with the code, title and result.
3. Meta strip: Client / Sector / Duration / Stack.
4. A "Launch the live app" link (products) or "Download the 1-page summary" (PDF).
5. A screenshot (products only).
6. **01 Problem**, **02 Approach**, **03 Implementation** (phases).
7. An optional animated `CaseWorkflow` pipeline.
8. **04 Results**: metrics, with the "before" value struck through, plus a quote.
9. **05 Governance**.
10. A CTA.
11. Previous/next pagination that wraps around.

The default disclaimer reads "Details anonymized to protect the client operating context."

## `/services`

- Hero: "Design, build, automate, and improve the systems you use every day."
- Six service category cards, each with a photo. The images use `<picture>` with a WebP source and a JPG fallback.
- **ProjectScoper** quiz: four questions (org type, challenge, focus, timeline) followed by a contact step.
  - It works out a recommended service and POSTs `formType: 'project-scoper'` to `/api/consultation`.
  - It promises a reply within one business day.
- A "Training & workshops" band linking to `/register`.
- A final CTA.

## `/about`

- Hero: "Practical technology that moves the business forward."
- Five capabilities.
- Founder block with photo.
- A five-step approach.
- Philosophy: "People + software + automation + AI".
- Vision and mission.
- Six values.
- Five audience segments.
- A link to `/community`.
- CTAs to `/consulting-intake`.

## `/register`

- Hero: "Learn practical technology - and put it to work."
- Four benefits, including a certificate on request.
- Filters: All / For students / For SME owners.
- Event cards. Each card's **Register** button links to `/seminar?event=<id>`.
- Events come from `GET {VITE_EVENTS_API}/api/events`. If that fails, the page uses the static `eventOfferings`.
- An inline form at the bottom:
  - Fields: name, email, Student/SME, organization, session (default "Notify me of the next session" = `notify-next`), phone and message.
  - It POSTs to `/api/event-registration`.

## `/seminar`

A conversion page for Facebook ads, with no site nav and no chat widget. It has its own header, footer and legal links.

**What it shows**
- **Without `?event`:** the flagship offer, "From Idea to Intelligent System". The details are in `flagshipSeminar` (`App.jsx:2727`):
  - Sep 5, 2026, 2 PM PHT, Twinniz Cafe, Olongapo.
  - Price ₱399, down from ₱500. Capacity 40.
  - A countdown timer.
  - Sections: what you'll learn, who it's for, outcomes, and a six-question FAQ.
- **With `?event=<slug>`:** a leaner page built from the API event. An unknown slug shows "We couldn't find that session."

**How registration works**

1. **When `VITE_EVENTS_API` is set, it uses `TwoStepRegister`:**
   - Step 1 collects name, email, audience (Student/Developer/Professional), a PH mobile number (auto-formatted as `0917 123 4567`) and
     organization. It POSTs to `/api/registrations` with `lead_source: 'fb-ad-landing'` and the UTM parameters.
   - A free event finishes at that point.
   - A paid event goes to step 2. The API returns the GCash amount, number, name and QR code. The user uploads the reference number, the amount and a
     receipt (image or PDF, up to 5 MB) as multipart to `/api/registrations/{id}/payment`.
   - Laravel 422 errors are shown next to the relevant fields. The reference field is protected from password-manager autofill.
2. **Otherwise, it uses reserve-then-pay:** the form POSTs `flow: 'reserve-then-pay'` to `/api/event-registration`, then shows the hard-coded
   GCash details (`paymentMethods`).

## Content pages

`ContentPage` is a generic template. Each page has an icon, a title, an intro, four blocks, a list of "Representative use cases",
and the CTA "Bring one real workflow into the conversation."

The 14 routes that use it:

| Group | Routes |
|---|---|
| Services | `/services/ai-automation`, `/services/software-architecture`, `/services/custom-systems`, `/services/technical-advisory` |
| Insights | `/insights`, `/insights/system-design`, `/insights/ai-operations`, `/insights/digital-transformation` |
| Other | `/workflow-demos`, `/implementation-notes`, `/community`, `/contact`, `/consulting-intake`, `/business-solutions` |

- `/consulting-intake` is where the v2 final CTA lands. It describes how a brief is routed to n8n, email and Notion. **It has no form of its own.**
- The Insights pages are placeholders. There are no articles yet.

## `/privacy`, `/terms`

`LegalPage` renders `privacyDoc` and `termsDoc`. The contact is `info@abbadev.com`, and both were last updated on August 31, 2026.
