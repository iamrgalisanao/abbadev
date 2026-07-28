import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Blocks,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Code2,
  Database,
  FileText,
  GitBranch,
  GraduationCap,
  History,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageSquareText,
  Moon,
  Network,
  Play,
  Radar,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Wand2,
  Workflow,
  X,
} from 'lucide-react'
import './App.css'

const platformSurfaces = [
  {
    icon: LayoutDashboard,
    label: 'Command center',
    title: 'Executive workflow visibility',
    copy: 'A practical view of what is moving, what is blocked, and where automation can safely remove drag.',
  },
  {
    icon: Workflow,
    label: 'Automation map',
    title: 'Human, system, and AI handoffs',
    copy: 'Process steps become connected actions with clear ownership, guardrails, and escalation paths.',
  },
  {
    icon: Bot,
    label: 'AI workbench',
    title: 'Useful agents inside real operations',
    copy: 'AI is scoped to intake, analysis, drafting, routing, and review instead of being treated as a magic layer.',
  },
]

const workflowModes = [
  {
    label: 'Human-led',
    title: 'Where judgement stays visible',
    bestFor: 'Strategy, approval, risk calls, stakeholder communication, and context-heavy decisions.',
    deliverable: 'Decision map with roles, policies, and review points',
  },
  {
    label: 'Deterministic',
    title: 'Where software should be predictable',
    bestFor: 'Provisioning, routing, validations, audit trails, reporting, and integrations that must not improvise.',
    deliverable: 'Workflow engine, integration contracts, and monitoring',
  },
  {
    label: 'Agentic',
    title: 'Where AI can safely accelerate work',
    bestFor: 'Summaries, document intake, recommendations, triage support, and draft actions with human checks.',
    deliverable: 'AI-assisted workflow with prompts, evals, and escalation rules',
  },
]

const services = [
  {
    icon: BrainCircuit,
    title: 'AI automation strategy',
    copy: 'Identify the few workflows where AI can reduce busywork without creating operational risk.',
  },
  {
    icon: Network,
    title: 'Enterprise architecture',
    copy: 'Design systems that connect teams, tools, data, and decision points with maintainable boundaries.',
  },
  {
    icon: Code2,
    title: 'Custom software builds',
    copy: 'Ship internal tools, portals, dashboards, workflow apps, and APIs shaped around how the business works.',
  },
  {
    icon: ShieldCheck,
    title: 'Governance and review',
    copy: 'Audit data flow, permissions, prompts, service boundaries, reliability, and security posture before scale.',
  },
]

const caseStudies = [
  {
    icon: Network,
    image: '/images/case-studies/digital-transformation.png',
    imageAlt: 'Blue digital transformation network badge',
    type: 'Digital transformation',
    title: 'Operations command center',
    result: 'A fragmented status process becomes a shared operating view for leaders and delivery teams.',
    problem: 'Leaders depended on scattered updates, manual follow-ups, and late status visibility across active work.',
    approach: 'Mapped the operating rhythm, defined role-based views, and designed a dashboard layer supported by workflow states.',
    automation: 'Rules route status changes, reminders, and exceptions so teams update the system once and leaders see the current picture.',
    governance: 'Role access, audit-friendly status history, and clear ownership keep the operating view useful without exposing unnecessary detail.',
    outcome: 'Executives get a reliable command view while delivery teams spend less time preparing updates.',
    tags: [
      { icon: LayoutDashboard, label: 'Dashboards' },
      { icon: Workflow, label: 'Workflows' },
      { icon: ShieldCheck, label: 'Role access' },
    ],
  },
  {
    icon: FileText,
    badge: Sparkles,
    image: '/images/case-studies/ai-implementation.png',
    imageAlt: 'Blue AI implementation document badge',
    type: 'AI implementation',
    title: 'Document intake assistant',
    result: 'Manual review work becomes structured extraction, validation, exception handling, and traceable handoff.',
    problem: 'Teams manually reviewed incoming documents, copied key details, and lost time checking inconsistent submissions.',
    approach: 'Designed an intake path that separates extraction, validation, review queues, and final handoff.',
    automation: 'AI drafts structured fields and summaries, while deterministic checks catch missing data and route exceptions to people.',
    governance: 'Human review remains visible, every handoff is logged, and AI output is treated as a draft until confirmed.',
    outcome: 'Reviewers focus on exceptions and decisions instead of repetitive document handling.',
    tags: [
      { icon: BrainCircuit, label: 'LLM extraction' },
      { icon: ListChecks, label: 'Review queues' },
      { icon: History, label: 'Audit trail' },
    ],
  },
  {
    icon: Blocks,
    image: '/images/case-studies/solution-architect.png',
    imageAlt: 'Blue solution architecture cube badge',
    type: 'Solution architecture',
    title: 'Integration foundation',
    result: 'Disconnected tools become a stable integration layer that can support future automations.',
    problem: 'Important data lived across disconnected tools, creating duplicate entry, brittle reports, and unclear system ownership.',
    approach: 'Defined integration boundaries, source-of-truth rules, API contracts, and monitoring points before adding automation.',
    automation: 'Scheduled syncs and event-driven updates keep records moving without relying on manual export and import routines.',
    governance: 'Access scopes, retry behavior, observability, and data ownership rules are designed before scale.',
    outcome: 'The business gets a maintainable foundation that can support dashboards, workflow apps, and future AI use cases.',
    tags: [
      { icon: Code2, label: 'APIs' },
      { icon: Database, label: 'Data sync' },
      { icon: Radar, label: 'Monitoring' },
    ],
  },
]

