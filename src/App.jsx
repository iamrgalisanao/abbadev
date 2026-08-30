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
import Assistant from './Assistant'
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
    type: 'Transaction operations',
    code: '001 / Transaction operations',
    slug: 'operations-command-center',
    title: 'Transaction intake command center',
    result: 'A fragmented POS submission process becomes a governed transaction pipeline for tenant, terminal, finance, and operations teams.',
    metric: {
      label: 'Submission traceability',
      before: 'Manual lookup',
      after: 'Status endpoints',
      note: 'Accepted, rejected, queued, and stuck submissions become visible to support teams.',
    },
    metrics: [
      { label: 'Submission traceability', before: 'Scattered logs', after: 'Status endpoints', note: 'Submission UUIDs, intake IDs, correlation IDs, and status views support triage.' },
      { label: 'Payload integrity', before: 'Provider debugging', after: 'Checksum diagnostics', note: 'Deterministic validation makes malformed or mismatched payloads easier to explain.' },
      { label: 'Queue resilience', before: 'Coupled intake', after: 'Backpressure protection', note: 'Accepted submissions move through queue processing without destabilizing intake.' },
    ],
    client: 'Anonymized commercial operations group',
    sector: 'Multi-tenant retail / transportation commercial operations',
    duration: '8-12 weeks, phased',
    stack: 'Laravel 11 - Sanctum - MySQL - Redis - Horizon - React/Vite',
    meta: [
      ['Audience', 'Finance, commercial, operations, and provider support'],
      ['System type', 'Governed POS transaction intake pipeline'],
      ['Primary value', 'Auditable transaction status and exception handling'],
      ['Governance', 'Token abilities, terminal ownership, license boundaries'],
    ],
    problem: 'POS submissions arrived with inconsistent shapes, checksum mismatches, duplicate receipts, tenant-terminal drift, and downstream timing issues.',
    problems: [
      'POS providers submitted sales data in inconsistent shapes, with checksum mismatches, duplicate receipts, tenant-terminal drift, and timing issues appearing only after downstream processing.',
      'Operations teams needed a way to accept high-volume submissions without letting malformed payloads, retry storms, or overloaded queues destabilize the system.',
      'Finance and commercial users needed trustworthy transaction status, audit history, and reporting inputs, not disconnected logs or manual spreadsheet reconciliation.',
    ],
    approach: 'Separated transaction intake from transaction processing, then made validation, token boundaries, queue behavior, and observability explicit.',
    approaches: [
      'Separate transaction intake from transaction processing so the API can quickly validate, acknowledge, queue, and trace submissions.',
      'Make integrity checks explicit: validate structure first, then enforce deterministic SHA-256 checksum rules before accepting the payload.',
      'Use token abilities, terminal identity, tenant ownership, rate limits, and license validation as system boundaries rather than optional administrative checks.',
      'Add observability endpoints for intake counts, rejected submissions, processing lag, tenant activity, diagnostic events, and duplicate receipts.',
    ],
    automation: 'Accepted submissions move through Horizon-backed processing jobs with backpressure checks, tenant-aware sharding, and diagnostic event visibility.',
    governance: 'Role-based access separates admin, manager, finance, commercial, and provider support capabilities while terminal tokens use Sanctum abilities and throttled paths.',
    outcome: 'Provider support and operations teams can see whether a transaction was accepted, rejected, queued, quarantined, duplicated, failed, or stuck.',
    phases: [
      ['Intake gate', 'Validated submission UUIDs, timestamps, checksum shape, transaction UUIDs, and receipt numbers before persistence.'],
      ['Integrity layer', 'Added payload canonicalization and checksum verification for single and multi-transaction payloads.'],
      ['Queue operating model', 'Queued accepted submissions through Horizon-backed jobs with backpressure checks and tenant-aware routing.'],
      ['Status and support views', 'Exposed authenticated status, lookup, event, incident, and observability endpoints for support triage.'],
      ['Exception handling', 'Added duplicate receipt monitoring, quarantine visibility, retry history, failed-job management, and callbacks.'],
    ],
    quote: 'The system gave us one place to see whether a transaction was accepted, rejected, queued, or stuck. That changed support from guessing to triage.',
    quoteBy: 'Anonymized operations/support lead',
    tags: [
      { icon: Database, label: 'Transaction intake' },
      { icon: ShieldCheck, label: 'Checksum validation' },
      { icon: Radar, label: 'Queue observability' },
    ],
  },
  {
    icon: FileText,
    badge: Sparkles,
    image: '/images/case-studies/ai-implementation.png',
    imageAlt: 'Blue AI implementation document badge',
    type: 'AI implementation',
    code: '002 / Intake',
    slug: 'document-intake-assistant',
    title: 'Document intake assistant',
    result: 'Manual review work becomes structured extraction, validation, exception handling, and traceable handoff.',
    metric: {
      label: 'Manual review load',
      before: '100%',
      after: 'Exception-only',
      note: 'AI drafts structured fields while people keep control of low-confidence cases.',
    },
    metrics: [
      { label: 'Manual review load', before: '100%', after: 'Exception-only', note: 'Reviewers focus on judgment, not repeated extraction.' },
      { label: 'Field capture', before: 'Manual', after: 'Drafted', note: 'AI prepares structured data for validation.' },
      { label: 'Handoff traceability', before: 'Partial', after: 'Logged', note: 'Each exception and approval remains visible.' },
    ],
    client: 'Anonymized review operation',
    sector: 'Document-heavy operations',
    duration: '6 weeks',
    stack: 'LLM extraction - Review queues - Audit log',
    meta: [
      ['Audience', 'Operations and review teams'],
      ['System type', 'AI-assisted intake workflow'],
      ['Primary value', 'Less repetitive review work'],
      ['Governance', 'Human approval for exceptions'],
    ],
    problem: 'Teams manually reviewed incoming documents, copied key details, and lost time checking inconsistent submissions.',
    problems: [
      'Teams manually reviewed incoming documents, copied key details, and lost time checking inconsistent submissions.',
      'Different document formats made routine intake work difficult to standardize.',
      'Low-confidence cases were mixed with simple work, slowing down the whole review queue.',
    ],
    approach: 'Designed an intake path that separates extraction, validation, review queues, and final handoff.',
    approaches: [
      'Separated document extraction, deterministic validation, human review, and final handoff.',
      'Treated AI output as a draft until confidence checks and reviewers confirmed it.',
      'Created exception queues so people handled risk and ambiguity instead of every document.',
    ],
    automation: 'AI drafts structured fields and summaries, while deterministic checks catch missing data and route exceptions to people.',
    governance: 'Human review remains visible, every handoff is logged, and AI output is treated as a draft until confirmed.',
    outcome: 'Reviewers focus on exceptions and decisions instead of repetitive document handling.',
    phases: [
      ['Document surface', 'Grouped incoming files by type, source, required fields, and review risk.'],
      ['Extraction path', 'Separated AI drafting from deterministic validation and human approval queues.'],
      ['Traceable handoff', 'Logged every decision so the system can be audited and improved over time.'],
    ],
    quote: 'The value was not just extraction. It was knowing exactly which cases needed a person.',
    quoteBy: 'Anonymized review manager',
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
    code: '003 / Architecture',
    slug: 'integration-foundation',
    title: 'Integration foundation',
    result: 'Disconnected tools become a stable integration layer that can support future automations.',
    metric: {
      label: 'Duplicate entry',
      before: '3 systems',
      after: '1 source',
      note: 'A stable integration layer reduces copy-paste work and future automation risk.',
    },
    metrics: [
      { label: 'Duplicate entry', before: '3 systems', after: '1 source', note: 'The operating record has a clearer place to live.' },
      { label: 'Integration ownership', before: 'Unclear', after: 'Defined', note: 'Boundaries and source-of-truth rules are explicit.' },
      { label: 'Automation readiness', before: 'Brittle', after: 'Stable', note: 'Future workflows can build on reliable data movement.' },
    ],
    client: 'Anonymized systems team',
    sector: 'Multi-tool operations',
    duration: '10 weeks',
    stack: 'APIs - Sync jobs - Monitoring',
    meta: [
      ['Audience', 'CTOs, IT leads, operators'],
      ['System type', 'Integration and API foundation'],
      ['Primary value', 'Reliable data movement'],
      ['Governance', 'Source-of-truth rules and monitoring'],
    ],
    problem: 'Important data lived across disconnected tools, creating duplicate entry, brittle reports, and unclear system ownership.',
    problems: [
      'Important data lived across disconnected tools, creating duplicate entry, brittle reports, and unclear system ownership.',
      'Teams relied on manual exports and imports to keep systems aligned.',
      'Automation was risky because source-of-truth rules were not documented.',
    ],
    approach: 'Defined integration boundaries, source-of-truth rules, API contracts, and monitoring points before adding automation.',
    approaches: [
      'Defined integration boundaries and ownership before connecting systems.',
      'Established source-of-truth rules, sync direction, retry behavior, and monitoring points.',
      'Kept the first release focused on stable data movement rather than broad automation.',
    ],
    automation: 'Scheduled syncs and event-driven updates keep records moving without relying on manual export and import routines.',
    governance: 'Access scopes, retry behavior, observability, and data ownership rules are designed before scale.',
    outcome: 'The business gets a maintainable foundation that can support dashboards, workflow apps, and future AI use cases.',
    phases: [
      ['System inventory', 'Mapped source systems, ownership, data quality issues, and integration boundaries.'],
      ['Contract design', 'Defined API contracts, sync rules, retry behavior, and monitoring expectations.'],
      ['Automation-ready layer', 'Prepared the foundation for dashboards, workflow apps, and AI-assisted processes.'],
    ],
    quote: 'The biggest win was not another integration. It was finally agreeing where the business logic belongs.',
    quoteBy: 'Anonymized systems owner',
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
    href: '/cases',
    status: 'live',
  },
  {
    icon: BookOpen,
    title: 'Architecture notes',
    copy: 'Readable explanations of system design, AI workflow choices, and integration tradeoffs.',
    href: '/implementation-notes',
    status: 'live',
  },
  {
    icon: GraduationCap,
    title: 'Training library',
    copy: 'Future lessons, templates, and walkthroughs for teams learning to design better systems.',
    href: '/insights',
    status: 'soon',
  },
  {
    icon: Blocks,
    title: 'Automation examples',
    copy: 'See the live workflow demo running in the hero, then apply the same automation pattern to your own process.',
    href: '/workflow-demos',
    status: 'live',
  },
]

