# ABBADev Seminar & Webinar Registration Workflow

Build this n8n workflow to receive **seminar/webinar sign-ups from the `/register`
page** (`RegisterPage` in `src/App.jsx`). This is the automation the page itself
showcases: a visitor registers, and n8n confirms them, stores the roster, alerts
the team, and later reminds them — no manual step.

## Where this fits

The registration form POSTs to the consultation proxy, which validates the email,
stamps `channel: "event"`, and forwards to a dedicated n8n webhook:

```text
RegisterPage  ->  POST /api/event-registration  ->  consultation-proxy.mjs  ->  n8n webhook
```

```text
POST https://n8nautomation.abbadev.com/webhook/abbadev-event-registration
Authorization: Bearer <N8N_EVENT_JWT>
```

`N8N_EVENT_WEBHOOK_URL` / `N8N_EVENT_JWT` both fall back to the consultation
values when unset (see `DEPLOYMENT.md`), so set them explicitly in production to
keep the registration pipeline and its secret separate.

## Target workflow

```text
Webhook (Header Auth, respond immediately)
  -> Code / Normalize + validate + enrich
  -> Postgres / Insert registration (ON CONFLICT DO NOTHING, RETURNING id)
  -> IF / new row inserted?           (id present -> true; duplicate -> false)
       true  -> Registrant confirmation email (branded HTML) -> Telegram / Notify Rommel
       false -> No-Op (duplicate: no email, no alert)
```

Because the webhook already responded `200`, a duplicate submission still shows
the visitor "You're registered" — it just doesn't insert a second row or send a
second email/alert. A second, scheduled workflow (below) sends the reminder.

## 1. Webhook node

- HTTP Method: `POST`
- Path: `abbadev-event-registration`
- Authentication: `Header Auth`
- Respond: `Immediately` (the visitor sees "You're registered" the moment the
  sign-up is accepted, even if a downstream node is briefly retrying)

### Header Auth credential

The proxy sends a static bearer token, so use n8n's **Header Auth** credential:

- Name: `Authorization`
- Value: `Bearer <your-event-token>`

```env
# server/.env on the VPS
N8N_EVENT_WEBHOOK_URL=https://n8nautomation.abbadev.com/webhook/abbadev-event-registration
N8N_EVENT_JWT=your-event-token
```

> The credential `Value` must equal `Bearer ` + the raw `N8N_EVENT_JWT`, character
> for character. A mismatch returns `403` and the proxy relays a `502` to the page.

## 2. Expected payload

Exactly what the proxy forwards (fields from the form plus the `channel` tag). A
specific-session sign-up:

```json
{
  "name": "Maria Santos",
  "email": "maria@business.ph",
  "organization": "Santos Trading",
  "phone": "+63 917 000 0000",
  "message": "Hoping to automate our quotation approvals.",
  "audience": "SME owner",
  "eventId": "digital-transformation-smes",
  "eventTitle": "Digital Transformation for SMEs",
  "eventDate": "Nov 5, 2026",
  "source": "abbadev.com",
  "channel": "event",
  "pageUrl": "https://abbadev.com/register",
  "submittedAt": "2026-08-31T01:12:11.201Z"
}
```

A "notify me of the next session" sign-up sends `eventId: "notify-next"` with an
empty `eventDate` — the Code node routes it to the waitlist.

## 3. Code node — normalize, validate, enrich

Add a Code node after the Webhook. Mode: `Run Once for Each Item`. Paste:

