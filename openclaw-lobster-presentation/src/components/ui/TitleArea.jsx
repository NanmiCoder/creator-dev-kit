import { motion } from 'framer-motion'
import { itemVariants } from '../../animations'

export default function TitleArea({ tag, title, subtitle }) {
  return (
    <motion.div variants={itemVariants} className="text-center mb-6 relative z-10">
      {tag && (
        <span
          className="inline-block text-xs tracking-[0.2em] uppercase font-medium mb-3 px-3 py-1 rounded-full"
          style={{ color: 'var(--primary-100)', backgroundColor: 'var(--primary-300)' }}
        >
          {tag}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: 'var(--text-100)' }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base md:text-lg" style={{ color: 'var(--text-200)' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
