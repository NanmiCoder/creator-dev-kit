import { useMemo } from 'react'
import { FLEET_STATS } from '../data/fleet'
import { useStore } from '../lib/store'
import { IconRetry } from './Icon'

function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const a = (d: number) => ((d - 90) * Math.PI) / 180
  const x1 = cx + r * Math.cos(a(fromDeg))
  const y1 = cy + r * Math.sin(a(fromDeg))
  const x2 = cx + r * Math.cos(a(toDeg))
  const y2 = cy + r * Math.sin(a(toDeg))
  const large = toDeg - fromDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

function Gauge({ pct }: { pct: number }) {
  const r = 25
  const sweep = 180
  const value = Math.max(0.5, pct / 100) * sweep
  return (
    <svg className="kpi-gauge" width="62" height="40" viewBox="0 0 62 40" aria-hidden="true">
      <path d={arcPath(31, 34, r, 0, sweep)} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="5" strokeLinecap="round" />
      <path
        d={arcPath(31, 34, r, 0, value)}
        fill="none"
        stroke="var(--amber)"
        strokeWidth="5"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 5px var(--amber-glow))' }}
      />
    </svg>
  )
}

function Spark({ series }: { series: number[] }) {
  const w = 118
  const h = 32
  const min = Math.min(...series)
  const max = Math.max(...series)
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w
    const y = h - 3 - ((v - min) / (max - min || 1)) * (h - 8)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const last = pts[pts.length - 1].split(',')
  return (
    <svg className="kpi-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="var(--amber-soft)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 4px rgba(216,164,76,0.3))' }}
      />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill="var(--amber-bright)" />
    </svg>
  )
}

export function KpiPanel() {
  const store = useStore()
  const { demoState } = store
  const risk = store.riskCount
  const loading = demoState === 'loading'
  const empty = demoState === 'empty'
  const error = demoState === 'error'

  const hourly = useMemo(() => FLEET_STATS.mileageSeries, [])
  const pct = empty ? 0 : FLEET_STATS.onTimeRate
  const transit = empty ? 0 : FLEET_STATS.inTransit
  const mileage = empty ? 0 : FLEET_STATS.mileageKm

  return (
    <section className="kpi" aria-label="关键指标">
      <div className="kpi-head">
        <span className="kpi-title">运控总览</span>
        <span className="kpi-live">
          <i />
          {empty || error ? 'OFFLINE' : 'LIVE'}
        </span>
      </div>

      {error ? (
        <div style={{ padding: '18px 4px 8px', fontSize: 12, color: 'var(--amber-soft)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span>指标接口连接失败，已回退缓存数据。</span>
          <button
            style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--amber-bright)', border: '1px solid var(--amber-line)', borderRadius: 8, padding: '5px 12px', background: 'var(--amber-dim)', fontSize: 11.5 }}
            onClick={() => store.setDemo('loading')}
          >
            <IconRetry size={13} /> 重试
          </button>
        </div>
      ) : (
        <>
          <div className="kpi-ontime">
            {loading ? (
              <>
                <span className="skel" style={{ width: 120, height: 44 }} />
                <span className="skel" style={{ width: 70, height: 12 }} />
              </>
            ) : (
              <>
                <div>
                  <div className="kpi-ontime-val mono">
                    {pct.toFixed(1)}
                    <small>%</small>
                  </div>
                  <div className="kpi-sub" style={{ marginTop: 5 }}>准点率 · 近 30 日滚动</div>
                </div>
                <div className="kpi-ontime-side">
                  <span className="kpi-delta">
                    <b>+0.6%</b> 环比
                  </span>
                  <span className="kpi-sub">目标 95.0%</span>
                </div>
                <Gauge pct={pct} />
              </>
            )}
          </div>

          <div className="kpi-grid">
            <div className="kpi-cell">
              {loading ? (
                <>
                  <span className="skel" style={{ width: 54, height: 10 }} />
                  <span className="skel" style={{ width: 60, height: 26, marginTop: 6 }} />
                </>
              ) : (
                <>
                  <span className="kpi-cell-label">运输中</span>
                  <div className="kpi-cell-val mono">
                    {transit}
                    <small> 辆</small>
                  </div>
                  <div className="kpi-meter">
                    <i style={{ width: `${(transit / 191) * 100}%` }} />
                  </div>
                </>
              )}
            </div>
            <div className="kpi-cell" data-risk={risk > 0}>
              {loading ? (
                <>
                  <span className="skel" style={{ width: 54, height: 10 }} />
                  <span className="skel" style={{ width: 40, height: 26, marginTop: 6 }} />
                </>
              ) : (
                <>
                  <span className="kpi-cell-label">温控风险</span>
                  <div className="kpi-cell-val mono">{risk}</div>
                  <div className="kpi-meter">
                    <i data-risk={risk > 0} style={{ width: `${Math.min(100, (risk / 7) * 100)}%` }} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="kpi-mileage">
            {loading ? (
              <>
                <span className="skel" style={{ width: 100, height: 24 }} />
                <span className="skel" style={{ width: 110, height: 32, marginLeft: 'auto' }} />
              </>
            ) : (
              <>
                <div>
                  <div className="kpi-mileage-val mono">
                    {mileage.toLocaleString('en-US')}
                    <small> km</small>
                  </div>
                  <div className="kpi-sub">今日里程 · 峰值 20:00—22:00</div>
                </div>
                <Spark series={hourly} />
              </>
            )}
          </div>
        </>
      )}
    </section>
  )
}
