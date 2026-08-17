import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Sequence, type Lane, type SeqStep } from './Sequence'
import { cn } from '../lib/util'
import { CHANNEL } from './diagram'

interface ChannelSpec {
  id: string
  index: string
  question: string
  title: string
  summary: string
  accent: keyof typeof CHANNEL
  lanes: Lane[]
  steps: SeqStep[]
  outcome: { label: string; value: string; note: string }[]
}

const CHANNELS: ChannelSpec[] = [
  {
    id: 'dispatch',
    index: 'A',
    question: '队长怎么把活儿交出去？',
    title: '队长 → 成员：建任务，然后不管了',
    summary:
      '队长只负责把任务和依赖写进任务池。真正"点名"的是调度器：它在成员空闲的那一刻挑一个依赖已满足的任务，原子地贴上 attempt_id，再唤醒成员。',
    accent: 'dispatch',
    lanes: [
      { title: '队长 Captain', sub: 'DSH 会话', art: 'team-lead' },
      { title: '调度器 + team.json', sub: 'scheduler / 磁盘', kind: 'runtime' },
      { title: '成员 Member', sub: 'continuable subagent', art: 'engineer' },
    ],
    steps: [
      { from: 0, to: 1, label: 'agent_teams_create_task', note: '带 dependencies' },
      { self: 1, label: 'unsatisfiedDependencies() 校验依赖' },
      { self: 1, label: 'beginTaskAttempt() → attempt+1 · 新 attemptId' },
      { from: 1, to: 2, label: 'ctx.subagents.followup(任务 + attempt_id)' },
      { from: 2, to: 1, label: 'agent_teams_claim_task', note: '拿回同一个 attempt_id' },
      { from: 2, to: 1, label: 'agent_teams_update_task(in_progress)' },
    ],
    outcome: [
      { label: '队长做了什么', value: '只写任务和依赖', note: '不需要手动指派、不需要轮询等待' },
      { label: '谁触发派发', value: 'agent/status 的 idle 边沿', note: '事件驱动，没有常驻循环' },
      { label: '成员能不能抢两个', value: '不能', note: 'memberOpenTask() 在领取时挡住' },
    ],
  },
  {
    id: 'peer',
    index: 'B',
    question: '成员之间怎么说话？',
    title: '成员 ↔ 成员：写对方的信箱，直接唤醒',
    summary:
      '没有中转。发消息就是往对方的 inbox/<name>.jsonl 追加一行，然后 followup() 把这条消息变成对方的下一轮 turn。队长既不转发也不知情。',
    accent: 'peer',
    lanes: [
      { title: '成员 A', sub: 'security-reviewer', art: 'security-reviewer' },
      { title: 'inbox/B.jsonl', sub: '持久化邮箱', kind: 'disk' },
      { title: '成员 B', sub: 'feature-analyst', art: 'engineer' },
    ],
    steps: [
      { from: 0, to: 1, label: 'agent_teams_send_message(to="B")', channel: 'peer' },
      { self: 1, label: 'appendMailbox() 追加一行 JSONL', channel: 'peer' },
      { from: 1, to: 2, label: 'deliverToMember() 即 followup()', channel: 'peer' },
      { self: 1, label: '标记 deliveredAt / readAt', channel: 'peer' },
      { from: 1, to: 0, label: '返回 delivered = "wake"', channel: 'peer' },
      {
        from: 1,
        to: 0,
        label: '投递不可用时：delivered = "mailbox"',
        note: '消息留在磁盘',
        channel: 'peer',
        fallback: true,
      },
    ],
    outcome: [
      { label: '队长在链路里吗', value: '不在', note: '发件人直接写收件人邮箱' },
      { label: '冒名发信', value: '被拒绝', note: 'from 只能是调用者自己的身份' },
      { label: '对方没醒来怎么办', value: '留在磁盘', note: '对方下次 idle 时由调度器补投' },
    ],
  },
  {
    id: 'report',
    index: 'C',
    question: '干完了怎么回话？',
    title: '成员 → 队长：先落盘，再插队',
    summary:
      '结果有两条落点：任务的 output 写回 team.json，一句汇报写进队长的信箱。然后 steer() 把它插进队长最近的一个模型步 —— 不用等队长这一整轮跑完。',
    accent: 'report',
    lanes: [
      { title: '成员 Member', sub: 'git-historian', art: 'researcher' },
      { title: 'team.json + inbox/captain.jsonl', sub: '磁盘', kind: 'disk' },
      { title: '队长 Captain', sub: 'DSH 会话', art: 'team-lead' },
    ],
    steps: [
      {
        from: 0,
        to: 1,
        label: 'agent_teams_update_task(completed, output)',
        note: '带当前 attempt_id',
        channel: 'report',
      },
      { self: 1, label: '终态写入，此后不可改写', channel: 'report' },
      { from: 0, to: 1, label: 'agent_teams_send_message(to="captain")', channel: 'report' },
      { from: 1, to: 2, label: 'captain.steer() 插进最近的模型步', channel: 'report' },
      { from: 2, to: 1, label: '标记 readAt · delivered = "live"', channel: 'report' },
      {
        from: 1,
        to: 2,
        label: '队长离线：留在信箱，等 agent_teams_status 读走',
        channel: 'report',
        fallback: true,
      },
    ],
    outcome: [
      { label: '结果存在哪', value: 'task.output + 邮箱', note: '成员的最后一条消息不可编程读取' },
      { label: '队长在跑怎么办', value: 'steer 到下一步', note: '不必等整轮结束' },
      { label: '终态还能改吗', value: '不能', note: '要重做只能 reassign_task' },
    ],
  },
]

