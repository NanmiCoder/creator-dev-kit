import { describe, expect, it } from 'vitest';
import { Workbook } from './workbook';
import { CellError } from './types';

const wb = () => new Workbook({ rows: 40, cols: 26 });
const val = (w: Workbook, a: string) => w.getSnapshot(a).display;

describe('literals', () => {
  it('parses numbers, text and booleans', () => {
    const w = wb();
    w.setCells([
      { addr: 'A1', raw: '42' },
      { addr: 'A2', raw: 'hello' },
      { addr: 'A3', raw: 'true' },
      { addr: 'A4', raw: '1.5e2' },
      { addr: 'A5', raw: "'123" },
    ]);
    expect(w.getValue('A1')).toBe(42);
    expect(w.getValue('A2')).toBe('hello');
    expect(w.getValue('A3')).toBe(true);
    expect(w.getValue('A4')).toBe(150);
    expect(w.getValue('A5')).toBe('123');
  });
});

describe('arithmetic and precedence', () => {
  it('respects operator precedence and parentheses', () => {
    const w = wb();
    w.setCell('A1', '=1+2*3');
    w.setCell('A2', '=(1+2)*3');
    w.setCell('A3', '=2^3^2');
    w.setCell('A4', '=-2^2');
    w.setCell('A5', '=10/4-1');
    w.setCell('A6', '=0.1+0.2');
    w.setCell('A7', '=2^-1');
    w.setCell('A8', '=-A1');
    expect(w.getValue('A1')).toBe(7);
    expect(w.getValue('A2')).toBe(9);
    expect(w.getValue('A3')).toBe(512);
    expect(w.getValue('A4')).toBe(4);
    expect(w.getValue('A5')).toBe(1.5);
    expect(val(w, 'A6')).toBe('0.3');
    expect(w.getValue('A7')).toBe(0.5);
    expect(w.getValue('A8')).toBe(-7);
  });

  it('supports functions, ranges and mixed expressions', () => {
    const w = wb();
    w.setCells([
      { addr: 'A1', raw: '1' },
      { addr: 'A2', raw: '2' },
      { addr: 'A3', raw: '3' },
      { addr: 'A4', raw: 'text' },
      { addr: 'A5', raw: '4' },
      { addr: 'B1', raw: '=SUM(A1:A5)' },
      { addr: 'B2', raw: '=AVG(A1:A3)' },
      { addr: 'B3', raw: '=SUM(A1:A3, 10, B2) * 2 + (A5 - 1) / 3' },
      { addr: 'B4', raw: '=MAX(A1:A5) - MIN(A1:A5)' },
      { addr: 'B5', raw: '=IF(A1 > 0, "pos", "neg") & "!"' },
      { addr: 'B6', raw: '=average(a1:a3)' },
    ]);
    expect(w.getValue('B1')).toBe(10);
    expect(w.getValue('B2')).toBe(2);
    expect(w.getValue('B3')).toBe(37);
    expect(w.getValue('B4')).toBe(3);
    expect(w.getValue('B5')).toBe('pos!');
    expect(w.getValue('B6')).toBe(2);
  });
});

describe('dependency graph', () => {
  it('cascades through multi-level chains and only recomputes affected cells', () => {
    const w = wb();
    w.setCells([
      { addr: 'A1', raw: '10' },
      { addr: 'B1', raw: '=A1*2' },
      { addr: 'C1', raw: '=B1+1' },
      { addr: 'D1', raw: '=SUM(A1:C1)' },
      { addr: 'Z9', raw: '=1' },
    ]);
    expect(w.getValue('D1')).toBe(51);
    const changed = w.setCell('A1', '5');
    expect(new Set(changed)).toEqual(new Set(['A1', 'B1', 'C1', 'D1']));
    expect(w.getValue('B1')).toBe(10);
    expect(w.getValue('C1')).toBe(11);
    expect(w.getValue('D1')).toBe(26);
    expect(w.getSnapshot('A1').dependents).toEqual(['B1', 'D1']);
    expect(w.getSnapshot('D1').precedents).toEqual(['A1', 'B1', 'C1']);
    expect(w.getTransitiveDependents('A1')).toEqual(['B1', 'C1', 'D1']);
    expect(w.getTransitivePrecedents('D1')).toEqual(['A1', 'B1', 'C1']);
  });

  it('handles forward references (formula entered before its inputs)', () => {
    const w = wb();
    w.setCell('A1', '=B1+C1');
    expect(w.getValue('A1')).toBe(0);
    w.setCell('B1', '7');
    expect(w.getValue('A1')).toBe(7);
    w.setCell('C1', '=B1*3');
    expect(w.getValue('A1')).toBe(28);
  });

  it('rewires edges when a formula changes and cleans up empty cells', () => {
    const w = wb();
    w.setCell('A1', '1');
    w.setCell('B1', '2');
    w.setCell('C1', '=A1');
    expect(w.getSnapshot('A1').dependents).toEqual(['C1']);
    w.setCell('C1', '=B1');
    expect(w.getSnapshot('A1').dependents).toEqual([]);
    expect(w.getSnapshot('B1').dependents).toEqual(['C1']);
    w.setCell('C1', '');
    expect(w.getSnapshot('B1').dependents).toEqual([]);
    expect(Object.keys(w.toJSON()).sort()).toEqual(['A1', 'B1']);
  });
});

