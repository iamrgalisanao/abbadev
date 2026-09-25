// v2 homepage content — curated, AIS-style editorial copy that reuses abbadev's
// real facts (case slugs/titles/metrics, services, products, founder). Kept as a
// self-contained leaf module so the v2 build never imports from the v1 App.jsx
// (no circular dependency) and v1 stays untouched.

// Site-wide header (SiteHeader.jsx). On the homepage each link scrolls to its
// section (`anchor`); on every other page it opens the page (`href`). `match`
// lists the path prefixes that mark the link active on interior pages.
export const nav = {
  links: [
    { label: 'What we do', href: '/services', anchor: '#capability', match: ['/services', '/business-solutions'] },
    { label: 'Work', href: '/cases', anchor: '#work', match: ['/cases'] },
    { label: 'Products', href: '/#products', anchor: '#products', match: [] },
    { label: 'Sessions', href: '/register', anchor: '/register', match: ['/register', '/community'] },
    { label: 'About', href: '/about', anchor: '#founder', match: ['/about'] },
  ],
  cta: { label: 'Book a consultation', href: '/#contact', anchor: '#contact' },
}

export const hero = {
  badge: 'Systems architecture · AI automation · custom software',
  headline: ['Systems for work', 'that outgrew manual effort.'],
  sub: 'ABBADev designs the architecture where people, software, automation, and AI do real work together — with guardrails, ownership, and status you can actually see.',
  ctas: [
    { label: 'Book a consultation', href: '#contact', primary: true },
    { label: 'See the work', href: '#work', primary: false },
  ],
  ticker: [
    'Laravel · React · n8n',
    'Governed automation',
    'AI with guardrails',
    'Production, not slideware',
  ],
}

export const position = {
  eyebrow: 'The stance',
  heading: 'Not a portfolio page. A walkthrough of how the work actually runs.',
  body: 'The most effective organizations do not replace people with AI. They build systems where people and intelligent technology work together — judgement stays visible, software stays predictable, and AI is scoped to the places it genuinely accelerates the work.',
  surfaces: [
    {
      label: 'Command center',
      title: 'Executive workflow visibility',
      copy: 'A practical view of what is moving, what is blocked, and where automation can safely remove drag.',
    },
    {
      label: 'Automation map',
      title: 'Human, system, and AI handoffs',
      copy: 'Process steps become connected actions with clear ownership, guardrails, and escalation paths.',
    },
    {
      label: 'AI workbench',
      title: 'Useful agents inside real operations',
      copy: 'AI is scoped to intake, analysis, drafting, routing, and review — not treated as a magic layer.',
    },
  ],
}

// The three operating modes — the tabbed capability block.
export const pillars = [
  {
    key: 'human',
    label: 'Human-led',
    title: 'Where judgement stays visible',
    bestFor: 'Strategy, approval, risk calls, stakeholder communication, and context-heavy decisions.',
    deliverable: 'Decision map with roles, policies, and review points',
  },
  {
    key: 'deterministic',
    label: 'Deterministic',
    title: 'Where software should be predictable',
    bestFor: 'Provisioning, routing, validations, audit trails, reporting, and integrations that must not improvise.',
    deliverable: 'Workflow engine, integration contracts, and monitoring',
  },
  {
    key: 'agentic',
    label: 'Agentic',
    title: 'Where AI can safely accelerate work',
    bestFor: 'Summaries, document intake, recommendations, triage support, and draft actions with human checks.',
    deliverable: 'AI-assisted workflow with prompts, evals, and escalation rules',
  },
]

export const services = {
  eyebrow: 'Services',
  heading: 'Consulting that turns into working software.',
  href: '/services',
  items: [
    { no: '01', title: 'AI automation strategy', copy: 'Identify the few workflows where AI can reduce busywork without creating operational risk.' },
    { no: '02', title: 'Enterprise architecture', copy: 'Design systems that connect teams, tools, data, and decision points with maintainable boundaries.' },
    { no: '03', title: 'Custom software builds', copy: 'Ship internal tools, portals, dashboards, workflow apps, and APIs shaped around how the business works.' },
    { no: '04', title: 'Governance and review', copy: 'Audit data flow, permissions, prompts, service boundaries, reliability, and security before scale.' },
  ],
}

