import { AnimatePresence, motion } from 'motion/react'
import { ScaledCanvas } from '../lib/ScaledCanvas'
import { arc, cn, elbowV } from '../lib/util'
import { Box, Card, Edge, EdgeLabel, EdgeLayer, Packet, Whale } from './diagram'
import { CAPTAIN, type Member, type World } from '../data/story'

const W = 640
const H = 340
const SLOTS = [16, 232, 448]
const CENTER = SLOTS.map((x) => x + 88)

const STATUS_TONE: Record<Member['status'], { dot: string; label: string }> = {
  working: { dot: 'bg-accent', label: 'working' },
  idle: { dot: 'bg-idle', label: 'idle' },
  removed: { dot: 'bg-ink-600', label: 'retired' },
}

function memberIndex(world: World, name: string): number {
  return world.members.findIndex((member) => member.name === name)
}

export function ActorStage({ world }: { world: World }) {
  const beam = world.beam
  const targets = beam ? (Array.isArray(beam.to) ? beam.to : [beam.to]) : []
  const lit = new Set(world.spotlight)

  const downPaths =
    beam && (beam.kind === 'spawn' || beam.kind === 'dispatch') && beam.from === CAPTAIN
      ? targets
          .map((name) => memberIndex(world, name))
          .filter((index) => index >= 0)
          .map((index) => elbowV(320, 84, CENTER[index], 178, 24))
      : []

  const upPath =
    beam && beam.kind === 'report' && beam.from !== CAPTAIN
      ? (() => {
          const index = memberIndex(world, beam.from)
          return index >= 0 ? elbowV(CENTER[index], 178, 320, 84, 24) : null
        })()
      : null

  const peerPath =
    beam && beam.kind === 'peer'
      ? (() => {
          const from = memberIndex(world, beam.from)
          const to = memberIndex(world, targets[0] ?? '')
          if (from < 0 || to < 0) return null
          const sx = CENTER[from]
          const tx = CENTER[to]
          return arc(sx, 282, tx, 282, tx > sx ? 44 : -44)
        })()
      : null

  return (
    <ScaledCanvas width={W} height={H}>
      <EdgeLayer w={W} h={H}>
        {/* idle rails keep the topology visible even when nothing is moving */}
        {world.members.map((member, index) => (
          <Edge
            key={member.name}
            d={elbowV(320, 84, CENTER[index], 178, 24)}
            arrow={false}
            opacity={0.5}
          />
        ))}

        {downPaths.map((d) => (
          <g key={d}>
            <Edge d={d} channel={beam?.kind === 'spawn' ? 'peer' : 'dispatch'} width={2} />
            <Packet path={d} channel={beam?.kind === 'spawn' ? 'peer' : 'dispatch'} duration={1.2} />
          </g>
        ))}
        {upPath && (
          <>
            <Edge d={upPath} channel="report" width={2} />
            <Packet path={upPath} channel="report" duration={1.2} />
          </>
        )}
        {peerPath && (
          <>
            <Edge d={peerPath} channel="peer" width={2} dashed />
            <Packet path={peerPath} channel="peer" duration={1.1} />
          </>
        )}
      </EdgeLayer>

      <AnimatePresence>
        {beam?.label && (
          <motion.div
            key={beam.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <EdgeLabel
              x={peerPath ? 320 : 336}
              y={peerPath ? 330 : 134}
              channel={beam.kind === 'report' ? 'report' : beam.kind === 'peer' ? 'peer' : 'dispatch'}
              align={peerPath ? 'center' : 'left'}
            >
              {beam.label}
            </EdgeLabel>
          </motion.div>
        )}
      </AnimatePresence>

      <Box x={180} y={8} w={280} h={76}>
        <Card active={lit.has(CAPTAIN)} tone="accent" className="flex items-center gap-3 px-3.5">
          <div className="relative">
            <Whale art="team-lead" size={44} />
            <motion.span
              animate={{ scale: lit.has(CAPTAIN) ? [1, 1.35, 1] : 1, opacity: lit.has(CAPTAIN) ? 1 : 0.5 }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-accent ring-2 ring-ink-850"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] leading-tight font-semibold tracking-tight">队长 Captain</div>
            <div className="mt-1 font-mono text-[10px] text-fg-dim">
              {world.archived ? 'team archived' : world.teamCreated ? 'leading repo-review' : 'no team yet'}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="num text-[13px] leading-none text-fg/80">
              {world.mailboxes[CAPTAIN]?.length ?? 0}
            </div>
            <div className="mt-1 font-mono text-[9px] text-fg-dim/70">inbox</div>
          </div>
        </Card>
      </Box>

      <AnimatePresence>
        {world.members.map((member, index) => {
          const tone = STATUS_TONE[member.status]
          const task = world.tasks.find(
            (candidate) =>
              candidate.assignee === member.name &&
              (candidate.status === 'claimed' || candidate.status === 'in_progress'),
          )
          const unread = (world.mailboxes[member.name] ?? []).length
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: member.status === 'removed' ? 0.45 : 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 140, damping: 20, delay: index * 0.07 }}
            >
              <Box x={SLOTS[index]} y={186} w={176} h={96}>
                <Card active={lit.has(member.name)} className="flex flex-col">
                  <div className="flex flex-1 items-center gap-2.5 px-3">
                    <div className="relative">
                      <Whale art={member.art} size={38} />
                      <span
                        className={cn(
                          'absolute -right-0.5 -bottom-0.5 size-2 rounded-full ring-2 ring-ink-850',
                          tone.dot,
                          member.status === 'working' && '[animation:breathe_1.5s_ease-in-out_infinite]',
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[11.5px] leading-tight font-medium">
                        {member.name}
                      </div>
                      <div className="mt-0.5 font-mono text-[9.5px] text-fg-dim">{tone.label}</div>
                    </div>
                    {unread > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                        className="num absolute top-2 right-2.5 rounded-full px-1.5 py-0.5 text-[9px] text-accent-soft"
                        style={{ background: 'rgba(255,102,0,0.12)' }}
                      >
                        {unread}
                      </motion.span>
                    )}
                  </div>
                  <div className="border-t border-line px-3 py-1.5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={task?.id ?? 'idle'}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="font-mono text-[9.5px] whitespace-nowrap"
                      >
                        {task ? (
                          <span className="text-accent-soft">
                            {task.id} · attempt {task.attempt}
                          </span>
                        ) : (
                          <span className="text-fg-dim/60">等待调度</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Card>
              </Box>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {world.members.length === 0 && (
        <Box x={16} y={186} w={608} h={96}>
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-line text-[12px] text-fg-dim/50">
            还没有成员 —— 队长要先把角色拉进来
          </div>
        </Box>
      )}
    </ScaledCanvas>
  )
}
