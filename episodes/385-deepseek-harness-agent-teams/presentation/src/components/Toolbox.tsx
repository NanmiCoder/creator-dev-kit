import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../lib/util'

type Role = 'captain' | 'member' | 'both'

interface ToolSpec {
  name: string
  who: Role
  purpose: string
  args: { key: string; desc: string; required?: boolean }[]
  returns: string
  guard: string
}

const TOOLS: ToolSpec[] = [
  {
    name: 'agent_teams_create',
    who: 'captain',
    purpose: '创建团队，调用者就地成为队长',
    args: [
      { key: 'name', desc: '团队名，同时是它的稳定 id', required: true },
      { key: 'description', desc: '这次要达成的目标' },
    ],
    returns: '{ team_id, team_name, state_dir }',
    guard: '一个队长同一时间只带一个团队；重名 id 会被拒绝',
  },
  {
    name: 'agent_teams_add_member',
    who: 'captain',
    purpose: 'spawn 一个可续聊的子 Agent 作为成员',
    args: [
      { key: 'name', desc: '团队内唯一的成员名', required: true },
      { key: 'role', desc: '角色，如 researcher / engineer / reviewer' },
      { key: 'provider', desc: '仅当用户明确点名异构模型时才传' },
      { key: 'model', desc: '默认快照队长当前的路由与思考强度' },
    ],
    returns: '{ member_id, provider, model, status }',
    guard: '名字撞车、超过 8 人上限都会明确失败',
  },
  {
    name: 'agent_teams_create_task',
    who: 'captain',
    purpose: '把目标拆成带依赖的任务，进共享池',
    args: [
      { key: 'subject', desc: '任务一句话标题', required: true },
      { key: 'description', desc: '具体要做什么' },
      { key: 'dependencies', desc: '前置任务 id，全部 completed 才可领取' },
      { key: 'assignee', desc: '可选指派；留空归共享池' },
    ],
    returns: '{ task_id, status, assignee }',
    guard: '依赖里不存在的任务 id 会被当场拒绝',
  },
  {
    name: 'agent_teams_claim_task',
    who: 'both',
    purpose: '领取一个就绪任务，拿回 attempt_id 票据',
    args: [
      { key: 'task_id', desc: '要领取的任务', required: true },
      { key: 'assignee', desc: '仅队长可代领' },
    ],
    returns: '{ attempt, attempt_id, status }',
    guard: '依赖未满足、别人已领、手上还有活 —— 都会被拒',
  },
  {
    name: 'agent_teams_update_task',
    who: 'both',
    purpose: '带 attempt_id 推进任务状态或写回产出',
    args: [
      { key: 'task_id', desc: '要更新的任务', required: true },
      { key: 'status', desc: 'in_progress / completed / failed / cancelled' },
      { key: 'output', desc: '完成或失败时的结果摘要' },
      { key: 'attempt_id', desc: '成员必须带上的当前票据' },
    ],
    returns: '{ status, attempt, output }',
    guard: '过期票据、终态改写、越权改别人的任务都会被拒',
  },
  {
    name: 'agent_teams_reassign_task',
    who: 'captain',
    purpose: '原子重试 / 转派 / 队长接管',
    args: [
      { key: 'task_id', desc: '要转派的任务', required: true },
      { key: 'assignee', desc: '目标成员，或 "captain" 表示接管', required: true },
      { key: 'reason', desc: '为什么转派' },
    ],
    returns: '{ previous_assignee, assignee, attempt }',
    guard: '先作废旧 attempt 再中断旧成员，迟到写入永远无效',
  },
  {
    name: 'agent_teams_send_message',
    who: 'both',
    purpose: '给队长或队友发消息，落信箱并唤醒对方',
    args: [
      { key: 'to', desc: '"captain" 或成员名', required: true },
      { key: 'content', desc: '消息正文', required: true },
    ],
    returns: '{ message_id, delivered: live | wake | mailbox }',
    guard: 'from 只能是调用者本人；不可冒名',
  },
  {
    name: 'agent_teams_status',
    who: 'both',
    purpose: '团队全景：成员活动、任务、信箱',
    args: [],
    returns: '成员实时 running/idle/ready · 任务含 output · 未读消息',
    guard: '队长看全部信箱；成员只看自己的。顺带把已读标记 readAt',
  },
  {
    name: 'agent_teams_remove_member',
    who: 'captain',
    purpose: '安全移除成员：回收其未完成活计',
    args: [{ key: 'name', desc: '要移除的成员', required: true }],
    returns: '{ requeued_tasks: [...] }',
    guard: '撤销 attempt、等中断收敛，任务回共享池重新调度',
  },
  {
    name: 'agent_teams_delete',
    who: 'captain',
    purpose: '收工：打断成员，整队归档而非删除',
    args: [],
    returns: '{ deleted: true, team_name }',
    guard: '目录整体 rename 进 archive/，任务图与信箱完整留存',
  },
]

