import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '../../animations'

export default function Slide5() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-full flex flex-col items-center justify-center relative">
      {/* 光晕 */}
      <div className="glow-bg" style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--primary-100)', opacity: 0.08 }} />

      <motion.div variants={itemVariants} className="text-center relative z-10 mb-8">
        <p className="text-lg md:text-xl mb-4" style={{ color: 'var(--text-200)' }}>
          养好一只龙虾，意味着
        </p>
        <p className="text-2xl md:text-3xl font-medium mb-3" style={{ color: 'var(--text-200)' }}>
          信息 · 创作 · 调研
        </p>
        <p
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ color: 'var(--primary-100)' }}
        >
          全交给它了
        </p>
        <p className="text-base md:text-lg" style={{ color: 'var(--text-200)' }}>
          不是更多功能，而是它真的在帮你
        </p>
      </motion.div>

      {/* 渐变底栏 */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-3xl mx-auto rounded-2xl px-8 py-6 text-center relative z-10"
        style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' }}
      >
        <p className="text-white text-xl md:text-2xl font-bold mb-2">
          养龙虾不是目的，让它真正帮到你才是。
        </p>
        <p className="text-white/70 text-sm">
          我是阿江，下期见。
        </p>
      </motion.div>
    </motion.div>
  )
}
