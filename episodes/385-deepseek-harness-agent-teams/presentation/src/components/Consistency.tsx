import { motion } from 'motion/react'
import { Lock, Prohibit } from '@phosphor-icons/react'
import { ScaledCanvas } from '../lib/ScaledCanvas'
import { elbowV } from '../lib/util'
import { Box, Edge, EdgeLayer } from './diagram'
import { cn } from '../lib/util'

const W = 860
const H = 214

const STATES = [
  { key: 'pending', zh: '待领取', x: 6, y: 24, w: 146, tone: 'idle' },
  { key: 'claimed', zh: '已领取', x: 200, y: 24, w: 146, tone: 'accent' },
  { key: 'in_progress', zh: '进行中', x: 394, y: 24, w: 152, tone: 'accent' },
  { key: 'completed', zh: '已完成', x: 594, y: 24, w: 160, tone: 'done' },
] as const

const TONE: Record<string, string> = {
  idle: 'border-line-strong bg-ink-850',
  accent: 'border-accent/30 bg-ink-800',
  done: 'border-done/30 bg-done/6',
  fail: 'border-fail/25 bg-fail/5',
}

const ATTEMPT_PHASES = [
  {
    title: '正常执行中',
    sub: '成员手里的票据和磁盘一致',
    tone: 'accent' as const,
    rows: [
      ['status', 'in_progress'],
      ['assignee', 'feature-analyst'],
      ['attempt', '1'],
      ['attemptId', '3c9f…a41e'],
    ],
  },
  {
    title: '队长发起转派',
    sub: 'invalidateTaskAttempt() 先作废，再去中断人',
    tone: 'wait' as const,
    rows: [
      ['status', 'pending'],
      ['assignee', 'perf-reviewer'],
      ['attemptId', '— 立即清空'],
      ['handoffId', '7a2e…c503'],
      ['reassigning', 'true'],
    ],
  },
  {
    title: '旧成员迟到写入',
    sub: '中断信号还没被观察到，它仍在写',
    tone: 'fail' as const,
    rows: [
      ['调用', 'update_task(3c9f…a41e)'],
      ['结果', 'stale attempt · 拒绝'],
      ['影响', '磁盘未被改动'],
    ],
  },
  {
    title: '新一轮干净开始',
    sub: '等旧成员安静之后才发新票据',
    tone: 'done' as const,
    rows: [
      ['status', 'claimed'],
      ['assignee', 'perf-reviewer'],
      ['attempt', '2'],
      ['attemptId', 'b18d…6f70'],
    ],
  },
]

const PHASE_TONE: Record<string, { ring: string; dot: string; text: string }> = {
  accent: { ring: 'border-accent/25', dot: 'bg-accent', text: 'text-accent-soft' },
  wait: { ring: 'border-wait/25', dot: 'bg-wait', text: 'text-wait' },
  fail: { ring: 'border-fail/25', dot: 'bg-fail', text: 'text-fail' },
  done: { ring: 'border-done/25', dot: 'bg-done', text: 'text-done' },
}

const RULES = [
  {
    title: '终态不可变',
    body: 'completed / failed / cancelled 之后再写会被直接拒绝，想重做只能走 agent_teams_reassign_task。',
  },
  {
    title: '一人一活',
    body: '成员手上还有未完成任务时，无论调度器还是它自己都领不到第二个。',
  },
  {
    title: '冷恢复重发',
    body: '进程重启后成员是 idle 却仍持有 claimed 任务，调度器撤销旧票据、发新 attempt，重新唤醒同一个人。',
  },
  {
    title: '归档而非删除',
    body: 'agent_teams_delete 是把整个目录 rename 进 archive/，任务、依赖图和邮箱全留着，随时可复盘。',
  },
]

