# Forms, chat assistant and API proxy

## Where each form submits

| Form | Page | Browser POSTs to | Proxy forwards to |
|---|---|---|---|
| Consultation brief (`ConsultForm`) | `/#contact` (homepage) | `VITE_CONSULTATION_ENDPOINT` or `/api/consultation`, `formType: 'v2-consultation'` | `N8N_WEBHOOK_URL` (channel `form`) |
| Consultation form | `/v1#contact` | `VITE_CONSULTATION_ENDPOINT` or `/api/consultation` | `N8N_WEBHOOK_URL` (channel `form`) |
| ProjectScoper quiz | `/services` | same as above, `formType: 'project-scoper'` | same |
| Assistant "Book a consult" | assistant widget | `VITE_CHAT_LEAD_ENDPOINT` or `/api/chat-lead` | `N8N_CHAT_WEBHOOK_URL` (channel `chat`) |
| Assistant free-text question | assistant widget | `VITE_ASSISTANT_ENDPOINT` (only if set) | `N8N_ASSISTANT_WEBHOOK_URL` |
| Register form, "Notify me" only | `/register` | `VITE_EVENT_ENDPOINT` or `/api/event-registration` | `N8N_EVENT_WEBHOOK_URL` (channel `event`) |
| Register form, a specific session | `/register` | hands off to `/seminar?event=<slug>` (prefilled) | — |
| Seminar (fallback) | `/seminar` | `/api/event-registration`, `flow: 'reserve-then-pay'` | same |
| Seminar (API mode) | `/seminar` | `{VITE_EVENTS_API}/api/registrations` (+ `/payment`) | direct to the Laravel events API; the proxy isn't involved |

<a id="v1-consultation-form"></a>
## v1 consultation form

**Fields** (`src/App.jsx:4777`):

| Field | Required | Options |
|---|---|---|
| name | yes | — |
| email | yes | — |
| company | no | — |
| preferredContact | no | Email / Phone / Video call |
| workFocus | no | AI automation / Custom software / Architecture review / Digital transformation |
| companyStage | no | Growing business / Startup / Enterprise team / Public sector or nonprofit |
| currentTools | no | — |
| urgency | no | This month / This quarter / Planning phase / Exploring options |
| challenge | yes | — |
| engagement | no | Consultation and roadmap / Architecture review / Prototype or proof of concept / Full software build |
| budget | no | To be scoped / Under $5k / $5k–$15k / $15k–$50k / $50k+ |

**On submit:**
- The browser validates the email against `EMAIL_PATTERN` (`src/lib/patterns.js`).
- The payload gets `source: 'abbadev.com'`, `pageUrl` and `submittedAt` added.
- The success message reads: "A systems architect will reply within one business day."

## Chat assistant (`src/Assistant.jsx`)

A floating launcher that opens a dialog panel. It appears on every page except `/seminar`, `/privacy` and `/terms`.

**Deterministic mode (the default)**
- Starter chips: Services, See proof, How you use AI, Book a consult.
- Your message is checked for keywords against these intents: services, ai, architecture, custom, proof, demo, process,
  pricing, about, contact. If nothing matches, a fallback reply is used.
- The answers are canned text, so the assistant can't make things up. The "proof" answer lists all six case studies. This is the site's "guardrailed assistant" case study.