```js
const body = $json.body ?? $json
const clean = (v) => String(v ?? '').trim()

const email = clean(body.email).toLowerCase()
const name = clean(body.name)

// Defense in depth — the proxy already validated, but never trust the wire.
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  throw new Error('Invalid email address')
}
if (!name) {
  throw new Error('Name is required')
}

// Keep this catalog in sync with `eventOfferings` in src/App.jsx. It enriches
// each sign-up with details the form does not post (start time, mode, price)
// and a machine-readable start used by the reminder workflow. Times are PHT.
const SESSIONS = {
  'ai-automation-smes':          { title: 'AI & Automation for Business',    start: '2026-09-24T14:00:00+08:00', mode: 'Online',    location: '',             price: 'Free' },
  'first-chatbot':               { title: 'Build Your First AI Chatbot',     start: '2026-10-08T10:00:00+08:00', mode: 'Online',    location: '',             price: '₱750' },
  'intro-software-dev':          { title: 'Intro to Software Development',    start: '2026-10-18T09:00:00+08:00', mode: 'In-person', location: 'Metro Manila', price: 'Free' },
  'digital-transformation-smes': { title: 'Digital Transformation for SMEs', start: '2026-11-05T13:00:00+08:00', mode: 'In-person', location: 'Metro Manila', price: '₱1,200' },
  'no-code-automation':          { title: 'No-Code Automation with n8n',     start: '2026-11-19T14:00:00+08:00', mode: 'Online',    location: '',             price: '₱750' },
  'project-management':          { title: 'Project Management Fundamentals', start: '2026-12-03T15:00:00+08:00', mode: 'Online',    location: '',             price: 'Free' },
}

const eventId = clean(body.eventId) || 'notify-next'
const session = SESSIONS[eventId] || null
const isWaitlist = !session

const audienceRaw = clean(body.audience)
const audience = /sme/i.test(audienceRaw)
  ? 'SME owner'
  : /student/i.test(audienceRaw)
    ? 'Student'
    : (audienceRaw || 'Not specified')

const startISO = session ? session.start : ''
const startDate = startISO ? new Date(startISO) : null
const eventWhen = startDate
  ? `${startDate.toLocaleString('en-PH', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Manila',
    })} PHT`
  : (clean(body.eventDate) || 'To be announced')

const eventTitle = session ? session.title : (clean(body.eventTitle) || 'Upcoming session')
const eventMode = session
  ? (session.mode === 'In-person' && session.location ? `In-person · ${session.location}` : session.mode)
  : 'To be announced'
const eventPrice = session ? session.price : ''

// Google Calendar "add to calendar" link (2-hour default block).
const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
let calendarUrl = ''
if (startDate) {
  const end = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
  const q = (s) => encodeURIComponent(s)
  calendarUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${q(`${eventTitle} — ABBADev`)}` +
    `&dates=${stamp(startDate)}/${stamp(end)}` +
    `&details=${q(`Your ABBADev session (${eventMode}). See you there!`)}` +
    `&location=${q(session && session.location ? session.location : eventMode)}`
}

const normalized = {
  name,
  email,
  audience,
  organization: clean(body.organization) || 'Not provided',
  phone: clean(body.phone) || 'Not provided',
  eventId,
  eventTitle,
  eventStart: startISO,
  eventWhen,
  eventMode,
  eventPrice,
  calendarUrl,
  message: clean(body.message),
  status: isWaitlist ? 'waitlist' : 'registered',
  source: clean(body.source) || 'abbadev.com',
  channel: 'event',
  pageUrl: clean(body.pageUrl),
  submittedAt: clean(body.submittedAt) || new Date().toISOString(),
}

// --- Internal alert (Telegram / email) -----------------------------------
const telegramText = [
  isWaitlist ? '🟡 New waitlist sign-up — ABBADev' : '🟢 New session registration — ABBADev',
  '',
  `Name: ${normalized.name} (${normalized.audience})`,
  `Email: ${normalized.email}`,
  `Org: ${normalized.organization}`,
  `Session: ${normalized.eventTitle}`,
  isWaitlist ? 'When: waitlist / next session' : `When: ${normalized.eventWhen}`,
  isWaitlist ? '' : `Mode: ${normalized.eventMode}${normalized.eventPrice ? ` · ${normalized.eventPrice}` : ''}`,
  normalized.message ? `Note: ${normalized.message}` : '',
  `Submitted: ${normalized.submittedAt}`,
].filter(Boolean).join('\n')

