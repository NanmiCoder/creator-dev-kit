import * as THREE from 'three';
import { clamp, hash1, hourOf, lerp, noise1, NOW, WIN_START, WIN_MS } from '../lib/util';
import { TURBINES, statusOf, type TurbineState } from './world';

/* ============================================================
   天气模型：风速 / 海浪 / 太阳高度与天空色板（确定性）
   一天：日出 06:30，日落 20:30，演示基准 20:48（日落后 18 分钟）
   ============================================================ */

export const SUN_AZ = 2.35; // 弧度，西南方向（可见水面反光路径）

export const windAt = (t: number): number => {
  const cycle = 9.2 + 3.4 * Math.sin(((t - WIN_START) / WIN_MS) * Math.PI * 2 + 1.2);
  const mid = (noise1(t / 2.1e6) - 0.5) * 2.6;   // ~35 分钟尺度
  const gust = (noise1(t / 2.6e5) - 0.5) * 1.2;   // ~4 分钟尺度
  return Math.max(3.2, cycle + mid + gust);
};

export const windAtTurbine = (t: number, id: number): number => {
  const arrayOff = [0.35, -0.15, 0.2, -0.3][id % 4];
  return windAt(t) * (1 + 0.025 * Math.sin(id * 2.71 + t / 4.2e5)) + arrayOff;
};

export const waveAt = (t: number): number => clamp(0.6 + windAt(t) * 0.14 + 0.5 * noise1(t / 1.4e6), 0.6, 3.4);

/** 太阳高度角（度）：06:30 升，20:30 落，13:30 峰值 */
export const sunElevDeg = (hour: number): number => Math.sin(((hour - 6.5) / 14) * Math.PI) * 55;

export const sunDirOf = (elevDeg: number): THREE.Vector3 => {
  const e = (elevDeg * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(e) * Math.cos(SUN_AZ),
    Math.sin(e),
    Math.cos(e) * Math.sin(SUN_AZ),
  ).normalize();
};

/* ---------------- 色板关键帧 ---------------- */
interface Stop {
  e: number;
  top: number; horizon: number; glow: number; glowStr: number;
  sun: number; sunInt: number; hemi: number;
  water: number; waterDeep: number; fog: number;
  stars: number; moon: number;
}
const STOPS: Stop[] = [
  { e: 30,  top: 0x54718c, horizon: 0xa9b8c4, glow: 0xffd9a0, glowStr: 0.0,  sun: 0xffe9c8, sunInt: 0.9,  hemi: 0.5,  water: 0x29505f, waterDeep: 0x152e3c, fog: 0x93a5b1, stars: 0,   moon: 0 },
  { e: 12,  top: 0x4d6b8d, horizon: 0xccb29a, glow: 0xffcf96, glowStr: 0.22, sun: 0xffd9a8, sunInt: 0.7,  hemi: 0.42, water: 0x294a5e, waterDeep: 0x142b3a, fog: 0xb3a893, stars: 0,   moon: 0 },
  { e: 4,   top: 0x3a5474, horizon: 0xd5a171, glow: 0xffb877, glowStr: 0.45, sun: 0xffb877, sunInt: 0.52, hemi: 0.36, water: 0x244050, waterDeep: 0x122634, fog: 0xb29275, stars: 0,   moon: 0 },
  { e: 0,   top: 0x33455f, horizon: 0xc08a5e, glow: 0xffab64, glowStr: 0.7,  sun: 0xffa866, sunInt: 0.4,  hemi: 0.32, water: 0x20394a, waterDeep: 0x101f2c, fog: 0xa5825f, stars: 0,   moon: 0 },
  { e: -3.5, top: 0x2a3950, horizon: 0x8d6549, glow: 0xff9d5c, glowStr: 1.0, sun: 0xff9d5c, sunInt: 0.3,  hemi: 0.26, water: 0x1b3343, waterDeep: 0x0e1a26, fog: 0x7a5c45, stars: 0,   moon: 0 },
  { e: -7,  top: 0x1b2534, horizon: 0x3a4450, glow: 0x6a7a8c, glowStr: 0.35, sun: 0x9fb4c8, sunInt: 0.14, hemi: 0.18, water: 0x142330, waterDeep: 0x0c141d, fog: 0x333f4a, stars: 0.5, moon: 0.5 },
  { e: -14, top: 0x101826, horizon: 0x1e2a38, glow: 0x33424f, glowStr: 0.15, sun: 0xaac4dc, sunInt: 0.1,  hemi: 0.14, water: 0x0f1c28, waterDeep: 0x090f16, fog: 0x1c2733, stars: 1,   moon: 1 },
];