const WHO_LABEL: Record<Role, string> = {
  captain: '仅队长',
  member: '仅成员',
  both: '双方',
}

const WHO_TONE: Record<Role, string> = {
  captain: 'border-accent/30 bg-accent/10 text-accent-soft',
  member: 'border-done/30 bg-done/8 text-done',
  both: 'border-line-strong bg-line-soft text-fg-dim',
}

const FILTERS: { key: Role | 'all'; label: string }[] = [
  { key: 'all', label: '全部 10 个' },
  { key: 'captain', label: '队长专用' },
  { key: 'both', label: '双方都可用' },
]

export function Toolbox() {
  const [filter, setFilter] = useState<Role | 'all'>('all')
  const [open, setOpen] = useState<string | null>(null)

  const shown = TOOLS.filter((tool) => {
    if (filter === 'all') return true
    if (filter === 'captain') return tool.who === 'captain'
    return tool.who === 'both'
  })

  return (
    <section id="tools" className="relative border-t border-line py-14 lg:py-16">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-[60ch]">
            <span className="font-mono text-[11px] tracking-widest text-fg-dim/70">
              05 — THE TOOLS
            </span>
            <h2 className="mt-2.5 text-[27px] leading-tight font-semibold tracking-tighter lg:text-[30px]">
              十个工具，就是全部操作面
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-fg-dim">
              模型能做的事被压缩成十个动词。队长负责建队、拆活、纠偏；成员负责领取、干活、回话。
              边界本身就是协议的一部分 —— 成员根本没有建队、转派这些按钮。
            </p>
          </div>
          <div className="flex gap-1 rounded-xl border border-line bg-ink-875/60 p-1">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={cn(
                  'relative rounded-lg px-3 py-1.5 text-[12px] transition-colors active:scale-[0.97]',
                  filter === item.key ? 'text-fg' : 'text-fg-dim hover:text-fg/85',
                )}
              >
                {filter === item.key && (
                  <motion.span
                    layoutId="tool-filter"
                    className="absolute inset-0 rounded-lg border border-line-strong bg-ink-800"
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </div>
        </header>

        <motion.div layout className="mt-8 columns-1 gap-4 md:columns-2 xl:columns-3">
          <AnimatePresence mode="popLayout">
            {shown.map((tool) => {
              const isOpen = open === tool.name
              return (
                <motion.div
                  key={tool.name}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                  className="mb-4 break-inside-avoid"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : tool.name)}
                    className={cn(
                      'block w-full rounded-2xl border text-left transition-colors active:scale-[0.995]',
                      isOpen
                        ? 'border-line-strong bg-ink-850'
                        : 'border-line bg-ink-900/50 hover:bg-ink-875',
                    )}
                  >
                    <div className="flex items-center gap-2.5 px-4 py-3.5">
                      <span
                        className={cn(
                          'shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[9.5px]',
                          WHO_TONE[tool.who],
                        )}
                      >
                        {WHO_LABEL[tool.who]}
                      </span>
                      <span className="min-w-0 truncate font-mono text-[13px] text-fg">
                        {tool.name}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        className="ml-auto shrink-0 text-fg-dim/50"
                      >
                        +
                      </motion.span>
                    </div>
                    <div className="px-4 pb-3.5 text-[12px] leading-relaxed text-fg-dim">
                      {tool.purpose}
                    </div>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-line px-4 py-3">
                            <div className="space-y-1.5">
                              {tool.args.map((arg) => (
                                <div key={arg.key} className="flex items-baseline gap-2.5">
                                  <span className="w-[11em] shrink-0 font-mono text-[10.5px] break-all text-accent-soft/85">
                                    {arg.key}
                                    {arg.required && <span className="text-fail/80">*</span>}
                                  </span>
                                  <span className="text-[11px] leading-relaxed text-fg-dim">
                                    {arg.desc}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 border-t border-line-soft pt-2.5">
                              <span className="font-mono text-[10px] tracking-widest text-fg-dim/50">
                                返回
                              </span>
                              <div className="mt-1 font-mono text-[10.5px] leading-relaxed break-all text-done/80">
                                {tool.returns}
                              </div>
                            </div>
                            <div className="mt-3 rounded-lg border border-line bg-ink-900/60 px-3 py-2 text-[11px] leading-relaxed text-fg-dim">
                              {tool.guard}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
