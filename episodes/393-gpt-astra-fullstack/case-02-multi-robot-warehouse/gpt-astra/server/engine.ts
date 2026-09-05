import { cellKey, manhattan, sameCell, type Cell, type Job, type Priority, type Robot, type SimulationState } from '../shared/types.js';
import { createWarehouse } from './warehouse.js';
import { obstacleKeys, planMission } from './planner.js';

const COLORS = ['#df703e', '#548891', '#8c77ad', '#688a59', '#c7993c', '#6a88ba', '#ba7689', '#637a76'];
export function initialState(seq = 0): SimulationState {
  const map = createWarehouse();
  return { version: 1, seq, tick: 0, paused: true, speed: 1, map,
    robots: map.homes.map((home, i) => ({ id: `R-${String(i + 1).padStart(2, '0')}`, color: COLORS[i],
      position: { ...home }, home: { ...home }, route: [], jobId: null, phase: 'pickup', status: 'idle',
      reason: 'At charging bay · ready for a job', distance: 0, completed: 0, waitTicks: 0, replans: 0 })),
    jobs: [], blocked: [], events: [], nextJobId: 1, nextEventId: 1,
    metrics: { completed: 0, moves: 0, waits: 0, replans: 0, conflictsAvoided: 0 } };
}

export class Simulation {
  state: SimulationState;
  onChange: (state: SimulationState) => void = () => {};
  constructor(saved?: SimulationState, demo = true) {
    this.state = saved ?? initialState();
    if (!saved) {
      this.log('info', 'Warehouse initialized · deterministic seed 2408');
      if (demo) this.addDemoJobs(false);
    }
  }
  log(type: 'info' | 'success' | 'warning' | 'route', message: string, robotId?: string) {
    this.state.events.unshift({ id: this.state.nextEventId++, tick: this.state.tick, type, message, ...(robotId ? { robotId } : {}) });
    this.state.events = this.state.events.slice(0, 160);
  }
  commit() { this.state.seq++; this.onChange(this.state); }
  priority(job: Job) {
    return ({ high: 160, normal: 80, low: 0 }[job.priority]) + this.state.tick - job.createdTick;
  }
  addJob(shelfId: string, stationId: string, priority: Priority, commit = true) {
    if (!this.state.map.shelves.some(s => s.id === shelfId)) throw new Error('Select a valid shelf.');
    if (!this.state.map.stations.some(s => s.id === stationId)) throw new Error('Select a valid workstation.');
    if (!['high', 'normal', 'low'].includes(priority)) throw new Error('Select a valid priority.');
    if (this.state.jobs.filter(j => !['completed', 'cancelled'].includes(j.status)).length >= 100) throw new Error('The active queue is full (100 jobs).');
    const job: Job = { id: `JOB-${String(this.state.nextJobId++).padStart(3, '0')}`, shelfId, stationId, priority,
      status: 'queued', robotId: null, createdTick: this.state.tick, startedTick: null, completedTick: null };
    this.state.jobs.unshift(job);
    this.log('info', `${job.id} created · ${shelfId} → ${stationId} · ${priority} priority`);
    this.schedule(); if (commit) this.commit(); return job;
  }
  addDemoJobs(commit = true) {
    for (const [shelf, station, priority] of [
      ['S14', 'WS-01', 'high'], ['S31', 'WS-03', 'normal'], ['S58', 'WS-02', 'high'], ['S84', 'WS-04', 'normal'],
    ] as const) this.addJob(shelf, station, priority, false);
    if (commit) this.commit();
  }
  setPlan(robot: Robot, route: NonNullable<ReturnType<typeof planMission>>, note: string) {
    robot.route = route;
    const waits = route.reduce((sum, p, i) => sum + (sameCell(p, i ? route[i - 1] : robot.position) && !p.action ? 1 : 0), 0);
    if (waits) this.state.metrics.conflictsAvoided += waits;
    this.log('route', `${robot.id} ${note} · ${route.length} ticks${waits ? ` · ${waits} reserved waits` : ''}`, robot.id);
    this.updateStatus(robot);
  }
  updateStatus(robot: Robot) {
    const next = robot.route[0];
    if (!next) {
      if (!robot.jobId && sameCell(robot.position, robot.home)) {
        robot.status = 'idle'; robot.reason = 'At charging bay · ready for a job';
      } else { robot.status = 'waiting'; }
    } else if (sameCell(next, robot.position)) {
      robot.status = 'waiting'; robot.reason = next.action === 'pickup' ? 'Loading at shelf pickup point' :
        next.action === 'delivery' ? 'Unloading at workstation' : 'Yielding to a reserved cell or opposing route';
    } else {
      if (robot.jobId && robot.phase !== 'return' && !robot.route.some(p => p.action === 'delivery')) {
        robot.status = 'returning'; robot.reason = 'Retreating to bay · waiting for a safe task route'; return;
      }
      robot.status = robot.phase === 'return' ? 'returning' : 'moving';
      robot.reason = robot.phase === 'pickup' ? 'En route to shelf pickup' : robot.phase === 'delivery' ? 'Carrying load to workstation' : 'Returning to charging bay';
    }
  }
  schedule() {
    const queued = this.state.jobs.filter(j => j.status === 'queued').sort((a, b) =>
      this.priority(b) - this.priority(a) || a.createdTick - b.createdTick || a.id.localeCompare(b.id));
    for (const job of queued) {
      const shelf = this.state.map.shelves.find(s => s.id === job.shelfId)!;
      const available = this.state.robots.filter(r => !r.jobId && !r.route.length)
        .sort((a, b) => manhattan(a.position, shelf.pickup) - manhattan(b.position, shelf.pickup) || a.id.localeCompare(b.id));
      for (const robot of available) {
        robot.jobId = job.id; robot.phase = 'pickup';
        const route = planMission(this.state, robot);
        if (!route) { robot.jobId = null; continue; }
        job.status = 'assigned'; job.robotId = robot.id; job.startedTick = this.state.tick;
        this.log('info', `${job.id} assigned to ${robot.id} · complete trip reserved`, robot.id);
        this.setPlan(robot, route, 'route reserved'); break;
      }
    }
  }
  replanAll() {
    for (const robot of this.state.robots) {
      robot.route = [];
      if (robot.jobId || !sameCell(robot.position, robot.home)) {
        robot.reason = 'Replanning after warehouse map changed'; robot.replans++; this.state.metrics.replans++;
      }
    }
    this.recoverRoutes(true);
  }
  recoverRoutes(log = false) {
    const pending = this.state.robots.filter(r => !r.route.length && (r.jobId || !sameCell(r.position, r.home)))
      .sort((a, b) => {
        const ja = this.state.jobs.find(j => j.id === a.jobId); const jb = this.state.jobs.find(j => j.id === b.jobId);
        return (jb ? this.priority(jb) : 0) - (ja ? this.priority(ja) : 0) || b.waitTicks - a.waitTicks || a.id.localeCompare(b.id);
      });
    // Subsequent passes can use cells released by earlier successful reservations.
    for (let pass = 0; pass < 3; pass++) {
      let progress = false;
      for (const robot of pending) {
        if (robot.route.length) continue;
        const route = planMission(this.state, robot);
        if (route?.length) { this.setPlan(robot, route, 'replanned'); progress = true; }
      }
      if (!progress) break;
    }
    // If the task is unreachable, retreat out of the aisle where possible. Keep the
    // job and load attached; a park action only releases a completed mission.
    for (const robot of pending) {
      if (robot.route.length) continue;
      if (!sameCell(robot.position, robot.home)) {
        const retreat = planMission(this.state, robot, true);
        if (retreat?.length) {
          this.setPlan(robot, retreat, 'yielding back to bay');
          robot.reason = 'Retreating to bay while a safe task route is unavailable'; continue;
        }
      }
      robot.status = 'waiting'; robot.reason = 'No complete safe route · waiting for an obstacle or reservation to clear';
      if (log) this.log('warning', `${robot.id} holding position · no safe route available`, robot.id);
    }
  }
  setBlocked(cell: Cell, blocked: boolean) {
    const { map } = this.state;
    if (!Number.isInteger(cell.x) || !Number.isInteger(cell.y) || cell.x < 0 || cell.y < 0 || cell.x >= map.width || cell.y >= map.height ||
      [...map.walls, ...map.shelves].some(c => sameCell(c, cell))) throw new Error('Only traversable cells can be changed.');
    const exists = this.state.blocked.some(c => sameCell(c, cell));
    if (blocked === exists) return;
    this.state.blocked = blocked ? [...this.state.blocked, cell] : this.state.blocked.filter(c => !sameCell(c, cell));
    this.log(blocked ? 'warning' : 'success', `Cell [${cell.x}, ${cell.y}] ${blocked ? 'blocked' : 'reopened'} · all routes recalculated`);
    this.replanAll(); this.schedule(); this.commit();
  }
  cancelJob(id: string) {
    const job = this.state.jobs.find(j => j.id === id);
    if (!job || job.status !== 'queued') throw new Error('Only queued jobs can be cancelled.');
    job.status = 'cancelled'; this.log('info', `${job.id} cancelled`); this.commit();
  }
  control(action: string, value?: number) {
    if (action === 'reset') {
      this.state = initialState(this.state.seq);
      this.log('info', 'Simulation reset · same seed 2408 · ready to reproduce'); this.addDemoJobs(false);
    } else if (action === 'pause') { this.state.paused = true; this.log('info', 'Simulation paused'); }
    else if (action === 'resume') { this.state.paused = false; this.log('info', 'Simulation resumed'); }
    else if (action === 'step') {
      if (!this.state.paused) throw new Error('Pause the simulation before stepping.');
      this.step(); return;
    } else if (action === 'speed') {
      if (![0.5, 1, 2, 4].includes(value!)) throw new Error('Invalid simulation speed.'); this.state.speed = value!;
    } else throw new Error('Unknown simulation command.');
    this.commit();
  }
  step() {
    this.recoverRoutes(); this.schedule();
    const previous = this.state.robots.map(r => ({ ...r.position }));
    const next = this.state.robots.map(r => r.route[0] ?? r.position);
    const obstacles = obstacleKeys(this.state);
    for (let i = 0; i < next.length; i++) {
      if (!sameCell(previous[i], next[i]) && obstacles.has(cellKey(next[i]))) throw new Error('Invariant: movement into obstacle');
      if (manhattan(previous[i], next[i]) > 1) throw new Error('Invariant: non-adjacent movement');
      for (let j = i + 1; j < next.length; j++) {
        if (sameCell(next[i], next[j])) throw new Error('Invariant: vertex conflict');
        if (sameCell(next[i], previous[j]) && sameCell(next[j], previous[i])) throw new Error('Invariant: edge swap');
      }
    }
    this.state.tick++;
    this.state.robots.forEach((robot, i) => {
      const step = robot.route.shift();
      if (step) {
        if (!sameCell(robot.position, step)) { robot.distance++; this.state.metrics.moves++; robot.waitTicks = 0; }
        else if (!step.action) { robot.waitTicks++; this.state.metrics.waits++; }
        robot.position = { x: step.x, y: step.y };
        const job = this.state.jobs.find(j => j.id === robot.jobId);
        if (step.action === 'pickup' && job) {
          job.status = 'in_transit'; robot.phase = 'delivery';
          this.log('success', `${robot.id} picked up ${job.shelfId} · ${job.id}`, robot.id);
        }
        if (step.action === 'delivery' && job) {
          job.status = 'completed'; job.completedTick = this.state.tick; robot.phase = 'return';
          robot.completed++; this.state.metrics.completed++;
          this.log('success', `${job.id} delivered to ${job.stationId} by ${robot.id}`, robot.id);
        }
        if (step.action === 'park' && (!job || job.status === 'completed')) {
          robot.jobId = null; robot.phase = 'pickup';
        }
      } else if (robot.jobId) { robot.waitTicks++; this.state.metrics.waits++; }
      // No frontend interpolation may change these authoritative coordinates.
      if (!sameCell(robot.position, next[i])) throw new Error('Invariant: step application mismatch');
      this.updateStatus(robot);
    });
    this.schedule(); this.commit();
  }
}
