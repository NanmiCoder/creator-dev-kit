import type { Narration } from "../../registry/types";

/**
 * Chapter 01 · hook — 6 steps
 *
 * 数组长度 === Hook.tsx 里 `if (step === N)` 出现的最大 N + 1。
 * 这是音频合成 + Auto 模式自动推进的唯一真相源,务必与 script.md 对应段落语义一致。
 *
 * 视觉动画时长必须 ≤ 该 step 的 mp3 时长 —— Auto 模式严格按音频结束推进。
 * mp3 文件在 `presentation/public/audio/hook/{1..6}.mp3`,由
 * ffmpeg + STT 时间戳从 `segments_audio/seg_01~03.mp3` 切分,精度 ±0.01s。
 */
export const narrations: Narration[] = [
  // step 0 — masthead + "很扎心" 钩子(对应 script 段 1;mp3: 1.mp3 = 3.703s)
  "这两天 V2EX 有个帖子很扎心。",

  // step 1 — 客服 Agent + 替代目标(对应 script 段 2 前半;mp3: 2.mp3 = 6.400s)
  "一家公司年初开始做客服 Agent,想替代一部分在线客服和电话客服,",

  // step 2 — 团队构成(对应 script 段 2 中段;mp3: 3.mp3 = 6.200s)
  "团队里没有专门的 AI Agent 工程师,主要是 Java 和前端同学。",

  // step 3 — Codex 赶工(对应 script 段 2 后段;mp3: 4.mp3 = 3.944s)
  "于是大家一边学,一边用 Codex 这类工具赶进度。",

  // step 4 — v1 上线(对应 script 段 3 前半;mp3: 5.mp3 = 2.860s)
  "几个月后,第一版上线了。",

  // step 5 — 反转(对应 script 段 3 后半;mp3: 6.mp3 = 1.580s)
  "然后问题开始爆。",
];