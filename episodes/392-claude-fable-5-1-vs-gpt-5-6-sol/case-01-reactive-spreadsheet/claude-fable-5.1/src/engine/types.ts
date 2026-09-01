/** Error codes a cell can display. */
export type ErrorCode =
  | '#DIV/0!'
  | '#REF!'
  | '#VALUE!'
  | '#CYCLE!'
  | '#NAME?'
  | '#NUM!'
  | '#ERROR!';

/** A spreadsheet error value. Errors propagate through arithmetic like in Excel. */
export class CellError {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string = '',
  ) {}
  toString(): string {
    return this.code;
  }
}

export const isError = (v: unknown): v is CellError => v instanceof CellError;

/** Scalar value stored in a cell. `null` means the cell is empty. */
export type Value = number | string | boolean | null | CellError;

export interface Address {
  /** zero based column index (A = 0) */
  col: number;
  /** zero based row index (row "1" = 0) */
  row: number;
}

export interface GridSize {
  rows: number;
  cols: number;
}

/** Default grid size used by both the engine and the UI. */
export const DEFAULT_GRID: GridSize = { rows: 40, cols: 26 };

// ---------------------------------------------------------------------------
// Address helpers
// ---------------------------------------------------------------------------

export function columnLabel(col: number): string {
  let s = '';
  let n = col + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

export function columnIndex(label: string): number {
  let n = 0;
  for (const ch of label.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export function formatAddress(a: Address): string {
  return `${columnLabel(a.col)}${a.row + 1}`;
}

const ADDR_RE = /^\$?([A-Za-z]{1,3})\$?([0-9]+)$/;

/** Parse "A1" / "$B$12" into a zero-based address. Returns null when malformed. */
export function parseAddress(text: string): Address | null {
  const m = ADDR_RE.exec(text.trim());
  if (!m) return null;
  return { col: columnIndex(m[1]), row: parseInt(m[2], 10) - 1 };
}

export function inBounds(a: Address, grid: GridSize): boolean {
  return a.col >= 0 && a.row >= 0 && a.col < grid.cols && a.row < grid.rows;
}

// ---------------------------------------------------------------------------
// Value helpers
// ---------------------------------------------------------------------------

const NUMBER_RE = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

/** Strict numeric parse used for literals and text coercion. */
export function parseNumber(text: string): number | null {
  const t = text.trim();
  if (!NUMBER_RE.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Human readable rendering of a value for the grid. */
export function formatValue(v: Value): string {
  if (v === null) return '';
  if (isError(v)) return v.code;
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return '#NUM!';
    // Trim floating point noise (0.1 + 0.2 -> 0.3) while keeping 12 significant digits.
    const rounded = Number(v.toPrecision(12));
    return String(rounded);
  }
  return v;
}

export function valueKind(v: Value): 'empty' | 'number' | 'text' | 'boolean' | 'error' {
  if (v === null) return 'empty';
  if (isError(v)) return 'error';
  if (typeof v === 'number') return 'number';
  if (typeof v === 'boolean') return 'boolean';
  return 'text';
}
