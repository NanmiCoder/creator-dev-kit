import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FLEET_STATS, SHIFT } from '../data/fleet'
import { useStore } from '../lib/store'
import { IconCommand, IconSearch } from './Icon'

/* ---- isolated 1s clock: re-renders only itself ---- */
function SystemClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return (
    <div className="tb-time mono" role="timer" aria-label="系统时间">
      {hh}:{mm}
      <span className="tb-time-sec">:{ss}</span>
    </div>
  )
}

/* ---- dynamic island: morphs between 正常 / 风险 / 处理中 ---- */
export function DynamicIsland() {
  const store = useStore()
  const pending = store.pendingRiskEvents
  const [processing, setProcessing] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  /* count resolved-within-3s events; own ticker keeps the island isolated */
  useEffect(() => {
    const tick = () => {
      const cutoff = Date.now() - 3200
      const n = store.events.filter(
        (e) => e.resolvedAt !== null && e.resolvedAt >= cutoff,
      ).length
      setProcessing(n)
    }
    tick()
    timer.current = setInterval(tick, 400)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.events])

  const kind = pending > 0 ? 'risk' : processing > 0 ? 'processing' : 'normal'
  const label =
    kind === 'risk' ? '风险' : kind === 'processing' ? '处理中' : '系统正常'
  const count = kind === 'risk' ? pending : processing

  return (
    <motion.button
      className="island"
      data-kind={kind}
      layout
      animate={{ scale: [1, 1.035, 1] }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onClick={() => {
        store.setEventKindFilter('all')
        store.setEventsSheet(true)
      }}
      aria-label={`动态状态：${label}`}
    >
      <span className="island-dot" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={label}
          className="island-label"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          className="island-count mono"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        >
          {count}
        </motion.span>
      )}
      <span className="island-hint">点击查看异常</span>
    </motion.button>
  )
}

export function TopBar() {
  const store = useStore()
  const onlinePct = Math.round((FLEET_STATS.online / FLEET_STATS.total) * 100)

  return (
    <header className="topbar">
      <div className="tb-brand">
        <span className="tb-brand-name">POLARIS</span>
        <span className="tb-brand-sub">冷链运控中心 · L5</span>
      </div>

      <div className="tb-shift">
        <span>
          当前班次 <b>{SHIFT.name}</b>
        </span>
        <span className="mono" style={{ color: 'var(--ink-3)' }}>
          {SHIFT.range}
        </span>
      </div>

      <SystemClock />

      <div className="tb-online">
        <span>
          在线车辆 <span className="mono">{FLEET_STATS.online} / {FLEET_STATS.total}</span>
        </span>
        <span className="tb-online-bar" aria-hidden="true">
          <i style={{ width: `${onlinePct}%` }} />
        </span>
      </div>

      <div className="tb-spacer" />

      <div className="tb-actions">
        <DynamicIsland />
        <button
          className="tb-search-btn"
          onClick={() => store.setPalette(true)}
          aria-label="打开搜索面板"
        >
          <IconSearch size={14} />
          <span>搜索车辆 / 订单</span>
          <kbd>⌘K</kbd>
        </button>
        <button
          className="tb-search-btn"
          onClick={() => store.setPopover('report')}
          aria-label="导出今日报表"
          style={{ padding: '0 9px' }}
        >
          <IconCommand size={13} />
        </button>
        <div className="tb-user">
          <span className="tb-avatar">砚</span>
          <span className="tb-user-meta">
            <span className="tb-user-name">王砚舟</span>
            <br />
            <span className="tb-user-role">调度台 A · 值班中</span>
          </span>
        </div>
      </div>
    </header>
  )
}
