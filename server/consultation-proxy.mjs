import http from 'node:http'

const PORT = Number(process.env.PORT || 8787)
// Only the local web server (Apache/Nginx) should reach the proxy, so listen on
// loopback by default. Set HOST=0.0.0.0 only if the web server runs elsewhere.
const HOST = process.env.HOST || '127.0.0.1'
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
// Optional: route chat-assistant leads to their own n8n workflow.
// Falls back to the main consultation webhook when unset.
const N8N_CHAT_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL
const N8N_JWT = process.env.N8N_JWT
// Optional: dedicated secret for the chat-assistant webhook so a leak of one
// token does not expose the other pipeline. Falls back to N8N_JWT when unset.
const N8N_CHAT_JWT = process.env.N8N_CHAT_JWT || process.env.N8N_JWT
// Optional: route seminar/webinar registrations to their own n8n workflow.
// Both fall back to the main consultation pipeline when unset.
const N8N_EVENT_WEBHOOK_URL = process.env.N8N_EVENT_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL
const N8N_EVENT_JWT = process.env.N8N_EVENT_JWT || process.env.N8N_JWT
// Optional: the grounded AI assistant workflow (n8n -> Ollama). Unlike the lead
// webhooks this one returns a generated reply, so it has no sensible fallback -
// when unset, /api/assistant reports "not configured" and the widget degrades to
// its deterministic answers client-side.
const N8N_ASSISTANT_WEBHOOK_URL = process.env.N8N_ASSISTANT_WEBHOOK_URL
const N8N_ASSISTANT_JWT = process.env.N8N_ASSISTANT_JWT || process.env.N8N_JWT
// How long to wait on the assistant workflow before giving up (ms). A small CPU
// model with the full grounded prompt answers in ~18s warm; this sits just under
// the client's ceiling so the proxy returns a clean 504 before the browser aborts.
const ASSISTANT_TIMEOUT_MS = Number(process.env.ASSISTANT_TIMEOUT_MS || 30000)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://abbadev.com'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Fields each lead pipeline accepts. Anything else in the browser payload is
// dropped before it reaches n8n. Keep these in sync with the forms that post to
// each endpoint (see docs/knowledge-base/05-forms-assistant-proxy.md).
const LEAD_FIELDS = {
  // v2 homepage form, v1 #contact form, and the /services ProjectScoper quiz
  form: [
    'name', 'email', 'company', 'preferredContact', 'workFocus', 'companyStage', 'currentTools', 'urgency',
    'challenge', 'engagement', 'budget', 'message', 'formType', 'orgType', 'focus', 'timeline',
    'recommendedService', 'source', 'pageUrl', 'submittedAt',
  ],
  // assistant "Book a consult" flow
  chat: ['name', 'email', 'challenge', 'workFocus', 'engagement', 'source', 'pageUrl', 'submittedAt'],
  // /register form and the /seminar reserve-then-pay fallback
  event: [
    'name', 'email', 'phone', 'organization', 'message', 'audience', 'eventId', 'eventTitle', 'eventDate',
    'price', 'flow', 'leadSource', 'utm', 'source', 'pageUrl', 'submittedAt',
  ],
}
const LONG_TEXT_FIELDS = new Set(['challenge', 'message', 'currentTools'])
const fieldLimit = (key) => (LONG_TEXT_FIELDS.has(key) ? 5000 : key === 'pageUrl' ? 1000 : 300)

// Ad attribution params (utm_source, fbclid, ...): a small flat map of strings.
const cleanUtm = (utm) => {
  if (!utm || typeof utm !== 'object' || Array.isArray(utm)) return undefined
  const entries = Object.entries(utm)
    .filter(([key, value]) => /^[\w.-]{1,64}$/.test(key) && typeof value === 'string')
    .slice(0, 20)
    .map(([key, value]) => [key, value.slice(0, 500)])
  return entries.length ? Object.fromEntries(entries) : undefined
}

const pickLeadFields = (payload, channel) => {
  const lead = {}
  for (const key of LEAD_FIELDS[channel]) {
    const value = payload[key]
    if (key === 'utm') {
      const utm = cleanUtm(value)
      if (utm) lead.utm = utm
    } else if (typeof value === 'string') {
      lead[key] = value.trim().slice(0, fieldLimit(key))
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      lead[key] = String(value)
    }
  }
  return lead
}

