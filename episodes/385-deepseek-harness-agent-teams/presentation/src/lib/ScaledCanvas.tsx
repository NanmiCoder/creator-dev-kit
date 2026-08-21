import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from './util'

interface Props {
  /** Design-space width in px. Everything inside is authored at this scale. */
  width: number
  /** Design-space height in px. */
  height: number
  className?: string
  children: ReactNode
}

/**
 * Renders children at a fixed design resolution and scales the whole canvas to
 * the available width. Type, stroke weights and geometry stay in proportion,
 * which keeps hand-authored diagrams crisp at any viewport.
 */
export function ScaledCanvas({ width, height, className, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? width
      setScale(Math.min(1, w / width))
    })
    observer.observe(host)
    return () => observer.disconnect()
  }, [width])

  return (
    <div ref={hostRef} className={cn('w-full', className)} style={{ height: height * scale }}>
      <div
        className="relative origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
