import type { ChapterDef } from "./types";
import Open from "../chapters/01-open/Open";
import { narrations as openNarrations } from "../chapters/01-open/narrations";
import Models from "../chapters/02-models/Models";
import { narrations as modelsNarrations } from "../chapters/02-models/narrations";
import Score from "../chapters/03-score/Score";
import { narrations as scoreNarrations } from "../chapters/03-score/narrations";
import Security from "../chapters/04-security/Security";
import { narrations as securityNarrations } from "../chapters/04-security/narrations";
import Metr from "../chapters/05-metr/Metr";
import { narrations as metrNarrations } from "../chapters/05-metr/narrations";
import Verdict from "../chapters/06-verdict/Verdict";
import { narrations as verdictNarrations } from "../chapters/06-verdict/narrations";
import Deepswe from "../chapters/07-deepswe/Deepswe";
import { narrations as deepsweNarrations } from "../chapters/07-deepswe/narrations";
import Outro from "../chapters/08-outro/Outro";
import { narrations as outroNarrations } from "../chapters/08-outro/narrations";

// 本期 8 章 / 36 步 · GPT-5.6 发布。整段口播 vo-full.mp3 + timeline.ts 绝对时间驱动翻页。
export const CHAPTERS: ChapterDef[] = [
  { id: "open", title: "开场 · 最强模型，你却用不上", narrations: openNarrations, Component: Open },
  { id: "models", title: "三个型号 · Sol / Terra / Luna", narrations: modelsNarrations, Component: Models },
  { id: "score", title: "91.9 怎么来的 + 真榜缺席", narrations: scoreNarrations, Component: Score },
  { id: "security", title: "网安 · 别被「最强」带跑", narrations: securityNarrations, Component: Security },
  { id: "metr", title: "第三方 METR · 能力边界", narrations: metrNarrations, Component: Metr },
  { id: "verdict", title: "裁决 · 权限才稀缺 + 选型", narrations: verdictNarrations, Component: Verdict },
  { id: "deepswe", title: "抖包袱 · DeepSWE 真榜", narrations: deepsweNarrations, Component: Deepswe },
  { id: "outro", title: "结尾 · CTA", narrations: outroNarrations, Component: Outro },
];
