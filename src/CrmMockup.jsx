import {
  BarChart3,
  Building2,
  CheckCircle2,
  Kanban,
  LayoutDashboard,
  ListChecks,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Contacts' },
  { icon: Kanban, label: 'Pipeline' },
  { icon: ListChecks, label: 'Tasks' },
  { icon: BarChart3, label: 'Reports' },
]

const stats = [
  { label: 'Open deals', value: '38', delta: '+6', trend: 'up' },
  { label: 'Pipeline value', value: '₱2.4M', delta: '+12%', trend: 'up' },
  { label: 'Win rate', value: '31%', delta: '+4pt', trend: 'up' },
  { label: 'Tasks due', value: '9', delta: 'today', trend: 'flat' },
]

const columns = [
  {
    name: 'Qualified',
    tone: 'accent',
    deals: [
      { company: 'Northwind Retail', value: '₱180k', owner: 'RG' },
      { company: 'Cebu Logistics', value: '₱95k', owner: 'AM' },
    ],
  },
  {
    name: 'Proposal',
    tone: 'warning',
    deals: [
      { company: 'Metro Dental Group', value: '₱240k', owner: 'RG' },
      { company: 'BrightPath HR', value: '₱120k', owner: 'JL' },
    ],
  },
  {
    name: 'Won',
    tone: 'success',
    deals: [
      { company: 'Sunrise Foods', value: '₱310k', owner: 'RG' },
    ],
  },
]

const activity = [
  { who: 'AM', text: 'Logged a call with Cebu Logistics', when: '12m' },
  { who: 'RG', text: 'Moved Metro Dental to Proposal', when: '1h' },
  { who: 'JL', text: 'Emailed proposal to BrightPath HR', when: '3h' },
]

function CrmMockup() {
  return (
    <div className="crm-mock" role="img" aria-label="ABBADev CRM dashboard showing pipeline stages, deal cards, key metrics, and recent activity">
      <div className="crm-mock-chrome" aria-hidden="true">
        <span className="crm-dot" />
        <span className="crm-dot" />
        <span className="crm-dot" />
        <span className="crm-url">
          <span className="crm-lock" />
          crm.abbadev.com
        </span>
      </div>

      <div className="crm-mock-body" aria-hidden="true">
        <aside className="crm-sidebar">
          <div className="crm-brand">
            <span className="crm-brand-mark">A</span>
            <span className="crm-brand-text">ABBADev CRM</span>
          </div>
          <nav className="crm-nav">
            {navItems.map(({ icon: Icon, label, active }) => (
              <span className={active ? 'crm-nav-item is-active' : 'crm-nav-item'} key={label}>
                <Icon size={15} aria-hidden="true" />
                {label}
              </span>
            ))}
          </nav>
        </aside>

        <div className="crm-main">
          <div className="crm-topbar">
            <span className="crm-search">
              <Search size={14} aria-hidden="true" />
              Search contacts, deals, companies
            </span>
            <span className="crm-new">+ New lead</span>
            <span className="crm-avatar">RG</span>
          </div>

          <div className="crm-stats">
            {stats.map((stat) => (
              <div className="crm-stat" key={stat.label}>
                <span className="crm-stat-label">{stat.label}</span>
                <strong className="crm-stat-value">{stat.value}</strong>
                <span className={`crm-stat-delta crm-stat-delta--${stat.trend}`}>
                  {stat.trend === 'up' && <TrendingUp size={12} aria-hidden="true" />}
                  {stat.delta}
                </span>
              </div>
            ))}
          </div>

          <div className="crm-board">
            {columns.map((column) => (
              <div className="crm-col" key={column.name}>
                <span className={`crm-col-head crm-col-head--${column.tone}`}>
                  {column.name}
                  <small>{column.deals.length}</small>
                </span>
                {column.deals.map((deal) => (
                  <div className="crm-deal" key={deal.company}>
                    <span className="crm-deal-company">
                      <Building2 size={12} aria-hidden="true" />
                      {deal.company}
                    </span>
                    <span className="crm-deal-row">
                      <strong>{deal.value}</strong>
                      <span className="crm-deal-owner">{deal.owner}</span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="crm-activity">
            <span className="crm-activity-head">
              <CheckCircle2 size={13} aria-hidden="true" />
              Recent activity
            </span>
            {activity.map((item) => (
              <span className="crm-activity-item" key={item.text}>
                <span className="crm-activity-who">{item.who}</span>
                <span className="crm-activity-text">{item.text}</span>
                <span className="crm-activity-when">{item.when}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrmMockup
