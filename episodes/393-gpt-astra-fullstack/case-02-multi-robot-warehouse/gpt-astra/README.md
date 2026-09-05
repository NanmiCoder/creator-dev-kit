# Relay — warehouse control

A runnable full-stack multi-robot warehouse simulator. React renders server-confirmed positions; a Node/TypeScript backend owns scheduling, pathfinding, fixed simulation ticks, persistence, and the event stream.

中文运行入口和归档说明见[本期 README](../../README.md)。

## Start

Requires **Node.js 22.12+** and npm.

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. The app starts paused, with eight robots, 96 shelf cells, four workstations, and four assigned example jobs. Click **Run simulation**, or **Step** to inspect one transition at a time.

```sh
npm test          # scheduler, collision, dynamic obstacle, persistence and sequence tests
npm run build    # TypeScript check + production client and server bundles
npm start        # serves the production app at http://localhost:3000
```

`npm start` uses the cross-platform `--production` flag; `NODE_ENV=production` remains supported.

Set `PORT` to change the port. Set `DATA_FILE` to use another state file, for example:

```sh
PORT=3001 DATA_FILE=data/experiment.json npm run dev
```

The example above uses macOS/Linux shell syntax. In Windows PowerShell:

```powershell
$env:PORT="3001"
$env:DATA_FILE="data/experiment.json"
npm run dev
```

## Try the acceptance scenario

1. Click **Create job** three times. Choose a shelf, destination workstation, and priority. Shift-clicking a shelf on the map also opens the job form. Assignment is automatic when a complete safe trip is available.
2. Run the simulation. Right-click a robot (or select its fleet card) to isolate its planned route; the fleet cards show its position, job, status, and waiting reason. The single-width aisles lie between paired shelf banks.
3. **Left-click any floor cell** directly ahead of a moving robot. Editing is always enabled; no mode switch is needed. The backend changes the map and replans synchronously before another simulation tick can execute. Click the cell again to reopen it. Occupied cells can also be closed: the occupant may evacuate or wait, while new entry is forbidden.
4. Use the lower-right **Fullscreen map** button to expand the map; press **Esc** or the exit button to leave. Native fullscreen is used where permitted, with a full-viewport fallback for embedded browsers. The separate crosshair button resets zoom. Both modes keep the map clickable, using SVG coordinates that account for zoom, layout and letterboxing. Pause and use **Step** for exact movement inspection. The speed selector changes wall-clock playback only; every transition is still one fixed simulation tick.
5. Reload, close and reopen the page, or temporarily disconnect its network. The server continues the same run. Reconnection starts with a complete snapshot; the footer shows its sequence number. Commands are disabled while disconnected.
6. **Reset** restores the same seed, robots, map and four starter jobs. It clears the run after a confirmation and preserves the monotonic stream sequence.

## Scheduling and safety

- **Deterministic warehouse:** seed 2408 describes a fixed 27 × 19 layout. The six paired shelf banks create one-cell-wide aisles. Shelf pickup points are adjacent traversable cells, never the shelf itself.
- **Time-expanded A\*:** backend states are `(x, y, time)`. Four neighboring moves and a wait action are searched with a reverse spatial BFS heuristic. Pickup and delivery each reserve a service tick.
- **Vertex and edge reservations:** the planner rejects occupied future cells and reverse edges, so two robots cannot share a cell or swap positions. Unplanned robots reserve their current position; accepted routes reserve their final position through the planning horizon.
- **Complete mission admission:** a job only starts after pickup, delivery, and return to the robot's own off-aisle bay have all been reserved. Routes are committed together. Two opposite trips cannot both enter an aisle without a scheduled exit; one waits or detours. Multiple robots still move during the same tick.
- **Dynamic replanning:** map edits discard future routes at the current physical positions. Robots reserve complete replacement missions in priority order. Multiple passes reuse cells released by new plans; when a mission is unavailable, the robot attempts a reserved retreat to its bay with its job/load retained. Each tick retries waiting work. Impossible routes remain visibly waiting until the topology permits progress.
- **Fairness:** queued jobs use `base priority + waiting ticks`, with bases high 160, normal 80, low 0 and deterministic tie breaks. Aging allows old jobs to outrank newly arriving work. Already accepted routes are not preempted by ordinary job arrivals.
- **Runtime invariant guard:** before applying any tick, the engine independently validates adjacency, obstacles, vertex exclusivity, and reverse-edge conflicts. A failure pauses the simulation and writes a safety event.

