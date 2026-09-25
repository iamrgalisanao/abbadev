# Automation (n8n)

- **Host:** `n8nautomation.abbadev.com`.
- **Webhook authentication:** every webhook uses Header Auth (`Authorization: Bearer <JWT>`). The proxy is the only caller.
- **Full node-by-node guides:**
  - `automation/n8n/*.md`
  - `docs/n8n-event-workflow.md`
  - `docs/n8n-assistant-workflow.md`

| Webhook path | Workflow | Stores in | Notifies |
|---|---|---|---|
| `abbadev-consultation` | Consultation lead | Notion "ABBADev Consultation Leads" | Internal email to Rommel, and a confirmation email to the client |
| `abbadev-chat-lead` | Chat lead | Postgres `chat_leads` | Telegram (email is an alternative) |
| `abbadev-event-registration` | Event registration | Postgres `event_registrations` | Branded confirmation email, and Telegram |
| `abbadev-assistant` | AI assistant | — | Returns `{ reply }` |

## Consultation lead workflow

**Steps:** Webhook (responds immediately) → Code "normalize + score" → Notion create page → internal email → client confirmation email.

**Validation.** The workflow requires a name and a challenge of at least 10 characters.

**Lead scoring:**

| Signal | Points |
|---|---|
| Service fit (AI automation / Custom software / Architecture review) | +25 |
| Urgency is this month or this quarter | +20 |
| Budget | $15k+ → +25 · $5–15k → +15 · "To be scoped" → +8 |
| Challenge length | ≥180 chars → +20 · ≥80 → +12 |
| Stage is Growing business or Enterprise | +10 |

Priority from the total score: **High** at 75 or more, **Medium** at 45 or more, otherwise **Low**.

**Notion database** (`automation/n8n/notion-leads-schema.sql`)
- **Properties:**
  - Lead (title)
  - Status, Priority, Score, Submitted At
  - Contact and qualification fields: Name, Email, Company, Preferred Contact, Work Focus, Company Stage, Urgency, Engagement, Budget
  - Detail fields: Current Tools, Challenge, Score Reasons
  - Tracking: Source, Source Page
  - Follow-up: Next Action, Owner, Last Contacted
- **Status values:** New → Reviewed → Contacted → Discovery Scheduled → Proposal Sent → Won / Lost / Not Fit.
- **Views:** New Leads, High Priority, Pipeline board, All Leads.

## Chat lead workflow

**Steps:** Webhook → Code (validate the email, require a challenge of at least 3 characters, build `telegramText`) → Postgres insert → Telegram.

**Table `chat_leads`** (`automation/n8n/chat-leads-schema.sql`)
- **Columns:** `id` (bigserial), `name`, `email` (not null), `challenge` (not null), `work_focus`, `engagement`, `source`,
  `channel`, `page_url`, `submitted_at`, `created_at`, `status`.
- **Status values:** new / reviewed / contacted / won / lost / not_fit. New rows default to `new`.
- **Indexes:** on `created_at desc` and on `email`.

## Event registration workflow

**Steps:** Webhook → Code "Normalize Registration" → Postgres insert (`ON CONFLICT DO NOTHING RETURNING id`) → IF new row. A new row
gets a confirmation email and a Telegram message; a duplicate goes to a no-op.

**What "Normalize Registration" does:**
- It builds its `EVENTS` catalog from the events API, fetched by a **Fetch Events** HTTP node just before it, so session details
  are never copied into n8n. An `eventId` the API doesn't list makes it throw; so does an unreachable API, except for `notify-next`.
- Paid events get status `reserved`, and the email links to `/seminar?event=<slug>` to finish booking and pay. The site now sends
  every specific-session booking there directly, so this path only catches old cached pages or builds without the events API.
- Free events get status `registered`.
- `notify-next` is the waitlist.

**Reminder workflow.** Runs daily at about 09:00 PHT. It emails everyone with status `registered` or `confirmed` whose event starts within 24 hours and who
hasn't had a reminder yet (`reminded_at IS NULL`), then sets `reminded_at`.

