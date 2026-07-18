import type { Narration } from "../../registry/types";

/**
 * Chapter 05 · harness — 5 steps
 *
 * 数组长度 === Harness.tsx 里 `if (step === N)` 出现的最大 N + 1。
 * 这是音频合成 + Auto 模式自动推进的唯一真相源,务必与 script.md 对应段落语义一致。
 *
 * 视觉动画时长必须 ≤ 该 step 的 mp3 时长 —— Auto 模式严格按音频结束推进。
 * mp3 文件在 `presentation/public/audio/harness/{1..5}.mp3`,由
 * ffmpeg 从 `segments_audio/seg_24~28.mp3` 整段取用,精度 ±0.01s。
 */
export const narrations: Narration[] = [
  // step 0 — 总命题:从 vibe coding 走向 harness coding(对应 script 段 24;mp3: 1.mp3 = 5.631s)
  "所以关键不是回到手敲代码,而是从 vibe coding 走向 harness coding。",

  // step 1 — 定义句:harness = 给 AI 装轨道(对应 script 段 25;mp3: 2.mp3 = 4.052s)
  "harness 这个词你可以理解成给 AI 装轨道。",

  // step 2 — 三不是第一栏:先写清业务流程 / 性能 / 兜底 / 边界(对应 script 段 26;mp3: 3.mp3 = 10.832s)
  "不是一句帮我做个客服 Agent,然后让它自由发挥。而是先把业务流程、性能指标、失败兜底、模块边界写清楚。",

  // step 3 — 三不是第二栏:分支 / worktree / sandbox / 预览环境(对应 script 段 27;mp3: 4.mp3 = 7.245s)
  "不是让 AI 直接碰主干和生产,而是在分支、worktree、sandbox、预览环境里改。",

  // step 4 — 三不是第三栏:测试 / diff review / 灰度 / 回滚(对应 script 段 28;mp3: 5.mp3 = 6.827s)
  "不是能跑就合,而是每个改动都要有测试、diff review、灰度和回滚。",
];