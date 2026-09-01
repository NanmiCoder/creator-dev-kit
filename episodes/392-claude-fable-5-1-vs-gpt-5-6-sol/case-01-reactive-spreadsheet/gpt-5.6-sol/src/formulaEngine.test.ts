import { describe, expect, it } from 'vitest';
import { SpreadsheetEngine } from './formulaEngine';

describe('SpreadsheetEngine', () => {
  it('evaluates precedence, functions, ranges, and forward references', () => {
    const engine = new SpreadsheetEngine({
      A1: '2',
      A2: '4',
      B1: '=A1+A2*3',
      B2: '=SUM(A1:A2) + AVG(A1:A2)',
      C1: '=D1+1',
      D1: '9',
    });
    const snapshot = engine.snapshot();
    expect(snapshot.cells.B1.display).toBe('14');
    expect(snapshot.cells.B2.display).toBe('9');
    expect(snapshot.cells.C1.display).toBe('10');
  });

  it('recalculates only the downstream dependency chain', () => {
    const engine = new SpreadsheetEngine({ A1: '1', B1: '=A1+1', C1: '=B1+1', J20: '=9*9' });
    const snapshot = engine.setCell('A1', '5');
    expect(snapshot.cells.C1.display).toBe('7');
    expect(new Set(snapshot.recalculated)).toEqual(new Set(['A1', 'B1', 'C1']));
    expect(snapshot.recalculated).not.toContain('J20');
  });

  it('marks every member of an indirect cycle and propagates it', () => {
    const engine = new SpreadsheetEngine({ A1: '=B1', B1: '=C1', C1: '=A1', D1: '=C1+2' });
    const snapshot = engine.snapshot();
    expect(snapshot.cells.A1.error).toBe('#CYCLE!');
    expect(snapshot.cells.B1.error).toBe('#CYCLE!');
    expect(snapshot.cells.C1.error).toBe('#CYCLE!');
    expect(snapshot.cells.D1.error).toBe('#CYCLE!');
  });

  it('produces and propagates spreadsheet errors', () => {
    const engine = new SpreadsheetEngine({ A1: '=1/0', A2: '=A1+1', B1: '=K1', B2: '=1+hello' });
    const snapshot = engine.snapshot();
    expect(snapshot.cells.A1.error).toBe('#DIV/0!');
    expect(snapshot.cells.A2.error).toBe('#DIV/0!');
    expect(snapshot.cells.B1.error).toBe('#REF!');
    expect(snapshot.cells.B2.error).toBe('#VALUE!');
  });
});
