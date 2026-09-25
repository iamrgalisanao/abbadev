import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { nav } from './content.js'

// The one header for the whole site (v2 design). On the homepage the links
// scroll to sections; elsewhere they open pages and mark the current one.
// Pass theme/setTheme to show the light/dark toggle (interior pages only - the
// homepage is always dark).
export default function SiteHeader({ onHome = false, theme, setTheme }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const path = typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') || '/' : '/'
  const isActive = (link) => !onHome && link.match.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const cta = onHome ? nav.cta.anchor : nav.cta.href

  return (
    <header className={`v2-nav${open ? ' is-open' : ''}`}>
      <div className="v2-nav-inner">
        <a className="v2-brand" href="/" aria-label="ABBADev IT Solutions home">
          <img className="v2-brand-mark" src="/images/abbadev-logo.png" alt="" width="38" height="38" />
          <span className="v2-brand-word"><strong>ABBADEV</strong><small>IT Solutions</small></span>
        </a>
        <nav className="v2-nav-links" id="site-nav" aria-label="Primary">
          {nav.links.map((link) => {
            const active = isActive(link)
            return (
              <a
                key={link.label}
                href={onHome ? link.anchor : link.href}
                className={active ? 'is-active' : undefined}
                aria-current={active ? 'page' : undefined}
                onClick={close}
              >
                {link.label}
              </a>
            )
          })}
          <a className="v2-pill v2-pill--solid v2-nav-menu-cta" href={cta} onClick={close}>{nav.cta.label}</a>
        </nav>
        <div className="v2-nav-actions">
          {setTheme ? (
            <button
              className="v2-nav-icon"
              type="button"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            </button>
          ) : null}
          <a className="v2-pill v2-pill--solid v2-nav-cta" href={cta}>{nav.cta.label}</a>
          <button
            className="v2-nav-icon v2-nav-toggle"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
