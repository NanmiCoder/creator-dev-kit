import type { PointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function MagneticLink({ href, children }: { href: string; children: ReactNode }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 100, damping: 20 })
  const springY = useSpring(y, { stiffness: 100, damping: 20 })

  const move = (event: PointerEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12)
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.12)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a href={href} onPointerMove={move} onPointerLeave={reset} style={{ x: springX, y: springY }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper shadow-[0_18px_35px_-22px_rgba(29,33,31,0.7)] transition-colors duration-300 hover:bg-accent">
      {children}
    </motion.a>
  )
}
