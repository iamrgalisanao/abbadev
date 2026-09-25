# On-site AI Assistant — n8n + Ollama workflow

This is the backend for the grounded AI assistant in the site's chat widget
([src/Assistant.jsx](../src/Assistant.jsx)). The widget sends free-text questions
to the Node proxy, the proxy forwards them to an n8n webhook, and n8n grounds the
question in ABBADev's knowledge + the live sessions API, calls a local **Ollama**
model, and returns a short answer.

```
Assistant widget ──POST /api/assistant──▶ Node proxy ──▶ n8n webhook
                                                             │
                                            GET api.abbadev.com/api/events
                                            (live sessions, for grounding)
                                                             │
                                            build grounded system prompt
                                                             │
                                            POST Ollama /api/chat (small model)
                                                             │
                                            ◀──── { reply } ─┘
```

If n8n / Ollama is down, slow (>24s), or unconfigured, the widget silently falls
back to its deterministic intent matcher, so the assistant never breaks.

---

## 1. The contract

**Proxy → n8n webhook** (`POST`, Header Auth `Authorization: Bearer <token>`):

```json
{
  "messages": [
    { "role": "user", "content": "do you build internal dashboards?" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "how much would that cost?" }
  ],
  "pageUrl": "https://abbadev.com/",
  "source": "assistant-chat"
}
```

`messages` is the recent conversation (last ~10 turns), oldest first, already in
`role`/`content` shape. **n8n must respond** with:

```json
{ "reply": "Yes — internal dashboards are a common custom build..." }
```

Anything else (missing `reply`, empty string, non-200) makes the proxy return a
502/504 and the widget falls back. Keep replies short (2–4 sentences).

---

## 2. Ollama setup

Ollama runs in Docker on the VPS, bound to localhost only (good — not public):

```bash
docker run -d --name ollama --restart unless-stopped \
  -p 127.0.0.1:11434:11434 -v ollama_data:/root/.ollama ollama/ollama
docker exec -it ollama ollama pull qwen3:1.7b
```

**Model in use: `qwen3:1.7b`.** It's small and fast. Two things to know:

- **It "thinks" by default** — the response wraps chain-of-thought in
  `<think>…</think>`. We disable that in the request (`think: false`) and strip it
  defensively, so the widget only shows the answer. This also cuts latency.
- **1.7B is on the small side for grounded Q&A.** The KB grounding + `temperature: 0.2`
  keep it honest. If it drifts or refuses too much, bump the model — it's a one-word
  change in Node 3:

| Model | Pull | Notes |
|---|---|---|
| `qwen3:1.7b` | (current) | Fastest, smallest. Fine to start; watch for drift. |
| `llama3.2:3b` | `docker exec -it ollama ollama pull llama3.2:3b` | No thinking overhead, solid follower, ~2 GB. |
| `qwen3:4b` | `docker exec -it ollama ollama pull qwen3:4b` | Better grounding; still modest. |

Test it directly first (note `think` and `/no_think` both suppress reasoning):

```bash
docker exec -it ollama curl -s http://localhost:11434/api/chat -d '{
  "model": "qwen3:1.7b",
  "stream": false,
  "think": false,
  "messages": [{ "role": "user", "content": "Say hello in one sentence." }],
  "options": { "temperature": 0.2 }
}'
```

### Reaching Ollama from n8n

Because the port is published on `127.0.0.1` only, **another container cannot reach
it via `localhost` or `host.docker.internal`** (those resolve to the wrong place).
Pick the line that matches how n8n runs:

- **n8n as a Docker container (most likely):** put both containers on one network and
  call Ollama by name. URL becomes `http://ollama:11434`.
  ```bash
  docker network create ai 2>/dev/null; \
  docker network connect ai ollama; \
  docker network connect ai n8n      # use your n8n container's actual name
  ```
- **n8n installed directly on the host (npm/systemd):** `http://localhost:11434` works
  as-is.

Keep Ollama bound to localhost / the private Docker network. Do **not** publish
11434 to the public interface — only n8n should reach it.

---

## 3. The n8n workflow

Seven nodes, in this order:

```
Webhook → Fetch Sessions → Fetch Facts → Build request (Code) → Ollama (HTTP) → Clean reply (Code) → Respond
```

Build them by hand as below.

### Node 1 — Webhook (trigger)
- **HTTP Method:** POST
- **Path:** `abbadev-assistant`  → full URL `https://n8nautomation.abbadev.com/webhook/abbadev-assistant`
- **Authentication:** Header Auth → create a credential with **Name** `Authorization`,
  **Value** `Bearer <your-assistant-token>`. Put the same token in the proxy env as
  `N8N_ASSISTANT_JWT` (see [.env.example](../.env.example)).
