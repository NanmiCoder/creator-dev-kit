import type { ChapterDef } from "./types";
import HookChapter from "../chapters/01-hook/Hook";
import { narrations as hookNarrations } from "../chapters/01-hook/narrations";
import ShockChapter from "../chapters/02-shock/Shock";
import { narrations as shockNarrations } from "../chapters/02-shock/narrations";
import PerspectiveChapter from "../chapters/03-perspective/Perspective";
import { narrations as perspectiveNarrations } from "../chapters/03-perspective/narrations";
import BigcoChapter from "../chapters/04-bigco/Bigco";
import { narrations as bigcoNarrations } from "../chapters/04-bigco/narrations";
import HarnessChapter from "../chapters/05-harness/Harness";
import { narrations as harnessNarrations } from "../chapters/05-harness/narrations";
import TakeChapter from "../chapters/06-take/Take";
import { narrations as takeNarrations } from "../chapters/06-take/narrations";

/**
 * Order = order of presentation.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately. This guarantees the audio synthesis pipeline, the runtime
 * stepper, and the chapter `.tsx` switch on `step` cannot drift apart.
 *
 * Visual styling (color, fonts) comes entirely from the active theme —
 * chapters never hard-code palette / font names. See THEMES.md.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "hook",
    title: "钩子开场",
    narrations: hookNarrations,
    Component: HookChapter,
  },
  {
    id: "shock",
    title: "数据冲击",
    narrations: shockNarrations,
    Component: ShockChapter,
  },
  {
    id: "perspective",
    title: "三方视角",
    narrations: perspectiveNarrations,
    Component: PerspectiveChapter,
  },
  {
    id: "bigco",
    title: "大厂最新实践对照",
    narrations: bigcoNarrations,
    Component: BigcoChapter,
  },
  {
    id: "harness",
    title: "AI 编程工作流",
    narrations: harnessNarrations,
    Component: HarnessChapter,
  },
  {
    id: "take",
    title: "结论 + 互动",
    narrations: takeNarrations,
    Component: TakeChapter,
  },
];