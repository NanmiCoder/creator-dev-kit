import type { Narration } from "../../registry/types";

/**
 * Chapter 04 · bigco — 大厂最新实践对照
 * 7 steps / ~83 秒。
 *
 * 与 script.md 段 17-23 一一对应(语义一致,可微调标点断句以适配 TTS):
 *   段 17 / step 0 — 转场:「这里要更新一个认知」
 *   段 18 / step 1 — 反共识:「已经不是要不要用 AI 写代码的时代了」
 *   段 19 / step 2 — 四家大厂共识总览
 *   段 20 / step 3 — 微软 .NET runtime 10 个月复盘(每个 PR AI review)
 *   段 21 / step 4 — GitHub Copilot cloud agent(5 个入口 + medium-depth review)
 *   段 22 / step 5 — OpenAI Codex 工作流(AGENTS.md + 100% PR review)
 *   段 23 / step 6 — Cloudflare vinext 极端样本(1700 Vitest + 380 Playwright)
 *
 * mp3 时长一览(`presentation/public/audio/bigco/{1..7}.mp3` 由
 * `segments_audio/seg_17.mp3 ~ seg_23.mp3` 用 ffmpeg 切分,精度 ±0.01s):
 *   1.mp3  ~2.04s   2.mp3  ~3.62s   3.mp3 ~11.47s   4.mp3 ~16.21s
 *   5.mp3 ~21.13s   6.mp3 ~22.74s   7.mp3 ~15.14s
 *
 * 视觉动画时长必须 ≤ 该 step 的 mp3 时长 —— Auto 模式严格按音频结束推进。
 */
export const narrations: Narration[] = [
  // step 0 — 转场(对应 script 段 17;mp3 1.mp3 = 2.04s)
  "这里要更新一个认知。",

  // step 1 — 反共识(对应 script 段 18;mp3 2.mp3 = 3.62s)
  "现在已经不是要不要用 AI 写代码的时代了。",

  // step 2 — 大厂共识总览(对应 script 段 19;mp3 3.mp3 = 11.47s)
  "最新的大厂实践,是默认 AI 参与写代码、查代码、改代码、提 PR。真正的差距在于,有没有把它放进工程流水线。",

  // step 3 — 微软 .NET(对应 script 段 20;mp3 4.mp3 = 16.21s)
  "微软 .NET runtime 团队最近复盘十个月 Copilot Coding Agent。他们现在不是偶尔让 AI 写点代码,而是每个 PR,不管人写的、AI 写的,还是外部贡献者写的,都会收到 AI review。",

  // step 4 — GitHub(对应 script 段 21;mp3 5.mp3 = 21.13s)
  "GitHub 也在往这个方向走。Copilot cloud agent 可以从 issue、GitHub Actions、IDE、Slack、Jira 启动,在后台干活,最后开 PR。Copilot code review 也开始支持 medium-depth review,把复杂 PR 路由给更强的推理模型。",

  // step 5 — OpenAI Codex(对应 script 段 22;mp3 6.mp3 = 22.74s)
  "OpenAI Codex 的官方建议也不是让它帮你写一下,而是把 AGENTS.md、测试命令、PR 预期、code review markdown 都写清楚。Codex 不只是生成代码,还要补测试、跑检查、review diff。OpenAI 也说,Codex 会 review 他们百分之百的 PR。",

  // step 6 — Cloudflare vinext(对应 script 段 23;mp3 7.mp3 = 15.14s)
  "Cloudflare 的 vinext 更极端,几乎每一行代码都是 AI 写的,但一千七百多个 Vitest、三百八十个 Playwright E2E、TypeScript、lint、CI,每个 PR 都跑。",
];
