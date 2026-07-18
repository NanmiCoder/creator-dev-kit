import type { Narration } from "../../registry/types";

/**
 * Chapter 03 · perspective — 8 steps
 *
 * 数组长度 === Perspective.tsx 里 `if (step === N)` 出现的最大 N + 1。
 * 这是音频合成 + Auto 模式自动推进的唯一真相源,**务必与 script.md 对应段落
 * verbatim 一致** —— 标点 / 断句可保留可微调,但**关键短语 / 事实 / 数字 / 引用
 * 不得改写、不得合成、不得省略**。违例会触发内容准确性违约(见 verifier feedback)。
 *
 * 视觉动画时长必须 ≤ 该 step 的 mp3 时长 —— Auto 模式严格按音频结束推进。
 * mp3 文件在 `presentation/public/audio/perspective/{1..8}.mp3`,由
 * ffmpeg + STT 时间戳从 `segments_audio/seg_09~16.mp3` 切分,精度 ±0.01s。
 *
 * NOTE: step 0 / step 1 的音频切分边界与 script 段 9 / 段 10 的语义边界**不完全对齐**
 * (silence-based split 把"还有一派说..."部分塞到了 step 1)。视觉上 step 0 已将
 * 第三派作为 teaser 占位,step 1 揭晓全部内容 —— 避免 step 0 UI 抢先展示 step 1
 * 才揭晓的事实。
 */
export const narrations: Narration[] = [
  // step 0 — 评论区三派(对应 script 段 9;mp3: 1.mp3 = 15.395s)
  "评论区其实也分成三派:一派说这是 AI 大跃进和 KPI 产物;一派说不能全怪 AI,客服 Agent 本来就不是百分之百确定性的产品,怎么能不灰度就直接影响真实用户?",

  // step 1 — 第三派揭晓(对应 script 段 10;mp3: 2.mp3 = 12.283s)
  "还有一派说,AI 可以大量写代码,甚至百分之百 AI 写,但前提是先把单元测试、Lint、代码规范、架构边界搭好。",

  // step 2 — 转折短屏(对应 script 段 11;mp3: 3.mp3 = 2.554s)
  "这一点我自己也很有感触。",

  // step 3 — AI 真快 + 4 类产物(对应 script 段 12;mp3: 4.mp3 = 11.169s)
  "我做开源项目的时候,一开始也会觉得 AI 写得真的快。UI、重复代码、测试脚本、迁移脚本,它都能很快堆出来。",

  // step 4 — 真正消耗(对应 script 段 13;mp3: 5.mp3 = 7.338s)
  "但后面你会发现,真正消耗时间的不是让它写出来,而是确认它没有埋雷。",

  // step 5 — 我的工作流矩阵(对应 script 段 14;mp3: 6.mp3 = 14.245s)
  "所以我后面基本都会补单元测试、看覆盖率、跑自动化测试。前端用浏览器 E2E 点页面,桌面端用 Computer Use 做验证,关键路径再人工过一遍。",

  // step 6 — 妥协(对应 script 段 15;mp3: 7.mp3 = 3.959s)
  "但就算做到这些,还是会有意想不到的 bug。",

  // step 7 — 金句收束(对应 script 段 16;mp3: 8.mp3 = 9.427s)
  "所以测试不是银弹,但没有测试就是裸奔。真正要补的是一整套工作流,不是几个测试用例。",
];