const resources = [
  {
    icon: FileText,
    title: 'Case studies',
    copy: 'Problem, architecture, delivery path, and outcome notes for real implementation stories.',
    href: '#work',
    status: 'live',
  },
  {
    icon: BookOpen,
    title: 'Architecture notes',
    copy: 'Readable explanations of system design, AI workflow choices, and integration tradeoffs.',
    href: '#contact',
    status: 'soon',
  },
  {
    icon: GraduationCap,
    title: 'Training library',
    copy: 'Future lessons, templates, and walkthroughs for teams learning to design better systems.',
    href: '#contact',
    status: 'soon',
  },
  {
    icon: Blocks,
    title: 'Automation examples',
    copy: 'See the live workflow demo running in the hero, then apply the same automation pattern to your own process.',
    href: '#top',
    status: 'live',
  },
]

const consultationSteps = [
  'Clarify the workflow and business outcome',
  'Identify the systems, people, and approval points involved',
  'Return a practical path for automation, architecture, or software delivery',
]

const caseDetailRows = [
  { key: 'problem', label: 'Business problem' },
  { key: 'approach', label: 'Architecture approach' },
  { key: 'automation', label: 'AI and automation role' },
  { key: 'governance', label: 'Governance' },
  { key: 'outcome', label: 'Outcome' },
]

const footerGroups = [
  {
    title: 'Services',
    links: ['AI automation', 'Software architecture', 'Custom systems', 'Technical advisory'],
  },
  {
    title: 'Work',
    links: ['Portfolio', 'Case studies', 'Workflow demos', 'Implementation notes'],
  },
  {
    title: 'Learn',
    links: ['Insights', 'System design', 'AI operations', 'Digital transformation'],
  },
  {
    title: 'ABBADev',
    links: ['About', 'Contact', 'Consulting intake', 'Business solutions'],
  },
]

const sequenceStages = [
  {
    icon: Inbox,
    label: 'Client portal',
    tag: 'webhook / intake',
    idle: 'Intake received',
    active: 'Receiving intake',
    done: 'Intake received',
  },
  {
    icon: ListChecks,
    label: 'Operations',
    tag: 'rules engine',
    idle: 'Rules matched',
    active: 'Matching rules',
    done: 'Rules matched',
  },
  {
    icon: Sparkles,
    label: 'AI review',
    tag: 'LLM / drafting',
    idle: 'Drafting options',
    active: 'Drafting options',
    done: 'Options drafted',
  },
  {
    icon: Database,
    label: 'Data layer',
    tag: 'vector sync',
    idle: 'Records synced',
    active: 'Syncing records',
    done: 'Records synced',
  },
  {
    icon: ShieldCheck,
    label: 'Leadership',
    tag: 'human approval',
    idle: 'Decision ready',
    active: 'Awaiting decision',
    done: 'Decision ready',
  },
]

const workbenchEvents = [
  { icon: History, label: 'Read approval history', atNode: 0 },
  { icon: Shield, label: 'Match risk policy', atNode: 1 },
  { icon: Wand2, label: 'Draft automation path', atNode: 2 },
  { icon: Send, label: 'Route to owner review', atNode: 4 },
]

const SEQUENCE_STEPS = sequenceStages.length
const STAGE_MS = 1500
const HOLD_MS = 1500

