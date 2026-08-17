import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowCounterClockwise, CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react'
import { ActorStage } from './ActorStage'
import { TaskGraph } from './TaskGraph'
import { FileViewer } from './FileViewer'
import { SNAPSHOTS, STEPS, type ToolCall } from '../data/story'
import { cn } from '../lib/util'

const LAST = STEPS.length - 1

export function Orchestrator() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [file, setFile] = useState('team.json')
  const touched = useRef(false)

  const step = STEPS[index]
  const world = SNAPSHOTS[index]
  const previous = index > 0 ? SNAPSHOTS[index - 1] : null

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(LAST, next)))
    touched.current = false
  }, [])

  useEffect(() => {
    if (!touched.current && world.focus) setFile(world.focus)
  }, [index, world.focus])

  useEffect(() => {
    if (!playing) return
    if (index >= LAST) {
      setPlaying(false)
      return
    }
    const timer = window.setTimeout(() => go(index + 1), (step.hold ?? 7) * 1000)
    return () => window.clearTimeout(timer)
  }, [playing, index, step.hold, go])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return
      if (event.key === 'ArrowRight') go(index + 1)
      else if (event.key === 'ArrowLeft') go(index - 1)
      else if (event.key === ' ') {
        event.preventDefault()
        setPlaying((value) => !value)
      } else if (event.key.toLowerCase() === 'r') {
        setPlaying(false)
        go(0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, go])

  return (
    <section id="walkthrough" className="relative border-t border-line py-12 lg:py-14">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="min-w-0">
            <span className="font-mono text-[11px] tracking-widest text-fg-dim/70">01 — WALKTHROUGH</span>
            <h2 className="mt-2.5 text-[27px] leading-tight font-semibold tracking-tighter lg:text-[30px]">
              一次完整的协作，从建队到归档
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-fg-dim">
              左边是发生了什么，右边是磁盘上同时被改成什么样 —— 面板读的就是这些文件。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10.5px] text-fg-dim/45 xl:block">
              ← → 切换 · 空格 播放 · R 重播
            </span>
            <span className="num text-[12px] text-fg-dim">
              {String(index + 1).padStart(2, '0')}
              <span className="text-fg-dim/40"> / {STEPS.length}</span>
            </span>
            <div className="flex items-center gap-0.5 rounded-xl border border-line bg-ink-875/60 p-1">
              <ControlButton
                label="重播"
                onClick={() => {
                  setPlaying(false)
                  go(0)
                }}
              >
                <ArrowCounterClockwise size={15} weight="bold" />
              </ControlButton>
              <ControlButton label="上一步" disabled={index === 0} onClick={() => go(index - 1)}>
                <CaretLeft size={15} weight="bold" />
              </ControlButton>
              <button
                type="button"
                onClick={() => {
                  if (index >= LAST) go(0)
                  setPlaying((value) => !value)
                }}
                className="mx-0.5 flex h-8 items-center gap-2 rounded-lg bg-accent px-3.5 text-[12px] font-medium text-white transition-transform active:scale-[0.97]"
              >
                {playing ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
                {playing ? '暂停' : index >= LAST ? '重播' : '自动播放'}
              </button>
              <ControlButton label="下一步" disabled={index === LAST} onClick={() => go(index + 1)}>
                <CaretRight size={15} weight="bold" />
              </ControlButton>
            </div>
          </div>
        </header>

        <div className="mt-6 flex gap-1.5">
          {STEPS.map((entry, position) => {
            const active = position === index
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setPlaying(false)
                  go(position)
                }}
                className="group relative h-9 shrink-0 grow basis-0 overflow-hidden rounded-lg"
                title={entry.chapter}
              >
                <motion.span
                  layout
                  className={cn(
                    'absolute inset-0 rounded-lg border transition-colors',
                    active
                      ? 'border-accent/40 bg-accent/12'
                      : position < index
                        ? 'border-line bg-ink-800'
                        : 'border-line bg-ink-900 group-hover:bg-ink-850',
                  )}
                />
                <span
                  className={cn(
                    'relative font-mono text-[10px] tracking-wider',
                    active ? 'text-accent-soft' : position < index ? 'text-fg-dim/80' : 'text-fg-dim/40',
                  )}
                >
                  {entry.chapter.split(' · ')[0]}
                </span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2"
          >
            <span className="rounded-md border border-accent/25 bg-accent/10 px-2 py-1 font-mono text-[10.5px] text-accent-soft">
              {step.chapter}
            </span>
            <h3 className="font-mono text-[17px] font-medium tracking-tight text-fg">{step.title}</h3>
            <p className="min-w-[54ch] flex-1 text-[14px] leading-relaxed text-fg/80">{step.caption}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="min-w-0 space-y-4">
            <Panel label="参与者 · 实时链路">
              <ActorStage world={world} />
            </Panel>
            <Panel label="任务依赖图 · DAG">
              <TaskGraph world={world} />
            </Panel>
          </div>

          <div className="flex min-h-[420px] min-w-0 flex-col lg:min-h-0">
            <FileViewer
              world={world}
              previous={previous}
              activeKey={file}
              archived={world.archived}
              onSelect={(key) => {
                touched.current = true
                setFile(key)
              }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-t border-line pt-4">
            <div className="font-mono text-[10.5px] tracking-widest text-fg-dim/60">底层机制</div>
            <AnimatePresence mode="wait">
              <motion.p
                key={step.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                className="mt-2.5 text-[13px] leading-relaxed text-fg-dim"
              >
                {step.mechanism}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="border-t border-line pt-4">
            <div className="font-mono text-[10.5px] tracking-widest text-fg-dim/60">这一步发生的调用</div>
            <div className="mt-2.5 space-y-1.5">
              <AnimatePresence mode="popLayout">
                {step.calls.length === 0 ? (
                  <motion.div
                    key="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[11.5px] text-fg-dim/40"
                  >
                    — 还没有工具被调用
                  </motion.div>
                ) : (
                  step.calls.map((call, position) => (
                    <CallRow key={`${step.id}-${call.name}-${position}`} call={call} delay={position * 0.06} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-line bg-ink-900/50 px-3.5 pt-3.5 pb-3.5">
      <span className="pointer-events-none absolute top-3 left-4 z-4 font-mono text-[10px] tracking-widest text-fg-dim/50">
        {label}
      </span>
      {children}
    </div>
  )
}

function ControlButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg text-fg-dim transition-colors hover:bg-ink-800 hover:text-fg disabled:pointer-events-none disabled:opacity-30 active:scale-[0.95]"
    >
      {children}
    </button>
  )
}

const CALLER_TONE: Record<string, string> = {
  captain: 'text-accent-soft',
  runtime: 'text-wait',
}

function CallRow({ call, delay }: { call: ToolCall; delay: number }) {
  const args = Object.entries(call.args)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26, delay }}
      className="rounded-lg border border-line bg-ink-900/60 px-3 py-2 font-mono text-[11px]"
    >
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className={cn('text-[10px]', CALLER_TONE[call.by] ?? 'text-done')}>{call.by}</span>
        <span className="text-fg-dim/30">›</span>
        <span className="text-fg">{call.name}</span>
      </div>
      {args.length > 0 && (
        <div className="mt-1 text-[10.5px] leading-relaxed break-all text-fg-dim/75">
          {args.map(([key, value]) => (
            <span key={key} className="mr-3 inline-block">
              <span className="text-fg-dim/45">{key}=</span>
              {typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}
            </span>
          ))}
        </div>
      )}
      {call.returns && (
        <div className="mt-1 text-[10.5px] text-done/75">
          ← {JSON.stringify(call.returns).replace(/","/g, '", "')}
        </div>
      )}
    </motion.div>
  )
}
