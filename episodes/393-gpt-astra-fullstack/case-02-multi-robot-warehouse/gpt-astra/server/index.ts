import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'node:path';
import { Simulation } from './engine.js';
import { StateStore } from './persistence.js';
import type { Priority, SimulationState } from '../shared/types.js';

const app = express();
app.use(express.json({ limit: '16kb' }));
const store = new StateStore(path.resolve(process.env.DATA_FILE ?? 'data/simulation.json'));
const simulation = new Simulation(store.load());
const clients = new Set<Response>();
function send(res: Response, type: 'snapshot' | 'state', state: SimulationState) {
  res.write(`id: ${state.seq}\nevent: ${type}\ndata: ${JSON.stringify({ type, seq: state.seq, state })}\n\n`);
}
simulation.onChange = state => {
  store.save(state);
  for (const res of clients) {
    if (res.writableLength > 1024 * 1024) { res.end(); clients.delete(res); }
    else send(res, 'state', state);
  }
};
store.save(simulation.state);
app.get('/api/health', (_req, res) => res.json({ ok: true, seq: simulation.state.seq, tick: simulation.state.tick }));
app.get('/api/state', (_req, res) => { res.set('Cache-Control', 'no-store'); res.json(simulation.state); });
app.get('/api/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
  res.flushHeaders(); res.write('retry: 1000\n\n');
  // Registration + snapshot is synchronous: no tick can interleave. Reconnection
  // always starts from a full snapshot, even if Last-Event-ID is too old.
  clients.add(res); send(res, 'snapshot', simulation.state);
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 15000);
  req.on('close', () => { clearInterval(heartbeat); clients.delete(res); });
});
app.post('/api/jobs', (req, res) => {
  const { shelfId, stationId, priority } = req.body ?? {};
  const job = simulation.addJob(shelfId, stationId, priority as Priority);
  res.status(201).json({ job, seq: simulation.state.seq });
});
app.post('/api/jobs/demo', (_req, res) => { simulation.addDemoJobs(); res.json({ seq: simulation.state.seq }); });
app.delete('/api/jobs/:id', (req, res) => { simulation.cancelJob(req.params.id); res.json({ seq: simulation.state.seq }); });
app.post('/api/obstacles/toggle', (req, res) => {
  const cell = { x: req.body?.x, y: req.body?.y };
  const blocked = !simulation.state.blocked.some(c => c.x === cell.x && c.y === cell.y);
  simulation.setBlocked(cell, blocked);
  res.json({ seq: simulation.state.seq, blocked, cell });
});
app.post('/api/obstacles', (req, res) => {
  if (typeof req.body?.blocked !== 'boolean') throw new Error('blocked must be a boolean.');
  simulation.setBlocked({ x: req.body.x, y: req.body.y }, req.body.blocked); res.json({ seq: simulation.state.seq });
});
app.post('/api/control', (req, res) => { simulation.control(req.body?.action, req.body?.value); res.json({ seq: simulation.state.seq }); });
app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => res.status(400).json({ error: err.message }));
if (process.env.NODE_ENV === 'production' || process.argv.includes('--production')) {
  app.use(express.static(path.resolve('dist/client')));
  app.get('/{*path}', (_req, res) => res.sendFile(path.resolve('dist/client/index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}
let elapsed = 0;
let last = performance.now();
setInterval(() => {
  const now = performance.now(); const delta = now - last; last = now;
  if (simulation.state.paused) { elapsed = 0; return; }
  elapsed += delta * simulation.state.speed;
  // Every transition is exactly one simulation tick. Speed only changes cadence.
  if (elapsed >= 600) {
    elapsed -= 600;
    try { simulation.step(); }
    catch (error) {
      simulation.state.paused = true;
      simulation.log('warning', `Safety stop: ${(error as Error).message}`);
      simulation.commit(); console.error(error);
    }
  }
}, 50);
const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, '0.0.0.0');
server.on('listening', () => console.log(`Relay warehouse control → http://localhost:${(server.address() as { port: number }).port}`));
server.on('error', error => { console.error(`Could not start Relay on port ${port}: ${error.message}`); process.exit(1); });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  store.save(simulation.state); for (const res of clients) res.end();
  server.close(() => process.exit(0));
});
