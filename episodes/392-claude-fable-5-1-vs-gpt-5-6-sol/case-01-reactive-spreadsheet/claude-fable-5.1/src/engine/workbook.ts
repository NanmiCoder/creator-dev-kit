import { evaluate } from './evaluator';
import { type AstNode, collectReferences, parseFormula } from './parser';
import {
  CellError,
  DEFAULT_GRID,
  type Address,
  type ErrorCode,
  type GridSize,
  type Value,
  formatAddress,
  formatValue,
  inBounds,
  isError,
  parseAddress,
  parseNumber,
} from './types';

/** Public, immutable view of a cell handed to the UI. */
export interface CellSnapshot {
  addr: string;
  raw: string;
  value: Value;
  display: string;
  isFormula: boolean;
  error: ErrorCode | null;
  errorMessage: string;
  /** Direct cells this cell reads from. */
  precedents: string[];
  /** Direct cells that read this cell. */
  dependents: string[];
}

interface CellRecord {
  raw: string;
  ast: AstNode | null;
  parseError: string | null;
  value: Value;
  precedents: Set<string>;
  dependents: Set<string>;
}

export interface CellInput {
  addr: string;
  raw: string;
}

const isFormula = (raw: string) => raw.startsWith('=') && raw.length > 1;

function literalValue(raw: string): Value {
  if (raw === '') return null;
  if (raw.startsWith("'")) return raw.slice(1); // Excel-style "force text" prefix
  const n = parseNumber(raw);
  if (n !== null) return n;
  const u = raw.trim().toUpperCase();
  if (u === 'TRUE') return true;
  if (u === 'FALSE') return false;
  return raw;
}

/**
 * The spreadsheet engine: stores raw inputs, keeps a bidirectional dependency graph and
 * recalculates only the cells affected by an edit, in topological order, marking cycles.
 */
export class Workbook {
  readonly grid: GridSize;
  private cells = new Map<string, CellRecord>();

  constructor(grid: GridSize = DEFAULT_GRID) {
    this.grid = grid;
  }

  // ------------------------------------------------------------------ reads

  getRaw(addr: string): string {
    return this.cells.get(addr)?.raw ?? '';
  }

  getValue(addr: string): Value {
    return this.cells.get(addr)?.value ?? null;
  }

  getSnapshot(addr: string): CellSnapshot {
    const rec = this.cells.get(addr);
    if (!rec) {
      return { addr, raw: '', value: null, display: '', isFormula: false, error: null, errorMessage: '', precedents: [], dependents: [] };
    }
    const error = isError(rec.value) ? rec.value : null;
    return {
      addr,
      raw: rec.raw,
      value: rec.value,
      display: formatValue(rec.value),
      isFormula: isFormula(rec.raw),
      error: error ? error.code : null,
      errorMessage: error ? error.message : '',
      precedents: [...rec.precedents].sort(compareAddr),
      dependents: [...rec.dependents].sort(compareAddr),
    };
  }

  /** Snapshots for every cell that has content or takes part in the graph. */
  getAllSnapshots(): Record<string, CellSnapshot> {
    const out: Record<string, CellSnapshot> = {};
    for (const addr of this.cells.keys()) out[addr] = this.getSnapshot(addr);
    return out;
  }

