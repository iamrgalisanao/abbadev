# Event registration → n8n workflow

How seminar/webinar registrations from the website reach the n8n automation,
the exact payload contract, and the `Normalize Registration` code that drives
the confirmation email, Telegram alert, and Postgres insert.

This covers two entry points that share one pipeline:

- **`/register`** — the organic Upcoming Sessions list (multiple events).
- **`/seminar`** — the distraction-free Facebook-ad landing page for a single
  paid seminar, using a **reserve-then-pay** flow.

## Data flow

```
/register  or  /seminar  (browser form)
        │  POST /api/event-registration
        ▼
server/consultation-proxy.mjs
        │  validates email, forwards with Authorization: Bearer <token>
        │  stamps  channel: "event"  server-side
        ▼
n8n webhook  (path: abbadev-event-registration, Header Auth)
        ▼
Normalize Registration (Code node)  →  Insert rows (Postgres)
        →  Send an Email  →  Send a text message (Telegram)
```

The browser is never trusted for the `channel` tag — the proxy stamps it.

## Environment (VPS / process manager)

The proxy needs these set (see `.env.example`). The event pipeline can have its
own webhook + token, or fall back to the main consultation ones:

```bash
N8N_EVENT_WEBHOOK_URL=https://n8nautomation.abbadev.com/webhook/abbadev-event-registration
N8N_EVENT_JWT=<the-header-auth-token>   # raw token only — the proxy adds "Bearer "
```

Use the **Production** webhook URL (`/webhook/…`), not the `/webhook-test/…`
URL, which only fires while "Listen for test event" is open in the n8n editor.

## Payload contract

Every registration posts JSON to `/api/event-registration`. The proxy merges in
`channel: "event"` before forwarding.

| Field | `/register` | `/seminar` | Notes |
|---|---|---|---|
| `name`, `email`, `phone`, `organization`, `message` | ✓ | ✓ | `email` validated by the proxy |
| `audience` | `Student` / `SME owner` | `Student` / `Developer` / `Professional & owner` | |
| `eventId` | selected event, or `notify-next` | `idea-to-intelligent-system` | **must exist in the `EVENTS` catalog** |
| `eventTitle`, `eventDate`, `price` | ✓ | ✓ | informational — Normalize resolves the real details from `EVENTS` by `eventId` |
| `flow` | — | `reserve-then-pay` | triggers the payment email path |
| `leadSource` | — | `fb-ad-landing` | survives the proxy (unlike `channel`) |
| `utm` | — | `{ utm_source, utm_medium, utm_campaign, fbclid, … }` | captured from the ad URL |
| `source` | `abbadev.com` | `abbadev.com` | |
| `pageUrl`, `submittedAt` | ✓ | ✓ | |
| `channel` | `event` (proxy) | `event` (proxy) | server-stamped |

> The event catalog inside `Normalize Registration` is the source of truth for
> title, schedule, price, and location. When you add or change an event on the
> site, add/update the matching `eventId` entry in the catalog below, or
> registrations for it throw `Unknown or unavailable event`.

## n8n webhook node

- **Method:** POST
- **Path:** `abbadev-event-registration`
- **Authentication:** Header Auth (`Authorization: Bearer <token>`) — the token
  must equal `N8N_EVENT_JWT`.
- **Respond:** Immediately.

## Downstream node wiring

The `Normalize Registration` Code node outputs everything the rest of the chain
needs, so those nodes stay simple:

- **Insert rows (Postgres)** — directly after Normalize, so use `{{ $json.<field> }}`.
  Optional attribution columns: `lead_source`, `flow`, `utm_campaign`.
- **Send an Email** — after Postgres, so `$json` is the DB row. Reference Normalize:
  - Subject: `{{ $('Normalize Registration').item.json.clientSubject }}`
  - HTML: `{{ $('Normalize Registration').item.json.clientHtml }}`
  - Text: `{{ $('Normalize Registration').item.json.clientText }}`
  - To: `{{ $('Normalize Registration').item.json.email }}`
- **Send a text message (Telegram)** — `{{ $('Normalize Registration').item.json.telegramText }}`