export const work = {
  eyebrow: 'Proof',
  heading: 'Real systems, in production.',
  href: '/cases',
  cases: [
    {
      slug: 'operations-command-center',
      kicker: 'Transaction operations',
      title: 'Transaction intake command center',
      result: 'A fragmented POS submission process becomes a governed transaction pipeline for finance, terminal, and operations teams.',
      metric: { label: 'Submission traceability', before: 'Manual lookup', after: 'Status endpoints' },
      image: '/images/services/business-systems.jpg',
      imageWebp: '/images/services/business-systems.webp',
      alt: 'Operations and finance dashboards on screen',
    },
    {
      slug: 'document-intake-assistant',
      kicker: 'AI implementation',
      title: 'Document intake assistant',
      result: 'Manual review work becomes structured extraction, validation, exception handling, and a traceable handoff.',
      metric: { label: 'Manual review load', before: '100%', after: 'Exception-only' },
      image: '/images/services/ai-automation.jpg',
      imageWebp: '/images/services/ai-automation.webp',
      alt: 'AI-assisted document processing',
    },
    {
      slug: 'integration-foundation',
      kicker: 'Solution architecture',
      title: 'Integration foundation',
      result: 'Disconnected tools become a stable integration layer that can carry future automations.',
      metric: { label: 'Duplicate entry', before: '3 systems', after: '1 source' },
      image: '/images/services/systems-integration.jpg',
      imageWebp: '/images/services/systems-integration.webp',
      alt: 'Connected systems and integration layer',
    },
    {
      slug: 'guardrailed-site-assistant',
      kicker: 'Applied AI',
      title: 'Guardrailed site assistant',
      result: 'A generic chatbot becomes a scoped intake assistant that answers within guardrails and escalates only qualified leads to a human.',
      metric: { label: 'Escalation to a human', before: 'Every visitor', after: 'Qualified leads' },
      image: '/images/services/custom-software.jpg',
      imageWebp: '/images/services/custom-software.webp',
      alt: 'Customer-facing assistant interface',
    },
    {
      slug: 'abbadev-crm',
      kicker: 'Product',
      title: 'ABBADev CRM',
      result: 'Leads scattered across spreadsheets, chat, and inboxes become one governed CRM where every deal has an owner and a status.',
      metric: { label: 'Lead visibility', before: 'Spreadsheets', after: 'Live pipeline' },
      image: '/images/mockup_crm.png',
      imageWebp: '/images/mockup_crm.webp',
      alt: 'ABBADev CRM dashboard showing the lead-to-deal pipeline',
      screenshot: true,
    },
    {
      slug: 'stockora',
      kicker: 'Full-stack SaaS',
      title: 'Stockora — warehouse intelligence',
      result: 'A shared spreadsheet and someone’s memory become a production inventory system: multi-warehouse stock, FIFO costing, and an offline scanner app.',
      metric: { label: 'Inventory movements', before: 'Overwritten', after: '100% traceable' },
      image: '/images/stockora-showcase.svg',
      imageWebp: null,
      alt: 'Stockora warehouse intelligence interface',
      screenshot: true,
    },
  ],
}

export const products = {
  eyebrow: 'Software we run ourselves',
  heading: 'Products we build — and operate in production.',
  items: [
    {
      name: 'ABBADev CRM',
      tag: 'Live product',
      blurb: 'One governed pipeline for contacts, deals, and follow-ups — every record with an owner and a status.',
      points: ['Lead-to-deal pipeline with stage governance', 'Role-based access and audit trails', 'Automations wired through n8n'],
      href: 'https://crm.abbadev.com/',
      caseHref: '/cases/abbadev-crm',
      shot: '/images/mockup_crm.png',
      shotWebp: '/images/mockup_crm.webp',
      alt: 'ABBADev CRM dashboard showing the lead-to-deal pipeline',
    },
    {
      name: 'Stockora',
      tag: 'Live product',
      blurb: 'Warehouse intelligence: multi-warehouse stock, FIFO costing, role-based approvals, and an offline scanner app for the floor.',
      points: ['Multi-warehouse stock with FIFO costing', 'Role-based approval workflows', 'Offline-first scanner for the warehouse floor'],
      href: 'https://stockora.abbadev.com/',
      caseHref: '/cases/stockora',
      shot: '/images/stockora-showcase.svg',
      shotWebp: null,
      alt: 'Stockora warehouse intelligence interface',
    },
  ],
}

