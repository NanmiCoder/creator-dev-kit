import express from 'express';
import path from 'node:path';
import { createApp } from './app';

const app = await createApp(path.resolve(process.env.DATA_FILE ?? 'data/workbook.json'));
const assets = path.resolve('dist');
app.use(express.static(assets));
app.get('/{*path}', (_req, res) => res.sendFile(path.join(assets, 'index.html')));
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '127.0.0.1';
const server = app.listen(port, host);
server.once('listening', () => console.log(`Folio is running at http://${host}:${port}`));
server.once('error', (cause: NodeJS.ErrnoException) => {
  console.error(`Folio could not listen on ${host}:${port}: ${cause.message}`);
  process.exitCode = 1;
});
