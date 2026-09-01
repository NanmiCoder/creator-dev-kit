import fs from "node:fs";
import path from "node:path";

export type Position = { x: number; y: number };
export type CellType = "floor" | "wall" | "shelf" | "workstation";
export type Priority = "low" | "normal" | "high";
export type JobStatus = "queued" | "active" | "completed";
export type RobotPhase = "idle" | "to_shelf" | "to_station";
export type RobotStatus = "idle" | "moving" | "waiting";

export type MapCell = Position & {
  key: string;
  type: CellType;
  id?: string;
  label?: string;
  bottleneck?: string;
};

export type Robot = {
  id: string;
  color: string;
  position: Position;
  home: Position;
  status: RobotStatus;
  phase: RobotPhase;
  jobId: string | null;
  path: Position[];
  waitReason: string | null;
  waitTicks: number;
  completedJobs: number;
};

export type Job = {
  id: string;
  shelfId: string;
  stationId: string;
  priority: Priority;
  status: JobStatus;
  createdTick: number;
  ageTicks: number;
  assignedRobotId: string | null;
  pickedUpTick: number | null;
  completedTick: number | null;
};

export type LogEntry = {
  id: string;
  sequence: number;
  tick: number;
  type: "system" | "job" | "route" | "map" | "safety";
  tone: "neutral" | "good" | "warn";
  message: string;
};

export type Snapshot = {
  sequence: number;
  tick: number;
  running: boolean;
  seed: string;
  stepMs: number;
  map: {
    width: number;
    height: number;
    cells: MapCell[];
    blocked: string[];
  };
  robots: Robot[];
  jobs: Job[];
  eventLog: LogEntry[];
  metrics: {
    moving: number;
    waiting: number;
    queued: number;
    completed: number;
    reservations: number;
  };
};

type PersistedState = {
  version: 1;
  sequence: number;
  tick: number;
  running: boolean;
  nextJobNumber: number;
  dynamicBlocked: string[];
  robots: Robot[];
  jobs: Job[];
  eventLog: LogEntry[];
};

type DraftLog = Omit<LogEntry, "id" | "sequence" | "tick">;
type Reservation = { owner: string; from?: Position; to?: Position };

const WIDTH = 26;
const HEIGHT = 18;
const SEED = "WAYPOINT-42";
const STEP_MS = 650;
const PLAN_HORIZON = 88;
const PRIORITY_WEIGHT: Record<Priority, number> = { low: 100, normal: 200, high: 300 };
const ROBOT_COLORS = [
  "#ffb547",
  "#8ce8c2",
  "#f27d64",
  "#75b8ff",
  "#d6a5ff",
  "#f4df7b",
  "#7bd6e8",
  "#ff91b8",
];

export const positionKey = (position: Position): string => `${position.x},${position.y}`;
const samePosition = (a: Position, b: Position): boolean => a.x === b.x && a.y === b.y;
const manhattan = (a: Position, b: Position): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

function buildWarehouse(): MapCell[] {
  const cells: MapCell[] = [];
  const workstationByKey = new Map<string, { id: string; label: string }>([
    ["1,4", { id: "WS-01", label: "工作站 01" }],
    ["24,4", { id: "WS-02", label: "工作站 02" }],
    ["1,13", { id: "WS-03", label: "工作站 03" }],
    ["24,13", { id: "WS-04", label: "工作站 04" }],
  ]);
  const gapXs = new Set([3, 8, 13, 18, 23]);
  let shelfNumber = 1;

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const key = `${x},${y}`;
      let type: CellType = "floor";
      let id: string | undefined;
      let label: string | undefined;
      let bottleneck: string | undefined;

      if (x === 0 || x === WIDTH - 1 || y === 0 || y === HEIGHT - 1) {
        type = "wall";
      } else if ((y === 8 || y === 9) && !gapXs.has(x)) {
        type = "wall";
      } else if (gapXs.has(x) && (y === 8 || y === 9)) {
        bottleneck = `CH-${String([...gapXs].indexOf(x) + 1).padStart(2, "0")}`;
      }

      const workstation = workstationByKey.get(key);
      if (workstation) {
        type = "workstation";
        id = workstation.id;
        label = workstation.label;
      }

      const isShelf = [5, 10, 15, 20].includes(x) && ((y >= 3 && y <= 6) || (y >= 11 && y <= 14));
      if (isShelf) {
        type = "shelf";
        id = `S-${String(shelfNumber).padStart(2, "0")}`;
        label = `库位 ${String(shelfNumber).padStart(2, "0")}`;
        shelfNumber += 1;
      }

      cells.push({ x, y, key, type, id, label, bottleneck });
    }
  }
  return cells;
}

