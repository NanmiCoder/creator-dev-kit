import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../lib/util'
import { WHALES } from '../lib/whales'

export const CHANNEL = {
  dispatch: '#ff6600',
  peer: '#64707d',
  report: '#1e8a6a',
  structure: '#ccd0d6',
} as const

export type Channel = keyof typeof CHANNEL

interface BoxProps {
  x: number
  y: number
  w: number
  h?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** An absolutely placed node in design space. */
export function Box({ x, y, w, h, className, style, children }: BoxProps) {
  return (
    <div
      className={cn('absolute', className)}
      style={{ left: x, top: y, width: w, ...(h === undefined ? {} : { height: h }), ...style }}
    >
      {children}
    </div>
  )
}

/** The SVG edge layer. Always sits behind or above nodes by z-index. */
export function EdgeLayer({
  w,
  h,
  above = false,
  children,
}: {
  w: number
  h: number
  above?: boolean
  children: ReactNode
}) {
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: above ? 2 : 0 }}
    >
      <defs>
        {Object.entries(CHANNEL).map(([key, color]) => (
          <marker
            key={key}
            id={`arrow-${key}`}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={color} />
          </marker>
        ))}
      </defs>
      {children}
    </svg>
  )
}

interface EdgeProps {
  d: string
  channel?: Channel
  dashed?: boolean
  flowing?: boolean
  width?: number
  arrow?: boolean
  startArrow?: boolean
  opacity?: number
}

export function Edge({
  d,
  channel = 'structure',
  dashed = false,
  flowing = false,
  width = 1.6,
  arrow = true,
  startArrow = false,
  opacity = 1,
}: EdgeProps) {
  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={CHANNEL[channel]}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 6' : undefined}
        markerEnd={arrow ? `url(#arrow-${channel})` : undefined}
        markerStart={startArrow ? `url(#arrow-${channel})` : undefined}
      />
      {flowing && (
        <path
          d={d}
          fill="none"
          stroke={CHANNEL[channel]}
          strokeWidth={width + 1.4}
          strokeLinecap="round"
          className="dash-flow"
          opacity={0.75}
        />
      )}
    </g>
  )
}

/** A dot that rides a path forever — the "live traffic" signal. */
export function Packet({
  path,
  channel = 'dispatch',
  duration = 2.6,
  delay = 0,
  r = 3.4,
}: {
  path: string
  channel?: Channel
  duration?: number
  delay?: number
  r?: number
}) {
  return (
    <circle r={r} fill={CHANNEL[channel]} opacity={0}>
      <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} path={path} />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.12;0.85;1"
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
      />
    </circle>
  )
}

/** Small label placed over the edge layer. */
export function EdgeLabel({
  x,
  y,
  children,
  channel,
  align = 'center',
}: {
  x: number
  y: number
  children: ReactNode
  channel?: Channel
  align?: 'center' | 'left'
}) {
  return (
    <div
      className="absolute z-3 whitespace-nowrap"
      style={{
        left: x,
        top: y,
        transform: align === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)',
      }}
    >
      <span
        className="rounded-md border border-line bg-ink-850/95 px-2 py-[3px] font-mono text-[11px] tracking-tight shadow-[0_1px_2px_rgba(29,31,33,0.05)]"
        style={{ color: channel ? CHANNEL[channel] : '#55606f' }}
      >
        {children}
      </span>
    </div>
  )
}

/** The standard card surface used for every diagram node. */
export function Card({
  active = false,
  tone = 'default',
  className,
  children,
}: {
  active?: boolean
  tone?: 'default' | 'accent' | 'ghost'
  className?: string
  children: ReactNode
}) {
  return (
    <motion.div
      animate={{
        borderColor: active ? 'rgba(255,102,0,0.55)' : 'rgba(29,31,33,0.10)',
        backgroundColor:
          tone === 'ghost'
            ? 'rgba(245,245,245,0.72)'
            : active
              ? 'rgba(255,246,238,0.95)'
              : 'rgba(255,255,255,0.92)',
      }}
      transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      className={cn(
        'relative h-full rounded-2xl border shadow-[0_1px_2px_rgba(29,31,33,0.04),0_10px_28px_-16px_rgba(29,31,33,0.10)]',
        tone === 'accent' && 'ring-1 ring-accent/25',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

/** Role/action whale mascot from the plugin's own asset pack. */
export function Whale({ art, size = 44, className }: { art: string; size?: number; className?: string }) {
  return (
    <img
      src={WHALES[art] ?? WHALES['team-lead']}
      alt=""
      width={size}
      height={size}
      className={cn('shrink-0 rounded-xl object-cover', className)}
      style={{ width: size, height: size }}
    />
  )
}
