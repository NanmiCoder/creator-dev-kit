import { AnimatePresence, motion } from 'motion/react'
import { ScaledCanvas } from '../lib/ScaledCanvas'
import { cn, elbowH } from '../lib/util'
import { Box, Edge, EdgeLayer, Packet } from './diagram'
import { visualState, type Task, type VisualTaskState, type World } from '../data/story'

const W = 640
const H = 196

const POS: Record<string, { x: number; y: number; w: number }> = {
  t1: { x: 6, y: 62, w: 150 },
  t2: { x: 228, y: 6, w: 150 },
  t3: { x: 228, y: 120, w: 150 },
  t4: { x: 450, y: 62, w: 160 },
}

const TONE: Record<VisualTaskState, { ring: string; dot: string; text: string; label: string }> = {
  blocked: {
    ring: 'border-wait/30 border-dashed bg-ink-900/60',
    dot: 'bg-wait',
    text: 'text-wait',
    label: '等待依赖',
  },
  open: { ring: 'border-line bg-ink-850/70', dot: 'bg-idle', text: 'text-fg-dim', label: '可领取' },
  claimed: {
    ring: 'border-accent/25 bg-ink-800/80',
    dot: 'bg-accent-soft',
    text: 'text-accent-soft/80',
    label: '已领取',
  },
  running: {
    ring: 'border-accent/45 bg-ink-800',
    dot: 'bg-accent',
    text: 'text-accent-soft',
    label: '进行中',
  },
  completed: {
    ring: 'border-done/30 bg-done/6',
    dot: 'bg-done',
    text: 'text-done',
    label: '已交付',
  },
}

function edgeOf(from: string, to: string): string {
  const a = POS[from]
  const b = POS[to]
  return elbowH(a.x + a.w, a.y + 34, b.x - 8, b.y + 34, 18)
}

export function TaskGraph({ world }: { world: World }) {
  const tasks = world.tasks
  const byId = new Map(tasks.map((task) => [task.id, task]))
  const edges = tasks.flatMap((task) =>
    task.dependencies
      .filter((id) => byId.has(id))
      .map((id) => ({ id: `${id}->${task.id}`, d: edgeOf(id, task.id), unlocked: byId.get(id)!.status === 'completed' })),
  )

  if (tasks.length === 0) {
    return (
      <div className="flex h-[120px] items-center justify-center rounded-2xl border border-dashed border-line text-[12px] text-fg-dim/50">
        任务图还是空的 —— 目标还没被拆开
      </div>
    )
  }

  return (
    <ScaledCanvas width={W} height={H}>
      <EdgeLayer w={W} h={H}>
        {edges.map((edge) => (
          <g key={edge.id}>
            <Edge
              d={edge.d}
              channel={edge.unlocked ? 'report' : 'structure'}
              opacity={edge.unlocked ? 0.9 : 0.65}
              width={1.5}
            />
            {edge.unlocked && <Packet path={edge.d} channel="report" duration={2.2} r={2.6} />}
          </g>
        ))}
      </EdgeLayer>

      <AnimatePresence>
        {tasks.map((task, index) => (
          <TaskNode key={task.id} task={task} tasks={tasks} index={index} />
        ))}
      </AnimatePresence>
    </ScaledCanvas>
  )
}

function TaskNode({ task, tasks, index }: { task: Task; tasks: Task[]; index: number }) {
  const state = visualState(task, tasks)
  const tone = TONE[state]
  const pos = POS[task.id]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 20, delay: index * 0.06 }}
    >
      <Box x={pos.x} y={pos.y} w={pos.w} h={68}>
        <motion.div
          layout
          className={cn('flex h-full flex-col justify-center gap-1.5 rounded-xl border px-3', tone.ring)}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'size-1.5 rounded-full',
                tone.dot,
                state === 'running' && '[animation:breathe_1.4s_ease-in-out_infinite]',
              )}
            />
            <span className="num text-[11px] text-fg/85">{task.id}</span>
            <span className={cn('ml-auto font-mono text-[9px]', tone.text)}>{tone.label}</span>
          </div>
          <div className="line-clamp-2 text-[10.5px] leading-[1.35] text-fg-dim">{task.subject}</div>
          <div className="truncate font-mono text-[9px] text-fg-dim/60">
            {task.assignee ?? '共享池 · 未指派'}
          </div>
        </motion.div>
      </Box>
    </motion.div>
  )
}
