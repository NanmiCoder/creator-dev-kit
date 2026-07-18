import type { Narration } from "../../registry/types";

/**
 * Chapter 06 · take — 结论 + 互动
 * 8 步 / ~57 秒。每句话一个画面,跨步即切屏。
 *
 * 节拍:
 *   step 0 — 转折:不是不要用 AI,恰恰相反,我也用它写(反驳预期)
 *   step 1 — 转变:越来越不敢只看快不快;4 个动词放大(测试/review/回滚/看得懂)
 *   step 2 — 主金句:AI 让代码变便宜了,但让理解、验证、架构和责任变贵了(双行排版)
 *   step 3 — 回扣:这才是 vibe coding 最大的后遗症(闭环到 Chapter 2 step 7)
 *   step 4 — 互动引子:评论区我想问你一个问题(短屏转场)
 *   step 5 — 二选一:Accept All 派 vs Review All 派(双卡对峙)
 *   step 6 — 二次互动:把最崩溃的经历打在评论区(评论框 mockup)
 *   step 7 — 签名:阿江 / 我们下期见 / 拜拜
 *
 * 视觉动画时长必须 ≤ 该 step 的 mp3 时长 —— Auto 模式严格按音频结束推进。
 * mp3 文件在 `presentation/public/audio/take/{1..8}.mp3`,由
 * ffmpeg + STT 时间戳从 `segments_audio/seg_29~36.mp3` 切分,精度 ±0.01s。
 */
export const narrations: Narration[] = [
  // step 0 — 转折(对应 script 段 29;mp3: 1.mp3 = 8.742s)
  "所以这期我的结论不是不要用 AI 写代码。恰恰相反,我现在很多代码也会让 AI 写。",

  // step 1 — 转变 · 4 个动词(对应 script 段 30;mp3: 2.mp3 = 8.951s)
  "但我越来越不敢只看它快不快,我更关心它能不能被测试、被 review、被回滚、被下一个人看懂。",

  // step 2 — 主金句(对应 script 段 31;mp3: 3.mp3 = 6.223s)
  "AI 让代码变便宜了,但让理解、验证、架构和责任变贵了。",

  // step 3 — 回扣(对应 script 段 32;mp3: 4.mp3 = 2.856s)
  "这才是 vibe coding 最大的后遗症。",

  // step 4 — 互动引子(对应 script 段 33;mp3: 5.mp3 = 3.274s)
  "最后评论区我想问你一个问题。",

  // step 5 — 二选一互动(对应 script 段 34;mp3: 6.mp3 = 6.095s)
  "你现在用 AI 写代码,是 Accept All 派,还是 Review All 派?",

  // step 6 — 二次互动(对应 script 段 35;mp3: 7.mp3 = 5.793s)
  "如果你接手过 AI 写出来的项目,也可以把最崩溃的经历打在评论区。",

  // step 7 — 签名(对应 script 段 36;mp3: 8.mp3 = 6.560s)
  "好,这就是这期视频的全部内容。我是阿江,我们下期见,拜拜。",
];