- **Respond:** "Using 'Respond to Webhook' node".

### Node 2 — HTTP Request: **Fetch Sessions**
Name the node exactly **Fetch Sessions** (Node 3 reads it by name).
- **Method:** GET
- **URL:** `https://api.abbadev.com/api/events`
- **Options → Timeout:** 5000 ms
- **Settings → On Error:** "Continue" (a slow sessions API never blocks a reply;
  the prompt just says no sessions are listed).

The API returns `{ "events": [ ... ] }`. It is the same source the website uses, so
the assistant always quotes the live sessions.

### Node 2b — HTTP Request: **Fetch Facts**
Name the node exactly **Fetch Facts**. Place it after Fetch Sessions.
- **Method:** GET
- **URL:** `https://abbadev.com/assistant-facts.md`
- **Options → Response → Response Format:** Text (the text lands in the `data` field)
- **Options → Timeout:** 5000 ms
- **Settings → On Error:** "Continue"

`public/assistant-facts.md` in the repo is **the single place to edit what the
assistant knows**: company, founder, services, the six case studies, products,
pricing, how to start, contact and privacy. It ships with every site deploy, so the
assistant picks up changes without touching n8n. It is condensed from
`docs/knowledge-base/`; keep it short, because on CPU every prompt word adds latency.

### Node 3 — Code: build the Ollama request
Language: JavaScript, mode **Run Once for All Items**. It assembles the grounded
system prompt (facts file + live sessions) and sanitises the incoming turns.

```js
// --- Facts: fetched from abbadev.com/assistant-facts.md (Node 2b) ----------
// A tiny fallback keeps the assistant honest if the site can't be reached.
const FALLBACK_FACTS = `ABBADev IT Solutions designs systems architecture, AI automation and custom software.
Founder: Rommel Galisanao, Founder & Principal Systems Architect.
Book a consultation at /#contact (reply within one business day) or email info@abbadev.com.
Case studies: /cases. Services: /services. Sessions: /register.`

let facts = ''
try {
  const fetched = $('Fetch Facts').first().json
  facts = typeof fetched.data === 'string' ? fetched.data : ''
} catch { facts = '' }
// Drop the file's own header note (everything before the first "## " section).
const firstSection = facts.indexOf('\n## ')
if (firstSection > -1) facts = facts.slice(firstSection + 1)
if (facts.trim().length < 200) facts = FALLBACK_FACTS

// --- Live sessions from Node 2, soonest first ------------------------------
let sessions = []
try {
  const body = $('Fetch Sessions').first().json
  sessions = Array.isArray(body.events) ? body.events : Array.isArray(body) ? body : []
} catch { sessions = [] }
sessions = sessions
  .filter((s) => s && s.slug && s.title)
  .sort((a, b) => (Date.parse(a.starts_at) || Infinity) - (Date.parse(b.starts_at) || Infinity))

const sessionsBlock = sessions.length
  ? 'CURRENT SESSIONS (soonest first; each line ends with that session\'s registration link):\n' + sessions.map((s) =>
      `- ${s.title}: ${s.type || 'Session'}, ${s.mode === 'In-person' && s.location ? s.location : s.mode || 'Online'}, `
      + `${s.date || 'TBA'} ${s.time || ''}, ${s.is_free ? 'Free' : s.price_label || ''}. /seminar?event=${s.slug}`).join('\n')
  : 'CURRENT SESSIONS: none listed right now. Point people to /register for updates.'

const system = `You are the website assistant for ABBADev IT Solutions.

RULES
1. Answer ONLY with information in FACTS and CURRENT SESSIONS below. Never guess.
2. If the facts do not answer the question, reply: "I don't have that detail here." Then suggest the consultation form at /#contact or info@abbadev.com. Do NOT say ABBADev does or doesn't do something unless the facts say so.
3. Never invent case studies, products, clients, people, prices, dates or numbers. Mention only the six case studies and two products listed.
4. Never write placeholders or square brackets. Always call the company ABBADev IT Solutions.
5. Plain text only: no Markdown, no bold, no headings. For lists, put each item on its own line starting with "- ".
6. Keep answers short: 2 to 4 sentences, or a list of at most 6 short items.
7. When a fact has a link or path, include it exactly as written, like /cases, /#contact or https://crm.abbadev.com.
8. Do not add descriptions, benefits or claims that are not in the facts.

