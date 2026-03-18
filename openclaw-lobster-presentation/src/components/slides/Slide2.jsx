import { motion } from 'framer-motion'
import { Monitor, Zap, Heart } from 'lucide-react'
import { containerVariants, itemVariants } from '../../animations'
import TitleArea from '../ui/TitleArea'
import ConclusionBanner from '../ui/ConclusionBanner'

const levels = [
  {
    level: 'L1',
    label: '能用',
    color: '#10b981',
    bg: '#ecfdf5',
    icon: Monitor,
    desc: '装好了、不崩、能稳定回复',
    items: ['不会动不动断连', '手机等 IM 聊天软件能正常对话', '基础功能跑得通'],
    footer: '很多人卡在这一步',
  },
  {
    level: 'L2',
    label: '有用',
    color: '#3b82f6',
    bg: '#eff6ff',
    icon: Zap,
    desc: '它替你干活，省你的时间',
    items: ['自动抓取数据推送', '定时任务稳定运行', '主动帮你完成任务'],
    footer: '它替你干了你本来要自己干的事',
  },
  {
    level: 'L3',
    label: '离不开',
    color: 'var(--primary-100)',
    bg: 'var(--primary-300)',
    icon: Heart,
    desc: '它有记忆、偏好、工作流',
    items: ['知道你用什么语言', '记得之前聊过的内容', '了解你的工作习惯'],
    footer: '它有了你的记忆、偏好、工作流',
  },
]

export default function Slide2() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-full flex flex-col relative">
      <TitleArea
        tag="核心框架"
        title="养龙虾的三个层次"
        subtitle="从「能跑」到「离不开」，你的龙虾在哪一层？"
      />

      <motion.div variants={itemVariants} className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-2 md:px-4 relative z-10 max-w-5xl mx-auto w-full">
        {levels.map((l) => (
          <div
            key={l.level}
            className="glass-card p-5 md:p-6 flex flex-col items-center text-center"
            style={{ borderTop: `3px solid ${l.color}` }}
          >
            {/* 图标 */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
              style={{ backgroundColor: l.bg }}
            >
              <l.icon size={32} style={{ color: l.color }} />
            </div>

            {/* 标题 */}
            <h3 className="text-xl md:text-2xl font-bold mb-1" style={{ color: l.color }}>
              {l.label}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-200)' }}>{l.desc}</p>

            {/* 清单 */}
            <ul className="text-left w-full space-y-2 mb-4 flex-1">
              {l.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                  <span style={{ color: 'var(--text-100)' }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* 底部装饰小条 */}
            <div className="flex gap-1.5 mt-auto">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-5 h-1.5 rounded-full"
                  style={{ backgroundColor: l.color, opacity: 1 - i * 0.25 }}
                />
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-4 pb-2">
        <ConclusionBanner text="L1 是你去找它，L2 是它帮你做事，L3 是它懂你" />
      </motion.div>
    </motion.div>
  )
}
