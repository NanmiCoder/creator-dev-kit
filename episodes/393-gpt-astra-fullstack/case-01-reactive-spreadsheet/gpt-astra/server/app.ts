import express from 'express';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { Spreadsheet, validId, type RawCells } from '../shared/engine';
import { demoCells } from '../shared/demo';

export async function createApp(file: string) {
  await mkdir(path.dirname(file), { recursive: true });
  let initial: RawCells;
  try { initial = JSON.parse(await readFile(file, 'utf8')).cells; }
  catch (cause) {
    if ((cause as NodeJS.ErrnoException).code !== 'ENOENT') throw cause;
    initial = { ...demoCells };
  }
  const sheet = new Spreadsheet(initial);
  const app = express();
  app.use(express.json({ limit: '6mb' }));
  let queue: Promise<unknown> = Promise.resolve();
  let updatedAt = new Date().toISOString();
  const snapshot = () => ({ cells: sheet.raw, values: Object.fromEntries(sheet.values), updatedAt });
  app.get('/api/workbook', async (_req, res) => { await queue; res.json(snapshot()); });
  app.put('/api/workbook', (req, res) => {
    const cells = req.body?.cells;
    if (!cells || typeof cells !== 'object' || Array.isArray(cells) ||
      Object.keys(cells).length > 480 || Object.entries(cells).some(([id, value]) =>
        id !== id.toUpperCase() || !validId(id) || typeof value !== 'string' || value.length > 10000)) {
      res.status(400).json({ error: '请使用 A1:L40 范围内的单元格地址，内容长度不得超过 10,000 个字符。' });
      return;
    }
    const operation = queue.then(async () => {
      const previous = Object.fromEntries(Object.keys(cells).map(id => [id, sheet.raw[id] ?? '']));
      const recalculated = sheet.apply(cells);
      try {
        const savedAt = new Date().toISOString();
        await writeFile(`${file}.tmp`, JSON.stringify({ cells: sheet.raw, updatedAt: savedAt }, null, 2));
        await rename(`${file}.tmp`, file);
        updatedAt = savedAt;
        res.json({ ...snapshot(), recalculated });
      } catch (cause) { sheet.apply(previous); throw cause; }
    });
    queue = operation.catch(() => { if (!res.headersSent) res.status(500).json({ error: '工作簿保存失败，请重试。' }); });
  });
  app.use('/api', (_req, res) => { res.status(404).json({ error: '接口不存在' }); });
  app.use((err: { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.status ?? 500).json({ error: '请求内容格式不正确' });
  });
  return app;
}
