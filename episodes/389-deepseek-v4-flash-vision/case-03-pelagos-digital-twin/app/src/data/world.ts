import { seeded } from '../lib/util';

/* ============================================================
   风场布局：A/B/C/D 四阵列 × 6 台 = 24 台海上风机
   阵列沿 X 排列，阵列间距 700m，整体绕场心旋转 -12°
   ============================================================ */

export type TurbineState = 'normal' | 'derated' | 'offline' | 'maintenance';

export interface TurbineDef {
  id: number;
  code: string;          // T-01 .. T-24
  array: string;         // A | B | C | D
  indexInArray: number;  // 1..6
  x: number;
  z: number;
  baseYaw: number;       // 机舱朝向（转子轴对准来风）
  status: TurbineState;
  ratedMW: number;
}

export const ARRAYS = ['A', 'B', 'C', 'D'] as const;
export const ARRAY_Z = [560, -140, -840, -1540];
export const SPACING = 520;
export const FIELD_CENTER = { x: 0, z: -490 };
export const HUB_Y = 88;
export const ROTOR_R = 57;       // 叶轮半径（含轮毂）≈ 117m 直径
export const TOTAL_RATED_MW = 24 * 6.2;

const STATUS: Record<number, TurbineState> = {
  4: 'derated',   // T-05 限功率（调度指令）
  6: 'derated',   // T-07 偏航误差
  13: 'derated',  // T-14 限功率
  17: 'maintenance', // T-18 齿轮箱振动 → 待维护
  21: 'offline',  // T-22 SCADA 信号中断
};

const ROT = (-12 * Math.PI) / 180;
const cosR = Math.cos(ROT);
const sinR = Math.sin(ROT);

export const TURBINES: TurbineDef[] = (() => {
  const rng = seeded(20240917);
  const list: TurbineDef[] = [];
  let id = 0;
  for (let a = 0; a < 4; a++) {
    for (let i = 0; i < 6; i++) {
      const dx = -1300 + i * SPACING + (rng() - 0.5) * 70;
      const dz = ARRAY_Z[a] + (rng() - 0.5) * 60;
      // 绕场心旋转
      const px = dx - FIELD_CENTER.x;
      const pz = dz - FIELD_CENTER.z;
      const x = FIELD_CENTER.x + px * cosR - pz * sinR;
      const z = FIELD_CENTER.z + px * sinR + pz * cosR;
      list.push({
        id,
        code: `T-${String(id + 1).padStart(2, '0')}`,
        array: ARRAYS[a],
        indexInArray: i + 1,
        x,
        z,
        baseYaw: 0,
        status: STATUS[id] ?? 'normal',
        ratedMW: 6.2,
      });
      id++;
    }
  }
  // 机舱朝向：来风约 255°（WSW），转子轴朝上风向
  for (const t of list) {
    t.baseYaw = 255 + (hash(t.id * 7.13) - 0.5) * 4;
  }
  return list;
})();

function hash(n: number): number {
  const s = Math.sin(n * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

/** 远处风场层次（轮廓剪影，不参与交互） */
export interface Silhouette { x: number; z: number; s: number; yaw: number; }
export const SILHOUETTES: Silhouette[] = (() => {
  const rng = seeded(77103);
  const list: Silhouette[] = [];
  const rings = [
    { r: 2500, n: 14, spread: 1.9 },
    { r: 3050, n: 12, spread: 2.2 },
    { r: 3550, n: 9, spread: 2.5 },
  ];
  for (const ring of rings) {
    for (let i = 0; i < ring.n; i++) {
      // 集中于西北象限（远处海平线）
      const ang = Math.PI * 0.78 + (i / ring.n) * ring.spread + (rng() - 0.5) * 0.18;
      list.push({
        x: Math.cos(ang) * (ring.r + (rng() - 0.5) * 200),
        z: Math.sin(ang) * (ring.r + (rng() - 0.5) * 200),
        s: 0.86 + rng() * 0.2,
        yaw: rng() * Math.PI,
      });
    }
  }
  return list;
})();

export const turbineById = (id: number | null) => (id === null ? undefined : TURBINES[id]);
export const codeOf = (id: number | null) => (id === null ? '—' : TURBINES[id]?.code ?? '—');

/* 运行态状态覆盖（如 SCADA 重连成功） */
const overrides: Record<number, TurbineState> = {};
export const setStatusOverride = (id: number, st: TurbineState | null) => {
  if (st === null) delete overrides[id];
  else overrides[id] = st;
};
export const statusOf = (id: number): TurbineState => overrides[id] ?? TURBINES[id].status;
export const isRecovered = (id: number): boolean => overrides[id] !== undefined;
