export type Position = { x: number; y: number };
export type CellType = "floor" | "wall" | "shelf" | "workstation";
export type Priority = "low" | "normal" | "high";

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
  status: "idle" | "moving" | "waiting";
  phase: "idle" | "to_shelf" | "to_station";
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
  status: "queued" | "active" | "completed";
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
  map: { width: number; height: number; cells: MapCell[]; blocked: string[] };
  robots: Robot[];
  jobs: Job[];
  eventLog: LogEntry[];
  metrics: { moving: number; waiting: number; queued: number; completed: number; reservations: number };
};
