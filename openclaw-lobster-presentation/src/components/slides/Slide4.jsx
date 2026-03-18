import { motion } from 'framer-motion'
import { Bot, RefreshCw, Brain } from 'lucide-react'
import { containerVariants, itemVariants } from '../../animations'
import TitleArea from '../ui/TitleArea'

const cases = [
  {
    icon: Bot,
    title: 'Bot 矩阵',
    items: ['贾维斯处理日常', '开源雷达监控 GitHub', '挖掘机做数据采集'],
  },
  {
    icon: RefreshCw,
    title: '自动化能力',
    items: ['十几个自定义 Skill', '2h 定时 GitHub Trending', 'Heartbeat 心跳巡检'],
  },
  {
    icon: Brain,
    title: '记忆与个性',
    items: ['OpenViking 记忆插件', 'SOUL 文件定义性格', '行为边界配置'],
  },
]

const tips = [
  { num: '①', title: '按自己的节奏来', desc: 'L1 稳定跑着也挺好' },
  { num: '②', title: '从一个具体任务开始', desc: '跑通一个再加下一个' },
  { num: '③', title: '算一下投入产出', desc: '你是在养助手，不是在养宠物' },
]

export default function Slide4() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-full flex flex-col relative">
      {/* 光晕 */}
      <div className="glow-bg" style={{ width: 500, height: 500, top: '30%', left: -100, background: 'var(--primary-300)', opacity: 0.3 }} />

      <TitleArea title="我的龙虾现在长这样" subtitle="一个真实案例，供你参考" />

      {/* 内容居中容器 */}
      <div className="flex-1 flex flex-col justify-center">

      {/* 案例卡片 */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 px-2 md:px-4 relative z-10 max-w-5xl mx-auto w-full mb-6">
        {cases.map((c, i) => (
          <div key={i} className="glass-card p-5" style={{ borderTop: '3px solid var(--primary-100)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary-300)' }}
              >
                <c.icon size={20} style={{ color: 'var(--primary-100)' }} />
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-100)' }}>{c.title}</h3>
            </div>
            <ul className="space-y-2">
              {c.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary-100)' }} />
                  <span style={{ color: 'var(--text-100)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>

      {/* 分隔线 + 建议 */}
      <motion.div variants={itemVariants} className="relative z-10 max-w-5xl mx-auto w-full px-2 md:px-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--bg-300)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>三条建议</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--bg-300)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))' }}
              >
                {i + 1}
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: 'var(--text-100)' }}>{tip.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-200)' }}>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      </div>
    </motion.div>
  )
}
