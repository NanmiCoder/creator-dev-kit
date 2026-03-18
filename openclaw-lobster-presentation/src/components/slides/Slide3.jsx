import { motion } from 'framer-motion'
import { Workflow, Zap, Wrench, Eye } from 'lucide-react'
import { containerVariants, itemVariants } from '../../animations'
import TitleArea from '../ui/TitleArea'
import ConclusionBanner from '../ui/ConclusionBanner'

const metrics = [
  {
    num: '01',
    icon: Workflow,
    title: '融入了几条工作流？',
    desc: '信息 / 创作 / 调研……数一数',
    color: '#f59e0b',
  },
  {
    num: '02',
    icon: Zap,
    title: '自动完成了多少任务？',
    desc: '定时任务 / 心跳巡检 / 触发器',
    color: '#3b82f6',
  },
  {
    num: '03',
    icon: Wrench,
    title: '教会了多少个 Skill？',
    desc: '自己写的，不是装现成的',
    color: '#8b5cf6',
  },
  {
    num: '04',
    icon: Eye,
    title: '多久没手动干预？',
    desc: '偶尔看看就行 = 养好了',
    color: '#10b981',
  },
]

export default function Slide3() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-full flex flex-col relative">
      <TitleArea
        tag="量化评估"
        title="怎么量化你的龙虾养得好不好？"
        subtitle="四个指标，帮你判断"
      />

      <motion.div variants={itemVariants} className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-2 md:px-4 relative z-10 max-w-5xl mx-auto w-full place-content-center">
        {metrics.map((m, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {/* 圆形编号 */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
              style={{ background: `linear-gradient(135deg, var(--primary-100), var(--primary-200))` }}
            >
              {m.num}
            </div>

            {/* 卡片 */}
            <div className="glass-card p-4 md:p-5 w-full">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${m.color}15` }}
              >
                <m.icon size={24} style={{ color: m.color }} />
              </div>
              <h3 className="text-sm md:text-base font-bold mb-2" style={{ color: 'var(--text-100)' }}>
                {m.title}
              </h3>
              <p className="text-xs md:text-sm" style={{ color: 'var(--text-200)' }}>
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-4 pb-2">
        <ConclusionBanner text="如果答案都是零，那它对你来说就是个玩具" isAccent />
      </motion.div>
    </motion.div>
  )
}
