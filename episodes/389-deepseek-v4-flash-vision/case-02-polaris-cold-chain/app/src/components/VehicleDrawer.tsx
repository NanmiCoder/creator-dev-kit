import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CITY_NAME } from '../data/fleet'
import { getRoute } from '../lib/geo'
import { useStore } from '../lib/store'
import type { Vehicle } from '../types'
import { IconCheck, IconClose, IconPhone } from './Icon'

const STATUS_LABEL: Record<string, string> = {
  transit: '运输中',
  risk: '温控风险',
  delayed: '延误',
  loading: '装卸中',
  delivered: '已送达',
  idle: '待命',
}

function useMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const on = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

function TempChart({ vehicle }: { vehicle: Vehicle }) {
  const W = 388
  const H = 118
  const pad = { l: 34, r: 12, t: 12, b: 20 }
  const data = vehicle.tempHistory
  const min = Math.min(...data, vehicle.tempTarget) - 1
  const max = Math.max(...data, vehicle.tempTarget) + 1
  const x = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b)
  const line = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${pad.l},${H - pad.b} ${line} ${x(data.length - 1)},${H - pad.b}`
  const risk = vehicle.status === 'risk'
  const color = risk ? 'var(--amber-bright)' : 'var(--amber-soft)'

  const ticks = [data[0], data[3], data[6], data[9], data[11]]
  const tickLabels = ['01:00', '01:30', '02:00', '02:30', '02:57']

  return (
    <svg className="dr-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="近两小时温度曲线">
      <defs>
        <linearGradient id="dr-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + f * (H - pad.t - pad.b)}
          y2={pad.t + f * (H - pad.t - pad.b)}
          stroke="rgba(226,233,240,0.06)"
          strokeDasharray="3 5"
        />
      ))}
      <line
        x1={pad.l}
        x2={W - pad.r}
        y1={y(vehicle.tempTarget)}
        y2={y(vehicle.tempTarget)}
        stroke="rgba(216,164,76,0.45)"
        strokeDasharray="5 4"
        strokeWidth="1"
      />
      <text x={W - pad.r} y={y(vehicle.tempTarget) - 5} textAnchor="end" fontSize="9" fill="rgba(216,164,76,0.65)" fontFamily="var(--font-mono)">
        目标 {vehicle.tempTarget.toFixed(1)}°C
      </text>
      <polygon points={area} fill="url(#dr-area)" />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 5px ${risk ? 'var(--amber-glow)' : 'transparent'})` }}
      />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="2.6" fill={color} />
      {ticks.map((_, i) => (
        <text key={i} x={x(i * 3)} y={H - 6} textAnchor="middle" fontSize="8.5" fill="rgba(160,172,185,0.55)" fontFamily="var(--font-mono)">
          {tickLabels[i]}
        </text>
      ))}
      <text x={pad.l - 6} y={y(Math.max(...data)) + 3} textAnchor="end" fontSize="9" fill="rgba(160,172,185,0.6)" fontFamily="var(--font-mono)">
        {Math.max(...data).toFixed(1)}°
      </text>
      <text x={pad.l - 6} y={y(Math.min(...data)) + 3} textAnchor="end" fontSize="9" fill="rgba(160,172,185,0.6)" fontFamily="var(--font-mono)">
        {Math.min(...data).toFixed(1)}°
      </text>
    </svg>
  )
}