class MinHeap<T> {
  private items: Array<{ score: number; value: T }> = [];

  get size(): number {
    return this.items.length;
  }

  push(value: T, score: number): void {
    const item = { value, score };
    this.items.push(item);
    let index = this.items.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.items[parent].score <= score) break;
      this.items[index] = this.items[parent];
      index = parent;
    }
    this.items[index] = item;
  }

  pop(): T | undefined {
    if (this.items.length === 0) return undefined;
    const root = this.items[0].value;
    const tail = this.items.pop();
    if (this.items.length > 0 && tail) {
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        if (left >= this.items.length) break;
        let child = left;
        if (right < this.items.length && this.items[right].score < this.items[left].score) child = right;
        if (this.items[child].score >= tail.score) break;
        this.items[index] = this.items[child];
        index = child;
      }
      this.items[index] = tail;
    }
    return root;
  }
}

class ReservationTable {
  readonly vertices = new Map<string, string>();
  readonly edges = new Map<string, Reservation>();
  readonly corridorLocks = new Map<string, { owner: string; direction: number }>();

  vertexKey(position: Position, time: number): string {
    return `${time}:${positionKey(position)}`;
  }

  edgeKey(from: Position, to: Position, time: number): string {
    return `${time}:${positionKey(from)}>${positionKey(to)}`;
  }

  reserveVertex(position: Position, time: number, owner: string): void {
    this.vertices.set(this.vertexKey(position, time), owner);
  }

  reserveEdge(from: Position, to: Position, time: number, owner: string): void {
    this.edges.set(this.edgeKey(from, to, time), { owner, from, to });
  }

  vertexOwner(position: Position, time: number, requester: string): string | null {
    const owner = this.vertices.get(this.vertexKey(position, time));
    return owner && owner !== requester ? owner : null;
  }

  swapOwner(from: Position, to: Position, time: number, requester: string): string | null {
    const reservation = this.edges.get(this.edgeKey(to, from, time));
    return reservation && reservation.owner !== requester ? reservation.owner : null;
  }
}

type SearchNode = { position: Position; time: number; cost: number; key: string };
type PlanResult = { path: Position[] | null; blockedBy: string[] };

export class WarehouseSimulation {
  readonly seed = SEED;
  readonly stepMs = STEP_MS;
  readonly width = WIDTH;
  readonly height = HEIGHT;
  readonly cells = buildWarehouse();
  private readonly cellsByKey = new Map(this.cells.map((cell) => [cell.key, cell]));
  private readonly shelves = new Map(this.cells.filter((cell) => cell.type === "shelf" && cell.id).map((cell) => [cell.id!, cell]));
  private readonly workstations = new Map(
    this.cells.filter((cell) => cell.type === "workstation" && cell.id).map((cell) => [cell.id!, cell]),
  );
  private readonly listeners = new Set<(snapshot: Snapshot) => void>();
  private readonly persistPath: string;
  private pendingLogs: DraftLog[] = [];
  private reservationsCount = 0;
  private nextJobNumber = 1;
  private dynamicBlocked = new Set<string>();

  sequence = 0;
  tick = 0;
  running = true;
  robots: Robot[] = [];
  jobs: Job[] = [];
  eventLog: LogEntry[] = [];

