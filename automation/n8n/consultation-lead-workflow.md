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

return {
  json: {
    ...normalized,
    score,
    priority,
    scoreReasons: reasons,
    internalSubject,
    internalText,
    clientSubject,
    clientText,
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

- Text:

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

- Text:

```text
{{$json.clientText}}
```

## Storage Node

Add one storage destination after the Code node. Start simple.

Recommended first version:

- Google Sheets row
- Notion database page
- Airtable record
- PostgreSQL/MySQL row

Fields to store:

- `submittedAt`
- `priority`
- `score`
- `name`
- `email`
- `company`
- `workFocus`
- `companyStage`
- `urgency`
- `engagement`
- `budget`
- `currentTools`
- `challenge`
- `pageUrl`
- `scoreReasons`

## Recommended Next Automation

After email and storage work reliably, add an AI node that creates:

- one-paragraph executive summary
- likely service fit
- recommended discovery questions
- suggested first-call agenda

Keep that AI output internal only until reviewed.