export interface Palette {
  top: THREE.Color; horizon: THREE.Color; glow: THREE.Color; glowStr: number;
  sun: THREE.Color; sunInt: number; hemi: number;
  water: THREE.Color; waterDeep: THREE.Color; fog: THREE.Color;
  stars: number; moon: number;
}

const c = (hex: number) => new THREE.Color(hex);

/** 按太阳高度角采样色板（复用对象，无分配） */
export const samplePalette = (elev: number, out: Palette): Palette => {
  let lo = STOPS[0];
  let hi = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (elev >= STOPS[i].e && elev <= STOPS[i + 1].e) { lo = STOPS[i]; hi = STOPS[i + 1]; break; }
  }
  const span = hi.e - lo.e || 1;
  const f = clamp((elev - lo.e) / span, 0, 1);
  out.top.lerpColors(c(lo.top), c(hi.top), f);
  out.horizon.lerpColors(c(lo.horizon), c(hi.horizon), f);
  out.glow.lerpColors(c(lo.glow), c(hi.glow), f);
  out.sun.lerpColors(c(lo.sun), c(hi.sun), f);
  out.water.lerpColors(c(lo.water), c(hi.water), f);
  out.waterDeep.lerpColors(c(lo.waterDeep), c(hi.waterDeep), f);
  out.fog.lerpColors(c(lo.fog), c(hi.fog), f);
  out.glowStr = lerp(lo.glowStr, hi.glowStr, f);
  out.sunInt = lerp(lo.sunInt, hi.sunInt, f);
  out.hemi = lerp(lo.hemi, hi.hemi, f);
  out.stars = lerp(lo.stars, hi.stars, f);
  out.moon = lerp(lo.moon, hi.moon, f);
  return out;
};

export const makePalette = (): Palette => ({
  top: new THREE.Color(), horizon: new THREE.Color(), glow: new THREE.Color(), glowStr: 0,
  sun: new THREE.Color(), sunInt: 0, hemi: 0,
  water: new THREE.Color(), waterDeep: new THREE.Color(), fog: new THREE.Color(),
  stars: 0, moon: 0,
});

/* ---------------- 功率曲线与状态数据 ---------------- */

const CUT_IN = 3.5, RATED_W = 12.8, CUT_OUT = 25;

export const powerOf = (wind: number, state: TurbineState): number => {
  if (state === 'offline') return 0;
  if (wind < CUT_IN || wind > CUT_OUT) return 0;
  const f = clamp((Math.pow(wind, 3) - Math.pow(CUT_IN, 3)) / (Math.pow(RATED_W, 3) - Math.pow(CUT_IN, 3)), 0, 1);
  let p = 6.2 * f;
  if (state === 'derated') p *= 0.62;
  if (state === 'maintenance') p *= 0.05;
  return p;
};

export const powerAt = (t: number, id: number): number =>
  powerOf(windAtTurbine(t, id), statusOf(id));

export const farmPowerAt = (t: number): number => TURBINES.reduce((s, _, i) => s + powerAt(t, i), 0);