**AI mode (when `VITE_ASSISTANT_ENDPOINT` is set)**
- Free text is sent with the last 10 turns and `pageUrl`. The client timeout is 32 s.
- The n8n workflow answers from `public/assistant-facts.md` plus the live sessions; see [06-automation-n8n.md](06-automation-n8n.md#ai-assistant-workflow-docsn8n-assistant-workflowmd).
- On any error, empty reply or timeout, it quietly falls back to the deterministic answer.

**Lead capture**
- The flow is challenge → email → submit.
- It POSTs `name: 'Assistant chat visitor'`, the email, the challenge, `workFocus: 'AI automation'`, `source: 'assistant-chat'` and so on.
- If that fails, the user is offered a link to `/#contact`.

**Persistence**
- `localStorage['abba-chat-log']` keeps the last 40 messages.
- `localStorage['abba-chat-open']` remembers whether the panel is open.

**Safety**
- Replies are turned into React nodes; there's no `dangerouslySetInnerHTML`.
- Only `http(s)` URLs, root-relative paths and email addresses become links.

**Accessibility**
- `role="dialog"`, with the message log in an `aria-live="polite"` region.
- Esc closes the panel, and there's a restart button.

## API proxy (`server/consultation-proxy.mjs`)

A plain `node:http` server on `HOST:PORT` (default `127.0.0.1:8787`, so only the local web server can reach it). Its job is to keep the n8n webhook URLs and JWTs server-side.

| Route | Behaviour |
|---|---|
| `GET /api/health` | `{ ok: true, service: 'abbadev-consultation-proxy' }` |
| `OPTIONS *` | 204 with CORS headers |
| `POST /api/consultation` | Forward lead, channel `form` |
| `POST /api/chat-lead` | Forward lead, channel `chat` |
| `POST /api/event-registration` | Forward lead, channel `event` |
| `POST /api/assistant` | Forward chat, return `{ reply }` |
| anything else | 404 |

**Rate limits** (per client, per endpoint, in memory, so they reset on restart):

| Endpoint | Limit |
|---|---|
| `/api/consultation`, `/api/chat-lead` | 5 per 10 minutes |
| `/api/event-registration` | 10 per 10 minutes |
| `/api/assistant` | 20 per 10 minutes |

Over the limit returns 429 with a `Retry-After` header. The client is the last `X-Forwarded-For` entry when the request comes
from loopback (Apache and Nginx append the real IP there), otherwise the socket address.

**Forwarding leads**
- Returns 500 if the pipeline isn't configured.
- A filled-in `website` honeypot field returns `{ ok: true }` without forwarding.
- Rejects JSON over 64 KB, or invalid JSON, with a 400.
- Re-checks the email and returns 422 if it's invalid.
- Forwards only the fields on that pipeline's allow-list (`LEAD_FIELDS`), as trimmed strings: 5,000 characters for
  `challenge`, `message` and `currentTools`, 1,000 for `pageUrl`, 300 for everything else. `utm` is kept as a flat map of up to
  20 string values. **A new form field must be added to `LEAD_FIELDS` or it never reaches n8n.**
- Adds `channel` on the server, overriding whatever the client sent.
- Sends `Authorization: Bearer <JWT>` to n8n.
- If n8n fails, returns 502. On success, returns `{ ok: true }`.

**Forwarding assistant chats**
- Returns 503 if it isn't configured.
- Keeps only `user`/`assistant` turns: the last 10, each at most 2,000 characters. If nothing is left, returns 422.
- The timeout comes from `ASSISTANT_TIMEOUT_MS` (default 30,000 ms). An abort or an n8n 504 returns 504; an empty reply returns 502.

**Hardening**
- `Access-Control-Allow-Origin` is always set to `ALLOWED_ORIGIN`.
- `Cache-Control: no-store`.
- Each pipeline has its own token.

**Not implemented:** CAPTCHA. The rate limits and honeypot stop casual and scripted spam, but not a determined attacker
rotating IP addresses.

## Environment variables

Names only. Never commit the values. The templates are `.env.example` and `deploy/abbadev.env.example`.

**Server (proxy)**, read at runtime from `/etc/abbadev/abbadev.env` in production:

| Variable | Purpose | Fallback |
|---|---|---|
| `PORT` | Listen port | 8787 |
| `HOST` | Listen interface | `127.0.0.1` |
| `ALLOWED_ORIGIN` | CORS origin | `https://abbadev.com` |
| `N8N_WEBHOOK_URL`, `N8N_JWT` | Consultation pipeline | — |
| `N8N_CHAT_WEBHOOK_URL`, `N8N_CHAT_JWT` | Chat leads | the consultation pair |
| `N8N_EVENT_WEBHOOK_URL`, `N8N_EVENT_JWT` | Event registrations | the consultation pair |
| `N8N_ASSISTANT_WEBHOOK_URL` | AI assistant | none (assistant turned off) |
| `N8N_ASSISTANT_JWT` | AI assistant | `N8N_JWT` |
| `ASSISTANT_TIMEOUT_MS` | Assistant upstream timeout | 30000 |

**Frontend (Vite)**: **baked in at build time**, so rebuild after changing them.

| Variable | Effect when empty |
|---|---|
| `VITE_CONSULTATION_ENDPOINT` | `/api/consultation` |
| `VITE_CHAT_LEAD_ENDPOINT` | `/api/chat-lead` |
| `VITE_EVENT_ENDPOINT` | `/api/event-registration` |
| `VITE_ASSISTANT_ENDPOINT` | Assistant stays deterministic |
| `VITE_EVENTS_API` | No sessions listed anywhere; `/seminar` uses reserve-then-pay. Locally, use `/events-api` in `.env.local` (read-only pass-through in `vite.config.js`) |

## Local development

```bash
npm run dev:proxy   # terminal 1: proxy on :8787 (export the N8N_* vars first)
npm run dev         # terminal 2: Vite forwards /api to :8787 (vite.config.js)
```

`npm run preview` uses the same `/api` proxy.
