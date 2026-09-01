import type { CellInput } from '../engine';

/** Sample workbook that exercises chains, ranges, errors and a cycle. */
export const DEMO_CELLS: CellInput[] = [
  { addr: 'A1', raw: 'Item' }, { addr: 'B1', raw: 'Qty' }, { addr: 'C1', raw: 'Price' }, { addr: 'D1', raw: 'Total' },
  { addr: 'A2', raw: 'Widget' }, { addr: 'B2', raw: '4' }, { addr: 'C2', raw: '25' }, { addr: 'D2', raw: '=B2*C2' },
  { addr: 'A3', raw: 'Gadget' }, { addr: 'B3', raw: '2' }, { addr: 'C3', raw: '60' }, { addr: 'D3', raw: '=B3*C3' },
  { addr: 'A4', raw: 'Gizmo' }, { addr: 'B4', raw: '10' }, { addr: 'C4', raw: '3.5' }, { addr: 'D4', raw: '=B4*C4' },
  { addr: 'A6', raw: 'Subtotal' }, { addr: 'D6', raw: '=SUM(D2:D4)' },
  { addr: 'A7', raw: 'Tax rate' }, { addr: 'B7', raw: '=8%' }, { addr: 'D7', raw: '=ROUND(D6*B7, 2)' },
  { addr: 'A8', raw: 'Grand total' }, { addr: 'D8', raw: '=D6+D7' },
  { addr: 'A9', raw: 'Avg line' }, { addr: 'D9', raw: '=AVG(D2:D4)' },
  { addr: 'A10', raw: 'Big order?' }, { addr: 'D10', raw: '=IF(D8>200,"yes","no")' },

  { addr: 'A12', raw: 'Chain (edit B12)' },
  { addr: 'B12', raw: '10' }, { addr: 'C12', raw: '=B12*2' }, { addr: 'D12', raw: '=C12+5' },
  { addr: 'E12', raw: '=D12/2' }, { addr: 'F12', raw: '=SUM(B12:E12)' },

  { addr: 'A14', raw: 'Errors' },
  { addr: 'B14', raw: '=1/0' }, { addr: 'C14', raw: '=B14+1' }, { addr: 'D14', raw: '=A2*2' },
  { addr: 'E14', raw: '=A100' }, { addr: 'F14', raw: '=FOO(1)' },

  { addr: 'A16', raw: 'Cycle' },
  { addr: 'B16', raw: '=C16+1' }, { addr: 'C16', raw: '=D16+1' }, { addr: 'D16', raw: '=B16+1' }, { addr: 'E16', raw: '=B16*2' },
];
