import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Bot, Send, Sparkles, X } from 'lucide-react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LOG_KEY = 'abba-chat-log'
const OPEN_KEY = 'abba-chat-open'
const MAX_LOG = 40

// Per-load prefix so ids minted this session can never collide with ids from a
// persisted transcript restored on reload - both counters otherwise restart at 1.
const SESSION_ID = Math.random().toString(36).slice(2, 9)
let messageSeq = 0
const nextId = () => {
  messageSeq += 1
  return `m-${SESSION_ID}-${messageSeq}`
}

// Curated, guardrailed knowledge base. Deterministic intent matching keeps the
// assistant scoped to what ABBADev actually offers - the same "AI with guardrails"
// thesis the site argues for.
const STARTERS = [
  { label: 'Services', intent: 'services' },
  { label: 'See proof', intent: 'proof' },
  { label: 'How you use AI', intent: 'ai' },
  { label: 'Book a consult', intent: 'lead' },
]

const CONSULT_CHIP = { label: 'Book a consult', intent: 'lead' }

const INTENTS = [
  {
    id: 'services',
    keywords: ['service', 'offer', 'do you do', 'what do you', 'help with', 'capabilit'],
    reply:
      'ABBADev focuses on four things: AI automation strategy, enterprise architecture, custom software builds, and governance & review. Each one is scoped around a real workflow, not a generic tech project.',
    chips: [
      { label: 'AI automation', intent: 'ai' },
      { label: 'Custom software', intent: 'custom' },
      { label: 'Architecture', intent: 'architecture' },
      CONSULT_CHIP,
    ],
  },
  {
    id: 'ai',
    keywords: ['ai ', ' ai', 'automation', 'agent', 'llm', 'gpt', 'n8n', 'chatbot', 'bot'],
    reply:
      'AI is scoped to accountable steps - intake, analysis, drafting, routing, and review - with deterministic rules and a human owner confirming the path. This assistant is itself an example: it qualifies your request and routes it into an n8n workflow.',
    chips: [
      { label: 'See a workflow demo', intent: 'demo' },
      CONSULT_CHIP,
    ],
  },
  {
    id: 'architecture',
    keywords: ['architect', 'integration', 'system design', 'boundaries', 'api', 'moderniz'],
    reply:
      'Architecture work defines system boundaries, data flow, source-of-truth rules, and a governance model before implementation cost compounds - so integrations and automations have a stable foundation.',
    chips: [{ label: 'See proof', intent: 'proof' }, CONSULT_CHIP],
  },
  {
    id: 'custom',
    keywords: ['custom', 'build', 'app', 'portal', 'dashboard', 'internal tool', 'software'],
    reply:
      'Custom builds are internal tools, portals, dashboards, APIs, and workflow apps shaped around how the business actually operates - discovery, prototype, implementation, then a documented handoff.',
    chips: [{ label: 'See proof', intent: 'proof' }, CONSULT_CHIP],
  },
  {
    id: 'proof',
    keywords: ['proof', 'case', 'example', 'portfolio', 'work', 'result', 'reference'],
    reply:
      'Three representative case studies: a transaction intake command center, a document intake assistant, and an integration foundation - each shows the problem, approach, implementation path, governance, and measurable before/after.',
    chips: [
      { label: 'Open case studies', href: '/cases' },
      CONSULT_CHIP,
    ],
  },
  {
    id: 'demo',
    keywords: ['demo', 'show me', 'workflow demo', 'live'],
    reply:
      'The homepage hero runs a live workflow blueprint - intake to rules to AI drafting to data sync to a human approval. The workflow-demos page walks through more of these.',
    chips: [
      { label: 'Open workflow demos', href: '/workflow-demos' },
      CONSULT_CHIP,
    ],
  },
  {
    id: 'process',
    keywords: ['process', 'how does it work', 'how do you work', 'steps', 'engagement', 'timeline', 'start'],
    reply:
      'A useful first conversation clarifies the workflow and outcome, identifies the systems, people, and approval points, then returns a practical path for automation, architecture, or a software build.',
    chips: [CONSULT_CHIP],
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'budget', 'how much', 'rate', 'fee', 'quote'],
    reply:
      'Engagements are scoped per workflow rather than sold as a fixed package - typical ranges run from a small advisory scope to $50k+ for full builds. The fastest way to a real number is a short consultation brief.',
    chips: [CONSULT_CHIP],
  },
  {
    id: 'about',
    keywords: ['who', 'about', 'founder', 'rommel', 'team', 'you are', 'behind'],
    reply:
      'ABBADev Tech Solutions is led by Rommel Galisanao - combining software architecture, AI automation, project leadership, and business-process analysis, with accountability kept human at every step.',
    chips: [
      { label: 'About ABBADev', href: '/about' },
      CONSULT_CHIP,
    ],
  },
  {
    id: 'contact',
    keywords: ['contact', 'talk', 'human', 'email', 'reach', 'call', 'consult', 'book', 'meeting', 'speak'],
    reply:
      'Happy to route you to a real conversation. I can prepare a short consultation brief right here and send it into the ABBADev intake workflow.',
    chips: [CONSULT_CHIP],
  },
]

