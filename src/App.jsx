import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  BookOpen,
  Bot,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock,
  Code2,
  Database,
  FileText,
  GitBranch,
  GraduationCap,
  History,
  Inbox,
  LayoutDashboard,
  ListChecks,
  MapPin,
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
  Users,
  Video,
  Wand2,
  Workflow,
  X,
} from 'lucide-react'
import Assistant from './Assistant'
import CaseWorkflow from './CaseWorkflow'
import { EMAIL_PATTERN } from './lib/patterns'
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
    workflow: {
      heading: 'How a transaction flows',
      title: 'Transaction intake pipeline',
      caption: 'From a POS submission to a traceable status - intake stays separate from processing, with an exception safety net.',
      completeLabel: 'Transaction traced',
      completeDetail: 'exceptions handled',
      steps: [
        { icon: Inbox, kind: 'client', label: 'POS submission', tag: 'terminal intake', idle: 'Submission received', active: 'Receiving submission', done: 'Submission received' },
        { icon: ListChecks, kind: 'guard', label: 'Intake gate', tag: 'structure check', idle: 'Shape validated', active: 'Validating shape', done: 'Shape validated' },
        { icon: ShieldCheck, kind: 'guard', label: 'Integrity layer', tag: 'SHA-256 checksum', idle: 'Checksum verified', active: 'Verifying checksum', done: 'Checksum verified' },
        { icon: Workflow, kind: 'n8n', label: 'Queue', tag: 'Horizon jobs', idle: 'Queued with backpressure', active: 'Queuing job', done: 'Queued with backpressure' },
        { icon: Radar, kind: 'store', label: 'Status endpoints', tag: 'observability', idle: 'Status traceable', active: 'Exposing status', done: 'Status traceable' },
        { icon: History, kind: 'notify', label: 'Exception handling', tag: 'quarantine / retry', idle: 'Exceptions triaged', active: 'Routing exceptions', done: 'Exceptions triaged' },
      ],
    },
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
  {
    icon: Bot,
    badge: Sparkles,
    image: '/images/case-studies/ai-connection.png',
    imageAlt: 'Blue AI assistant connection badge',
    type: 'Applied AI',
    code: '004 / Assistant',
    slug: 'guardrailed-site-assistant',
    title: 'Guardrailed site assistant',
    result: 'A generic website chatbot becomes a scoped intake assistant that answers within guardrails and escalates only qualified consultation leads to a human.',
    metric: {
      label: 'Escalation to a human',
      before: 'Every visitor',
      after: 'Qualified leads',
      note: 'General questions are answered in the browser; only a completed consult brief reaches the founder.',
    },
    metrics: [
      { label: 'Assistant answers', before: 'Open-ended AI', after: 'Guardrailed KB', note: 'Deterministic intent matching keeps replies scoped to real ABBADev services, with no free-text model call that could go off-script.' },
      { label: 'Escalation to a human', before: 'Every visitor', after: 'Qualified leads', note: 'Only a completed Book a consult flow - a workflow challenge plus a validated email - is routed to a person.' },
      { label: 'Lead pipeline isolation', before: 'Shared secret', after: 'Dedicated token', note: 'Chat leads run through their own n8n webhook and secret, separate from the website consultation form.' },
    ],
    client: 'ABBADev IT Solutions (this website)',
    sector: 'Professional services / lead generation',
    duration: 'One focused increment',
    stack: 'React/Vite - Node proxy - n8n - Postgres - Telegram',
    meta: [
      ['Audience', 'Prospective consultation clients'],
      ['System type', 'Guardrailed assistant + lead pipeline'],
      ['Primary value', 'Qualified intake without losing human ownership'],
      ['Governance', 'Server-stamped channel, email validation, isolated secret'],
    ],
    problem: 'The site had one call to action - the full consultation form - and no low-friction, guarded way for visitors to self-qualify or get scoped answers first.',
    problems: [
      'The site had a single call to action, the full consultation form, with no low-friction way for a visitor to ask a scoped question or self-qualify before committing.',
      'A generic AI chatbot would risk off-topic or fabricated answers, directly contradicting the "AI with guardrails" thesis the site argues for.',
      'Any lead capture had to reach the founder reliably without burying real prospects under every casual visitor question.',
    ],
    approach: 'Answer scoped questions from a guardrailed knowledge base, and escalate only completed consultation flows into an isolated automation pipeline.',
    approaches: [
      'Answer scoped questions client-side from a curated knowledge base using deterministic intent matching - no free-text model call that could drift off-script.',
      'Make the assistant itself the proof: AI-guided intake, deterministic rules, and a human owner confirming the path.',
      'Escalate only a completed brief - a workflow challenge plus a validated email - rather than every conversation.',
      'Keep the chat lead pipeline separate from the website form, with its own webhook and secret.',
    ],
    automation: 'The assistant collects a two-question brief and posts it to a Node proxy, which validates the email and stamps the channel server-side before forwarding to a dedicated n8n webhook that normalizes the lead, writes it to Postgres, and alerts the founder on Telegram.',
    governance: 'The browser is never trusted for the channel tag - the proxy stamps it and re-validates the email - and the chat webhook uses its own bearer secret, isolated from the consultation form, while general questions never leave the browser.',
    outcome: 'The site now qualifies visitors and routes only real consultation leads to a person, and the assistant doubles as a live demonstration of the guardrailed-AI model ABBADev sells.',
    phases: [
      ['Guardrailed knowledge base', 'Curated intent matching answers services, proof, pricing, and process questions in the browser, with no free-text model call to go off-script.'],
      ['Guided consult flow', 'A two-question brief - workflow challenge, then a validated email - prepares a qualified lead inside the chat.'],
      ['Isolated lead pipeline', 'A Node proxy validates the email, stamps the channel server-side, and forwards the lead to a dedicated n8n webhook with its own secret.'],
      ['Store and notify', 'n8n normalizes the lead, writes it to a Postgres table, and alerts the founder on Telegram in real time.'],
    ],
    quote: 'The assistant is the argument. It answers within guardrails and only escalates a real lead to a person - the same AI-with-ownership model we build for clients.',
    quoteBy: 'Rommel Galisanao, ABBADev IT Solutions',
    disclaimer: 'Live on this site - the assistant in the corner is the system described here.',
    workflow: {
      heading: 'How a lead flows',
      title: 'Chat lead pipeline',
      caption: 'From the site assistant to a Telegram alert - the exact n8n path a qualified lead travels.',
      completeLabel: 'Lead routed',
      completeDetail: 'founder alerted',
      steps: [
        { icon: Bot, kind: 'client', label: 'Site assistant', tag: 'book a consult', idle: 'Brief captured', active: 'Capturing brief', done: 'Brief captured' },
        { icon: ShieldCheck, kind: 'guard', label: 'Proxy', tag: 'validate + stamp', idle: 'Validated', active: 'Validating email', done: 'Validated' },
        { icon: Workflow, kind: 'n8n', label: 'n8n webhook', tag: 'Header Auth', idle: 'Authorized', active: 'Authorizing', done: 'Authorized' },
        { icon: ListChecks, kind: 'n8n', label: 'Normalize', tag: 'code node', idle: 'Normalized', active: 'Normalizing', done: 'Normalized' },
        { icon: Database, kind: 'store', label: 'Postgres', tag: 'insert lead', idle: 'Lead stored', active: 'Storing lead', done: 'Lead stored' },
        { icon: Send, kind: 'notify', label: 'Telegram', tag: 'notify founder', idle: 'Founder alerted', active: 'Alerting founder', done: 'Founder alerted' },
      ],
    },
    tags: [
      { icon: Bot, label: 'Guardrailed assistant' },
      { icon: ShieldCheck, label: 'Server-stamped intake' },
      { icon: Workflow, label: 'n8n lead pipeline' },
    ],
  },
  {
    icon: LayoutDashboard,
    badge: Sparkles,
    mockup: 'crm',
    image: '/images/mockup_crm.png',
    imageWebp: '/images/mockup_crm.webp',
    imageAlt: 'ABBADev CRM dashboard preview',
    type: 'Product',
    code: '005 / Product',
    slug: 'abbadev-crm',
    title: 'ABBADev CRM',
    result: 'Scattered leads across spreadsheets, chat threads, and inboxes become one governed CRM where every contact, deal, and follow-up has an owner and a status.',
    metric: {
      label: 'Lead visibility',
      before: 'Spreadsheets',
      after: 'Live pipeline',
      note: 'Contacts, deals, and activities live in one system instead of scattered files and chat threads.',
    },
    metrics: [
      { label: 'Lead visibility', before: 'Spreadsheets', after: 'Live pipeline', note: 'Every contact and deal sits in one shared pipeline with a stage, an owner, and a next action.' },
      { label: 'Follow-up discipline', before: 'Memory', after: 'Tasks + reminders', note: 'Activities and due tasks make sure no qualified lead goes quiet by accident.' },
      { label: 'Reporting effort', before: 'Manual rollups', after: 'Live dashboard', note: 'Pipeline value, win rate, and stage movement update as the team works, not at month-end.' },
    ],
    client: 'ABBADev IT Solutions (our own product)',
    sector: 'SME sales and operations',
    duration: 'Running in production',
    stack: 'Laravel - React/Vite - MySQL - Sanctum',
    liveUrl: 'https://crm.abbadev.com',
    summaryPdf: false,
    disclaimer: 'Live product - running in production at crm.abbadev.com.',
    meta: [
      ['Audience', 'Owners, sales, and operations teams at SMEs'],
      ['System type', 'Contact, deal, and pipeline CRM'],
      ['Primary value', 'One governed place for leads, deals, and follow-ups'],
      ['Governance', 'Role-based access and per-record ownership'],
    ],
    problem: 'Small teams track leads across spreadsheets, chat threads, and inboxes, so deals stall, follow-ups slip, and no one can see the true state of the pipeline.',
    problems: [
      'Leads and deals live in spreadsheets, chat threads, and personal inboxes, so the same prospect is worked twice or dropped entirely.',
      'Without owned records and clear stages, follow-ups depend on memory and qualified deals quietly go cold.',
      'Owners have no live view of pipeline value, win rate, or what each rep is working on without asking around or rebuilding a spreadsheet.',
    ],
    approach: 'Give SMEs a right-sized CRM that models contacts, deals, and activities as governed records with clear ownership - not another spreadsheet.',
    approaches: [
      'Model contacts, companies, deals, and activities as first-class records so nothing important lives only in a chat thread.',
      'Make the pipeline the center of gravity: every deal has a stage, an owner, a value, and a next action.',
      'Turn follow-ups into tasks and logged activities so discipline comes from the system, not from memory.',
      'Keep it right-sized for SMEs - the essentials that drive revenue, without enterprise overhead or a long rollout.',
    ],
    automation: 'New leads land in the pipeline with an owner and a first task, stage changes are logged as activities, and the dashboard recomputes pipeline value and win rate as the team works.',
    governance: 'Role-based access separates what owners, sales, and operations can see and do, while per-record ownership keeps every contact and deal accountable to a named person.',
    outcome: 'Teams get one live pipeline where every lead has an owner and a next action, and owners can see pipeline health without chasing updates.',
    phases: [
      ['Contact and company records', 'Centralized contacts and companies so every lead has a single, shared source of truth.'],
      ['Deal pipeline', 'Modeled stages, values, and ownership so the whole team sees where each deal stands.'],
      ['Activities and tasks', 'Logged calls, emails, and notes, plus due tasks that keep follow-ups from slipping.'],
      ['Dashboard and reporting', 'Live pipeline value, win rate, and stage movement for owners, updated as work happens.'],
    ],
    quote: 'We built the CRM we wanted our own clients to have - one place where every lead has an owner and a next step, not a spreadsheet that goes stale by Friday.',
    quoteBy: 'Rommel Galisanao, ABBADev IT Solutions',
    workflow: {
      heading: 'How a lead moves through the CRM',
      title: 'Lead-to-deal pipeline',
      caption: 'From a captured contact to a tracked deal - every stage owned, logged, and reflected on the dashboard.',
      completeLabel: 'Deal tracked',
      completeDetail: 'dashboard updated',
      steps: [
        { icon: Inbox, kind: 'client', label: 'New lead', tag: 'contact captured', idle: 'Lead captured', active: 'Capturing lead', done: 'Lead captured' },
        { icon: Users, kind: 'store', label: 'Contact record', tag: 'single source', idle: 'Record created', active: 'Creating record', done: 'Record created' },
        { icon: GitBranch, kind: 'guard', label: 'Pipeline stage', tag: 'owned + valued', idle: 'Stage assigned', active: 'Assigning stage', done: 'Stage assigned' },
        { icon: ListChecks, kind: 'n8n', label: 'Follow-up task', tag: 'next action', idle: 'Task scheduled', active: 'Scheduling task', done: 'Task scheduled' },
        { icon: History, kind: 'notify', label: 'Activity log', tag: 'calls + emails', idle: 'Activity logged', active: 'Logging activity', done: 'Activity logged' },
        { icon: Radar, kind: 'store', label: 'Dashboard', tag: 'pipeline health', idle: 'Metrics updated', active: 'Updating metrics', done: 'Metrics updated' },
      ],
    },
    tags: [
      { icon: Users, label: 'Contact management' },
      { icon: GitBranch, label: 'Deal pipeline' },
      { icon: LayoutDashboard, label: 'Live dashboard' },
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

const founderProfile = {
  name: 'Rommel Galisanao',
  role: 'Founder & Principal Systems Architect — ABBADev IT Solutions',
  bio: 'I help organizations turn business complexity into practical software systems, bringing together software architecture, AI automation, project leadership, and business process analysis. The work bridges executive clarity and developer-ready implementation, with accountability kept human at every step.',
  points: [
    'Software architecture and enterprise systems',
    'AI automation with governance and guardrails',
    'Business-to-technical translation for leaders and teams',
  ],
}

const contentPages = {
  '/community': {
    icon: GraduationCap,
    label: 'Community',
    title: 'Community & learning',
    intro: 'Beyond client projects, ABBADev shares practical technology knowledge so students, developers, entrepreneurs, and business owners can apply modern tools in the real world.',
    blocks: [
      ['AI education', 'Where AI creates real value, how to use it responsibly, and where people should stay in control.'],
      ['Software & delivery craft', 'Practical software development and project management - how real systems get built and shipped.'],
      ['Business technology', 'How automation, integration, and software actually improve day-to-day operations.'],
      ['Hands-on formats', 'Webinars, workshops, tutorials, and demonstrations - learning by doing, not just by watching.'],
    ],
    examples: ['Webinars', 'Workshops', 'Tutorials', 'Tech demonstrations', 'AI education', 'Community discussions'],
    cta: 'Reserve a seat',
    ctaHref: '/register',
  },
  '/services/ai-automation': {
    icon: BrainCircuit,
    label: 'Services',
    title: 'AI automation',
    intro: 'Use AI where it can reduce operating drag without removing human judgment, auditability, or ownership.',
    blocks: [
      ['Workflow fit review', 'Identify where AI should draft, summarize, classify, or route work, and where deterministic rules or human approval should stay in control.'],
      ['Automation blueprint', 'Map triggers, systems, owners, exception paths, and review checkpoints before tools are connected.'],
      ['n8n implementation path', 'Turn the approved workflow into webhooks, validation rules, notifications, Notion or CRM updates, and email handoffs.'],
      ['Governance and monitoring', 'Define failure handling, retry behavior, data visibility, prompt boundaries, and audit notes.'],
    ],
    examples: ['Lead intake qualification', 'Document review triage', 'Status update routing', 'Executive summary generation'],
    cta: 'Map an automation opportunity',
    ctaHref: '/#contact',
  },
  '/services/software-architecture': {
    icon: Network,
    label: 'Services',
    title: 'Software architecture',
    intro: 'Design the system boundaries, data flow, and governance model before implementation cost compounds.',
    blocks: [
      ['Architecture review', 'Assess current systems, data movement, user roles, pain points, and failure modes.'],
      ['Target operating model', 'Translate business process into system responsibilities, ownership boundaries, and delivery phases.'],
      ['Integration strategy', 'Define APIs, sync direction, source of truth rules, retries, and observability before automation expands.'],
      ['Delivery governance', 'Create review checkpoints for access, reliability, maintainability, and release risk.'],
    ],
    examples: ['API foundation', 'Multi-tenant workflow platform', 'Reporting data layer', 'Legacy tool modernization'],
    cta: 'Review a system architecture',
    ctaHref: '/#contact',
  },
  '/services/custom-systems': {
    icon: Code2,
    label: 'Services',
    title: 'Custom systems',
    intro: 'Build internal tools, portals, dashboards, APIs, and workflow systems around the way the business actually operates.',
    blocks: [
      ['Discovery and scope', 'Clarify users, workflows, reports, permissions, integrations, and measurable outcomes.'],
      ['Prototype and validation', 'Create enough of the product surface to confirm the workflow before the build expands.'],
      ['Implementation', 'Deliver the application, database, integrations, queues, roles, and operational views.'],
      ['Handoff and support', 'Document the system, train users, and establish maintenance expectations.'],
    ],
    examples: ['Client portals', 'Operations dashboards', 'Workflow applications', 'Reporting systems'],
    cta: 'Scope a custom system',
    ctaHref: '/#contact',
  },
  '/services/technical-advisory': {
    icon: ShieldCheck,
    label: 'Services',
    title: 'Technical advisory',
    intro: 'Get senior technical guidance before committing budget, vendor effort, or internal team capacity.',
    blocks: [
      ['Roadmap session', 'Turn a business problem into a practical sequence of architecture, automation, and delivery decisions.'],
      ['Vendor and tool review', 'Evaluate whether a platform, integration, or AI tool fits the operating context.'],
      ['Risk review', 'Identify security, data, reliability, access, and maintenance risks before implementation.'],
      ['Team enablement', 'Help leaders and teams understand the system design choices in plain language.'],
    ],
    examples: ['Architecture second opinion', 'AI adoption review', 'Build versus buy decision', 'Integration planning'],
    cta: 'Request technical advisory',
    ctaHref: '/#contact',
  },
  '/workflow-demos': {
    icon: Blocks,
    label: 'Work',
    title: 'Workflow demos',
    intro: 'Interactive examples that show how a request moves from intake to rules, AI support, data updates, and human approval.',
    blocks: [
      ['Lead intake replay', 'Show how a consultation brief is validated, scored, routed, and logged.'],
      ['Document intake simulation', 'Demonstrate AI drafting, validation, and exception review.'],
      ['Status workflow demo', 'Show how updates move through owners, reminders, and reporting views.'],
      ['Integration monitoring demo', 'Show retries, sync status, and exception handling.'],
    ],
    examples: ['Website consultation workflow', 'Document intake route', 'Approval reminder workflow'],
    cta: 'See the homepage workflow',
    ctaHref: '/#top',
  },
  '/implementation-notes': {
    icon: BookOpen,
    label: 'Work',
    title: 'Implementation notes',
    intro: 'Short technical notes that explain architecture decisions, integration tradeoffs, AI workflow boundaries, and delivery lessons.',
    blocks: [
      ['Architecture notes', 'Readable breakdowns of boundaries, contracts, sync rules, and reliability choices.'],
      ['Automation notes', 'Patterns for retries, validation, observability, prompt boundaries, and exception handling.'],
      ['Delivery notes', 'Lessons from scoping, staging, handoff, documentation, and governance.'],
      ['Templates', 'Reusable checklists for system reviews, workflow mapping, and AI automation readiness.'],
    ],
    examples: ['Webhook validation checklist', 'Queue observability pattern', 'AI exception review model'],
    cta: 'Start with a system review',
    ctaHref: '/#contact',
  },
  '/insights': {
    icon: BookOpen,
    label: 'Learn',
    title: 'Insights',
    intro: 'The learning hub for systems thinking, AI operations, software architecture, and digital transformation.',
    blocks: [
      ['System design', 'How to think about boundaries, roles, data movement, and reliability.'],
      ['AI operations', 'How AI fits into actual business processes without losing control.'],
      ['Digital transformation', 'How to modernize operations in phases that teams can adopt.'],
      ['Implementation notes', 'Practical patterns and lessons from delivery work.'],
    ],
    examples: ['System design', 'AI operations', 'Digital transformation', 'Implementation notes'],
    cta: 'Explore system design',
    ctaHref: '/insights/system-design',
  },
  '/insights/system-design': {
    icon: Network,
    label: 'Learn',
    title: 'System design',
    intro: 'A practical guide to designing software systems around workflows, people, integrations, and business rules.',
    blocks: [
      ['Boundaries', 'Define what each system owns, what it exposes, and what it should never decide alone.'],
      ['Data movement', 'Clarify sources of truth, sync direction, retries, and audit events.'],
      ['Operating views', 'Design the dashboards, statuses, and exception paths leaders need.'],
      ['Governance', 'Make access, review, and reliability decisions explicit.'],
    ],
    examples: ['Integration foundation', 'Transaction intake command center', 'Workflow blueprint'],
    cta: 'Review a system design',
    ctaHref: '/#contact',
  },
  '/insights/ai-operations': {
    icon: Bot,
    label: 'Learn',
    title: 'AI operations',
    intro: 'AI becomes useful when it is placed inside accountable operating workflows with review, monitoring, and escalation.',
    blocks: [
      ['Human review', 'Keep judgment visible for approvals, exceptions, and risk-heavy decisions.'],
      ['AI drafting', 'Use models for summaries, extraction, classification, and recommendations.'],
      ['Deterministic rules', 'Use software rules for validation, routing, retries, and permissions.'],
      ['Operational monitoring', 'Track quality, exceptions, failures, and business outcomes.'],
    ],
    examples: ['Consultation intake routing', 'Document intake assistant', 'AI summary workflow'],
    cta: 'Design an AI operating model',
    ctaHref: '/#contact',
  },
  '/insights/digital-transformation': {
    icon: Workflow,
    label: 'Learn',
    title: 'Digital transformation',
    intro: 'Modernization works when the business process is redesigned with software, automation, data, and governance together.',
    blocks: [
      ['Operating diagnosis', 'Find the manual handoffs, duplicate entry, missing visibility, and tool fragmentation.'],
      ['Modernization roadmap', 'Prioritize releases around operational lift, not technology novelty.'],
      ['System foundation', 'Create the integration, workflow, and reporting layer that future automation depends on.'],
      ['Adoption and governance', 'Make ownership, training, access, and auditability part of the plan.'],
    ],
    examples: ['Transaction intake command center', 'Integration foundation', 'AI automation roadmap'],
    cta: 'Plan a transformation roadmap',
    ctaHref: '/#contact',
  },
  '/contact': {
    icon: MessageSquareText,
    label: 'ABBADev',
    title: 'Contact',
    intro: 'Reach out with a workflow, system, or automation problem that needs a practical path forward.',
    blocks: [
      ['Best first step', 'Use the consulting intake so the first conversation starts with useful context.'],
      ['What to include', 'Describe the workflow, tools, people, approvals, urgency, and business impact.'],
      ['Response expectation', 'ABBADev reviews the brief and replies with the best next step.'],
      ['Project fit', 'Best fit includes AI automation, architecture, custom systems, and digital transformation work.'],
    ],
    examples: ['Consultation and roadmap', 'Architecture review', 'Prototype', 'Full software build'],
    cta: 'Open consulting intake',
    ctaHref: '/#contact',
  },
  '/consulting-intake': {
    icon: CircleDot,
    label: 'ABBADev',
    title: 'Consulting intake',
    intro: 'Prepare a useful first conversation by describing the workflow, tools, urgency, and desired business outcome.',
    blocks: [
      ['Workflow challenge', 'Name the process, bottleneck, decision point, or system that should improve.'],
      ['Operating context', 'Share the current tools, people involved, approval points, and company stage.'],
      ['Engagement fit', 'Choose whether the next step is advisory, architecture review, prototype, or full build.'],
      ['Automated routing', 'The website sends the brief into n8n, email, and Notion for follow-up.'],
    ],
    examples: ['AI automation', 'Custom software', 'Architecture review', 'Digital transformation'],
    cta: 'Go to the intake form',
    ctaHref: '/#contact',
  },
  '/business-solutions': {
    icon: Blocks,
    label: 'ABBADev',
    title: 'Business solutions',
    intro: 'A problem-led view of the operational outcomes ABBADev can support with architecture, software, and automation.',
    blocks: [
      ['Operational visibility', 'Dashboards, status endpoints, reporting views, and exception tracking.'],
      ['Workflow automation', 'Intake, routing, reminders, approvals, and handoffs across teams and tools.'],
      ['System integration', 'APIs, sync jobs, source-of-truth rules, and monitoring.'],
      ['AI-assisted operations', 'Extraction, summaries, classification, and recommendation workflows with human checks.'],
    ],
    examples: ['Reduce duplicate entry', 'Improve transaction traceability', 'Automate document review', 'Connect disconnected tools'],
    cta: 'Find the right solution path',
    ctaHref: '/#contact',
  },
}

// Shared nav header for the standalone pages (case study, cases directory,
// content pages). Owns its own mobile-menu state.
// Single source of truth for the primary navigation. Items are real pages (not
// homepage section anchors); Services and Insights expose their depth via a
// dropdown on desktop and an indented list on mobile.
const primaryNav = [
  {
    label: 'Services',
    href: '/services',
    children: [
      ['All services', '/services'],
      ['AI & automation', '/services/ai-automation'],
      ['Software architecture', '/services/software-architecture'],
      ['Custom systems', '/services/custom-systems'],
      ['Technical advisory', '/services/technical-advisory'],
    ],
  },
  { label: 'Work', href: '/cases' },
  {
    label: 'Insights',
    href: '/insights',
    children: [
      ['All insights', '/insights'],
      ['System design', '/insights/system-design'],
      ['AI operations', '/insights/ai-operations'],
      ['Digital transformation', '/insights/digital-transformation'],
    ],
  },
  { label: 'Sessions', href: '/register' },
  { label: 'About', href: '/about' },
]

// Shared primary navigation used by every header, so the menu can never drift
// between the homepage and the interior pages.
function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)

  // Nav links are full-page navigations, so reading the path at render time is
  // accurate for the current page. A top item is active on its own page and any
  // page nested beneath it (e.g. Services on /services/ai-automation).
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') || '/' : '/'
  const isActive = (href) => currentPath === href || currentPath.startsWith(`${href}/`)

  return (
    <>
      <button
        className="icon-button mobile-only"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary">
        {primaryNav.map((item) => {
          const active = isActive(item.href)
          return item.children ? (
            <div className="nav-item has-dropdown" key={item.label}>
              <a
                className={`nav-top-link${active ? ' is-active' : ''}`}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                onClick={close}
              >
                {item.label}
                <ChevronDown size={15} aria-hidden="true" />
              </a>
              <div className="nav-dropdown">
                {item.children.map(([label, href]) => (
                  <a key={href} href={href} onClick={close}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a
              className={`nav-top-link${active ? ' is-active' : ''}`}
              href={item.href}
              key={item.label}
              aria-current={active ? 'page' : undefined}
              onClick={close}
            >
              {item.label}
            </a>
          )
        })}
        <a className="nav-cta" href="/#contact" onClick={close}>
          Book a consult
        </a>
      </nav>
    </>
  )
}

function CasePageHeader({ theme, setTheme }) {
  return (
    <header className="nav case-page-header">
      <a className="brand" href="/#top" aria-label="ABBADev IT Solutions home">
        <img className="brand-mark" src="/images/abbadev-logo.png" alt="" width="42" height="42" />
        <span className="brand-wordmark">
          <strong>ABBADEV</strong>
          <small>IT Solutions</small>
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
        <SiteNav />
      </div>
    </header>
  )
}

function CaseStudyPage({ study, theme, setTheme }) {
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
      <CasePageHeader theme={theme} setTheme={setTheme} />

      <main className="case-page-main">
        <Breadcrumbs crumbs={[['Home', '/'], ['Case studies', '/cases'], [study.title, null]]} />
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
            {study.disclaimer || 'Details anonymized to protect the client operating context.'}
          </p>
        </section>

        {study.liveUrl ? (
          <a
            className="case-download-link"
            href={study.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Launch the live app <ArrowRight size={15} aria-hidden="true" />
          </a>
        ) : study.summaryPdf !== false && (
          <a className="case-download-link" href={summaryPdfHref} download>
            Download the 1-page summary <ArrowRight size={15} aria-hidden="true" />
          </a>
        )}

        {study.mockup === 'crm' && (
          <figure className="case-page-shot">
            <picture>
              <source srcSet="/images/mockup_crm.webp" type="image/webp" />
              <img
                src="/images/mockup_crm.png"
                alt="The ABBADev CRM dashboard running in production"
                width="1672"
                height="941"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption>The live ABBADev CRM - contacts, deal pipeline, tasks, and a live dashboard in one system.</figcaption>
          </figure>
        )}

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

        {study.workflow && (
          <section className="case-page-section case-workflow-section">
            <span className="kicker">Live pipeline</span>
            <h2>{study.workflow.heading}</h2>
            <CaseWorkflow
              title={study.workflow.title}
              caption={study.workflow.caption}
              completeLabel={study.workflow.completeLabel}
              completeDetail={study.workflow.completeDetail}
              steps={study.workflow.steps}
            />
          </section>
        )}

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

        {study.liveUrl ? (
          <section className="case-page-cta">
            <div>
              <span className="kicker">See it live</span>
              <h2>Explore the CRM running in production</h2>
              <p>Open the live app to walk the same contacts, pipeline, tasks, and dashboard described here.</p>
            </div>
            <a
              className="primary-button"
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch the CRM <ArrowRight size={18} aria-hidden="true" />
            </a>
          </section>
        ) : study.summaryPdf !== false ? (
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
        ) : (
          <section className="case-page-cta">
            <div>
              <span className="kicker">See it live</span>
              <h2>The assistant is in the corner of this site</h2>
              <p>Open it, ask about services or pricing, then try Book a consult to walk the exact intake flow described here.</p>
            </div>
            <a className="primary-button" href="/#contact">
              Book a systems consult <ArrowRight size={18} aria-hidden="true" />
            </a>
          </section>
        )}

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

function CasesIndexPage({ theme, setTheme }) {
  const [filter, setFilter] = useState('All')
  const filters = ['All', ...Array.from(new Set(caseStudies.map((study) => study.type)))]
  const visible = filter === 'All' ? caseStudies : caseStudies.filter((study) => study.type === filter)

  return (
    <div className="site-shell cases-index-shell">
      <CasePageHeader theme={theme} setTheme={setTheme} />

      <main className="cases-index-main">
        <Breadcrumbs crumbs={[['Home', '/'], ['Case studies', null]]} />
        <section className="cases-index-hero">
          <span className="kicker">Selected work</span>
          <h1>Case studies</h1>
          <p>
            Real systems ABBADev has designed and shipped - each one shows the business problem,
            the approach, the implementation path, governance, and a measurable before and after.
            Filter by the kind of system you are building.
          </p>
        </section>

        <div className="cx-filter" role="group" aria-label="Filter case studies by type">
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              className={`cx-pill${filter === option ? ' is-active' : ''}`}
              onClick={() => setFilter(option)}
            >
              {option}
              {option !== 'All' && (
                <span className="cx-pill-count">
                  {caseStudies.filter((study) => study.type === option).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="cx-grid">
          {visible.map((study) => {
            const Icon = study.icon
            return (
              <article className="cx-card" key={study.slug}>
                <a className="cx-card-link" href={`/cases/${study.slug}`} aria-label={`Read case study: ${study.title}`}>
                  <div className="cx-media">
                    <div className="cx-chrome" aria-hidden="true">
                      <span className="cx-dot" />
                      <span className="cx-dot" />
                      <span className="cx-dot" />
                      <em>{study.code}</em>
                    </div>
                    <div className={study.mockup ? 'cx-shot cx-shot--mock' : 'cx-shot'}>
                      {study.mockup === 'crm' ? (
                        <div className="cx-mock-frame">
                          <picture>
                            <source srcSet={study.imageWebp} type="image/webp" />
                            <img src={study.image} alt={study.imageAlt || ''} width="1672" height="941" loading="lazy" decoding="async" />
                          </picture>
                        </div>
                      ) : (
                        <img src={study.image} alt={study.imageAlt || ''} decoding="async" width="640" height="360" />
                      )}
                    </div>
                  </div>
                  <div className="cx-body">
                    <span className="cx-cat">
                      <Icon size={14} aria-hidden="true" />
                      {study.type}
                    </span>
                    <h3>{study.title}</h3>
                    <p>{study.result}</p>
                    <div className="cx-metric" aria-label={`${study.metric.label}: before ${study.metric.before}, after ${study.metric.after}`}>
                      <span className="cx-metric-label">{study.metric.label}</span>
                      <span className="cx-metric-values">
                        <del>{study.metric.before}</del>
                        <ArrowRight size={12} aria-hidden="true" />
                        <strong>{study.metric.after}</strong>
                      </span>
                    </div>
                    <span className="cx-readmore">
                      Read case study
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </article>
            )
          })}
        </div>

        <section className="cx-cta">
          <div className="cx-cta-copy">
            <span className="kicker">Your workflow could be next</span>
            <h2>Recognize one of these patterns in your own operations?</h2>
            <p>Bring the workflow that costs you the most time. We will map the system around it.</p>
          </div>
          <a className="primary-button" href="/consulting-intake">
            Book a systems consult <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  )
}

// Scroll-reveal wrapper: an IntersectionObserver toggles a CSS class that drives
// a compositor transition. Content reveals once on first view, and is shown
// immediately when the observer is unavailable or reduced motion is preferred.
function Reveal({ as: Tag = 'div', className, children, delay = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!node || prefersReduced || !('IntersectionObserver' in window)) {
      setShown(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

// Renders a WebP source with a JPEG fallback. `src` is the .jpg path; the .webp
// sibling is served to browsers that support it.
function Photo({ src, alt, width, height, loading = 'lazy' }) {
  const webp = src.replace(/\.jpg$/, '.webp')
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  )
}

const serviceCategories = [
  {
    num: '01',
    title: 'AI & Automation',
    image: '/images/services/ai-automation.jpg',
    alt: 'Abstract 3D rendering of the letters A I over a connected network',
    copy: 'AI assistants, chatbots, document processing, and content generation - plus automation of approvals, notifications, reporting, and repetitive back-office work using n8n, APIs, and the tools you already run.',
    points: ['AI assistants & chatbots', 'Lead qualification', 'Document processing', 'Workflow automation'],
    href: '/services/ai-automation',
  },
  {
    num: '02',
    title: 'Custom Software Development',
    image: '/images/services/custom-software.jpg',
    alt: 'Close-up of source code on a dark editor screen',
    copy: 'Web and internal business applications built around how you operate - admin portals, dashboards, CRM, HR, inventory, and sales systems, plus corporate sites and client portals.',
    points: ['Web applications', 'Admin portals & dashboards', 'Client portals', 'API-connected sites'],
    href: '/services/custom-systems',
  },
  {
    num: '03',
    title: 'Business Systems & Internal Tools',
    image: '/images/services/business-systems.jpg',
    alt: 'Analytics dashboard with charts displayed on a laptop screen',
    copy: 'Right-sized systems for SMEs - CRM, sales and quotation tracking, approvals, inventory, HR records, task management, and operational reporting - without enterprise overhead.',
    points: ['CRM & sales tracking', 'Quotation & approvals', 'Inventory & HR records', 'Operational reporting'],
    href: '/business-solutions',
  },
  {
    num: '04',
    title: 'Systems Integration',
    image: '/images/services/systems-integration.jpg',
    alt: 'Server racks connected by colorful network cabling',
    copy: 'Connect the systems you already use so data flows automatically between websites, CRMs, accounting, HR, messaging platforms, databases, forms, and third-party applications.',
    points: ['API integrations', 'Automated data sync', 'Third-party connectors', 'Single source of truth'],
    href: '/consulting-intake',
  },
  {
    num: '05',
    title: 'Software Architecture & Technology Consulting',
    image: '/images/services/software-architecture.jpg',
    alt: 'Person arranging application wireframes and flow diagrams on a wall',
    copy: 'System and database design, API and cloud architecture, scalability and integration planning, technical documentation, and technology-stack guidance for platforms built to last.',
    points: ['System & database design', 'API & cloud architecture', 'Scalability planning', 'Tech-stack guidance'],
    href: '/services/software-architecture',
  },
  {
    num: '06',
    title: 'Project Management & Digital Transformation',
    image: '/images/services/project-delivery.jpg',
    alt: 'Modern office workspace with a laptop by a window',
    copy: 'Requirements, planning, sprints, UAT, and deployment - plus digital-transformation reviews that find where software, automation, or integration can improve day-to-day operations.',
    points: ['Requirements & planning', 'Delivery & UAT', 'Project recovery', 'Transformation roadmaps'],
    href: '/services/technical-advisory',
  },
]

// Interactive self-qualification quiz. Routes the visitor toward a starting
// service and sends the scoped brief into the same n8n intake as the consultation
// form (channel is stamped server-side by the proxy).
const scoperSteps = [
  {
    key: 'orgType',
    question: 'What kind of organization are you?',
    options: [
      'Small or medium business',
      'Growing company',
      'Startup or entrepreneur',
      'Enterprise or internal team',
    ],
  },
  {
    key: 'challenge',
    question: 'What is slowing you down the most right now?',
    options: [
      'Manual, repetitive work',
      'Disconnected tools and data',
      'No system for a key workflow',
      'Poor reporting and visibility',
      'Not sure yet',
    ],
  },
  {
    key: 'focus',
    question: 'What are you hoping to build or improve?',
    options: [
      'AI and automation',
      'Custom software or an internal tool',
      'A business system (CRM, inventory, HR)',
      'Connecting systems together',
      'Architecture and technology advice',
      'Not sure yet',
    ],
  },
  {
    key: 'timeline',
    question: 'How soon do you want to move?',
    options: ['As soon as possible', 'In the next 1 to 3 months', 'Exploring options for now'],
  },
]

const focusToService = {
  'AI and automation': 'AI & Automation',
  'Custom software or an internal tool': 'Custom Software Development',
  'A business system (CRM, inventory, HR)': 'Business Systems & Internal Tools',
  'Connecting systems together': 'Systems Integration',
  'Architecture and technology advice': 'Software Architecture & Technology Consulting',
  'Not sure yet': 'a tailored engagement',
}

function ProjectScoper() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | submitted | error
  const [errorMsg, setErrorMsg] = useState('')

  const totalSteps = scoperSteps.length + 1 // question steps + contact step
  const isContact = step === scoperSteps.length
  const current = scoperSteps[step]
  const recommended = focusToService[answers.focus] || 'a tailored engagement'

  const choose = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setStep((s) => s + 1)
  }
  const back = () => setStep((s) => Math.max(0, s - 1))
  const restart = () => {
    setStep(0)
    setAnswers({})
    setName('')
    setEmail('')
    setNote('')
    setStatus('idle')
    setErrorMsg('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'submitting') return
    const cleanEmail = email.trim()
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setStatus('error')
      setErrorMsg('Enter a valid business email, like name@company.com.')
      return
    }

    setStatus('submitting')
    setErrorMsg('')
    const endpoint = import.meta.env.VITE_CONSULTATION_ENDPOINT || '/api/consultation'
    const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://abbadev.com/'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Project Scoper visitor',
          email: cleanEmail,
          message: note.trim(),
          formType: 'project-scoper',
          orgType: answers.orgType || '',
          challenge: answers.challenge || '',
          focus: answers.focus || '',
          timeline: answers.timeline || '',
          recommendedService: recommended,
          source: 'abbadev.com',
          pageUrl,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error(`Scoper failed with status ${response.status}`)
      setStatus('submitted')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMsg('That could not be sent right now. Please try again, or use the consultation form.')
    }
  }

  const progress = status === 'submitted' ? totalSteps : step
  const pct = Math.round((progress / totalSteps) * 100)

  return (
    <section className="scoper" aria-label="Project scoper">
      <Reveal className="scoper-intro">
        <span className="kicker">Self-qualify in 30 seconds</span>
        <h2>Not sure which service fits? Let us scope it.</h2>
        <p>
          Answer a few quick questions and we will point you to the right starting point, then route
          your brief to a systems architect. No obligation.
        </p>
      </Reveal>

      <Reveal className="scoper-panel" delay={100}>
        {status !== 'submitted' && (
          <div className="scoper-progress" aria-hidden="true">
            <span className="scoper-progress-bar" style={{ width: `${pct}%` }} />
          </div>
        )}

        {status === 'submitted' ? (
          <div className="scoper-result">
            <span className="scoper-result-icon" aria-hidden="true">
              <CheckCircle2 size={26} />
            </span>
            <h3>Brief received. Thank you.</h3>
            <p>
              Based on your answers, <strong>{recommended}</strong> looks like the right place to
              start. A systems architect will review your brief and reply within one business day.
            </p>
            <div className="scoper-result-actions">
              <a className="primary-button" href="/cases">
                See related work <ArrowRight size={17} aria-hidden="true" />
              </a>
              <button type="button" className="scoper-restart" onClick={restart}>
                Start over
              </button>
            </div>
          </div>
        ) : isContact ? (
          <form className="scoper-body" onSubmit={submit}>
            <div className="scoper-step-head">
              <span className="scoper-step-count">Step {step + 1} of {totalSteps}</span>
              <h3>Where should we send your scoped brief?</h3>
            </div>
            {(answers.orgType || answers.challenge || answers.focus || answers.timeline) && (
              <div className="scoper-summary">
                {scoperSteps.map((s) =>
                  answers[s.key] ? (
                    <span key={s.key} className="scoper-tag">
                      {answers[s.key]}
                    </span>
                  ) : null,
                )}
              </div>
            )}
            <div className="scoper-fields">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label>
                <span>Business email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                <span>Anything else? (optional)</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="A sentence about the workflow or problem you want to solve."
                />
              </label>
            </div>
            {status === 'error' && (
              <p className="scoper-error" role="alert">
                {errorMsg}
              </p>
            )}
            <div className="scoper-nav">
              <button type="button" className="scoper-back" onClick={back} disabled={status === 'submitting'}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
              <button type="submit" className="primary-button" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  'Sending...'
                ) : (
                  <>
                    Send my brief <Send size={16} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="scoper-body">
            <div className="scoper-step-head">
              <span className="scoper-step-count">Step {step + 1} of {totalSteps}</span>
              <h3>{current.question}</h3>
            </div>
            <div className="scoper-options">
              {current.options.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`scoper-option${answers[current.key] === option ? ' is-selected' : ''}`}
                  onClick={() => choose(current.key, option)}
                >
                  <span>{option}</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
            {step > 0 && (
              <div className="scoper-nav">
                <button type="button" className="scoper-back" onClick={back}>
                  <ArrowLeft size={16} aria-hidden="true" /> Back
                </button>
              </div>
            )}
          </div>
        )}
      </Reveal>
    </section>
  )
}

function ServicesPage({ theme, setTheme }) {
  return (
    <div className="site-shell case-page-shell content-page-shell services-page-shell">
      <CasePageHeader theme={theme} setTheme={setTheme} />

      <main className="case-page-main services-page-main">
        <Breadcrumbs crumbs={[['Home', '/'], ['Services', null]]} />

        <section className="services-hero">
          <Reveal className="services-hero-copy">
            <span className="content-page-icon" aria-hidden="true">
              <Blocks size={24} />
            </span>
            <span className="kicker">Services</span>
            <h1>Design, build, automate, and improve the systems you use every day.</h1>
            <p>
              From AI-powered automation and custom software to business systems, integrations,
              architecture, and technology project management, ABBADev turns operational problems
              into practical digital solutions.
            </p>
            <div className="content-page-actions">
              <a className="primary-button" href="/#contact">
                Book a consult <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="secondary-button" href="/cases">
                Review proof <FileText size={17} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
          <Reveal className="services-hero-media" delay={120}>
            <Photo
              src="/images/services/hero.jpg"
              alt="A team collaborating around laptops at a shared workspace"
              width="1200"
              height="800"
              loading="eager"
            />
            <span className="services-hero-badge">
              <Sparkles size={15} aria-hidden="true" />
              Technology Solutions Partner for SMEs
            </span>
          </Reveal>
        </section>

        <Reveal as="section" className="services-positioning">
          <span className="kicker">Where ABBADev fits</span>
          <p>
            More than a software company - a <strong>technology solutions partner for SMEs</strong>,
            combining software, AI, automation, and project management. Start with a chatbot, a
            report, or a broken workflow; grow into the platform your operations actually need.
          </p>
        </Reveal>

        <section className="services-grid" aria-label="Service categories">
          {serviceCategories.map((service) => (
            <Reveal as="article" className="services-card" key={service.title}>
              <a className="services-card-link" href={service.href} aria-label={service.title}>
                <div className="services-card-media">
                  <Photo src={service.image} alt={service.alt} width="1200" height="800" />
                  <span className="services-card-num" aria-hidden="true">{service.num}</span>
                </div>
                <div className="services-card-body">
                  <h2>{service.title}</h2>
                  <p>{service.copy}</p>
                  <ul className="services-points">
                    {service.points.map((point) => (
                      <li key={point}>
                        <Check size={15} aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="services-card-more">
                    Explore <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </section>

        <ProjectScoper />

        <section className="services-training">
          <Reveal className="services-training-media">
            <Photo
              src="/images/services/training.jpg"
              alt="A presenter leading a workshop for a seated audience"
              width="1200"
              height="800"
            />
          </Reveal>
          <Reveal className="services-training-copy" delay={100}>
            <span className="kicker">Training & workshops</span>
            <h2>Build capability inside the team, not just software.</h2>
            <p>
              Seminars, webinars, and customized corporate training on AI for business, automation,
              software development, project management, and practical digital transformation - so
              your people can carry the momentum forward.
            </p>
            <div className="services-training-tags">
              {['AI for business', 'Automation', 'Software delivery', 'Digital transformation'].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a className="secondary-button" href="/register">
              Browse upcoming sessions <ArrowRight size={17} aria-hidden="true" />
            </a>
          </Reveal>
        </section>

        <Reveal as="section" className="case-page-cta services-cta">
          <div>
            <span className="kicker">Start with one problem</span>
            <h2>A chatbot, a report, a broken workflow - bring the one that costs you most.</h2>
            <p>
              Tell us what you want to improve and we will map the software, automation, or
              integration path around it.
            </p>
          </div>
          <a className="primary-button" href="/#contact">
            Book a consult <ArrowRight size={18} aria-hidden="true" />
          </a>
        </Reveal>
      </main>
    </div>
  )
}

const aboutCapabilities = [
  {
    icon: BrainCircuit,
    title: 'AI & intelligent automation',
    copy: 'Put AI where it removes repetitive work - assistance, lead qualification, follow-ups, document processing, and reporting - with human judgment kept in control.',
  },
  {
    icon: Workflow,
    title: 'Business process automation',
    copy: 'Connect websites, databases, email, messaging, CRMs, and APIs so intake, approvals, and handoffs move without manual re-entry.',
  },
  {
    icon: Code2,
    title: 'Custom software development',
    copy: 'CRM, sales, HRIS, inventory, operations, dashboards, and internal apps built around how the organization actually works.',
  },
  {
    icon: Network,
    title: 'Software architecture',
    copy: 'Systems designed for scalability, maintainability, and security so a platform can grow without becoming expensive to maintain later.',
  },
  {
    icon: ListChecks,
    title: 'Project management & delivery',
    copy: 'Discovery through deployment, managed with clear scope, stakeholder visibility, and defined goals - where most projects actually succeed or fail.',
  },
]

const aboutApproach = [
  ['Understand before we build', 'Start with the problem, the users, the workflow, and the outcome you actually want.'],
  ['Simplify before we automate', 'Automating a broken process only makes it fail faster. Where possible, we fix the workflow first.'],
  ['Automate what makes sense', 'Remove unnecessary work while keeping people involved where judgment and accountability matter.'],
  ['Build for growth', 'Systems should be able to evolve as the organization grows, not get rebuilt every year.'],
  ['Measure the outcome', 'Success shows up as real gains in efficiency, visibility, accuracy, or operating capability.'],
]

const aboutVisionMission = [
  {
    label: 'Our vision',
    copy: 'To help businesses and communities confidently adopt technology, automation, and AI to create better ways of working.',
  },
  {
    label: 'Our mission',
    copy: 'To design practical, scalable, and accessible technology that simplifies operations, empowers people, and helps organizations grow.',
  },
]

const aboutValues = [
  { icon: CircleDot, title: 'Purpose', copy: 'Technology should solve meaningful problems, not add to them.' },
  { icon: Sparkles, title: 'Excellence', copy: 'Solutions are thoughtfully designed and professionally delivered.' },
  { icon: ShieldCheck, title: 'Integrity', copy: 'Trust, transparency, and responsible technology come first.' },
  { icon: GraduationCap, title: 'Continuous learning', copy: 'Technology changes constantly, and we keep learning with it.' },
  { icon: CheckCircle2, title: 'Service', copy: 'Technology matters when it improves the work of the people using it.' },
  { icon: Wand2, title: 'Innovation', copy: 'We stay open to better tools, approaches, and ways of solving problems.' },
]

const aboutSegments = [
  {
    icon: Blocks,
    title: 'Small & medium enterprises',
    copy: 'Replace spreadsheets, paper processes, and disconnected tools with systems that fit how the team works.',
  },
  {
    icon: Workflow,
    title: 'Growing companies',
    copy: 'Already running multiple applications, now needing automation, integrations, reporting, or custom software.',
  },
  {
    icon: Sparkles,
    title: 'Entrepreneurs & startups',
    copy: 'Turn an idea into a working application or digital product with the right foundation from day one.',
  },
  {
    icon: Radar,
    title: 'Digital transformation',
    copy: 'Organizations modernizing existing processes and technology infrastructure in phases teams can adopt.',
  },
  {
    icon: GraduationCap,
    title: 'Students & professionals',
    copy: 'Individuals learning how AI, software, project management, and modern practices apply in the real world.',
  },
]

// Placeholder sessions - replace `date`, `time`, `location`, and `price` with
// real events. `audience` drives the filter and the registration form: use
// 'Students', 'SME owners', or both. `type` is Webinar | Seminar | Workshop;
// `mode` is Online | In-person (add `location` for in-person sessions).
const eventOfferings = [
  {
    id: 'idea-to-intelligent-system',
    title: 'From Idea to Intelligent System',
    type: 'Seminar',
    mode: 'In-person',
    location: 'Twinniz Cafe, Olongapo',
    audience: ['Students', 'SME owners'],
    date: 'Sep 5, 2026',
    time: '2:00 PM PHT',
    duration: '3 hours',
    level: 'Beginner',
    price: '₱399',
    // Paid seminar: register through the dedicated two-step reserve-then-pay
    // funnel instead of the simple n8n form.
    externalUrl: '/seminar',
    blurb: 'Transform ideas into intelligent systems using AI, modern software development, and structured project delivery - the practical tools and best practices that turn concepts into real, measurable impact.',
  },
  {
    id: 'first-chatbot',
    title: 'Build Your First AI Chatbot',
    type: 'Workshop',
    mode: 'Online',
    audience: ['Students', 'SME owners'],
    date: 'Oct 8, 2026',
    time: '10:00 AM PHT',
    duration: '3 hours',
    level: 'Hands-on',
    price: '₱750',
    blurb: 'A hands-on session building and deploying a working chatbot from scratch - no prior AI experience required.',
  },
  {
    id: 'intro-software-dev',
    title: 'Intro to Software Development',
    type: 'Seminar',
    mode: 'In-person',
    location: 'Metro Manila',
    audience: ['Students'],
    date: 'Oct 18, 2026',
    time: '9:00 AM PHT',
    duration: 'Half day',
    level: 'Beginner',
    price: 'Free',
    blurb: 'How real software gets built - languages, tools, and the path from idea to shipped app - for students exploring a tech career.',
  },
  {
    id: 'digital-transformation-smes',
    title: 'Digital Transformation for SMEs',
    type: 'Seminar',
    mode: 'In-person',
    location: 'Metro Manila',
    audience: ['SME owners'],
    date: 'Nov 5, 2026',
    time: '1:00 PM PHT',
    duration: 'Half day',
    level: 'Intermediate',
    price: '₱1,200',
    blurb: 'Move from spreadsheets and manual steps to connected systems - a practical roadmap you can adopt in phases.',
  },
  {
    id: 'no-code-automation',
    title: 'No-Code Automation with n8n',
    type: 'Workshop',
    mode: 'Online',
    audience: ['Students', 'SME owners'],
    date: 'Nov 19, 2026',
    time: '2:00 PM PHT',
    duration: '3 hours',
    level: 'Hands-on',
    price: '₱750',
    blurb: 'Connect apps and automate approvals, notifications, and data entry visually - build a real working workflow live.',
  },
  {
    id: 'project-management',
    title: 'Project Management Fundamentals',
    type: 'Webinar',
    mode: 'Online',
    audience: ['Students', 'SME owners'],
    date: 'Dec 3, 2026',
    time: '3:00 PM PHT',
    duration: '2 hours',
    level: 'Beginner',
    price: 'Free',
    blurb: 'Scope, planning, and delivery basics that keep technology projects on track - for aspiring PMs and owners alike.',
  },
]

const eventTypeIcon = { Webinar: BookOpen, Seminar: Users, Workshop: Wand2 }

const registerFilters = [
  { key: 'all', label: 'All sessions' },
  { key: 'Students', label: 'For students' },
  { key: 'SME owners', label: 'For SME owners' },
]

const registerBenefits = [
  'Practical, hands-on content you can apply the next day',
  'Sessions sized for both students and business owners',
  'Live Q&A with a working technology practitioner',
  'A certificate of participation on request',
]

function RegisterPage({ theme, setTheme }) {
  const [filter, setFilter] = useState('all')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [audience, setAudience] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [apiEvents, setApiEvents] = useState(null)
  const formRef = useRef(null)

  // Live sessions from the events API (respects the admin's active/featured
  // toggles). Falls back to the built-in list if the API is unset or down.
  useEffect(() => {
    if (!EVENTS_API) return undefined
    let cancelled = false
    fetch(`${EVENTS_API}/api/events`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        if (!cancelled && Array.isArray(data.events)) setApiEvents(data.events)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Normalize both shapes (API `toCard` vs the built-in array) into what the
  // cards + form expect.
  const sessions = (apiEvents ?? eventOfferings).map((event) => ({
    ...event,
    id: event.slug ?? event.id,
    price: event.price ?? event.price_label,
    audience: event.audience ?? [],
  }))

  const visibleEvents =
    filter === 'all'
      ? sessions
      : sessions.filter((event) => event.audience.includes(filter))

  const handleRegister = async (formEvent) => {
    formEvent.preventDefault()
    if (status === 'submitting') return

    const form = formEvent.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    const email = String(payload.email || '').trim()

    if (!EMAIL_PATTERN.test(email)) {
      setStatus('error')
      setMessage('Enter a valid email address, such as name@example.com.')
      return
    }
    if (!audience) {
      setStatus('error')
      setMessage('Let us know whether you are registering as a student or an SME owner.')
      return
    }

    const selected = sessions.find((event) => event.id === selectedEventId)
    setStatus('submitting')
    setMessage('')

    try {
      const endpoint = import.meta.env.VITE_EVENT_ENDPOINT || '/api/event-registration'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          email,
          audience: audience === 'student' ? 'Student' : 'SME owner',
          eventId: selectedEventId || 'notify-next',
          eventTitle: selected ? selected.title : 'Notify me of the next session',
          eventDate: selected ? selected.date : '',
          source: 'abbadev.com',
          pageUrl: typeof window !== 'undefined' ? window.location.href : 'https://abbadev.com/register',
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Registration failed with status ${response.status}`)
      }

      setStatus('submitted')
      setMessage('You are registered. A confirmation with the session details will arrive by email shortly.')
      form.reset()
      setAudience('')
      setSelectedEventId('')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('Registration could not be sent right now. Please try again or email ABBADev directly.')
    }
  }

  return (
    <div className="site-shell case-page-shell content-page-shell register-page-shell">
      <CasePageHeader theme={theme} setTheme={setTheme} />

      <main className="case-page-main register-page-main">
        <Breadcrumbs crumbs={[['Home', '/'], ['Sessions', null]]} />

        <Reveal as="section" className="case-page-hero register-hero">
          <span className="content-page-icon" aria-hidden="true">
            <GraduationCap size={24} />
          </span>
          <span className="kicker">Seminars & webinars</span>
          <h1>Learn practical technology - and put it to work.</h1>
          <p>
            Hands-on sessions on AI, automation, software, and project management for
            <strong> students</strong> starting out and <strong> SME owners</strong> improving how
            their business runs. Pick a session below and reserve your seat.
          </p>
          <ul className="register-benefits">
            {registerBenefits.map((benefit) => (
              <li key={benefit}>
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <section className="register-events" aria-label="Upcoming sessions">
          <div className="register-events-head">
            <h2>Upcoming sessions</h2>
            <div className="register-filter" role="group" aria-label="Filter sessions by audience">
              {registerFilters.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={filter === option.key}
                  className={`register-pill${filter === option.key ? ' is-active' : ''}`}
                  onClick={() => setFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="register-grid">
            {visibleEvents.map((event) => {
              const TypeIcon = eventTypeIcon[event.type] || BookOpen
              const ModeIcon = event.mode === 'Online' ? Video : MapPin
              return (
                <article className="register-event" key={event.id}>
                  <div className="register-event-top">
                    <span className="register-type">
                      <TypeIcon size={14} aria-hidden="true" />
                      {event.type}
                    </span>
                    <span className="register-mode">
                      <ModeIcon size={13} aria-hidden="true" />
                      {event.mode === 'In-person' && event.location ? event.location : event.mode}
                    </span>
                  </div>
                  <h3>{event.title}</h3>
                  {event.blurb && <p>{event.blurb}</p>}
                  <ul className="register-event-meta">
                    <li><Calendar size={14} aria-hidden="true" /> {event.date}</li>
                    <li><Clock size={14} aria-hidden="true" /> {event.time}{event.duration ? ` · ${event.duration}` : ''}</li>
                    {event.audience.length > 0 && <li><Users size={14} aria-hidden="true" /> {event.audience.join(' & ')}</li>}
                  </ul>
                  <div className="register-event-foot">
                    <span className={`register-price${event.price === 'Free' ? ' is-free' : ''}`}>
                      {event.price}
                    </span>
                    <a className="register-select-btn" href={`/seminar?event=${encodeURIComponent(event.id)}`}>
                      Register <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="register-form-section" ref={formRef}>
          <div className="register-form-intro">
            <span className="kicker">Reserve your seat</span>
            <h2>Register in under a minute.</h2>
            <p>
              Fill in your details and we will confirm your spot by email. Not sure which session
              yet? Choose <em>Notify me of the next session</em> and we will keep you posted.
            </p>
            <div className="register-form-note">
              <ShieldCheck size={17} aria-hidden="true" />
              <span>We use your details only to confirm your registration and share session updates.</span>
            </div>
          </div>

          {status === 'submitted' ? (
            <div className="register-success" role="status">
              <span className="register-success-icon" aria-hidden="true">
                <CheckCircle2 size={26} />
              </span>
              <h3>You&apos;re registered</h3>
              <p>{message}</p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setStatus('idle')
                  setMessage('')
                }}
              >
                Register for another session <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <form className="register-form" onSubmit={handleRegister} noValidate>
              <div className="register-field">
                <label htmlFor="reg-name">Full name</label>
                <input id="reg-name" name="name" type="text" autoComplete="name" required placeholder="Juan Dela Cruz" />
              </div>

              <div className="register-field">
                <label htmlFor="reg-email">Email address</label>
                <input id="reg-email" name="email" type="email" autoComplete="email" required placeholder="name@example.com" />
              </div>

              <fieldset className="register-field register-audience">
                <legend>I am registering as a</legend>
                <div className="register-audience-toggle">
                  <button
                    type="button"
                    aria-pressed={audience === 'student'}
                    className={`register-audience-btn${audience === 'student' ? ' is-active' : ''}`}
                    onClick={() => setAudience('student')}
                  >
                    <GraduationCap size={18} aria-hidden="true" />
                    Student
                  </button>
                  <button
                    type="button"
                    aria-pressed={audience === 'sme'}
                    className={`register-audience-btn${audience === 'sme' ? ' is-active' : ''}`}
                    onClick={() => setAudience('sme')}
                  >
                    <Blocks size={18} aria-hidden="true" />
                    SME owner
                  </button>
                </div>
              </fieldset>

              <div className="register-field">
                <label htmlFor="reg-org">
                  {audience === 'student' ? 'School / institution' : audience === 'sme' ? 'Company' : 'School or company'}
                </label>
                <input
                  id="reg-org"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  placeholder={audience === 'student' ? 'Your school or university' : 'Your business name'}
                />
              </div>

              <div className="register-field">
                <label htmlFor="reg-event">Session</label>
                <select
                  id="reg-event"
                  name="eventId"
                  value={selectedEventId}
                  onChange={(changeEvent) => setSelectedEventId(changeEvent.target.value)}
                >
                  <option value="">Notify me of the next session</option>
                  {sessions.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} — {event.date}
                    </option>
                  ))}
                </select>
              </div>

              <div className="register-field">
                <label htmlFor="reg-phone">Phone <span className="register-optional">(optional)</span></label>
                <input id="reg-phone" name="phone" type="tel" autoComplete="tel" placeholder="+63 9XX XXX XXXX" />
              </div>

              <div className="register-field register-field-full">
                <label htmlFor="reg-message">Anything you want to get out of the session? <span className="register-optional">(optional)</span></label>
                <textarea id="reg-message" name="message" rows="3" placeholder="A question, a goal, or a topic you're hoping to cover." />
              </div>

              {status === 'error' && (
                <p className="register-status is-error" role="alert">{message}</p>
              )}

              <button type="submit" className="primary-button register-submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Reserve my seat'}
                {status !== 'submitting' && <ArrowRight size={18} aria-hidden="true" />}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  )
}

function AboutPage({ theme, setTheme }) {
  return (
    <div className="site-shell case-page-shell content-page-shell about-page-shell">
      <CasePageHeader theme={theme} setTheme={setTheme} />

      <main className="case-page-main about-page-main">
        <Breadcrumbs crumbs={[['Home', '/'], ['About', null]]} />

        <section className="case-page-hero about-hero">
          <span className="content-page-icon" aria-hidden="true">
            <ShieldCheck size={24} />
          </span>
          <span className="kicker">About ABBADev</span>
          <h1>Practical technology that moves the business forward.</h1>
          <p>
            ABBADev IT Solutions helps organizations turn business complexity into practical,
            scalable systems - combining AI automation, custom software, software architecture,
            and project delivery so technology fits how you actually operate.
          </p>
          <div className="content-page-actions">
            <a className="primary-button" href="/consulting-intake">
              Start a conversation <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-button" href="/cases">
              Review proof <FileText size={17} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="case-page-section about-lead">
          <span className="kicker">What we&apos;re about</span>
          <h2>Technology should solve real problems - not create more of them.</h2>
          <p>
            Many teams know they need automation, AI, or better systems but do not know where to
            begin. Some still run operations through spreadsheets, chat threads, email, and
            disconnected apps. Others have software that no longer fits the way they work.
          </p>
          <p>
            ABBADev bridges that gap. We learn how you operate today, find where the time goes, and
            design technology around the organization - instead of forcing the organization to fit
            the technology. That can mean automating one repetitive process, or designing an entire
            business platform.
          </p>
        </section>

        <section className="about-section">
          <div className="about-section-head">
            <span className="kicker">What we do</span>
            <h2>From one automated workflow to an entire platform.</h2>
          </div>
          <div className="about-capabilities">
            {aboutCapabilities.map(({ icon: Icon, title, copy }) => (
              <article className="about-capability" key={title}>
                <span className="about-capability-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-founder" aria-label="Meet the founder">
          <div className="about-founder-portrait">
            <img
              src="/images/founder.png"
              alt="Rommel Galisanao, founder of ABBADev IT Solutions"
              width="360"
              height="450"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="about-founder-copy">
            <span className="kicker">Meet the founder</span>
            <h2>Rommel Galisanao</h2>
            <p className="about-founder-role">Founder &amp; Technology Solutions Architect</p>
            <p>
              ABBADev was founded by Rommel Galisanao, whose work spans software engineering,
              project management, team leadership, systems implementation, and business process
              improvement - managing development teams, designing business applications, and
              translating requirements into working software.
            </p>
            <p>
              One pattern kept repeating: most companies do not need more technology - they need
              technology that works better together. That realization shaped ABBADev. Every project
              starts with the organization, its workflow, and the problem to solve, before any
              product or tool is chosen.
            </p>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-head">
            <span className="kicker">Our approach</span>
            <h2>Understand first. Simplify. Then automate.</h2>
          </div>
          <ol className="about-approach">
            {aboutApproach.map(([title, copy], index) => (
              <li className="about-step" key={title}>
                <span className="about-step-num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="about-step-body">
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-philosophy">
          <blockquote className="case-page-quote about-quote">
            <p>
              People + software + automation + AI. The most effective organizations do not replace
              people with AI - they build systems where people and intelligent technology work
              together.
            </p>
            <cite>ABBADev technology philosophy</cite>
          </blockquote>
        </section>

        <section className="about-vm">
          {aboutVisionMission.map(({ label, copy }) => (
            <article className="about-vm-card" key={label}>
              <span className="kicker">{label}</span>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <section className="about-section">
          <div className="about-section-head">
            <span className="kicker">What ABBADev stands for</span>
            <h2>Technology built with purpose.</h2>
          </div>
          <div className="about-values">
            {aboutValues.map(({ icon: Icon, title, copy }) => (
              <article className="about-value" key={title}>
                <span className="about-value-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div className="about-value-body">
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-head">
            <span className="kicker">Who we work with</span>
            <h2>Support at every stage of the technology journey.</h2>
          </div>
          <div className="about-capabilities">
            {aboutSegments.map(({ icon: Icon, title, copy }) => (
              <article className="about-capability" key={title}>
                <span className="about-capability-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <p className="about-segments-note">
            Exploring AI, software, or delivery practices for yourself or your team?
            {' '}
            <a href="/community">See community &amp; learning</a>.
          </p>
        </section>

        <section className="case-page-cta about-cta">
          <div>
            <span className="kicker">Let&apos;s build something useful</span>
            <h2>Start with the problem, not a spec.</h2>
            <p>
              Tell us the workflow you want to improve, and we will help you explore how software,
              automation, or AI can make it possible.
            </p>
          </div>
          <a className="primary-button" href="/consulting-intake">
            Start a conversation <ArrowRight size={18} aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  )
}

// Map a deep URL segment to its parent section page, so a content page two
// levels down (e.g. /services/ai-automation) can show Home / Services / <title>.
const breadcrumbParents = {
  services: ['Services', '/services'],
  insights: ['Insights', '/insights'],
}

function buildBreadcrumbs(page) {
  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') : ''
  const parts = path.split('/').filter(Boolean)
  const crumbs = [['Home', '/']]
  if (parts.length >= 2 && breadcrumbParents[parts[0]]) {
    crumbs.push(breadcrumbParents[parts[0]])
  }
  crumbs.push([page.title, null]) // current page - no link
  return crumbs
}

function Breadcrumbs({ crumbs }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map(([label, href]) =>
        href ? (
          <a key={href} href={href}>
            {label}
          </a>
        ) : (
          <span key="current" aria-current="page">
            {label}
          </span>
        ),
      )}
    </nav>
  )
}

function ContentPage({ page, theme, setTheme }) {
  const PageIcon = page.icon

  return (
    <div className="site-shell case-page-shell content-page-shell">
      <CasePageHeader theme={theme} setTheme={setTheme} />

      <main className="case-page-main content-page-main">
        <Breadcrumbs crumbs={buildBreadcrumbs(page)} />
        <section className="case-page-hero content-page-hero">
          <span className="content-page-icon" aria-hidden="true">
            <PageIcon size={24} />
          </span>
          <span className="kicker">{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
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

        <section className="content-examples-panel">
          <span className="kicker">Where this applies</span>
          <h2>Representative use cases</h2>
          <div className="content-example-list">
            {page.examples.map((item) => (
              <span key={item}>{item}</span>
            ))}
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
      ['All services', '/services'],
      ['AI automation', '/services/ai-automation'],
      ['Software architecture', '/services/software-architecture'],
      ['Custom systems', '/services/custom-systems'],
      ['Technical advisory', '/services/technical-advisory'],
    ],
  },
  {
    title: 'Work',
    links: [
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
      ['Community & learning', '/community'],
      ['Seminars & webinars', '/register'],
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

// Live-product screenshot with a subtle cursor-magnet and an idle float. The
// frame catches the pointer and nudges the image toward it (scaled slightly so
// the shift never reveals an edge); both effects are off under reduced motion.
function CrmShowcase() {
  const frameRef = useRef(null)
  const imgRef = useRef(null)

  const handleMove = (event) => {
    const frame = frameRef.current
    const img = imgRef.current
    if (!frame || !img) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const rect = frame.getBoundingClientRect()
    const relX = event.clientX - (rect.left + rect.width / 2)
    const relY = event.clientY - (rect.top + rect.height / 2)
    const cap = 16
    const x = Math.max(-cap, Math.min(cap, relX * 0.05))
    const y = Math.max(-cap, Math.min(cap, relY * 0.05))
    img.style.transform = `translate(${x}px, ${y}px) scale(1.045)`
  }

  const handleLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = ''
  }

  return (
    <div className="crm-float">
      <div
        ref={frameRef}
        className="crm-shot"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <picture>
          <source srcSet="/images/mockup_crm.webp" type="image/webp" />
          <img
            ref={imgRef}
            className="crm-shot-img"
            src="/images/mockup_crm.png"
            alt="The ABBADev CRM dashboard running in production"
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Standalone Facebook-ad landing page (/seminar)
//
// A single-offer conversion page for cold traffic coming from a paid FB post.
// Deliberately distraction-free: no main nav, no chat widget, one call to
// action (reserve a seat), and a reserve-then-pay flow. Edit `seminar` to
// change the offer, and update `paymentMethods` with your real GCash
// details before running ads against this page.
const flagshipSeminar = {
  eyebrow: 'ABBADev Live Seminar',
  title: 'From Idea to Intelligent System',
  subtitle: 'AI, Software Development & Project Delivery',
  tagline: 'A practical, beginner-friendly seminar',
  promise:
    'Transform ideas into intelligent systems using AI, modern software development, and structured project delivery. Learn the tools, processes, and best practices that turn concepts into real, measurable impact.',
  date: 'Saturday, September 5, 2026',
  dateShort: 'Sep 5, 2026',
  time: '2:00 PM PHT',
  duration: '3-hour live seminar',
  mode: 'Twinniz Cafe, Olongapo',
  venue: 'Twinniz Cafe, Olongapo City',
  venueNote: 'Held at Twinniz Cafe, Olongapo City. Directions are emailed to you once your seat is confirmed.',
  price: '₱399',
  originalPrice: '₱500',
  discountNote: 'Save ₱101',
  priceNote: 'Includes a free snack',
  capacity: 40,
  // Countdown target: Sept 5, 2026 at 2:00 PM Philippine time (UTC+8).
  startsAtIso: '2026-09-05T14:00:00+08:00',
}

// Map an events-API card (GET /api/events) into the seminar-shaped object the
// landing page renders. Fields with no API equivalent are left null and
// null-guarded in the JSX so a non-flagship event shows a lean page.
function mapEventToSeminar(event) {
  return {
    eyebrow: `ABBADev Live ${event.type || 'Event'}`,
    title: event.title,
    subtitle: null,
    tagline: event.level || null,
    promise: event.blurb || '',
    date: event.date,
    dateShort: event.date,
    time: event.time,
    duration: event.duration,
    mode: event.mode === 'In-person' && event.location ? event.location : event.mode,
    venueNote: '',
    price: event.price_label,
    originalPrice: null,
    discountNote: null,
    priceNote: null,
    capacity: null,
    startsAtIso: event.starts_at,
    isFree: event.is_free,
  }
}

const seminarLearn = [
  { icon: BrainCircuit, title: 'AI Fundamentals', copy: 'What AI really is, where it creates value, and where people should stay in control.' },
  { icon: Workflow, title: 'Automation Workflows', copy: 'Connect tools and automate approvals, follow-ups, and repetitive back-office work.' },
  { icon: Wand2, title: 'AI Tools for Productivity', copy: 'The practical assistants and tools that save hours every week — and how to use them well.' },
  { icon: Code2, title: 'Software Development Direction', copy: 'How modern software gets built, and how to choose the right path from idea to shipped app.' },
  { icon: Network, title: 'Intelligent Systems Design', copy: 'Design systems around real workflows, data, and business rules — not hype.' },
  { icon: ListChecks, title: 'Project Delivery with AI', copy: 'Scope, plan, and deliver technology projects that actually reach the finish line.' },
]

const seminarAudience = [
  { icon: GraduationCap, title: 'Students', copy: 'Exploring a tech career and want a practical head start with AI and software.' },
  { icon: Code2, title: 'Developers', copy: 'Ready to add AI, automation, and delivery discipline to your toolkit.' },
  { icon: Users, title: 'Professionals & owners', copy: 'Looking to apply AI and better systems to how your team and business actually run.' },
]

const seminarOutcomes = [
  'A clear mental model of where AI fits in real, everyday work',
  'A practical map from idea → prototype → delivered system',
  'Tools and workflows you can apply the very next day',
  'A certificate of participation on request',
]

const seminarFaq = [
  [
    'Do I need a technical background?',
    'No. The seminar is beginner-friendly and built for students, developers, and professionals alike. We start from the fundamentals and keep everything practical.',
  ],
  [
    'Do I need to bring a laptop?',
    'It is optional — any comfortable gadget will do, so a tablet or phone is fine. A laptop is ideal, though, for following along with the hands-on parts.',
  ],
  [
    'What is included in the ₱399?',
    'Your seat at the 3-hour live seminar, all the session walkthroughs, a free snack, and a certificate of participation on request.',
  ],
  [
    'How does payment work?',
    'Reserve your seat with the form below, then complete the ₱399 payment via GCash using the details we send. Your seat is confirmed once payment is received.',
  ],
  [
    'Where is it held?',
    'In person at Twinniz Cafe, Olongapo City. Directions are emailed to you right after you reserve your seat.',
  ],
  [
    'Are seats really limited?',
    'Yes. This is a hands-on, in-person session with live Q&A, so the room is capped at 40 participants and seats are first come, first served.',
  ],
]

// Replace these placeholders with your real payment details before advertising.
const paymentMethods = [
  { label: 'GCash', value: '0928 320 7029', name: 'ROM***L G.' },
]

// Live countdown to the seminar start. Ticks once a second and reports the
// remaining days/hours/minutes/seconds, plus whether the target has passed.
function useCountdown(targetIso) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: diff === 0,
  }
}

function CountdownUnits({ countdown }) {
  const units = [
    ['Days', countdown.days],
    ['Hours', countdown.hours],
    ['Minutes', countdown.minutes],
    ['Seconds', countdown.seconds],
  ]
  return (
    <div className="lp-countdown" role="timer" aria-label="Time left until the seminar begins">
      {units.map(([label, value]) => (
        <div className="lp-count-unit" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

// Base URL of the abbadev-events Laravel API. When set (via VITE_EVENTS_API),
// the /seminar page uses the real two-step register + receipt-upload flow;
// when empty, it falls back to the simpler reserve-then-pay panel. This lets
// the switchover happen by setting one env var and rebuilding.
const EVENTS_API = (import.meta.env.VITE_EVENTS_API || '').replace(/\/$/, '')

// The event slug this landing page registers for (must exist in the events API).
const SEMINAR_EVENT_SLUG = 'idea-to-intelligent-system'

// Format a Philippine mobile number as the user types → "0917 123 4567".
// Accepts pasted +63/63/9-prefixed forms; the backend normalizes to E.164.
function formatPhMobile(raw) {
  let digits = String(raw).replace(/\D/g, '')
  if (digits.startsWith('63')) digits = '0' + digits.slice(2)
  else if (digits.startsWith('9')) digits = '0' + digits
  digits = digits.slice(0, 11)
  return [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7, 11)].filter(Boolean).join(' ')
}

// Two-step registration against the events API: (1) capture details and create
// a pending registration, (2) upload the GCash receipt + reference for
// verification. On success the seat is held pending manual payment review.
function TwoStepRegister({ seminar, eventSlug }) {
  const [step, setStep] = useState('details') // details | payment | done
  const [registration, setRegistration] = useState(null)
  const [result, setResult] = useState(null)
  const [audience, setAudience] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [message, setMessage] = useState('')

  const audienceLabel = { student: 'Student', developer: 'Developer', professional: 'Professional & owner' }

  // Pull a human-readable message out of a Laravel error response (422 carries
  // { message, errors: { field: [msg] } }).
  const errorMessageFrom = async (response, fallback) => {
    const data = await response.json().catch(() => ({}))
    if (data.errors) {
      const first = Object.values(data.errors)[0]
      if (Array.isArray(first) && first[0]) return first[0]
    }
    return data.message || fallback
  }

  const collectUtm = () => {
    if (typeof window === 'undefined') return {}
    return Object.fromEntries(new URLSearchParams(window.location.search).entries())
  }

  const submitDetails = async (formEvent) => {
    formEvent.preventDefault()
    if (status === 'submitting') return

    const form = formEvent.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    const email = String(payload.email || '').trim()

    if (!EMAIL_PATTERN.test(email)) {
      setStatus('error')
      setMessage('Enter a valid email address, such as name@example.com.')
      return
    }
    if (!audience) {
      setStatus('error')
      setMessage('Let us know whether you are joining as a student, developer, or professional.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch(`${EVENTS_API}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          email,
          event: eventSlug || SEMINAR_EVENT_SLUG,
          audience: audienceLabel[audience] || audience,
          source: 'abbadev.com',
          lead_source: 'fb-ad-landing',
          utm: collectUtm(),
        }),
      })

      if (!response.ok) {
        throw new Error(await errorMessageFrom(response, 'Your registration could not be started right now. Please try again.'))
      }

      const data = await response.json()
      setRegistration(data)
      setStatus('idle')
      // Free events are confirmed by the API immediately — skip the payment step.
      setStep(data.requires_payment === false ? 'done' : 'payment')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage(error.message || 'Your registration could not be started right now. Please try again.')
    }
  }

  const submitPayment = async (formEvent) => {
    formEvent.preventDefault()
    if (status === 'submitting') return

    const formData = new FormData(formEvent.currentTarget)
    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch(`${EVENTS_API}/api/registrations/${registration.registration_id}/payment`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await errorMessageFrom(response, 'Your payment details could not be submitted. Check the receipt file and try again.'))
      }

      setResult(await response.json())
      setStatus('idle')
      setStep('done')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage(error.message || 'Your payment details could not be submitted. Check the receipt file and try again.')
    }
  }

  if (step === 'done') {
    const isFreeConfirmed = registration?.requires_payment === false
    return (
      <div className="lp-pay" role="status">
        <span className="register-success-icon" aria-hidden="true"><CheckCircle2 size={26} /></span>
        {isFreeConfirmed ? (
          <>
            <h3>You&apos;re registered.</h3>
            <p>
              Your seat for <strong>{registration?.event?.title || seminar.title}</strong> is confirmed
              (registration <strong>{registration?.registration_number}</strong>). A confirmation has been
              sent to your email.
            </p>
          </>
        ) : (
          <>
            <h3>Payment received, verification pending</h3>
            <p>
              Thanks! Your registration <strong>{registration?.registration_number}</strong> is in.
              {' '}{result?.message || "We'll verify your payment and email you once your seat is confirmed."}
            </p>
            <p className="lp-pay-note">
              <ShieldCheck size={15} aria-hidden="true" />
              Keep an eye on your inbox. A confirmation with the venue details follows once your GCash payment is verified.
            </p>
          </>
        )}
      </div>
    )
  }

  if (step === 'payment') {
    const pay = registration?.payment || {}
    return (
      <form key="lp-step-payment" className="register-form lp-form" onSubmit={submitPayment} autoComplete="off" noValidate>
        <div className="lp-step-indicator" aria-hidden="true">Step 2 of 2 · Payment</div>

        <div className="lp-gcash-box">
          <span className="lp-gcash-label">Send exactly</span>
          <strong className="lp-gcash-amount">₱{Number(pay.amount ?? seminar.price.replace(/[^\d.]/g, '')).toLocaleString()}</strong>
          <div className="lp-gcash-to">
            <span>{(pay.method || 'GCash').toUpperCase()}</span>
            <strong>{pay.gcash_number}</strong>
            <small>{pay.account_name}</small>
          </div>
          {pay.qr_url && (
            <img className="lp-gcash-qr" src={pay.qr_url} alt="GCash QR code" width="160" height="160" />
          )}
          <p className="lp-gcash-ref">Reservation <strong>{registration?.registration_number}</strong> — use your full name as the payment note.</p>
        </div>

        <div className="register-field">
          <label htmlFor="lp-ref">GCash reference number</label>
          <input id="lp-ref" name="reference_number" type="text" inputMode="numeric" autoComplete="off" data-1p-ignore data-lpignore="true" required placeholder="e.g. 1000123456789" />
        </div>
        <div className="register-field">
          <label htmlFor="lp-amount">Amount you paid (₱)</label>
          <input id="lp-amount" name="amount_submitted" type="number" step="0.01" min="0" autoComplete="off" required defaultValue={pay.amount} />
        </div>
        <div className="register-field register-field-full lp-file-field">
          <label htmlFor="lp-receipt">GCash receipt screenshot</label>
          <input id="lp-receipt" name="receipt" type="file" accept="image/*,application/pdf" required />
          <span className="lp-file-hint">JPG, PNG, or PDF · up to 5 MB</span>
        </div>

        {status === 'error' && (
          <p className="register-status is-error" role="alert">{message}</p>
        )}

        <button type="submit" className="primary-button register-submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit payment for verification'}
          {status !== 'submitting' && <ArrowRight size={18} aria-hidden="true" />}
        </button>
        <p className="lp-form-trust">
          <ShieldCheck size={14} aria-hidden="true" />
          Your seat is confirmed by email once we verify the payment against our GCash records.
        </p>
      </form>
    )
  }

  return (
    <form key="lp-step-details" className="register-form lp-form" onSubmit={submitDetails} noValidate>
      <div className="lp-step-indicator" aria-hidden="true">Step 1 of 2 · Your details</div>
      <div className="register-field">
        <label htmlFor="lp-name">Full name</label>
        <input id="lp-name" name="name" type="text" autoComplete="name" required placeholder="Juan Dela Cruz" />
      </div>
      <div className="register-field">
        <label htmlFor="lp-email">Email address</label>
        <input id="lp-email" name="email" type="email" autoComplete="email" required placeholder="name@example.com" />
      </div>
      <fieldset className="register-field register-audience">
        <legend>I&apos;m joining as a</legend>
        <div className="lp-audience-toggle">
          <button type="button" aria-pressed={audience === 'student'} className={`register-audience-btn${audience === 'student' ? ' is-active' : ''}`} onClick={() => setAudience('student')}>
            <GraduationCap size={17} aria-hidden="true" /> Student
          </button>
          <button type="button" aria-pressed={audience === 'developer'} className={`register-audience-btn${audience === 'developer' ? ' is-active' : ''}`} onClick={() => setAudience('developer')}>
            <Code2 size={17} aria-hidden="true" /> Developer
          </button>
          <button type="button" aria-pressed={audience === 'professional'} className={`register-audience-btn${audience === 'professional' ? ' is-active' : ''}`} onClick={() => setAudience('professional')}>
            <Users size={17} aria-hidden="true" /> Professional
          </button>
        </div>
      </fieldset>
      <div className="register-field">
        <label htmlFor="lp-phone">Mobile number</label>
        <input
          id="lp-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          placeholder="0917 123 4567"
          onInput={(inputEvent) => { inputEvent.currentTarget.value = formatPhMobile(inputEvent.currentTarget.value) }}
        />
      </div>
      <div className="register-field register-field-full">
        <label htmlFor="lp-org">School / company <span className="register-optional">(optional)</span></label>
        <input id="lp-org" name="organization" type="text" autoComplete="organization" placeholder="Where you study or work" />
      </div>

      {status === 'error' && (
        <p className="register-status is-error" role="alert">{message}</p>
      )}

      <button type="submit" className="primary-button register-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Starting…' : seminar.isFree ? 'Complete registration' : 'Continue to payment'}
        {status !== 'submitting' && <ArrowRight size={18} aria-hidden="true" />}
      </button>
      <p className="lp-form-trust">
        <ShieldCheck size={14} aria-hidden="true" />
        We use your details only to confirm your seat and send seminar updates.
      </p>
    </form>
  )
}

function SeminarLandingPage({ theme, setTheme }) {
  // Which event this page is for. No param (or the flagship slug) = the rich
  // flagship page; any other slug = a lean page driven by the events API.
  const eventSlug = useMemo(
    () => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('event')),
    [],
  )
  const isFlagship = !eventSlug || eventSlug === SEMINAR_EVENT_SLUG
  const [apiEvent, setApiEvent] = useState(null)
  // loading | ready | error. Resolved synchronously for the flagship and for the
  // no-API case so the effect never sets state synchronously.
  const [eventState, setEventState] = useState(
    isFlagship ? 'ready' : EVENTS_API ? 'loading' : 'error',
  )

  useEffect(() => {
    if (isFlagship || !EVENTS_API) return undefined
    let cancelled = false
    fetch(`${EVENTS_API}/api/events`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        if (cancelled) return
        const found = (data.events || []).find((event) => event.slug === eventSlug)
        if (!found) {
          setEventState('error')
          return
        }
        setApiEvent(found)
        setEventState('ready')
      })
      .catch(() => {
        if (!cancelled) setEventState('error')
      })
    return () => {
      cancelled = true
    }
  }, [isFlagship, eventSlug])

  const seminar = isFlagship ? flagshipSeminar : apiEvent ? mapEventToSeminar(apiEvent) : flagshipSeminar

  const countdown = useCountdown(seminar.startsAtIso)
  const [audience, setAudience] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | reserved | error
  const [message, setMessage] = useState('')
  const [reservedEmail, setReservedEmail] = useState('')
  const formRef = useRef(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const audienceLabel = { student: 'Student', developer: 'Developer', professional: 'Professional & owner' }

  const handleReserve = async (formEvent) => {
    formEvent.preventDefault()
    if (status === 'submitting') return

    const form = formEvent.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    const email = String(payload.email || '').trim()

    if (!EMAIL_PATTERN.test(email)) {
      setStatus('error')
      setMessage('Enter a valid email address, such as name@example.com.')
      return
    }
    if (!audience) {
      setStatus('error')
      setMessage('Let us know whether you are joining as a student, developer, or professional.')
      return
    }

    // Preserve Facebook / UTM attribution from the ad URL so leads are traceable.
    let utm = {}
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      utm = Object.fromEntries(params.entries())
    }

    setStatus('submitting')
    setMessage('')

    try {
      const endpoint = import.meta.env.VITE_EVENT_ENDPOINT || '/api/event-registration'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          email,
          audience: audienceLabel[audience] || audience,
          eventId: 'idea-to-intelligent-system',
          eventTitle: `${seminar.title} — ${seminar.subtitle}`,
          eventDate: seminar.date,
          price: seminar.price,
          flow: 'reserve-then-pay',
          source: 'abbadev.com',
          // The proxy stamps a server-side `channel` (event), so use a separate
          // field here to tag the FB-ad seminar funnel — it survives the merge.
          leadSource: 'fb-ad-landing',
          utm,
          pageUrl: typeof window !== 'undefined' ? window.location.href : 'https://abbadev.com/seminar',
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Reservation failed with status ${response.status}`)
      }

      setReservedEmail(email)
      setStatus('reserved')
      setMessage('')
      form.reset()
      setAudience('')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('Your reservation could not be sent right now. Please try again or message ABBADev directly.')
    }
  }

  // Non-flagship event: show a loading or not-found shell until the event resolves.
  if (!isFlagship && eventState !== 'ready') {
    return (
      <div className="site-shell lp-shell" data-theme={theme}>
        <header className="lp-header">
          <a className="brand" href="/#top" aria-label="ABBADev IT Solutions home">
            <img className="brand-mark" src="/images/abbadev-logo.png" alt="" width="42" height="42" />
            <span className="brand-wordmark"><strong>ABBADEV</strong><small>IT Solutions</small></span>
          </a>
          <div className="lp-header-right">
            <button
              className="icon-button theme-toggle"
              type="button"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
            </button>
          </div>
        </header>
        <main className="lp-state-main">
          {eventState === 'loading' ? (
            <p className="lp-state-loading">Loading session…</p>
          ) : (
            <div className="lp-state-error">
              <h1>We couldn&apos;t find that session.</h1>
              <p>It may have ended or been unpublished.</p>
              <a className="primary-button" href="/register">
                Browse all sessions <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="site-shell lp-shell" data-theme={theme}>
      <header className="lp-header">
        <a className="brand" href="/#top" aria-label="ABBADev IT Solutions home">
          <img className="brand-mark" src="/images/abbadev-logo.png" alt="" width="42" height="42" />
          <span className="brand-wordmark">
            <strong>ABBADEV</strong>
            <small>IT Solutions</small>
          </span>
        </a>
        <div className="lp-header-right">
          <span className="lp-header-date">
            <Calendar size={15} aria-hidden="true" />
            {seminar.dateShort} · {seminar.time}
          </span>
          <button
            className="icon-button theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
          </button>
          <button type="button" className="primary-button lp-header-cta" onClick={scrollToForm}>
            Reserve — {seminar.price}
          </button>
        </div>
      </header>

      <main className="lp-main">
        {/* Hero ------------------------------------------------------------ */}
        <section className="lp-hero">
          <div className="lp-hero-copy">
            <span className="lp-pill">
              <Sparkles size={14} aria-hidden="true" />
              {seminar.eyebrow}{seminar.tagline ? ` · ${seminar.tagline}` : ''}
            </span>
            <h1 className="lp-hero-title">
              {seminar.title}
              {seminar.subtitle && <span>{seminar.subtitle}</span>}
            </h1>
            <p className="lp-hero-lede">{seminar.promise}</p>

            <div className="lp-hero-highlights">
              {isFlagship ? (
                <>
                  <span><CheckCircle2 size={16} aria-hidden="true" /> For students, developers &amp; professionals</span>
                  <span><CheckCircle2 size={16} aria-hidden="true" /> Beginner-friendly · no prior AI experience</span>
                  <span><CheckCircle2 size={16} aria-hidden="true" /> {seminar.priceNote}</span>
                </>
              ) : (
                <>
                  {seminar.tagline && <span><CheckCircle2 size={16} aria-hidden="true" /> {seminar.tagline}</span>}
                  {seminar.mode && <span><CheckCircle2 size={16} aria-hidden="true" /> {seminar.mode}</span>}
                  <span><CheckCircle2 size={16} aria-hidden="true" /> {seminar.isFree ? 'Free to attend' : `${seminar.price} per seat`}</span>
                </>
              )}
            </div>

            <div className="lp-hero-actions">
              <button type="button" className="primary-button lp-cta-lg" onClick={scrollToForm}>
                Reserve my seat{seminar.isFree ? '' : ` — ${seminar.price}`} <ArrowRight size={18} aria-hidden="true" />
              </button>
              {seminar.capacity && (
                <span className="lp-seats-inline">
                  <Users size={15} aria-hidden="true" />
                  Limited-capacity seminar · Max <strong>{seminar.capacity}</strong> participants
                </span>
              )}
            </div>
          </div>

          <aside className="lp-hero-card" aria-label="Seminar details">
            <div className="lp-card-head">
              <div className="lp-card-price-row">
                {seminar.originalPrice && (
                  <span className="lp-card-price-was">{seminar.originalPrice}</span>
                )}
                <span className="lp-card-price">{seminar.price}</span>
                {seminar.discountNote && (
                  <span className="lp-card-price-save">{seminar.discountNote}</span>
                )}
              </div>
              {seminar.priceNote && <span className="lp-card-price-note">{seminar.priceNote}</span>}
            </div>
            <ul className="lp-card-meta">
              <li><Calendar size={16} aria-hidden="true" /> <span>{seminar.date}</span></li>
              <li><Clock size={16} aria-hidden="true" /> <span>{seminar.time}{seminar.duration ? ` · ${seminar.duration}` : ''}</span></li>
              {seminar.mode && <li><MapPin size={16} aria-hidden="true" /> <span>{seminar.mode}</span></li>}
              {seminar.capacity && <li><Users size={16} aria-hidden="true" /> <span>Maximum of {seminar.capacity} participants</span></li>}
            </ul>
            <div className="lp-card-countdown">
              <span className="lp-card-countdown-label">
                {countdown.expired ? 'Registration closing' : 'Seminar starts in'}
              </span>
              <CountdownUnits countdown={countdown} />
            </div>
            <button type="button" className="primary-button lp-card-cta" onClick={scrollToForm}>
              Reserve my seat <ArrowRight size={17} aria-hidden="true" />
            </button>
            <p className="lp-card-fineprint">
              <ShieldCheck size={14} aria-hidden="true" />
              {seminar.isFree ? 'Free to attend. Reserve your seat now.' : `Reserve now, pay ${seminar.price} by GCash to confirm.`}
            </p>
          </aside>
        </section>

        {/* Urgency strip -------------------------------------------------- */}
        {seminar.capacity && (
          <section className="lp-urgency">
            <span className="lp-urgency-icon" aria-hidden="true"><Users size={22} /></span>
            <div className="lp-urgency-copy">
              <span className="kicker">Limited-capacity seminar</span>
              <strong>Maximum of {seminar.capacity} participants</strong>
            </div>
            <button type="button" className="secondary-button lp-urgency-btn" onClick={scrollToForm}>
              Reserve a seat <ArrowRight size={16} aria-hidden="true" />
            </button>
          </section>
        )}

        {/* Flagship-only marketing sections (learn / audience / outcomes / FAQ) */}
        {isFlagship && (
        <>
        {/* What you'll learn --------------------------------------------- */}
        <section className="lp-section">
          <div className="lp-section-head">
            <span className="kicker">What you&apos;ll learn</span>
            <h2>Six practical building blocks — in one afternoon.</h2>
            <p>Every topic is hands-on and grounded in real work, not theory or hype.</p>
          </div>
          <div className="lp-learn-grid">
            {seminarLearn.map((item) => {
              const Icon = item.icon
              return (
                <article className="lp-learn-card" key={item.title}>
                  <span className="lp-learn-icon" aria-hidden="true"><Icon size={20} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              )
            })}
          </div>
        </section>

        {/* Who it's for --------------------------------------------------- */}
        <section className="lp-section lp-audience-section">
          <div className="lp-section-head">
            <span className="kicker">Who it&apos;s for</span>
            <h2>Built for anyone turning ideas into working systems.</h2>
          </div>
          <div className="lp-audience-grid">
            {seminarAudience.map((item) => {
              const Icon = item.icon
              return (
                <article className="lp-audience-card" key={item.title}>
                  <span className="lp-audience-icon" aria-hidden="true"><Icon size={22} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              )
            })}
          </div>
        </section>

        {/* Outcomes + facilitator ---------------------------------------- */}
        <section className="lp-section lp-outcome-section">
          <div className="lp-outcome-copy">
            <span className="kicker">What you walk away with</span>
            <h2>Leave with a plan you can actually use.</h2>
            <ul className="lp-outcome-list">
              {seminarOutcomes.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="primary-button lp-cta-lg" onClick={scrollToForm}>
              Reserve my seat — {seminar.price} <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
          <aside className="lp-facilitator">
            <span className="kicker">Your facilitator</span>
            <div className="lp-facilitator-head">
              <img src="/images/founder.png" alt="Rommel Galisanao" width="72" height="72" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <div>
                <strong>{founderProfile.name}</strong>
                <span>Founder & Principal Systems Architect</span>
              </div>
            </div>
            <p>{founderProfile.bio}</p>
            <ul className="lp-facilitator-points">
              {founderProfile.points.map((point) => (
                <li key={point}><Check size={15} aria-hidden="true" /> {point}</li>
              ))}
            </ul>
          </aside>
        </section>

        {/* FAQ ------------------------------------------------------------ */}
        <section className="lp-section lp-faq-section">
          <div className="lp-section-head">
            <span className="kicker">Questions</span>
            <h2>Everything you need to know before you reserve.</h2>
          </div>
          <div className="lp-faq-list">
            {seminarFaq.map(([q, a]) => (
              <details className="lp-faq-item" key={q}>
                <summary>{q}<ChevronRight size={18} aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        </>
        )}

        {/* Registration (reserve-then-pay) -------------------------------- */}
        <section className="lp-register" ref={formRef} id="reserve">
          <div className="lp-register-intro">
            <span className="kicker">Reserve your seat</span>
            {seminar.isFree ? (
              <>
                <h2>Register in one step.</h2>
                <p>
                  Fill in your details to reserve a seat. This session is free, and you&apos;ll get a
                  confirmation by email.
                </p>
              </>
            ) : (
              <>
                <h2>Two steps: reserve now, then pay {seminar.price} to confirm.</h2>
                <p>
                  Fill in your details to hold a seat. We&apos;ll email you the GCash payment details,
                  and your spot is locked in once the {seminar.price} lands.
                </p>
              </>
            )}
            <div className="lp-register-meta">
              <span><Calendar size={16} aria-hidden="true" /> {seminar.date}{seminar.time ? ` · ${seminar.time}` : ''}</span>
              {seminar.mode && <span><MapPin size={16} aria-hidden="true" /> {seminar.mode}</span>}
              {seminar.capacity && <span><Users size={16} aria-hidden="true" /> Limited to {seminar.capacity} participants</span>}
            </div>
            <div className="lp-register-countdown">
              <span className="lp-card-countdown-label">
                {countdown.expired ? 'Registration closing' : 'Closes in'}
              </span>
              <CountdownUnits countdown={countdown} />
            </div>
          </div>

          {EVENTS_API ? (
            <TwoStepRegister seminar={seminar} eventSlug={isFlagship ? SEMINAR_EVENT_SLUG : eventSlug} />
          ) : status === 'reserved' ? (
            <div className="lp-pay" role="status">
              <span className="register-success-icon" aria-hidden="true"><CheckCircle2 size={26} /></span>
              <h3>Seat reserved — one step left</h3>
              <p>
                Thanks! We&apos;ve noted your reservation{reservedEmail ? ` for ${reservedEmail}` : ''}.
                Complete your <strong>{seminar.price}</strong> payment to confirm your seat. A
                confirmation with the venue details follows once we receive it.
              </p>
              <div className="lp-pay-methods">
                {paymentMethods.map((method) => (
                  <div className="lp-pay-method" key={method.label}>
                    <span className="lp-pay-label">{method.label}</span>
                    <strong>{method.value}</strong>
                    <small>{method.name}</small>
                  </div>
                ))}
              </div>
              <p className="lp-pay-note">
                <ShieldCheck size={15} aria-hidden="true" />
                Use your full name as the payment reference, then reply to our email with a screenshot of your receipt.
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => { setStatus('idle'); setMessage('') }}
              >
                Reserve another seat <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <form className="register-form lp-form" onSubmit={handleReserve} noValidate>
              <div className="register-field">
                <label htmlFor="lp-name">Full name</label>
                <input id="lp-name" name="name" type="text" autoComplete="name" required placeholder="Juan Dela Cruz" />
              </div>
              <div className="register-field">
                <label htmlFor="lp-email">Email address</label>
                <input id="lp-email" name="email" type="email" autoComplete="email" required placeholder="name@example.com" />
              </div>
              <fieldset className="register-field register-audience">
                <legend>I&apos;m joining as a</legend>
                <div className="lp-audience-toggle">
                  <button type="button" aria-pressed={audience === 'student'} className={`register-audience-btn${audience === 'student' ? ' is-active' : ''}`} onClick={() => setAudience('student')}>
                    <GraduationCap size={17} aria-hidden="true" /> Student
                  </button>
                  <button type="button" aria-pressed={audience === 'developer'} className={`register-audience-btn${audience === 'developer' ? ' is-active' : ''}`} onClick={() => setAudience('developer')}>
                    <Code2 size={17} aria-hidden="true" /> Developer
                  </button>
                  <button type="button" aria-pressed={audience === 'professional'} className={`register-audience-btn${audience === 'professional' ? ' is-active' : ''}`} onClick={() => setAudience('professional')}>
                    <Users size={17} aria-hidden="true" /> Professional
                  </button>
                </div>
              </fieldset>
              <div className="register-field">
                <label htmlFor="lp-phone">Mobile number</label>
                <input id="lp-phone" name="phone" type="tel" autoComplete="tel" required placeholder="+63 9XX XXX XXXX" />
              </div>
              <div className="register-field">
                <label htmlFor="lp-org">School / company <span className="register-optional">(optional)</span></label>
                <input id="lp-org" name="organization" type="text" autoComplete="organization" placeholder="Where you study or work" />
              </div>
              <div className="register-field register-field-full">
                <label htmlFor="lp-goal">What do you want to get out of the seminar? <span className="register-optional">(optional)</span></label>
                <textarea id="lp-goal" name="message" rows="3" placeholder="A goal, a question, or a topic you're hoping to cover." />
              </div>

              {status === 'error' && (
                <p className="register-status is-error" role="alert">{message}</p>
              )}

              <button type="submit" className="primary-button register-submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Reserving…' : `Reserve my seat — ${seminar.price}`}
                {status !== 'submitting' && <ArrowRight size={18} aria-hidden="true" />}
              </button>
              <p className="lp-form-trust">
                <ShieldCheck size={14} aria-hidden="true" />
                We use your details only to confirm your seat and send seminar updates.
              </p>
            </form>
          )}
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <a className="brand" href="/#top" aria-label="ABBADev IT Solutions home">
            <img className="brand-mark" src="/images/abbadev-logo.png" alt="" width="36" height="36" />
            <span className="brand-wordmark">
              <strong>ABBADEV</strong>
              <small>IT Solutions</small>
            </span>
          </a>
          <p className="lp-footer-legal">
            © 2026 ABBADev IT Solutions. This seminar is independent and not affiliated with or
            endorsed by Meta. Seats are limited and payment confirms your reservation.
          </p>
          <nav className="lp-footer-links">
            <a href="/#top">Home</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Legal pages (/privacy, /terms)
//
// Plain-language Privacy Policy and Terms of Service for the ABBADev seminar
// funnel, written for the Philippine Data Privacy Act (RA 10173). Update
// LEGAL_CONTACT and the effective date if the operating details change.
const LEGAL_CONTACT = 'info@abbadev.com'
const LEGAL_UPDATED = 'August 31, 2026'

const privacyDoc = {
  title: 'Privacy Policy',
  updated: LEGAL_UPDATED,
  intro:
    'ABBADev IT Solutions ("ABBADev", "we", "us") respects your privacy. This policy explains what personal information we collect when you reserve a seat at our seminars or use this website, how we use it, and the rights you have under the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).',
  sections: [
    {
      h: '1. Information we collect',
      p: ['When you reserve a seat or contact us, we collect the details you provide, which may include:'],
      ul: [
        'Your name, email address, and mobile number',
        'Your school or company, and whether you are joining as a student, developer, or professional',
        'Any goals, questions, or notes you choose to share in the form',
        'Attribution data from the link you arrived through (for example, Facebook and UTM campaign parameters)',
      ],
      after: [
        'Seminar fees are paid directly through GCash. We do not collect or store your card, wallet PIN, or banking credentials — those are handled by the payment app you use.',
      ],
    },
    {
      h: '2. How we use your information',
      p: ['We use the information you provide to:'],
      ul: [
        'Confirm your reservation and send you the venue details, payment instructions, and schedule',
        'Contact you about the seminar you registered for, including changes or reminders',
        'Respond to your questions and, if you agree, send occasional updates about future sessions',
        'Understand which campaigns bring people to our seminars so we can improve them',
      ],
    },
    {
      h: '3. Cookies and advertising pixels',
      p: [
        'This website uses first-party cookies to keep the site working. If we run ads, we may use the Meta (Facebook) Pixel and Conversion API to measure the performance of our campaigns; these may set cookies such as _fbp and _fbc and share hashed contact details with Meta.',
        'You can control or opt out of ad tracking through your Facebook ad preferences and your browser settings without affecting your ability to register.',
      ],
    },
    {
      h: '4. When we share information',
      p: ['We do not sell your personal information. We share it only where necessary to run the seminar:'],
      ul: [
        'With service providers that help us send email and process registrations (for example, our automation and email tools), under confidentiality obligations',
        'With your payment provider (GCash) when you choose to pay — you interact with them directly',
        'When required by law, regulation, or a valid legal request',
      ],
    },
    {
      h: '5. Your rights under RA 10173',
      p: [
        'As a data subject, you have the right to be informed, to access, to correct, to object, to erasure or blocking, to data portability, and to damages. To exercise any of these, email us at ' +
          LEGAL_CONTACT +
          ' and we will respond within a reasonable period (generally 15 working days).',
        'If you believe your rights have been violated, you may file a complaint with the National Privacy Commission at privacy.gov.ph.',
      ],
    },
    {
      h: '6. How long we keep your information',
      p: [
        'We keep your information only as long as needed to deliver the seminar and stay in touch about related sessions, unless a longer period is required by law. Records that are no longer needed are securely deleted.',
      ],
    },
    {
      h: '7. How we protect your information',
      p: [
        'We apply reasonable organizational and technical measures to protect your information. No method of transmission or storage is completely secure, but we work to keep your data safe and to limit access to it.',
      ],
    },
    {
      h: '8. Changes to this policy',
      p: [
        'We may update this policy from time to time. The latest version will always be posted on this page with a new effective date.',
      ],
    },
    {
      h: '9. Contact us',
      p: [
        'For any privacy question or request, email ABBADev IT Solutions at ' + LEGAL_CONTACT + '.',
      ],
    },
  ],
}

const termsDoc = {
  title: 'Terms of Service',
  updated: LEGAL_UPDATED,
  intro:
    'These Terms of Service govern your registration for and attendance at seminars offered by ABBADev IT Solutions ("ABBADev", "we", "us"), including "From Idea to Intelligent System", and your use of this website. Please read them before you reserve a seat.',
  sections: [
    {
      h: '1. Agreement',
      p: [
        'By reserving a seat, paying the seminar fee, or attending, you agree to these Terms. If you do not agree, please do not register or attend.',
      ],
    },
    {
      h: '2. What you are registering for',
      p: [
        'You are registering for a live, in-person seminar. Unless stated otherwise on this page, the session is a 3-hour seminar held at Twinniz Cafe, Olongapo City, and includes a snack. Dates, times, and the venue are as shown on the registration page and in your confirmation.',
      ],
    },
    {
      h: '3. Reservation and payment',
      p: [
        'Seats are reserved on a first-come, first-served basis and are limited (maximum of 40 participants). Reserving through the form holds a seat; your reservation is confirmed only once the seminar fee is received via GCash using the details we send. If payment is not completed before the seminar fills or begins, your reservation may be released.',
      ],
    },
    {
      h: '4. Cancellations, refunds, and transfers',
      p: ['Our aim is to be fair to both attendees and to the participants waiting for a limited seat:'],
      ul: [
        'If ABBADev cancels or reschedules the seminar and you cannot attend the new date, you may request a full refund of the fee you paid.',
        'If you notify us at least 3 days before the seminar that you cannot attend, you may request a refund or transfer your seat to another session or another person.',
        'Cancellations made less than 3 days before the seminar, and no-shows, are generally non-refundable, though your paid seat may be transferred to another person.',
        'To request a refund or transfer, email ' + LEGAL_CONTACT + ' with your name and reservation details.',
      ],
    },
    {
      h: '5. Use of seminar materials',
      p: [
        'Any materials shared during the seminar are provided for your personal and internal business use. You may not resell, republish, record, or publicly distribute them without our written permission.',
      ],
    },
    {
      h: '6. No guarantee of results',
      p: [
        'The seminar is educational. Outcomes depend on your own effort, situation, and many factors outside our control, so we do not guarantee any specific result, income, or business outcome.',
      ],
    },
    {
      h: '7. Limitation of liability',
      p: [
        'To the fullest extent permitted by law, ABBADev’s total liability arising from your registration or attendance is limited to the amount you paid for the seminar. We are not liable for indirect or consequential losses.',
      ],
    },
    {
      h: '8. Governing law',
      p: [
        'These Terms are governed by the laws of the Republic of the Philippines. Any dispute will be handled by the courts with proper jurisdiction in Olongapo City / Zambales.',
      ],
    },
    {
      h: '9. Changes to these Terms',
      p: [
        'We may update these Terms from time to time. The current version is always posted on this page with its effective date, and registered attendees may be notified of material changes.',
      ],
    },
    {
      h: '10. Independence and third parties',
      p: [
        'ABBADev IT Solutions is an independent business. This seminar is not affiliated with, endorsed by, or sponsored by Meta (Facebook), Anthropic, GCash, or any other third-party platform mentioned. All trademarks belong to their respective owners.',
      ],
    },
    {
      h: '11. Contact us',
      p: ['Questions about these Terms? Email ABBADev IT Solutions at ' + LEGAL_CONTACT + '.'],
    },
  ],
}

function LegalPage({ doc, theme, setTheme }) {
  return (
    <div className="site-shell lp-shell">
      <header className="lp-header">
        <a className="brand" href="/#top" aria-label="ABBADev IT Solutions home">
          <img className="brand-mark" src="/images/abbadev-logo.png" alt="" width="42" height="42" />
          <span className="brand-wordmark">
            <strong>ABBADEV</strong>
            <small>IT Solutions</small>
          </span>
        </a>
        <div className="lp-header-right">
          <button
            className="icon-button theme-toggle"
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
          </button>
          <a className="secondary-button lp-header-cta" href="/seminar">Back to seminar</a>
        </div>
      </header>

      <main className="lp-legal">
        <a className="case-page-back" href="/seminar">Back to the seminar</a>
        <header className="lp-legal-head">
          <span className="kicker">ABBADev IT Solutions</span>
          <h1>{doc.title}</h1>
          <p className="lp-legal-updated">Effective date: {doc.updated}</p>
          <p className="lp-legal-intro">{doc.intro}</p>
        </header>

        {doc.sections.map((section) => (
          <section className="lp-legal-section" key={section.h}>
            <h2>{section.h}</h2>
            {section.p?.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {section.ul && (
              <ul>
                {section.ul.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.after?.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </section>
        ))}
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <a className="brand" href="/#top" aria-label="ABBADev IT Solutions home">
            <img className="brand-mark" src="/images/abbadev-logo.png" alt="" width="36" height="36" />
            <span className="brand-wordmark">
              <strong>ABBADEV</strong>
              <small>IT Solutions</small>
            </span>
          </a>
          <p className="lp-footer-legal">© 2026 ABBADev IT Solutions. All rights reserved.</p>
          <nav className="lp-footer-links">
            <a href="/seminar">Seminar</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

// Homepage "Featured sessions" band. Fetches the admin-curated featured events
// from the events API (max 3). Shows a skeleton while loading and hides itself
// entirely if the API is unreachable or returns nothing, so the static
// homepage never breaks. Each card routes to the funnel for that session.
function FeaturedSessions() {
  const [status, setStatus] = useState(EVENTS_API ? 'loading' : 'hidden') // loading | ready | hidden
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!EVENTS_API) return undefined
    let cancelled = false
    fetch(`${EVENTS_API}/api/events?featured=1`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data.events) ? data.events : []
        setEvents(list)
        setStatus(list.length ? 'ready' : 'hidden')
      })
      .catch(() => {
        if (!cancelled) setStatus('hidden')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'hidden') return null

  return (
    <section className="section featured-section" id="sessions" aria-label="Upcoming sessions">
      <Reveal className="featured-lead">
        <span className="kicker">Learn with ABBADev</span>
        <h2>Seminars, workshops, and webinars: practical and hands-on.</h2>
        <p>
          Live sessions on AI, automation, software, and delivery for students, developers,
          and SME owners. Reserve a seat, or see everything coming up.
        </p>
      </Reveal>

      <div className="featured-grid">
        {status === 'loading'
          ? [0, 1, 2].map((index) => (
              <div className="featured-card featured-card--skeleton" key={index} aria-hidden="true">
                <span className="fc-skel fc-skel-badge" />
                <span className="fc-skel fc-skel-title" />
                <span className="fc-skel fc-skel-line" />
                <span className="fc-skel fc-skel-line short" />
              </div>
            ))
          : events.map((event) => {
              const TypeIcon = eventTypeIcon[event.type] || BookOpen
              const ModeIcon = event.mode === 'Online' ? Video : MapPin
              return (
                <Reveal as="article" className="featured-card" key={event.slug}>
                  <div className="featured-card-top">
                    <span className="featured-type">
                      <TypeIcon size={14} aria-hidden="true" />
                      {event.type}
                    </span>
                    <span className="featured-mode">
                      <ModeIcon size={13} aria-hidden="true" />
                      {event.mode === 'In-person' && event.location ? event.location : event.mode}
                    </span>
                  </div>
                  <h3>{event.title}</h3>
                  {event.blurb && <p>{event.blurb}</p>}
                  <ul className="featured-meta">
                    <li><Calendar size={14} aria-hidden="true" /> {event.date}</li>
                    {event.time && <li><Clock size={14} aria-hidden="true" /> {event.time}{event.duration ? ` · ${event.duration}` : ''}</li>}
                  </ul>
                  <div className="featured-foot">
                    <span className={`featured-price${event.is_free ? ' is-free' : ''}`}>{event.price_label}</span>
                    <a className="featured-cta" href={`/seminar?event=${encodeURIComponent(event.slug)}`}>
                      Register <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </Reveal>
              )
            })}
      </div>

      <Reveal className="featured-browse">
        <a href="/register">
          Browse all sessions <ArrowRight size={16} aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  )
}

function App() {
  const [activeMode, setActiveMode] = useState(1)
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

  const rawPath = path.replace(/\/$/, '') || '/'
  // /work is a legacy alias for the canonical case-studies directory at /cases.
  const normalizedPath = rawPath === '/work' ? '/cases' : rawPath
  const routeCasesIndex = normalizedPath === '/cases'
  const routeAbout = normalizedPath === '/about'
  const routeServices = normalizedPath === '/services'
  const routeRegister = normalizedPath === '/register'
  const routeSeminar = normalizedPath === '/seminar'
  const routePrivacy = normalizedPath === '/privacy'
  const routeTerms = normalizedPath === '/terms'
  const routeContent = contentPages[normalizedPath] || null
  const routeCase = path.startsWith('/cases/')
    ? caseStudies.find((study) => study.slug === path.replace('/cases/', '').replace(/\/$/, ''))
    : null

  useEffect(() => {
    // Canonicalize the legacy /work URL to /cases without a full navigation;
    // normalizedPath already renders the directory for both.
    if (rawPath === '/work' && typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/cases')
    }
  }, [rawPath])

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

  if (routeCasesIndex) {
    return (
      <>
        <CasesIndexPage theme={theme} setTheme={setTheme} />
        <Assistant />
      </>
    )
  }

  if (routeCase) {
    return (
      <>
        <CaseStudyPage study={routeCase} theme={theme} setTheme={setTheme} />
        <Assistant />
      </>
    )
  }

  if (routeAbout) {
    return (
      <>
        <AboutPage theme={theme} setTheme={setTheme} />
        <Assistant />
      </>
    )
  }

  if (routeServices) {
    return (
      <>
        <ServicesPage theme={theme} setTheme={setTheme} />
        <Assistant />
      </>
    )
  }

  if (routeRegister) {
    return (
      <>
        <RegisterPage theme={theme} setTheme={setTheme} />
        <Assistant />
      </>
    )
  }

  if (routeSeminar) {
    // Distraction-free ad landing page: no chat widget, single call to action.
    return <SeminarLandingPage theme={theme} setTheme={setTheme} />
  }

  if (routePrivacy) {
    return <LegalPage doc={privacyDoc} theme={theme} setTheme={setTheme} />
  }

  if (routeTerms) {
    return <LegalPage doc={termsDoc} theme={theme} setTheme={setTheme} />
  }

  if (routeContent) {
    return (
      <>
        <ContentPage page={routeContent} theme={theme} setTheme={setTheme} />
        <Assistant />
      </>
    )
  }

  return (
    <div className="site-shell">
      <header className="nav">
        <a className="brand" href="#top" aria-label="ABBADev IT Solutions home">
          <img className="brand-mark" src="/images/abbadev-logo.png" alt="" width="42" height="42" />
          <span className="brand-wordmark">
            <strong>ABBADEV</strong>
            <small>IT Solutions</small>
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
          <SiteNav />
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
                Book a consult <ArrowRight size={18} aria-hidden="true" />
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
          <a className="all-cases-link" href="/services">
            Explore all services <ArrowRight size={16} aria-hidden="true" />
          </a>
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

        <FeaturedSessions />

        <section className="section product-section" id="product">
          <div className="product-grid">
            <div className="product-copy">
              <span className="kicker">
                <Sparkles size={15} aria-hidden="true" /> Live product
              </span>
              <h2>ABBADev CRM - the system we run ourselves.</h2>
              <p>
                A right-sized CRM for SMEs: every contact, deal, and follow-up
                in one governed pipeline with a clear owner and a next action -
                not another spreadsheet that goes stale by Friday. It runs in
                production at <span className="product-url">crm.abbadev.com</span>.
              </p>
              <ul className="product-features">
                <li>
                  <Users size={17} aria-hidden="true" />
                  <span><strong>Contacts &amp; companies.</strong> One shared source of truth for every lead.</span>
                </li>
                <li>
                  <GitBranch size={17} aria-hidden="true" />
                  <span><strong>Deal pipeline.</strong> Stages, values, and ownership the whole team can see.</span>
                </li>
                <li>
                  <ListChecks size={17} aria-hidden="true" />
                  <span><strong>Tasks &amp; activities.</strong> Logged calls and reminders so follow-ups never slip.</span>
                </li>
                <li>
                  <LayoutDashboard size={17} aria-hidden="true" />
                  <span><strong>Live dashboard.</strong> Pipeline value and win rate, updated as you work.</span>
                </li>
              </ul>
              <div className="product-actions">
                <a
                  className="primary-button"
                  href="https://crm.abbadev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Launch the CRM <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="secondary-button" href="/cases/abbadev-crm">
                  <Play size={17} aria-hidden="true" /> Read the case study
                </a>
              </div>
            </div>

            <div className="product-preview">
              <CrmShowcase />
            </div>
          </div>
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
          <a className="all-cases-link" href="/insights">
            Read all insights <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>

        <section className="founder-section" id="founder" aria-label="About the founder">
          <div className="founder-portrait">
            <img
              src="/images/founder.png"
              alt="Rommel Galisanao, founder of ABBADev IT Solutions"
              width="360"
              height="450"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="founder-copy">
            <span className="kicker">Who you work with</span>
            <h2>{founderProfile.name}</h2>
            <p className="founder-role">{founderProfile.role}</p>
            <p>{founderProfile.bio}</p>
            <ul className="founder-points">
              {founderProfile.points.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <a className="secondary-button" href="/about">
              More about ABBADev <ArrowRight size={17} aria-hidden="true" />
            </a>
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
          <span>ABBADev IT Solutions designs intelligent systems for work that needs clarity, speed, and control.</span>
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
