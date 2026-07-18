import type { ChapterDef } from "./types";
import MidnightTestChapter from "../chapters/01-midnight-test/MidnightTest";
import { narrations as midnightTestNarrations } from "../chapters/01-midnight-test/narrations";
import CostSignalChapter from "../chapters/02-cost-signal/CostSignal";
import { narrations as costSignalNarrations } from "../chapters/02-cost-signal/narrations";
import ReviewCriteriaChapter from "../chapters/03-review-criteria/ReviewCriteria";
import { narrations as reviewCriteriaNarrations } from "../chapters/03-review-criteria/narrations";
import ApplicationMethodChapter from "../chapters/04-application-method/ApplicationMethod";
import { narrations as applicationMethodNarrations } from "../chapters/04-application-method/narrations";
import StartFromZeroChapter from "../chapters/05-start-from-zero/StartFromZero";
import { narrations as startFromZeroNarrations } from "../chapters/05-start-from-zero/narrations";
import OpenSourceFlywheelChapter from "../chapters/06-open-source-flywheel/OpenSourceFlywheel";
import { narrations as openSourceFlywheelNarrations } from "../chapters/06-open-source-flywheel/narrations";
import CompoundReturnChapter from "../chapters/07-compound-return/CompoundReturn";
import { narrations as compoundReturnNarrations } from "../chapters/07-compound-return/narrations";

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
    id: "free-hook-official-page",
    title: "开场与官方入口",
    narrations: midnightTestNarrations,
    Component: MidnightTestChapter,
  },
  {
    id: "cost-signal",
    title: "成本与反馈信号",
    narrations: costSignalNarrations,
    Component: CostSignalChapter,
  },
  {
    id: "review-criteria",
    title: "审核到底看什么",
    narrations: reviewCriteriaNarrations,
    Component: ReviewCriteriaChapter,
  },
  {
    id: "application-method",
    title: "怎么申请",
    narrations: applicationMethodNarrations,
    Component: ApplicationMethodChapter,
  },
  {
    id: "start-from-zero",
    title: "从 0 开始",
    narrations: startFromZeroNarrations,
    Component: StartFromZeroChapter,
  },
  {
    id: "open-source-flywheel",
    title: "开源飞轮",
    narrations: openSourceFlywheelNarrations,
    Component: OpenSourceFlywheelChapter,
  },
  {
    id: "compound-return",
    title: "复利与总结",
    narrations: compoundReturnNarrations,
    Component: CompoundReturnChapter,
  },
];
