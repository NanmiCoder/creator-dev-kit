import { motion } from 'motion/react'
import { ScaledCanvas } from '../lib/ScaledCanvas'
import { elbowV } from '../lib/util'
import { Box, Card, Edge, EdgeLabel, EdgeLayer, Packet, Whale } from './diagram'

const W = 1040
const H = 724

const MEMBERS = [
  { x: 126, name: 'git-historian', role: 'researcher', art: 'researcher' },
  { x: 438, name: 'feature-analyst', role: 'engineer', art: 'engineer' },
  { x: 750, name: 'security-reviewer', role: 'reviewer', art: 'security-reviewer' },
] as const

const FAN = [
  elbowV(540, 260, 228, 320, 22),
  'M 540 260 L 540 320',
  elbowV(540, 260, 852, 320, 22),
]

const REPORT_PATH = 'M 954 388 L 982 388 Q 1000 388 1000 370 L 1000 88 Q 1000 70 982 70 L 758 70'
const CAPTAIN_TO_POOL = 'M 540 116 L 540 168'

const enter = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

export function MasterFlow() {
  return (
    <ScaledCanvas width={W} height={H}>
      <EdgeLayer w={W} h={H}>
        {/* structure */}
        <Edge d="M 294 70 L 322 70" />
        <Edge d="M 228 448 L 228 532" dashed arrow={false} opacity={0.55} />
        <Edge d="M 540 504 L 540 532" dashed arrow={false} opacity={0.55} />
        <Edge d="M 852 448 L 852 532" dashed arrow={false} opacity={0.55} />

        {/* dispatch chain */}
        <Edge d={CAPTAIN_TO_POOL} channel="dispatch" />
        {FAN.map((d) => (
          <Edge key={d} d={d} channel="dispatch" />
        ))}

        {/* peer bus */}
        <Edge d="M 336 388 L 432 388" channel="peer" dashed startArrow />
        <Edge d="M 648 388 L 744 388" channel="peer" dashed startArrow />

        {/* report */}
        <Edge d={REPORT_PATH} channel="report" />

        {/* live traffic */}
        <Packet path={CAPTAIN_TO_POOL} channel="dispatch" duration={1.5} />
        {FAN.map((d, index) => (
          <Packet key={d} path={d} channel="dispatch" duration={1.9} delay={0.6 + index * 0.22} />
        ))}
        <Packet path={REPORT_PATH} channel="report" duration={3.4} delay={1.4} />
        <Packet path="M 336 388 L 432 388" channel="peer" duration={1.6} delay={2.1} r={3} />
        <Packet path="M 744 388 L 648 388" channel="peer" duration={1.6} delay={0.9} r={3} />
      </EdgeLayer>

      <EdgeLabel x={556} y={144} channel="dispatch" align="left">
        任务入池
      </EdgeLabel>
      <EdgeLabel x={556} y={292} channel="dispatch" align="left">
        派发 · 唤醒
      </EdgeLabel>
      <EdgeLabel x={384} y={366} channel="peer">
        直达
      </EdgeLabel>
      <EdgeLabel x={696} y={366} channel="peer">
        直达
      </EdgeLabel>
      <EdgeLabel x={874} y={44} channel="report">
        汇报 · steer()
      </EdgeLabel>

      {/* user request */}
      <motion.div variants={enter} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <Box x={32} y={46} w={262} h={48}>
          <Card tone="ghost" className="flex flex-col justify-center px-3.5">
            <span className="font-mono text-[10px] tracking-wider text-fg-dim/70">用户</span>
            <span className="mt-0.5 text-[12.5px] leading-tight text-fg/85">
              用 AgentTeams 审查这两周的提交
            </span>
          </Card>
        </Box>
      </motion.div>

      {/* captain */}
      <motion.div
        variants={enter}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ delay: 0.06 }}
      >
        <Box x={330} y={24} w={420} h={92}>
          <Card tone="accent" className="flex items-center gap-3.5 px-4">
            <div className="relative">
              <Whale art="team-lead" size={52} />
              <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-accent ring-2 ring-ink-850" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] leading-tight font-semibold tracking-tight">
                队长 Captain
              </div>
              <div className="mt-1 text-[11.5px] leading-tight text-fg-dim">
                就是发起这次对话的 DSH 会话本身
              </div>
            </div>
            <div className="shrink-0 rounded-lg border border-line bg-ink-900/70 px-2 py-1.5 text-center">
              <div className="num text-[15px] leading-none text-accent-soft">10</div>
              <div className="mt-1 font-mono text-[9px] tracking-wide text-fg-dim/70">tools</div>
            </div>
          </Card>
        </Box>
      </motion.div>

      {/* scheduler */}
      <motion.div
        variants={enter}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ delay: 0.12 }}
      >
        <Box x={230} y={176} w={620} h={84}>
          <Card className="flex flex-col justify-center px-5">
            <div className="flex items-center gap-2.5">
              <span className="size-1.5 rounded-full bg-accent [animation:breathe_2.4s_ease-in-out_infinite]" />
              <span className="text-[15px] leading-none font-semibold tracking-tight">
                共享任务池 · 事件驱动调度器
              </span>
            </div>
            <div className="mt-2.5 font-mono text-[11px] leading-none text-fg-dim">
              agent/status idle → 依赖校验 → 原子领取 attempt_id → followup() 唤醒
            </div>
          </Card>
        </Box>
      </motion.div>

      {/* members */}
      {MEMBERS.map((member, index) => (
        <motion.div
          key={member.name}
          variants={enter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.18 + index * 0.07 }}
        >
          <Box x={member.x} y={328} w={204} h={120}>
            <Card className="flex flex-col">
              <div className="flex flex-1 items-center gap-3 px-3.5">
                <div className="relative">
                  <Whale art={member.art} size={44} />
                  <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-done ring-2 ring-ink-850" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] leading-tight font-medium">{member.name}</div>
                  <div className="mt-1 font-mono text-[10px] text-fg-dim">{member.role}</div>
                </div>
              </div>
              <div className="border-t border-line px-3.5 py-2 font-mono text-[9.5px] tracking-wide text-fg-dim/75">
                durable continuable subagent
              </div>
            </Card>
          </Box>
        </motion.div>
      ))}

      {/* peer note */}
      <Box x={250} y={466} w={580} h={38}>
        <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-accent-soft/25 bg-accent/4 text-[12.5px] text-accent-soft/90">
          成员 ↔ 成员：写进对方 inbox 并直接唤醒，队长不在这条链路上
        </div>
      </Box>

      {/* disk */}
      <motion.div
        variants={enter}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Box x={40} y={540} w={960} h={152}>
          <Card tone="ghost" className="px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11.5px] text-fg-dim">
                &lt;workspace&gt;/.agent-teams/repo-review/
              </span>
              <span className="rounded-md border border-line px-2 py-1 font-mono text-[10px] text-fg-dim/80">
                磁盘 = 唯一真相
              </span>
            </div>
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              {[
                { file: 'team.json', desc: '成员 · 任务 · 依赖 · attempt · 状态机' },
                { file: 'inbox/*.jsonl', desc: '每个成员一个邮箱，一行一条消息' },
              ].map((entry) => (
                <div
                  key={entry.file}
                  className="rounded-xl border border-line bg-ink-850/70 px-4 py-3"
                >
                  <div className="font-mono text-[13px] text-accent-soft">{entry.file}</div>
                  <div className="mt-1.5 text-[11.5px] text-fg-dim">{entry.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </Box>
      </motion.div>
    </ScaledCanvas>
  )
}
