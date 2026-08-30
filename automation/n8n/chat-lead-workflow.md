# ABBADev Chat-Assistant Lead Workflow

Build this n8n workflow to receive **consultation leads from the site assistant**
(the chat widget in `src/Assistant.jsx`).

## Where this fits

The assistant answers general questions (company, owner, services, pricing)
**client-side** from a curated knowledge base — those never leave the browser.
Only when a business owner completes the **Book a consult** flow (workflow
challenge + email) does the widget POST a lead. That request path is:

```text
Assistant.jsx  ->  POST /api/chat-lead  ->  consultation-proxy.mjs  ->  n8n webhook
```

The proxy (`server/consultation-proxy.mjs`) validates the email, stamps
`channel: "chat"`, and forwards to:

```text
POST https://n8nautomation.abbadev.com/webhook/abbadev-chat-lead
Authorization: Bearer <N8N_CHAT_JWT>
```

So this workflow only has to handle **qualified consultation leads** — one clean
path from webhook to your phone.

## Target workflow

```text
Webhook (Header Auth, respond immediately)
  -> Code / Normalize + validate
  -> Postgres / Insert lead
  -> Telegram / Notify Rommel
```

## 1. Webhook node

- HTTP Method: `POST`
- Path: `abbadev-chat-lead`
- Authentication: `Header Auth`
- Respond: `Immediately` (returns `200` the moment the lead is accepted, so the
  visitor always sees "Sent" even if a downstream node is briefly retrying)

### Header Auth credential

The proxy sends a static bearer token — not a signed JWT — so use n8n's
**Header Auth** credential:

- Name: `Authorization`
- Value: `Bearer <your-chat-token>`

Give the chat webhook its **own** secret, distinct from the consultation form's,
so a leak of one pipeline's token does not expose the other:

```env
# server/.env on the VPS
N8N_CHAT_WEBHOOK_URL=https://n8nautomation.abbadev.com/webhook/abbadev-chat-lead
N8N_CHAT_JWT=your-chat-token
```

> The `Value` in the n8n credential must match `Bearer ` + the raw `N8N_CHAT_JWT`
> value, character for character. A mismatch returns `403` and the proxy relays
> a `502` to the widget. (`N8N_CHAT_JWT` falls back to `N8N_JWT` if unset, but
> keep them separate in production.)

## 2. Expected payload

This is exactly what the proxy forwards (fields from `Assistant.jsx` plus the
`channel` tag the proxy adds):

```json
{
  "name": "Assistant chat visitor",
  "email": "owner@company.com",
  "challenge": "Manual invoice approvals across three systems.",
  "workFocus": "AI automation",
  "engagement": "Consultation and roadmap",
  "source": "assistant-chat",
  "channel": "chat",
  "pageUrl": "https://abbadev.com/",
  "submittedAt": "2026-08-30T10:03:57.483Z"
}
```

## 3. Code node — normalize + validate

Add a Code node after the Webhook. Mode: `Run Once for Each Item`. Paste:

```js
const body = $json.body ?? $json

const clean = (value) => String(value ?? '').trim()
const email = clean(body.email).toLowerCase()
const challenge = clean(body.challenge)

// Defense in depth — the proxy already validated, but never trust the wire.
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  throw new Error('Invalid email address')
}
if (challenge.length < 3) {
  throw new Error('A workflow challenge is required')
}

const normalized = {
  name: clean(body.name) || 'Assistant chat visitor',
  email,
  challenge,
  workFocus: clean(body.workFocus) || 'AI automation',
  engagement: clean(body.engagement) || 'Consultation and roadmap',
  source: clean(body.source) || 'assistant-chat',
  channel: 'chat',
  pageUrl: clean(body.pageUrl),
  submittedAt: clean(body.submittedAt) || new Date().toISOString(),
}

const telegramText = [
  '🟢 New consultation lead — chat assistant',
  '',
  `Email: ${normalized.email}`,
  `Challenge: ${normalized.challenge}`,
  '',
  `Focus: ${normalized.workFocus}`,
  `Engagement: ${normalized.engagement}`,
  `Page: ${normalized.pageUrl}`,
  `Submitted: ${normalized.submittedAt}`,
].join('\n')

return { json: { ...normalized, telegramText } }
```

## 4. Postgres node — insert lead

Run `automation/n8n/chat-leads-schema.sql` once against your database to create
the `chat_leads` table, then add a Postgres node:

- Operation: `Insert`
- Schema: `public`
- Table: `chat_leads`
- Mapping: `Map Each Column Manually`

| Column | Value |
| --- | --- |
| `name` | `{{ $json.name }}` |
| `email` | `{{ $json.email }}` |
| `challenge` | `{{ $json.challenge }}` |
| `work_focus` | `{{ $json.workFocus }}` |
| `engagement` | `{{ $json.engagement }}` |
| `source` | `{{ $json.source }}` |
| `channel` | `{{ $json.channel }}` |
| `page_url` | `{{ $json.pageUrl }}` |
| `submitted_at` | `{{ $json.submittedAt }}` |

Leave `id`, `created_at`, and `status` unmapped — the table defaults fill them.

## 5. Telegram node — notify

- Credential: your Telegram bot token (from **@BotFather**)
- Resource: `Message`
- Operation: `Send Message`
- Chat ID: your personal chat ID (message **@userinfobot** to get it)
- Text: `{{ $json.telegramText }}`

> Talk to your bot once (send it any message) before the first run, or Telegram
> rejects the send with "chat not found".

### Prefer email instead of Telegram?

Swap the Telegram node for an email node with:

- To: `rommel.galisanao.22@gmail.com`
- Subject: `New consultation lead — chat assistant`
- Text: `{{ $json.telegramText }}`

## 6. Test it

From the VPS (or anywhere the token is known):

```bash
curl -i -X POST https://n8nautomation.abbadev.com/webhook/abbadev-chat-lead \
  -H "Authorization: Bearer your-chat-token" \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@company.com","challenge":"Manual invoice approvals across three systems.","source":"assistant-chat","pageUrl":"https://abbadev.com/"}'
```

Expect `200`, a new row in `chat_leads`, and a Telegram message. Then do a real
end-to-end run: open the site, use the assistant's **Book a consult** chip,
answer the two questions, and confirm the lead lands.

## 7. Optional next automation

Once the base path is reliable, add an AI node before the Telegram/email node to
generate a one-line qualification summary and a suggested first reply — keep it
**internal only** until reviewed. This mirrors the "AI drafts, a human confirms"
thesis the whole site argues for, which is exactly the story the case study tells.