/** 叶轮角速度 rad/s（与风速/状态关联） */
export const rpmOf = (wind: number, state: TurbineState): number => {
  if (state === 'offline' || state === 'maintenance') return 0;
  if (wind < CUT_IN) return 0.12;
  const base = Math.min(1.35, wind * 0.105);
  return state === 'derated' ? base * 0.82 : base;
};

const VIB_BASE = [2.2, 3.0, 1.9, 2.6, 2.4, 3.2, 2.1, 2.8, 2.5, 3.4, 2.0, 2.7, 2.9, 2.3, 2.2, 3.1, 2.6, 8.7, 2.4, 2.8, 2.1, 3.3, 2.5, 2.9];

export const vibrationAt = (t: number, id: number): number => {
  const base = VIB_BASE[id];
  return base + (noise1(t / 3.6e5 + id * 1.7) - 0.5) * 0.9;
};

export const tempAt = (t: number, id: number, wind: number): number => {
  const base = 34 + wind * 0.55 + (id === 17 ? 12 : 0);
  return base + (noise1(t / 2.8e5 + id) - 0.5) * 2.4;
};

/** 偏航误差（度）：T-07 存在 11.4° 持续偏差 */
export const yawErrorAt = (t: number, id: number): number => {
  if (id === 6) return 11.4;
  return (noise1(t / 9e5 + id * 2.2) - 0.5) * 2.2;
};

/** 维护风险分 0-100（静态 + 时间微扰） */
export const riskAt = (t: number, id: number): number => {
  const vib = vibrationAt(t, id);
  const yaw = yawErrorAt(t, id);
  let r = 6;
  const st = statusOf(id);
  if (st === 'derated') r += 22;
  if (st === 'maintenance') r += 48;
  if (st === 'offline') r += 38;
  r += Math.max(0, vib - 4) * 8;
  r += Math.max(0, yaw - 3) * 4;
  return clamp(r, 0, 100);
};

/* ---------------- 派生统计 ---------------- */

const GEN_STEP = 15 * 60_000; // 15 分钟积分步长

/** 今日发电量（kWh）：从 00:00 积分至 t */
export const genTodayKWh = (t: number): number => {
  const start = new Date(t).setHours(0, 0, 0, 0);
  let sum = 0;
  for (let tt = start; tt < t; tt += GEN_STEP) sum += farmPowerAt(tt + GEN_STEP / 2);
  // P(MW) × dt(h) × 1000 → kWh
  return sum * (GEN_STEP / 3_600_000) * 1000;
};

/** 今日容量系数 */
export const utilizationOf = (t: number): number => {
  const start = new Date(t).setHours(0, 0, 0, 0);
  const hours = (t - start) / 3_600_000;
  if (hours <= 0) return 0;
  // gen(kWh) / (装机(kW) × 小时) → %
  return clamp((genTodayKWh(t) / (24 * 6.2 * 1000 * hours)) * 100, 0, 100);
};

/** 12 小时总功率曲线（5 分钟采样，用于时间轴迷你图） */
export const farmSeries = (() => {
  const n = Math.floor(WIN_MS / (5 * 60_000));
  const pts: number[] = [];
  for (let i = 0; i <= n; i++) pts.push(farmPowerAt(WIN_START + i * 5 * 60_000));
  return pts;
})();

/** 天空阶段标签 */
export const skyPhaseLabel = (t: number): string => {
  const e = sunElevDeg(hourOf(t));
  if (e > 18) return '白天';
  if (e > 4) return '黄昏';
  if (e > -6) return '余晖';
  return '夜间';
};

/** SCADA 链路质量（%） */
export const connAt = (t: number): number => {
  const dip = noise1(t / 5.2e5) > 0.82 ? 1.9 : 0;
  return Math.max(93, 98.6 - Math.abs(noise1(t / 9e4) - 0.5) * 1.4 - dip);
};

const BOOT = Date.now();

/** 当前演示时刻（实时钟从 20:48 起持续走时） */
export const liveNow = () => NOW + (Date.now() - BOOT);