// Per-client rate limits, counted separately for each endpoint. In-memory, so
// they reset when the proxy restarts - enough to blunt scripted form spam and
// protect the CPU-bound assistant model, without a datastore.
const RATE_LIMITS = {
  form: { max: 5, windowMs: 10 * 60 * 1000 },
  chat: { max: 5, windowMs: 10 * 60 * 1000 },
  event: { max: 10, windowMs: 10 * 60 * 1000 },
  assistant: { max: 20, windowMs: 10 * 60 * 1000 },
}
const MAX_TRACKED_CLIENTS = 50000
const hits = new Map()

// Behind Apache/Nginx every request arrives from loopback, so the real client is
// the last X-Forwarded-For entry (the one the local web server appended).
const clientIp = (request) => {
  const remote = request.socket.remoteAddress || ''
  const isLoopback = remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
  const forwarded = request.headers['x-forwarded-for']
  if (isLoopback && typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',').pop().trim()
  }
  return remote
}

// Returns 0 when the request may proceed, otherwise the seconds to wait.
const rateLimit = (bucket, ip) => {
  const { max, windowMs } = RATE_LIMITS[bucket]
  const key = `${bucket}:${ip}`
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((time) => now - time < windowMs)

  if (recent.length >= max) {
    hits.set(key, recent)
    return Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000))
  }

  if (!hits.has(key) && hits.size >= MAX_TRACKED_CLIENTS) hits.clear()
  recent.push(now)
  hits.set(key, recent)
  return 0
}

const longestWindow = Math.max(...Object.values(RATE_LIMITS).map((limit) => limit.windowMs))
setInterval(() => {
  const now = Date.now()
  for (const [key, times] of hits) {
    if (now - times[times.length - 1] >= longestWindow) hits.delete(key)
  }
}, 5 * 60 * 1000).unref()

const rejectIfLimited = (request, response, responseOrigin, bucket) => {
  const retryAfter = rateLimit(bucket, clientIp(request))
  if (!retryAfter) return false
  response.setHeader('Retry-After', String(retryAfter))
  jsonResponse(response, 429, { error: 'Too many requests. Please try again later.' }, responseOrigin)
  return true
}

const jsonResponse = (response, statusCode, body, origin = ALLOWED_ORIGIN) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(body))
}

const readJsonBody = (request) => new Promise((resolve, reject) => {
  let body = ''

  request.on('data', (chunk) => {
    body += chunk
    if (body.length > 64 * 1024) {
      reject(new Error('Payload too large'))
      request.destroy()
    }
  })

  request.on('end', () => {
    try {
      resolve(body ? JSON.parse(body) : {})
    } catch {
      reject(new Error('Invalid JSON'))
    }
  })

  request.on('error', reject)
})

// Validate an intake payload and forward it to the given n8n webhook.
// `channel` tags the lead ('form' or 'chat') so downstream workflows can segment.
const forwardLead = async (request, response, responseOrigin, { webhookUrl, token, channel }) => {
  if (!webhookUrl || !token) {
    jsonResponse(response, 500, { error: 'Consultation proxy is not configured' }, responseOrigin)
    return
  }

  try {
    const payload = await readJsonBody(request)

    // Honeypot: the forms hide a "website" field that only bots fill in. Report
    // success so they don't retry, but never forward the submission.
    if (typeof payload.website === 'string' && payload.website.trim()) {
      console.warn(`Dropped honeypot submission (${channel})`)
      jsonResponse(response, 200, { ok: true }, responseOrigin)
      return
    }

    const email = String(payload.email || '').trim()

    if (!EMAIL_PATTERN.test(email)) {
      jsonResponse(response, 422, { error: 'A valid email address is required' }, responseOrigin)
      return
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...pickLeadFields(payload, channel), email, channel }),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error(`n8n webhook failed (${channel}):`, n8nResponse.status, errorText)
      jsonResponse(response, 502, { error: 'Workflow submission failed' }, responseOrigin)
      return
    }

    jsonResponse(response, 200, { ok: true }, responseOrigin)
  } catch (error) {
    console.error(error)
    jsonResponse(response, 400, { error: error.message || 'Invalid request' }, responseOrigin)
  }
}