function StateMachine() {
  return (
    <ScaledCanvas width={W} height={H}>
      <EdgeLayer w={W} h={H}>
        <Edge d="M 152 51 L 194 51" channel="dispatch" />
        <Edge d="M 346 51 L 388 51" channel="dispatch" />
        <Edge d="M 546 51 L 588 51" channel="report" />
        <Edge d={elbowV(79, 78, 478, 136, 18)} opacity={0.7} />
        <Edge d={elbowV(273, 78, 540, 136, 18)} opacity={0.7} />
        <Edge d={elbowV(470, 78, 602, 136, 18)} opacity={0.7} />
      </EdgeLayer>

      {STATES.map((state, index) => (
        <motion.div
          key={state.key}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 170, damping: 22, delay: index * 0.07 }}
        >
          <Box x={state.x} y={state.y} w={state.w} h={54}>
            <div
              className={cn(
                'flex h-full flex-col justify-center rounded-xl border px-3.5',
                TONE[state.tone],
              )}
            >
              <span className="font-mono text-[12px] text-fg">{state.key}</span>
              <span className="mt-0.5 text-[10.5px] text-fg-dim">{state.zh}</span>
            </div>
            {state.key === 'completed' && (
              <span className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-md border border-done/30 bg-ink-925 px-1.5 py-0.5 font-mono text-[9px] text-done">
                <Lock size={9} weight="bold" />
                不可变
              </span>
            )}
          </Box>
        </motion.div>
      ))}

      <Box x={430} y={136} w={244} h={52}>
        <div className={cn('flex h-full flex-col justify-center rounded-xl border px-3.5', TONE.fail)}>
          <span className="font-mono text-[12px] text-fg">failed / cancelled</span>
          <span className="mt-0.5 text-[10.5px] text-fg-dim">同样是终态 · 不可改写</span>
        </div>
      </Box>

      <Box x={700} y={140} w={158}>
        <p className="text-[10.5px] leading-relaxed text-fg-dim/70">
          pending 只能走 cancelled；failed 要从 claimed 之后才可能发生。
        </p>
      </Box>
    </ScaledCanvas>
  )
}

export function Consistency() {
  return (
    <section id="consistency" className="relative border-t border-line py-14 lg:py-16">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <header className="max-w-[64ch]">
          <span className="font-mono text-[11px] tracking-widest text-fg-dim/70">04 — CONSISTENCY</span>
          <h2 className="mt-2.5 text-[27px] leading-tight font-semibold tracking-tighter lg:text-[30px]">
            多个 Agent 同时写，凭什么不串
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-fg-dim">
            答案是一张票据：每次执行都带一个 attempt_id。转派时先把旧票据作废，再去中断人 —— 顺序反过来就会出事。
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-line bg-ink-900/50 p-5">
          <div className="mb-3 font-mono text-[10px] tracking-widest text-fg-dim/55">
            任务状态机 · 只允许这些迁移
          </div>
          <StateMachine />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {ATTEMPT_PHASES.map((phase, index) => {
            const tone = PHASE_TONE[phase.tone]
            return (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 150, damping: 22, delay: index * 0.08 }}
                className={cn('relative rounded-2xl border bg-ink-900/60 p-4', tone.ring)}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('size-1.5 rounded-full', tone.dot)} />
                  <span className="num text-[10px] text-fg-dim/45">T{index + 1}</span>
                  <span className="text-[13px] font-medium tracking-tight text-fg">{phase.title}</span>
                  {phase.tone === 'fail' && (
                    <Prohibit size={14} weight="bold" className="ml-auto text-fail" />
                  )}
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-fg-dim/75">{phase.sub}</p>
                <div className="mt-3 divide-y divide-line-soft border-t border-line">
                  {phase.rows.map(([key, value]) => (
                    <div key={key} className="flex items-baseline justify-between gap-3 py-1.5">
                      <span className="font-mono text-[10.5px] text-fg-dim/60">{key}</span>
                      <span
                        className={cn(
                          'truncate text-right font-mono text-[10.5px]',
                          phase.tone === 'fail' ? tone.text : 'text-fg/85',
                        )}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-0 border-t border-line md:grid-cols-2">
          {RULES.map((rule) => (
            <div key={rule.title} className="flex gap-4 border-b border-line py-3.5">
              <span className="w-[6em] shrink-0 text-[12.5px] text-fg">{rule.title}</span>
              <span className="text-[12px] leading-relaxed text-fg-dim">{rule.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
