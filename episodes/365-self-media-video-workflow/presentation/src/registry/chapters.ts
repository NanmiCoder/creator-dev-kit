import type { ChapterDef } from "./types";
import HookChapter from "../chapters/01-hook/HookChapter";
import { narrations as hookNarrations } from "../chapters/01-hook/narrations";
import PositioningChapter from "../chapters/02-positioning/PositioningChapter";
import { narrations as positioningNarrations } from "../chapters/02-positioning/narrations";
import VoiceSrtChapter from "../chapters/03-voice-srt/VoiceSrtChapter";
import { narrations as voiceSrtNarrations } from "../chapters/03-voice-srt/narrations";
import InstallSkillsChapter from "../chapters/04-install-skills/InstallSkillsChapter";
import { narrations as installSkillsNarrations } from "../chapters/04-install-skills/narrations";
import FirstAnchorChapter from "../chapters/05-first-anchor/FirstAnchorChapter";
import { narrations as firstAnchorNarrations } from "../chapters/05-first-anchor/narrations";
import AgentTeamsParallelChapter from "../chapters/06-agentteams-parallel/AgentTeamsParallelChapter";
import { narrations as agentTeamsParallelNarrations } from "../chapters/06-agentteams-parallel/narrations";
import MultimodalReviewChapter from "../chapters/07-multimodal-review/MultimodalReviewChapter";
import { narrations as multimodalReviewNarrations } from "../chapters/07-multimodal-review/narrations";
import AutoRecordingChapter from "../chapters/08-auto-recording/AutoRecordingChapter";
import { narrations as autoRecordingNarrations } from "../chapters/08-auto-recording/narrations";
import SummaryOutroChapter from "../chapters/09-summary-outro/SummaryOutroChapter";
import { narrations as summaryOutroNarrations } from "../chapters/09-summary-outro/narrations";

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
    id: "01-hook",
    title: "成果钩子：这不是传统 PPT",
    narrations: hookNarrations,
    Component: HookChapter,
  },
  {
    id: "02-positioning",
    title: "适合谁，为什么用 MiniMax Code",
    narrations: positioningNarrations,
    Component: PositioningChapter,
  },
  {
    id: "03-voice-srt",
    title: "第一步：先定声音和时间轴",
    narrations: voiceSrtNarrations,
    Component: VoiceSrtChapter,
  },
  {
    id: "04-install-skills",
    title: "第二步：安装两个 Skill",
    narrations: installSkillsNarrations,
    Component: InstallSkillsChapter,
  },
  {
    id: "05-first-anchor",
    title: "第三步：先做第一章风格锚点",
    narrations: firstAnchorNarrations,
    Component: FirstAnchorChapter,
  },
  {
    id: "06-agentteams-parallel",
    title: "第四步：AgentTeams 并行做完整项目",
    narrations: agentTeamsParallelNarrations,
    Component: AgentTeamsParallelChapter,
  },
  {
    id: "07-multimodal-review",
    title: "第五步：多模态 Review",
    narrations: multimodalReviewNarrations,
    Component: MultimodalReviewChapter,
  },
  {
    id: "08-auto-recording",
    title: "自动播放与录屏成片",
    narrations: autoRecordingNarrations,
    Component: AutoRecordingChapter,
  },
  {
    id: "09-summary-outro",
    title: "一句话总结与收束",
    narrations: summaryOutroNarrations,
    Component: SummaryOutroChapter,
  },
];
