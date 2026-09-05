export type Cell = { x: number; y: number };
export type Priority = 'high' | 'normal' | 'low';
export type Phase = 'pickup' | 'delivery' | 'return';
export type Shelf = Cell & { id: string; pickup: Cell; zone: string };
export type Station = Cell & { id: string; name: string };
export type Warehouse = { width: number; height: number; shelves: Shelf[]; stations: Station[]; walls: Cell[]; homes: Cell[]; seed: number };
export type RouteStep = Cell & { action?: 'pickup' | 'delivery' | 'park' };
export type Robot = {
  id: string; color: string; position: Cell; home: Cell; route: RouteStep[];
  jobId: string | null; phase: Phase; status: 'idle' | 'moving' | 'waiting' | 'returning';
  reason: string; distance: number; completed: number; waitTicks: number; replans: number;
};
export type Job = {
  id: string; shelfId: string; stationId: string; priority: Priority;
  status: 'queued' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
  robotId: string | null; createdTick: number; startedTick: number | null; completedTick: number | null;
};
export type LogEvent = { id: number; tick: number; type: 'info' | 'success' | 'warning' | 'route'; message: string; robotId?: string };
export type SimulationState = {
  version: 1; seq: number; tick: number; paused: boolean; speed: number; map: Warehouse;
  robots: Robot[]; jobs: Job[]; blocked: Cell[]; events: LogEvent[]; nextJobId: number; nextEventId: number;
  metrics: { completed: number; moves: number; waits: number; replans: number; conflictsAvoided: number };
};
export type StreamEnvelope = { type: 'snapshot' | 'state'; seq: number; state: SimulationState };
export const cellKey = (c: Cell) => `${c.x},${c.y}`;
export const sameCell = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;
export const manhattan = (a: Cell, b: Cell) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
