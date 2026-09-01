/**
 * Headless self-test: runs deterministic scenarios and asserts the scheduling invariants.
 *   npm run selftest -w server
 */
import { Simulation } from './sim.js';
import { mulberry32 } from './rng.js';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    failures++;
    console.error('  ✗ ' + msg);
  }
}

interface Trace {
  positions: string[];
  conflicts: number;
}

function runChecked(sim: Simulation, ticks: number, onTick?: (t: number) => void): Trace {
  const trace: Trace = { positions: [], conflicts: 0 };
  for (let t = 0; t < ticks; t++) {
    const before = sim.robots.map((r) => `${r.x},${r.y}`);
    const blockedBefore = new Set(sim.snapshot().blocked.map((b) => `${b.x},${b.y}`));
    sim.tickOnce();
    const after = sim.robots.map((r) => `${r.x},${r.y}`);
    // (1) never two robots on one cell
    assert(new Set(after).size === after.length, `tick ${sim.tick}: two robots share a cell: ${after.join(' ')}`);
    for (let i = 0; i < after.length; i++) {
      // (2) never swap cells
      for (let j = i + 1; j < after.length; j++) {
        assert(!(before[i] === after[j] && before[j] === after[i] && before[i] !== before[j]), `tick ${sim.tick}: ${sim.robots[i].id} and ${sim.robots[j].id} swapped cells`);
      }
      // (3) moves only into traversable, unblocked cells; (4) one cell per tick
      if (before[i] !== after[i]) {
        const [bx, by] = before[i].split(',').map(Number);
        const r = sim.robots[i];
        assert(Math.abs(bx - r.x) + Math.abs(by - r.y) === 1, `tick ${sim.tick}: ${r.id} moved more than one cell`);
        const ch = sim.map.cells[r.y * sim.map.width + r.x];
        assert(ch !== '#' && ch !== 'S', `tick ${sim.tick}: ${r.id} entered a wall/shelf at ${after[i]}`);
        assert(!blockedBefore.has(after[i]), `tick ${sim.tick}: ${r.id} entered blocked cell ${after[i]}`);
      }
    }
    // (5) planned paths never cross walls/shelves/blocked cells
    for (const r of sim.robots) {
      for (let k = 1; k < r.path.length; k++) {
        const p = r.path[k];
        const ch = sim.map.cells[p.y * sim.map.width + p.x];
        assert(ch !== '#' && ch !== 'S', `tick ${sim.tick}: ${r.id} plan crosses wall/shelf at (${p.x},${p.y})`);
        assert(!sim.snapshot().blocked.some((b) => b.x === p.x && b.y === p.y), `tick ${sim.tick}: ${r.id} plan crosses blocked cell (${p.x},${p.y})`);
      }
    }
    trace.positions.push(after.join(' '));
    onTick?.(t);
  }
  trace.conflicts = sim.stats.conflictsResolved;
  return trace;
}

function scenarioBasic(seed: number): Trace {
  const sim = new Simulation(seed, null);
  sim.running = true;
  sim.createDemoJobs();
  const shelves = sim.map.shelves;
  sim.createJob(shelves[shelves.length - 1].id, 'W2', 4);
  sim.createJob(shelves[Math.floor(shelves.length / 3)].id, 'W1', 2);
  sim.createJob(shelves[2].id, 'W4', 5);
  const trace = runChecked(sim, 400);
  const done = sim.jobs.filter((j) => j.status === 'done');
  console.log(`  jobs done ${done.length}/${sim.jobs.length} at ticks [${done.map((j) => j.completedTick).join(', ')}], execution guards ${sim.stats.conflictsResolved}, replans ${sim.stats.replans}`);
  assert(done.length === sim.jobs.length, 'all jobs should complete within 400 ticks');
  return trace;
}