export const founder = {
  eyebrow: 'The founder',
  name: 'Rommel Galisanao',
  role: 'Founder & Principal Systems Architect — ABBADev IT Solutions',
  bio: 'I help organizations turn business complexity into practical software systems — bringing together software architecture, AI automation, project leadership, and business process analysis. The work bridges executive clarity and developer-ready implementation, with accountability kept human at every step.',
  points: [
    'Software architecture and enterprise systems',
    'AI automation with governance and guardrails',
    'Business-to-technical translation for leaders and teams',
  ],
  href: '/about',
}

// Interactive credential plate (tilt + mouse-follow glow), shown in the founder band.
export const plate = {
  avatar: 'AB',
  label: 'PRINCIPAL ARCHITECT',
  title1: 'Systems',
  title2: 'Architecture',
  abbr: 'ABBADEV',
  rows: [
    ['FOCUS', 'Architecture · AI · automation'],
    ['APPROACH', 'People + software + AI'],
    ['ACCOUNTABILITY', 'Kept human at every step'],
  ],
  foot: 'Rommel Galisanao · ABBADev',
}

export const finalCta = {
  eyebrow: 'Start here',
  heading: 'Recognize this pattern in your operations?',
  body: 'Bring one workflow that has outgrown manual effort. We will return a practical path for automation, architecture, or software delivery — no obligation.',
  button: { label: 'Book a consultation', href: '#contact' },
  steps: [
    'Clarify the workflow and business outcome',
    'Identify the systems, people, and approval points involved',
    'Return a practical path for automation, architecture, or delivery',
  ],
}

// Consultation brief form. Option labels must match the n8n lead-scoring rules in
// automation/n8n/consultation-lead-workflow.md (workFocus, urgency, budget, stage).
export const consult = {
  eyebrow: 'Consultation brief',
  heading: 'Tell us about the workflow.',
  body: 'A useful first conversation starts with the process, the people involved, the tools in play, and what better operations would make possible.',
  next: [
    'A systems architect reads your brief — not a bot',
    'You get a reply within one business day',
    'No commitment, and your details are never published',
  ],
  email: 'info@abbadev.com',
  fields: {
    workFocus: ['AI automation', 'Custom software', 'Architecture review', 'Digital transformation'],
    companyStage: ['Growing business', 'Startup', 'Enterprise team', 'Public sector or nonprofit'],
    urgency: ['This month', 'This quarter', 'Planning phase', 'Exploring options'],
    engagement: ['Consultation and roadmap', 'Architecture review', 'Prototype or proof of concept', 'Full software build'],
    budget: ['To be scoped', 'Under $5k', '$5k to $15k', '$15k to $50k', '$50k+'],
  },
}

export const footer = {
  statement: 'People + software + automation + AI. ABBADev builds the systems where they work together.',
  groups: [
    { title: 'Company', links: [ { label: 'About', href: '/about' }, { label: 'Services', href: '/services' }, { label: 'Case studies', href: '/cases' } ] },
    { title: 'Products', links: [ { label: 'ABBADev CRM', href: 'https://crm.abbadev.com/' }, { label: 'Stockora', href: 'https://stockora.abbadev.com/' } ] },
    { title: 'Connect', links: [ { label: 'Book a consultation', href: '#contact' } ] },
  ],
  copyright: '© 2026 ABBADev IT Solutions. Founded by Rommel Galisanao.',
}