  constructor(persistPath: string, restore = true) {
    this.persistPath = persistPath;
    this.initializeRobots();
    if (restore && this.restore()) {
      this.planAllRoutes();
      this.queueLog("system", "good", `已恢复确定性运行，当前为第 ${this.tick} 步。`);
      this.publish();
    } else {
      this.queueLog("system", "good", `仿真已初始化，种子为 ${SEED}。`);
      this.planAllRoutes();
      this.publish();
    }
  }

  private initializeRobots(): void {
    const homes: Position[] = [
      { x: 2, y: 2 },
      { x: 7, y: 2 },
      { x: 12, y: 2 },
      { x: 17, y: 2 },
      { x: 22, y: 2 },
      { x: 3, y: 15 },
      { x: 13, y: 15 },
      { x: 23, y: 15 },
    ];
    this.robots = homes.map((home, index) => ({
      id: `R-${String(index + 1).padStart(2, "0")}`,
      color: ROBOT_COLORS[index],
      position: { ...home },
      home: { ...home },
      status: "idle",
      phase: "idle",
      jobId: null,
      path: [{ ...home }],
      waitReason: null,
      waitTicks: 0,
      completedJobs: 0,
    }));
  }

  private restore(): boolean {
    try {
      if (!fs.existsSync(this.persistPath)) return false;
      const stored = JSON.parse(fs.readFileSync(this.persistPath, "utf8")) as PersistedState;
      if (stored.version !== 1 || !Array.isArray(stored.robots) || stored.robots.length !== 8) return false;
      this.sequence = stored.sequence;
      this.tick = stored.tick;
      this.running = stored.running;
      this.nextJobNumber = stored.nextJobNumber;
      this.dynamicBlocked = new Set(stored.dynamicBlocked.filter((key) => this.isBaseTraversableKey(key)));
      this.robots = stored.robots;
      this.jobs = stored.jobs;
      this.eventLog = stored.eventLog.slice(-80);
      return true;
    } catch {
      return false;
    }
  }

  private persist(): void {
    const state: PersistedState = {
      version: 1,
      sequence: this.sequence,
      tick: this.tick,
      running: this.running,
      nextJobNumber: this.nextJobNumber,
      dynamicBlocked: [...this.dynamicBlocked],
      robots: this.robots,
      jobs: this.jobs,
      eventLog: this.eventLog,
    };
    fs.mkdirSync(path.dirname(this.persistPath), { recursive: true });
    const temporaryPath = `${this.persistPath}.tmp`;
    fs.writeFileSync(temporaryPath, JSON.stringify(state, null, 2));
    fs.renameSync(temporaryPath, this.persistPath);
  }

