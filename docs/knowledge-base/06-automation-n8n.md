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
- **Status values:** registered / confirmed / attended / no_show / cancelled / waitlist. New rows default to `registered`.
- **Duplicate protection:** a partial unique index on `(email, event_id) WHERE event_id <> 'notify-next'`, so each email can register once per event.
- The docs also mention optional `lead_source`, `flow` and `utm_campaign` columns, but they aren't in the SQL.

GCash details live only in the events API admin; neither the site nor n8n keeps a copy.

## AI assistant workflow (`docs/n8n-assistant-workflow.md`)

**Model.** Ollama runs in Docker on the VPS and listens only on `127.0.0.1:11434`. n8n reaches it at `http://ollama:11434` over a shared Docker
network. The model is **`qwen3:1.7b`**; `llama3.2:3b` and `qwen3:4b` are the documented alternatives.

**Nodes:**
1. Webhook `abbadev-assistant`, which responds through a Respond node.
2. HTTP GET `https://api.abbadev.com/api/events` to fetch live sessions (5 s timeout, continues on error).
3. Code node that builds a grounded system prompt from a hard-coded knowledge-base string plus the live sessions, linked as `/seminar?event=SLUG`.
   - Prompt rules: answer only from these facts, in 2–4 sentences of plain text, with no em dashes and no placeholders.
   - Ollama options: `think: false`, `keep_alive: -1`, `temperature: 0.2`, `num_ctx: 4096`, `num_predict: 220`.
4. HTTP POST to Ollama `/api/chat`, with a 28 s timeout.
5. Code node that cleans up the reply: strips `<think>` blocks, Markdown and `[PLACEHOLDER]` tokens, and caps it at 1,200 characters.
6. Respond with `{ reply }`.

**Timeouts.** They are nested so each outer layer outlasts the inner one: Ollama 28 s < proxy 30 s < browser 32 s.

**Speed.** On CPU a reply takes about 18 s when the model is warm and about 23 s from cold. A GPU is recommended.

**Maintenance.** The knowledge-base string in node 3 is static and still describes **three** case studies; the site has six.
