import type { WarehouseMap } from '../../shared/types.js';

export const FLOOR = 0;
export const WALL = 1;
export const SHELF = 2;
export const WS = 3;
export const DOCK = 4;

const CHAR_TO_TYPE: Record<string, number> = { '.': FLOOR, '#': WALL, S: SHELF, W: WS, D: DOCK };

/** Static grid + dynamic blocked cells. */
export class Grid {
  readonly W: number;
  readonly H: number;
  readonly N: number;
  readonly cells: Uint8Array;
  readonly blocked: Uint8Array;

  constructor(map: WarehouseMap) {
    this.W = map.width;
    this.H = map.height;
    this.N = this.W * this.H;
    this.cells = new Uint8Array(this.N);
    this.blocked = new Uint8Array(this.N);
    for (let i = 0; i < this.N; i++) this.cells[i] = CHAR_TO_TYPE[map.cells[i]] ?? WALL;
  }

  idx(x: number, y: number): number {
    return y * this.W + x;
  }
  xOf(i: number): number {
    return i % this.W;
  }
  yOf(i: number): number {
    return (i - (i % this.W)) / this.W;
  }
  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.W && y < this.H;
  }
  type(i: number): number {
    return this.cells[i];
  }
  traversableType(i: number): boolean {
    const t = this.cells[i];
    return t !== WALL && t !== SHELF;
  }
  passable(i: number): boolean {
    return this.traversableType(i) && this.blocked[i] === 0;
  }
  /** 4-neighbours in a fixed order (E, S, W, N) for deterministic tie-breaking. */
  neighbors(i: number): number[] {
    const x = this.xOf(i);
    const y = this.yOf(i);
    const out: number[] = [];
    if (x + 1 < this.W) out.push(i + 1);
    if (y + 1 < this.H) out.push(i + this.W);
    if (x > 0) out.push(i - 1);
    if (y > 0) out.push(i - this.W);
    return out;
  }
}

/** Multi-source BFS distance over passable cells. -1 = unreachable. */
export function bfsDistance(grid: Grid, goals: number[]): Int32Array {
  const dist = new Int32Array(grid.N).fill(-1);
  const queue: number[] = [];
  for (const g of goals) {
    if (dist[g] < 0 && grid.passable(g)) {
      dist[g] = 0;
      queue.push(g);
    }
  }
  let head = 0;
  while (head < queue.length) {
    const c = queue[head++];
    const d = dist[c] + 1;
    for (const n of grid.neighbors(c)) {
      if (dist[n] < 0 && grid.passable(n)) {
        dist[n] = d;
        queue.push(n);
      }
    }
  }
  return dist;
}

interface PermRes {
  start: number;
  owner: string;
}

/**
 * Space-time reservation table.
 *  - vertex: (cell, t) occupied by owner
 *  - edge: owner moves from -> to between t and t+1 (used to forbid swaps)
 *  - perm: cell occupied by owner for every t >= start (parked / stuck robots)
 */
export class Reservations {
  private vertex = new Map<number, string>();
  private edge = new Map<number, string>();
  private perm = new Map<number, PermRes>();

  constructor(private readonly N: number) {}

  private vkey(cell: number, t: number): number {
    return t * this.N + cell;
  }
  private ekey(from: number, to: number, t: number): number {
    return (t * this.N + from) * this.N + to;
  }

  isVertexFree(cell: number, t: number, me: string): boolean {
    const o = this.vertex.get(this.vkey(cell, t));
    if (o !== undefined && o !== me) return false;
    const p = this.perm.get(cell);
    if (p && p.owner !== me && t >= p.start) return false;
    return true;
  }

  /** Moving from -> to between t and t+1 conflicts with someone moving to -> from at the same time. */
  isEdgeFree(from: number, to: number, t: number, me: string): boolean {
    const o = this.edge.get(this.ekey(to, from, t));
    return !(o !== undefined && o !== me);
  }

  ownerAt(cell: number, t: number): string | undefined {
    const o = this.vertex.get(this.vkey(cell, t));
    if (o !== undefined) return o;
    const p = this.perm.get(cell);
    if (p && t >= p.start) return p.owner;
    return undefined;
  }

  reserveVertex(cell: number, t: number, owner: string): void {
    this.vertex.set(this.vkey(cell, t), owner);
  }
  releaseVertex(cell: number, t: number, owner: string): void {
    const k = this.vkey(cell, t);
    if (this.vertex.get(k) === owner) this.vertex.delete(k);
  }
  reservePermanent(cell: number, start: number, owner: string): void {
    this.perm.set(cell, { start, owner });
  }

