import { motion } from 'motion/react'
import { ArrowDown } from '@phosphor-icons/react'
import { MasterFlow } from './MasterFlow'
import { CHANNEL } from './diagram'
import { WHALES } from '../lib/whales'

const FACTS = [
  { value: '10', label: 'agent_teams_* 工具', note: '注册进 DSH 共享工具表' },
  { value: '2', label: '类持久化文件', note: 'team.json + inbox/*.jsonl' },
  { value: '0', label: '常驻轮询进程', note: '调度挂在 idle 事件边沿上' },
]

const LEGEND = [
  { key: 'dispatch', label: '派发：队长 → 调度器 → 成员', dashed: false },
  { key: 'peer', label: '直达：成员 ↔ 成员', dashed: true },
  { key: 'report', label: '汇报：成员 → 队长', dashed: false },
] as const

export function Hero() {
  return (
    <section id="overview" className="relative pt-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70"
        style={{
          background:
            'radial-gradient(900px 420px at 78% -8%, rgba(255,102,0,0.10), transparent 70%), radial-gradient(600px 360px at 8% 12%, rgba(30,138,106,0.05), transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-6 pt-10 pb-16 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:pt-12">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-850/60 px-3 py-1.5">
              <img
                src={WHALES['team-lead']}
                alt=""
                className="size-4 rounded"
              />
              <span className="font-mono text-[10.5px] tracking-wider text-fg-dim">
                DeepSeek Harness · dsh-agent-teams
              </span>
            </span>

            <h1 className="mt-6 text-[32px] leading-[1.12] font-semibold tracking-tight lg:text-[35px]">
              一个会话，
              <br />
              带起一支会分工的队伍
            </h1>

            <p className="mt-5 max-w-[42ch] text-[14.5px] leading-relaxed text-fg-dim">
              队长不是新起的进程，就是你正在对话的这个会话。它拉起可续聊的成员、把目标拆成有依赖的任务，再靠邮箱和调度器把大家连起来。
              <span className="text-fg/80"> 没有 workflow 引擎，所有状态都落在工作区的几个文件里。</span>
            </p>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }}
            className="mt-9 divide-y divide-line border-y border-line"
          >
            {FACTS.map((fact) => (
              <motion.div
                key={fact.label}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                className="flex items-baseline gap-4 py-3"
              >
                <dt className="num w-8 shrink-0 text-[19px] leading-none text-accent-soft">
                  {fact.value}
                </dt>
                <dd className="min-w-0">
                  <div className="text-[13px] leading-tight text-fg/90">{fact.label}</div>
                  <div className="mt-1 font-mono text-[10.5px] text-fg-dim/80">{fact.note}</div>
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.a
            href="#walkthrough"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="group mt-8 inline-flex items-center gap-2.5 self-start text-[13px] text-fg-dim transition-colors hover:text-fg active:translate-y-px"
          >
            <span className="flex size-7 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-accent/45">
              <ArrowDown size={13} weight="bold" />
            </span>
            往下是可播放的协作全过程
          </motion.a>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGEND.map((item) => (
              <span key={item.key} className="flex items-center gap-2 text-[11.5px] text-fg-dim">
                <svg width="26" height="8" viewBox="0 0 26 8" aria-hidden>
                  <path
                    d="M 1 4 L 25 4"
                    stroke={CHANNEL[item.key]}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={item.dashed ? '5 5' : undefined}
                  />
                </svg>
                {item.label}
              </span>
            ))}
          </div>
          <MasterFlow />
        </div>
      </div>
    </section>
  )
}
