import express, { type Request, type Response } from 'express';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';
import { Simulation } from './sim.js';
import { DATA_FILE, SERVER_ROOT, loadState, saveState } from './persist.js';
import type { ClientMessage, ServerMessage } from '../../shared/types.js';

const PORT = Number(process.env.PORT) || 4022;
const DEFAULT_SEED = Number(process.env.SEED) || 42;

const persisted = process.env.FRESH ? null : loadState();
const sim = new Simulation(DEFAULT_SEED, persisted);
console.log(`[sim] ${persisted ? 'restored' : 'created'} run: seed ${sim.seed}, tick ${sim.tick}, seq ${sim.seq} (state file: ${DATA_FILE})`);

// ------------------------------------------------------------ persistence
let saveTimer: NodeJS.Timeout | null = null;
function schedulePersist(): void {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveState(sim.persisted());
  }, 300);
}
function flushPersist(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  saveState(sim.persisted());
}

// ------------------------------------------------------------ http api
const app = express();
app.use(express.json());

function handle(fn: (req: Request, res: Response) => unknown) {
  return (req: Request, res: Response) => {
    try {
      const out = fn(req, res);
      res.json({ ok: true, result: out ?? null, seq: sim.seq, tick: sim.tick });
    } catch (err) {
      res.status(400).json({ ok: false, error: (err as Error).message });
    }
  };
}

app.get('/api/state', (_req, res) => {
  res.json(sim.snapshot());
});
app.post('/api/jobs', handle((req) => sim.createJob(String(req.body.shelfId), String(req.body.workstationId), Number(req.body.priority))));
app.post('/api/jobs/demo', handle(() => sim.createDemoJobs()));
app.delete('/api/jobs/:id', handle((req) => sim.cancelJob(String(req.params.id))));
app.post('/api/cells', handle((req) => sim.setBlocked(Number(req.body.x), Number(req.body.y), Boolean(req.body.blocked))));
app.post('/api/sim/pause', handle(() => sim.pause()));
app.post('/api/sim/resume', handle(() => sim.resume()));
app.post('/api/sim/step', handle(() => sim.step()));
app.post('/api/sim/reset', handle((req) => sim.reset(req.body?.seed !== undefined && req.body.seed !== '' ? Number(req.body.seed) : undefined)));
app.post('/api/sim/speed', handle((req) => {
  sim.setTickMs(Number(req.body.tickMs));
  armLoop();
}));

// Static client (production build)
const clientDist = process.env.CLIENT_DIST ?? path.resolve(SERVER_ROOT, '../client/dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/ws')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
  console.log(`[http] serving client from ${clientDist}`);
} else {
  app.get('/', (_req, res) => {
    res.type('text').send('未找到前端构建产物。请先运行 `npm run build`，或使用 `npm run dev`（Vite 开发页面在 :4821）。');
  });
}

// ------------------------------------------------------------ websocket stream
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function send(ws: WebSocket, msg: ServerMessage): void {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

wss.on('connection', (ws) => {
  send(ws, { type: 'snapshot', seq: sim.seq, state: sim.snapshot() });
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(String(data)) as ClientMessage;
      if (msg.type === 'hello') {
        console.log(`[ws] client hello (lastSeq ${msg.lastSeq}) → snapshot seq ${sim.seq}`);
        send(ws, { type: 'snapshot', seq: sim.seq, state: sim.snapshot() });
      }
    } catch {
      /* ignore malformed */
    }
  });
});

sim.subscribe((evt) => {
  const payload = JSON.stringify({ type: 'event', ...evt } satisfies ServerMessage);
  for (const c of wss.clients) if (c.readyState === WebSocket.OPEN) c.send(payload);
  schedulePersist();
});

// ------------------------------------------------------------ fixed time-step loop
let loop: NodeJS.Timeout | null = null;
function armLoop(): void {
  if (loop) clearInterval(loop);
  loop = setInterval(() => {
    if (sim.running) sim.tickOnce();
  }, sim.tickMs);
}
armLoop();

server.listen(PORT, () => {
  console.log(`[http] listening on http://localhost:${PORT}  (ws: /ws)`);
});

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => {
    flushPersist();
    process.exit(0);
  });
}