FACTS
${facts.trim()}

${sessionsBlock}`

// --- Sanitise incoming turns (keep the prompt inside the context window) ---
// Read the visitor's messages from the Webhook node: after the two HTTP nodes,
// the current item is the facts file, not the request.
let incoming = []
try {
  const hook = $('Webhook').first().json
  const body = hook.body ?? hook
  incoming = Array.isArray(body.messages) ? body.messages : []
} catch { incoming = [] }
const turns = incoming
  .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
  .slice(-6)
  .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 800) }))

if (turns.length === 0) turns.push({ role: 'user', content: 'Hello' })

// Two worked examples: small models follow examples far better than rules. One shows
// the reply for anything the facts don't cover; the other keeps price questions answered.
const example = [
  { role: 'user', content: 'Do you offer 24/7 on-site support?' },
  { role: 'assistant', content: "I don't have that detail here. You can ask ABBADev IT Solutions directly through the consultation form at /#contact or email info@abbadev.com." },
  { role: 'user', content: 'How much would a customer portal cost?' },
  { role: 'assistant', content: 'Every engagement is scoped per workflow, from a small advisory scope up to $50k+ for a full build. An exact figure comes after a short consultation, which you can book at /#contact.' },
]

return [{
  json: {
    model: 'qwen3:1.7b',
    stream: false,
    think: false,      // qwen3 reasons by default; suppress it for a clean, fast reply
    keep_alive: -1,    // keep the model resident so replies never cold-reload
    messages: [{ role: 'system', content: system }, ...example, ...turns],
    options: { temperature: 0.1, num_ctx: 6144, num_predict: 400 },
  },
}]
```

> Node 3 reads its inputs by node name: **Webhook**, **Fetch Sessions** and **Fetch Facts**.
> If you rename any of those nodes, update the names in the code.
>
> If you switch to a non-thinking model (e.g. `llama3.2:3b`), `think: false` is
> ignored, so it's safe to leave in.

### Node 4 — HTTP Request: call Ollama
- **Method:** POST
- **URL:** `http://ollama:11434/api/chat` (shared Docker network) or
  `http://localhost:11434/api/chat` (n8n on the host). See section 2.
- **Body Content Type:** JSON
- **Body:** "Using JSON" →  `={{ $json }}`  (sends the object built in Node 3)
- **Options → Timeout:** 28000 ms (see the timeout ladder in section 5)

### Node 5 — Code: extract + clean the reply
```js
const SAFE_REPLY = "I don't have that detail here. You can ask ABBADev IT Solutions directly through the consultation form at /#contact or email info@abbadev.com."

const res = $input.first().json
const raw = res?.message?.content
let reply = (typeof raw === 'string' ? raw : '').trim()
// Strip any qwen3 reasoning that slipped through think:false.
reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
// Unwrap Markdown emphasis and headings a small model sometimes adds.
reply = reply
  .replace(/\*\*(.*?)\*\*/g, '$1')
  .replace(/\*(.*?)\*/g, '$1')
  .replace(/^#{1,6}\s*/gm, '')
  // Drop prompt section headers the model sometimes echoes (CURRENT SESSIONS, FACTS, RULES).
  .replace(/^(CURRENT SESSIONS|FACTS|RULES)\b.*$\n?/gim, '')
  .replace(/[ \t]{2,}/g, ' ')
  .trim()

// A placeholder like [Name] or [Title] means the model made something up.
// Send the safe reply instead of a half-invented answer.
if (/\[[^\]\n]{1,40}\]/.test(reply)) reply = SAFE_REPLY

// If generation hit the token limit, cut back to the last complete line or sentence.
if (res?.done_reason === 'length') {
  const cut = Math.max(reply.lastIndexOf('\n'), reply.lastIndexOf('. '))
  if (cut > 80) reply = reply.slice(0, cut + 1).trim()
}

if (!reply) reply = SAFE_REPLY
// Hard cap so a runaway generation can't flood the chat bubble.
return [{ json: { reply: reply.slice(0, 1500) } }]
```

### Node 6 — Respond to Webhook
- **Respond With:** JSON
- **Response Body:** `={{ { "reply": $json.reply } }}`
- **Response Code:** 200

---

## 4. Wire up the proxy + site

1. In the VPS proxy env (same file as the other `N8N_*` vars), set:
   ```
   N8N_ASSISTANT_WEBHOOK_URL=https://n8nautomation.abbadev.com/webhook/abbadev-assistant
   N8N_ASSISTANT_JWT=<your-assistant-token>
   ```