function scenarioBlockAhead(seed: number): void {
  const sim = new Simulation(seed, null);
  sim.createDemoJobs();
  runChecked(sim, 6);
  const mover = sim.robots.find((r) => r.status === 'moving' && r.path.length >= 4 && sim.map.cells[r.path[1].y * sim.map.width + r.path[1].x] === '.');
  assert(!!mover, 'a moving robot with a plan exists after 6 ticks');
  if (!mover) return;
  const ahead = mover.path[1];
  const oldLen = mover.path.length;
  sim.setBlocked(ahead.x, ahead.y, true);
  assert(!mover.path.some((p, k) => k > 0 && p.x === ahead.x && p.y === ahead.y), `${mover.id} replanned immediately around (${ahead.x},${ahead.y})`);
  console.log(`  blocked (${ahead.x},${ahead.y}) ahead of ${mover.id}: path ${oldLen - 1} → ${mover.path.length - 1} steps, status ${mover.status}${mover.waitReason ? ` (${mover.waitReason})` : ''}`);
  runChecked(sim, 3);
  assert(!(mover.x === ahead.x && mover.y === ahead.y), `${mover.id} never entered the blocked cell`);
  sim.setBlocked(ahead.x, ahead.y, false);
  runChecked(sim, 300);
  assert(sim.jobs.every((j) => j.status === 'done'), 'jobs complete after unblocking');
}

function scenarioNarrowAisleHeadOn(seed: number): void {
  // Two robots forced through the same 1-wide corridor in opposite directions:
  // one delivers to a workstation (goes up through a corridor), one is sent back down afterwards
  // while another comes up. We approximate by many jobs targeting the same workstation.
  const sim = new Simulation(seed, null);
  const shelves = sim.map.shelves.filter((s) => s.y >= 9 && s.y <= 11);
  for (let i = 0; i < 8; i++) sim.createJob(shelves[(i * 5) % shelves.length].id, `W${(i % 4) + 1}`, (i % 5) + 1);
  const waited = new Set<string>();
  runChecked(sim, 700, () => {
    for (const r of sim.robots) if (r.status === 'waiting' && r.waitReason) waited.add(`${r.id}: ${r.waitReason}`);
  });
  const done = sim.jobs.filter((j) => j.status === 'done').length;
  console.log(`  8 concurrent jobs through bottlenecks: ${done}/8 done, guards ${sim.stats.conflictsResolved}, max wait ${Math.max(...sim.robots.map((r) => r.waitTicks))}`);
  console.log(`  sample wait reasons: ${[...waited].slice(0, 4).join(' | ')}`);
  assert(done === 8, 'all 8 jobs complete (no permanent deadlock)');
}

function scenarioStress(seed: number): void {
  const sim = new Simulation(seed, null);
  const rng = mulberry32(seed * 7 + 1);
  let created = 0;
  const trace = runChecked(sim, 2500, (t) => {
    if (t % 25 === 0 && created < 40) {
      const s = sim.map.shelves[Math.floor(rng() * sim.map.shelves.length)];
      sim.createJob(s.id, `W${Math.floor(rng() * 4) + 1}`, Math.floor(rng() * 5) + 1);
      created++;
    }
  });
  const done = sim.jobs.filter((j) => j.status === 'done').length;
  const maxWait = Math.max(...sim.robots.map((r) => r.waitTicks));
  console.log(`  stress: ${done}/${created} jobs done in 2500 ticks, guards ${trace.conflicts}, replans ${sim.stats.replans}, current max wait ${maxWait}`);
  assert(done === created, 'all stress jobs complete');
}

console.log('1. basic: 6 simultaneous jobs (seed 42)');
const a = scenarioBasic(42);
console.log('2. determinism: same seed + same commands → identical trajectories');
const b = scenarioBasic(42);
assert(a.positions.join('\n') === b.positions.join('\n'), 'traces identical across runs');
console.log('3. block a cell directly ahead of an active robot');
scenarioBlockAhead(42);
console.log('4. narrow aisle head-on pressure');
scenarioNarrowAisleHeadOn(42);
console.log('5. stress (40 jobs, seed 7)');
scenarioStress(7);
console.log('6. other seeds');
for (const seed of [1, 2, 3]) scenarioBasic(seed);

if (failures) {
  console.error(`\n${failures} assertion(s) failed`);
  process.exit(1);
}
console.log('\nAll invariants hold ✔');
