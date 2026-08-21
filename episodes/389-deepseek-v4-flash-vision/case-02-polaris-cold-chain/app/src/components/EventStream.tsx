import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../lib/store'
import type { EventKind } from '../types'
import { IconAlert, IconRetry } from './Icon'

const KIND_LABEL: Record<EventKind, string> = {
  temp: '温控',
  delay: '延误',
  sla: '装卸',
  info: '信息',
}

const FILTERS: { id: 'all' | EventKind; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'temp', label: '温控' },
  { id: 'delay', label: '延误' },
  { id: 'sla', label: '装卸' },
]

/** wrap plates & order ids in highlight marks */
function rich(text: string) {
  const parts = text.split(/(沪[A-Z]·\d{4}|P-\d{6}-\d{4})/g)
  return parts.map((p, i) =>
    /^(沪[A-Z]·\d{4}|P-\d{6}-\d{4})$/.test(p) ? (
      <b key={i} className="hot">
        {p}
      </b>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

function EventsPanel() {
  const store = useStore()
  const { demoState, eventKindFilter } = store

  const events = useMemo(() => {
    const list = store.events.filter(
      (e) => eventKindFilter === 'all' || e.kind === eventKindFilter,
    )
    return [...list].sort((a, b) => (a.time < b.time ? 1 : -1))
  }, [store.events, eventKindFilter])

  const pending = store.events.filter((e) => !e.resolved).length
  const loading = demoState === 'loading'
  const empty = demoState === 'empty'
  const error = demoState === 'error'

  return (
    <>
      <div className="events-head">
        <span className="events-title">实时事件</span>
        <span className="events-live">
          <i />
          LIVE
        </span>
        <span className="events-count mono">
          待处理 <b>{pending}</b>
        </span>
      </div>

      <div className="events-filter" role="tablist" aria-label="事件类型筛选">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={eventKindFilter === f.id}
            data-active={eventKindFilter === f.id}
            onClick={() => store.setEventKindFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="events-error">
          <IconAlert size={20} />
          <span>事件流连接中断，最新消息停留在 02:11</span>
          <button onClick={() => store.setDemo('loading')}>
            <IconRetry size={13} style={{ verticalAlign: -2 }} /> 重新连接
          </button>
        </div>
      ) : empty ? (
        <div className="events-empty">
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--ink-4)' }}>
            NO EVENTS
          </span>
          <span>当前时段无待处理事件</span>
        </div>
      ) : loading ? (
        <div className="events-list" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="event" style={{ gridTemplateColumns: '14px 1fr' }}>
              <span className="skel" style={{ width: 3, height: 34, borderRadius: 3 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 2 }}>
                <span className="skel" style={{ width: 42, height: 8 }} />
                <span className="skel" style={{ width: '88%', height: 11 }} />
                <span className="skel" style={{ width: '58%', height: 11 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="events-list">
          <AnimatePresence initial={false}>
            {events.map((e, i) => (
              <motion.button
                key={e.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.045, 0.5), ease: [0.22, 1, 0.36, 1] }}
                className="event"
                data-sev={e.severity}
                data-resolved={e.resolved}
                disabled={!e.vehicleId}
                onClick={() => e.vehicleId && store.select(e.vehicleId)}
                title={e.vehicleId ? '在地图中定位该车辆' : undefined}
              >
                <span className="event-rail" />
                <span className="event-body">
                  <span className="event-time mono">{e.time}</span>
                  <span className="event-text">{rich(e.text)}</span>
                  <span className="event-meta">
                    <span className="event-kind">{KIND_LABEL[e.kind]}</span>
                    {e.orderId && <span className="event-ref mono">{e.orderId}</span>}
                    {e.resolved && (
                      <span className="event-resolved-chip">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                        已处理
                      </span>
                    )}
                  </span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

function useNarrow() {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 920px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 920px)')
    const on = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

/** desktop: fixed right panel · narrow: bottom sheet toggled from the chip */
export function EventStream() {
  const store = useStore()
  const narrow = useNarrow()

  if (!narrow) {
    return (
      <section className="events" aria-label="实时事件流">
        <EventsPanel />
      </section>
    )
  }

  return (
    <AnimatePresence>
      {store.eventsSheet && (
        <motion.section
          key="events-sheet"
          className="events events-sheet"
          aria-label="实时事件流"
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          exit={{ y: '105%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        >
          <EventsPanel />
        </motion.section>
      )}
    </AnimatePresence>
  )
}

/** floating toggle shown on narrow screens */
export function EventsToggle() {
  const store = useStore()
  const pending = store.events.filter((e) => !e.resolved).length
  return (
    <button
      className="events-toggle"
      aria-expanded={store.eventsSheet}
      onClick={() => store.setEventsSheet(!store.eventsSheet)}
    >
      <span className="events-live">
        <i />
        LIVE
      </span>
      实时事件
      {pending > 0 && <span className="events-toggle-count mono">{pending}</span>}
    </button>
  )
}
