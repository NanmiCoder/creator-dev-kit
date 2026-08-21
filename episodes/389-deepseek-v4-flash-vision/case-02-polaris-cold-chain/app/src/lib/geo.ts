import { EDGES, NODES, ROUTES, type MapEdge } from '../data/fleet'

export interface Pt {
  x: number
  y: number
}

const NODE_POS: Record<string, Pt> = Object.fromEntries(NODES.map((n) => [n.id, { x: n.x, y: n.y }]))

/** Full point list of an edge including via waypoints */
export function edgePoints(edge: MapEdge): Pt[] {
  const a = NODE_POS[edge.a]
  const b = NODE_POS[edge.b]
  const via = edge.via?.map(([x, y]) => ({ x, y })) ?? []
  return [a, ...via, b]
}

/* Catmull-Rom → cubic bezier path string */
function crPath(points: Pt[]): string {
  const p = points
  if (p.length < 2) return ''
  let d = `M ${p[0].x} ${p[0].y}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(i - 1, 0)]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[Math.min(i + 2, p.length - 1)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function edgePath(edge: MapEdge): string {
  return crPath(edgePoints(edge))
}

/* ---- sampled spline with arc-length table, for vehicle motion ---- */

export interface SampledPath {
  points: Pt[]
  cum: number[]
  length: number
}

const SEG_SAMPLES = 16

function sampleCr(points: Pt[]): Pt[] {
  const p = points
  const out: Pt[] = [p[0]]
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(i - 1, 0)]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[Math.min(i + 2, p.length - 1)]
    for (let s = 1; s <= SEG_SAMPLES; s++) {
      const t = s / SEG_SAMPLES
      // cubic bezier evaluation with control points from CR
      const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
      const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
      const mt = 1 - t
      const x = mt * mt * mt * p1.x + 3 * mt * mt * t * c1.x + 3 * mt * t * t * c2.x + t * t * t * p2.x
      const y = mt * mt * mt * p1.y + 3 * mt * mt * t * c1.y + 3 * mt * t * t * c2.y + t * t * t * p2.y
      out.push({ x, y })
    }
  }
  return out
}

export function samplePath(points: Pt[]): SampledPath {
  const s = sampleCr(points)
  const cum = [0]
  let total = 0
  for (let i = 1; i < s.length; i++) {
    total += Math.hypot(s[i].x - s[i - 1].x, s[i].y - s[i - 1].y)
    cum.push(total)
  }
  return { points: s, cum, length: total }
}

/** position + angle at fraction t (0..1) along the sampled path */
export function pointAt(path: SampledPath, t: number): { p: Pt; angle: number } {
  const { points, cum, length } = path
  if (length <= 0) return { p: points[0], angle: 0 }
  const target = Math.max(0, Math.min(1, t)) * length
  let lo = 0
  let hi = cum.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (cum[mid] < target) lo = mid + 1
    else hi = mid
  }
  const i = Math.max(1, lo)
  const segLen = cum[i] - cum[i - 1] || 1
  const frac = (target - cum[i - 1]) / segLen
  const a = points[i - 1]
  const b = points[i]
  const p = { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac }
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
  return { p, angle }
}

/* ---- route registry ---- */

export interface RoutePath {
  id: string
  name: string
  sampled: SampledPath
  nodeIds: string[]
}

function buildRoute(id: string): RoutePath {
  const def = ROUTES.find((r) => r.id === id)!
  const pts: Pt[] = []

  for (let i = 0; i < def.nodes.length - 1; i++) {
    const a = def.nodes[i]
    const b = def.nodes[i + 1]
    const edge = EDGES.find(
      (e) => (e.a === a && e.b === b) || (e.a === b && e.b === a),
    )
    const seq = edge ? edgePoints(edge) : [NODE_POS[a], NODE_POS[b]]
    if (i === 0) pts.push(...seq)
    else pts.push(...seq.slice(1))
  }

  const sampled = samplePath(pts)
  return { id, name: def.name, sampled, nodeIds: def.nodes }
}

const cache = new Map<string, RoutePath>()

export function getRoute(id: string): RoutePath {
  let r = cache.get(id)
  if (!r) {
    r = buildRoute(id)
    cache.set(id, r)
  }
  return r
}

/** fraction t along a route for an arbitrary map point (nearest sampled index) */
export function nearestT(routeId: string, p: Pt): number {
  const { sampled } = getRoute(routeId)
  let best = 0
  let bestD = Infinity
  for (let i = 0; i < sampled.points.length; i++) {
    const d = Math.hypot(sampled.points[i].x - p.x, sampled.points[i].y - p.y)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return sampled.cum[best] / sampled.length
}
