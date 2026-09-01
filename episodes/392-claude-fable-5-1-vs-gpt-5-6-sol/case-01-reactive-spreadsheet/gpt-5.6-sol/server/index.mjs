import express from 'express';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(serverDirectory, '..');
const dataDirectory = path.join(projectDirectory, 'data');
const workbookPath = path.join(dataDirectory, 'workbook.json');
const temporaryPath = path.join(dataDirectory, 'workbook.tmp');
const distributionDirectory = path.join(projectDirectory, 'dist');
const port = Number(process.env.PORT) || 3001;
const app = express();

app.use(express.json({ limit: '1mb' }));

app.get('/api/workbook', async (_request, response) => {
  try {
    const workbook = JSON.parse(await readFile(workbookPath, 'utf8'));
    response.json(workbook);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      response.json({ cells: {}, computed: {}, updatedAt: null });
      return;
    }
    console.error('Unable to read workbook', error);
    response.status(500).json({ error: 'Unable to read workbook.' });
  }
});

app.put('/api/workbook', async (request, response) => {
  const cells = request.body?.cells;
  const computed = request.body?.computed;
  if (!cells || typeof cells !== 'object' || Array.isArray(cells)) {
    response.status(400).json({ error: 'Workbook cells must be an object.' });
    return;
  }

  const safeCells = Object.fromEntries(
    Object.entries(cells)
      .filter(([id, value]) => /^[A-J](?:[1-9]|1\d|20)$/.test(id) && typeof value === 'string')
      .slice(0, 200),
  );
  const safeComputed = computed && typeof computed === 'object' && !Array.isArray(computed)
    ? Object.fromEntries(
        Object.entries(computed)
          .filter(([id, value]) => /^[A-J](?:[1-9]|1\d|20)$/.test(id) && typeof value === 'string')
          .slice(0, 200),
      )
    : {};
  const workbook = { cells: safeCells, computed: safeComputed, updatedAt: new Date().toISOString() };

  try {
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(temporaryPath, `${JSON.stringify(workbook, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, workbookPath);
    response.json({ ok: true, updatedAt: workbook.updatedAt });
  } catch (error) {
    console.error('Unable to save workbook', error);
    response.status(500).json({ error: 'Unable to save workbook.' });
  }
});

app.use(express.static(distributionDirectory));
app.use((_request, response) => response.sendFile(path.join(distributionDirectory, 'index.html')));

app.listen(port, () => {
  console.log(`Chain Sheet server listening on http://localhost:${port}`);
});
