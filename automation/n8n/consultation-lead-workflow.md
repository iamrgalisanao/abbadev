# ABBADev Consultation Lead Workflow

Use this n8n workflow after the website webhook receives a consultation brief.

The website already posts to:

```text
POST https://n8nautomation.abbadev.com/webhook/abbadev-consultation
```

## Target Workflow

1. Webhook receives the website payload.
2. Code node normalizes the data, validates required fields, scores the lead, and creates summaries.
3. Internal notification email goes to Rommel.
4. Confirmation email goes to the visitor.
5. Optional storage node saves the lead to Google Sheets, Notion, Airtable, or a database.

## Required Webhook Settings

- HTTP Method: `POST`
- Path: `abbadev-consultation`
- Authentication: `Header Auth`
- Header name: `Authorization`
- Header value: `Bearer your-token`
- Respond: `Immediately`

The VPS environment file must store only the token value:

```env
N8N_JWT=your-token
```

## Expected Website Payload

```json
{
  "name": "Client Name",
  "email": "client@company.com",
  "company": "Company Name",
  "preferredContact": "Email",
  "workFocus": "AI automation",
  "companyStage": "Growing business",
  "currentTools": "ERP, spreadsheets, CRM, portals, email, n8n",
  "urgency": "This quarter",
  "challenge": "Workflow bottleneck details",
  "engagement": "Consultation and roadmap",
  "budget": "To be scoped",
  "source": "abbadev.com",
  "pageUrl": "https://abbadev.com/",
  "submittedAt": "2026-07-28T10:03:57.483Z"
}
```

## Code Node

Add a Code node immediately after the Webhook node. Set mode to `Run Once for Each Item`, then paste this code:

```js
const body = $json.body ?? $json

const clean = (value) => String(value ?? '').trim()
const email = clean(body.email).toLowerCase()
const challenge = clean(body.challenge)

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  throw new Error('Invalid email address')
}

if (!clean(body.name) || challenge.length < 10) {
  throw new Error('Name and meaningful workflow challenge are required')
}

const workFocus = clean(body.workFocus)
const urgency = clean(body.urgency)
const budget = clean(body.budget)
const engagement = clean(body.engagement)
const companyStage = clean(body.companyStage)

let score = 0
const reasons = []

if (['AI automation', 'Custom software', 'Architecture review'].includes(workFocus)) {
  score += 25
  reasons.push(`Strong service fit: ${workFocus}`)
}

if (['This month', 'This quarter'].includes(urgency)) {
  score += 20
  reasons.push(`Near-term urgency: ${urgency}`)
}

if (['$15k to $50k', '$50k+'].includes(budget)) {
  score += 25
  reasons.push(`Defined higher-value budget: ${budget}`)
} else if (budget === '$5k to $15k') {
  score += 15
  reasons.push(`Defined budget: ${budget}`)
} else if (budget === 'To be scoped') {
  score += 8
  reasons.push('Budget needs discovery')
}

if (challenge.length >= 180) {
  score += 20
  reasons.push('Detailed workflow challenge')
} else if (challenge.length >= 80) {
  score += 12
  reasons.push('Moderately detailed workflow challenge')
}

if (['Growing business', 'Enterprise team'].includes(companyStage)) {
  score += 10
  reasons.push(`Likely operational complexity: ${companyStage}`)
}

const priority = score >= 75 ? 'High' : score >= 45 ? 'Medium' : 'Low'

const normalized = {
  name: clean(body.name),
  email,
  company: clean(body.company) || 'Not provided',
  preferredContact: clean(body.preferredContact) || 'Email',
  workFocus,
  companyStage,
  currentTools: clean(body.currentTools) || 'Not provided',
  urgency,
  challenge,
  engagement,
  budget,
  source: clean(body.source) || 'abbadev.com',
  pageUrl: clean(body.pageUrl),
  submittedAt: clean(body.submittedAt) || new Date().toISOString(),
}

const internalSubject = `[${priority}] ABBADev consultation brief - ${normalized.company}`
const internalText = `
New ABBADev consultation brief

