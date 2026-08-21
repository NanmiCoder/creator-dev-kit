import {
  useEffect, useMemo, useRef, useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { EDGES, MAP_VEHICLES, NODES } from '../data/fleet'
import { edgePath, edgePoints, getRoute, pointAt, samplePath, type SampledPath } from '../lib/geo'
import { useStore } from '../lib/store'
import type { Vehicle } from '../types'

const VB = { w: 1600, h: 1020 }
const PX_PER_KM = 5.2
const TIME_SCALE = 120 // 1 real second ≈ 2 demo minutes

const STATUS_LABEL: Record<string, string> = {
  transit: '运输中',
  risk: '温控风险',
  delayed: '延误',
  loading: '装卸中',
  delivered: '已送达',
  idle: '待命',
}

const DOCKS = [
  { x: 1214, y: 442 },
  { x: 1182, y: 532 },
  { x: 897, y: 632 },
  { x: 733, y: 328 },
  { x: 1238, y: 922 },
  { x: 702, y: 802 },
]

/* ---------- static water shapes ---------- */

const RIVER =
  'M 180 42 C 340 70, 480 96, 700 128 C 900 156, 1050 172, 1230 192 C 1400 210, 1540 218, 1660 226 ' +
  'L 1660 320 C 1520 302, 1380 288, 1220 272 C 1040 254, 880 226, 700 190 C 540 158, 380 122, 180 92 Z'

const BAY =
  'M 1006 742 C 1050 706, 1080 680, 1122 668 C 1240 664, 1450 680, 1660 706 L 1660 862 ' +
  'C 1500 848, 1380 842, 1300 838 C 1200 832, 1100 812, 1042 780 C 1028 772, 1014 758, 1006 742 Z'

const TAIHU =
  'M 560 380 C 620 372, 668 398, 668 446 C 668 490, 616 516, 556 508 C 498 500, 462 462, 472 424 C 480 394, 516 386, 560 380 Z'

const LAKE1 = 'M 850 322 C 866 318, 878 326, 876 336 C 874 346, 858 350, 844 346 C 832 342, 834 326, 850 322 Z'
const LAKE2 = 'M 732 748 C 742 744, 750 750, 748 758 C 746 766, 734 768, 726 762 C 720 757, 722 752, 732 748 Z'
const LAKE3 = 'M 1080 400 C 1092 396, 1102 402, 1100 412 C 1098 422, 1084 424, 1074 418 C 1066 412, 1068 404, 1080 400 Z'

export function MapCanvas() {
  const store = useStore()
  const { selectedId, settings, demoState } = store

  const wrapRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const vehEls = useRef<Map<string, SVGGElement>>(new Map())
  const vehState = useRef<Map<string, { t: number; path: SampledPath }>>(new Map())
  const vehPos = useRef<Map<string, { x: number; y: number }>>(new Map())

  const [hoverId, setHoverId] = useState<string | null>(null)
  const [tipBelow, setTipBelow] = useState(false)
  const [focus, setFocus] = useState<{ x: number; y: number; key: number } | null>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const mapVehicles = useMemo(
    () => store.vehicles.filter((v) => v.onMap && v.status !== 'delivered'),
    [store.vehicles],
  )

  const hoverVehicle = useMemo(
    () => (hoverId ? store.vehicles.find((v) => v.id === hoverId) ?? null : null),
    [hoverId, store.vehicles],
  )

  /* seed per-vehicle motion state whenever the vehicle set changes */
  useEffect(() => {
    const keep = new Map<string, { t: number; path: SampledPath }>()
    for (const v of mapVehicles) {
      const prev = vehState.current.get(v.id)
      keep.set(v.id, { t: prev?.t ?? v.progress, path: getRoute(v.routeId).sampled })
    }
    vehState.current = keep
  }, [mapVehicles])

  /* continuous animation loop — DOM-only writes, no React re-render */
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const wrap = wrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const scale = Math.max(rect.width / VB.w, rect.height / VB.h)
      const offX = (rect.width - VB.w * scale) / 2
      const offY = (rect.height - VB.h * scale) / 2

      for (const [id, s] of vehState.current) {
        const el = vehEls.current.get(id)
        const veh = MAP_VEHICLES.find((v) => v.id === id)
        if (!el || !veh) continue
        if (settings.motion && veh.speed > 0 && demoState === 'normal') {
          s.t += ((veh.speed / 3600) * PX_PER_KM * TIME_SCALE * dt) / s.path.length
          if (s.t > 1) s.t -= 1
        }
        const { p } = pointAt(s.path, s.t)
        el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`)
        vehPos.current.set(id, p)

        if (hoverId === id && tipRef.current) {
          tipRef.current.style.left = `${offX + p.x * scale}px`
          tipRef.current.style.top = `${offY + p.y * scale}px`
        }
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [settings.motion, demoState, hoverId])

  /* selected vehicle + route highlight + gentle pan + focus pulse */
  const selectedVehicle = useMemo(
    () => store.vehicles.find((v) => v.id === selectedId && v.onMap) ?? null,
    [store.vehicles, selectedId],
  )

  const heatEdges = useMemo(() => {
    if (!selectedVehicle) return new Set<number>()
    const route = getRoute(selectedVehicle.routeId)
    const set = new Set<number>()
    for (let i = 0; i < route.nodeIds.length - 1; i++) {
      const idx = EDGES.findIndex(
        (e) =>
          (e.a === route.nodeIds[i] && e.b === route.nodeIds[i + 1]) ||
          (e.a === route.nodeIds[i + 1] && e.b === route.nodeIds[i]),
      )
      if (idx >= 0) set.add(idx)
    }
    return set
  }, [selectedVehicle])

  useEffect(() => {
    if (selectedVehicle) {
      const p = vehPos.current.get(selectedVehicle.id)
      if (p) {
        const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v))
        setPan({ x: clamp((VB.w / 2 - p.x) * 0.42, 300), y: clamp((VB.h / 2 - p.y) * 0.42, 220) })
        setFocus({ x: p.x, y: p.y, key: Date.now() })
      }
    } else {
      setPan({ x: 0, y: 0 })
    }
  }, [selectedVehicle])

  const selNodes = useMemo(() => {
    if (!selectedVehicle) return new Set<string>()
    return new Set(getRoute(selectedVehicle.routeId).nodeIds)
  }, [selectedVehicle])

  const edgeLabelPos = useMemo(
    () => EDGES.map((e) => pointAt(samplePath(edgePoints(e)), 0.5)),
    [],
  )

  const showVehicles = demoState === 'normal' || demoState === 'error'

  return (
    <div ref={wrapRef} className="stage" aria-label="长三角冷链运输网络地图">
      <svg
        className={`map-svg${selectedId ? ' map-fade' : ''}`}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="xMidYMid slice"
        onClick={() => selectedId && store.select(null)}
        role="img"
      >
        <defs>
          <pattern id="pol-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="var(--grid)" strokeWidth="1" />
          </pattern>
          <pattern id="pol-grid2" width="320" height="320" patternUnits="userSpaceOnUse">
            <path d="M 320 0 L 0 0 0 320" fill="none" stroke="rgba(150,165,180,0.07)" strokeWidth="1" />
          </pattern>
          <radialGradient id="pol-city-glow">
            <stop offset="0%" stopColor="rgba(190,205,220,0.10)" />
            <stop offset="100%" stopColor="rgba(190,205,220,0)" />
          </radialGradient>
          <filter id="pol-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        <rect width={VB.w} height={VB.h} fill="var(--land)" />
        <rect width={VB.w} height={VB.h} fill="url(#pol-grid)" />
        <rect width={VB.w} height={VB.h} fill="url(#pol-grid2)" />

        <g filter="url(#pol-soft)" pointerEvents="none">
          <ellipse cx={1146} cy={468} rx={130} ry={90} fill="url(#pol-city-glow)" />
          <ellipse cx={764} cy={764} rx={110} ry={80} fill="url(#pol-city-glow)" />
          <ellipse cx={790} cy={362} rx={95} ry={70} fill="url(#pol-city-glow)" />
          <ellipse cx={1178} cy={886} rx={100} ry={70} fill="url(#pol-city-glow)" />
          <ellipse cx={858} cy={602} rx={70} ry={55} fill="url(#pol-city-glow)" />
        </g>

        <g pointerEvents="none">
          <path d={RIVER} fill="var(--water)" stroke="var(--water-line)" strokeWidth="1.2" />
          <path d={BAY} fill="var(--water)" stroke="var(--water-line)" strokeWidth="1.2" />
          <path d={TAIHU} fill="var(--water)" stroke="var(--water-line)" strokeWidth="1" />
          <path d={LAKE1} fill="var(--water)" stroke="var(--water-line)" strokeWidth="0.8" />
          <path d={LAKE2} fill="var(--water)" stroke="var(--water-line)" strokeWidth="0.8" />
          <path d={LAKE3} fill="var(--water)" stroke="var(--water-line)" strokeWidth="0.8" />
          <circle cx={1428} cy={862} r={9} fill="var(--land)" stroke="var(--water-line)" />
        </g>

        <g className="map-pan" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
          <g>
            {EDGES.map((e, i) => (
              <path
                key={e.a + e.b}
                className={`map-route t${e.tier}${heatEdges.has(i) ? ' heat' : ''}`}
                d={edgePath(e)}
              />
            ))}
            {EDGES.map((e, i) => (
              <path
                key={e.a + e.b + '-f'}
                className={`map-route-flow${heatEdges.has(i) ? ' heat' : ''}`}
                d={edgePath(e)}
              />
            ))}
            {EDGES.map((e, i) => (
              <text
                key={e.a + e.b + '-l'}
                className={`map-route-label${heatEdges.has(i) ? ' heat' : ''}`}
                x={edgeLabelPos[i].p.x + 7}
                y={edgeLabelPos[i].p.y - 6}
              >
                {e.label}
              </text>
            ))}
          </g>

          {settings.hubPulse && (
            <g pointerEvents="none">
              {DOCKS.map((d, i) => (
                <g key={i} transform={`translate(${d.x} ${d.y})`}>
                  <circle r={4.5} className="map-hub-dot" />
                  <circle r={8} className="map-hub-ring" />
                </g>
              ))}
            </g>
          )}

          <g>
            {NODES.map((n) => (
              <g
                key={n.id}
                className={`map-city${n.major ? ' major' : ''}${selNodes.has(n.id) ? ' sel' : ''}`}
                transform={`translate(${n.x} ${n.y})`}
              >
                <circle r={n.major ? 7 : 5} className="map-city-circle" />
                <text className="map-city-name" y={20} textAnchor="middle">
                  {n.name}
                </text>
                <text className="map-city-sub" y={33} textAnchor="middle">
                  {n.sub}
                </text>
              </g>
            ))}
          </g>

          {showVehicles && (
            <g>
              {mapVehicles.map((v) => (
                <VehicleMark
                  key={v.id}
                  vehicle={v}
                  selected={v.id === selectedId}
                  onHover={(h) => {
                    setHoverId(h)
                    if (h) {
                      const pos = vehPos.current.get(v.id)
                      setTipBelow((pos?.y ?? 500) < 150)
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    store.select(v.id)
                  }}
                  register={(el) => {
                    if (el) vehEls.current.set(v.id, el)
                    else vehEls.current.delete(v.id)
                  }}
                />
              ))}
            </g>
          )}

          {focus && (
            <circle key={focus.key} className="map-focus-pulse" cx={focus.x} cy={focus.y} r={22} />
          )}
        </g>
      </svg>

      {hoverVehicle && (
        <div
          ref={tipRef}
          className={`map-tip on${tipBelow ? ' below' : ''}`}
          style={{ left: -999, top: -999 }}
        >
          <TooltipContent vehicle={hoverVehicle} />
        </div>
      )}

      {demoState === 'loading' && (
        <div className="map-note">
          <span className="skel" style={{ width: 96, height: 12 }} />
          <span>地图与车辆数据同步中</span>
        </div>
      )}
      {demoState === 'empty' && <div className="map-note">当前时段无在途车辆</div>}
      {demoState === 'error' && (
        <div className="map-note map-note-error">
          <span>地图数据接口连接失败</span>
          <button onClick={() => store.setDemo('loading')}>重试</button>
        </div>
      )}
    </div>
  )
}

function TooltipContent({ vehicle }: { vehicle: Vehicle }) {
  const risk = vehicle.status === 'risk'
  const kind = risk ? 'risk' : vehicle.status === 'delayed' ? 'delay' : vehicle.status
  return (
    <>
      <div className="map-tip-head">
        <span className="map-tip-plate">{vehicle.plate}</span>
        <span className="map-tip-status">
          <span className="chip" data-kind={kind}>
            {STATUS_LABEL[vehicle.status]}
          </span>
        </span>
      </div>
      <dl className="map-tip-grid">
        <dt>司机</dt>
        <dd>{vehicle.driver}</dd>
        <dt>货物</dt>
        <dd>
          {vehicle.cargo} · {vehicle.cargoBatch}
        </dd>
        <dt>实时温度</dt>
        <dd>
          <span className="map-tip-temp mono" data-risk={risk}>
            {vehicle.temp.toFixed(1)}°C
          </span>
          <span style={{ color: 'var(--ink-3)', marginLeft: 6 }}>
            目标 {vehicle.tempTarget.toFixed(1)}°C
          </span>
        </dd>
        <dt>预计到达</dt>
        <dd>
          {vehicle.eta}
          {vehicle.etaOffset !== null && vehicle.status === 'delayed' && (
            <span style={{ color: 'var(--amber-bright)' }}> +{vehicle.etaOffset}min</span>
          )}
        </dd>
        <dt>当前路段</dt>
        <dd style={{ color: 'var(--ink-3)' }}>
          {vehicle.routeName} · {vehicle.speed > 0 ? `${vehicle.speed} km/h` : '场站作业'}
        </dd>
      </dl>
    </>
  )
}

function VehicleMark({
  vehicle, selected, onHover, onClick, register,
}: {
  vehicle: Vehicle
  selected: boolean
  onHover: (id: string | null) => void
  onClick: (e: ReactMouseEvent<SVGGElement>) => void
  register: (el: SVGGElement | null) => void
}) {
  const risk = vehicle.status === 'risk' || vehicle.status === 'delayed'
  return (
    <g
      ref={register}
      className={`map-veh${selected ? ' sel' : ''}`}
      data-risk={risk}
      onMouseEnter={(e) => {
        e.stopPropagation()
        onHover(vehicle.id)
      }}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <circle r={13} className="map-veh-halo" />
      <circle r={9} className="map-veh-body" />
      <g className="map-veh-glyph" transform="rotate(-90)">
        <path d="M -2.6 3.4 L -2.6 -1.6 L 0 -4.6 L 2.6 -1.6 L 2.6 3.4 Z" />
      </g>
      <text className="map-veh-label" y={-15} textAnchor="middle">
        {vehicle.plate}
      </text>
    </g>
  )
}
