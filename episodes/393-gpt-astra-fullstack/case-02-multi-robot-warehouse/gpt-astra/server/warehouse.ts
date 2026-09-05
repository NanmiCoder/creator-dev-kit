import type { Warehouse, Shelf } from '../shared/types.js';

export const SEED = 2408;
export function createWarehouse(): Warehouse {
  const shelves: Shelf[] = [];
  // Paired shelf banks create five genuinely one-cell-wide vertical aisles.
  // Three cross aisles let complete space-time routes wait or take a detour.
  for (let bank = 0; bank < 6; bank++) {
    const x = 5 + bank * 3;
    for (const y of [4, 5, 6, 7, 10, 11, 12, 13]) {
      for (let side = 0; side < 2; side++) {
        const n = shelves.length + 1;
        shelves.push({ id: `S${String(n).padStart(2, '0')}`, x: x + side, y,
          pickup: { x: side === 0 ? x - 1 : x + 2, y }, zone: String.fromCharCode(65 + bank) });
      }
    }
  }
  return { width: 27, height: 19, seed: SEED, shelves,
    stations: [
      { id: 'WS-01', name: 'Packing', x: 25, y: 4 },
      { id: 'WS-02', name: 'Dispatch', x: 25, y: 7 },
      { id: 'WS-03', name: 'Quality', x: 25, y: 11 },
      { id: 'WS-04', name: 'Outbound', x: 25, y: 14 },
    ],
    homes: Array.from({ length: 8 }, (_, i) => ({ x: 1, y: 2 + i * 2 })),
    walls: [...Array.from({ length: 27 }, (_, x) => [{ x, y: 0 }, { x, y: 18 }]).flat(),
      ...Array.from({ length: 17 }, (_, i) => [{ x: 0, y: i + 1 }, { x: 26, y: i + 1 }]).flat()],
  };
}
