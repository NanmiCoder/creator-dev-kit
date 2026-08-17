import { motion } from 'motion/react'
import { ScaledCanvas } from '../lib/ScaledCanvas'
import { cn } from '../lib/util'
import { CHANNEL, EdgeLayer, Whale, type Channel } from './diagram'

export interface Lane {
  title: string
  sub: string
  art?: string
  kind?: 'agent' | 'disk' | 'runtime'
}

export interface SeqStep {
  /** Source lane index; omit with `self` for an in-lane action. */
  from?: number
  to?: number
  self?: number
  label: string
  note?: string
  channel?: Channel
  /** Renders as a dashed "fallback" branch. */
  fallback?: boolean
}

const W = 860
const HEAD_H = 52
const FIRST = 108
const GAP = 52

export function Sequence({ lanes, steps }: { lanes: Lane[]; steps: SeqStep[] }) {
  const laneW = W / lanes.length
  const cx = lanes.map((_, index) => laneW * index + laneW / 2)
  const H = FIRST + steps.length * GAP + 16

  return (
    <ScaledCanvas width={W} height={H}>
      <EdgeLayer w={W} h={H}>
        {cx.map((x) => (
          <line
            key={x}
            x1={x}
            y1={HEAD_H + 6}
            x2={x}
            y2={H - 8}
            stroke="#ccd0d6"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
        ))}
        {steps.map((step, index) => {
          const y = FIRST + index * GAP
          if (step.self !== undefined) return null
          const from = cx[step.from ?? 0]
          const to = cx[step.to ?? 0]
          const dir = to > from ? 1 : -1
          const channel = step.channel ?? 'dispatch'
          return (
            <motion.path
              key={`${index}-${step.label}`}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              d={`M ${from + dir * 4} ${y} L ${to - dir * 10} ${y}`}
              stroke={CHANNEL[channel]}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeDasharray={step.fallback ? '5 5' : undefined}
              markerEnd={`url(#arrow-${channel})`}
              fill="none"
            />
          )
        })}
      </EdgeLayer>

      {lanes.map((lane, index) => (
        <div
          key={lane.title}
          className="absolute"
          style={{ left: cx[index] - laneW / 2 + 12, top: 0, width: laneW - 24, height: HEAD_H }}
        >
          <div
            className={cn(
              'flex h-full items-center gap-2.5 rounded-xl border px-3',
              lane.kind === 'disk'
                ? 'border-dashed border-line-strong bg-ink-900/60'
                : 'border-line bg-ink-850',
            )}
          >
            {lane.art ? (
              <Whale art={lane.art} size={30} />
            ) : (
              <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg border border-line-strong font-mono text-[9px] text-fg-dim">
                {lane.kind === 'disk' ? 'FS' : 'RT'}
              </span>
            )}
            <div className="min-w-0">
              <div className="truncate text-[12px] leading-tight font-medium">{lane.title}</div>
              <div className="mt-0.5 truncate font-mono text-[9.5px] text-fg-dim">{lane.sub}</div>
            </div>
          </div>
        </div>
      ))}

      {steps.map((step, index) => {
        const y = FIRST + index * GAP
        const channel = step.channel ?? 'dispatch'
        const isSelf = step.self !== undefined
        // Arrow captions hang off the arrow's origin so a long label can never
        // spill past the canvas edge; self-calls sit centred on the lifeline.
        const dir = isSelf ? 0 : (cx[step.to ?? 0] > cx[step.from ?? 0] ? 1 : -1)
        const anchor = isSelf ? cx[step.self!] : cx[step.from ?? 0] + dir * 10
        const shift = isSelf ? 'translateX(-50%)' : dir > 0 ? 'none' : 'translateX(-100%)'
        return (
          <motion.div
            key={`${index}-${step.label}`}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            className="absolute z-3 flex items-center gap-2 whitespace-nowrap"
            style={{ left: anchor, top: isSelf ? y - 15 : y - 28, transform: shift }}
          >
            <span
              className="num flex size-[17px] shrink-0 items-center justify-center rounded-md text-[9.5px]"
              style={{
                color: CHANNEL[channel],
                background: 'rgba(29,31,33,0.05)',
                border: `1px solid ${CHANNEL[channel]}33`,
              }}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                'rounded-lg px-2.5 py-1.5',
                isSelf
                  ? 'border border-line bg-ink-800'
                  : 'border border-line-soft bg-ink-850/95 shadow-[0_1px_2px_rgba(29,31,33,0.04)]',
              )}
            >
              <span className="font-mono text-[11px] text-fg/90">{step.label}</span>
              {step.note && (
                <span className="ml-2 text-[10.5px] text-fg-dim">{step.note}</span>
              )}
            </span>
          </motion.div>
        )
      })}
    </ScaledCanvas>
  )
}