2. In the site build env, set `VITE_ASSISTANT_ENDPOINT=/api/assistant`, then rebuild
   and deploy the site.
3. Leave either one unset to keep the assistant deterministic-only while you test.

Test the whole chain end to end:

```bash
curl -s https://abbadev.com/api/assistant \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"do you build dashboards, and roughly what does it cost?"}]}'
```

You should get `{"reply":"..."}` grounded in the KB (it should mention custom builds
and defer the exact price to a consult, not invent a number).

---

## 5. Tuning + caveats

- **Small models hallucinate.** The numbered rules, `temperature: 0.1` and Node 5's
  placeholder guard keep it tight, but spot-check answers. If it still invents facts,
  move up to `qwen3:4b` (or `qwen2.5:7b-instruct` with more RAM).
- **Latency = model + hardware.** Measured on CPU with qwen3:1.7b and the full
  grounded prompt: **~18s warm, ~23s cold** (model just loaded). The widget shows a
  typing indicator during this. Two things keep it under the timeout:
  - `keep_alive: -1` (Node 3) keeps the model resident so every request after the
    first is warm. After an Ollama restart, pre-warm it once so no visitor eats the
    cold load:
    ```bash
    curl -s http://127.0.0.1:11434/api/chat -d '{"model":"qwen3:1.7b","keep_alive":-1,"messages":[{"role":"user","content":"hi"}],"stream":false,"think":false}' >/dev/null
    ```
    (Or set `-e OLLAMA_KEEP_ALIVE=-1` when you `docker run` the container.)
  - **Timeout ladder** — each layer waits slightly longer than the one it calls, so a
    stall fails inward first and the widget always falls back cleanly:
    `Ollama HTTP (Node 4) 28s  <  proxy ASSISTANT_TIMEOUT_MS 30s  <  client 32s`.
- **~18s is still a long wait for a visitor.** It's acceptable with the typing
  indicator for launch, but the real fix for snappy replies (1-2s) is a GPU — CPU
  token generation (~10 tok/s) is the bottleneck, not the workflow. A smaller model
  (e.g. `llama3.2:1b`) trades quality for speed if you need it sooner.
- **No streaming.** n8n replies once, so the answer appears all at once (not token by
  token). Fine for short answers; revisit only if you want a typewriter effect.
- **Keep the facts current.** Sessions are live from the events API. Everything else
  the assistant knows comes from `public/assistant-facts.md`, fetched on every question.
  Edit that file (not n8n) when the offering changes, then deploy the site.
- **Test after any change** with the ten questions in section 6.
- **Optional lead capture.** To also drop a lead when someone asks to book, add an IF
  node after Node 5 that branches on the reply/question and posts to the existing
  `abbadev-chat-lead` workflow. Start with Q&A only; add this once the basics are solid.
```

---

## 6. Accuracy check

Run these ten questions after any change to the facts file, the prompt or the model.
The expected answers come from `public/assistant-facts.md` and the events API.

```bash
for q in "What services does ABBADev offer?" \
  "How many case studies do you have, and what are they?" \
  "What is Stockora?" \
  "Who founded ABBADev and what is his title?" \
  "How much does a project cost?" \
  "What upcoming seminars or workshops do you have?" \
  "How do I book a consultation and how fast do you reply?" \
  "Tell me about the ABBADev CRM." \
  "Does your website use cookies or tracking pixels?" \
  "What is your contact email?"; do
  printf '\n### %s\n' "$q"
  curl -s -m 60 https://abbadev.com/api/assistant -H 'Content-Type: application/json' \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"$q\"}]}"
  echo
done
```

| Question | A correct answer includes |
|---|---|
| Services | AI automation strategy, enterprise architecture, custom software builds, governance and review |
| Case studies | Six: transaction intake, document intake, integration foundation, guardrailed assistant, ABBADev CRM, Stockora |
| Stockora | ABBADev's own warehouse product; demo at stockora.abbadev.com |
| Founder | Rommel Galisanao, Founder & Principal Systems Architect |
| Pricing | Scoped per workflow, small advisory scope up to $50k+, no specific quote |
| Sessions | The events API list, soonest first, with /seminar?event= links |
| Booking | /#contact; reply within one business day |
| CRM | Contacts, pipeline, tasks, dashboard; crm.abbadev.com |
| Cookies | No cookies, pixels or analytics; /privacy |
| Email | info@abbadev.com |

Wrong answers to watch for: invented case studies, "ABBADev Tech Solutions" (the old
name), placeholders such as [Name], and replies cut off mid-sentence.