const FALLBACK = {
  reply:
    "I can help with services, proof of past work, how AI is used, pricing, or booking a consult. Which of those is closest to what you need?",
  chips: STARTERS,
}

function matchIntent(text) {
  const normalized = ` ${text.toLowerCase().trim()} `
  for (const intent of INTENTS) {
    if (intent.keywords.some((kw) => normalized.includes(kw))) {
      return intent
    }
  }
  return null
}

export default function Assistant() {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const greeting = useMemo(
    () => ({
      id: 'greeting',
      role: 'bot',
      text: "Hi, I'm the ABBADev assistant. I can explain the services, point you to proof, or prepare a consultation brief and route it into the automation workflow. What brings you here?",
      chips: STARTERS,
    }),
    [],
  )

  const [open, setOpen] = useState(() => {
    try {
      return window.localStorage.getItem(OPEN_KEY) === '1'
    } catch {
      return false
    }
  })

  const [messages, setMessages] = useState(() => {
    try {
      const stored = window.localStorage.getItem(LOG_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length) return parsed
      }
    } catch {
      // ignore unreadable storage
    }
    return [greeting]
  })

  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [flow, setFlow] = useState(null) // null | 'challenge' | 'email' | 'submitting' | 'done'
  const leadRef = useRef({ challenge: '', email: '' })

  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(OPEN_KEY, open ? '1' : '0')
    } catch {
      // storage unavailable - preference just won't persist
    }
  }, [open])

  useEffect(() => {
    try {
      window.localStorage.setItem(LOG_KEY, JSON.stringify(messages.slice(-MAX_LOG)))
    } catch {
      // storage unavailable - transcript just won't persist
    }
  }, [messages])

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, typing, open])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const pushUser = (text) => {
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }])
  }

  const pushBot = (payload, delay = reducedMotion ? 0 : 460) => {
    if (delay === 0) {
      setMessages((prev) => [...prev, { id: nextId(), role: 'bot', ...payload }])
      return
    }
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { id: nextId(), role: 'bot', ...payload }])
    }, delay)
    timers.current.push(t)
  }

  const startLeadFlow = () => {
    setFlow('challenge')
    pushBot({
      text: 'Great - two quick questions and I will route this for you. First: which workflow is costing you the most time right now?',
    })
  }

  const submitLead = async () => {
    setFlow('submitting')
    pushBot({ text: 'Preparing your brief and routing it into the intake workflow...', chips: undefined }, 0)

    const endpoint = import.meta.env.VITE_CHAT_LEAD_ENDPOINT || '/api/chat-lead'
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://abbadev.com/'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Assistant chat visitor',
          email: leadRef.current.email,
          challenge: leadRef.current.challenge,
          workFocus: 'AI automation',
          engagement: 'Consultation and roadmap',
          source: 'assistant-chat',
          pageUrl,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error(`Chat lead failed with status ${response.status}`)

      setFlow('done')
      pushBot({
        text: 'Sent. A systems architect will reply within one business day. Anything else I can point you to?',
        chips: [
          { label: 'See proof', intent: 'proof' },
          { label: 'Services', intent: 'services' },
        ],
      })
    } catch (error) {
      console.error(error)
      setFlow('done')
      pushBot({
        text: 'I could not send that automatically right now. You can use the consultation form directly and it will route the same way.',
        chips: [{ label: 'Open consultation form', href: '/#contact' }],
      })
    }
  }

  const handleFlowInput = (text) => {
    if (flow === 'challenge') {
      leadRef.current.challenge = text
      setFlow('email')
      pushBot({ text: 'Got it. What is the best email for a systems architect to reply to?' })
      return
    }
    if (flow === 'email') {
      const email = text.trim()
      if (!EMAIL_PATTERN.test(email)) {
        pushBot({ text: 'That does not look like a valid email. Please enter one like name@company.com.' })
        return
      }
      leadRef.current.email = email
      submitLead()
    }
  }

  const runIntent = (intent) => {
    if (intent === 'lead') {
      startLeadFlow()
      return
    }
    const found = INTENTS.find((item) => item.id === intent)
    if (found) {
      pushBot({ text: found.reply, chips: found.chips })
    } else {
      pushBot(FALLBACK)
    }
  }

  const handleChip = (chip) => {
    if (chip.href) {
      window.location.assign(chip.href)
      return
    }
    pushUser(chip.label)
    runIntent(chip.intent)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || typing || flow === 'submitting') return
    setInput('')
    pushUser(text)

    if (flow === 'challenge' || flow === 'email') {
      handleFlowInput(text)
      return
    }

    const intent = matchIntent(text)
    if (intent) {
      pushBot({ text: intent.reply, chips: intent.chips })
    } else {
      pushBot(FALLBACK)
    }
  }

  const resetChat = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setTyping(false)
    setFlow(null)
    leadRef.current = { challenge: '', email: '' }
    setMessages([greeting])
  }

  const lastMessage = messages[messages.length - 1]
  const activeChips = !typing && lastMessage?.role === 'bot' ? lastMessage.chips : null

  return (
    <div className={`assistant${reducedMotion ? ' assistant--reduced' : ''}`}>
      {open && (
        <section
          className="assistant-panel"
          role="dialog"
          aria-label="ABBADev assistant"
          aria-modal="false"
          ref={panelRef}
        >
          <header className="assistant-head">
            <span className="assistant-avatar" aria-hidden="true">
              <Bot size={18} />
            </span>
            <span className="assistant-head-text">
              <strong>ABBADev assistant</strong>
              <small>Guided intake, routed to a human</small>
            </span>
            <button className="assistant-icon-btn" type="button" onClick={resetChat} aria-label="Restart conversation">
              <RotateccwSafe />
            </button>
            <button className="assistant-icon-btn" type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              <X size={18} />
            </button>
          </header>

          <div className="assistant-log" ref={scrollRef} role="log" aria-live="polite" aria-atomic="false">
            {messages.map((message) => (
              <div className={`assistant-msg assistant-msg--${message.role}`} key={message.id}>
                {message.role === 'bot' && (
                  <span className="assistant-msg-avatar" aria-hidden="true">
                    <Sparkles size={13} />
                  </span>
                )}
                <div className="assistant-bubble">{message.text}</div>
              </div>
            ))}

            {typing && (
              <div className="assistant-msg assistant-msg--bot">
                <span className="assistant-msg-avatar" aria-hidden="true">
                  <Sparkles size={13} />
                </span>
                <div className="assistant-bubble assistant-typing" aria-label="Assistant is typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {activeChips && activeChips.length > 0 && (
              <div className="assistant-chips">
                {activeChips.map((chip) => (
                  <button
                    className="assistant-chip"
                    type="button"
                    key={chip.label}
                    onClick={() => handleChip(chip)}
                  >
                    {chip.label}
                    {chip.href && <ArrowRight size={13} aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="assistant-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                flow === 'email'
                  ? 'name@company.com'
                  : flow === 'challenge'
                    ? 'Describe the workflow...'
                    : 'Ask about services, proof, or pricing...'
              }
              aria-label="Message the assistant"
              autoComplete={flow === 'email' ? 'email' : 'off'}
              disabled={flow === 'submitting'}
            />
            <button
              className="assistant-send"
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || typing || flow === 'submitting'}
            >
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
          <p className="assistant-note">Guided assistant - it routes you to the right next step, no data is published.</p>
        </section>
      )}

      <button
        className="assistant-launcher"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close assistant' : 'Open ABBADev assistant'}
        aria-expanded={open}
      >
        {open ? <X size={22} aria-hidden="true" /> : <Bot size={22} aria-hidden="true" />}
        {!open && <span className="assistant-launcher-pulse" aria-hidden="true" />}
      </button>
    </div>
  )
}

// lucide-react has no "RotateCcw" in the pinned build under a predictable name here,
// so use a tiny inline restart glyph to avoid an import mismatch.
function RotateccwSafe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}
