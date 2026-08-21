/* 确定性噪声与格式化工具 */

/** 一维哈希：稳定、可复现 */
export const hash1 = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

/** 二维哈希 */
export const hash2 = (x: number, y: number): number => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const smooth = (f: number) => f * f * (3 - 2 * f);

/** 一维值噪声（平滑） */
export const noise1 = (t: number): number => {
  const i = Math.floor(t);
  const f = t - i;
  const u = smooth(f);
  return hash1(i) * (1 - u) + hash1(i + 1) * u;
};

/** 二维值噪声（平滑） */
export const noise2 = (x: number, y: number): number => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = smooth(fx);
  const uy = smooth(fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
};

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/** 以种子生成稳定伪随机序列 */
export const seeded = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/* ---------- 时间锚点 ---------- */
const MS_MIN = 60_000;
const MS_HOUR = 3_600_000;
export const DAY_START = new Date();
DAY_START.setHours(0, 0, 0, 0);

/** 演示基准时刻：今日 20:48（日落 20:30 后 18 分钟） */
export const NOW = DAY_START.getTime() + (20 * 60 + 48) * MS_MIN;
export const WIN_MS = 12 * MS_HOUR;
export const WIN_START = NOW - WIN_MS;

export const hourOf = (t: number) => ((t - DAY_START.getTime()) / MS_HOUR + 24) % 24;

export const fmtTime = (t: number, withSec = false) => {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return withSec
    ? `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
    : `${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const fmtDate = (t: number) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
};

export const fmtMW = (v: number) => (v >= 100 ? v.toFixed(1) : v.toFixed(2));

export const fmtGWh = (kWh: number) => {
  if (kWh >= 1_000_000) return (kWh / 1_000_000).toFixed(2);
  if (kWh >= 1_000) return (kWh / 1_000).toFixed(1);
  return kWh.toFixed(0);
};
