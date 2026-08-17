import { motion } from 'motion/react'
import { useState } from 'react'
import { cn } from '../lib/util'

const TREE: { depth: number; text: string; note?: string; tone?: 'file' | 'dir' | 'dim' }[] = [
  { depth: 0, text: '<workspace>/', tone: 'dim' },
  { depth: 1, text: '.agent-teams/', tone: 'dir', note: '插件配置里的 stateDir' },
  { depth: 2, text: 'repo-review/', tone: 'dir', note: '一个活动团队 = 一个目录' },
  { depth: 3, text: 'team.json', tone: 'file', note: '成员 · 任务 · 依赖 · attempt' },
  { depth: 3, text: 'inbox/', tone: 'dir' },
  { depth: 4, text: 'captain.jsonl', tone: 'file', note: '队长信箱' },
  { depth: 4, text: 'git-historian.jsonl', tone: 'file', note: '每个成员一个' },
  { depth: 4, text: 'feature-analyst.jsonl', tone: 'file' },
  { depth: 2, text: 'archive/repo-review/', tone: 'dir', note: 'delete 后整支队伍搬到这里' },
  { depth: 2, text: 'retired-members.json', tone: 'file', note: '不允许再被唤醒的会话 id' },
]

const GUARANTEES = [
  {
    title: '原子写',
    body: '先写同目录的临时文件，再 rename 覆盖。读到半截 JSON 的窗口不存在。',
  },
  {
    title: '进程内串行',
    body: '同一个团队的读—改—写走同一把 withTeamLock 队列，7 路并发认领只有一个赢。',
  },
  {
    title: '坏行容错',
    body: '邮箱里某一行 JSON 损坏，只跳过那一行并计数告警，整支队伍不会因此读不出来。',
  },
]

const TASK_FIELDS = [
  { key: 'id', type: 'string', desc: '团队内稳定的任务号，t1 / t2 / …' },
  { key: 'status', type: 'TaskStatus', desc: 'pending → claimed → in_progress → completed | failed | cancelled' },
  { key: 'assignee', type: 'string?', desc: '成员名或 captain；留空表示归共享池，谁空闲谁接' },
  { key: 'dependencies', type: 'string[]', desc: '这些任务全部 completed 之前，本任务不可领取' },
  { key: 'attempt', type: 'number', desc: '单调递增的执行代数，转派 / 重试各加一' },
  { key: 'attemptId', type: 'string?', desc: '当前这次执行的能力票据，更新任务时必须带上' },
  { key: 'handoffId', type: 'string?', desc: '一次尚未开始的转派世代，用来串行化交接' },
  { key: 'output', type: 'string?', desc: '成员写回的结果；终态之后不可改写' },
]

const MESSAGE_FIELDS = [
  { key: 'id / from / to', type: 'string', desc: '消息 id 与双方身份；from 只能是调用者本人' },
  { key: 'content', type: 'string', desc: '消息正文，原样进入对方的下一轮 turn' },
  { key: 'ts', type: 'number', desc: '写入邮箱的时间' },
  { key: 'deliveryClaimedAt', type: 'number?', desc: '投递租约（60 秒），防止实时投递与补投撞车' },
  { key: 'deliveredAt', type: 'number?', desc: '已被对方的实时收件箱接受' },
  { key: 'readAt', type: 'number?', desc: '已被消费；未读 = 没有 readAt 且租约已过期' },
]

const LIFECYCLE = [
  { stamp: 'ts', label: '写入邮箱', body: 'appendMailbox 追加一行 JSONL' },
  { stamp: 'deliveryClaimedAt', label: '领取投递', body: '一条消息同一时刻只归一条投递路径' },
  { stamp: 'deliveredAt', label: '送达', body: 'followup / steer 被对方接受' },
  { stamp: 'readAt', label: '已读', body: '对方消费掉，或被 status 读走并 ack' },
]

