# v2 homepage (`/`)

This is the current default homepage, added in commit `a976b0c`. The earlier homepage is still available at `/v1`.
The v2 page is self-contained: it never imports from `App.jsx`, so there's no circular dependency.

| File | Role |
|---|---|
| `src/v2/V2Home.jsx` | Page component, including a local `ProductShot` |
| `src/v2/content.js` | All copy, as plain exported objects: `nav, hero, position, pillars, services, work, products, founder, plate, finalCta, footer` |
| `src/v2/motion.jsx` | `Reveal`, `TextReveal`, `TypewriterHeading` (unused), `ScrollProgress`, `TiltCard`, `Parallax` |
| `src/v2/motion-utils.js` | `prefersReduced()`, `useLenis()` (kept out of motion.jsx to satisfy react-refresh) |
| `src/v2/SiteHeader.jsx` | The site-wide header, used by the homepage and every interior page |
| `src/v2/ConsultForm.jsx` | Consultation brief form; posts to `/api/consultation` |
| `src/v2/CtaGradient.jsx` | WebGL simplex-noise gradient behind the final CTA card |
| `src/v2/v2.css` | All styles, scoped under `.v2-shell` |

**To edit copy, change `content.js`.** The only headings not in `content.js` are the capability H2 and the final CTA button
href, which are hard-coded in `V2Home.jsx`.

## Sections, in order