This is a conservative prioritized planner with a **320-tick horizon**, not a globally optimal or complete multi-agent solver. It may wait even where a more expensive joint search could find a route. Arbitrary blockages that disconnect destinations or robot bays cannot guarantee job completion; the interface exposes that condition. In the connected warehouse, accepted full trips have bounded completion and cannot remain in a permanent reservation-induced head-on deadlock. The robot bays must remain reachable to admit new trips.

## State, stream, and persistence

- `server/engine.ts` is the only authority for positions, jobs, routes and time.
- Every mutation increments `seq`, atomically replaces `data/simulation.json`, then broadcasts the committed state. File contents are flushed before the rename. The saved file contains the map changes, jobs, current tick, speed, pause state, event log, robot phases and all remaining reservations.
- `/api/events` uses SSE. Both `snapshot` and `state` events contain the full state and an SSE `id` equal to its sequence. Subscription registration and the initial snapshot happen synchronously, with no tick between them.
- Every connection, including reconnects with an old `Last-Event-ID`, receives a current full snapshot. The client accepts only envelopes with matching payload/envelope sequences newer than its last applied sequence. Duplicate and stale events cannot rewind the UI. Equal-sequence reconnect snapshots confirm the connection without replacing state.
- A slow client is disconnected before its output buffer exceeds 1 MB and receives a fresh snapshot on reconnect. SSE sends a heartbeat every 15 seconds.
- Server restart restores the saved run, including a running simulation. An invalid saved file produces an explicit startup error rather than silently destroying it. To intentionally discard persisted data, stop the server and remove or back up `data/simulation.json`.

The app is a local, single-process simulator. Run one backend per state file. It does not provide accounts or multi-process coordination.

## HTTP API

| Method | Endpoint | Body / response |
| --- | --- | --- |
| GET | `/api/state` | Complete current simulation |
| GET | `/api/events` | SSE snapshot followed by increasing state events |
| GET | `/api/health` | Health, sequence and tick |
| POST | `/api/jobs` | `{ "shelfId": "S01", "stationId": "WS-01", "priority": "high" }` |
| DELETE | `/api/jobs/:id` | Cancels a queued job |
| POST | `/api/jobs/demo` | Adds four example jobs |
| POST | `/api/obstacles/toggle` | `{ "x": 7, "y": 5 }` — atomically toggles the latest server state and replans |
| POST | `/api/obstacles` | `{ "x": 7, "y": 5, "blocked": true }` |
| POST | `/api/control` | `{ "action": "resume" }`, `pause`, `step`, or `reset` |
| POST | `/api/control` | `{ "action": "speed", "value": 2 }` (0.5 / 1 / 2 / 4) |

## Interface

A warm, restrained industrial control room: a persistent map, compact fleet cards, task queue and activity stream. Robot-specific colors connect vehicles with routes; a selected robot isolates its plan. Grid, route visibility, zoom, native/embedded fullscreen, direct obstacle editing, job filters, and event filtering are functional. Left-click toggles any traversable cell, right-click inspects robots, and Shift-click creates a shelf job. Arrow keys and Enter/Space provide keyboard cell editing. Rapid edits are sent in order and toggled against the latest server state, so repeated clicks are retained even before SSE acknowledges them. At small widths the panels stack without horizontal overflow.

SVG draws the warehouse without a large canvas or visualization dependency. Only the latest complete snapshot is rendered, and log retention is capped. DM Sans and IBM Plex Mono are loaded through Google Fonts with system fallbacks. The app works without font-network access. Dialogs trap focus and restore it on close; controls have accessible names, visible keyboard focus, and reduced-motion support.