function fmtTime(t: string, addMin: number) {
  const [h, m] = t.split(':').map(Number)
  const total = (h * 60 + m + addMin) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function VehicleDrawer() {
  const store = useStore()
  const mobile = useMobile()
  const vehicle = useMemo(
    () => store.vehicles.find((v) => v.id === store.selectedId) ?? null,
    [store.vehicles, store.selectedId],
  )

  const open = store.drawerOpen && !!vehicle
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  const pendingEvents = useMemo(
    () => (vehicle ? store.events.filter((e) => e.vehicleId === vehicle.id && !e.resolved && e.kind !== 'info') : []),
    [store.events, vehicle],
  )
  const relatedEvents = useMemo(
    () => (vehicle ? store.events.filter((e) => e.vehicleId === vehicle.id) : []),
    [store.events, vehicle],
  )

  const steps = useMemo(() => {
    if (!vehicle) return []
    const route = getRoute(vehicle.routeId)
    const nodeNames = route.nodeIds.map((n) => CITY_NAME[n])
    const n = nodeNames.length
    const cur = Math.min(Math.round(vehicle.progress * (n - 1)), n - 1)
    const eta = vehicle.eta === '—' || vehicle.eta === '已完成' ? null : vehicle.eta
    return nodeNames.map((name, i) => ({
      name,
      state: i < cur ? 'done' : i === cur ? 'now' : 'todo',
      time: i === 0 ? vehicle.dispatchAt : eta ? fmtTime(eta, -Math.round(((n - 1 - i) / (n - 1)) * 95)) : '',
    }))
  }, [vehicle])

  if (!vehicle) return null

  const risk = vehicle.status === 'risk'
  const kind = risk ? 'risk' : vehicle.status === 'delayed' ? 'delay' : vehicle.status
  const justResolved = pendingEvents.length === 0 && relatedEvents.some((e) => e.resolved)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-backdrop"
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={store.closeDrawer}
          />
          <motion.aside
            key="dr"
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`车辆 ${vehicle.plate} 详情`}
            initial={mobile ? { y: '100%' } : { x: 460 }}
            animate={mobile ? { y: 0 } : { x: 0 }}
            exit={mobile ? { y: '100%' } : { x: 460 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.9 }}
          >
            <div className="drawer-head">
              <span className="drawer-plate mono">{vehicle.plate}</span>
              <span className="chip" data-kind={kind}>
                {STATUS_LABEL[vehicle.status]}
              </span>
              <button
                ref={closeRef}
                className="drawer-close"
                onClick={store.closeDrawer}
                aria-label="关闭详情"
              >
                <IconClose size={15} />
              </button>
            </div>

            <div className="drawer-scroll">
              {/* 实时温度 */}
              <div className="drawer-sec">
                <div className="drawer-sec-title">
                  实时温度
                  <span className="live-dot" />
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontWeight: 400, letterSpacing: '0.08em', fontSize: 9.5, color: 'var(--ink-3)' }}>
                    探头 H2 · 30s
                  </span>
                </div>
                <div className="dr-temp-top">
                  <span className="dr-temp-now mono" data-risk={risk}>
                    {vehicle.temp.toFixed(1)}
                    <small>°C</small>
                  </span>
                  <span className="dr-temp-meta">
                    目标 <span className="mono">{vehicle.tempTarget.toFixed(1)}°C</span>
                    <br />
                    波动带 <span className="mono">±1.2°C</span>
                  </span>
                </div>
                <TempChart vehicle={vehicle} />
                {risk && (
                  <div
                    style={{
                      marginTop: 10, padding: '8px 11px', borderRadius: 8, fontSize: 11.5,
                      color: 'var(--amber-bright)', background: 'var(--amber-dim)',
                      border: '1px solid var(--amber-line)', lineHeight: 1.5,
                    }}
                  >
                    {vehicle.riskNote}
                  </div>
                )}
              </div>

              {/* 行程进度 */}
              <div className="drawer-sec">
                <div className="drawer-sec-title">行程进度</div>
                <div className="dr-progress-track">
                  <div className="dr-progress-fill" style={{ width: `${Math.round(vehicle.progress * 100)}%` }} />
                </div>
                <div className="dr-progress-labels">
                  <span>{vehicle.origin}</span>
                  <span className="mono">{Math.round(vehicle.progress * 100)}%</span>
                  <span>{vehicle.dest}</span>
                </div>
                <div className="dr-steps">
                  {steps.map((s) => (
                    <div key={s.name} className={`dr-step ${s.state}`}>
                      <i />
                      <span>
                        <b>{s.name}</b>
                        {s.time && <span className="mono" style={{ marginLeft: 8, color: 'var(--ink-3)', fontSize: 10.5 }}>{s.time}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 货物批次 */}
              <div className="drawer-sec">
                <div className="drawer-sec-title">货物与批次</div>
                <dl className="dr-kv">
                  <dt>货物</dt>
                  <dd>{vehicle.cargo}</dd>
                  <dt>批次号</dt>
                  <dd className="mono">{vehicle.cargoBatch}</dd>
                  <dt>毛重</dt>
                  <dd className="mono">{vehicle.cargoWeight}</dd>
                  <dt>订单号</dt>
                  <dd className="mono">{vehicle.orderId}</dd>
                  <dt>铅封号</dt>
                  <dd className="mono">{vehicle.sealNo}</dd>
                  <dt>派车时间</dt>
                  <dd className="mono">{vehicle.dispatchAt}</dd>
                </dl>
              </div>

              {/* 司机联系 */}
              <div className="drawer-sec">
                <div className="drawer-sec-title">司机与联系</div>
                <dl className="dr-kv">
                  <dt>司机</dt>
                  <dd>{vehicle.driver}</dd>
                  <dt>电话</dt>
                  <dd className="mono">
                    <a href={`tel:${vehicle.driverPhoneTel}`}>{vehicle.driverPhone}</a>
                  </dd>
                  <dt>资质</dt>
                  <dd className="mono">R-2026-0417 · 有效</dd>
                </dl>
              </div>

              {/* 关联事件 */}
              <div className="drawer-sec">
                <div className="drawer-sec-title">关联事件</div>
                {relatedEvents.length === 0 ? (
                  <div className="drawer-empty">该车辆暂无事件记录</div>
                ) : (
                  <div className="dr-events">
                    {relatedEvents.map((e) => (
                      <div key={e.id} className="dr-event" style={{ opacity: e.resolved ? 0.55 : 1 }}>
                        <span className="t">{e.time}</span>
                        <span>
                          {e.text}
                          {e.resolved && (
                            <span className="mono" style={{ marginLeft: 8, color: 'var(--ink-3)', fontSize: 10 }}>
                              · 已处理
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dr-actions">
                <button
                  className="btn-primary"
                  disabled={pendingEvents.length === 0}
                  onClick={() => store.resolveVehicle(vehicle.id)}
                >
                  <IconCheck size={15} />
                  {pendingEvents.length > 0 ? '标记已处理' : justResolved ? '已处理完成' : '无待处理事件'}
                </button>
                <a className="btn-ghost" href={`tel:${vehicle.driverPhoneTel}`}>
                  <IconPhone size={14} />
                  联系司机
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
