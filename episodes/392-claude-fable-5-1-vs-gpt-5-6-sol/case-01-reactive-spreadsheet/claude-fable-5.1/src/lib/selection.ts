import { type Address, formatAddress } from '../engine';

export interface Selection {
  /** The active cell (where the selection started). */
  anchor: Address;
  /** The opposite corner of the selected block. */
  focus: Address;
}

export interface Bounds {
  r0: number;
  c0: number;
  r1: number;
  c1: number;
}

export const single = (a: Address): Selection => ({ anchor: a, focus: a });

export function bounds(sel: Selection): Bounds {
  return {
    r0: Math.min(sel.anchor.row, sel.focus.row),
    r1: Math.max(sel.anchor.row, sel.focus.row),
    c0: Math.min(sel.anchor.col, sel.focus.col),
    c1: Math.max(sel.anchor.col, sel.focus.col),
  };
}

export function isMultiCell(sel: Selection): boolean {
  return sel.anchor.row !== sel.focus.row || sel.anchor.col !== sel.focus.col;
}

/** Addresses in the selection, row-major. */
export function addressesIn(sel: Selection): string[] {
  const b = bounds(sel);
  const out: string[] = [];
  for (let r = b.r0; r <= b.r1; r++) for (let c = b.c0; c <= b.c1; c++) out.push(formatAddress({ col: c, row: r }));
  return out;
}

export function describe(sel: Selection): string {
  if (!isMultiCell(sel)) return formatAddress(sel.anchor);
  const b = bounds(sel);
  return `${formatAddress({ col: b.c0, row: b.r0 })}:${formatAddress({ col: b.c1, row: b.r1 })}`;
}

/** Parse tab/newline separated clipboard text into a 2D block of raw strings. */
export function parseClipboardText(text: string): string[][] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines.map((line) => line.split('\t'));
}

export function toClipboardText(rows: string[][]): string {
  return rows.map((r) => r.join('\t')).join('\n');
}
