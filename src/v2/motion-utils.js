// Non-component motion helpers, kept out of motion.jsx so that file exports only
// components (satisfies react-refresh/only-export-components + fast refresh).
import { useEffect } from 'react'
import Lenis from 'lenis'

export function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Smooth-scroll for the lifetime of the mounted route. Skipped entirely under
// reduced-motion so native scrolling (and the CSS fallback) stays in charge.
export function useLenis() {
  useEffect(() => {
    if (prefersReduced() || typeof window === 'undefined') return undefined
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 })
    let rafId
    const loop = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
