export type MetricKey = 'overall' | 'vrel' | 'count' | 'attr' | 'depth' | 'loc' | 'comp' | 'fgr' | 'ctx' | 'ocr' | 'hallu'

export type ModelScore = {
  name: string
  overall: number
  vrel: number
  count: number
  attr: number
  depth: number
  loc: number
  comp: number
  fgr: number
  ctx: number
  ocr: number
  hallu: number
  highlighted?: boolean
}

export const metrics: { key: MetricKey; short: string; label: string }[] = [
  { key: 'overall', short: 'All', label: '总分' },
  { key: 'vrel', short: 'VRel', label: '视觉关系' },
  { key: 'count', short: 'Count', label: '计数' },
  { key: 'attr', short: 'Attr', label: '属性' },
  { key: 'depth', short: 'Depth', label: '深度与 3D' },
  { key: 'loc', short: 'Loc', label: '定位' },
  { key: 'comp', short: 'Comp', label: '比较' },
  { key: 'fgr', short: 'FGR', label: '细粒度识别' },
  { key: 'ctx', short: 'Ctx', label: '上下文整合' },
  { key: 'ocr', short: 'OCR', label: '光学字符识别' },
  { key: 'hallu', short: 'Hallu', label: '感知幻觉' },
]

export const models: ModelScore[] = [
  { name: 'GPT-5.6-Sol', overall: 59.7, vrel: 69.7, count: 62.4, attr: 62.1, depth: 55.5, loc: 76.7, comp: 67.0, fgr: 55.9, ctx: 60.0, ocr: 54.9, hallu: 26.9 },
  { name: 'Kimi K3', overall: 58.5, vrel: 68.2, count: 59.7, attr: 59.4, depth: 52.4, loc: 70.3, comp: 59.1, fgr: 55.9, ctx: 53.3, ocr: 61.2, hallu: 41.7 },
  { name: 'Claude-Fable-5', overall: 57.2, vrel: 58.5, count: 52.9, attr: 60.9, depth: 51.5, loc: 70.4, comp: 56.1, fgr: 51.6, ctx: 59.8, ocr: 64.3, hallu: 45.0 },
  { name: 'Gemini-3.1-Pro', overall: 56.2, vrel: 58.8, count: 56.9, attr: 61.8, depth: 50.0, loc: 52.7, comp: 61.7, fgr: 54.8, ctx: 61.2, ocr: 64.3, hallu: 40.6 },
  { name: 'GPT-5.5', overall: 55.8, vrel: 61.9, count: 55.8, attr: 60.9, depth: 48.8, loc: 65.8, comp: 65.6, fgr: 47.2, ctx: 58.0, ocr: 56.5, hallu: 34.7 },
  { name: 'Seed-2.1-Pro', overall: 55.0, vrel: 57.6, count: 51.2, attr: 58.2, depth: 43.6, loc: 50.0, comp: 59.5, fgr: 56.6, ctx: 60.4, ocr: 66.7, hallu: 49.8 },
  { name: 'Gemini-3.5-Flash', overall: 52.0, vrel: 53.6, count: 43.6, attr: 54.5, depth: 49.7, loc: 50.6, comp: 54.8, fgr: 51.7, ctx: 53.3, ocr: 59.6, hallu: 50.6 },
  { name: 'Qwen3.7-Plus', overall: 51.1, vrel: 59.1, count: 53.3, attr: 55.8, depth: 48.5, loc: 52.7, comp: 55.9, fgr: 46.8, ctx: 52.2, ocr: 54.5, hallu: 29.5 },
  { name: 'Qwen3.5-397B-A17B', overall: 47.5, vrel: 55.2, count: 49.1, attr: 53.0, depth: 44.6, loc: 46.7, comp: 49.8, fgr: 44.8, ctx: 50.2, ocr: 52.9, hallu: 26.9 },
  { name: 'Claude-Opus-4.8', overall: 47.2, vrel: 51.4, count: 44.2, attr: 49.4, depth: 40.6, loc: 58.8, comp: 48.4, fgr: 40.7, ctx: 44.7, ocr: 54.1, hallu: 38.7 },
  { name: 'Kimi K2.6', overall: 42.6, vrel: 50.9, count: 45.2, attr: 43.6, depth: 42.4, loc: 45.2, comp: 39.1, fgr: 34.5, ctx: 40.4, ocr: 40.8, hallu: 41.0 },
  { name: 'Grok-4.5', overall: 41.0, vrel: 47.0, count: 35.2, attr: 39.4, depth: 41.2, loc: 39.7, comp: 43.7, fgr: 36.2, ctx: 39.6, ocr: 43.9, hallu: 44.7 },
  { name: 'Gemma-4-31B', overall: 40.7, vrel: 42.7, count: 33.9, attr: 40.3, depth: 39.1, loc: 44.9, comp: 43.7, fgr: 39.0, ctx: 45.9, ocr: 46.7, hallu: 32.1 },
  { name: 'GLM-5V-Turbo', overall: 39.6, vrel: 41.2, count: 40.0, attr: 41.2, depth: 41.2, loc: 43.9, comp: 45.2, fgr: 36.6, ctx: 32.9, ocr: 43.5, hallu: 28.0 },
  { name: 'DeepSeek V4 Flash Vision Exp', overall: 34.9, vrel: 43.6, count: 29.7, attr: 40.0, depth: 33.9, loc: 31.2, comp: 34.4, fgr: 26.2, ctx: 34.5, ocr: 40.0, hallu: 35.8, highlighted: true },
  { name: 'Minimax-M3', overall: 33.1, vrel: 40.0, count: 30.3, attr: 34.6, depth: 36.7, loc: 33.3, comp: 31.2, fgr: 26.6, ctx: 31.0, ocr: 35.7, hallu: 29.9 },
  { name: 'GLM-4.6V', overall: 32.5, vrel: 35.2, count: 31.8, attr: 35.2, depth: 29.1, loc: 30.6, comp: 34.8, fgr: 29.3, ctx: 33.7, ocr: 39.2, hallu: 26.9 },
]

export const deepseek = models.find((model) => model.highlighted) as ModelScore