function App() {
  const [activeMode, setActiveMode] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedCase, setExpandedCase] = useState(caseStudies[0].title)
  const selectedMode = workflowModes[activeMode]
  const selectedCase = caseStudies.find((study) => study.title === expandedCase) ?? caseStudies[0]

  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    const attr = document.documentElement.getAttribute('data-theme')
    return attr === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem('abba-theme', theme)
    } catch {
      // localStorage unavailable (private browsing, disabled storage) - theme just won't persist
    }
  }, [theme])

  const [leadStatus, setLeadStatus] = useState('idle')
  const [leadMessage, setLeadMessage] = useState('')

  const handleLeadSubmit = async (event) => {
    event.preventDefault()
    if (leadStatus === 'submitting') return

    const endpoint = import.meta.env.VITE_CONSULTATION_ENDPOINT || '/api/consultation'
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://abbadev.com/'

    setLeadStatus('submitting')
    setLeadMessage('')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          source: 'abbadev.com',
          pageUrl,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Consultation brief failed with status ${response.status}`)
      }

      setLeadStatus('submitted')
      setLeadMessage('Thanks. A systems architect will reply within one business day.')
      form.reset()
    } catch (error) {
      console.error(error)
      setLeadStatus('error')
      setLeadMessage('The brief could not be sent right now. Please try again or email ABBADev directly.')
    }
  }

  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [activeIndex, setActiveIndex] = useState(() => (reducedMotion ? 2 : 0))
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(true)
  const stageRef = useRef(null)
  const activeIndexRef = useRef(activeIndex)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const node = stageRef.current
    if (!node || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || hovered || !inView) return undefined
    let cancelled = false
    let timeoutId

    const advance = (current) => {
      setActiveIndex(current)
      const delay = current >= SEQUENCE_STEPS ? HOLD_MS : STAGE_MS
      timeoutId = setTimeout(() => {
        if (cancelled) return
        advance(current >= SEQUENCE_STEPS ? 0 : current + 1)
      }, delay)
    }
    advance(activeIndexRef.current)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [hovered, inView, reducedMotion])

  const sequenceComplete = activeIndex >= SEQUENCE_STEPS
  const currentStage = sequenceStages[Math.min(activeIndex, SEQUENCE_STEPS - 1)]

  return (
    <div className="site-shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="ABBADev Tech Solutions home">
          <span className="brand-mark">A</span>
          <span>
            <strong>ABBADev</strong>
            <small>Tech Solutions</small>
          </span>
        </a>
        <div className="nav-right">
          <button
            className="icon-button theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
          </button>
          <button
            className="icon-button mobile-only"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="#workflow" onClick={() => setMenuOpen(false)}>Workflow</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#resources" onClick={() => setMenuOpen(false)}>Insights</a>
            <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>
              Book a systems consult
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <a className="hero-pill" href="#workflow">
              <Sparkles size={16} aria-hidden="true" />
              Explore the intelligent workflow model
            </a>
            <h1>Systems for work that has outgrown manual effort.</h1>
            <p className="hero-subtitle">
              I help business leaders turn fragmented tools, slow handoffs, and AI experiments into secure software systems that teams can actually operate.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#contact">
                Book a systems consult <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="secondary-button" href="#platform">
                <Play size={17} aria-hidden="true" /> See the operating layer
              </a>
            </div>
          </div>

          <div className="demo-stack">
            <div
              className="product-stage"
              aria-label="ABBADev workflow platform preview"
              ref={stageRef}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
            >
              <div className="stage-header">
                <div className="stage-header-title">
                  <span>ABBADev operating layer</span>
                  <strong>Workflow blueprint</strong>
                  <p className="stage-header-caption">How one request moves from intake to a human decision, without manual chasing.</p>
                </div>
                <div className="stage-status">
                  <span className="stage-status-dot" aria-hidden="true" />
                  <span className="stage-status-text">
                    <strong>{sequenceComplete ? 'Sequence complete' : currentStage.label}</strong>
                    {' / '}
                    {sequenceComplete ? 'routed to owner' : currentStage.active.toLowerCase()}
                  </span>
                </div>
              </div>
              <div className="storyboard">
                {sequenceStages.slice(0, -1).map((_, index) => {
                  const classes = ['story-connector']
                  if (index < activeIndex) classes.push('is-filled')
                  if (index === activeIndex - 1 && !sequenceComplete) classes.push('is-flowing')
                  return (
                    <span
                      key={`connector-${index}`}
                      className={classes.join(' ')}
                      style={{ left: `${(index / SEQUENCE_STEPS) * 100 + 10}%`, width: `${100 / SEQUENCE_STEPS - 10}%` }}
                      aria-hidden="true"
                    />
                  )
                })}
                {sequenceStages.map((stage, index) => {
                  const Icon = stage.icon
                  const state = index < activeIndex ? 'done' : index === activeIndex && !sequenceComplete ? 'active' : 'idle'
                  const detail = state === 'done' ? stage.done : state === 'active' ? stage.active : stage.idle
                  return (
                    <div className={`story-node story-node--${state}`} key={stage.label}>
                      <div className="story-icon-wrap">
                        <span className="story-glow" aria-hidden="true" />
                        <span className="story-icon">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span className="story-status" aria-hidden="true">
                          {state === 'done' && <Check size={9} strokeWidth={3.4} />}
                        </span>
                      </div>
                      <div className="story-meta">
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <em>{stage.tag}</em>
                      </div>
                      <strong>{stage.label}</strong>
                      <small>
                        {detail}
                        {state === 'active' ? '...' : ''}
                      </small>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="workbench-card">
              <div className="workbench-title">
                <MessageSquareText size={20} aria-hidden="true" />
                <span>Live workbench</span>
              </div>
              <p>
                "Which approval steps can be automated without losing control?"
              </p>
              <div className="analysis-stream">
                {workbenchEvents.map((event) => {
                  const EventIcon = event.icon
                  const state = activeIndex > event.atNode || sequenceComplete
                    ? 'done'
                    : activeIndex === event.atNode
                      ? 'running'
                      : 'pending'
                  return (
                    <span className={`stream-row stream-row--${state}`} key={event.label}>
                      <span className="stream-icon-wrap">
                        <span className="stream-icon">
                          <EventIcon size={14} aria-hidden="true" />
                        </span>
                        <span className="stream-status" aria-hidden="true">
                          {state === 'done' && <Check size={7} strokeWidth={3.6} />}
                        </span>
                      </span>
                      {event.label}
                    </span>
                  )
                })}
              </div>
              <small>AI drafts the options. A human owner confirms the path.</small>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Business outcomes">
          <div>
            <strong>Architecture first</strong>
            <span>Blueprints before expensive implementation</span>
          </div>
          <div>
            <strong>AI with guardrails</strong>
            <span>Agents scoped to accountable workflows</span>
          </div>
          <div>
            <strong>Business readable</strong>
            <span>Technical systems explained in plain terms</span>
          </div>
        </section>

        <section className="section platform-section" id="platform">
          <div className="section-heading">
            <h2>Not a portfolio page. A walkthrough of how work becomes a system.</h2>
            <p>
              The website is structured like the consulting process: surface the operating problem, model the work, show the software layer, and route serious visitors toward the right conversation.
            </p>
          </div>
          <div className="surface-layout">
            {platformSurfaces.slice(0, 1).map((surface) => {
              const Icon = surface.icon
              return (
                <article className="surface-card surface-card--primary" key={surface.title}>
                  <div className="card-topline">
                    <Icon size={50} aria-hidden="true" />
                    <span>{surface.label}</span>
                  </div>
                  <h3>{surface.title}</h3>
                  <p>{surface.copy}</p>
                  <div className="surface-signal" aria-hidden="true">
                    <span>Problem</span>
                    <ChevronRight size={16} />
                    <span>Workflow</span>
                    <ChevronRight size={16} />
                    <span>System</span>
                  </div>
                  <ChevronRight size={18} aria-hidden="true" />
                </article>
              )
            })}
            <div className="surface-stack">
              {platformSurfaces.slice(1).map((surface) => {
                const Icon = surface.icon
                return (
                  <article className="surface-card" key={surface.title}>
                    <div className="card-topline">
                      <Icon size={50} aria-hidden="true" />
                      <span>{surface.label}</span>
                    </div>
                    <h3>{surface.title}</h3>
                    <p>{surface.copy}</p>
                    <ChevronRight size={18} aria-hidden="true" />
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section workflow-section" id="workflow">
          <div className="workflow-copy">
            <h2>The future of operations is mixed, not fully automated.</h2>
            <p>
              The strongest systems know which work should stay human-led, which work should be deterministic software, and which work can safely become agentic.
            </p>
            <div className="mode-tabs" role="tablist" aria-label="Workflow modes">
              {workflowModes.map((mode, index) => (
                <button
                  className={activeMode === index ? 'mode-tab active' : 'mode-tab'}
                  key={mode.label}
                  type="button"
                  onClick={() => setActiveMode(index)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mode-board">
            <div className="board-topline">
              <span>{selectedMode.label}</span>
              <Radar size={20} aria-hidden="true" />
            </div>
            <h3>{selectedMode.title}</h3>
            <p>{selectedMode.bestFor}</p>
            <div className="board-output">
              <CheckCircle2 size={19} aria-hidden="true" />
              <span>{selectedMode.deliverable}</span>
            </div>
            <div className="mode-flow">
              <span>Input</span>
              <GitBranch size={18} aria-hidden="true" />
              <span>Policy</span>
              <GitBranch size={18} aria-hidden="true" />
              <span>Action</span>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="section-heading compact">
            <h2>Consulting that turns into working software.</h2>
          </div>
          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <article className="service-card" key={service.title}>
                  <div className="service-topline">
                    <Icon size={50} aria-hidden="true" />
                    <span>{service.title}</span>
                  </div>
                  
                  <p>{service.copy}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="section work-section" id="work">
          <div className="work-heading-row">
            <div className="section-heading">
              <span className="kicker">Proof library</span>
              <h2>Case studies built for both executives and technical reviewers.</h2>
              <p>
                Each case study shows the business problem, architecture,
                implementation path, governance choices, and lessons learned
                without hiding behind jargon.
              </p>
            </div>

            <div className="work-motif">
              <picture>
                <source srcSet="/images/case-studies/ai-connection.webp" type="image/webp" />
                <img
                  src="/images/case-studies/ai-connection.png"
                  alt="Isometric illustration of connected documents, an AI processor, and a data dashboard"
                  width={900}
                  height={600}
                  loading="lazy"
                />
              </picture>
            </div>
          </div>
          <div className="case-grid">
            {caseStudies.map((study) => {
              const expanded = expandedCase === study.title
              return (
                <article className={expanded ? 'case-card case-card--expanded' : 'case-card'} key={study.title}>
                  <div className="case-card-head">
                    <div className="case-image-wrap">
                      <img src={study.image} alt={study.imageAlt} loading="lazy" />
                    </div>
                    <div className="case-title-block">
                      <span>{study.type}</span>
                      <h3>{study.title}</h3>
                    </div>
                  </div>
                  <p>{study.result}</p>

                  <div className="case-card-footer">
                    <div className="tag-list">
                      {study.tags.map((tag) => {
                        const TagIcon = tag.icon
                        return (
                          <small key={tag.label}>
                            <TagIcon size={14} aria-hidden="true" />
                            {tag.label}
                          </small>
                        )
                      })}
                    </div>
                    <button
                      className="case-toggle"
                      type="button"
                      aria-pressed={expanded}
                      aria-controls="case-detail-panel"
                      onClick={() => setExpandedCase(study.title)}
                    >
                      {expanded ? 'Selected case' : 'Review case detail'}
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
          <article className="case-detail-panel" id="case-detail-panel" aria-live="polite">
            <div className="case-detail-panel-head">
              <span>{selectedCase.type}</span>
              <h3>{selectedCase.title}</h3>
              <p>{selectedCase.result}</p>
            </div>
            <div className="case-detail-grid">
              {caseDetailRows.map((row) => (
                <div className="case-detail-row" key={row.key}>
                  <span>{row.label}</span>
                  <p>{selectedCase[row.key]}</p>
                </div>
              ))}
            </div>
          </article>
          <p className="work-trust">
            <ShieldCheck size={22} aria-hidden="true" />
            <strong>Real outcomes.</strong>
            <span className="accent">Clear architecture.</span>
            <strong>Measurable impact.</strong>
            <span className="accent">Every time.</span>
          </p>
        </section>

        <section className="mid-cta" aria-label="Start a project">
          <div className="mid-cta-copy">
            <strong>Recognize this pattern in your own operations?</strong>
            <span>Bring the workflow that costs you the most time. We will map the system around it.</span>
          </div>
          <a className="primary-button" href="#contact">
            Book a systems consult <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>

        <section className="section resource-section" id="resources">
          <div className="resource-lead">
            <h2>Authority compounds when the site teaches.</h2>
            <p>
              Beyond lead generation, this becomes the home for articles, templates, automation examples, training paths, and practical systems thinking.
            </p>
          </div>
          <div className="resource-grid">
            {resources.map((resource) => {
              const Icon = resource.icon
              const soon = resource.status === 'soon'
              return (
                <a
                  className={soon ? 'resource-card resource-card--soon' : 'resource-card'}
                  href={resource.href}
                  key={resource.title}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>
                    <span className="resource-card-title">
                      <strong>{resource.title}</strong>
                      {soon && <em className="resource-card-tag">Coming soon</em>}
                    </span>
                    <small>{soon ? 'Get notified when this publishes.' : resource.copy}</small>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <span className="contact-label">Systems Consultation Brief</span>
            <h2>Bring one workflow that matters. We will model the system around it.</h2>
            <p>
              A useful first conversation starts with the process, the people involved, the tools in play, and what better operations would make possible.
            </p>
            <div className="consult-brief">
              <strong>What this brief helps clarify</strong>
              <ul>
                {consultationSteps.map((step) => (
                  <li key={step}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <form className="lead-form" onSubmit={handleLeadSubmit}>
            <div className="form-grid">
              <label>
                Name
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                />
              </label>
              <label>
                Company
                <input
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Company or organization"
                />
              </label>
              <label>
                Preferred contact
                <select name="preferredContact" defaultValue="Email">
                  <option>Email</option>
                  <option>Phone</option>
                  <option>Video call</option>
                </select>
              </label>
            </div>
            <div className="form-grid">
              <label>
                Work focus
                <select name="workFocus" defaultValue="AI automation">
                  <option>AI automation</option>
                  <option>Custom software</option>
                  <option>Architecture review</option>
                  <option>Digital transformation</option>
                </select>
              </label>
              <label>
                Company stage
                <select name="companyStage" defaultValue="Growing business">
                  <option>Growing business</option>
                  <option>Startup</option>
                  <option>Enterprise team</option>
                  <option>Public sector or nonprofit</option>
                </select>
              </label>
              <label>
                Current tools
                <input
                  name="currentTools"
                  type="text"
                  placeholder="ERP, spreadsheets, CRM, portals, email, n8n..."
                />
              </label>
              <label>
                Urgency
                <select name="urgency" defaultValue="This quarter">
                  <option>This month</option>
                  <option>This quarter</option>
                  <option>Planning phase</option>
                  <option>Exploring options</option>
                </select>
              </label>
            </div>
            <label className="full-field">
              Workflow challenge
              <textarea
                name="challenge"
                required
                placeholder="Describe the workflow, bottleneck, decision point, or system you want to improve."
              />
            </label>
            <div className="form-grid">
              <label>
                Preferred engagement
                <select name="engagement" defaultValue="Consultation and roadmap">
                  <option>Consultation and roadmap</option>
                  <option>Architecture review</option>
                  <option>Prototype or proof of concept</option>
                  <option>Full software build</option>
                </select>
              </label>
              <label>
                Budget range
                <select name="budget" defaultValue="To be scoped">
                  <option>To be scoped</option>
                  <option>Under $5k</option>
                  <option>$5k to $15k</option>
                  <option>$15k to $50k</option>
                  <option>$50k+</option>
                </select>
              </label>
            </div>
            <button className="primary-button" type="submit" disabled={leadStatus === 'submitting'}>
              {leadStatus === 'submitted' ? (
                <>
                  Brief sent <CheckCircle2 size={18} aria-hidden="true" />
                </>
              ) : leadStatus === 'submitting' ? (
                <>
                  Preparing brief... <CircleDot size={18} aria-hidden="true" />
                </>
              ) : (
                <>
                  Prepare consultation brief <CircleDot size={18} aria-hidden="true" />
                </>
              )}
            </button>
            {leadMessage && (
              <p
                className={leadStatus === 'error' ? 'lead-form-feedback lead-form-feedback--error' : 'lead-form-feedback'}
                role={leadStatus === 'error' ? 'alert' : 'status'}
              >
                {leadMessage}
              </p>
            )}
            <small className="form-note">
              This prepares the conversation. It does not create a commitment or publish your details.
            </small>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-statement">
          <strong>Built by business context, powered by software architecture.</strong>
          <span>ABBADev Tech Solutions designs intelligent systems for work that needs clarity, speed, and control.</span>
        </div>
        <div className="footer-index">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <a href="#contact" key={link}>{link}</a>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default App