  reservePath(owner: string, path: number[], t0: number, dwell: number, permanent: boolean): void {
    for (let i = 0; i < path.length; i++) {
      const t = t0 + i;
      this.reserveVertex(path[i], t, owner);
      if (i > 0) this.edge.set(this.ekey(path[i - 1], path[i], t - 1), owner);
    }
    const last = path[path.length - 1];
    const tEnd = t0 + path.length - 1;
    if (permanent) {
      this.perm.set(last, { start: tEnd, owner });
    } else {
      for (let k = 1; k <= dwell; k++) this.reserveVertex(last, tEnd + k, owner);
    }
  }
}

interface Node {
  cell: number;
  t: number;
  f: number;
  id: number;
}

class MinHeap {
  private a: Node[] = [];
  get size(): number {
    return this.a.length;
  }
  private less(x: Node, y: Node): boolean {
    if (x.f !== y.f) return x.f < y.f;
    if (x.t !== y.t) return x.t > y.t; // prefer deeper (more progress) on ties
    return x.id < y.id;
  }
  push(n: Node): void {
    const a = this.a;
    a.push(n);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(a[i], a[p])) {
        [a[i], a[p]] = [a[p], a[i]];
        i = p;
      } else break;
    }
  }
  pop(): Node {
    const a = this.a;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && this.less(a[l], a[m])) m = l;
        if (r < a.length && this.less(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]];
        i = m;
      }
    }
    return top;
  }
}

export interface AStarParams {
  grid: Grid;
  res: Reservations;
  me: string;
  start: number;
  t0: number;
  goals: Set<number>;
  /** static BFS distance-to-goal heuristic (-1 = unreachable) */
  dist: Int32Array;
  /** ticks the robot will stay on the goal after arrival */
  dwell: number;
  /** robot parks on the goal indefinitely */
  permanentGoal: boolean;
  maxSteps: number;
  maxExpansions: number;
}

export interface AStarResult {
  path: number[] | null;
  expansions: number;
}

/**
 * Cooperative space-time A*. Time advances by exactly one per step (move or wait),
 * so g == t - t0 and each (cell, t) state has a unique cost: the first time a state
 * is generated is the best. Returns path[i] = cell occupied at t0 + i.
 */
export function spaceTimeAStar(p: AStarParams): AStarResult {
  const { grid, res, me, start, t0, goals, dist, dwell } = p;
  const N = grid.N;
  const maxT = t0 + p.maxSteps;

  const goalOk = (cell: number, t: number): boolean => {
    if (!goals.has(cell)) return false;
    const end = p.permanentGoal ? t + p.maxSteps : t + dwell;
    for (let tt = t; tt <= end; tt++) if (!res.isVertexFree(cell, tt, me)) return false;
    return true;
  };

  const open = new MinHeap();
  const parent = new Map<number, number>();
  const closed = new Set<number>();
  let counter = 0;
  const startKey = t0 * N + start;
  parent.set(startKey, -1);
  open.push({ cell: start, t: t0, f: Math.max(0, dist[start]), id: counter++ });
  let expansions = 0;

  while (open.size > 0) {
    const cur = open.pop();
    const key = cur.t * N + cur.cell;
    if (closed.has(key)) continue;
    closed.add(key);
    expansions++;
    if (expansions > p.maxExpansions) return { path: null, expansions };

    if (goalOk(cur.cell, cur.t)) {
      const path: number[] = [];
      let k = key;
      while (k !== -1) {
        path.push(k % N);
        k = parent.get(k)!;
      }
      path.reverse();
      return { path, expansions };
    }
    if (cur.t >= maxT) continue;

    const nt = cur.t + 1;
    const g = nt - t0;
    // wait in place first, then E, S, W, N
    const candidates = [cur.cell, ...grid.neighbors(cur.cell)];
    for (const n of candidates) {
      const isWait = n === cur.cell;
      if (!isWait && !grid.passable(n)) continue;
      const h = dist[n];
      if (h < 0 && !isWait) continue;
      if (!res.isVertexFree(n, nt, me)) continue;
      if (!isWait && !res.isEdgeFree(cur.cell, n, cur.t, me)) continue;
      const nk = nt * N + n;
      if (parent.has(nk)) continue;
      parent.set(nk, key);
      open.push({ cell: n, t: nt, f: g + Math.max(0, h), id: counter++ });
    }
  }
  return { path: null, expansions };
}