describe('circular references', () => {
  it('flags direct and indirect cycles and recovers when the cycle is broken', () => {
    const w = wb();
    w.setCell('A1', '=A1+1');
    expect(val(w, 'A1')).toBe('#CYCLE!');

    w.setCell('B1', '=C1+1');
    w.setCell('C1', '=D1+1');
    w.setCell('D1', '=B1+1');
    expect(val(w, 'B1')).toBe('#CYCLE!');
    expect(val(w, 'C1')).toBe('#CYCLE!');
    expect(val(w, 'D1')).toBe('#CYCLE!');
    // A dependent of the cycle inherits the error but is not part of it.
    w.setCell('E1', '=B1*2');
    expect(val(w, 'E1')).toBe('#CYCLE!');

    w.setCell('D1', '5');
    expect(w.getValue('C1')).toBe(6);
    expect(w.getValue('B1')).toBe(7);
    expect(w.getValue('E1')).toBe(14);
  });

  it('cycles through ranges are detected', () => {
    const w = wb();
    w.setCell('A1', '1');
    w.setCell('A2', '=SUM(A1:A3)');
    w.setCell('A3', '=A2');
    expect(val(w, 'A2')).toBe('#CYCLE!');
    expect(val(w, 'A3')).toBe('#CYCLE!');
    expect(w.getValue('A1')).toBe(1);
  });
});

describe('errors', () => {
  it('produces and propagates #DIV/0!, #REF!, #VALUE!, #NAME? and #ERROR!', () => {
    const w = wb();
    w.setCells([
      { addr: 'A1', raw: '=1/0' },
      { addr: 'A2', raw: '=A1+1' },
      { addr: 'A3', raw: '=SUM(A1:A2)' },
      { addr: 'B1', raw: '=A100' },
      { addr: 'B2', raw: '=SUM(A1:A999)' },
      { addr: 'C1', raw: 'abc' },
      { addr: 'C2', raw: '=C1*2' },
      { addr: 'C3', raw: '="x"+1' },
      { addr: 'D1', raw: '=FOO(1)' },
      { addr: 'D2', raw: '=1+' },
      { addr: 'D3', raw: '=AVG(C1)' },
      { addr: 'E1', raw: '=IF(1>0, 1, 1/0)' },
      { addr: 'E2', raw: '=SUM(C1:C2)' },
    ]);
    expect(val(w, 'A1')).toBe('#DIV/0!');
    expect(val(w, 'A2')).toBe('#DIV/0!');
    expect(val(w, 'A3')).toBe('#DIV/0!');
    expect(val(w, 'B1')).toBe('#REF!');
    expect(val(w, 'B2')).toBe('#REF!');
    expect(val(w, 'C2')).toBe('#VALUE!');
    expect(val(w, 'C3')).toBe('#VALUE!');
    expect(val(w, 'D1')).toBe('#NAME?');
    expect(val(w, 'D2')).toBe('#ERROR!');
    expect(val(w, 'D3')).toBe('#VALUE!');
    expect(w.getValue('E1')).toBe(1);
    expect(val(w, 'E2')).toBe('#VALUE!');
    expect(w.getSnapshot('A2').errorMessage).toContain('Division');
  });
});

describe('persistence round trip', () => {
  it('load() recomputes everything from raw inputs', () => {
    const w = wb();
    w.setCells([
      { addr: 'A1', raw: '3' },
      { addr: 'A2', raw: '=A1*A1' },
      { addr: 'A3', raw: '=A2+A1' },
      { addr: 'B1', raw: '=B2' },
      { addr: 'B2', raw: '=B1' },
    ]);
    const json = JSON.parse(JSON.stringify(w.toJSON()));
    const w2 = wb();
    w2.load(json);
    expect(w2.getValue('A3')).toBe(12);
    expect(w2.getValue('B1')).toBeInstanceOf(CellError);
    expect(val(w2, 'B2')).toBe('#CYCLE!');
    expect(w2.getSnapshot('A1').dependents).toEqual(['A2', 'A3']);
  });
});
