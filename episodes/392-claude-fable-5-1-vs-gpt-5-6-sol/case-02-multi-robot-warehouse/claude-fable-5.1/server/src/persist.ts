import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PersistedState } from './sim.js';

const here = path.dirname(fileURLToPath(import.meta.url));
// src/persist.ts -> server/ ; dist/server/src/persist.js -> server/
export const SERVER_ROOT = here.includes(`${path.sep}dist${path.sep}`) ? path.resolve(here, '../../..') : path.resolve(here, '..');
export const DATA_FILE = process.env.DATA_FILE ?? path.resolve(SERVER_ROOT, 'data/state.json');

export function loadState(): PersistedState | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw) as PersistedState;
  } catch (err) {
    console.warn('[persist] could not load state:', (err as Error).message);
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    const tmp = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(state));
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.warn('[persist] could not save state:', (err as Error).message);
  }
}

export function clearState(): void {
  try {
    if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  } catch {
    /* ignore */
  }
}
