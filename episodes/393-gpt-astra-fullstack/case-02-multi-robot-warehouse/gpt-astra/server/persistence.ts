import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import type { SimulationState } from '../shared/types.js';
export class StateStore {
  constructor(public file: string) { mkdirSync(dirname(file), { recursive: true }); }
  load(): SimulationState | undefined {
    if (!existsSync(this.file)) return undefined;
    const saved = JSON.parse(readFileSync(this.file, 'utf8')) as SimulationState;
    if (saved.version !== 1 || !Number.isSafeInteger(saved.seq) || !Array.isArray(saved.robots) || saved.robots.length !== 8) {
      throw new Error(`Invalid saved simulation at ${this.file}. Back up or remove it before restarting.`);
    }
    return saved;
  }
  save(state: SimulationState) {
    writeFileSync(`${this.file}.tmp`, JSON.stringify(state), { encoding: 'utf8', flush: true });
    renameSync(`${this.file}.tmp`, this.file);
  }
}
