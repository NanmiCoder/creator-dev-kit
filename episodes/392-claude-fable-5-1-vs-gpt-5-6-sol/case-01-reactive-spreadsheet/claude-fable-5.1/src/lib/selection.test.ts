import { describe, expect, it } from 'vitest';
import { addressesIn, bounds, describe as describeSel, isMultiCell, parseClipboardText, single, toClipboardText } from './selection';
import { History } from './history';

describe('selection helpers', () => {
  it('normalises bounds regardless of drag direction', () => {
    const sel = { anchor: { col: 3, row: 5 }, focus: { col: 1, row: 2 } };
    expect(bounds(sel)).toEqual({ r0: 2, r1: 5, c0: 1, c1: 3 });
    expect(isMultiCell(sel)).toBe(true);
    expect(describeSel(sel)).toBe('B3:D6');
    expect(describeSel(single({ col: 0, row: 0 }))).toBe('A1');
    expect(addressesIn({ anchor: { col: 1, row: 1 }, focus: { col: 2, row: 2 } })).toEqual(['B2', 'C2', 'B3', 'C3']);
  });

  it('round-trips tab separated clipboard text', () => {
    const rows = [['4', '25'], ['2', '=B2*C2'], ['', 'text']];
    const text = toClipboardText(rows);
    expect(text).toBe('4\t25\n2\t=B2*C2\n\ttext');
    expect(parseClipboardText(text)).toEqual(rows);
    expect(parseClipboardText('1\t2\r\n3\t4\r\n')).toEqual([['1', '2'], ['3', '4']]);
    expect(parseClipboardText('42')).toEqual([['42']]);
  });
});

describe('history', () => {
  it('supports undo/redo with a bounded stack', () => {
    const h = new History(3);
    for (let i = 1; i <= 4; i++) h.push({ label: `e${i}`, changes: [] });
    expect(h.undoDepth).toBe(3);
    expect(h.undo()?.label).toBe('e4');
    expect(h.undo()?.label).toBe('e3');
    expect(h.redo()?.label).toBe('e3');
    expect(h.canRedo).toBe(true);
    h.push({ label: 'e5', changes: [] });
    expect(h.canRedo).toBe(false);
    expect(h.undoLabel).toBe('e5');
  });
});
