import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Simulation } from '../server/engine';
import { StateStore } from '../server/persistence';
import { cellKey, manhattan, sameCell, type SimulationState } from '../shared/types';
import { acceptEnvelope } from '../src/useSimulation';

function verifyTransition(before: SimulationState, after: SimulationState) {
  const occupied = new Set<string>();
  const blocked = new Set([...after.map.walls, ...after.map.shelves, ...after.blocked].map(cellKey));
  after.robots.forEach((r, i) => {
    assert.ok(!occupied.has(cellKey(r.position)), `vertex collision at tick ${after.tick}`);
    occupied.add(cellKey(r.position));
    assert.ok(manhattan(r.position, before.robots[i].position) <= 1);
    if (!sameCell(r.position, before.robots[i].position)) assert.ok(!blocked.has(cellKey(r.position)));
    for (let j = i + 1; j < after.robots.length; j++) {
      assert.ok(!(sameCell(r.position, before.robots[j].position) && sameCell(after.robots[j].position, before.robots[i].position)), 'edge swap');
    }
  });
  assert.ok(after.seq > before.seq);
}
function run(sim: Simulation, count: number) {
  for (let i = 0; i < count; i++) { const before = structuredClone(sim.state); sim.step(); verifyTransition(before, sim.state); }
}
function verifyReservations(sim: Simulation) {
  const max = Math.max(...sim.state.robots.map(r => r.route.length));
  let prev = sim.state.robots.map(r => r.position);
  for (let t = 0; t < max; t++) {
    const next = sim.state.robots.map(r => r.route[Math.min(t, r.route.length - 1)] ?? r.position);
    assert.equal(new Set(next.map(cellKey)).size, 8, `future vertex conflict at ${t}`);
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) assert.ok(!(sameCell(next[i], prev[j]) && sameCell(next[j], prev[i])), 'future swap');
    prev = next;
  }
}
test('deterministic map has 8 robots, 96 shelves, 4 stations and real narrow aisles', () => {
  const s = new Simulation(undefined, false).state;
  assert.equal(s.robots.length, 8); assert.equal(s.map.shelves.length, 96); assert.equal(s.map.stations.length, 4);
  assert.ok(s.map.shelves.some(c => c.x === 6 && c.y === 5));
  assert.ok(s.map.shelves.some(c => c.x === 8 && c.y === 5));
  assert.ok(!s.map.shelves.some(c => c.x === 7 && c.y === 5));
});
test('12 simultaneous transports complete without vertex collisions, swaps or starvation', () => {
  const sim = new Simulation();
  for (let i = 0; i < 8; i++) sim.addJob(`S${String(i * 11 + 1).padStart(2, '0')}`, `WS-0${i % 4 + 1}`, i % 3 === 0 ? 'high' : 'normal');
  verifyReservations(sim);
  let concurrentMoves = 0;
  for (let i = 0; i < 450; i++) {
    const before = structuredClone(sim.state); sim.step(); verifyTransition(before, sim.state);
    concurrentMoves = Math.max(concurrentMoves, sim.state.robots.filter((r, n) => !sameCell(r.position, before.robots[n].position)).length);
  }
  assert.equal(sim.state.metrics.completed, 12); assert.ok(concurrentMoves >= 3); assert.ok(sim.state.robots.every(r => r.status === 'idle'));
});
test('block directly ahead: immediately invalidate paths, safely replan and complete', () => {
  const sim = new Simulation(); run(sim, 12);
  const moving = sim.state.robots.find(r => r.route[0] && !sameCell(r.position, r.route[0]) && !sim.state.robots.some(o => sameCell(o.position, r.route[0])))!;
  assert.ok(moving); const blocked = { ...moving.route[0] };
  const tick = sim.state.tick; const seq = sim.state.seq;
  sim.setBlocked(blocked, true);
  assert.equal(sim.state.tick, tick); assert.ok(sim.state.seq > seq);
  for (const r of sim.state.robots) assert.ok(r.route.every(c => !sameCell(c, blocked)));
  verifyReservations(sim); run(sim, 220);
  assert.equal(sim.state.metrics.completed, 4);
  sim.setBlocked(blocked, false); assert.equal(sim.state.blocked.length, 0);
});
test('closing an occupied floor cell permits evacuation but prohibits entry', () => {
  const sim = new Simulation(); run(sim, 7);
  const r = sim.state.robots.find(r => r.route.length)!;
  const closed = { ...r.position }; sim.setBlocked(closed, true);
  for (const robot of sim.state.robots) if (robot.id !== r.id) assert.ok(robot.route.every(c => !sameCell(c, closed)));
  run(sim, 220); assert.equal(sim.state.metrics.completed, 4);
});
test('blocked destination waits with an explanation and recovers when reopened', () => {
  const sim = new Simulation(); sim.setBlocked(sim.state.map.stations[0], true);
  run(sim, 30);
  assert.ok(sim.state.robots.some(r => r.reason.includes('No complete safe route')));
  sim.setBlocked(sim.state.map.stations[0], false); run(sim, 220);
  assert.equal(sim.state.metrics.completed, 4);
});
test('pause, single step, reset and seed replay preserve determinism and sequence', () => {
  const a = new Simulation(); const b = new Simulation();
  run(a, 40); run(b, 40); assert.deepEqual(a.state, b.state);
  a.control('resume'); assert.throws(() => a.control('step'), /Pause/); a.control('pause');
  const tick = a.state.tick; a.control('step'); assert.equal(a.state.tick, tick + 1);
  const seq = a.state.seq; a.control('reset'); assert.ok(a.state.seq > seq); assert.equal(a.state.tick, 0);
  assert.deepEqual(a.state.robots, new Simulation().state.robots);
});
test('queue aging eventually outranks newly arrived high-priority work', () => {
  const sim = new Simulation(undefined, false);
  sim.addJob('S01', 'WS-01', 'low'); const old = sim.state.jobs[0];
  sim.state.tick = 200; sim.addJob('S02', 'WS-02', 'high');
  assert.ok(sim.priority(old) > sim.priority(sim.state.jobs[0]));
});
test('durable snapshot resumes the identical run including future reservations', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'relay-test-'));
  try {
    const store = new StateStore(path.join(dir, 'state.json')); const a = new Simulation(); run(a, 15);
    store.save(a.state); const b = new Simulation(store.load()); assert.deepEqual(a.state, b.state);
    run(a, 10); run(b, 10); assert.deepEqual(a.state, b.state);
  } finally { rmSync(dir, { recursive: true }); }
});
test('client sequence guard rejects stale, duplicate and inconsistent envelopes', () => {
  const state = new Simulation().state; state.seq = 20;
  assert.equal(acceptEnvelope(19, { type: 'snapshot', seq: 20, state }), true);
  assert.equal(acceptEnvelope(20, { type: 'state', seq: 20, state }), false);
  assert.equal(acceptEnvelope(21, { type: 'snapshot', seq: 20, state }), false);
  assert.equal(acceptEnvelope(19, { type: 'state', seq: 21, state }), false);
});