Priority: ${priority}
Score: ${score}
Reasons: ${reasons.join('; ') || 'No strong scoring signals'}

Lead
- Name: ${normalized.name}
- Email: ${normalized.email}
- Company: ${normalized.company}
- Preferred contact: ${normalized.preferredContact}

Project context
- Work focus: ${normalized.workFocus}
- Company stage: ${normalized.companyStage}
- Urgency: ${normalized.urgency}
- Engagement: ${normalized.engagement}
- Budget: ${normalized.budget}
- Current tools: ${normalized.currentTools}

Workflow challenge
${normalized.challenge}

Source
- Page: ${normalized.pageUrl}
- Submitted: ${normalized.submittedAt}
`.trim()

const clientSubject = 'ABBADev received your consultation brief'
const clientText = `
Hi ${normalized.name},

Thanks for sending your consultation brief. I received the details about your ${normalized.workFocus.toLowerCase()} request and will review the workflow challenge, tools, urgency, and engagement fit.

What happens next:
- I will review the process and business outcome you described.
- I will identify the likely architecture, automation, or software direction.
- I will reply within one business day with the recommended next step.

Summary received:
- Work focus: ${normalized.workFocus}
- Company stage: ${normalized.companyStage}
- Urgency: ${normalized.urgency}
- Preferred engagement: ${normalized.engagement}

Regards,
Rommel Galisanao
ABBADev Tech Solutions
https://abbadev.com
`.trim()

const escapeHtml = (value) => clean(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const rows = [
  ['Name', normalized.name],
  ['Email', normalized.email],
  ['Company', normalized.company],
  ['Preferred contact', normalized.preferredContact],
  ['Work focus', normalized.workFocus],
  ['Company stage', normalized.companyStage],
  ['Urgency', normalized.urgency],
  ['Engagement', normalized.engagement],
  ['Budget', normalized.budget],
  ['Current tools', normalized.currentTools],
]

const detailsTable = rows.map(([label, value]) => `
  <tr>
    <td style="padding:12px 14px;border-bottom:1px solid #dbe7f3;color:#64748b;font-size:13px;">${escapeHtml(label)}</td>
    <td style="padding:12px 14px;border-bottom:1px solid #dbe7f3;color:#0f172a;font-size:14px;font-weight:700;">${escapeHtml(value)}</td>
  </tr>
`).join('')

const shell = ({ preview, title, subtitle, badge, body }) => `
<!doctype html>
<html>
  <body style="margin:0;background:#07111f;padding:28px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:720px;margin:0 auto;background:#f8fbff;border-radius:18px;overflow:hidden;border:1px solid #dbeafe;">
      <tr>
        <td style="background:#081827;padding:28px 30px;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#38bdf8;font-weight:800;">ABBADev Tech Solutions</div>
          <h1 style="margin:12px 0 8px;font-size:28px;line-height:1.18;color:#ffffff;">${escapeHtml(title)}</h1>
          <p style="margin:0;color:#bfd4ea;font-size:15px;line-height:1.6;">${escapeHtml(subtitle)}</p>
          ${badge ? `<div style="display:inline-block;margin-top:18px;padding:8px 12px;border-radius:999px;background:#0b6ee8;color:#ffffff;font-size:13px;font-weight:800;">${escapeHtml(badge)}</div>` : ''}
        </td>
      </tr>
      <tr>
        <td style="padding:28px 30px;">
          ${body}
        </td>
      </tr>
      <tr>
        <td style="padding:20px 30px;background:#eef6ff;color:#475569;font-size:13px;line-height:1.6;">
          <strong style="color:#0f172a;">Rommel Galisanao</strong><br>
          ABBADev Tech Solutions<br>
          <a href="https://abbadev.com" style="color:#0b6ee8;text-decoration:none;">abbadev.com</a>
        </td>
      </tr>
    </table>
  </body>
