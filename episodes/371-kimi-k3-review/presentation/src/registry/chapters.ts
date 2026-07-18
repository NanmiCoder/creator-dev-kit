import type { ChapterDef } from "./types";
import Coldopen from "../chapters/01-coldopen/Coldopen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";
import FootageGap from "../chapters/02-footage-gap/FootageGap";
import { narrations as footageGapNarrations } from "../chapters/02-footage-gap/narrations";
import Method from "../chapters/03-method/Method";
import { narrations as methodNarrations } from "../chapters/03-method/narrations";
import Auth from "../chapters/04-auth/Auth";
import { narrations as authNarrations } from "../chapters/04-auth/narrations";
import Skills from "../chapters/05-skills/Skills";
import { narrations as skillsNarrations } from "../chapters/05-skills/narrations";
import Ranking from "../chapters/06-ranking/Ranking";
import { narrations as rankingNarrations } from "../chapters/06-ranking/narrations";
import Speed from "../chapters/07-speed/Speed";
import { narrations as speedNarrations } from "../chapters/07-speed/narrations";
import Verdict from "../chapters/08-verdict/Verdict";
import { narrations as verdictNarrations } from "../chapters/08-verdict/narrations";

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
    id: "coldopen",
    title: "Kimi K3 发布与同题实测",
    narrations: [...coldopenNarrations],
    Component: Coldopen,
  },
  {
    id: "footage-gap",
    title: "实测运行视频替换区",
    narrations: [...footageGapNarrations],
    Component: FootageGap,
  },
  {
    id: "method",
    title: "证据先行的测试方法",
    narrations: [...methodNarrations],
    Component: Method,
  },
  {
    id: "auth",
    title: "图片 Agent 用户认证迁移",
    narrations: [...authNarrations],
    Component: Auth,
  },
  {
    id: "skills",
    title: "Skills CLI 到 Web Agent",
    narrations: [...skillsNarrations],
    Component: Skills,
  },
  {
    id: "ranking",
    title: "五模型综合总榜",
    narrations: [...rankingNarrations],
    Component: Ranking,
  },
  {
    id: "speed",
    title: "顶，但确实慢",
    narrations: [...speedNarrations],
    Component: Speed,
  },
  {
    id: "verdict",
    title: "199 套餐与最终判断",
    narrations: [...verdictNarrations],
    Component: Verdict,
  },
];