  subscribe(listener: (snapshot: Snapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): Snapshot {
    const activeJobs = new Map(this.jobs.map((job) => [job.id, job]));
    const robots = this.robots.map((robot) => ({
      ...robot,
      position: { ...robot.position },
      home: { ...robot.home },
      path: robot.path.map((position) => ({ ...position })),
    }));
    return {
      sequence: this.sequence,
      tick: this.tick,
      running: this.running,
      seed: this.seed,
      stepMs: this.stepMs,
      map: {
        width: this.width,
        height: this.height,
        cells: this.cells,
        blocked: [...this.dynamicBlocked],
      },
      robots,
      jobs: [...activeJobs.values()].map((job) => ({ ...job })),
      eventLog: this.eventLog.slice(-60),
      metrics: {
        moving: robots.filter((robot) => robot.status === "moving").length,
        waiting: robots.filter((robot) => robot.status === "waiting").length,
        queued: this.jobs.filter((job) => job.status === "queued").length,
        completed: this.jobs.filter((job) => job.status === "completed").length,
        reservations: this.reservationsCount,
      },
    };
  }

  getCatalog(): { shelves: MapCell[]; workstations: MapCell[] } {
    return {
      shelves: [...this.shelves.values()],
      workstations: [...this.workstations.values()],
    };
  }

  private queueLog(type: DraftLog["type"], tone: DraftLog["tone"], message: string): void {
    this.pendingLogs.push({ type, tone, message });
  }

  private publish(): void {
    this.sequence += 1;
    this.pendingLogs.forEach((entry, index) => {
      this.eventLog.push({ ...entry, sequence: this.sequence, tick: this.tick, id: `${this.sequence}-${index}` });
    });
    this.pendingLogs = [];
    this.eventLog = this.eventLog.slice(-80);
    this.persist();
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  createJob(shelfId: string, stationId: string, priority: Priority): Job {
    if (!this.shelves.has(shelfId)) throw new Error("未找到指定货架。");
    if (!this.workstations.has(stationId)) throw new Error("未找到指定工作站。");
    if (!(["low", "normal", "high"] as string[]).includes(priority)) throw new Error("优先级无效。");
    const job: Job = {
      id: `J-${String(this.nextJobNumber).padStart(3, "0")}`,
      shelfId,
      stationId,
      priority,
      status: "queued",
      createdTick: this.tick,
      ageTicks: 0,
      assignedRobotId: null,
      pickedUpTick: null,
      completedTick: null,
    };
    this.nextJobNumber += 1;
    this.jobs.push(job);
    const priorityName = priority === "high" ? "高" : priority === "normal" ? "普通" : "低";
    this.queueLog("job", "good", `${job.id} 已排队：${shelfId} → ${stationId}（${priorityName}优先级）。`);
    this.assignJobs();
    this.planAllRoutes();
    this.publish();
    return job;
  }

  setRunning(running: boolean): void {
    if (this.running === running) return;
    this.running = running;
    this.queueLog("system", "neutral", running ? "自动时钟已恢复。" : "仿真已由操作员暂停。");
    this.publish();
  }

  singleStep(): void {
    if (this.running) throw new Error("单步执行前请先暂停仿真。");
    this.advance(true);
  }

  reset(): void {
    this.sequence = 0;
    this.tick = 0;
    this.running = false;
    this.nextJobNumber = 1;
    this.dynamicBlocked.clear();
    this.jobs = [];
    this.eventLog = [];
    this.initializeRobots();
    this.planAllRoutes();
    this.queueLog("system", "good", `已按确定性种子 ${SEED} 重置；时钟已暂停。`);
    this.publish();
  }

  setCellBlocked(position: Position, blocked: boolean): void {
    const key = positionKey(position);
    const cell = this.cellsByKey.get(key);
    if (!cell || !this.isBaseTraversable(cell)) throw new Error("只能封锁可通行网格。");
    if (blocked && this.robots.some((robot) => samePosition(robot.position, position))) {
      throw new Error("该网格当前有机器人占用。");
    }
    const changed = blocked ? !this.dynamicBlocked.has(key) : this.dynamicBlocked.has(key);
    if (!changed) return;
    if (blocked) this.dynamicBlocked.add(key);
    else this.dynamicBlocked.delete(key);

    const affected = this.robots.filter((robot) => robot.path.slice(1).some((step) => samePosition(step, position)));
    this.planAllRoutes();
    const action = blocked ? "已封锁" : "已重新开放";
    const effect = affected.length > 0 ? `；已为 ${affected.map((robot) => robot.id).join("、")} 重新规划` : "";
    this.queueLog("map", blocked ? "warn" : "good", `网格 [${position.x},${position.y}] ${action}${effect}。`);
    this.publish();
  }

  advance(force = false): void {
    if (!this.running && !force) return;
    this.tick += 1;
    this.jobs.forEach((job) => {
      if (job.status !== "completed") job.ageTicks += 1;
    });

    this.assignJobs();
    this.planAllRoutes();
    const previousReasons = new Map(this.robots.map((robot) => [robot.id, robot.waitReason]));
    const proposed = this.robots.map((robot) => ({ robot, next: robot.path[1] ?? robot.position }));
    this.assertSafeMoves(proposed);

    for (const { robot, next } of proposed) {
      if (robot.jobId && !samePosition(robot.position, next)) robot.position = { ...next };
      this.resolveArrival(robot);
    }

    this.assignJobs();
    this.planAllRoutes();
    for (const robot of this.robots) {
      const oldReason = previousReasons.get(robot.id);
      if (robot.waitReason && robot.waitReason !== oldReason) {
        this.queueLog("safety", "warn", `${robot.id} 正在等待：${robot.waitReason}`);
      }
    }
    this.publish();
  }

  private assertSafeMoves(proposed: Array<{ robot: Robot; next: Position }>): void {
    for (let index = 0; index < proposed.length; index += 1) {
      const first = proposed[index];
      if (this.isBlocked(first.next)) throw new Error(`Safety invariant: ${first.robot.id} attempted a blocked cell.`);
      for (let otherIndex = index + 1; otherIndex < proposed.length; otherIndex += 1) {
        const second = proposed[otherIndex];
        if (samePosition(first.next, second.next)) {
          throw new Error(`Safety invariant: vertex collision between ${first.robot.id} and ${second.robot.id}.`);
        }
        if (
          samePosition(first.robot.position, second.next) &&
          samePosition(second.robot.position, first.next) &&
          !samePosition(first.next, first.robot.position)
        ) {
          throw new Error(`Safety invariant: edge swap between ${first.robot.id} and ${second.robot.id}.`);
        }
      }
    }
  }

  private assignJobs(): void {
    const idleRobots = this.robots.filter((robot) => robot.jobId === null);
    const queued = this.jobs
      .filter((job) => job.status === "queued")
      .sort((a, b) => {
        const aScore = PRIORITY_WEIGHT[a.priority] + a.ageTicks * 4;
        const bScore = PRIORITY_WEIGHT[b.priority] + b.ageTicks * 4;
        return bScore - aScore || a.createdTick - b.createdTick || a.id.localeCompare(b.id);
      });

    while (idleRobots.length > 0 && queued.length > 0) {
      const job = queued.shift()!;
      const shelf = this.shelves.get(job.shelfId)!;
      const docks = this.shelfDocks(shelf);
      idleRobots.sort((a, b) => {
        const distanceA = Math.min(...docks.map((dock) => manhattan(a.position, dock)));
        const distanceB = Math.min(...docks.map((dock) => manhattan(b.position, dock)));
        return distanceA - distanceB || a.id.localeCompare(b.id);
      });
      const robot = idleRobots.shift()!;
      job.status = "active";
      job.assignedRobotId = robot.id;
      robot.jobId = job.id;
      robot.phase = "to_shelf";
      robot.status = "moving";
      robot.waitReason = null;
      this.queueLog("job", "good", `${job.id} 已分配给 ${robot.id}；当前有效优先级为 ${PRIORITY_WEIGHT[job.priority] + job.ageTicks * 4}。`);
    }
  }

  private resolveArrival(robot: Robot): void {
    if (!robot.jobId) return;
    const job = this.jobs.find((candidate) => candidate.id === robot.jobId);
    if (!job) return;
    if (robot.phase === "to_shelf") {
      const shelf = this.shelves.get(job.shelfId)!;
      if (this.shelfDocks(shelf).some((dock) => samePosition(dock, robot.position))) {
        robot.phase = "to_station";
        job.pickedUpTick = this.tick;
        this.queueLog("job", "good", `${robot.id} 已从 ${job.shelfId} 取得 ${job.id} 货物。`);
      }
    }
    if (robot.phase === "to_station") {
      const station = this.workstations.get(job.stationId)!;
      if (samePosition(station, robot.position)) {
        job.status = "completed";
        job.completedTick = this.tick;
        robot.completedJobs += 1;
        robot.jobId = null;
        robot.phase = "idle";
        robot.status = "idle";
        robot.path = [{ ...robot.position }];
        robot.waitReason = null;
        robot.waitTicks = 0;
        this.queueLog("job", "good", `${robot.id} 已将 ${job.id} 送达 ${job.stationId}。`);
      }
    }
  }

  private planAllRoutes(): void {
    const table = new ReservationTable();
    for (const robot of this.robots) {
      table.reserveVertex(robot.position, 0, robot.id);
      table.reserveVertex(robot.position, 1, robot.id);
      if (!robot.jobId) {
        for (let time = 2; time <= PLAN_HORIZON; time += 1) table.reserveVertex(robot.position, time, robot.id);
      }
    }

    const active = this.robots
      .filter((robot) => robot.jobId)
      .sort((a, b) => this.robotPlanScore(b) - this.robotPlanScore(a) || a.id.localeCompare(b.id));

    for (const robot of active) {
      const targets = this.targetsForRobot(robot);
      let best: PlanResult = { path: null, blockedBy: [] };
      for (const target of targets) {
        const result = this.spaceTimeAStar(robot, target, table);
        if (result.path && (!best.path || result.path.length < best.path.length)) best = result;
        else if (!best.path) best.blockedBy.push(...result.blockedBy);
      }

      if (!best.path) {
        robot.path = [{ ...robot.position }];
        robot.status = "waiting";
        robot.waitTicks += 1;
        robot.waitReason = targets.length === 0
          ? "目标入口已封锁，等待地图变更"
          : best.blockedBy.length > 0
            ? `与 ${[...new Set(best.blockedBy)].slice(0, 2).join(" / ")} 的时空预留发生冲突`
            : "规划地平线内暂无安全路径";
        this.reservePath(robot, robot.path, table);
        continue;
      }

      robot.path = best.path;
      const next = best.path[1] ?? robot.position;
      if (samePosition(next, robot.position)) {
        robot.status = "waiting";
        robot.waitTicks += 1;
        robot.waitReason = best.blockedBy.length > 0
          ? `正在向 ${[...new Set(best.blockedBy)][0]} 让出已预留通道`
          : "为无碰撞通行进行计时停留";
      } else {
        robot.status = "moving";
        robot.waitReason = null;
        robot.waitTicks = 0;
      }
      this.reservePath(robot, best.path, table);
    }
    this.reservationsCount = table.vertices.size + table.edges.size + table.corridorLocks.size;
  }

  private robotPlanScore(robot: Robot): number {
    const job = this.jobs.find((candidate) => candidate.id === robot.jobId);
    return (job ? PRIORITY_WEIGHT[job.priority] + job.ageTicks * 4 : 0) + robot.waitTicks * 12;
  }

  private targetsForRobot(robot: Robot): Position[] {
    const job = this.jobs.find((candidate) => candidate.id === robot.jobId);
    if (!job) return [];
    if (robot.phase === "to_station") {
      const station = this.workstations.get(job.stationId);
      return station && !this.dynamicBlocked.has(station.key) ? [{ x: station.x, y: station.y }] : [];
    }
    const shelf = this.shelves.get(job.shelfId);
    if (!shelf) return [];
    return this.shelfDocks(shelf).sort((a, b) => manhattan(robot.position, a) - manhattan(robot.position, b));
  }

  private shelfDocks(shelf: MapCell): Position[] {
    const candidates = [
      { x: shelf.x - 1, y: shelf.y },
      { x: shelf.x + 1, y: shelf.y },
      { x: shelf.x, y: shelf.y - 1 },
      { x: shelf.x, y: shelf.y + 1 },
    ];
    return candidates.filter((position) => !this.isBlocked(position));
  }

  private spaceTimeAStar(robot: Robot, target: Position, table: ReservationTable): PlanResult {
    if (this.isBlocked(target)) return { path: null, blockedBy: [] };
    const startKey = `0:${positionKey(robot.position)}`;
    const open = new MinHeap<SearchNode>();
    open.push({ position: robot.position, time: 0, cost: 0, key: startKey }, manhattan(robot.position, target));
    const cameFrom = new Map<string, string>();
    const states = new Map<string, SearchNode>([[startKey, { position: robot.position, time: 0, cost: 0, key: startKey }]]);
    const bestCost = new Map<string, number>([[startKey, 0]]);
    const blockedBy = new Set<string>();

    while (open.size > 0) {
      const current = open.pop()!;
      if (current.cost !== bestCost.get(current.key)) continue;
      if (samePosition(current.position, target)) {
        const path: Position[] = [];
        let cursor: string | undefined = current.key;
        while (cursor) {
          const state = states.get(cursor)!;
          path.push({ ...state.position });
          cursor = cameFrom.get(cursor);
        }
        path.reverse();
        return { path, blockedBy: [...blockedBy] };
      }
      if (current.time >= PLAN_HORIZON) continue;

      const neighbors = [
        { x: current.position.x + 1, y: current.position.y },
        { x: current.position.x - 1, y: current.position.y },
        { x: current.position.x, y: current.position.y + 1 },
        { x: current.position.x, y: current.position.y - 1 },
        { ...current.position },
      ];

      for (const next of neighbors) {
        if (this.isBlocked(next)) continue;
        const nextTime = current.time + 1;
        const vertexOwner = table.vertexOwner(next, nextTime, robot.id);
        const swapOwner = table.swapOwner(current.position, next, nextTime, robot.id);
        if (vertexOwner || swapOwner) {
          if (vertexOwner) blockedBy.add(vertexOwner);
          if (swapOwner) blockedBy.add(swapOwner);
          continue;
        }

        const bottleneck = this.cellsByKey.get(positionKey(next))?.bottleneck;
        const direction = Math.sign(next.y - current.position.y);
        if (bottleneck && direction !== 0) {
          const lock = table.corridorLocks.get(`${bottleneck}:${nextTime}`);
          if (lock && lock.owner !== robot.id && lock.direction !== direction) {
            blockedBy.add(lock.owner);
            continue;
          }
        }

        const stateKey = `${nextTime}:${positionKey(next)}`;
        const moveCost = samePosition(current.position, next) ? 1.15 : 1;
        const cost = current.cost + moveCost;
        if (cost >= (bestCost.get(stateKey) ?? Number.POSITIVE_INFINITY)) continue;
        const node: SearchNode = { position: next, time: nextTime, cost, key: stateKey };
        bestCost.set(stateKey, cost);
        states.set(stateKey, node);
        cameFrom.set(stateKey, current.key);
        open.push(node, cost + manhattan(next, target) + nextTime * 0.001);
      }
    }
    return { path: null, blockedBy: [...blockedBy] };
  }

  private reservePath(robot: Robot, route: Position[], table: ReservationTable): void {
    for (let index = 1; index < route.length; index += 1) {
      table.reserveVertex(route[index], index, robot.id);
      table.reserveEdge(route[index - 1], route[index], index, robot.id);
    }
    const terminal = route[route.length - 1] ?? robot.position;
    for (let time = Math.max(2, route.length); time <= PLAN_HORIZON; time += 1) {
      table.reserveVertex(terminal, time, robot.id);
    }

    const groups = new Map<string, number[]>();
    route.forEach((position, time) => {
      const group = this.cellsByKey.get(positionKey(position))?.bottleneck;
      if (group) groups.set(group, [...(groups.get(group) ?? []), time]);
    });
    groups.forEach((times, group) => {
      const first = Math.min(...times);
      const last = Math.max(...times);
      const before = route[Math.max(0, first - 1)];
      const inside = route[first];
      let direction = Math.sign(inside.y - before.y);
      if (direction === 0 && first < route.length - 1) direction = Math.sign(route[first + 1].y - inside.y);
      if (direction === 0) return;
      for (let time = Math.max(1, first - 1); time <= Math.min(PLAN_HORIZON, last + 2); time += 1) {
        table.corridorLocks.set(`${group}:${time}`, { owner: robot.id, direction });
      }
    });
  }

  private isBaseTraversable(cell: MapCell): boolean {
    return cell.type === "floor" || cell.type === "workstation";
  }

  private isBaseTraversableKey(key: string): boolean {
    const cell = this.cellsByKey.get(key);
    return Boolean(cell && this.isBaseTraversable(cell));
  }

  private isBlocked(position: Position): boolean {
    const key = positionKey(position);
    const cell = this.cellsByKey.get(key);
    return !cell || !this.isBaseTraversable(cell) || this.dynamicBlocked.has(key);
  }
}
