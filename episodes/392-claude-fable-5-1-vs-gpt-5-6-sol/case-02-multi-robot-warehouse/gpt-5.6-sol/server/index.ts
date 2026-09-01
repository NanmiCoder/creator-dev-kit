import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type NextFunction, type Request, type Response } from "express";
import { WarehouseSimulation, type Priority, type Snapshot } from "./simulation.js";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(moduleDirectory, "..");
const simulation = new WarehouseSimulation(path.join(projectRoot, "data", "state.json"));
const app = express();
const port = Number(process.env.PORT ?? 3001);

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, seed: simulation.seed, sequence: simulation.sequence });
});

app.get("/api/state", (_request, response) => {
  response.json(simulation.getSnapshot());
});

app.get("/api/catalog", (_request, response) => {
  response.json(simulation.getCatalog());
});

app.get("/api/events", (request, response) => {
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache, no-transform");
  response.setHeader("Connection", "keep-alive");
  response.setHeader("X-Accel-Buffering", "no");
  response.flushHeaders();
  response.write("retry: 1200\n\n");

  const send = (event: "snapshot" | "state", snapshot: Snapshot) => {
    response.write(`event: ${event}\n`);
    response.write(`id: ${snapshot.sequence}\n`);
    response.write(`data: ${JSON.stringify(snapshot)}\n\n`);
  };

  // Every connection begins with a complete authoritative snapshot. Subsequent
  // events are also complete states, allowing clients to recover from any gap.
  send("snapshot", simulation.getSnapshot());
  const unsubscribe = simulation.subscribe((snapshot) => send("state", snapshot));
  const heartbeat = setInterval(() => response.write(": keep-alive\n\n"), 15_000);

  request.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
    response.end();
  });
});

app.post("/api/jobs", (request, response) => {
  const { shelfId, stationId, priority } = request.body as {
    shelfId?: string;
    stationId?: string;
    priority?: Priority;
  };
  if (!shelfId || !stationId || !priority) {
    response.status(400).json({ error: "必须提供货架、工作站和优先级。" });
    return;
  }
  const job = simulation.createJob(shelfId, stationId, priority);
  response.status(201).json(job);
});

app.post("/api/control", (request, response) => {
  const action = String(request.body?.action ?? "");
  if (action === "pause") simulation.setRunning(false);
  else if (action === "resume") simulation.setRunning(true);
  else if (action === "step") simulation.singleStep();
  else if (action === "reset") simulation.reset();
  else {
    response.status(400).json({ error: "未知的控制操作。" });
    return;
  }
  response.json(simulation.getSnapshot());
});

app.put("/api/cells/:x/:y", (request, response) => {
  const x = Number(request.params.x);
  const y = Number(request.params.y);
  if (!Number.isInteger(x) || !Number.isInteger(y) || typeof request.body?.blocked !== "boolean") {
    response.status(400).json({ error: "坐标必须为整数，封锁状态必须为布尔值。" });
    return;
  }
  simulation.setCellBlocked({ x, y }, request.body.blocked);
  response.json(simulation.getSnapshot());
});

const staticPath = path.join(projectRoot, "dist");
app.use(express.static(staticPath, { index: false }));
app.get("/{*path}", (request, response, next) => {
  if (request.path.startsWith("/api/")) return next();
  response.sendFile(path.join(staticPath, "index.html"));
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : "服务器发生未预期错误。";
  console.error(error);
  response.status(message.startsWith("Safety invariant") ? 500 : 400).json({ error: message });
});

const clock = setInterval(() => {
  try {
    simulation.advance();
  } catch (error) {
    console.error("仿真时钟已停止：", error);
    simulation.setRunning(false);
  }
}, simulation.stepMs);

const server = app.listen(port, () => {
  console.log(`航点调度服务已启动：http://localhost:${port}`);
});

const shutdown = () => {
  clearInterval(clock);
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { app, simulation };
