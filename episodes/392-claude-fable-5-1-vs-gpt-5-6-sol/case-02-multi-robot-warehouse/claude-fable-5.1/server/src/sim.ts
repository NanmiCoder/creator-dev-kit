import type {
  Job,
  LogEntry,
  Point,
  Robot,
  Shelf,
  SimState,
  StatePatch,
  WarehouseMap,
} from '../../shared/types.js';
import { generateMap, ROBOT_COUNT } from './map.js';
import { FLOOR, Grid, Reservations, bfsDistance, spaceTimeAStar } from './pathfinding.js';

export const LOAD_TICKS = 2;
export const UNLOAD_TICKS = 2;
const HORIZON = 160;
const MAX_EXPANSIONS = 40000;
const LOG_LIMIT = 300;
const ROBOT_COLORS = ['#ff6b6b', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff', '#ff9f1c', '#f15bb5', '#9ef01a'];

export interface PersistedState {
  version: number;
  seed: number;
  tick: number;
  seq: number;
  running: boolean;
  tickMs: number;
  blocked: Point[];
  robots: Robot[];
  jobs: Job[];
  log: LogEntry[];
  jobCounter: number;
  logCounter: number;
  stats: SimState['stats'];
}

export interface SimEvent {
  seq: number;
  tick: number;
  kind: string;
  patch: StatePatch;
}

type Listener = (evt: SimEvent) => void;

/**
 * Authoritative, deterministic, fixed-time-step simulation.
 * Every tick: assign jobs -> cooperative space-time planning (priority order) ->
 * conflict-checked movement -> phase progression -> emit event (seq++).
 */
export class Simulation {
  seed: number;
  tick = 0;
  seq = 0;
  running = true;
  tickMs = 400;
  map!: WarehouseMap;
  grid!: Grid;
  robots: Robot[] = [];
  jobs: Job[] = [];
  log: LogEntry[] = [];
  stats: SimState['stats'] = { jobsCompleted: 0, conflictsResolved: 0, replans: 0, planTimeMs: 0 };

  private jobCounter = 0;
  private logCounter = 0;
  private pendingLog: LogEntry[] = [];
  private distCache = new Map<string, Int32Array>();
  private listeners = new Set<Listener>();
  private rankOf = new Map<string, number>();

  constructor(seed: number, persisted?: PersistedState | null) {
    this.seed = seed;
    if (persisted && persisted.version === 1 && persisted.robots?.length === ROBOT_COUNT) {
      this.seed = persisted.seed;
      this.init(this.seed);
      this.tick = persisted.tick;
      this.seq = persisted.seq;
      this.running = persisted.running;
      this.tickMs = persisted.tickMs || 400;
      this.jobs = persisted.jobs;
      this.robots = persisted.robots;
      this.log = persisted.log ?? [];
      this.jobCounter = persisted.jobCounter;
      this.logCounter = persisted.logCounter;
      this.stats = persisted.stats ?? this.stats;
      for (const p of persisted.blocked) {
        if (this.grid.inBounds(p.x, p.y)) this.grid.blocked[this.grid.idx(p.x, p.y)] = 1;
      }
      this.logMsg('info', `已恢复持久化的运行（种子 ${this.seed}，tick ${this.tick}，seq ${this.seq}）`);
    } else {
      this.init(seed);
      this.logMsg('info', `已按种子 ${seed} 生成仓库：${this.map.shelves.length} 个货架、${this.map.workstations.length} 个工作站、${this.robots.length} 台机器人`);
    }
  }

  // ---------------------------------------------------------------- setup

  private init(seed: number): void {
    this.seed = seed;
    this.map = generateMap(seed);
    this.grid = new Grid(this.map);
    this.distCache.clear();
    this.tick = 0;
    this.jobs = [];
    this.jobCounter = 0;
    this.stats = { jobsCompleted: 0, conflictsResolved: 0, replans: 0, planTimeMs: 0 };
    this.robots = this.map.docks.slice(0, ROBOT_COUNT).map((d, i) => ({
      id: `R${i + 1}`,
      index: i,
      x: d.x,
      y: d.y,
      dock: { ...d },
      color: ROBOT_COLORS[i % ROBOT_COLORS.length],
      status: 'idle',
      phase: 'idle',
      jobId: null,
      carrying: null,
      path: [{ x: d.x, y: d.y }],
      goal: null,
      waitReason: null,
      waitTicks: 0,
      dwellRemaining: 0,
      planFailed: false,
      stepsMoved: 0,
      priority: 0,
    }));
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  snapshot(): SimState {
    return {
      seed: this.seed,
      tick: this.tick,
      seq: this.seq,
      running: this.running,
      tickMs: this.tickMs,
      map: this.map,
      blocked: this.blockedList(),
      robots: this.robots,
      jobs: this.jobs,
      log: this.log,
      stats: this.stats,
    };
  }

  persisted(): PersistedState {
    return {
      version: 1,
      seed: this.seed,
      tick: this.tick,
      seq: this.seq,
      running: this.running,
      tickMs: this.tickMs,
      blocked: this.blockedList(),
      robots: this.robots,
      jobs: this.jobs,
      log: this.log,
      jobCounter: this.jobCounter,
      logCounter: this.logCounter,
      stats: this.stats,
    };
  }

  private blockedList(): Point[] {
    const out: Point[] = [];
    for (let i = 0; i < this.grid.N; i++) if (this.grid.blocked[i]) out.push(this.pt(i));
    return out;
  }

  private emit(kind: string, patch: StatePatch): void {
    this.seq++;
    const full: StatePatch = { ...patch, tick: this.tick, seq: this.seq, running: this.running };
    if (this.pendingLog.length) {
      full.logAppend = this.pendingLog;
      this.pendingLog = [];
    }
    const evt: SimEvent = { seq: this.seq, tick: this.tick, kind, patch: full };
    for (const l of this.listeners) l(evt);
  }

  private logMsg(level: LogEntry['level'], message: string, extra: { robotId?: string; jobId?: string } = {}): void {
    const entry: LogEntry = { id: ++this.logCounter, tick: this.tick, level, message, ...extra };
    this.log.push(entry);
    if (this.log.length > LOG_LIMIT) this.log.splice(0, this.log.length - LOG_LIMIT);
    this.pendingLog.push(entry);
  }

  // ---------------------------------------------------------------- helpers

  private cellOf(r: Robot): number {
    return this.grid.idx(r.x, r.y);
  }
  private pt(i: number): Point {
    return { x: this.grid.xOf(i), y: this.grid.yOf(i) };
  }
  private fmt(i: number): string {
    return `(${this.grid.xOf(i)},${this.grid.yOf(i)})`;
  }
  private jobById(id: string | null): Job | undefined {
    return id ? this.jobs.find((j) => j.id === id) : undefined;
  }
  private shelfById(id: string): Shelf | undefined {
    return this.map.shelves.find((s) => s.id === id);
  }
  private robotById(id: string): Robot | undefined {
    return this.robots.find((r) => r.id === id);
  }

  private pickupCells(shelf: Shelf): number[] {
    const i = this.grid.idx(shelf.x, shelf.y);
    return this.grid.neighbors(i).filter((n) => this.grid.type(n) === FLOOR && this.grid.passable(n));
  }

  private goalsFor(r: Robot): number[] {
    switch (r.phase) {
      case 'toShelf': {
        const job = this.jobById(r.jobId);
        const shelf = job ? this.shelfById(job.shelfId) : undefined;
        return shelf ? this.pickupCells(shelf) : [];
      }
      case 'toWorkstation': {
        const job = this.jobById(r.jobId);
        const ws = job ? this.map.workstations.find((w) => w.id === job.workstationId) : undefined;
        if (!ws) return [];
        const i = this.grid.idx(ws.x, ws.y);
        return this.grid.passable(i) ? [i] : [];
      }
      default:
        return [this.grid.idx(r.dock.x, r.dock.y)];
    }
  }

  private distTo(goals: number[]): Int32Array {
    const key = goals.join(',');
    let d = this.distCache.get(key);
    if (!d) {
      d = bfsDistance(this.grid, goals);
      this.distCache.set(key, d);
    }
    return d;
  }

  private effectivePriority(r: Robot): number {
    const job = this.jobById(r.jobId);
    const base = job ? job.priority * 10 + (this.tick - job.createdTick) * 0.05 : 0;
    return base + Math.min(r.waitTicks, 25);
  }

  /** Planning order: robots that failed to plan last round first (deadlock escape), then priority (with aging). */
  private planOrder(): Robot[] {
    for (const r of this.robots) r.priority = Math.round(this.effectivePriority(r) * 10) / 10;
    const dwelling = (r: Robot) => (r.status === 'loading' || r.status === 'unloading' ? 1 : 0);
    return [...this.robots].sort((a, b) => {
      // robots that are loading/unloading cannot move: reserve them first so nobody plans through them
      const da = dwelling(a);
      const db = dwelling(b);
      if (da !== db) return db - da;
      const sa = a.planFailed ? 1 : 0;
      const sb = b.planFailed ? 1 : 0;
      if (sa !== sb) return sb - sa;
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.index - b.index;
    });
  }

  // ---------------------------------------------------------------- commands

  createJob(shelfId: string, workstationId: string, priority: number): Job {
    const shelf = this.shelfById(shelfId);
    if (!shelf) throw new Error(`未知货架 ${shelfId}`);
    if (!this.map.workstations.some((w) => w.id === workstationId)) throw new Error(`未知工作站 ${workstationId}`);
    const p = Math.max(1, Math.min(5, Math.round(Number(priority) || 1)));
    const job: Job = {
      id: `J${++this.jobCounter}`,
      shelfId,
      workstationId,
      priority: p,
      status: 'pending',
      robotId: null,
      createdTick: this.tick,
      assignedTick: null,
      completedTick: null,
      note: null,
    };
    this.jobs.push(job);
    this.logMsg('info', `${job.id} 已创建：${shelfId} → ${workstationId}，优先级 ${p}`, { jobId: job.id });
    this.replanNow('job_created');
    return job;
  }

  createDemoJobs(): Job[] {
    const zoneA = this.map.shelves.filter((s) => s.y >= 9 && s.y <= 11);
    const pool = zoneA.length >= 3 ? zoneA : this.map.shelves;
    const pick = (f: number) => pool[Math.min(pool.length - 1, Math.floor(pool.length * f))];
    const specs: Array<[Shelf, string, number]> = [
      [pick(0.15), 'W1', 5],
      [pick(0.5), 'W3', 3],
      [pick(0.85), 'W4', 1],
    ];
    return specs.map(([s, w, p]) => this.createJob(s.id, w, p));
  }

  cancelJob(id: string): Job {
    const job = this.jobById(id);
    if (!job) throw new Error(`未知任务 ${id}`);
    if (job.status === 'done' || job.status === 'cancelled') return job;
    const robot = job.robotId ? this.robotById(job.robotId) : undefined;
    if (robot && robot.jobId === job.id) {
      robot.jobId = null;
      robot.carrying = null;
      robot.phase = 'returning';
      robot.status = 'waiting';
      robot.dwellRemaining = 0;
      robot.path = [this.pt(this.cellOf(robot))];
      robot.goal = null;
    }
    job.status = 'cancelled';
    job.completedTick = this.tick;
    this.logMsg('warn', `${job.id} 已取消${robot ? `，${robot.id} 返回泊位` : ''}`, { jobId: job.id });
    this.replanNow('job_cancelled');
    return job;
  }

  setBlocked(x: number, y: number, blocked: boolean): void {
    if (!this.grid.inBounds(x, y)) throw new Error('坐标超出地图范围');
    const i = this.grid.idx(x, y);
    if (this.grid.type(i) !== FLOOR) throw new Error('只能封锁地板格（货架、墙、工作站、泊位不可封锁）');
    const cur = this.grid.blocked[i] === 1;
    if (cur === blocked) return;
    this.grid.blocked[i] = blocked ? 1 : 0;
    this.distCache.clear();
    const affected = this.robots.filter((r) => r.path.some((p, k) => k > 0 && p.x === x && p.y === y));
    const standing = this.robots.filter((r) => r.x === x && r.y === y);
    if (blocked) {
      this.logMsg(
        'warn',
        `已封锁格子 (${x},${y})` +
          (affected.length ? `，正在重规划 ${affected.map((r) => r.id).join('、')}` : '') +
          (standing.length ? `，站在其上的 ${standing.map((r) => r.id).join('、')} 必须驶离` : ''),
      );
    } else {
      this.logMsg('info', `已解除封锁 (${x},${y})，路线已重新评估`);
    }
    this.replanNow('cell_changed', { blocked: this.blockedList() });
  }

  pause(): void {
    if (!this.running) return;
    this.running = false;
    this.logMsg('info', '仿真已暂停');
    this.emit('paused', {});
  }

  resume(): void {
    if (this.running) return;
    this.running = true;
    this.logMsg('info', '仿真已继续');
    this.emit('resumed', {});
  }

  step(): void {
    if (this.running) {
      this.running = false;
      this.logMsg('info', '仿真已暂停（单步执行）');
    }
    this.tickOnce();
  }

  setTickMs(ms: number): void {
    this.tickMs = Math.max(50, Math.min(3000, Math.round(ms)));
    this.emit('speed', { tickMs: this.tickMs });
  }

  reset(seed?: number): void {
    const s = Number.isFinite(seed) ? Math.floor(seed as number) : this.seed;
    this.log = [];
    this.pendingLog = [];
    this.init(s);
    this.logMsg('info', `已用种子 ${s} 重置：${this.map.shelves.length} 个货架、${this.map.workstations.length} 个工作站、${this.robots.length} 台机器人，确定性运行重新开始`);
    this.emit('reset', {
      seed: this.seed,
      map: this.map,
      blocked: [],
      robots: this.robots,
      jobs: this.jobs,
      stats: this.stats,
      tickMs: this.tickMs,
      logReset: true,
    });
  }

  /** Re-run assignment + planning immediately (also while paused) and broadcast. */
  private replanNow(kind: string, extra: StatePatch = {}): void {
    this.assignJobs();
    this.planAll();
    this.emit(kind, { robots: this.robots, jobs: this.jobs, stats: this.stats, ...extra });
  }

  // ---------------------------------------------------------------- engine

  tickOnce(): void {
    this.assignJobs();
    this.planAll();
    this.moveAll();
    this.tick++;
    this.progress();
    this.emit('tick', { robots: this.robots, jobs: this.jobs, stats: this.stats });
  }

  private assignJobs(): void {
    const pending = this.jobs
      .filter((j) => j.status === 'pending')
      .sort((a, b) => {
        const pa = a.priority * 10 + (this.tick - a.createdTick) * 0.05;
        const pb = b.priority * 10 + (this.tick - b.createdTick) * 0.05;
        if (pa !== pb) return pb - pa;
        return a.createdTick - b.createdTick || a.id.localeCompare(b.id);
      });
    for (const job of pending) {
      const shelf = this.shelfById(job.shelfId);
      if (!shelf) continue;
      const goals = this.pickupCells(shelf);
      if (goals.length === 0) {
        job.note = '货架没有可用的取货格';
        continue;
      }
      const dist = this.distTo(goals);
      let best: Robot | null = null;
      let bestD = Infinity;
      let anyFree = false;
      for (const r of this.robots) {
        if (r.jobId || (r.phase !== 'idle' && r.phase !== 'returning')) continue;
        anyFree = true;
        const d = dist[this.cellOf(r)];
        if (d >= 0 && d < bestD) {
          best = r;
          bestD = d;
        }
      }
      if (!best) {
        job.note = anyFree ? '空闲机器人无法到达该货架' : '等待空闲机器人';
        continue;
      }
      job.status = 'assigned';
      job.robotId = best.id;
      job.assignedTick = this.tick;
      job.note = null;
      best.jobId = job.id;
      best.phase = 'toShelf';
      best.status = 'waiting';
      best.waitTicks = 0;
      best.path = [this.pt(this.cellOf(best))];
      this.logMsg('info', `${job.id} 已分配给 ${best.id}（${job.shelfId} → ${job.workstationId}，P${job.priority}，距离 ${bestD} 格）`, {
        jobId: job.id,
        robotId: best.id,
      });
    }
  }

  private planAll(): void {
    const t0 = this.tick;
    const grid = this.grid;
    const res = new Reservations(grid.N);
    const order = this.planOrder();
    this.rankOf.clear();
    order.forEach((r, i) => this.rankOf.set(r.id, i));
    // Unplanned robots occupy their current cell at t0. Only t0: a higher-priority robot may plan
    // to enter that cell at t0+1, which forces the lower-priority robot (planned later) to step
    // aside now instead of both waiting forever. If it cannot, the execution guard holds the move.
    for (const r of this.robots) res.reserveVertex(this.cellOf(r), t0, r.id);
    const started = performance.now();
    for (const r of order) {
      const c = this.cellOf(r);
      res.releaseVertex(c, t0, r.id);

      if (r.status === 'loading' || r.status === 'unloading') {
        r.path = [this.pt(c)];
        for (let k = 0; k <= r.dwellRemaining; k++) res.reserveVertex(c, t0 + k, r.id);
        r.planFailed = false;
        continue;
      }

      const goals = this.goalsFor(r);
      const permanent = r.phase === 'idle' || r.phase === 'returning';
      const dwell = r.phase === 'toShelf' ? LOAD_TICKS : r.phase === 'toWorkstation' ? UNLOAD_TICKS : 0;
      if (goals.length === 0) {
        this.failPlan(r, res, c, t0, '目标不可达：没有可用的取货格', false);
        continue;
      }
      const dist = this.distTo(goals);
      const reachable = dist[c] >= 0 || grid.neighbors(c).some((n) => grid.passable(n) && dist[n] >= 0);
      if (!reachable) {
        this.failPlan(r, res, c, t0, '无路径：目标被墙或封锁格隔断', false);
        continue;
      }
      const goalSet = new Set(goals);
      let path = this.reusePlan(r, res, c, t0, goalSet, dwell, permanent);
      if (!path) {
        const result = spaceTimeAStar({
          grid,
          res,
          me: r.id,
          start: c,
          t0,
          goals: goalSet,
          dist,
          dwell,
          permanentGoal: permanent,
          maxSteps: HORIZON,
          maxExpansions: MAX_EXPANSIONS,
        });
        path = result.path;
        this.stats.replans++;
      }
      if (!path) {
        this.failPlan(r, res, c, t0, '规划视野内没有无冲突路线（拥堵），下一步提升优先级重试', true);
        continue;
      }
      res.reservePath(r.id, path, t0, dwell, permanent);
      r.path = path.map((i) => this.pt(i));
      r.goal = this.pt(path[path.length - 1]);
      r.planFailed = false;
      if (path.length >= 2) {
        if (path[1] === c) r.waitReason = this.describeWait(r, c, res, t0, dist);
        else if (dist[c] >= 0 && dist[path[1]] > dist[c]) r.waitReason = '绕行已被预约的格子';
        else r.waitReason = null;
      } else {
        r.waitReason = null;
      }
    }
    this.stats.planTimeMs = Math.round((performance.now() - started) * 100) / 100;
  }

  private failPlan(r: Robot, res: Reservations, c: number, t0: number, reason: string, boost: boolean): void {
    r.path = [this.pt(c)];
    r.goal = null;
    r.waitReason = reason;
    r.planFailed = boost;
    res.reservePermanent(c, t0, r.id);
  }

  /** Keep the previous plan when it is still conflict-free (stable routes, cheap planning). */
  private reusePlan(
    r: Robot,
    res: Reservations,
    c: number,
    t0: number,
    goals: Set<number>,
    dwell: number,
    permanent: boolean,
  ): number[] | null {
    if (r.path.length < 2) return null;
    const cells = r.path.map((p) => this.grid.idx(p.x, p.y));
    if (cells[0] !== c) return null;
    for (let i = 1; i < cells.length; i++) {
      const t = t0 + i;
      if (!this.grid.passable(cells[i])) return null;
      if (!res.isVertexFree(cells[i], t, r.id)) return null;
      if (cells[i] !== cells[i - 1] && !res.isEdgeFree(cells[i - 1], cells[i], t - 1, r.id)) return null;
    }
    const last = cells[cells.length - 1];
    if (!goals.has(last)) return null;
    const tEnd = t0 + cells.length - 1;
    const end = permanent ? tEnd + HORIZON : tEnd + dwell;
    for (let tt = tEnd; tt <= end; tt++) if (!res.isVertexFree(last, tt, r.id)) return null;
    return cells;
  }

  private describeWait(r: Robot, c: number, res: Reservations, t0: number, dist: Int32Array): string {
    for (const n of this.grid.neighbors(c)) {
      if (!this.grid.passable(n) || dist[n] < 0) continue;
      if (dist[c] >= 0 && dist[n] >= dist[c]) continue;
      const owner = res.ownerAt(n, t0 + 1) ?? res.ownerAt(n, t0 + 2);
      if (owner && owner !== r.id) return `等待 ${owner} 让出 ${this.fmt(n)}`;
    }
    return '等待：为已预约的路线让行';
  }

  private moveAll(): void {
    const grid = this.grid;
    const robots = this.robots;
    const n = robots.length;
    const cur = robots.map((r) => this.cellOf(r));
    const next = robots.map((r, i) => (r.path.length >= 2 ? grid.idx(r.path[1].x, r.path[1].y) : cur[i]));
    const moving = next.map((nx, i) => nx !== cur[i]);
    const intended = moving.slice();
    const cancelReason: (string | null)[] = Array(n).fill(null);
    const rank = (i: number) => this.rankOf.get(robots[i].id) ?? i;
    const cancel = (i: number, reason: string) => {
      if (!moving[i]) return;
      moving[i] = false;
      cancelReason[i] = reason;
    };

    for (let i = 0; i < n; i++) {
      if (moving[i] && !grid.passable(next[i])) cancel(i, `前方 ${this.fmt(next[i])} 已被封锁，正在重规划`);
    }
    // Fixed-point conflict resolution: same-cell and swap conflicts are never executed.
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < n; i++) {
        if (!moving[i]) continue;
        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const jTarget = moving[j] ? next[j] : cur[j];
          if (jTarget === next[i]) {
            if (!moving[j]) cancel(i, `等待 ${robots[j].id} 让出 ${this.fmt(next[i])}`);
            else if (rank(i) > rank(j)) cancel(i, `在 ${this.fmt(next[i])} 为更高优先级的 ${robots[j].id} 让行`);
            else continue;
            changed = true;
            break;
          }
          if (moving[j] && next[j] === cur[i] && next[i] === cur[j]) {
            cancel(i, `与 ${robots[j].id} 迎面冲突，正在重规划`);
            cancel(j, `与 ${robots[i].id} 迎面冲突，正在重规划`);
            changed = true;
            break;
          }
        }
      }
    }

    for (let i = 0; i < n; i++) {
      const r = robots[i];
      if (r.status === 'loading' || r.status === 'unloading') continue;
      if (moving[i]) {
        const p = this.pt(next[i]);
        r.x = p.x;
        r.y = p.y;
        r.path.shift();
        r.status = 'moving';
        r.waitTicks = 0;
        r.stepsMoved++;
        if (r.waitReason && !r.waitReason.startsWith('绕行')) r.waitReason = null;
      } else if (intended[i]) {
        r.status = 'waiting';
        r.waitReason = cancelReason[i];
        r.waitTicks++;
        this.stats.conflictsResolved++;
        this.logMsg('warn', `${r.id} 在 ${this.fmt(cur[i])} 被执行守卫拦停：${cancelReason[i]}`, { robotId: r.id });
      } else if (r.path.length >= 2) {
        r.path.shift();
        r.status = 'waiting';
        r.waitTicks++;
      } else if (r.phase === 'idle') {
        r.status = 'idle';
        r.waitTicks = 0;
      } else {
        r.status = 'waiting';
        r.waitTicks++;
      }
    }
  }

  private progress(): void {
    for (const r of this.robots) {
      const c = this.cellOf(r);
      if (r.status === 'loading' || r.status === 'unloading') {
        r.dwellRemaining--;
        if (r.dwellRemaining > 0) continue;
        const job = this.jobById(r.jobId);
        if (r.status === 'loading') {
          r.carrying = job?.shelfId ?? null;
          r.phase = 'toWorkstation';
          r.status = 'waiting';
          r.waitReason = null;
          r.path = [this.pt(c)];
          if (job) {
            job.status = 'delivering';
            this.logMsg('info', `${r.id} 已装载 ${job.shelfId}，前往 ${job.workstationId}`, { robotId: r.id, jobId: job.id });
          }
        } else {
          if (job) {
            job.status = 'done';
            job.completedTick = this.tick;
            this.stats.jobsCompleted++;
            this.logMsg('info', `${job.id} 完成：${r.id} 已将 ${job.shelfId} 送达 ${job.workstationId}，耗时 ${this.tick - job.createdTick} 个时间步`, {
              robotId: r.id,
              jobId: job.id,
            });
          }
          r.carrying = null;
          r.jobId = null;
          r.phase = 'returning';
          r.status = 'waiting';
          r.waitReason = null;
          r.path = [this.pt(c)];
        }
        continue;
      }
      const goals = this.goalsFor(r);
      if (!goals.includes(c)) continue;
      const job = this.jobById(r.jobId);
      switch (r.phase) {
        case 'toShelf':
          r.status = 'loading';
          r.dwellRemaining = LOAD_TICKS;
          r.waitReason = null;
          r.path = [this.pt(c)];
          if (job) {
            job.status = 'picking';
            this.logMsg('info', `${r.id} 到达 ${job.shelfId}，装载中（${LOAD_TICKS} 个时间步）`, { robotId: r.id, jobId: job.id });
          }
          break;
        case 'toWorkstation':
          r.status = 'unloading';
          r.dwellRemaining = UNLOAD_TICKS;
          r.waitReason = null;
          r.path = [this.pt(c)];
          if (job) this.logMsg('info', `${r.id} 到达 ${job.workstationId}，卸载中（${UNLOAD_TICKS} 个时间步）`, { robotId: r.id, jobId: job.id });
          break;
        case 'returning':
          r.phase = 'idle';
          r.status = 'idle';
          r.waitReason = null;
          r.waitTicks = 0;
          r.goal = null;
          r.path = [this.pt(c)];
          this.logMsg('info', `${r.id} 已回泊位，空闲`, { robotId: r.id });
          break;
        default:
          r.status = 'idle';
      }
    }
  }
}
