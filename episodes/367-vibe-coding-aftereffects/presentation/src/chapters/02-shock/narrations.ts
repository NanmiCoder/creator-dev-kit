import type { Narration } from "../../registry/types";

/**
 * Chapter 02 · shock — 5 steps / ~38 秒
 *
 * 数组长度 === Shock.tsx 里 `if (step === N)` 出现的最大 N + 1。
 * 这是音频合成 + Auto 模式自动推进的唯一真相源,务必与 script.md 段 4-8 语义一致。
 *
 * 视觉动画时长必须 ≤ 该 step 的 mp3 时长 —— Auto 模式严格按音频结束推进。
 * mp3 文件在 `presentation/public/audio/shock/{1..5}.mp3`,由
 * ffmpeg 把 `segments_audio/seg_04~08.mp3` 整段复制(本章节每段 step = 一段 seg,无需再切)。
 */
export const narrations: Narration[] = [
  // step 0 — 三栏症状(对应 script 段 4;mp3: 1.mp3 = 12.36s)
  // 三连击:电话线路并发一高就崩 / 在线·语音沉默超时丢上下文 / 人工客服反过来救火
  "电话线路并发一高就崩,在线客服和语音客服会沉默、超时、丢上下文。最后不是效率提升了,而是人工客服反过来救火。",

  // step 1 — 反差短屏(对应 script 段 5;mp3: 2.mp3 = 3.58s)
  // 「真正吓人的不是 bug 多」—— 留白短屏
  "但这个帖子真正吓人的,不是 bug 多。",

  // step 2 — pull-quote 引述 OP 原话(对应 script 段 6;mp3: 3.mp3 = 8.61s)
  // 脱离 AI 没人能看懂,没人能改了
  "真正吓人的是 OP 后面补了一句:现在这个项目脱离 AI,已经没人能看懂,没人能改了。",

  // step 3 — 金句落点(对应 script 段 7;mp3: 4.mp3 = 3.54s)
  // vibe coding 最大的后遗症
  "这句话我觉得就是 vibe coding 最大的后遗症。",

  // step 4 — 重新框定 + 三动词揭示(对应 script 段 8;mp3: 5.mp3 = 8.06s)
  // 团队失去了理解、验证、维护它的能力
  "不是 AI 写不出代码,而是代码写出来以后,团队失去了理解、验证、维护它的能力。",
];