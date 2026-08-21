import { useEffect, useRef, useState } from 'react'

/** True when the user prefers reduced motion (also guards JS-only fallback). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** IntersectionObserver-based entrance reveal. */
export function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            io.unobserve(e.target)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

/** Smoothly tracked scroll progress (0..1) of an element through the viewport. */
export function useScrollProgress<T extends HTMLElement>(
  range: 'viewport' | 'element' = 'element',
  disabled = false,
) {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (disabled) return
    let raf = 0
    let current = 0
    let target = 0

    const measure = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      let p: number
      if (range === 'element') {
        // progress through the element while its sticky child is pinned
        p = (vh - rect.top) / (rect.height - vh + 1)
      } else {
        p = (vh - rect.top) / (vh + rect.height)
      }
      target = Math.min(1, Math.max(0, p))
      if (!raf) raf = requestAnimationFrame(step)
    }

    const step = () => {
      current += (target - current) * 0.14
      if (Math.abs(target - current) > 0.0006) {
        raf = requestAnimationFrame(step)
      } else {
        current = target
        raf = 0
      }
      setProgress(current)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        measure()
      })
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [range, disabled])

  return { ref, progress }
}
