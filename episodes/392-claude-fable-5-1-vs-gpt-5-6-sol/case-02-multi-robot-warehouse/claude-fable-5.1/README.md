# Multi-Robot Warehouse Scheduler

A full-stack simulation of a robot fleet moving shelves to workstations inside a
warehouse with narrow, one-cell-wide aisles. The backend owns the world (fixed
time steps, cooperative space-time path planning, collision-free execution,
live replanning) and streams it to a React dashboard over WebSocket with
monotonic sequence numbers.

```
┌──────────────┐  REST commands (jobs / block cell / pause / step / reset)   ┌──────────────┐
│  React + Vite│ ───────────────────────────────────────────────────────────▶│ Node/Express │
│  Canvas map  │ ◀─────────────────────────────────────────────────────────  │ + ws + sim   │
└──────────────┘  WebSocket: snapshot(seq) then events seq+1, seq+2, …       └──────┬───────┘
                                                                              server/data/state.json
```

## Quick start

Requirements: Node.js 18+ (tested on Node 26) and npm.

```bash
npm install          # installs server + client (npm workspaces)
npm run dev          # backend on http://localhost:4022, Vite dev UI on http://localhost:4821
```

Open <http://localhost:4821>. Production build and run:

```bash
npm run build        # tsc (server) + vite build (client) -> server/dist, client/dist
npm start            # serves the built UI and the API on http://localhost:4022
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run selftest` | Headless scenarios: 6/8/40 concurrent jobs, block-ahead replanning, determinism; asserts no shared cell, no swap, no move into walls/shelves/blocked cells |
| `npm run typecheck` | Strict TypeScript check for both packages |
| `PORT=5000 npm start` | Change the port (also update the proxy in `client/vite.config.ts` for dev) |
| `SEED=7 npm start` | Seed for a fresh run (ignored when `server/data/state.json` exists) |
| `FRESH=1 npm start` | Ignore the persisted run and start from scratch |

## Using the dashboard

- **Create a job**: pick a shelf, a workstation and a priority (1–5) in the form,
  or click a shelf / workstation on the map to fill the form. `+3 demo jobs`
  creates three jobs with priorities 5/3/1 through the narrow rack aisles.
  The scheduler assigns the nearest free robot immediately (also while paused).
- **Block / unblock a cell**: click any floor cell. Robots whose route crosses it
  replan in the same command, before their next move; a robot standing on the cell
  drives off it. Shelves, walls, docks and workstations cannot be blocked.
- **Controls**: Pause, Resume, Step (exactly one time step), speed (wall-clock
  only, the result is identical at every speed), and Reset with an optional seed.
  Same seed + same commands at the same ticks ⇒ identical behaviour
  (verified by `npm run selftest`). For an exact reproduction: Pause → Reset →
  `+3 demo jobs` → Resume.
- **Robots panel**: position, status, phase, job, remaining steps, and the
  reason for waiting (`waiting for R3 to clear (12,2)`, `yielding to R5 (higher
  priority)`, `blocked cell ahead, replanning`, `no conflict-free route within
  horizon (congested) — retrying with priority boost`, …). Click a robot (list or
  map) to highlight its planned path.
- **Disconnect / Reconnect** in the header closes the socket while the server keeps
  simulating; on reconnect the client receives a full snapshot and continues
  with events `seq+1, seq+2, …`. Stale events (`seq ≤ last`) are dropped and a
  gap triggers a fresh snapshot. The header shows `tick`, `seq`, the last
  planning time and how often the execution guard had to hold a robot. Reloading
  the page (or restarting the server) continues the same run.

## How scheduling works

**Map** (`server/src/map.ts`): 32×21 grid generated from a seed: 4 workstation
alcoves on the top wall, a wall band pierced by three 1-wide × 3-long bottleneck
corridors, a rack zone with 1-wide aisles, a rack zone with 2-wide aisles, and 8
robot docks. ≥ 24 shelves are guaranteed (43 for seed 42).

**Every tick** (`server/src/sim.ts`, `tickOnce`):

1. **Assign** pending jobs (priority, then age) to the nearest free robot by BFS
   distance to a free access cell of the shelf.
2. **Plan** all robots in priority order into a shared **space-time reservation
   table** (`server/src/pathfinding.ts`): vertex reservations `(cell, t)`,
   edge reservations `(from → to, t)` that forbid swapping, and permanent
   reservations for parked/stuck robots. Each robot runs **space-time A\*** with a
   BFS distance heuristic, waiting allowed; a goal is accepted only if the cell
   stays free for the loading/unloading dwell (or forever when docking). A
   previous plan is reused when it is still conflict-free, so routes stay stable.
   Priority = job priority × 10 + job age + waiting time (capped) — so critical
   jobs go first, but nobody starves. A robot that found no conflict-free route is
   parked as a permanent obstacle for the others *and planned first next tick*,
   which forces the robots around it to yield (this is what breaks head-on
   stand-offs in narrow aisles: the blocked robot plans through, the opposing
   robot backs out to the nearest free cell).
3. **Move** with an execution-time guard that re-checks every intended step
   against the actual positions (no move into an occupied cell, no swap, no move
   into a blocked cell). Cancelled moves are logged with the reason.
4. **Progress** phases: to shelf → loading (2 ticks) → to workstation → unloading
   (2 ticks) → back to dock.
5. **Emit** an event with `seq + 1` and persist the run (debounced, atomic
   write to `server/data/state.json`).

Blocking a cell and creating a job trigger the same assign + plan pass
synchronously, so the response to the command already reflects the new routes.

## Project layout

```
shared/types.ts            types shared by server and client
server/src/map.ts          deterministic warehouse generator (seeded PRNG)
server/src/pathfinding.ts  grid, BFS, reservation table, space-time A*
server/src/sim.ts          simulation engine: assignment, planning, execution guard, events
server/src/persist.ts      JSON persistence
server/src/index.ts        Express REST API + WebSocket stream + fixed-step loop
server/src/selftest.ts     headless scenario tests
client/src/store.ts        WebSocket client (snapshot / seq handling / reconnect)
client/src/components/     MapCanvas (canvas renderer), Panels (jobs, robots, log)
```

## API

| Method | Path | Body |
| --- | --- | --- |
| GET | `/api/state` | — (full snapshot) |
| POST | `/api/jobs` | `{ shelfId, workstationId, priority }` |
| POST | `/api/jobs/demo` | — |
| DELETE | `/api/jobs/:id` | — (cancel) |
| POST | `/api/cells` | `{ x, y, blocked }` |
| POST | `/api/sim/pause` · `/resume` · `/step` | — |
| POST | `/api/sim/reset` | `{ seed? }` |
| POST | `/api/sim/speed` | `{ tickMs }` |
| WS | `/ws` | server → `{type:'snapshot', seq, state}` then `{type:'event', seq, tick, kind, patch}`; client → `{type:'hello', lastSeq}` to request a snapshot |
