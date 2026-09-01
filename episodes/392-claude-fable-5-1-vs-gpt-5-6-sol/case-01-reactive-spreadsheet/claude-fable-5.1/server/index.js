// Minimal persistence backend for the spreadsheet.
// Stores the workbook as JSON on disk (atomic writes) and serves the built client in production.
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = process.env.DATA_FILE ? path.resolve(process.env.DATA_FILE) : path.join(ROOT, 'data', 'workbook.json');
const PORT = Number(process.env.PORT) || 3001;
// Production mode: serve the built client from dist/. Enabled by `npm start` (--serve) or NODE_ENV=production.
const IS_PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--serve');

const ADDR_RE = /^[A-Z]{1,3}[0-9]{1,4}$/;
const MAX_CELLS = 50_000;
const MAX_RAW_LENGTH = 10_000;

const emptyWorkbook = () => ({ version: 1, updatedAt: null, cells: {} });

async function readWorkbook() {
  try {
    const text = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || !data.cells || typeof data.cells !== 'object') return emptyWorkbook();
    return data;
  } catch (err) {
    if (err && err.code === 'ENOENT') return emptyWorkbook();
    console.error(`[server] could not read ${DATA_FILE}:`, err.message);
    return emptyWorkbook();
  }
}

// Serialise writes so concurrent saves never interleave; write to a temp file then rename (atomic).
let writeQueue = Promise.resolve();
function writeWorkbook(data) {
  const job = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, DATA_FILE);
  });
  writeQueue = job.catch(() => {});
  return job;
}

/** Validate the client payload and drop anything that is not a well-formed cell. */
function sanitizeCells(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('"cells" must be an object');
  const entries = Object.entries(input);
  if (entries.length > MAX_CELLS) throw new Error(`too many cells (max ${MAX_CELLS})`);
  const out = {};
  for (const [addr, cell] of entries) {
    if (!ADDR_RE.test(addr)) throw new Error(`invalid cell address "${addr}"`);
    if (!cell || typeof cell !== 'object') throw new Error(`invalid cell payload for ${addr}`);
    if (typeof cell.raw !== 'string') throw new Error(`cell ${addr} is missing "raw"`);
    if (cell.raw.length > MAX_RAW_LENGTH) throw new Error(`cell ${addr} content is too long`);
    if (cell.raw === '') continue;
    const value = cell.value;
    const okValue = value === null || ['number', 'string', 'boolean'].includes(typeof value);
    out[addr] = {
      raw: cell.raw,
      value: okValue ? value : null,
      display: typeof cell.display === 'string' ? cell.display : String(value ?? ''),
      ...(typeof cell.error === 'string' ? { error: cell.error } : {}),
    };
  }
  return out;
}

const app = express();
app.use(express.json({ limit: '5mb', type: ['application/json', 'text/plain'] }));

app.get('/api/health', (_req, res) => res.json({ ok: true, dataFile: DATA_FILE }));

app.get('/api/workbook', async (_req, res) => {
  res.json(await readWorkbook());
});

async function saveHandler(req, res) {
  try {
    const cells = sanitizeCells(req.body?.cells);
    const data = { version: 1, updatedAt: new Date().toISOString(), cells };
    await writeWorkbook(data);
    res.json({ ok: true, updatedAt: data.updatedAt, cellCount: Object.keys(cells).length });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
}
app.put('/api/workbook', saveHandler);
app.post('/api/workbook', saveHandler); // used by navigator.sendBeacon on page unload

app.delete('/api/workbook', async (_req, res) => {
  const data = { ...emptyWorkbook(), updatedAt: new Date().toISOString() };
  await writeWorkbook(data);
  res.json({ ok: true });
});

if (IS_PROD) {
  const dist = path.join(ROOT, 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT} (${IS_PROD ? 'production' : 'development'})`);
  console.log(`[server] workbook file: ${DATA_FILE}`);
});