// --- Registrant confirmation email ---------------------------------------
const esc = (v) => clean(v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;')

const shell = ({ preview, title, subtitle, badge, body }) => `
<!doctype html>
<html>
  <body style="margin:0;background:#07111f;padding:28px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#f8fbff;border-radius:18px;overflow:hidden;border:1px solid #dbeafe;">
      <tr><td style="background:#081827;padding:28px 30px;color:#ffffff;">
        <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#38bdf8;font-weight:800;">ABBADev Tech Solutions</div>
        <h1 style="margin:12px 0 8px;font-size:26px;line-height:1.2;color:#ffffff;">${esc(title)}</h1>
        <p style="margin:0;color:#bfd4ea;font-size:15px;line-height:1.6;">${esc(subtitle)}</p>
        ${badge ? `<div style="display:inline-block;margin-top:18px;padding:8px 12px;border-radius:999px;background:#0b6ee8;color:#ffffff;font-size:13px;font-weight:800;">${esc(badge)}</div>` : ''}
      </td></tr>
      <tr><td style="padding:28px 30px;">${body}</td></tr>
      <tr><td style="padding:20px 30px;background:#eef6ff;color:#475569;font-size:13px;line-height:1.6;">
        <strong style="color:#0f172a;">Rommel Galisanao</strong><br>ABBADev Tech Solutions<br>
        <a href="https://abbadev.com" style="color:#0b6ee8;text-decoration:none;">abbadev.com</a>
      </td></tr>
    </table>
  </body>
</html>`

const detailRow = (label, value) => `
  <tr>
    <td style="padding:12px 14px;border-bottom:1px solid #dbe7f3;color:#64748b;font-size:13px;">${esc(label)}</td>
    <td style="padding:12px 14px;border-bottom:1px solid #dbe7f3;color:#0f172a;font-size:14px;font-weight:700;">${esc(value)}</td>
  </tr>`

const clientSubject = isWaitlist
  ? "You're on the list — ABBADev sessions"
  : `You're registered — ${normalized.eventTitle}`

const clientHtml = isWaitlist
  ? shell({
      preview: 'You are on the ABBADev session waitlist.',
      title: "You're on the list",
      subtitle: `Thanks, ${normalized.name}. We'll email you as soon as the next session is scheduled.`,
      badge: 'Waitlist',
      body: `
        <p style="margin:0 0 18px;color:#334155;font-size:16px;line-height:1.7;">You asked to be notified about upcoming ABBADev seminars and webinars. You're on the list — no further action needed.</p>
        <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;">In the meantime, browse what's coming up at <a href="https://abbadev.com/register" style="color:#0b6ee8;">abbadev.com/register</a>.</p>`,
    })
  : shell({
      preview: `Your seat for ${normalized.eventTitle} is confirmed.`,
      title: "You're registered",
      subtitle: `Thanks, ${normalized.name}. Your seat for ${normalized.eventTitle} is confirmed.`,
      badge: normalized.eventPrice ? `${normalized.audience} · ${normalized.eventPrice}` : normalized.audience,
      body: `
        <h2 style="margin:0 0 12px;color:#0f172a;font-size:18px;">Session details</h2>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#ffffff;border:1px solid #dbe7f3;border-radius:12px;overflow:hidden;">
          ${detailRow('Session', normalized.eventTitle)}
          ${detailRow('When', normalized.eventWhen)}
          ${detailRow('Format', normalized.eventMode)}
          ${normalized.eventPrice ? detailRow('Fee', normalized.eventPrice) : ''}
        </table>
        ${normalized.calendarUrl ? `<p style="margin:22px 0 0;"><a href="${esc(normalized.calendarUrl)}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#0b6ee8;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;">Add to calendar</a></p>` : ''}
        <p style="margin:22px 0 0;color:#64748b;font-size:13px;line-height:1.6;">Need to make a change? Just reply to this email. We'll send a reminder before the session.</p>`,
    })

const clientText = (isWaitlist
  ? [
      `Hi ${normalized.name},`, '',
      "You're on the ABBADev session waitlist. We'll email you when the next session is scheduled.", '',
      'Browse upcoming sessions: https://abbadev.com/register',
    ]
  : [
      `Hi ${normalized.name},`, '',
      `Your seat for "${normalized.eventTitle}" is confirmed.`, '',
      `When: ${normalized.eventWhen}`,
      `Format: ${normalized.eventMode}`,
      normalized.eventPrice ? `Fee: ${normalized.eventPrice}` : '',
      normalized.calendarUrl ? `Add to calendar: ${normalized.calendarUrl}` : '',
      '', "We'll send a reminder before the session. Reply to this email for any change.",
    ]
).concat(['', 'Regards,', 'Rommel Galisanao', 'ABBADev Tech Solutions', 'https://abbadev.com'])
  .filter((line) => line !== undefined).join('\n')

return {
  json: {
    ...normalized,
    telegramText,
    clientSubject,
    clientHtml,
    clientText,
  },
}
```

## 4. Postgres node — insert registration (skip duplicates)

Run `automation/n8n/event-registrations-schema.sql` once against your database to
create the `event_registrations` table (its partial unique index on
`(email, event_id)` is what makes a repeat sign-up detectable). Then add a
Postgres node named **Postgres — Save Registration**:

- Operation: `Insert`
- Schema: `public`
- Table: `event_registrations`
- Mapping: `Map Each Column Manually`
- Options → **Skip on conflict**: `On`

"Skip on conflict" makes n8n run `INSERT … ON CONFLICT DO NOTHING`, so a repeat
submission **no longer errors** the node. On a genuine insert the node returns the
new row (including its `id`); on a duplicate it returns **no row**. That returned
`id` is the signal the next step gates on.

| Column | Value |
| --- | --- |
| `name` | `{{ $json.name }}` |
| `email` | `{{ $json.email }}` |
| `audience` | `{{ $json.audience }}` |
| `organization` | `{{ $json.organization }}` |
| `phone` | `{{ $json.phone }}` |
| `event_id` | `{{ $json.eventId }}` |
| `event_title` | `{{ $json.eventTitle }}` |
| `event_start` | `{{ $json.eventStart }}` |
| `event_when` | `{{ $json.eventWhen }}` |
| `event_mode` | `{{ $json.eventMode }}` |
| `message` | `{{ $json.message }}` |
| `source` | `{{ $json.source }}` |
| `channel` | `{{ $json.channel }}` |
| `page_url` | `{{ $json.pageUrl }}` |
| `submitted_at` | `{{ $json.submittedAt }}` |
| `status` | `{{ $json.status }}` |

Leave `id`, `created_at`, and `reminded_at` unmapped — defaults and the reminder
workflow fill them. Set **Output** to return the inserted row (fields `*` or at
least `id`) so the gate below can see it.

> **Waitlist rows never dedup.** The partial index excludes `event_id =
> 'notify-next'`, so "notify me of the next session" sign-ups always insert (a
> person may join the list more than once). Session sign-ups are the ones guarded.

### Prefer raw SQL?

Use Operation `Execute Query` for a deterministic result — it returns one row on
insert and an empty result on a duplicate:

```sql
INSERT INTO event_registrations
  (name, email, audience, organization, phone, event_id, event_title,
   event_start, event_when, event_mode, message, source, channel, page_url,
   submitted_at, status)
VALUES
  ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
ON CONFLICT DO NOTHING
RETURNING id;
```

Map `$1…$16` in the Query Parameters, in the same order as the columns above.

## 5. IF node — only continue when a new row was inserted

Add an **IF** node named **New registration?** right after the Postgres node. This
is what stops a duplicate from ever reaching the email and Telegram steps.

- Condition (Number): `{{ $json.id }}` **is not empty**
  - `true`  → a row was inserted → continue to the confirmation email
  - `false` → duplicate (no `id`) → wire to a **No-Op** node labelled "Duplicate —
    skipped" (or leave the branch unconnected)

If your Postgres node already emits nothing on a duplicate, the IF simply receives
no item and the true branch stays idle — the gate is belt-and-suspenders either
way.

> After the gate, `$json` is the **database row** (`id`, `created_at`, …), not the
> enriched item — so the email and Telegram nodes read their content from the
> Code node by name (below).

## 6. Registrant confirmation email node

Add an email node on the IF node's **true** branch. Pull the content from the Code
node by name so it survives the Postgres/IF hop:

- To: `{{ $('Normalize Registration').item.json.email }}`
- Subject: `{{ $('Normalize Registration').item.json.clientSubject }}`
- Email Format: `HTML`
- HTML: `{{ $('Normalize Registration').item.json.clientHtml }}`
- Text fallback: `{{ $('Normalize Registration').item.json.clientText }}`

> If your Code node has a different name, match it exactly. If item pairing is lost
> after the IF (rare), use `$('Normalize Registration').first().json.…` — there is
> only ever one registration per run, so `.first()` is safe.

## 7. Telegram node — notify

Wire this after the confirmation email (still on the **true** branch), so you are
alerted only for real, first-time registrations.

- Credential: your Telegram bot token (from **@BotFather**)
- Resource: `Message` → Operation: `Send Message`
- Chat ID: your personal chat ID (message **@userinfobot** to get it)
- Text: `{{ $('Normalize Registration').item.json.telegramText }}`

> Talk to your bot once before the first run, or Telegram rejects the send with
> "chat not found". Prefer email? Swap in an email node To
> `rommel.galisanao.22@gmail.com` with the same
> `{{ $('Normalize Registration').item.json.telegramText }}`.

## 8. Reminder workflow (the automation showcase)

A second, **scheduled** workflow turns a static roster into a hands-off reminder —
exactly the "set it once, it runs itself" story the site sells.

```text
Schedule Trigger (daily, e.g. 09:00 PHT)
  -> Postgres / Select due registrations
  -> Reminder email (per registrant)
  -> Postgres / Mark reminded
```

**Select due registrations** — everyone whose session starts in the next ~24h and
who hasn't been reminded yet:

```sql
SELECT id, name, email, event_title, event_when, event_mode
FROM event_registrations
WHERE status IN ('registered', 'confirmed')
  AND reminded_at IS NULL
  AND event_start BETWEEN now() AND now() + interval '24 hours';
```

**Reminder email** (one per returned row):

- To: `{{ $json.email }}`
- Subject: `Reminder: {{ $json.event_title }} is tomorrow`
- Text:

  ```text
  Hi {{ $json.name }},

  A quick reminder that "{{ $json.event_title }}" is coming up:
  {{ $json.event_when }} · {{ $json.event_mode }}

  See you there,
  Rommel Galisanao — ABBADev Tech Solutions
  ```

**Mark reminded** — a Postgres `Update` (or an `Execute Query`) so no one is
reminded twice:

```sql
UPDATE event_registrations SET reminded_at = now() WHERE id = {{ $json.id }};
```

## 9. Test it

From the VPS (or anywhere the token is known):

```bash
curl -i -X POST https://n8nautomation.abbadev.com/webhook/abbadev-event-registration \
  -H "Authorization: Bearer your-event-token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria Santos","email":"maria@business.ph","organization":"Santos Trading","audience":"SME owner","eventId":"digital-transformation-smes","source":"abbadev.com","pageUrl":"https://abbadev.com/register"}'
```

Expect `200`, a new row in `event_registrations`, a branded confirmation email to
the registrant, and a Telegram/email alert to you.

**Then run the exact same `curl` a second time** — this is the duplicate check.
Expect: still `200` (the webhook responds immediately), **no** new row, **no**
second email, and **no** second Telegram alert. In the n8n execution log the
Postgres node succeeds with an empty result and the IF node takes its `false`
branch. A `SELECT count(*) FROM event_registrations WHERE email =
'maria@business.ph' AND event_id = 'digital-transformation-smes';` should return
`1`. Finish with a real end-to-end run: open `/register`, pick a session, and
double-click **Reserve my seat** to confirm only one confirmation arrives.

## 10. Optional next automation

- **Capacity guard:** before the confirmation email, a Postgres `count` per
  `event_id`; past a cap, set `status = 'waitlist'` and send the waitlist email
  instead.
- **Attendance loop:** after each session, flip `status` to `attended` / `no_show`
  and trigger a "thanks + slides" or "sorry we missed you + recording" email.
- **AI recap (internal first):** an AI node that drafts a one-paragraph recap and
  suggested follow-up for each SME registrant — kept internal until reviewed,
  mirroring the "AI drafts, a human confirms" thesis the rest of the site argues.