export function DataModel() {
  const [record, setRecord] = useState<'task' | 'message'>('task')
  const fields = record === 'task' ? TASK_FIELDS : MESSAGE_FIELDS

  return (
    <section id="files" className="relative border-t border-line py-14 lg:py-16">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <header className="max-w-[64ch]">
          <span className="font-mono text-[11px] tracking-widest text-fg-dim/70">03 — STATE ON DISK</span>
          <h2 className="mt-2.5 text-[27px] leading-tight font-semibold tracking-tighter lg:text-[30px]">
            全部状态，就是两种文件
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-fg-dim">
            没有数据库、没有内存里的协调器。一个 JSON 记团队，一堆 JSONL 记消息 —— 面板、工具、冷恢复读的都是同一份东西。
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-10">
          <div className="min-w-0">
            <div className="rounded-2xl border border-line bg-ink-900/50 p-5">
              <div className="mb-4 font-mono text-[10px] tracking-widest text-fg-dim/55">
                目录结构
              </div>
              <div className="font-mono text-[11.5px] leading-[1.9]">
                {TREE.map((row, index) => (
                  <motion.div
                    key={row.text + index}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="flex items-baseline gap-2"
                  >
                    <span className="text-fg-dim/25 select-none">
                      {row.depth === 0 ? '' : `${'│  '.repeat(Math.max(0, row.depth - 1))}├─ `}
                    </span>
                    <span
                      className={cn(
                        row.tone === 'file'
                          ? 'text-accent-soft'
                          : row.tone === 'dir'
                            ? 'text-fg/90'
                            : 'text-fg-dim/70',
                      )}
                    >
                      {row.text}
                    </span>
                    {row.note && (
                      <span className="ml-auto pl-3 text-right text-[10.5px] whitespace-nowrap text-fg-dim/55">
                        {row.note}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-5 divide-y divide-line border-y border-line">
              {GUARANTEES.map((item) => (
                <div key={item.title} className="flex gap-4 py-3">
                  <span className="w-[6em] shrink-0 text-[12.5px] text-fg">{item.title}</span>
                  <span className="text-[12px] leading-relaxed text-fg-dim">{item.body}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {(
                [
                  { key: 'task', label: 'TeamTask', file: 'team.json → tasks[]' },
                  { key: 'message', label: 'TeamMessage', file: 'inbox/<agent>.jsonl 的一行' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setRecord(tab.key)}
                  className={cn(
                    'relative rounded-xl px-3.5 py-2 text-left transition-colors active:scale-[0.98]',
                    record === tab.key ? 'text-fg' : 'text-fg-dim hover:text-fg/85',
                  )}
                >
                  {record === tab.key && (
                    <motion.span
                      layoutId="record-tab"
                      className="absolute inset-0 rounded-xl border border-line-strong bg-ink-850"
                      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    />
                  )}
                  <span className="relative font-mono text-[12.5px]">{tab.label}</span>
                  <span className="relative ml-2.5 font-mono text-[10px] text-fg-dim/60">
                    {tab.file}
                  </span>
                </button>
              ))}
            </div>

            <motion.div
              key={record}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 divide-y divide-line rounded-2xl border border-line bg-ink-900/50 px-5"
            >
              {fields.map((field) => (
                <div key={field.key} className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-4 py-2.5">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <span className="truncate font-mono text-[11.5px] text-accent-soft">
                      {field.key}
                    </span>
                    <span className="shrink-0 font-mono text-[9.5px] text-fg-dim/45">
                      {field.type}
                    </span>
                  </div>
                  <span className="text-[12px] leading-relaxed text-fg-dim">{field.desc}</span>
                </div>
              ))}
            </motion.div>

            <div className="mt-6">
              <div className="mb-3 font-mono text-[10px] tracking-widest text-fg-dim/55">
                一条消息的生命周期
              </div>
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                {LIFECYCLE.map((stage, index) => (
                  <motion.div
                    key={stage.stamp}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 160, damping: 22, delay: index * 0.07 }}
                    className="relative rounded-xl border border-line bg-ink-900/60 px-3.5 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="num text-[10px] text-fg-dim/40">0{index + 1}</span>
                      <span className="text-[12px] text-fg">{stage.label}</span>
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] break-all text-accent-soft/80">
                      {stage.stamp}
                    </div>
                    <div className="mt-1.5 text-[11px] leading-relaxed text-fg-dim/75">
                      {stage.body}
                    </div>
                    {index < LIFECYCLE.length - 1 && (
                      <span className="absolute top-1/2 -right-[7px] hidden size-1.5 -translate-y-1/2 rotate-45 border-t border-r border-line-strong lg:block" />
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed text-fg-dim/70">
                投递不成功时租约会被释放，消息原封不动留在磁盘；对方下一次变成 idle，调度器会先补投这些未读，再谈派新任务。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
