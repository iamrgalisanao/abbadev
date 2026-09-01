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

Six nodes. Import the shape below or build it by hand.

### Node 1 — Webhook (trigger)
- **HTTP Method:** POST
- **Path:** `abbadev-assistant`  → full URL `https://n8nautomation.abbadev.com/webhook/abbadev-assistant`
- **Authentication:** Header Auth → create a credential with **Name** `Authorization`,
  **Value** `Bearer <your-assistant-token>`. Put the same token in the proxy env as
  `N8N_ASSISTANT_JWT` (see [.env.example](../.env.example)).
- **Respond:** "Using 'Respond to Webhook' node".

### Node 2 — HTTP Request: fetch live sessions (grounding)
- **Method:** GET
- **URL:** `https://api.abbadev.com/api/events`
- **Options → Timeout:** 5000 ms
- **On error:** "Continue" (so a slow sessions API never blocks a reply — the
  prompt just omits the live list).

This is what keeps the assistant current: it always answers with the *actual*
active sessions, not a hardcoded list.

### Node 3 — Code: build the Ollama request
Language: JavaScript. This assembles the grounded system prompt (curated KB +
live sessions) and sanitises the incoming turns.

```js
// --- Curated, editable ABBADev knowledge base -----------------------------
const KB = `
ABBADev Tech Solutions is a Philippine software + AI consultancy led by Rommel Galisanao.
The thesis: AI scoped to accountable steps, with deterministic rules and a human owner
confirming the path. Never "AI does everything on its own."

SERVICES (four):
1. AI automation strategy — scope AI to intake, analysis, drafting, routing, and review,
   each with a human approval point. Often built on n8n workflows.
2. Enterprise architecture — define system boundaries, data flow, source-of-truth rules,
   and a governance model before implementation cost compounds.
3. Custom software builds — internal tools, portals, dashboards, APIs, workflow apps,
   shaped around how the business actually operates. Discovery, prototype, build, handoff.
4. Governance and review — keep accountability human at every step.

PROOF (case studies at /cases): a transaction intake command center, a document intake
assistant, and an integration foundation. Each shows problem, approach, implementation,
governance, and measurable before/after.

PROCESS: a first conversation clarifies the workflow and outcome, identifies the systems,
people, and approval points, then returns a practical path. Book via /#contact.

PRICING: scoped per workflow, not a fixed package. Ranges from a small advisory scope up
to $50k+ for full builds. Exact numbers come from a short consultation brief. Do NOT invent
a specific quote.

CONTACT: info@abbadev.com, or the consultation form at /#contact.
`.trim();

// --- Live sessions from Node 2 --------------------------------------------
let sessions = [];
try {
  sessions = $('HTTP Request').first().json ?? [];
  if (!Array.isArray(sessions)) sessions = [];
} catch { sessions = []; }

const sessionsBlock = sessions.length
  ? 'CURRENT SESSIONS (register at /seminar?event=SLUG):\n' + sessions.map((s) =>
      `- ${s.title} (${s.type}${s.mode ? ', ' + s.mode : ''}) — ${s.date || 'TBA'} ${s.time || ''}, `
      + `${s.price_label || (s.is_free ? 'Free' : '')}. slug: ${s.slug}`).join('\n')
  : 'CURRENT SESSIONS: none listed right now.';

const system = `You are the ABBADev website assistant. Answer ONLY using the facts below.
If a question is off-topic or not covered by these facts, say you do not have that detail
and offer to prepare a consultation brief. Never invent prices, dates, or capabilities.
Keep answers to 2-4 short sentences. Do not use the em dash character. To book, point the
person to the consultation form at /#contact. To register for a session, point them to
/seminar?event=SLUG using a slug from the list.

${KB}

${sessionsBlock}`;

// --- Sanitise incoming turns ----------------------------------------------
const incoming = Array.isArray($json.messages) ? $json.messages : [];
const turns = incoming
  .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
  .slice(-10)
  .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

if (turns.length === 0) turns.push({ role: 'user', content: 'Hello' });

return [{
  json: {
    model: 'qwen3:1.7b',
    stream: false,
    think: false,        // qwen3 reasons by default; suppress it for a clean, fast reply
    keep_alive: '30m',   // hold the model in memory so replies don't cold-reload (~9s CPU)
    messages: [{ role: 'system', content: system }, ...turns],
    options: { temperature: 0.2, num_ctx: 4096 },
  },
}];
```

> If you switch to a non-thinking model (e.g. `llama3.2:3b`), the `think: false`
> field is simply ignored — safe to leave in.

### Node 4 — HTTP Request: call Ollama
- **Method:** POST
- **URL:** `http://ollama:11434/api/chat` (shared Docker network) or
  `http://localhost:11434/api/chat` (n8n on the host) — see section 2.
- **Body Content Type:** JSON
- **Body:** "Using JSON" →  `={{ $json }}`  (sends the object built in Node 3)
- **Options → Timeout:** 22000 ms (stay just under the proxy's 24s ceiling)

### Node 5 — Code: extract + clean the reply
```js
const raw = $json?.message?.content;
let reply = (typeof raw === 'string' ? raw : '').trim();
// Belt and suspenders: strip any qwen3 reasoning that slipped through think:false.
reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
// Hard cap so a runaway generation can't flood the bubble.
return [{ json: { reply: reply.slice(0, 1200) } }];
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

- **Small models hallucinate.** The grounding prompt + `temperature: 0.2` keep it
  tight, but spot-check answers. If it invents facts, lower the temperature to 0.1,
  shorten/clarify the KB, or move up to `qwen2.5:7b-instruct`.
- **Latency = model + hardware.** On CPU, first token can take several seconds. The
  widget shows a typing indicator and waits up to 25s, then falls back. If replies
  routinely time out, use a smaller model or add a GPU.
- **No streaming.** n8n replies once, so the answer appears all at once (not token by
  token). Fine for short answers; revisit only if you want a typewriter effect.
- **Keep the KB in sync.** The sessions list is live via the API, but services,
  pricing ranges, and case-study facts are the `KB` string in Node 3 — update it when
  the offering changes. It is the single place to edit what the assistant "knows".
- **Optional lead capture.** To also drop a lead when someone asks to book, add an IF
  node after Node 5 that branches on the reply/question and posts to the existing
  `abbadev-chat-lead` workflow. Start with Q&A only; add this once the basics are solid.
```
