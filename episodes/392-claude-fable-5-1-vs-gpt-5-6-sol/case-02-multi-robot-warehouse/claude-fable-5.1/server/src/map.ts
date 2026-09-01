import { mulberry32, shuffle } from './rng.js';
import type { Point, Shelf, WarehouseMap, Workstation } from '../../shared/types.js';

export const MAP_W = 32;
export const MAP_H = 21;
export const ROBOT_COUNT = 8;

/**
 * Deterministic warehouse layout (same seed => identical map):
 *  y=1        workstations (alcoves in the top wall)
 *  y=2..3     top corridor (2 wide)
 *  y=4..6     wall band pierced by three 1-cell-wide, 3-cell-long bottleneck corridors
 *  y=7..8     cross aisle
 *  y=9..11    rack zone A: vertical racks separated by 1-cell-wide aisles
 *  y=12..13   cross aisle
 *  y=14..16   rack zone B: vertical racks separated by 2-cell-wide aisles
 *  y=17..18   cross aisle
 *  y=19       robot docks (alcoves in the bottom wall)
 */
export function generateMap(seed: number): WarehouseMap {
  const W = MAP_W;
  const H = MAP_H;
  const rng = mulberry32(seed);
  const g: string[][] = Array.from({ length: H }, () => Array<string>(W).fill('.'));

  for (let x = 0; x < W; x++) {
    g[0][x] = '#';
    g[H - 1][x] = '#';
  }
  for (let y = 0; y < H; y++) {
    g[y][0] = '#';
    g[y][W - 1] = '#';
  }

  // Workstations
  for (let x = 1; x < W - 1; x++) g[1][x] = '#';
  const wsX = [6, 12, 18, 24];
  const workstations: Workstation[] = wsX.map((x, i) => {
    g[1][x] = 'W';
    return { id: `W${i + 1}`, x, y: 1 };
  });

  // Wall band with narrow corridors (bottlenecks between storage and workstations)
  const candidates = shuffle([3, 8, 13, 18, 23, 28], rng);
  const openings = candidates.slice(0, 3).sort((a, b) => a - b);
  const narrowAisles: Point[] = [];
  for (let y = 4; y <= 6; y++) {
    for (let x = 1; x < W - 1; x++) {
      if (openings.includes(x)) {
        g[y][x] = '.';
        narrowAisles.push({ x, y });
      } else {
        g[y][x] = '#';
      }
    }
  }

  // Rack zone A (narrow 1-wide aisles) and zone B (2-wide aisles)
  const slots: Point[] = [];
  for (let x = 5; x <= 27; x += 2) for (let y = 9; y <= 11; y++) slots.push({ x, y });
  for (let x = 4; x <= 28; x += 3) for (let y = 14; y <= 16; y++) slots.push({ x, y });
  const keep = slots.map(() => rng() < 0.62);
  let count = keep.filter(Boolean).length;
  for (let i = 0; i < slots.length && count < 24; i++) {
    if (!keep[i]) {
      keep[i] = true;
      count++;
    }
  }
  slots.forEach((p, i) => {
    if (keep[i]) g[p.y][p.x] = 'S';
  });
  // Narrow aisle cells of zone A (between racks) are bottlenecks as well
  for (let x = 6; x <= 26; x += 2) {
    for (let y = 9; y <= 11; y++) {
      if (g[y][x - 1] === 'S' && g[y][x + 1] === 'S') narrowAisles.push({ x, y });
    }
  }

  // Docks
  for (let x = 1; x < W - 1; x++) g[19][x] = '#';
  const dockX = [3, 6, 9, 12, 15, 18, 21, 24];
  const docks: Point[] = dockX.map((x) => {
    g[19][x] = 'D';
    return { x, y: 19 };
  });

  const shelves: Shelf[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (g[y][x] === 'S') shelves.push({ id: `S${shelves.length + 1}`, x, y });
    }
  }

  return {
    width: W,
    height: H,
    seed,
    cells: g.map((r) => r.join('')).join(''),
    shelves,
    workstations,
    docks,
    narrowAisles,
  };
}