1. **Scroll progress bar:** a fixed 2 px accent gradient across the top.
2. **Header:** the shared `SiteHeader` (see [02-architecture.md](02-architecture.md#navigation)).
   - Sticky and blurred, with the logo and "ABBADEV / IT Solutions".
   - Anchor links: What we do `#capability`, Work `#work`, Products `#products`, About `#founder`, plus Sessions → `/register`.
   - A "Book a consultation" pill that jumps to `#contact`, and a menu button at 900px and below.
   - The "Classic site" link was removed from the header and footer on 2026-09-25. `/v1` still works if you know the URL.
3. **Hero:**
   - Full-screen night-city scene built from parallax layers, back to front: `v2/hero-sky.png`, `cloud.png`, a glow, then
     `layer03.png` and `layer02.png`, and finally `layer01.png` in front of the text.
   - Badge: "Systems architecture · AI automation · custom software".
   - H1, revealed letter by letter: "Systems for work / that outgrew manual effort."
   - CTAs: "Book a consultation" → `#contact` and "See the work" → `#work`.
   - Ticker: Laravel · React · n8n / Governed automation / AI with guardrails / Production, not slideware.
4. **The stance:** "Not a portfolio page. A walkthrough of how the work actually runs." Three cards follow: Command center,
   Automation map and AI workbench.
5. **Operating model (`#capability`):** "The future of operations is mixed — human, deterministic, and agentic."
   - A tablist switches between the Human-led, Deterministic and Agentic `pillars`.
   - The selected tab shows its title, "best for" text and deliverable.
6. **Services (`#services`):** the four service cards, plus an "All services →" link to `/services`.
7. **Proof (`#work`):** "Real systems, in production."
   - All six case studies appear as full-screen sticky panels that stack as you scroll.
   - As the next panel slides over, the one underneath shrinks and fades. JS sets `--cover` to drive this.
   - Each card alternates sides. It shows the kicker, title, result and a before → after metric over a `card-bg-{1,2}.jpg`
     background with the case image. The whole card links to `/cases/<slug>`.
8. **Products (`#products`):** "Products we build — and operate in production."
   - Two alternating rows: ABBADev CRM and Stockora.
   - Each row has three bullets, "Launch it ↗" (opens in a new tab), "Read the case →", and a screenshot in a browser frame.
9. **Founder (`#founder`):**
   - A tilt-on-hover "credential plate" card showing: Principal Architect · Focus / Approach / Accountability.
   - The bio, three points, and "More about ABBADev →" linking to `/about`.
   - No photo.
10. **Final CTA (`#start`):** "Recognize this pattern in your operations?"
    - Three steps, then a "Book a consultation" button that scrolls down to the form (`#contact`).
    - The skyline layers sit in front of and behind the card, with the WebGL gradient inside it.
11. **Consultation brief (`#contact`):** "Tell us about the workflow."
    - Every "Book a consultation" link on the homepage, and `/#contact` links from other pages, land here.
    - Left: intro, what happens next, and `info@abbadev.com`. Right: `ConsultForm`.
    - Fields: name*, work email*, company, work focus, company stage, timeline (defaults to "This quarter"), engagement, budget, and the workflow* (at least 10 characters, which the n8n workflow requires).
      Option labels are in `consult.fields` in `content.js` and must match the n8n lead-scoring rules.
    - Posts `formType: 'v2-consultation'` to `VITE_CONSULTATION_ENDPOINT` or `/api/consultation`. A hidden honeypot field (`website`) silently drops bot submissions.
    - Success replaces the form with "Brief received."; failure shows an alert and keeps what was typed.
12. **Footer:**
    - Company: About, Services, Case studies.
    - Products: CRM, Stockora.
    - Connect: Book a consultation.
    - "© 2026 ABBADev IT Solutions. Founded by Rommel Galisanao."
13. **`<Assistant/>`:** the floating chat widget. See [05](05-forms-assistant-proxy.md).

On mount, V2Home adds the `v2-active` class to `<html>` and removes it on unmount. It turns on Lenis smooth scrolling (`lerp 0.1`).

## Motion system

| Piece | Behaviour | Reduced motion |
|---|---|---|
| `useLenis` | Smooth wheel scrolling with its own rAF loop | Off |
| `Reveal` | IntersectionObserver fade-up (26 px, 0.7 s). `delay` prop staggers siblings | Shown immediately |
| `TextReveal` | Splits into words, then letters; each letter fades in using a keyframe (so it plays even when already in view) | Shown immediately |
| `ScrollProgress` | `scaleX` of scroll fraction, rAF-throttled | Still runs (it's feedback, not animation) |
| `Parallax` | `scroll` mode: `y = scrollY × rate`. `center` mode: offset from the viewport centre × rate | Off |
| `TiltCard` | Pointer-driven `--rx/--ry/--mx/--my` with a 6° resting tilt | Flat |
| Work stack | CSS `position: sticky`, plus `--cover` for the scale/fade | Not pinned (static) |
| `CtaGradient` | WebGL shader, capped at DPR 2, resized with ResizeObserver; transparent if WebGL is unavailable | Draws one static frame |

## Design tokens (`.v2-shell`)

| Token | Value |
|---|---|
| `--v2-bg` | `#05060a`, with a radial blue glow at the top |
| `--v2-ink` | `#f5f6f8`; soft and faint variants at 66% and 42% |
| `--v2-accent` / `--v2-accent-2` / `--v2-accent-strong` | `#4da3ff` / `#38e0d4` / `#2f7fe0` |
| Surfaces, borders | white at 2.8% / 5%; borders at 9% / 16% |
| Radii | 14 / 22 / 28 px, pill 999 px |
| Font | Montserrat 200–800 (Google Fonts). Mono is IBM Plex Mono, which v2.css **doesn't load itself** |
| H1 / H2 / H3 | `clamp(2.7rem, 6.4vw, 5.3rem)` w300 / `clamp(1.95rem, 4.4vw, 3.4rem)` w300 / `clamp(1.3rem, 2.3vw, 1.8rem)` w500 |
| Layout | max width 1180 px; side padding `clamp(1.25rem, 5vw, 3rem)`; section padding `clamp(4rem, 10vw, 8rem)` |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |

## Responsive behaviour

- **≤ 900 px:**
  - The nav links move into a menu opened by a menu button.
  - All grids collapse to one column.
  - **Case pinning is turned off.** The cards stack normally, with the image on top.
- **≤ 560 px:** the ticker gap is tighter.
- **Hero height:** uses `100svh` so it fits mobile browser toolbars.

## Content defined but not rendered

These fields exist in `content.js` or `motion.jsx` but nothing on the page uses them:

- `hero.sub`
- `nav.brand`
- `work.cases[].metric.label`
- `work.cases[].screenshot`
- `TypewriterHeading`
