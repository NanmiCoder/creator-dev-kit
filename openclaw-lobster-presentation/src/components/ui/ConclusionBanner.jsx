import { motion } from 'framer-motion'
import { itemVariants } from '../../animations'

export default function ConclusionBanner({ text, isAccent = false }) {
  return (
    <motion.div
      variants={itemVariants}
      className="w-full max-w-4xl mx-auto rounded-2xl px-8 py-4 text-center text-white text-base md:text-lg font-medium relative z-10"
      style={{
        background: isAccent
          ? 'var(--primary-100)'
          : 'linear-gradient(135deg, var(--accent-100), var(--accent-200))',
      }}
    >
      {text}
    </motion.div>
  )
}
