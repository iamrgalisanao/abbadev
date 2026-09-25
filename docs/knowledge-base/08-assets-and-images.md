# Assets and images

Every file below was checked two ways:
- **Viewed**, to write the description.
- **Compared with the live site.** The 29 files served by abbadev.com (images, favicon, OG image and PDFs) are byte-identical to the
  copies in `public/`.

Sizes are shown in KB (1 KB = 1,000 bytes).

## Brand and meta

| Path | Size | Dimensions | Used by | What it shows |
|---|---|---|---|---|
| `/images/abbadev-logo.png` | 148 KB | 555×449, transparent | Favicon and apple-touch-icon (`index.html`), v2 header and footer, v1 headers | Glossy blue/cyan triangle "A" made of network nodes, with a tree growing inside |
| `/og-abbadev.png` | 460 KB | 1200×630 | `og:image`, `twitter:image` | Share card generated from `profile-fb.png`: the logo tile centred on a blurred, darkened copy of itself. Replaced the old `og-image.png` ("Tech Solutions") on 2026-09-25; the new filename makes Facebook and LinkedIn fetch it fresh |
| `/images/profile-fb.png` | 1.49 MB | 1254×1254 | JSON-LD `logo` and `image` (`index.html`) | Square brand tile: glowing network-tree "A" logo over "ABBADEV / IT SOLUTIONS" on dark navy. Replaced the old `profile.webp` ("Tech Solutions") |
| `/favicon.svg` | 10 KB | 48×46 | **unused** (Vite default) | Purple lightning-bolt mark |
| `/icons.svg` | 5 KB | sprite | **unused** (Vite default) | Social icon sprite (bluesky, discord, github, x…) |

## v2 hero and CTA scene (parallax layers)

| Path | Size | Dimensions | What it shows |
|---|---|---|---|
| `/images/v2/hero-sky.png` | 44 KB | 1280×760 | Dark navy starfield with a soft blue glow along the bottom |
| `/images/cloud.png` | 1.08 MB | 2173×724 | Dark blue clouds framing the left and right edges, transparent in the centre |
| `/images/layer03.png` | 482 KB | 1672×941 | Far layer: pale hazy skyline in front of mountains, fading into mist |
| `/images/layer02.png` | 410 KB | 1672×713 | Mid layer: steel-blue city skyline with towers, an arch bridge and a cable-stayed bridge |
| `/images/layer01.png` | 123 KB | 1672×941 | Foreground: black silhouettes of trees and low buildings |
| `/images/card-bg-1.jpg` | 32 KB | 906×1200 | Background behind the case cards: moody dark-blue dunes at night |
| `/images/card-bg-2.jpg` | 49 KB | 906×1200 | Background behind the case cards: dark rocky canyon with mist and a blue-lit ridge |

The `card-bg-*` paths are built from a template string (`card-bg-${(i % 2) + 1}.jpg`), so searching the code for the exact filename finds nothing.

## Service photos (`/images/services/`, all 1200×800)

| File | Used by | What it shows |
|---|---|---|
| `ai-automation.jpg` / `.webp` | `/services`, v2 case 002 | 3D blue letters "AI" over a surface of hexagon dots with tangled wires |
| `business-systems.jpg` / `.webp` | `/services`, v2 case 001 | Laptop showing a dark analytics dashboard (users over the last 7 days, bounce-rate bars) |
| `custom-software.jpg` / `.webp` | `/services`, v2 case 004 | Angled close-up of colourful PHP code in a dark editor |
| `systems-integration.jpg` / `.webp` | `/services`, v2 case 003 | Server racks with orange and teal fibre cables and green LEDs |
| `software-architecture.jpg` | `/services` | Hand pinning string between printed app wireframes on a wall |
| `project-delivery.jpg` | `/services` | Bright high-rise office, laptop by floor-to-ceiling windows |
| `training.jpg` | `/services` (Training band) | Presenter at a lectern next to a projected slide, audience with laptops |
| `hero.jpg` | `/services` hero | Top-down shot of four people working on laptops at a wooden table |

The WebP versions of `hero`, `project-delivery`, `software-architecture` and `training` are **unused**. v1 loads only their JPGs.

## Case studies and products

| Path | Size | Dimensions | Used by | What it shows |
|---|---|---|---|---|
| `/images/case-studies/digital-transformation.png` | 69 KB | 200×200 | Case 001 badge (`/cases`) | Neon-blue round badge with three networked monitors |
| `/images/case-studies/ai-implementation.png` | 59 KB | 200×200 | Case 002 badge | Neon-blue badge with a document and sparkles |
| `/images/case-studies/solution-architect.png` | 65 KB | 200×200 | Case 003 badge | Neon-blue badge with three connected cubes |
| `/images/case-studies/ai-connection.png` (+ `.webp` 900×600) | 2.35 MB | 1536×1024 | Case 004, and `/v1` | Isometric glowing-blue "AI" chip wired to documents, a chart monitor and a server |
| `/images/mockup_crm.png` (+ `.webp`) | 1.49 MB (webp 66 KB) | 1672×941 | CRM case, v2 work and products, `/v1` | Laptop showing the "CRM.Sales" demo dashboard: 10 leads, 6 open deals, ₱2.04M weighted pipeline, ₱500K won, 50% win-rate gauge, deals table |
| `/images/stockora-showcase.svg` | 26 KB | 1600×1000 | Stockora case, v2, `/v1` | Board of six dark app panels (Dashboard, Receiving, Transfers, Inventory, Cycle Counts, Analytics with a ₱8.41M FIFO valuation chart), amber `#f5a623` accent |
| `/images/founder.png` | 1.97 MB | 1122×1402 | `/about`, `/v1` | Head-and-shoulders portrait: short dark hair, black rectangular glasses, black blazer, warm blurred café background |

## Downloads

`/downloads/case-studies/` holds a one-page summary PDF for each of the first four case studies:

- `operations-command-center.pdf`
- `document-intake-assistant.pdf`
- `integration-foundation.pdf`
- `guardrailed-site-assistant.pdf`

Each is about 4.6 KB. The CRM and Stockora case studies don't have one.

## Optimisation opportunities

- `founder.png` (1.97 MB), `case-studies/ai-connection.png` (2.35 MB), `mockup_crm.png` (1.49 MB) and `cloud.png` (1.08 MB) are large PNGs.
  Serve WebP or AVIF where a PNG is still loaded.
- Remove the unused assets: the four unused service WebPs, `favicon.svg` and `icons.svg`.

## Untracked local media (not in git)

- `images/DSC08701–DSC08808.JPG`: 98 photos from the Sep 5, 2026 seminar, about 603 MB in total. They show identifiable attendees, so get consent and resize them
  before publishing. See [01-business.md](01-business.md#the-sep-5-2026-seminar-local-materials-untracked).
- `AI_Software_Delivery.html`: the seminar slide deck. It embeds two base64 JPEGs and hotlinks six Unsplash images.