**Table `event_registrations`** (`automation/n8n/event-registrations-schema.sql`)
- **Columns:**
  - who: `id`, `name`, `email`, `audience`, `organization`, `phone`
  - which event: `event_id`, `event_title`, `event_start` (timestamptz), `event_when`, `event_mode`
  - submission: `message`, `source`, `channel`, `page_url`, `submitted_at`, `created_at`
  - tracking: `reminded_at`, `status`
  - ad attribution: `lead_source`, `flow`, `utm_source`, `utm_campaign`, `fbclid`
- **Status values:** registered / reserved (paid, awaiting payment) / confirmed / attended / no_show / cancelled / waitlist.
  New rows default to `registered`.
- **Duplicate protection:** a partial unique index on `(email, event_id) WHERE event_id <> 'notify-next'`, so each email can register once per event.
- **Upgrading:** the schema file is safe to re-run. It adds any missing columns to an existing table with `ALTER TABLE … ADD COLUMN IF NOT EXISTS`.

GCash details live only in the events API admin; neither the site nor n8n keeps a copy.

## AI assistant workflow (`docs/n8n-assistant-workflow.md`)

**Model.** Ollama runs in Docker on the VPS and listens only on `127.0.0.1:11434`. n8n reaches it at `http://ollama:11434` over a shared Docker
network. The model is **`qwen3:1.7b`**; `qwen3:4b` and `qwen2.5:7b-instruct` are the documented step-ups.

**Nodes:** Webhook `abbadev-assistant` → **Fetch Sessions** (`GET https://api.abbadev.com/api/events`) → **Fetch Facts**
(`GET https://abbadev.com/assistant-facts.md`) → Code: build the request → HTTP: Ollama `/api/chat` (28 s timeout) → Code: clean the
reply → Respond `{ reply }`.

**What it knows.** Everything except the live session list comes from **`public/assistant-facts.md`**, a one-page, visitor-facing fact
sheet condensed from this knowledge base. It ships with every site deploy, so edit that file (not n8n) when the offering changes.
It ends with a "Topics without details" list so the model says it doesn't know rather than guessing.

**Prompt.** Eight numbered rules (answer only from the facts; say "I don't have that detail here" otherwise; never invent case
studies, clients, prices or placeholders; plain text; include links) plus two worked examples: one unknown question and one price
question. Settings: `temperature 0.1`, `num_ctx 6144`, `num_predict 400`, `think: false`, `keep_alive: -1`. History is capped at
6 turns of 800 characters.

**Clean-up (node 5).** Strips `<think>` blocks, Markdown and echoed prompt headers; replaces any reply containing a `[placeholder]`
with a safe "I don't have that detail here" reply; trims a reply that hit the token limit back to its last complete line.

**Accuracy.** Tested 2026-09-25 on `qwen3:1.7b` with the section 6 question set: the old live prompt got 4 of 10 right (it invented
case studies, denied Stockora, returned "[Name]" for the founder and said there was no email). The new prompt answered all 10 core
questions correctly and gave the safe reply to five questions the facts don't cover. **Live on abbadev.com the same day, after
publishing the new workflow: 10 of 10 core questions correct, quote requests answered with the pricing range, and "I don't have that
detail here" for mobile apps and hiring.** Remaining quirk: it pads the CRM description with generic wording. Replies take 1.5–26 s
on the server's CPU; the full session list is the slowest.

**Live node names:** Webhook → Fetch Live Sessions → Fetch Facts → Build AI Prompt → Call Ollama → Clean AI Reply → Respond to Webhook.
Edits in n8n only take effect after **Publish** (the button shows a yellow dot while changes are unpublished).

**Timeouts.** Nested so each outer layer outlasts the inner one: Ollama 28 s < proxy 30 s < browser 32 s.

**Auth.** The webhook uses its own Header Auth credential with the `N8N_ASSISTANT_JWT` token (`Bearer <token>`). A shared credential
holding `N8N_JWT` caused every request to fail with 403 until 2026-09-25.