</html>
`

const internalHtml = shell({
  preview: `${priority} priority consultation brief from ${normalized.company}`,
  title: 'New consultation brief',
  subtitle: 'A website lead submitted a workflow challenge for review.',
  badge: `${priority} priority / Score ${score}`,
  body: `
    <h2 style="margin:0 0 14px;color:#0f172a;font-size:18px;">Lead details</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#ffffff;border:1px solid #dbe7f3;border-radius:12px;overflow:hidden;">
      ${detailsTable}
    </table>
    <h2 style="margin:28px 0 10px;color:#0f172a;font-size:18px;">Workflow challenge</h2>
    <p style="margin:0;padding:16px 18px;background:#ffffff;border:1px solid #dbe7f3;border-radius:12px;color:#1e293b;line-height:1.7;">${escapeHtml(normalized.challenge)}</p>
    <h2 style="margin:28px 0 10px;color:#0f172a;font-size:18px;">Scoring reasons</h2>
    <p style="margin:0;color:#334155;line-height:1.7;">${escapeHtml(reasons.join('; ') || 'No strong scoring signals')}</p>
    <p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.6;">Source: <a href="${escapeHtml(normalized.pageUrl)}" style="color:#0b6ee8;">${escapeHtml(normalized.pageUrl)}</a><br>Submitted: ${escapeHtml(normalized.submittedAt)}</p>
  `,
})

const clientHtml = shell({
  preview: 'ABBADev received your consultation brief.',
  title: 'Your consultation brief was received',
  subtitle: `Thanks, ${normalized.name}. I will review your workflow challenge and reply within one business day.`,
  badge: normalized.workFocus,
  body: `
    <p style="margin:0 0 18px;color:#334155;font-size:16px;line-height:1.7;">I received the details about your ${escapeHtml(normalized.workFocus.toLowerCase())} request and will review the workflow challenge, tools, urgency, and engagement fit.</p>
    <h2 style="margin:0 0 12px;color:#0f172a;font-size:18px;">What happens next</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr><td style="padding:10px 0;color:#334155;line-height:1.6;">1. I review the process and business outcome you described.</td></tr>
      <tr><td style="padding:10px 0;color:#334155;line-height:1.6;">2. I identify the likely architecture, automation, or software direction.</td></tr>
      <tr><td style="padding:10px 0;color:#334155;line-height:1.6;">3. I reply with the recommended next step.</td></tr>
    </table>
    <h2 style="margin:24px 0 12px;color:#0f172a;font-size:18px;">Summary received</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#ffffff;border:1px solid #dbe7f3;border-radius:12px;overflow:hidden;">
      ${[
        ['Work focus', normalized.workFocus],
        ['Company stage', normalized.companyStage],
        ['Urgency', normalized.urgency],
        ['Preferred engagement', normalized.engagement],
      ].map(([label, value]) => `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #dbe7f3;color:#64748b;font-size:13px;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #dbe7f3;color:#0f172a;font-size:14px;font-weight:700;">${escapeHtml(value)}</td>
        </tr>
      `).join('')}
    </table>
  `,
})

return {
  json: {
    ...normalized,
    score,
    priority,
    scoreReasons: reasons,
    internalSubject,
    internalText,
    internalHtml,
    clientSubject,
    clientText,
    clientHtml,
  },
}
```

## Internal Email Node

Add an email node after the Code node.

- To: your business email
- Subject:

```text
{{$json.internalSubject}}
```

- Email Format: `HTML`
- HTML:

```text
{{$json.internalHtml}}
```

- Optional text fallback:

```text
{{$json.internalText}}
```

## Client Confirmation Email Node

Add another email node after the Code node or after the internal email node.

- To:

```text
{{$json.email}}
```

- Subject:

