import type { ChapterDef } from "./types";
import Coldopen from "../chapters/01-coldopen/Coldopen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";
import Method from "../chapters/02-method/Method";
import { narrations as methodNarrations } from "../chapters/02-method/narrations";
import Sentiment from "../chapters/03-sentiment/Sentiment";
import { narrations as sentimentNarrations } from "../chapters/03-sentiment/narrations";
import Auth from "../chapters/04-auth/Auth";
import { narrations as authNarrations } from "../chapters/04-auth/narrations";
import Skills from "../chapters/05-skills/Skills";
import { narrations as skillsNarrations } from "../chapters/05-skills/narrations";
import RankingSpeed from "../chapters/06-ranking-speed/RankingSpeed";
import { narrations as rankingSpeedNarrations } from "../chapters/06-ranking-speed/narrations";
import CostQuota from "../chapters/07-cost-quota/CostQuota";
import { narrations as costQuotaNarrations } from "../chapters/07-cost-quota/narrations";
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
    title: "600 亿事件与两项实测",
    narrations: [...coldopenNarrations],
    Component: Coldopen,
  },
  { id: "method", title: "同题同基准的测试方法", narrations: [...methodNarrations], Component: Method },
  { id: "sentiment", title: "五千条评论里的真实位置", narrations: [...sentimentNarrations], Component: Sentiment },
  { id: "auth", title: "认证迁移：完整与失守", narrations: [...authNarrations], Component: Auth },
  { id: "skills", title: "Skills Agent Web 实测", narrations: [...skillsNarrations], Component: Skills },
  { id: "ranking-speed", title: "横评排名与交付速度", narrations: [...rankingSpeedNarrations], Component: RankingSpeed },
  { id: "cost-quota", title: "价格、订阅与周额度", narrations: [...costQuotaNarrations], Component: CostQuota },
  { id: "verdict", title: "谁适合把 Grok 当主力", narrations: [...verdictNarrations], Component: Verdict },
];