const consultationSteps = [
  'Clarify the workflow and business outcome',
  'Identify the systems, people, and approval points involved',
  'Return a practical path for automation, architecture, or software delivery',
]

const contentPages = {
  '/services/ai-automation': {
    icon: BrainCircuit,
    label: 'Services',
    title: 'AI automation',
    intro: 'Use AI where it can reduce operating drag without removing human judgment, auditability, or ownership.',
    priority: 'P1 service page',
    goal: 'Convert leaders with repetitive intake, routing, review, and reporting work into a scoped automation consultation.',
    blocks: [
      ['Workflow fit review', 'Identify where AI should draft, summarize, classify, or route work, and where deterministic rules or human approval should stay in control.'],
      ['Automation blueprint', 'Map triggers, systems, owners, exception paths, and review checkpoints before tools are connected.'],
      ['n8n implementation path', 'Turn the approved workflow into webhooks, validation rules, notifications, Notion or CRM updates, and email handoffs.'],
      ['Governance and monitoring', 'Define failure handling, retry behavior, data visibility, prompt boundaries, and audit notes.'],
    ],
    proof: ['Live consultation workflow connected to n8n', 'Before and after process metrics', 'Screenshots of sanitized workflow runs', 'Exception handling examples'],
    visuals: ['Workflow node map', 'Before and after handoff diagram', 'Automation control panel', 'AI review queue illustration'],
    seo: 'AI automation consulting, n8n automation consultant, business workflow automation, AI workflow automation for operations',
    examples: ['Lead intake qualification', 'Document review triage', 'Status update routing', 'Executive summary generation'],
    cta: 'Map an automation opportunity',
    ctaHref: '/consulting-intake',
  },
  '/services/software-architecture': {
    icon: Network,
    label: 'Services',
    title: 'Software architecture',
    intro: 'Design the system boundaries, data flow, and governance model before implementation cost compounds.',
    priority: 'P1 service page',
    goal: 'Position ABBADev as the architecture partner for teams planning integrations, modernization, and custom platforms.',
    blocks: [
      ['Architecture review', 'Assess current systems, data movement, user roles, pain points, and failure modes.'],
      ['Target operating model', 'Translate business process into system responsibilities, ownership boundaries, and delivery phases.'],
      ['Integration strategy', 'Define APIs, sync direction, source of truth rules, retries, and observability before automation expands.'],
      ['Delivery governance', 'Create review checkpoints for access, reliability, maintainability, and release risk.'],
    ],
    proof: ['Architecture diagrams', 'Case study implementation paths', 'Risk decision logs', 'Stack and boundary examples'],
    visuals: ['Layered system diagram', 'Integration contract map', 'Governance checklist', 'Service boundary cards'],
    seo: 'software architecture consultant, enterprise software architecture, system design consulting, application modernization architecture',
    examples: ['API foundation', 'Multi-tenant workflow platform', 'Reporting data layer', 'Legacy tool modernization'],
    cta: 'Review a system architecture',
    ctaHref: '/consulting-intake',
  },
  '/services/custom-systems': {
    icon: Code2,
    label: 'Services',
    title: 'Custom systems',
    intro: 'Build internal tools, portals, dashboards, APIs, and workflow systems around the way the business actually operates.',
    priority: 'P1 service page',
    goal: 'Explain custom software delivery as a practical business operating layer, not a generic development service.',
    blocks: [
      ['Discovery and scope', 'Clarify users, workflows, reports, permissions, integrations, and measurable outcomes.'],
      ['Prototype and validation', 'Create enough of the product surface to confirm the workflow before the build expands.'],
      ['Implementation', 'Deliver the application, database, integrations, queues, roles, and operational views.'],
      ['Handoff and support', 'Document the system, train users, and establish maintenance expectations.'],
    ],
    proof: ['Representative product screens', 'Case study metrics', 'Implementation notes', 'Operational handoff documents'],
    visuals: ['Portal screens', 'Dashboard layouts', 'Data model snapshots', 'Workflow status views'],
    seo: 'custom software development, custom web application development, business software solutions, internal tools development',
    examples: ['Client portals', 'Operations dashboards', 'Workflow applications', 'Reporting systems'],
    cta: 'Scope a custom system',
    ctaHref: '/consulting-intake',
  },
  '/services/technical-advisory': {
    icon: ShieldCheck,
    label: 'Services',
    title: 'Technical advisory',
    intro: 'Get senior technical guidance before committing budget, vendor effort, or internal team capacity.',
    priority: 'P2 service page',
    goal: 'Offer a lower-friction advisory path for teams that need clarity before a full software or automation engagement.',
    blocks: [
      ['Roadmap session', 'Turn a business problem into a practical sequence of architecture, automation, and delivery decisions.'],
      ['Vendor and tool review', 'Evaluate whether a platform, integration, or AI tool fits the operating context.'],
      ['Risk review', 'Identify security, data, reliability, access, and maintenance risks before implementation.'],
      ['Team enablement', 'Help leaders and teams understand the system design choices in plain language.'],
    ],
    proof: ['Sample roadmap', 'Decision matrix', 'Architecture review summary', 'Advisory action list'],
    visuals: ['Decision tree', 'Readiness checklist', 'Risk matrix', 'Roadmap strip'],
    seo: 'technical advisor, CTO advisory, technology consulting for businesses, software project advisory',
    examples: ['Architecture second opinion', 'AI adoption review', 'Build versus buy decision', 'Integration planning'],
    cta: 'Request technical advisory',
    ctaHref: '/consulting-intake',
  },
  '/work': {
    icon: LayoutDashboard,
    label: 'Work',
    title: 'Portfolio',
    intro: 'A practical view of representative systems, automations, and architecture patterns ABBADev can deliver.',
    priority: 'P2 proof page',
    goal: 'Show breadth without distracting from the deeper case studies.',
    blocks: [
      ['Operating systems', 'Command centers, workflow apps, dashboards, and portals for daily business operations.'],
      ['Automation layers', 'n8n workflows, notifications, data updates, intake routing, and exception queues.'],
      ['Architecture foundations', 'APIs, sync jobs, role boundaries, observability, and data ownership rules.'],
      ['Knowledge systems', 'Documentation, training resources, implementation notes, and reusable templates.'],
    ],
    proof: ['Case summaries', 'Sanitized screenshots', 'System diagrams', 'Before and after metrics'],
    visuals: ['Evidence board', 'Project cards', 'Metric tiles', 'Architecture thumbnails'],
    seo: 'AI automation portfolio, software architecture portfolio, custom software portfolio',
    examples: ['Transaction intake command center', 'Document intake assistant', 'Integration foundation'],
    cta: 'Review the case studies',
    ctaHref: '/cases',
  },
  '/cases': {
    icon: FileText,
    label: 'Work',
    title: 'Case studies',
    intro: 'Representative proof pages that show the business problem, approach, implementation path, governance, and results.',
    priority: 'P1 proof page',
    goal: 'Give executives and technical reviewers enough proof to trust the consulting and delivery model.',
    blocks: [
      ['Metric-led summaries', 'Each case starts with a measurable before and after signal.'],
      ['Problem and approach', 'The business context is documented before architecture details appear.'],
      ['Implementation path', 'The page explains phases, tradeoffs, governance, and handoff.'],
      ['Printable summaries', 'Each case can support stakeholder review through a concise PDF.'],
    ],
    proof: ['Before and after metrics', 'Implementation phases', 'Governance details', 'Anonymized stakeholder quotes'],
    visuals: ['Metric-first case cards', 'PDF style summaries', 'Implementation timeline', 'Architecture snapshots'],
    seo: 'AI automation case studies, software architecture case studies, custom software case studies',
    examples: caseStudies.map((study) => study.title),
    cta: 'Read the latest case',
    ctaHref: `/cases/${caseStudies[0].slug}`,
  },
  '/workflow-demos': {
    icon: Blocks,
    label: 'Work',
    title: 'Workflow demos',
    intro: 'Interactive examples that show how a request moves from intake to rules, AI support, data updates, and human approval.',
    priority: 'P3 interactive content',
    goal: 'Let visitors experience the operating logic behind ABBADev automation work.',
    blocks: [
      ['Lead intake replay', 'Show how a consultation brief is validated, scored, routed, and logged.'],
      ['Document intake simulation', 'Demonstrate AI drafting, validation, and exception review.'],
      ['Status workflow demo', 'Show how updates move through owners, reminders, and reporting views.'],
      ['Integration monitoring demo', 'Show retries, sync status, and exception handling.'],
    ],
    proof: ['Live n8n example', 'Sanitized payloads', 'Step timing', 'Failure path examples'],
    visuals: ['Animated node graph', 'Payload preview', 'Status timeline', 'Control checklist'],
    seo: 'workflow automation examples, AI workflow demo, n8n workflow examples',
    examples: ['Website consultation workflow', 'Document intake route', 'Approval reminder workflow'],
    cta: 'See the homepage workflow',
    ctaHref: '/#top',
  },
  '/implementation-notes': {
    icon: BookOpen,
    label: 'Work',
    title: 'Implementation notes',
    intro: 'Short technical notes that explain architecture decisions, integration tradeoffs, AI workflow boundaries, and delivery lessons.',
    priority: 'P3 authority content',
    goal: 'Build technical trust with practical notes that support the case studies and service pages.',
    blocks: [
      ['Architecture notes', 'Readable breakdowns of boundaries, contracts, sync rules, and reliability choices.'],
      ['Automation notes', 'Patterns for retries, validation, observability, prompt boundaries, and exception handling.'],
      ['Delivery notes', 'Lessons from scoping, staging, handoff, documentation, and governance.'],
      ['Templates', 'Reusable checklists for system reviews, workflow mapping, and AI automation readiness.'],
    ],
    proof: ['Diagrams', 'Code-adjacent snippets', 'Decision records', 'Checklists'],
    visuals: ['Technical notebook layout', 'Inline diagrams', 'Checklist panels', 'Architecture maps'],
    seo: 'software implementation notes, architecture notes, AI automation implementation',
    examples: ['Webhook validation checklist', 'Queue observability pattern', 'AI exception review model'],
    cta: 'Start with a system review',
    ctaHref: '/consulting-intake',
  },
  '/insights': {
    icon: BookOpen,
    label: 'Learn',
    title: 'Insights',
    intro: 'The learning hub for systems thinking, AI operations, software architecture, and digital transformation.',
    priority: 'P2 authority hub',
    goal: 'Create an organized home for educational content that compounds SEO and trust over time.',
    blocks: [
      ['System design', 'How to think about boundaries, roles, data movement, and reliability.'],
      ['AI operations', 'How AI fits into actual business processes without losing control.'],
      ['Digital transformation', 'How to modernize operations in phases that teams can adopt.'],
      ['Implementation notes', 'Practical patterns and lessons from delivery work.'],
    ],
    proof: ['Case study links', 'Diagrams', 'Templates', 'Workflow examples'],
    visuals: ['Knowledge hub grid', 'Article cards', 'Topic paths', 'Learning roadmap'],
    seo: 'AI automation insights, system design articles, digital transformation strategy',
    examples: ['System design', 'AI operations', 'Digital transformation', 'Implementation notes'],
    cta: 'Explore system design',
    ctaHref: '/insights/system-design',
  },
  '/insights/system-design': {
    icon: Network,
    label: 'Learn',
    title: 'System design',
    intro: 'A practical guide to designing software systems around workflows, people, integrations, and business rules.',
    priority: 'P2 authority topic',
    goal: 'Educate technical buyers and developers while reinforcing architecture credibility.',
    blocks: [
      ['Boundaries', 'Define what each system owns, what it exposes, and what it should never decide alone.'],
      ['Data movement', 'Clarify sources of truth, sync direction, retries, and audit events.'],
      ['Operating views', 'Design the dashboards, statuses, and exception paths leaders need.'],
      ['Governance', 'Make access, review, and reliability decisions explicit.'],
    ],
    proof: ['Architecture diagrams', 'Case study patterns', 'Review checklist', 'Integration examples'],
    visuals: ['Layered diagrams', 'Boundary maps', 'Event flow charts', 'Review checklist'],
    seo: 'system design consulting, software system design, enterprise system design',
    examples: ['Integration foundation', 'Transaction intake command center', 'Workflow blueprint'],
    cta: 'Review a system design',
    ctaHref: '/consulting-intake',
  },
  '/insights/ai-operations': {
    icon: Bot,
    label: 'Learn',
    title: 'AI operations',
    intro: 'AI becomes useful when it is placed inside accountable operating workflows with review, monitoring, and escalation.',
    priority: 'P2 authority topic',
    goal: 'Explain AI adoption in operational terms executives and technical teams can both trust.',
    blocks: [
      ['Human review', 'Keep judgment visible for approvals, exceptions, and risk-heavy decisions.'],
      ['AI drafting', 'Use models for summaries, extraction, classification, and recommendations.'],
      ['Deterministic rules', 'Use software rules for validation, routing, retries, and permissions.'],
      ['Operational monitoring', 'Track quality, exceptions, failures, and business outcomes.'],
    ],
    proof: ['n8n workflow', 'Exception queue examples', 'AI-assisted intake case study', 'Governance notes'],
    visuals: ['AI control plane', 'Review queue', 'Rules and model split', 'Monitoring timeline'],
    seo: 'AI operations, AI workflow governance, AI business operations',
    examples: ['Consultation intake routing', 'Document intake assistant', 'AI summary workflow'],
    cta: 'Design an AI operating model',
    ctaHref: '/consulting-intake',
  },
  '/insights/digital-transformation': {
    icon: Workflow,
    label: 'Learn',
    title: 'Digital transformation',
    intro: 'Modernization works when the business process is redesigned with software, automation, data, and governance together.',
    priority: 'P1 executive topic',
    goal: 'Speak directly to business leaders who need modernization without vague transformation language.',
    blocks: [
      ['Operating diagnosis', 'Find the manual handoffs, duplicate entry, missing visibility, and tool fragmentation.'],
      ['Modernization roadmap', 'Prioritize releases around operational lift, not technology novelty.'],
      ['System foundation', 'Create the integration, workflow, and reporting layer that future automation depends on.'],
      ['Adoption and governance', 'Make ownership, training, access, and auditability part of the plan.'],
    ],
    proof: ['Before and after workflow maps', 'Case study outcomes', 'Roadmap samples', 'Leadership reporting examples'],
    visuals: ['Transformation roadmap', 'Process to system map', 'Operating layer diagram', 'Metric cards'],
    seo: 'digital transformation consultant, business process digitization, operations modernization',
    examples: ['Transaction intake command center', 'Integration foundation', 'AI automation roadmap'],
    cta: 'Plan a transformation roadmap',
    ctaHref: '/consulting-intake',
  },
  '/about': {
    icon: ShieldCheck,
    label: 'ABBADev',
    title: 'About',
    intro: 'ABBADev Tech Solutions is led by Rommel Galisanao to help organizations turn business complexity into practical software systems.',
    priority: 'P1 trust page',
    goal: 'Build trust around Rommel, ABBADev, and the operating principles behind the work.',
    blocks: [
      ['Founder-led systems work', 'Rommel brings together software architecture, project leadership, AI automation, and business process analysis.'],
      ['Business and technical translation', 'The work bridges executive clarity and developer-ready implementation.'],
      ['AI-assisted delivery', 'AI is used to accelerate research, documentation, workflow design, and implementation while keeping accountability human.'],
      ['Operating principles', 'Clear scope, practical architecture, measurable outcomes, and maintainable systems.'],
    ],
    proof: ['Case studies', 'Tool stack', 'Delivery process', 'Client-ready documentation examples'],
    visuals: ['Founder profile area', 'Operating principles grid', 'Tool ecosystem', 'Delivery model diagram'],
    seo: 'Rommel Galisanao, ABBADev, ABBA Tech Solutions, AI automation consultant',
    examples: ['Software architecture', 'AI automation', 'Digital transformation', 'Custom systems'],
    cta: 'Start a conversation',
    ctaHref: '/contact',
  },
  '/contact': {
    icon: MessageSquareText,
    label: 'ABBADev',
    title: 'Contact',
    intro: 'Reach out with a workflow, system, or automation problem that needs a practical path forward.',
    priority: 'P1 conversion page',
    goal: 'Give visitors a simple trust-building bridge to the consultation intake.',
    blocks: [
      ['Best first step', 'Use the consulting intake so the first conversation starts with useful context.'],
      ['What to include', 'Describe the workflow, tools, people, approvals, urgency, and business impact.'],
      ['Response expectation', 'ABBADev reviews the brief and replies with the best next step.'],
      ['Project fit', 'Best fit includes AI automation, architecture, custom systems, and digital transformation work.'],
    ],
    proof: ['Working n8n intake workflow', 'Notion lead logging', 'Internal and confirmation emails', 'Case study examples'],
    visuals: ['Contact card', 'Intake workflow path', 'Response steps', 'Trust note'],
    seo: 'contact ABBADev, Rommel Galisanao contact, AI automation consultation',
    examples: ['Consultation and roadmap', 'Architecture review', 'Prototype', 'Full software build'],
    cta: 'Open consulting intake',
    ctaHref: '/#contact',
  },
  '/consulting-intake': {
    icon: CircleDot,
    label: 'ABBADev',
    title: 'Consulting intake',
    intro: 'Prepare a useful first conversation by describing the workflow, tools, urgency, and desired business outcome.',
    priority: 'P1 conversion page',
    goal: 'Route qualified leads into the existing website form and n8n workflow.',
    blocks: [
      ['Workflow challenge', 'Name the process, bottleneck, decision point, or system that should improve.'],
      ['Operating context', 'Share the current tools, people involved, approval points, and company stage.'],
      ['Engagement fit', 'Choose whether the next step is advisory, architecture review, prototype, or full build.'],
      ['Automated routing', 'The website sends the brief into n8n, email, and Notion for follow-up.'],
    ],
    proof: ['Live website form', 'n8n workflow', 'Notion lead database', 'Branded confirmation email'],
    visuals: ['Intake fields', 'Routing workflow', 'Qualification scoring', 'Follow-up timeline'],
    seo: 'software consultation intake, AI automation consultation, ABBADev consulting intake',
    examples: ['AI automation', 'Custom software', 'Architecture review', 'Digital transformation'],
    cta: 'Go to the intake form',
    ctaHref: '/#contact',
  },
  '/business-solutions': {
    icon: Blocks,
    label: 'ABBADev',
    title: 'Business solutions',
    intro: 'A problem-led view of the operational outcomes ABBADev can support with architecture, software, and automation.',
    priority: 'P2 executive landing page',
    goal: 'Keep the label only as an executive route organized by business problem rather than another generic services page.',
    blocks: [
      ['Operational visibility', 'Dashboards, status endpoints, reporting views, and exception tracking.'],
      ['Workflow automation', 'Intake, routing, reminders, approvals, and handoffs across teams and tools.'],
      ['System integration', 'APIs, sync jobs, source-of-truth rules, and monitoring.'],
      ['AI-assisted operations', 'Extraction, summaries, classification, and recommendation workflows with human checks.'],
    ],
    proof: ['Case study metrics', 'Workflow maps', 'Implementation notes', 'Service page links'],
    visuals: ['Business problem cards', 'Operating layer map', 'Metric proof strip', 'Solution pathway'],
    seo: 'business software solutions, automation solutions for business, digital operations solutions',
    examples: ['Reduce duplicate entry', 'Improve transaction traceability', 'Automate document review', 'Connect disconnected tools'],
    cta: 'Find the right solution path',
    ctaHref: '/consulting-intake',
  },
}

