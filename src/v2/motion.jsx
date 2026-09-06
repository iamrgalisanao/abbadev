// v2 motion system — bespoke, dependency-light, and reduced-motion safe.
// Mirrors the reference site's actual stack: Lenis smooth-scroll + IntersectionObserver
// reveals + a per-letter headline reveal + a scroll-progress bar + scroll-rate parallax.
// No framer-motion (it froze in the in-app preview pane; the reference uses no anim lib either).
import { Fragment, useEffect, useRef, useState } from 'react'
import { prefersReduced } from './motion-utils.js'

// Shared one-shot in-view hook.
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node || prefersReduced() || !('IntersectionObserver' in window)) {
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
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, shown]
}

// Fade + rise on scroll. `delay` (ms) enables manual stagger between siblings.
export function Reveal({ as: Tag = 'div', className = '', children, delay = 0, ...rest }) {
  const [ref, shown] = useInView(0.15)
  return (
    <Tag
      ref={ref}
      className={`v2-reveal${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Per-letter headline reveal. Words stay unbroken (each is inline-block) while
// characters cascade; spaces between words remain breakable so long lines wrap.
export function TypewriterHeading({ lines, as: Tag = 'h1', className = '', step = 26 }) {
  const [ref, shown] = useInView(0.25)
  let index = 0
  return (
    <Tag ref={ref} className={`v2-type${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}>
      {lines.map((line, li) => {
        const words = line.split(' ')
        return (
          <span className="v2-type-line" key={li}>
            {words.map((word, wi) => (
              <Fragment key={wi}>
                <span className="v2-word">
                  {Array.from(word).map((ch, ci) => (
                    <span className="v2-ch" key={ci} style={{ animationDelay: `${index++ * step}ms` }}>
                      {ch}
                    </span>
                  ))}
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}

// Letter-by-letter fade-in reveal (the "text generate" effect): each letter
// fades in with a cumulative stagger, so the words appear one at a time as their
// letters fill in. Keyframe-driven (reliable above the fold); words stay whole
// (each is inline-block) so lines still wrap. Reduced-motion shows instantly.
export function TextReveal({ lines, as: Tag = 'h1', className = '', step = 40 }) {
  const [ref, shown] = useInView(0.25)
  let index = 0
  return (
    <Tag ref={ref} className={`v2-textgen${shown ? ' is-in' : ''}${className ? ` ${className}` : ''}`}>
      {lines.map((line, li) => {
        const words = line.split(' ')
        return (
          <span className="v2-textgen-line" key={li}>
            {words.map((word, wi) => (
              <Fragment key={wi}>
                <span className="v2-tg-word">
                  {Array.from(word).map((ch, ci) => (
                    <span className="v2-tg-char" key={ci} style={{ animationDelay: `${index++ * step}ms` }}>{ch}</span>
                  ))}
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}

// Thin scroll-progress bar, driven off native scroll (Lenis scrolls the window,
// so the scroll event still fires). rAF-throttled.
export function ScrollProgress() {
  const barRef = useRef(null)
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return undefined
    let ticking = false
    const update = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      bar.style.transform = `scaleX(${ratio})`
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
  return (
    <div className="v2-progress" aria-hidden="true">
      <span ref={barRef} className="v2-progress-bar" />
    </div>
  )
}

// Interactive 3D tilt card with a mouse-following radial glow, à la the
// reference site's credential plate. Sets --rx/--ry (tilt), --mx/--my (glow
// centre) and --active on the stage; the CSS reads them (they inherit to the
// plate + sheen). rAF-throttled; a no-op under reduced motion (resting tilt
// only). `max` = tilt degrees, `rest` = resting rotateY.
export function TiltCard({ className = '', max = 10, rest = 6, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let raf = 0
    const apply = (e) => {
      if (prefersReduced()) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${((0.5 - py) * max).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${((px - 0.5) * max + rest).toFixed(2)}deg`)
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
        el.style.setProperty('--active', '1')
      })
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', `${rest}deg`)
      el.style.setProperty('--mx', '30%')
      el.style.setProperty('--my', '22%')
      el.style.setProperty('--active', '0')
    }
    el.addEventListener('pointermove', apply)
    el.addEventListener('pointerenter', apply)
    el.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', apply)
      el.removeEventListener('pointerenter', apply)
      el.removeEventListener('pointerleave', reset)
    }
  }, [max, rest])

  return (
    <div ref={ref} className={`v2-plate-stage${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}

// Scroll-rate parallax. Two modes:
//   'center' (default) — translate by the element's distance from viewport
//     centre (symmetric drift as it passes through the viewport).
//   'scroll'  — translate by scrollY * rate (absolute), the model the reference
//     site uses for its stacked hero ridges: higher rate = lags further behind
//     the page = reads as more distant.
// Disabled under reduced-motion.
export function Parallax({ rate = 0.18, mode = 'center', className = '', children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return undefined
    let ticking = false
    const update = () => {
      let y
      if (mode === 'scroll') {
        y = window.scrollY * rate
      } else {
        const rect = el.getBoundingClientRect()
        y = (rect.top + rect.height / 2 - window.innerHeight / 2) * -rate
      }
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
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
  }, [rate, mode])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
