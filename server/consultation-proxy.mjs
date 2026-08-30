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
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://abbadev.com'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const jsonResponse = (response, statusCode, body, origin = ALLOWED_ORIGIN) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
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

  jsonResponse(response, 404, { error: 'Not found' }, responseOrigin)
})

server.listen(PORT, () => {
  console.log(`ABBADev consultation proxy listening on port ${PORT}`)
})