function CaseStudyPage({ study, theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug)
  const previousStudy = caseStudies[(currentIndex - 1 + caseStudies.length) % caseStudies.length]
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length]
  const caseMeta = [
    ['Client', study.client],
    ['Sector', study.sector],
    ['Duration', study.duration],
    ['Stack', study.stack],
  ]
  const summaryPdfHref = `/downloads/case-studies/${study.slug}.pdf`

  return (
    <div className="site-shell case-page-shell">
      <header className="nav case-page-header">
        <a className="brand" href="/#top" aria-label="ABBADev Tech Solutions home">
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
            <a href="/#platform" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="/#workflow" onClick={() => setMenuOpen(false)}>Workflow</a>
            <a href="/#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="/#resources" onClick={() => setMenuOpen(false)}>Insights</a>
            <a className="nav-cta" href="/#contact" onClick={() => setMenuOpen(false)}>
              Book a systems consult
            </a>
          </nav>
        </div>
      </header>

      <main className="case-page-main">
        <a className="case-page-back" href="/#work">Back to case studies</a>
        <section className="case-page-hero">
          <span className="kicker">{study.code}</span>
          <h1>{study.title}</h1>
          <p>{study.result}</p>
          <div className="case-page-meta">
            {caseMeta.map(([label, value]) => (
              <div className="case-meta-item" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p className="case-page-disclaimer">
            Details anonymized to protect the client operating context.
          </p>
        </section>

        <a className="case-download-link" href={summaryPdfHref} download>
          Download the 1-page summary <ArrowRight size={15} aria-hidden="true" />
        </a>

        <div className="case-page-split">
          <section className="case-page-section case-page-list-section">
            <span className="kicker">01 / Problem</span>
            <h2>Problem</h2>
            <ul>
              {study.problems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="case-page-section case-page-list-section">
            <span className="kicker">02 / Approach</span>
            <h2>Approach</h2>
            <ul>
              {study.approaches.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="case-page-section case-page-list-section case-page-implementation-section">
          <span className="kicker">03 / Implementation</span>
          <h2>Implementation</h2>
          <div className="case-phase-list case-page-phases">
            {study.phases.map(([label, copy], index) => (
              <div className="case-phase-item" key={label}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <div>
                  <strong>{label}</strong>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="case-page-section case-page-list-section">
          <span className="kicker">04 / Results</span>
          <h2>Results</h2>
        </section>

        <section className="case-page-results">
          {study.metrics.map((metric) => (
            <div
              key={metric.label}
              aria-label={`${metric.label}. Before ${metric.before}. After ${metric.after}. ${metric.note}`}
            >
              <span>{metric.label}</span>
              <div className="case-page-result-values">
                <small>
                  <span>Before</span>
                  <del>{metric.before}</del>
                </small>
                <strong>
                  <span>After</span>
                  {metric.after}
                </strong>
              </div>
              <p>{metric.note}</p>
            </div>
          ))}
        </section>

        <blockquote className="case-page-quote">
          <p>{study.quote}</p>
          <cite>{study.quoteBy}</cite>
        </blockquote>

        <section className="case-page-section case-page-list-section">
          <span className="kicker">05 / Governance</span>
          <h2>Governance</h2>
          <ul>
            <li>{study.governance}</li>
            <li>{study.automation}</li>
            <li>{study.outcome}</li>
          </ul>
        </section>

        <section className="case-page-cta">
          <div>
            <span className="kicker">Take this with you</span>
            <h2>Summary PDF - 1 page, print-ready</h2>
            <p>Problem, approach, implementation path, and results packaged for stakeholder review.</p>
          </div>
          <a className="primary-button" href={summaryPdfHref} download>
            Download PDF <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>

        <nav className="case-page-pagination" aria-label="Case study navigation">
          <a className="case-next-link" href={`/cases/${previousStudy.slug}`}>
            <span>Previous</span>
            <strong>{previousStudy.title}</strong>
          </a>
          <a className="case-next-link" href={`/cases/${nextStudy.slug}`}>
            <span>Next</span>
            <strong>{nextStudy.title}</strong>
          </a>
        </nav>
      </main>
    </div>
  )
}

function ContentPage({ page, theme, setTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const PageIcon = page.icon

  return (
    <div className="site-shell case-page-shell content-page-shell">
      <header className="nav case-page-header">
        <a className="brand" href="/#top" aria-label="ABBADev Tech Solutions home">
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
            <a href="/#platform" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="/#workflow" onClick={() => setMenuOpen(false)}>Workflow</a>
            <a href="/#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="/#resources" onClick={() => setMenuOpen(false)}>Insights</a>
            <a className="nav-cta" href="/#contact" onClick={() => setMenuOpen(false)}>
              Book a systems consult
            </a>
          </nav>
        </div>
      </header>

      <main className="case-page-main content-page-main">
        <a className="case-page-back" href="/#top">Back to home</a>
        <section className="case-page-hero content-page-hero">
          <span className="content-page-icon" aria-hidden="true">
            <PageIcon size={24} />
          </span>
          <span className="kicker">{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          <div className="content-page-goal">
            <span>{page.priority}</span>
            <strong>{page.goal}</strong>
          </div>
          <div className="content-page-actions">
            <a className="primary-button" href={page.ctaHref}>
              {page.cta} <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-button" href="/cases">
              Review proof <FileText size={17} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="content-block-grid" aria-label={`${page.title} content blocks`}>
          {page.blocks.map(([title, copy]) => (
            <article className="content-block-card" key={title}>
              <span>{title}</span>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <div className="content-page-split">
          <section className="case-page-section case-page-list-section">
            <span className="kicker">Proof needed</span>
            <h2>What makes this credible</h2>
            <ul>
              {page.proof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="case-page-section case-page-list-section">
            <span className="kicker">Visual direction</span>
            <h2>How the page should show it</h2>
            <ul>
              {page.visuals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="content-seo-panel">
          <div>
            <span className="kicker">SEO angle</span>
            <h2>Search intent to support</h2>
            <p>{page.seo}</p>
          </div>
          <div>
            <span className="kicker">Examples</span>
            <div className="content-example-list">
              {page.examples.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="case-page-cta">
          <div>
            <span className="kicker">Next step</span>
            <h2>Bring one real workflow into the conversation.</h2>
            <p>Share the process, tools, people, and business outcome. ABBADev will map the practical software or automation path around it.</p>
          </div>
          <a className="primary-button" href={page.ctaHref}>
            {page.cta} <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  )
}

const footerGroups = [
  {
    title: 'Services',
    links: [
      ['AI automation', '/services/ai-automation'],
      ['Software architecture', '/services/software-architecture'],
      ['Custom systems', '/services/custom-systems'],
      ['Technical advisory', '/services/technical-advisory'],
    ],
  },
  {
    title: 'Work',
    links: [
      ['Portfolio', '/work'],
      ['Case studies', '/cases'],
      ['Workflow demos', '/workflow-demos'],
      ['Implementation notes', '/implementation-notes'],
    ],
  },
  {
    title: 'Learn',
    links: [
      ['Insights', '/insights'],
      ['System design', '/insights/system-design'],
      ['AI operations', '/insights/ai-operations'],
      ['Digital transformation', '/insights/digital-transformation'],
    ],
  },
  {
    title: 'ABBADev',
    links: [
      ['About', '/about'],
      ['Contact', '/contact'],
      ['Consulting intake', '/consulting-intake'],
      ['Business solutions', '/business-solutions'],
    ],
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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function App() {
  const [activeMode, setActiveMode] = useState(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const selectedMode = workflowModes[activeMode]
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname))

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

  useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const normalizedPath = path.replace(/\/$/, '') || '/'
  const routeContent = contentPages[normalizedPath] || null
  const routeCase = path.startsWith('/cases/')
    ? caseStudies.find((study) => study.slug === path.replace('/cases/', '').replace(/\/$/, ''))
    : null

  const [leadStatus, setLeadStatus] = useState('idle')
  const [leadMessage, setLeadMessage] = useState('')

  const handleLeadSubmit = async (event) => {
    event.preventDefault()
    if (leadStatus === 'submitting') return

    const endpoint = import.meta.env.VITE_CONSULTATION_ENDPOINT || '/api/consultation'
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())
    const email = String(payload.email || '').trim()
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://abbadev.com/'

    if (!EMAIL_PATTERN.test(email)) {
      setLeadStatus('error')
      setLeadMessage('Enter a valid business email address, such as name@company.com.')
      return
    }

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
          email,
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

  if (routeCase) {
    return <CaseStudyPage study={routeCase} theme={theme} setTheme={setTheme} />
  }

  if (routeContent) {
    return <ContentPage page={routeContent} theme={theme} setTheme={setTheme} />
  }

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
              <span className="kicker">Evidence of impact</span>
              <h2>Proof patterns built for both executives and technical reviewers.</h2>
              <p>
                Representative case formats show the business problem,
                architecture path, automation role, governance choices, and
                operating lift without hiding behind jargon.
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
            {caseStudies.map((study) => (
              <article className="case-card" key={study.title}>
                <div className="case-card-head">
                  <div className="case-title-block">
                    <span>{study.code}</span>
                    <h3>{study.title}</h3>
                  </div>
                </div>
                <p>{study.result}</p>

                <div className="case-impact" aria-label={`${study.title} impact metric`}>
                  <span>{study.metric.label}</span>
                  <div
                    className="case-impact-values"
                    aria-label={`Before ${study.metric.before}. After ${study.metric.after}.`}
                  >
                    <small>
                      <span>Before</span>
                      {' '}
                      <del>{study.metric.before}</del>
                    </small>
                    {' '}
                    <strong>
                      <span>After</span>
                      {' '}
                      {study.metric.after}
                    </strong>
                  </div>
                  <em>Representative scenario</em>
                </div>

                <div className="case-card-footer">
                  <a
                    className="case-toggle"
                    href={`/cases/${study.slug}`}
                  >
                    Read case study
                    <ChevronRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a className="all-cases-link" href="/cases">
            All case studies <ArrowRight size={16} aria-hidden="true" />
          </a>
          <p className="work-trust">
            <ShieldCheck size={22} aria-hidden="true" />
            <strong>Outcome-driven proof.</strong>
            <span className="accent">Clear architecture.</span>
            <strong>Designed for measurable impact.</strong>
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
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                  title="Enter a valid email address, such as name@company.com."
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
              {group.links.map(([link, href]) => (
                <a href={href} key={link}>{link}</a>
              ))}
            </div>
          ))}
        </div>
      </footer>

      <Assistant />
    </div>
  )
}

export default App
