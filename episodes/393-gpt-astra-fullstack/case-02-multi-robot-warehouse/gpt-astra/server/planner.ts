import { cellKey, manhattan, sameCell, type Cell, type Robot, type RouteStep, type SimulationState } from '../shared/types.js';

// Every accepted plan has a finite endpoint. Its final cell remains reserved forever
// (represented through this horizon); admission only commits complete trips to home.
export const HORIZON = 320;
export class Reservations {
  vertices = new Map<number, Set<string>>();
  edges = new Map<number, Set<string>>();
  constructor(robots: Robot[], except: string) {
    for (const robot of robots) {
      if (robot.id === except) continue;
      let prev = robot.position;
      for (let t = 0; t <= HORIZON; t++) {
        const p = t === 0 ? robot.position : robot.route[Math.min(t - 1, robot.route.length - 1)] ?? robot.position;
        if (!this.vertices.has(t)) this.vertices.set(t, new Set());
        this.vertices.get(t)!.add(cellKey(p));
        if (t > 0) {
          if (!this.edges.has(t)) this.edges.set(t, new Set());
          this.edges.get(t)!.add(`${cellKey(prev)}>${cellKey(p)}`);
        }
        prev = p;
      }
    }
  }
  allows(from: Cell, to: Cell, t: number) {
    return !this.vertices.get(t)?.has(cellKey(to)) && !this.edges.get(t)?.has(`${cellKey(to)}>${cellKey(from)}`);
  }
  canStay(p: Cell, from: number) {
    for (let t = from; t <= HORIZON; t++) if (this.vertices.get(t)?.has(cellKey(p))) return false;
    return true;
  }
}

class MinHeap<T extends { f: number; h: number; order: number }> {
  items: T[] = [];
  before(a: T, b: T) { return a.f < b.f || (a.f === b.f && (a.h < b.h || (a.h === b.h && a.order < b.order))); }
  push(item: T) {
    let i = this.items.push(item) - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (!this.before(item, this.items[p])) break; this.items[i] = this.items[p]; i = p; }
    this.items[i] = item;
  }
  pop() {
    const first = this.items[0]; const last = this.items.pop()!;
    if (this.items.length) {
      let i = 0;
      while (i * 2 + 1 < this.items.length) {
        let child = i * 2 + 1;
        if (child + 1 < this.items.length && this.before(this.items[child + 1], this.items[child])) child++;
        if (!this.before(this.items[child], last)) break;
        this.items[i] = this.items[child]; i = child;
      }
      this.items[i] = last;
    }
    return first;
  }
}

type SearchNode = Cell & { t: number; f: number; h: number; order: number; parent?: SearchNode };
export function obstacleKeys(state: SimulationState) {
  return new Set([...state.map.walls, ...state.map.shelves, ...state.blocked].map(cellKey));
}

// Time-expanded A*: (x, y, t). Waiting is a real edge, and reverse-edge
// reservations explicitly prohibit swaps, including in single-width aisles.
function findLeg(start: Cell, goal: Cell, startTime: number, reservations: Reservations,
  obstacles: Set<string>, width: number, height: number, terminal = false): RouteStep[] | null {
  if (obstacles.has(cellKey(goal))) return null;
  // Spatial reachability first avoids a full time-expanded search for cut-off goals.
  const distances = new Map<string, number>([[cellKey(goal), 0]]);
  const queue: Cell[] = [goal];
  for (let i = 0; i < queue.length; i++) {
    const p = queue[i];
    for (const d of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const n = { x: p.x + d[0], y: p.y + d[1] }; const key = cellKey(n);
      if (n.x < 0 || n.y < 0 || n.x >= width || n.y >= height || obstacles.has(key) || distances.has(key)) continue;
      distances.set(key, distances.get(cellKey(p))! + 1); queue.push(n);
    }
  }
  const heuristic = (p: Cell) => distances.get(cellKey(p)) ?? (sameCell(p, start) ? manhattan(p, goal) : Infinity);
  if (!distances.has(cellKey(start)) && !obstacles.has(cellKey(start))) return null;
  let order = 0;
  const open = new MinHeap<SearchNode>();
  open.push({ ...start, t: startTime, h: heuristic(start), f: startTime + heuristic(start), order: order++ });
  const seen = new Set<string>();
  let expanded = 0;
  while (open.items.length && expanded++ < 100000) {
    const n = open.pop();
    const id = `${cellKey(n)},${n.t}`;
    if (seen.has(id)) continue;
    seen.add(id);
    // Reserve a service timestep at pickup and delivery, or persistent parking.
    if (sameCell(n, goal) && (terminal ? reservations.canStay(goal, n.t) :
      n.t < HORIZON && reservations.allows(goal, goal, n.t + 1))) {
      const route: RouteStep[] = [];
      let cursor = n;
      while (cursor.parent) { route.push({ x: cursor.x, y: cursor.y }); cursor = cursor.parent; }
      route.reverse();
      if (!terminal) route.push({ ...goal });
      return route;
    }
    if (n.t >= HORIZON - 1) continue;
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1], [0, 0]]) {
      const next = { x: n.x + dx, y: n.y + dy }; const t = n.t + 1;
      // An occupied cell can be closed. Its occupant may wait or evacuate;
      // every other robot is forbidden from entering it.
      const stayingOnClosedStart = sameCell(next, start) && sameCell(n, start);
      if (next.x < 0 || next.y < 0 || next.x >= width || next.y >= height ||
        (obstacles.has(cellKey(next)) && !stayingOnClosedStart) || !reservations.allows(n, next, t)) continue;
      const h = heuristic(next);
      if (!Number.isFinite(h) || t + h >= HORIZON) continue;
      if (!seen.has(`${cellKey(next)},${t}`)) open.push({ ...next, t, h, f: t + h, order: order++, parent: n });
    }
  }
  return null;
}

export function planMission(state: SimulationState, robot: Robot, retreat = false): RouteStep[] | null {
  const reservations = new Reservations(state.robots, robot.id);
  const obstacles = obstacleKeys(state);
  const job = state.jobs.find(j => j.id === robot.jobId);
  const waypoints: { cell: Cell; action: 'pickup' | 'delivery' | 'park' }[] = [];
  if (job && robot.phase !== 'return' && !retreat) {
    const shelf = state.map.shelves.find(s => s.id === job.shelfId)!;
    const station = state.map.stations.find(s => s.id === job.stationId)!;
    if (robot.phase === 'pickup') waypoints.push({ cell: shelf.pickup, action: 'pickup' });
    waypoints.push({ cell: station, action: 'delivery' });
  }
  waypoints.push({ cell: robot.home, action: 'park' });
  let from = robot.position;
  const route: RouteStep[] = [];
  for (const waypoint of waypoints) {
    const leg = findLeg(from, waypoint.cell, route.length, reservations, obstacles,
      state.map.width, state.map.height, waypoint.action === 'park');
    if (!leg) return null;
    if (leg.length) leg[leg.length - 1].action = waypoint.action;
    route.push(...leg); from = waypoint.cell;
  }
  return route;
}
