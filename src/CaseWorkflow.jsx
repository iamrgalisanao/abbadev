import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'

// Animated, data-driven pipeline diagram for a case study. Steps are supplied
// by the case object so the component stays reusable. Motion mirrors the
// homepage hero: it steps an active index through the nodes, pauses when
// off-screen or hovered, and holds a "complete" beat before looping. Users who
// prefer reduced motion see the finished, fully-routed state with no animation.
const STEP_MS = 1150
const HOLD_MS = 1900

export default function CaseWorkflow({
  title = 'Workflow',
  caption,
  completeLabel = 'Complete',
  completeDetail = 'pipeline settled',
  steps = [],
}) {
  const total = steps.length

  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [active, setActive] = useState(() => (reducedMotion ? total : 0))
  const [inView, setInView] = useState(true)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef(null)
  const activeRef = useRef(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const node = rootRef.current
    if (!node || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || paused || !inView || total === 0) return undefined
    let cancelled = false
    let timeoutId

    const tick = (current) => {
      setActive(current)
      const delay = current > total ? HOLD_MS : STEP_MS
      timeoutId = setTimeout(() => {
        if (cancelled) return
        tick(current > total ? 0 : current + 1)
      }, delay)
    }
    tick(activeRef.current)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [paused, inView, reducedMotion, total])

  if (total === 0) return null

  const complete = active >= total
  const current = steps[Math.min(active, total - 1)]

  return (
    <div
      className="cw"
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="cw-head">
        <div className="cw-head-title">
          <span className="cw-kicker">n8n pipeline</span>
          <strong>{title}</strong>
          {caption && <p>{caption}</p>}
        </div>
        <div className="cw-status" role="status" aria-live="polite">
          <span className={`cw-status-dot${complete ? ' is-complete' : ''}`} aria-hidden="true" />
          <span className="cw-status-text">
            <strong>{complete ? completeLabel : current.label}</strong>
            {' / '}
            {complete ? completeDetail : String(current.active || '').toLowerCase()}
          </span>
        </div>
      </div>

      <ol className="cw-track" style={{ '--cw-count': total }} aria-label={`${title} steps`}>
        {steps.map((step, index) => {
          const Icon = step.icon
          const state = index < active ? 'done' : index === active && !complete ? 'active' : 'idle'
          const detail = state === 'done' ? step.done : state === 'active' ? step.active : step.idle
          const linkClasses = ['cw-link']
          if (index < active) linkClasses.push('is-filled')
          if (index === active - 1 && !complete) linkClasses.push('is-flowing')
          return (
            <li className={`cw-node cw-node--${state} cw-node--${step.kind || 'default'}`} key={step.label}>
              {index < total - 1 && <span className={linkClasses.join(' ')} aria-hidden="true" />}
              <span className="cw-icon-wrap">
                <span className="cw-glow" aria-hidden="true" />
                <span className="cw-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="cw-check" aria-hidden="true">
                  {state === 'done' && <Check size={10} strokeWidth={3.5} />}
                </span>
              </span>
              <span className="cw-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <em>{step.tag}</em>
              </span>
              <strong className="cw-label">{step.label}</strong>
              <small className="cw-detail">
                {detail}
                {state === 'active' ? '…' : ''}
              </small>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
