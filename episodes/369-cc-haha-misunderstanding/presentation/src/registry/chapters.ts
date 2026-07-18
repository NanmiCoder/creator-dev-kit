import type { ChapterDef } from "./types";
import OpenSourceAccused from "../chapters/01-open-source-accused/OpenSourceAccused";
import { narrations as openSourceAccusedNarrations } from "../chapters/01-open-source-accused/narrations";
import NotFirstTime from "../chapters/02-not-first-time/NotFirstTime";
import { narrations as notFirstTimeNarrations } from "../chapters/02-not-first-time/narrations";
import RiskVsMalware from "../chapters/03-risk-vs-malware/RiskVsMalware";
import { narrations as riskVsMalwareNarrations } from "../chapters/03-risk-vs-malware/narrations";
import UpstreamCommand from "../chapters/04-upstream-command/UpstreamCommand";
import { narrations as upstreamCommandNarrations } from "../chapters/04-upstream-command/narrations";
import SkillRisk from "../chapters/05-skill-risk/SkillRisk";
import { narrations as skillRiskNarrations } from "../chapters/05-skill-risk/narrations";
import TrustAndClose from "../chapters/06-trust-and-close/TrustAndClose";
import { narrations as trustAndCloseNarrations } from "../chapters/06-trust-and-close/narrations";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "open-source-accused",
    title: "开源项目被说成木马",
    narrations: openSourceAccusedNarrations,
    Component: OpenSourceAccused,
  },
  {
    id: "not-first-time",
    title: "这不是第一次",
    narrations: notFirstTimeNarrations,
    Component: NotFirstTime,
  },
  {
    id: "risk-vs-malware",
    title: "供应链风险和故意投毒",
    narrations: riskVsMalwareNarrations,
    Component: RiskVsMalware,
  },
  {
    id: "upstream-command",
    title: "命令是谁递来的",
    narrations: upstreamCommandNarrations,
    Component: UpstreamCommand,
  },
  {
    id: "skill-risk",
    title: "Skill 不是提示词包",
    narrations: skillRiskNarrations,
    Component: SkillRisk,
  },
  {
    id: "trust-and-close",
    title: "信任边界和收尾",
    narrations: trustAndCloseNarrations,
    Component: TrustAndClose,
  },
];