test('opposing missions cross a single connector aisle and return without head-on deadlock', () => {
  const sim = new Simulation(undefined, false); const s = sim.state;
  const homes = [{ x: 3, y: 2 }, { x: 5, y: 6 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 7, y: 1 }, { x: 1, y: 7 }, { x: 7, y: 7 }, { x: 7, y: 6 }];
  s.map = { width: 9, height: 9, seed: 2408, homes,
    shelves: [{ id: 'S01', x: 2, y: 1, pickup: { x: 2, y: 2 }, zone: 'A' }, { id: 'S02', x: 6, y: 7, pickup: { x: 6, y: 6 }, zone: 'B' }],
    stations: [{ id: 'WS-01', x: 4, y: 1, name: 'North' }, { id: 'WS-02', x: 4, y: 7, name: 'South' }],
    walls: Array.from({ length: 81 }, (_, i) => ({ x: i % 9, y: Math.floor(i / 9) })).filter(c => c.x === 0 || c.x === 8 || c.y === 0 || c.y === 8 || (c.y >= 3 && c.y <= 5 && c.x !== 4)),
  };
  s.robots.forEach((r, i) => { r.home = homes[i]; r.position = { ...homes[i] }; });
  sim.addJob('S01', 'WS-02', 'high'); sim.addJob('S02', 'WS-01', 'high');
  assert.equal(s.jobs.filter(j => j.status === 'assigned').length, 2);
  verifyReservations(sim); run(sim, 180);
  assert.equal(s.metrics.completed, 2); assert.ok(s.robots.every(r => r.status === 'idle'));
  assert.ok(s.metrics.conflictsAvoided > 0, 'opposing traffic must use reserved waits');
});
