# Challenge 2: Multi-Robot Warehouse Scheduling System

Starting from the current empty directory, build a complete, runnable full-stack web application: **a multi-robot warehouse scheduling and simulation system**.

## Goal

Multiple robots must execute transport jobs simultaneously inside a warehouse made of aisles, shelves, pickup locations, and workstations. The system must plan routes, prevent collisions, and replan in real time when an aisle is unexpectedly blocked. The interface must make every robot's position, planned route, current job, and reason for waiting immediately understandable.

## Required functionality

1. Generate a deterministic warehouse grid containing at least 8 robots, 20 shelves, 4 workstations, and several one-cell-wide bottleneck aisles.
2. Allow users to create transport jobs by selecting a shelf, destination workstation, and priority. The scheduler must automatically assign an available robot.
3. Implement a real pathfinding algorithm on the backend. Planned routes must never cross shelves, walls, or blocked cells.
4. Implement time-step-based path reservations that prevent:
   - Two robots from occupying the same cell at the same time.
   - Two robots from swapping cells during the same time step.
   - Robots entering a permanent head-on deadlock inside a narrow aisle.
5. Robots may wait or replan to resolve conflicts, but the system must expose the reason. High-priority jobs must not starve indefinitely.
6. The backend must advance the simulation using fixed time steps and remain the authoritative state source. The frontend must not independently decide final robot positions.
7. Stream state updates through WebSocket or SSE with monotonically increasing sequence numbers. After reconnecting, the client must obtain a complete snapshot and then continue applying newer events without reverting to stale state.
8. Allow users to block or unblock any traversable grid cell while the simulation is running. Affected robots must stop before entering the new obstacle and replan immediately.
9. Support pause, resume, single-step execution, and reset with the same deterministic seed so scheduling behavior can be reproduced.
10. Persist jobs, map changes, and the current simulation state so that a page reload can continue observing the same run.
11. The interface must display the warehouse map, planned robot paths, job queue, robot states, and event log at the same time. Desktop is the primary target, but the layout must not visibly break on a small screen.
12. Provide clear setup and start commands in a README, and ensure the project can complete a production build.

## Acceptance scenario

I will create at least three simultaneous transport jobs and watch robots pass through narrow aisles without colliding. I will then block a cell directly ahead of an active robot and verify immediate replanning. Finally, I will disconnect and reconnect the page and confirm that the snapshot and subsequent event sequence remain consistent.

This is a **25-minute challenge**. Start implementing immediately. Prioritize scheduling correctness, space-time conflict avoidance, dynamic replanning, and real-time state consistency.
