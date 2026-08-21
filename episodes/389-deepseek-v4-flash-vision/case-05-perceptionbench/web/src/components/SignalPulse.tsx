import { memo } from 'react'
import { motion } from 'framer-motion'

export const SignalPulse = memo(function SignalPulse() {
  return (
    <span className="relative flex size-2" aria-label="Verified run status">
      <motion.span className="absolute inset-0 rounded-full bg-accent" animate={{ opacity: [0.55, 0], scale: [1, 2.1] }} transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.45, ease: 'easeOut' }} />
      <span className="relative size-2 rounded-full bg-accent" />
    </span>
  )
})