```text
{{$json.clientSubject}}
```

- Email Format: `HTML`
- HTML:

```text
{{$json.clientHtml}}
```

- Optional text fallback:

```text
{{$json.clientText}}
```

## Storage Node

Add one storage destination after the Code node. Use Notion as the first lead pipeline.

Recommended workflow order:

```text
Webhook
-> Code / Score Lead
-> Notion / Create Lead Page
-> Internal Email
-> Client Confirmation Email
```

## Notion Database Setup

Create a Notion database named:

```text
ABBADev Consultation Leads
```

Recommended properties:

| Property | Type | Recommended options |
| --- | --- | --- |
| Lead | Title | Main lead title |
| Status | Status | New, Reviewed, Contacted, Discovery Scheduled, Proposal Sent, Won, Lost, Not Fit |
| Priority | Select | High, Medium, Low |
| Score | Number | Plain number |
| Submitted At | Date | Include time |
| Name | Text | Visitor name |
| Email | Email | Visitor email |
| Company | Text | Company or organization |
| Preferred Contact | Select | Email, Phone, Video call |
| Work Focus | Select | AI automation, Custom software, Architecture review, Digital transformation |
| Company Stage | Select | Growing business, Startup, Enterprise team, Public sector or nonprofit |
| Urgency | Select | This month, This quarter, Planning phase, Exploring options |
| Engagement | Select | Consultation and roadmap, Architecture review, Prototype or proof of concept, Full software build |
| Budget | Select | To be scoped, Under $5k, $5k to $15k, $15k to $50k, $50k+ |
| Current Tools | Text | Tools listed by the visitor |
| Challenge | Text | Workflow challenge |
| Score Reasons | Text | Lead scoring explanation |
| Source | Select | abbadev.com |
| Source Page | URL | Page URL |
| Next Action | Text | Manual follow-up note |
| Owner | Person | Optional |
| Last Contacted | Date | Optional |

Recommended Notion views:

- `New Leads`: filter `Status` is `New`, sort `Submitted At` descending
- `High Priority`: filter `Priority` is `High`, sort `Score` descending
- `Pipeline`: board grouped by `Status`
- `All Leads`: table sorted by `Submitted At` descending

## n8n Notion Node Mapping

Add a Notion node after the Code node.

- Resource: `Database Page`
- Operation: `Create`
- Database: `ABBADev Consultation Leads`

Map properties:

```text
Lead: {{$json.company}} - {{$json.workFocus}}
Status: New
Priority: {{$json.priority}}
Score: {{$json.score}}
Submitted At: {{$json.submittedAt}}
Name: {{$json.name}}
Email: {{$json.email}}
Company: {{$json.company}}
Preferred Contact: {{$json.preferredContact}}
Work Focus: {{$json.workFocus}}
Company Stage: {{$json.companyStage}}
Urgency: {{$json.urgency}}
Engagement: {{$json.engagement}}
Budget: {{$json.budget}}
Current Tools: {{$json.currentTools}}
Challenge: {{$json.challenge}}
Score Reasons: {{($json.scoreReasons || []).join('; ')}}
Source: {{$json.source}}
Source Page: {{$json.pageUrl}}
Next Action: Review and reply within one business day
```

Page content/body, if the Notion node supports page content:

```text
Priority: {{$json.priority}}
Score: {{$json.score}}

Workflow challenge:
{{$json.challenge}}

Scoring reasons:
{{($json.scoreReasons || []).join('; ')}}

Recommended next action:
Review the challenge, confirm fit, and reply with a suggested discovery path.
```

After the Notion node works, keep email nodes after it:

```text
Notion / Create Lead Page
-> Internal Email
-> Client Confirmation Email
```

## Recommended Next Automation

After email and storage work reliably, add an AI node that creates:

- one-paragraph executive summary
- likely service fit
- recommended discovery questions
- suggested first-call agenda

Keep that AI output internal only until reviewed.
