import { motion } from 'framer-motion'
import { Download, MessageCircle, Share2, HelpCircle, ChevronRight } from 'lucide-react'
import { containerVariants, itemVariants } from '../../animations'
import ConclusionBanner from '../ui/ConclusionBanner'

const steps = [
  { icon: Download, label: '装好了', color: '#10b981', bg: '#ecfdf5' },
  { icon: MessageCircle, label: '问几个问题', color: '#6366f1', bg: '#eef2ff' },
  { icon: Share2, label: '发个朋友圈', color: '#a855f7', bg: '#faf5ff' },
  { icon: HelpCircle, label: '然后呢?', color: 'var(--primary-100)', bg: 'var(--primary-300)' },
]

export default function Slide1() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-full flex flex-col items-center justify-center relative">
      {/* 光晕 */}
      <div className="glow-bg" style={{ width: 500, height: 500, top: -100, right: -100, background: 'var(--primary-200)', opacity: 0.15 }} />
      <div className="glow-bg" style={{ width: 400, height: 400, bottom: -50, left: -50, background: 'var(--primary-300)', opacity: 0.2 }} />

      {/* Logo + 标题 */}
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-6 relative z-10">
        <img src="/openclaw-logo-text-dark.png" alt="OpenClaw" className="h-16 md:h-20 mb-4" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center" style={{ color: 'var(--text-100)' }}>
          都在养龙虾，<br />
          <span style={{ color: 'var(--primary-100)' }}>但什么叫养好了？</span>
        </h1>
        <p className="mt-3 text-base md:text-lg" style={{ color: 'var(--text-200)' }}>
          OpenClaw 使用判断框架
        </p>
      </motion.div>

      {/* 破题区域 */}
      <motion.div variants={itemVariants} className="glass-card px-6 md:px-10 py-6 max-w-3xl w-full mb-6 relative z-10">
        <p className="text-center text-lg md:text-xl font-medium mb-5" style={{ color: 'var(--text-100)' }}>
          大部分人的&quot;养龙虾&quot;，其实是&quot;<span style={{ color: 'var(--primary-100)' }}>装了个龙虾</span>&quot;
        </p>
        <div className="flex items-center justify-center gap-1 md:gap-3 flex-wrap">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1 md:gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: step.bg }}>
                  <step.icon size={28} style={{ color: step.color }} />
                </div>
                <span className="text-xs md:text-sm" style={{ color: 'var(--text-200)' }}>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight size={18} className="mt-[-20px]" style={{ color: 'var(--bg-300)' }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 底部 Banner */}
      <ConclusionBanner text="跟直接用 ChatGPT 有什么区别？" />
    </motion.div>
  )
}