export function Channels() {
  const [active, setActive] = useState(0)
  const channel = CHANNELS[active]

  return (
    <section id="channels" className="relative border-t border-line py-14 lg:py-16">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <header className="max-w-[62ch]">
          <span className="font-mono text-[11px] tracking-widest text-fg-dim/70">02 — CHANNELS</span>
          <h2 className="mt-2.5 text-[27px] leading-tight font-semibold tracking-tighter lg:text-[30px]">
            三条链路，各走各的
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-fg-dim">
            派发、互通、汇报是三条独立的通道。它们唯一的共同点是：都要先落到磁盘，再谈唤醒谁。
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10">
          <div className="flex flex-col gap-2">
            {CHANNELS.map((entry, index) => {
              const isActive = index === active
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-colors active:scale-[0.995]',
                    isActive
                      ? 'border-line-strong bg-ink-850'
                      : 'border-line bg-ink-900/40 hover:bg-ink-875',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="channel-bar"
                      className="absolute inset-y-2 left-0 w-[2.5px] rounded-full"
                      style={{ background: CHANNEL[entry.accent] }}
                      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                    />
                  )}
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="num text-[11px]"
                      style={{ color: isActive ? CHANNEL[entry.accent] : undefined }}
                    >
                      {entry.index}
                    </span>
                    <span
                      className={cn(
                        'text-[13.5px] font-medium tracking-tight',
                        isActive ? 'text-fg' : 'text-fg-dim',
                      )}
                    >
                      {entry.question}
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden text-[12.5px] leading-relaxed text-fg-dim"
                      >
                        <span className="mt-2.5 block">{entry.summary}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}

            <div className="mt-4 divide-y divide-line border-y border-line">
              <AnimatePresence mode="wait">
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {channel.outcome.map((row) => (
                    <div key={row.label} className="flex items-baseline gap-3 py-2.5">
                      <span className="w-[9em] shrink-0 text-[11.5px] text-fg-dim/70">
                        {row.label}
                      </span>
                      <span className="min-w-0">
                        <span className="text-[12.5px] text-fg">{row.value}</span>
                        <span className="ml-2 text-[11px] text-fg-dim/70">{row.note}</span>
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-line bg-ink-900/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-medium tracking-tight">{channel.title}</h3>
              <span className="font-mono text-[10px] tracking-widest text-fg-dim/50">
                SEQUENCE {channel.index}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Sequence lanes={channel.lanes} steps={channel.steps} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
