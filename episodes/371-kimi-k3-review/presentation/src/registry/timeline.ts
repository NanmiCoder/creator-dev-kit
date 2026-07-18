import { stepStarts as coldopen } from "../chapters/01-coldopen/narrations";
import { stepStarts as footageGap } from "../chapters/02-footage-gap/narrations";
import { stepStarts as method } from "../chapters/03-method/narrations";
import { stepStarts as auth } from "../chapters/04-auth/narrations";
import { stepStarts as skills } from "../chapters/05-skills/narrations";
import { stepStarts as ranking } from "../chapters/06-ranking/narrations";
import { stepStarts as speed } from "../chapters/07-speed/narrations";
import { stepStarts as verdict } from "../chapters/08-verdict/narrations";

// VO-First: every global step starts at this absolute second in the final SRT.
export const TIMELINE: number[] = [
  ...coldopen,
  ...footageGap,
  ...method,
  ...auth,
  ...skills,
  ...ranking,
  ...speed,
  ...verdict,
];

export const VO_FULL_SRC = "audio/vo-full.mp3";
export const VO_FULL_DURATION = 189.727333;
