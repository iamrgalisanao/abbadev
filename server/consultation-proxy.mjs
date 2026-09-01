import http from 'node:http'

const PORT = Number(process.env.PORT || 8787)
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
      body: JSON.stringify({ ...payload, email, channel }),
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
    await forwardLead(request, response, responseOrigin, { webhookUrl: N8N_WEBHOOK_URL, token: N8N_JWT, channel: 'form' })
    return
  }

  if (request.method === 'POST' && request.url === '/api/chat-lead') {
    await forwardLead(request, response, responseOrigin, { webhookUrl: N8N_CHAT_WEBHOOK_URL, token: N8N_CHAT_JWT, channel: 'chat' })
    return
  }

  if (request.method === 'POST' && request.url === '/api/event-registration') {
    await forwardLead(request, response, responseOrigin, { webhookUrl: N8N_EVENT_WEBHOOK_URL, token: N8N_EVENT_JWT, channel: 'event' })
    return
  }

  if (request.method === 'POST' && request.url === '/api/assistant') {
    await forwardAssistant(request, response, responseOrigin)
    return
  }

  jsonResponse(response, 404, { error: 'Not found' }, responseOrigin)
})

server.listen(PORT, () => {
  console.log(`ABBADev consultation proxy listening on port ${PORT}`)
})
