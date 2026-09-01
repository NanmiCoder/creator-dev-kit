// Shared types between server and client.

export interface Point {
  x: number;
  y: number;
}

export interface Shelf {
  id: string;
  x: number;
  y: number;
}

export interface Workstation {
  id: string;
  x: number;
  y: number;
}

/** Cell chars in `cells`: '#' wall, '.' floor, 'S' shelf, 'W' workstation, 'D' robot dock */
export interface WarehouseMap {
  width: number;
  height: number;
  seed: number;
  cells: string;
  shelves: Shelf[];
  workstations: Workstation[];
  docks: Point[];
  narrowAisles: Point[];
}

export type JobStatus = 'pending' | 'assigned' | 'picking' | 'delivering' | 'done' | 'cancelled';

export interface Job {
  id: string;
  shelfId: string;
  workstationId: string;
  priority: number; // 1 (low) .. 5 (critical)
  status: JobStatus;
  robotId: string | null;
  createdTick: number;
  assignedTick: number | null;
  completedTick: number | null;
  note: string | null;
}

export type RobotStatus = 'idle' | 'moving' | 'waiting' | 'loading' | 'unloading';
export type RobotPhase = 'idle' | 'toShelf' | 'toWorkstation' | 'returning';

export interface Robot {
  id: string;
  index: number;
  x: number;
  y: number;
  dock: Point;
  color: string;
  status: RobotStatus;
  phase: RobotPhase;
  jobId: string | null;
  carrying: string | null;
  /** Remaining planned path. path[0] is the current cell, path[i] the cell at tick+i. */
  path: Point[];
  goal: Point | null;
  waitReason: string | null;
  waitTicks: number;
  dwellRemaining: number;
  planFailed: boolean;
  stepsMoved: number;
  priority: number;
}

export interface LogEntry {
  id: number;
  tick: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  robotId?: string;
  jobId?: string;
}

export interface SimState {
  seed: number;
  tick: number;
  seq: number;
  running: boolean;
  tickMs: number;
  map: WarehouseMap;
  blocked: Point[];
  robots: Robot[];
  jobs: Job[];
  log: LogEntry[];
  stats: {
    jobsCompleted: number;
    conflictsResolved: number;
    replans: number;
    planTimeMs: number;
  };
}

export type StatePatch = Partial<Omit<SimState, 'log' | 'map'>> & {
  map?: WarehouseMap;
  logAppend?: LogEntry[];
  logReset?: boolean;
};

export type ServerMessage =
  | { type: 'snapshot'; seq: number; state: SimState }
  | { type: 'event'; seq: number; tick: number; kind: string; patch: StatePatch };

export type ClientMessage = { type: 'hello'; lastSeq: number };