// Forward a conversation to the AI assistant workflow and relay its generated
// reply. Unlike forwardLead this passes the model's answer back to the browser.
const forwardAssistant = async (request, response, responseOrigin) => {
  if (!N8N_ASSISTANT_WEBHOOK_URL || !N8N_ASSISTANT_JWT) {
    jsonResponse(response, 503, { error: 'Assistant is not configured' }, responseOrigin)
    return
  }

  try {
    const payload = await readJsonBody(request)

    // Sanitise the conversation before it leaves the proxy: keep only well-formed
    // user/assistant turns, cap history and per-message length, so a malformed or
    // oversized client payload can never reach n8n/Ollama.
    const messages = (Array.isArray(payload.messages) ? payload.messages : [])
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }))

    if (messages.length === 0) {
      jsonResponse(response, 422, { error: 'At least one valid message is required' }, responseOrigin)
      return
    }

    const pageUrl = typeof payload.pageUrl === 'string' ? payload.pageUrl.slice(0, 1000) : 'https://abbadev.com/'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), ASSISTANT_TIMEOUT_MS)

    try {
      const n8nResponse = await fetch(N8N_ASSISTANT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${N8N_ASSISTANT_JWT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, pageUrl, source: 'assistant-chat' }),
        signal: controller.signal,
      })

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text()
        console.error('n8n assistant webhook failed:', n8nResponse.status, errorText)
        jsonResponse(response, n8nResponse.status === 504 ? 504 : 502, { error: 'Assistant workflow failed' }, responseOrigin)
        return
      }

      const data = await n8nResponse.json().catch(() => ({}))
      const reply = typeof data?.reply === 'string' ? data.reply.trim() : ''

      if (!reply) {
        jsonResponse(response, 502, { error: 'Assistant returned an empty reply' }, responseOrigin)
        return
      }

      jsonResponse(response, 200, { reply }, responseOrigin)
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    console.error(error)
    const message = error.name === 'AbortError' ? 'Assistant timed out' : error.message || 'Invalid request'
    jsonResponse(response, error.name === 'AbortError' ? 504 : 400, { error: message }, responseOrigin)
  }
}

const server = http.createServer(async (request, response) => {
  const requestOrigin = request.headers.origin
  const responseOrigin = requestOrigin === ALLOWED_ORIGIN ? requestOrigin : ALLOWED_ORIGIN

  if (request.method === 'GET' && request.url === '/api/health') {
    jsonResponse(response, 200, { ok: true, service: 'abbadev-consultation-proxy' }, responseOrigin)
    return
  }

  if (request.method === 'OPTIONS') {
    jsonResponse(response, 204, {}, responseOrigin)
    return
  }

  if (request.method === 'POST' && request.url === '/api/consultation') {
    if (rejectIfLimited(request, response, responseOrigin, 'form')) return
    await forwardLead(request, response, responseOrigin, { webhookUrl: N8N_WEBHOOK_URL, token: N8N_JWT, channel: 'form' })
    return
  }

  if (request.method === 'POST' && request.url === '/api/chat-lead') {
    if (rejectIfLimited(request, response, responseOrigin, 'chat')) return
    await forwardLead(request, response, responseOrigin, { webhookUrl: N8N_CHAT_WEBHOOK_URL, token: N8N_CHAT_JWT, channel: 'chat' })
    return
  }

  if (request.method === 'POST' && request.url === '/api/event-registration') {
    if (rejectIfLimited(request, response, responseOrigin, 'event')) return
    await forwardLead(request, response, responseOrigin, { webhookUrl: N8N_EVENT_WEBHOOK_URL, token: N8N_EVENT_JWT, channel: 'event' })
    return
  }

  if (request.method === 'POST' && request.url === '/api/assistant') {
    if (rejectIfLimited(request, response, responseOrigin, 'assistant')) return
    await forwardAssistant(request, response, responseOrigin)
    return
  }

  jsonResponse(response, 404, { error: 'Not found' }, responseOrigin)
})

server.listen(PORT, HOST, () => {
  console.log(`ABBADev consultation proxy listening on ${HOST}:${PORT}`)
})
