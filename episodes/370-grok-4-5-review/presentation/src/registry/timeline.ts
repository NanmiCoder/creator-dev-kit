import { stepStarts as coldopen } from "../chapters/01-coldopen/narrations";
import { stepStarts as method } from "../chapters/02-method/narrations";
import { stepStarts as sentiment } from "../chapters/03-sentiment/narrations";
import { stepStarts as auth } from "../chapters/04-auth/narrations";
import { stepStarts as skills } from "../chapters/05-skills/narrations";
import { stepStarts as rankingSpeed } from "../chapters/06-ranking-speed/narrations";
import { stepStarts as costQuota } from "../chapters/07-cost-quota/narrations";
import { stepStarts as verdict } from "../chapters/08-verdict/narrations";

// VO-First: every global step starts at this absolute second in the final SRT.
export const TIMELINE: number[] = [
  ...coldopen,
  ...method,
  ...sentiment,
  ...auth,
  ...skills,
  ...rankingSpeed,
  ...costQuota,
  ...verdict,
];

export const VO_FULL_SRC = "audio/vo-full.mp3";
export const VO_FULL_DURATION = 259.422;