## Behavior notes

- `isPaid` is any non-free priced event. Paid events set `status: "reserved"`
  and send the **pay-to-confirm** email (GCash); free events set
  `status: "registered"` and send the standard confirmation. `notify-next`
  is the waitlist path.
- This means all paid events (the ₱750 / ₱1,200 workshops too), not only the
  ad-funnel seminar, get the payment email. To limit it to the ad funnel,
  change the catalog `isPaid` line to `isPaid = flow === 'reserve-then-pay'`.
- Keep the `PAYMENT` GCash details in sync with `paymentMethods` in
  `src/App.jsx` (the `/seminar` payment panel).

## `Normalize Registration` code

Paste this as the full body of the Code node.

```js
const body = $json.body ?? $json

const clean = (value) => String(value ?? '').trim()

const escapeHtml = (value) =>
  clean(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ---------------------------------------------------------
// ABBADev event catalog
// ---------------------------------------------------------

const EVENTS = {
  'idea-to-intelligent-system': {
    id: 'idea-to-intelligent-system',
    title: 'From Idea to Intelligent System',
    type: 'Seminar',
    mode: 'In-person',
    audience: ['Students', 'SME owners'],
    start: '2026-09-05T14:00:00+08:00',
    end: '2026-09-05T17:00:00+08:00',
    when: 'Sep 5, 2026 · 2:00 PM PHT',
    duration: '3 hours',
    level: 'Beginner',
    price: '₱399',
    location: 'Twinniz Cafe, Olongapo',
  },

  'first-chatbot': {
    id: 'first-chatbot',
    title: 'Build Your First AI Chatbot',
    type: 'Workshop',
    mode: 'Online',
    audience: ['Students', 'SME owners'],
    start: '2026-10-08T10:00:00+08:00',
    end: '2026-10-08T13:00:00+08:00',
    when: 'Oct 8, 2026 · 10:00 AM PHT',
    duration: '3 hours',
    level: 'Hands-on',
    price: '₱750',
    location: '',
  },

  'intro-software-dev': {
    id: 'intro-software-dev',
    title: 'Intro to Software Development',
    type: 'Seminar',
    mode: 'In-person',
    audience: ['Students'],
    start: '2026-10-18T09:00:00+08:00',
    end: '2026-10-18T13:00:00+08:00',
    when: 'Oct 18, 2026 · 9:00 AM PHT',
    duration: 'Half day',
    level: 'Beginner',
    price: 'Free',
    location: 'Metro Manila',
  },

  'digital-transformation-smes': {
    id: 'digital-transformation-smes',
    title: 'Digital Transformation for SMEs',
    type: 'Seminar',
    mode: 'In-person',
    audience: ['SME owners'],
    start: '2026-11-05T13:00:00+08:00',
    end: '2026-11-05T17:00:00+08:00',
    when: 'Nov 5, 2026 · 1:00 PM PHT',
    duration: 'Half day',
    level: 'Intermediate',
    price: '₱1,200',
    location: 'Metro Manila',
  },

  'no-code-automation': {
    id: 'no-code-automation',
    title: 'No-Code Automation with n8n',
    type: 'Workshop',
    mode: 'Online',
    audience: ['Students', 'SME owners'],
    start: '2026-11-19T14:00:00+08:00',
    end: '2026-11-19T17:00:00+08:00',
    when: 'Nov 19, 2026 · 2:00 PM PHT',
    duration: '3 hours',
    level: 'Hands-on',
    price: '₱750',
    location: '',
  },

  'project-management': {
    id: 'project-management',
    title: 'Project Management Fundamentals',
    type: 'Webinar',
    mode: 'Online',
    audience: ['Students', 'SME owners'],
    start: '2026-12-03T15:00:00+08:00',
    end: '2026-12-03T17:00:00+08:00',
    when: 'Dec 3, 2026 · 3:00 PM PHT',
    duration: '2 hours',
    level: 'Beginner',
    price: 'Free',
    location: '',
  },
}

const WAITLIST_EVENT_ID = 'notify-next'

// GCash details for paid (reserve-then-pay) events.
const PAYMENT = {
  gcash: '0928 320 7029',
  accountName: 'ROM***L G.',
}

// ---------------------------------------------------------
// Normalize incoming fields
// ---------------------------------------------------------

const name = clean(body.name)
const email = clean(body.email).toLowerCase()
const audience = clean(body.audience)
const organization = clean(body.organization)
const phone = clean(body.phone)
const message = clean(body.message)

const eventId = clean(
  body.eventId ??
  body.event_id ??
  body.event
)

const source = clean(body.source) || 'event-registration'
const channel = clean(body.channel) || 'web'
const pageUrl = clean(body.pageUrl)

const flow = clean(body.flow)
const leadSource = clean(body.leadSource)
const utm = body.utm && typeof body.utm === 'object' ? body.utm : {}
const utmSource = clean(utm.utm_source)
const utmCampaign = clean(utm.utm_campaign)
const fbclid = clean(utm.fbclid)

const submittedAt =
  clean(body.submittedAt) ||
  new Date().toISOString()

// ---------------------------------------------------------
// Validation
// ---------------------------------------------------------

if (name.length < 2) {
  throw new Error('A valid name is required')
}

if (!emailPattern.test(email)) {
  throw new Error('A valid email address is required')
}

if (!eventId) {
  throw new Error('An event selection is required')
}

// ---------------------------------------------------------
// Event selection
// ---------------------------------------------------------

const isWaitlist = eventId === WAITLIST_EVENT_ID

let eventTitle
let eventStart
let eventEnd
let eventWhen
let eventMode
let eventType
let eventDuration
let eventLevel
let eventPrice
let eventLocation
let status
let isPaid = false

if (isWaitlist) {
  eventTitle = 'Notify me about the next ABBADev seminar'
  eventStart = null
  eventEnd = null
  eventWhen = 'Next available ABBADev seminar'
  eventMode = 'To be announced'
  eventType = 'Notification'
  eventDuration = ''
  eventLevel = ''
  eventPrice = ''
  eventLocation = ''
  status = 'waitlist'
} else {
  const event = EVENTS[eventId]

  if (!event) {
    throw new Error(`Unknown or unavailable event: ${eventId}`)
  }

  eventTitle = event.title
  eventStart = event.start
  eventEnd = event.end
  eventWhen = event.when
  eventMode = event.mode
  eventType = event.type
  eventDuration = event.duration
  eventLevel = event.level
  eventPrice = event.price
  eventLocation = event.location
  isPaid =
    clean(eventPrice) !== '' &&
    clean(eventPrice).toLowerCase() !== 'free'
  status = isPaid ? 'reserved' : 'registered'
}

// ---------------------------------------------------------
// Google Calendar helpers
// ---------------------------------------------------------

const toGoogleCalendarDate = (isoString) => {
  if (!isoString) return ''

  const date = new Date(isoString)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid event date: ${isoString}`)
  }

  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