  /** Raw inputs of non-empty cells (what gets persisted). */
  toJSON(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [addr, rec] of this.cells) if (rec.raw !== '') out[addr] = rec.raw;
    return out;
  }

  /** Every cell that transitively depends on `addr` (excluding itself). */
  getTransitiveDependents(addr: string): string[] {
    return this.walk(addr, (rec) => rec.dependents);
  }

  /** Every cell `addr` transitively reads from (excluding itself). */
  getTransitivePrecedents(addr: string): string[] {
    return this.walk(addr, (rec) => rec.precedents);
  }

  // ----------------------------------------------------------------- writes

  /** Set a single cell. Returns every address whose snapshot may have changed. */
  setCell(addr: string, raw: string): string[] {
    return this.setCells([{ addr, raw }]);
  }

  /** Set many cells at once, then recalculate a single time. */
  setCells(inputs: CellInput[]): string[] {
    const touched = new Set<string>();
    const seeds = new Set<string>();
    for (const { addr, raw } of inputs) {
      const a = parseAddress(addr);
      if (!a || !inBounds(a, this.grid)) continue;
      const key = formatAddress(a);
      for (const t of this.assignRaw(key, raw)) touched.add(t);
      seeds.add(key);
    }
    for (const a of this.recalculate(seeds)) touched.add(a);
    for (const a of [...touched]) this.pruneIfEmpty(a);
    return [...touched];
  }

  /** Replace the whole workbook with persisted raw inputs and recompute everything. */
  load(rawCells: Record<string, string>): void {
    this.cells.clear();
    const seeds = new Set<string>();
    for (const [addr, raw] of Object.entries(rawCells)) {
      const a = parseAddress(addr);
      if (!a || !inBounds(a, this.grid) || typeof raw !== 'string') continue;
      const key = formatAddress(a);
      this.assignRaw(key, raw);
      seeds.add(key);
    }
    this.recalculate(seeds);
    for (const a of [...this.cells.keys()]) this.pruneIfEmpty(a);
  }

  // --------------------------------------------------------------- internals

  private walk(start: string, edges: (rec: CellRecord) => Set<string>): string[] {
    const seen = new Set<string>();
    const stack = [start];
    while (stack.length) {
      const cur = stack.pop()!;
      const rec = this.cells.get(cur);
      if (!rec) continue;
      for (const n of edges(rec)) {
        if (!seen.has(n)) {
          seen.add(n);
          stack.push(n);
        }
      }
    }
    seen.delete(start);
    return [...seen].sort(compareAddr);
  }

  private getOrCreate(addr: string): CellRecord {
    let rec = this.cells.get(addr);
    if (!rec) {
      rec = { raw: '', ast: null, parseError: null, value: null, precedents: new Set(), dependents: new Set() };
      this.cells.set(addr, rec);
    }
    return rec;
  }

  private pruneIfEmpty(addr: string): void {
    const rec = this.cells.get(addr);
    if (rec && rec.raw === '' && rec.dependents.size === 0) this.cells.delete(addr);
  }

  /** Store raw text, re-parse, and rewire graph edges. Returns cells whose edges changed. */
  private assignRaw(addr: string, raw: string): string[] {
    const rec = this.getOrCreate(addr);
    const changed: string[] = [addr];
    for (const p of rec.precedents) {
      this.cells.get(p)?.dependents.delete(addr);
      changed.push(p);
    }
    rec.raw = raw;
    rec.ast = null;
    rec.parseError = null;
    rec.precedents = new Set();
    if (isFormula(raw)) {
      try {
        rec.ast = parseFormula(raw.slice(1));
        const found = { refs: [] as Address[], ranges: [] as { start: Address; end: Address }[] };
        collectReferences(rec.ast, found);
        for (const r of found.refs) if (inBounds(r, this.grid)) rec.precedents.add(formatAddress(r));
        for (const { start, end } of found.ranges) {
          if (!inBounds(start, this.grid) || !inBounds(end, this.grid)) continue;
          for (let row = start.row; row <= end.row; row++) {
            for (let col = start.col; col <= end.col; col++) rec.precedents.add(formatAddress({ col, row }));
          }
        }
      } catch (e) {
        rec.parseError = e instanceof Error ? e.message : String(e);
      }
    }
    for (const p of rec.precedents) {
      this.getOrCreate(p).dependents.add(addr);
      changed.push(p);
    }
    return changed;
  }

  /**
   * Recalculate every cell reachable from `seeds` through dependents edges.
   * Uses Tarjan's SCC over the affected sub-graph: SCCs come out in dependency order
   * (precedents first), and any SCC with more than one node (or a self reference) is a cycle.
   */
  private recalculate(seeds: Set<string>): string[] {
    // 1. Affected set = seeds + all transitive dependents.
    const affected = new Set<string>();
    const queue = [...seeds];
    while (queue.length) {
      const cur = queue.pop()!;
      if (affected.has(cur)) continue;
      affected.add(cur);
      const rec = this.cells.get(cur);
      if (rec) for (const d of rec.dependents) if (!affected.has(d)) queue.push(d);
    }

    // 2. Tarjan's strongly connected components restricted to the affected set.
    const index = new Map<string, number>();
    const low = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const order: string[][] = [];
    let counter = 0;
    const strongConnect = (v: string): void => {
      index.set(v, counter);
      low.set(v, counter);
      counter++;
      stack.push(v);
      onStack.add(v);
      const rec = this.cells.get(v);
      if (rec) {
        for (const w of rec.precedents) {
          if (!affected.has(w)) continue;
          if (!index.has(w)) {
            strongConnect(w);
            low.set(v, Math.min(low.get(v)!, low.get(w)!));
          } else if (onStack.has(w)) {
            low.set(v, Math.min(low.get(v)!, index.get(w)!));
          }
        }
      }
      if (low.get(v) === index.get(v)) {
        const comp: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          comp.push(w);
        } while (w !== v);
        order.push(comp);
      }
    };
    for (const v of affected) if (!index.has(v)) strongConnect(v);

    // 3. Evaluate components in order; cycles get #CYCLE!.
    const ctx = {
      grid: this.grid,
      getValue: (a: Address): Value => this.cells.get(formatAddress(a))?.value ?? null,
    };
    for (const comp of order) {
      const rec0 = this.cells.get(comp[0]);
      const isCycle = comp.length > 1 || (rec0 !== undefined && rec0.precedents.has(comp[0]));
      if (isCycle) {
        const members = [...comp].sort(compareAddr).join(' → ');
        for (const a of comp) {
          const rec = this.cells.get(a);
          if (rec) rec.value = new CellError('#CYCLE!', `Circular reference: ${members}`);
        }
        continue;
      }
      const rec = rec0;
      if (!rec) continue;
      rec.value = this.computeValue(rec, ctx);
    }
    return [...affected];
  }

  private computeValue(rec: CellRecord, ctx: { grid: GridSize; getValue(a: Address): Value }): Value {
    if (!isFormula(rec.raw)) return literalValue(rec.raw);
    if (rec.parseError || !rec.ast) return new CellError('#ERROR!', rec.parseError ?? 'Invalid formula');
    return evaluate(rec.ast, ctx);
  }
}

function compareAddr(a: string, b: string): number {
  const pa = parseAddress(a);
  const pb = parseAddress(b);
  if (!pa || !pb) return a.localeCompare(b);
  return pa.row - pb.row || pa.col - pb.col;
}
