import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import Assistant from '../Assistant'
import ConsultForm from './ConsultForm.jsx'
import CtaGradient from './CtaGradient.jsx'
import { Reveal, ScrollProgress, TextReveal, Parallax, TiltCard } from './motion.jsx'
import { useLenis, prefersReduced } from './motion-utils.js'
import { nav, hero, position, pillars, services, work, products, founder, plate, finalCta, consult, footer } from './content.js'
import './v2.css'

function ProductShot({ shot, shotWebp, alt }) {
  return (
    <div className="v2-shot">
      <div className="v2-shot-frame">
        <span className="v2-shot-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <picture>
          {shotWebp ? <source srcSet={shotWebp} type="image/webp" /> : null}
          <img src={shot} alt={alt} loading="lazy" decoding="async" />
        </picture>
      </div>
    </div>
  )
}

export default function V2Home() {
  const [activePillar, setActivePillar] = useState(0)
  const workStackRef = useRef(null)
  useLenis()

  // Take over the shell with the dark v2 canvas. The v2-shell is fully
  // self-styled, so we only toggle the body-background class here (the parent
  // App owns data-theme; we deliberately don't fight it).
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('v2-active')
    return () => root.classList.remove('v2-active')
  }, [])

  // Pinned scroll-stop stack: as the next case panel scrolls up to cover the
  // current one, dim + recede the covered panel for depth. Pure-CSS sticky
  // handles the pinning; this only adds the "receding" polish. Skipped under
  // reduced-motion (the panels then render as a plain stacked list).
  useEffect(() => {
    const stack = workStackRef.current
    if (!stack || prefersReduced()) return undefined
    const panels = [...stack.querySelectorAll('.v2-case-panel')]
    let ticking = false
    const update = () => {
      const vh = window.innerHeight
      panels.forEach((panel, i) => {
        const next = panels[i + 1]
        if (!next) {
          panel.style.setProperty('--cover', '0')
          return
        }
        const cover = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh))
        panel.style.setProperty('--cover', cover.toFixed(3))
      })
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const mode = pillars[activePillar]

  return (
    <div className="v2-shell">
      <ScrollProgress />

      <header className="v2-nav">
        <div className="v2-nav-inner">
          <a className="v2-brand" href="/" aria-label="ABBADev IT Solutions home">
            <img className="v2-brand-mark" src="/images/abbadev-logo.png" alt="" width="38" height="38" />
            <span className="v2-brand-word"><strong>ABBADEV</strong><small>IT Solutions</small></span>
          </a>
          <nav className="v2-nav-links">
            {nav.links.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="v2-nav-actions">
            <a className="v2-pill v2-pill--solid" href={nav.cta.href}>{nav.cta.label}</a>
          </div>
        </div>
      </header>

      <main className="v2-main">
        {/* Hero */}
        <section className="v2-hero">
          <div className="v2-hero-grid" aria-hidden="true" />
          <div className="v2-hero-scene" aria-hidden="true">
            <Parallax mode="scroll" rate={0.45} className="v2-scene-layer v2-scene-sky">
              <img src="/images/v2/hero-sky.png" alt="" />
            </Parallax>
            <Parallax mode="scroll" rate={0.36} className="v2-scene-layer v2-scene-clouds">
              <img src="/images/cloud.png" alt="" />
            </Parallax>
            <div className="v2-scene-glow" />
            <Parallax mode="scroll" rate={0.3} className="v2-scene-layer v2-ridge--far">
              <img src="/images/layer03.png" alt="" />
            </Parallax>
            <Parallax mode="scroll" rate={0.16} className="v2-scene-layer v2-ridge--mid">
              <img src="/images/layer02.png" alt="" />
            </Parallax>
          </div>
          <div className="v2-hero-inner">
            <Reveal className="v2-badge" as="span">{hero.badge}</Reveal>
            <TextReveal lines={hero.headline} as="h1" className="v2-hero-title" />
            <Reveal className="v2-hero-ctas" delay={160}>
              {hero.ctas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  className={`v2-pill ${cta.primary ? 'v2-pill--solid' : 'v2-pill--ghost'}`}
                >
                  {cta.label}
                  {cta.primary ? <ArrowUpRight size={17} strokeWidth={2} /> : null}
                </a>
              ))}
            </Reveal>
          </div>
          {/* Foreground layer — sits ABOVE the hero text so the near skyline
              occludes it (text reads as set into the scene). */}
          <div className="v2-hero-front" aria-hidden="true">
            <img src="/images/layer01.png" alt="" />
          </div>
          {/* Ticker sits in front of the whole scene, above the foreground layer. */}
          <Reveal className="v2-hero-ticker" delay={340}>
            {hero.ticker.map((item) => (
              <span key={item} className="v2-ticker-item">{item}</span>
            ))}
          </Reveal>
        </section>

        {/* Position statement */}
        <section className="v2-section v2-position">
          <div className="v2-container v2-position-grid">
            <div className="v2-position-lead">
              <Reveal className="v2-eyebrow" as="span">{position.eyebrow}</Reveal>
              <TextReveal as="h2" className="v2-h2" lines={[position.heading]} step={22} />
              <Reveal className="v2-body v2-measure" as="p" delay={120}>{position.body}</Reveal>
            </div>
            <div className="v2-surface-stack">
              {position.surfaces.map((surface, i) => (
                <Reveal key={surface.label} className="v2-surface-card" delay={i * 90}>
                  <span className="v2-eyebrow">{surface.label}</span>
                  <h3 className="v2-h3">{surface.title}</h3>
                  <p className="v2-body">{surface.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Capability / operating modes */}
        <section className="v2-section v2-capability" id="capability">
          <div className="v2-container">
            <Reveal className="v2-eyebrow" as="span">Operating model</Reveal>
            <TextReveal
              as="h2"
              className="v2-h2 v2-measure-wide"
              lines={['The future of operations is mixed — human, deterministic, and agentic.']}
              step={22}
            />
            <div className="v2-tabs" role="tablist" aria-label="Operating modes">
              {pillars.map((p, i) => (
                <button
                  key={p.key}
                  role="tab"
                  aria-selected={i === activePillar}
                  className={`v2-tab${i === activePillar ? ' is-active' : ''}`}
                  onClick={() => setActivePillar(i)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="v2-mode-board" role="tabpanel">
              <div className="v2-mode-copy">
                <span className="v2-mode-index">0{activePillar + 1} / 03</span>
                <h3 className="v2-h3">{mode.title}</h3>
                <p className="v2-body">{mode.bestFor}</p>
              </div>
              <div className="v2-mode-deliverable">
                <span className="v2-eyebrow">Deliverable</span>
                <p>{mode.deliverable}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="v2-section v2-services" id="services">
          <div className="v2-container">
            <div className="v2-section-head">
              <div>
                <Reveal className="v2-eyebrow" as="span">{services.eyebrow}</Reveal>
                <TextReveal as="h2" className="v2-h2" lines={[services.heading]} step={22} />
              </div>
              <Reveal as="a" className="v2-link" href={services.href} delay={120}>
                All services <ArrowRight size={16} />
              </Reveal>
            </div>
            <div className="v2-service-grid">
              {services.items.map((item, i) => (
                <Reveal key={item.no} className="v2-service-card" delay={(i % 2) * 80}>
                  <span className="v2-service-no">{item.no}</span>
                  <h3 className="v2-h3">{item.title}</h3>
                  <p className="v2-body">{item.copy}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Work / proof — pinned scroll-stop stack */}
        <section className="v2-section v2-work" id="work">
          <div className="v2-container v2-work-head">
            <div>
              <Reveal className="v2-eyebrow" as="span">{work.eyebrow}</Reveal>
              <TextReveal as="h2" className="v2-h2" lines={[work.heading]} step={22} />
            </div>
            <Reveal as="a" className="v2-link" href={work.href} delay={120}>
              All case studies <ArrowRight size={16} />
            </Reveal>
          </div>
          <div className="v2-work-stack" ref={workStackRef}>
            {work.cases.map((c, i) => (
              <article key={c.slug} className="v2-case-panel">
                <a className={`v2-case-card2${i % 2 ? ' is-flip' : ''}`} href={`/cases/${c.slug}`}>
                  <div className="v2-case-body">
                    <div className="v2-case-eyebrow"><span className="v2-case-dot" />{c.kicker}</div>
                    <TextReveal as="h3" className="v2-case-title" lines={[c.title]} step={22} />
                    <p className="v2-case-desc">{c.result}</p>
                    <div className="v2-case-foot">
                      <span className="v2-case-cross" aria-hidden="true" />
                      <span className="v2-case-foot-text">
                        <em>{c.metric.before}</em>
                        <ArrowRight size={14} />
                        <strong>{c.metric.after}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="v2-case-media">
                    <img
                      className="v2-case-bg"
                      src={`/images/card-bg-${(i % 2) + 1}.jpg`}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                    />
                    <picture className="v2-case-shot">
                      {c.imageWebp ? <source srcSet={c.imageWebp} type="image/webp" /> : null}
                      <img src={c.image} alt={c.alt} loading="lazy" decoding="async" />
                    </picture>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="v2-section v2-products" id="products">
          <div className="v2-container">
            <Reveal className="v2-eyebrow" as="span">{products.eyebrow}</Reveal>
            <TextReveal as="h2" className="v2-h2" lines={[products.heading]} step={22} />
            <div className="v2-product-rows">
              {products.items.map((p, i) => (
                <Reveal key={p.name} className={`v2-product-row${i % 2 ? ' is-reverse' : ''}`}>
                  <div className="v2-product-copy">
                    <span className="v2-product-tag">{p.tag}</span>
                    <h3 className="v2-h3">{p.name}</h3>
                    <p className="v2-body">{p.blurb}</p>
                    <ul className="v2-product-points">
                      {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                    <div className="v2-product-links">
                      <a className="v2-pill v2-pill--ghost" href={p.href} target="_blank" rel="noreferrer">
                        Launch it <ArrowUpRight size={16} />
                      </a>
                      <a className="v2-link" href={p.caseHref}>Read the case <ArrowRight size={15} /></a>
                    </div>
                  </div>
                  <ProductShot shot={p.shot} shotWebp={p.shotWebp} alt={p.alt} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="v2-section v2-founder" id="founder">
          <div className="v2-container v2-founder-grid">
            <Reveal>
              <TiltCard className="v2-founder-plate">
                <div className="v2-plate">
                  <div className="v2-plate__sheen" aria-hidden="true" />
                  <div className="v2-plate__top">
                    <span className="v2-plate__avatar">{plate.avatar}</span>
                    <span className="v2-plate__label">{plate.label}</span>
                  </div>
                  <h3 className="v2-plate__title">{plate.title1}<br />{plate.title2}</h3>
                  <span className="v2-plate__abbr">{plate.abbr}</span>
                  <dl className="v2-plate__rows">
                    {plate.rows.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="v2-plate__foot"><span className="v2-plate__dot" />{plate.foot}</div>
                </div>
              </TiltCard>
            </Reveal>
            <div className="v2-founder-copy">
              <Reveal className="v2-eyebrow" as="span">{founder.eyebrow}</Reveal>
              <TextReveal as="h2" className="v2-h3" lines={[founder.name]} step={22} />
              <Reveal className="v2-founder-role" as="p" delay={100}>{founder.role}</Reveal>
              <Reveal className="v2-body v2-measure" as="p" delay={140}>{founder.bio}</Reveal>
              <ul className="v2-founder-points">
                {founder.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <a className="v2-link" href={founder.href}>More about ABBADev <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="v2-section v2-cta" id="start">
          <div className="v2-cta-scene" aria-hidden="true">
            <Parallax rate={0.13} className="v2-cta-layer v2-cta-far">
              <img src="/images/layer03.png" alt="" />
            </Parallax>
          </div>
          <div className="v2-container v2-cta-inner">
            <CtaGradient />
            <Reveal className="v2-eyebrow" as="span">{finalCta.eyebrow}</Reveal>
            <TextReveal lines={[finalCta.heading]} as="h2" className="v2-cta-title" step={22} />
            <Reveal className="v2-body v2-measure" as="p" delay={120}>{finalCta.body}</Reveal>
            <ol className="v2-cta-steps">
              {finalCta.steps.map((s, i) => (
                <Reveal as="li" key={s} delay={i * 80}>
                  <span className="v2-step-no">{i + 1}</span>{s}
                </Reveal>
              ))}
            </ol>
            <Reveal className="v2-cta-book" delay={120}>
              <a className="v2-pill v2-pill--solid v2-pill--lg" href={finalCta.button.href}>
                {finalCta.button.label} <ArrowRight size={18} />
              </a>
            </Reveal>
          </div>
          {/* Mid skyline (layer02) in front of the card — the card sits behind it. */}
          <Parallax rate={0.08} className="v2-cta-midfront">
            <img src="/images/layer02.png" alt="" />
          </Parallax>
          {/* Front layer (layer01) frontmost, rising in front of everything. */}
          <div className="v2-cta-foreground" aria-hidden="true">
            <img src="/images/layer01.png" alt="" />
          </div>
        </section>

        {/* Consultation brief — the target of every "Book a consultation" link. */}
        <section className="v2-section v2-consult" id="contact">
          <div className="v2-container v2-consult-grid">
            <div className="v2-consult-intro">
              <Reveal className="v2-eyebrow" as="span">{consult.eyebrow}</Reveal>
              <TextReveal lines={[consult.heading]} as="h2" className="v2-h2" step={22} />
              <Reveal className="v2-body" as="p" delay={120}>{consult.body}</Reveal>
              <ul className="v2-consult-next">
                {consult.next.map((item, i) => (
                  <Reveal as="li" key={item} delay={160 + i * 80}>{item}</Reveal>
                ))}
              </ul>
              <p className="v2-consult-email">
                Prefer email? <a href={`mailto:${consult.email}`}>{consult.email}</a>
              </p>
            </div>
            <Reveal delay={120}>
              <ConsultForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="v2-footer">
        <div className="v2-container v2-footer-grid">
          <div>
            <a className="v2-brand v2-footer-brand" href="/" aria-label="ABBADev IT Solutions home">
              <img className="v2-brand-mark" src="/images/abbadev-logo.png" alt="" width="36" height="36" />
              <span className="v2-brand-word"><strong>ABBADEV</strong><small>IT Solutions</small></span>
            </a>
            <p className="v2-footer-statement">{footer.statement}</p>
          </div>
          <div className="v2-footer-cols">
            {footer.groups.map((group) => (
              <div key={group.title} className="v2-footer-col">
                <span className="v2-footer-title">{group.title}</span>
                {group.links.map((link) => (
                  <a key={link.label} href={link.href}>{link.label}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="v2-container v2-footer-base">{footer.copyright}</div>
      </footer>

      <Assistant />
    </div>
  )
}