let calendarUrl = ''

if (!isWaitlist && eventStart && eventEnd) {
  const start = toGoogleCalendarDate(eventStart)
  const end = toGoogleCalendarDate(eventEnd)

  const details = [
    `ABBADev ${eventType}`,
    `Level: ${eventLevel}`,
    `Duration: ${eventDuration}`,
    `Price: ${eventPrice}`,
    '',
    'Registered through abbadev.com.',
  ].join('\n')

  const location =
    eventMode === 'In-person'
      ? eventLocation
      : eventMode

  const calendarParams = [
    ['action', 'TEMPLATE'],
    ['text', eventTitle],
    ['dates', `${start}/${end}`],
    ['details', details],
    ['location', location],
  ]

  const queryString = calendarParams
    .map(([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(value ?? '')}`
    )
    .join('&')

  calendarUrl =
    `https://calendar.google.com/calendar/render?${queryString}`
}

// ---------------------------------------------------------
// Normalized output
// ---------------------------------------------------------

const normalized = {
  name,
  email,
  audience,
  organization,
  phone,

  eventId,
  eventTitle,
  eventStart,
  eventEnd,
  eventWhen,
  eventMode,
  eventType,
  eventDuration,
  eventLevel,
  eventPrice,
  eventLocation,

  message,
  source,
  channel,
  pageUrl,
  submittedAt,
  status,

  flow,
  leadSource,
  utmSource,
  utmCampaign,
  fbclid,
  isPaid,

  isWaitlist,
  calendarUrl,
}

// ---------------------------------------------------------
// Telegram notification
// ---------------------------------------------------------

const telegramLines = [
  isWaitlist
    ? '🟡 New ABBADev seminar waitlist signup'
    : isPaid
      ? '💳 New PAID reservation (awaiting payment)'
      : '🟢 New ABBADev event registration',
  '',
  `Name: ${name}`,
  `Email: ${email}`,
]

if (phone) {
  telegramLines.push(`Phone: ${phone}`)
}

if (audience) {
  telegramLines.push(`Audience: ${audience}`)
}

if (organization) {
  telegramLines.push(`Organization: ${organization}`)
}

telegramLines.push(
  '',
  `Event: ${eventTitle}`,
  `Type: ${eventType}`,
  `When: ${eventWhen}`,
  `Mode: ${eventMode}`,
)

if (eventLocation) {
  telegramLines.push(`Location: ${eventLocation}`)
}

if (eventPrice) {
  telegramLines.push(`Price: ${eventPrice}`)
}

telegramLines.push(`Status: ${status}`)

if (message) {
  telegramLines.push('', `Message: ${message}`)
}

if (leadSource) {
  telegramLines.push(
    '',
    `Lead source: ${leadSource === 'fb-ad-landing' ? 'Facebook ad 📣' : leadSource}`,
  )
}

if (flow) {
  telegramLines.push(`Flow: ${flow}`)
}

if (utmCampaign) {
  telegramLines.push(`Campaign: ${utmCampaign}`)
}

telegramLines.push(
  '',
  `Source: ${source}`,
  `Channel: ${channel}`,
  `Page: ${pageUrl || 'Not provided'}`,
  `Submitted: ${submittedAt}`,
)

const telegramText = telegramLines.join('\n')

// ---------------------------------------------------------
// Confirmation email
// ---------------------------------------------------------

let clientSubject
let clientText
let clientHtml

if (isWaitlist) {
  clientSubject =
    'You’re on the ABBADev seminar notification list'

  clientText = [
    `Hi ${name},`,
    '',
    'Thanks for your interest in ABBADev seminars and webinars.',
    '',
    'We’ve added you to our notification list.',
    'We’ll contact you when the next applicable session is announced.',
    '',
    'ABBADev',
    'AI • Automation • Software Development • Project Management',
    'https://abbadev.com',
  ].join('\n')

  clientHtml = `
<!doctype html>
<html>
  <body style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <h2>You’re on the ABBADev seminar notification list</h2>

      <p>Hi ${escapeHtml(name)},</p>

      <p>
        Thanks for your interest in ABBADev seminars and webinars.
        We’ve added you to our notification list.
      </p>

      <p>
        We’ll contact you when the next applicable session is announced.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">

      <p style="font-size:14px;color:#6b7280;">
        ABBADev<br>
        AI • Automation • Software Development • Project Management<br>
        <a href="https://abbadev.com">abbadev.com</a>
      </p>
    </div>
  </body>
</html>
`.trim()
} else if (isPaid) {
  clientSubject =
    `Almost done — complete your ${eventPrice} seat for ${eventTitle}`

  const locationLine =
    eventMode === 'In-person' && eventLocation
      ? `Location: ${eventLocation}`
      : `Mode: ${eventMode}`

  clientText = [
    `Hi ${name},`,
    '',
    `Thanks for reserving a seat at "${eventTitle}".`,
    'Your seat is HELD but not yet confirmed.',
    '',
    `Event: ${eventTitle}`,
    `When: ${eventWhen}`,
    locationLine,
    `Amount: ${eventPrice}`,
    '',
    `To confirm, please pay ${eventPrice} via GCash:`,
    `  • GCash — ${PAYMENT.gcash} (${PAYMENT.accountName})`,
    '',
    `Use your full name (${name}) as the payment reference, then reply to this email with a screenshot of your receipt. We’ll confirm your seat and send the venue details.`,
    '',
    'Seats are limited — first paid, first confirmed.',
    '',
    'ABBADev',
    'AI • Automation • Software Development • Project Management',
    'https://abbadev.com',
  ]
    .filter(Boolean)
    .join('\n')

  const locationHtml =
    eventMode === 'In-person' && eventLocation
      ? `<strong>Location:</strong> ${escapeHtml(eventLocation)}`
      : `<strong>Mode:</strong> ${escapeHtml(eventMode)}`

  clientHtml = `
<!doctype html>
<html>
  <body style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <h2>Almost done — one step left</h2>

      <p>Hi ${escapeHtml(name)},</p>

      <p>
        Thanks for reserving a seat at the following ABBADev session.
        Your seat is <strong>held but not yet confirmed</strong>.
      </p>

      <div
        style="
          background:#f3f4f6;
          padding:18px;
          border-radius:10px;
          margin:20px 0;
        "
      >
        <strong>${escapeHtml(eventTitle)}</strong><br>
        ${escapeHtml(eventType)}<br>
        ${escapeHtml(eventWhen)}<br>
        ${locationHtml}<br>
        <strong>Amount:</strong> ${escapeHtml(eventPrice)}
      </div>

      <div
        style="
          background:#ecfdf5;
          border:1px solid #a7f3d0;
          padding:18px;
          border-radius:10px;
          margin:20px 0;
        "
      >
        <p style="margin:0 0 10px;">
          <strong>Pay ${escapeHtml(eventPrice)} to confirm your seat</strong>
        </p>
        <p style="margin:0;">
          GCash — ${escapeHtml(PAYMENT.gcash)} (${escapeHtml(PAYMENT.accountName)})
        </p>
      </div>

      <p>
        Use your full name (<strong>${escapeHtml(name)}</strong>) as the payment
        reference, then reply to this email with a screenshot of your receipt.
        We’ll confirm your seat and send the venue details.
      </p>

      <p style="font-size:14px;color:#6b7280;">
        Seats are limited — first paid, first confirmed.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;">

      <p style="font-size:14px;color:#6b7280;">
        ABBADev<br>
        AI • Automation • Software Development • Project Management<br>
        <a href="https://abbadev.com">abbadev.com</a>
      </p>
    </div>
  </body>
</html>
`.trim()
} else {
  clientSubject =
    `Registration confirmed — ${eventTitle}`

  const locationLine =
    eventMode === 'In-person' && eventLocation
      ? `Location: ${eventLocation}`
      : `Mode: ${eventMode}`

  clientText = [
    `Hi ${name},`,
    '',
    'Your ABBADev event registration has been received.',
    '',
    `Event: ${eventTitle}`,
    `Type: ${eventType}`,
    `When: ${eventWhen}`,
    locationLine,
    `Duration: ${eventDuration}`,
    `Level: ${eventLevel}`,
    `Price: ${eventPrice}`,
    '',
    calendarUrl
      ? `Add to Google Calendar: ${calendarUrl}`
      : '',
    '',
    'We’ll send additional event information and reminders as the session approaches.',
    '',
    'ABBADev',
    'AI • Automation • Software Development • Project Management',
    'https://abbadev.com',
  ]
    .filter(Boolean)
    .join('\n')

  const calendarButton = calendarUrl
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
        <tr>
          <td style="border-radius:10px;background:#0b6ee8;">
            <a href="${escapeHtml(calendarUrl)}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:800;color:#ffffff;text-decoration:none;">Add to Google Calendar</a>
          </td>
        </tr>
      </table>
    `
    : ''

  const locationHtml =
    eventMode === 'In-person' && eventLocation
      ? `<strong>Location:</strong> ${escapeHtml(eventLocation)}`
      : `<strong>Mode:</strong> ${escapeHtml(eventMode)}`

  clientHtml = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a1526;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a1526;background-image:linear-gradient(135deg,#0b1e3a 0%,#0a1526 60%);">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(3,8,20,0.45);">
            <!-- Header -->
            <tr>
              <td align="center" style="background:#081827;background-image:linear-gradient(120deg,#0b2137 0%,#081827 100%);padding:22px 30px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:12px;"><img src="https://abbadev.com/images/abbadev-logo.png" width="40" height="40" alt="ABBADev" style="display:block;border:0;border-radius:8px;"></td>
                    <td style="font-family:Arial,Helvetica,sans-serif;color:#ffffff;font-weight:800;font-size:20px;letter-spacing:1px;">ABBADEV <span style="color:#38bdf8;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;">IT Solutions</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Hero + headline -->
            <tr>
              <td align="center" style="padding:38px 30px 4px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr><td align="center" valign="middle" style="width:92px;height:92px;border-radius:50%;background-image:linear-gradient(135deg,#16a34a 0%,#22c55e 100%);font-size:44px;line-height:92px;box-shadow:0 12px 26px rgba(22,163,74,0.32);">&#9989;</td></tr>
                </table>
                <h1 style="margin:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.2;color:#0f172a;">You&rsquo;re all set!</h1>
                <p style="margin:0 auto;max-width:430px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#475569;">
                  Your registration for <strong style="color:#0f172a;">${escapeHtml(eventTitle)}</strong> is confirmed. We can&rsquo;t wait to see you there.
                </p>
              </td>
            </tr>
            <!-- Details card -->
            <tr>
              <td style="padding:22px 30px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8ff;border:1px solid #dbeafe;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;font-size:14px;line-height:1.85;">
                      <strong style="font-size:15px;">${escapeHtml(eventTitle)}</strong><br>
                      <span style="color:#64748b;">${escapeHtml(eventType)}</span><br>
                      ${escapeHtml(eventWhen)}<br>
                      ${locationHtml}<br>
                      <strong>Duration:</strong> ${escapeHtml(eventDuration)}<br>
                      <strong>Level:</strong> ${escapeHtml(eventLevel)}<br>
                      <span style="display:inline-block;margin-top:10px;padding:5px 14px;border-radius:999px;background:#16a34a;color:#ffffff;font-weight:800;font-size:13px;">Paid: ${escapeHtml(eventPrice)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- CTA + note -->
            <tr>
              <td align="center" style="padding:26px 30px 6px;">
                ${calendarButton}
                <p style="margin:16px auto 0;max-width:430px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#64748b;">
                  We&rsquo;ll send additional event information and reminders as the session approaches.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td align="center" style="padding:28px 30px 32px;background:#f3f6fb;">
                <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#64748b;">Copyright &copy; 2026 ABBADev IT Solutions</p>
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#94a3b8;">
                  ABBADev IT Solutions &mdash; AI &bull; Automation &bull; Software Development &bull; Project Management.<br>
                  Independent business based in the Philippines.
                </p>
                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#94a3b8;">
                  You&rsquo;re receiving this because you registered at abbadev.com.<br>
                  To stop these emails, email <a href="mailto:info@abbadev.com" style="color:#0b6ee8;text-decoration:none;">info@abbadev.com</a>.
                </p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#94a3b8;">
                  Our <a href="https://abbadev.com/privacy" style="color:#0b6ee8;text-decoration:none;">Privacy Policy</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim()
}

// ---------------------------------------------------------
// Return to n8n
// ---------------------------------------------------------

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

## Testing

1. Set the webhook to **Production URL** and activate the workflow.
2. Submit a real reservation at `https://abbadev.com/seminar` (ideally via an ad
   link with `?utm_source=fb&fbclid=…`).
3. Expect: item with `flow: "reserve-then-pay"`, `leadSource: "fb-ad-landing"`,
   populated `utm`, a **pay-to-confirm** email, and a `💳 PAID … Facebook ad 📣`
   Telegram alert.
4. For a free event (e.g. `intro-software-dev`), expect the standard confirmation
   email and `status: "registered"`.
