import "./styles/fonts.css"; // Google Fonts for built-in themes
import "./styles/base.css";
import "./styles/tokens.css"; // active theme — MUST load AFTER base so theme :root overrides base defaults (hero-num / motion / radius personality knobs). See THEMES.md
import "./styles/animations.css";

import { useCallback } from "react";
import { AutoStartGate } from "./components/AutoStartGate";
import { AutoToggle } from "./components/AutoToggle";
import { AvatarSafeZone, type AvatarCorner } from "./components/AvatarSafeZone";
import { ProgressBar } from "./components/ProgressBar";
import { Stage } from "./components/Stage";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useAutoMode } from "./hooks/useAutoMode";
import { useStepper } from "./hooks/useStepper";
import { useTimelineAuto } from "./hooks/useTimelineAuto";
import { CHAPTERS } from "./registry/chapters";
import { TIMELINE, VO_FULL_SRC } from "./registry/timeline";

/**
 * 头像安全区：出镜叠真人头像的视频，设成头像所在角（"top-right" / "bottom-left"
 * / "top-left" / "bottom-right"）—— 开发态在该角画虚线圆环提示，主内容须避让该角
 * 约 432×432；录制态（`?auto=1`）圆环自动隐藏，画面干净。**不出镜 / TTS 视频留 `null`**。
 */
const AVATAR_CORNER: AvatarCorner = null;

/**
 * Estimate spoken duration of a Chinese narration string. Native pace
 * ≈ 4 char/s → 250ms per char. Used as Auto-mode fallback ONLY when the
 * audio file is missing / fails / the narration is empty. When audio plays
 * normally, this value is unused — auto-advance fires on `audio.ended`.
 */
function estimateMs(text: string): number {
  if (!text) return 1500;
  return Math.max(1500, text.length * 250);
}

export default function App() {
  const stepper = useStepper(CHAPTERS);
  const ch = CHAPTERS[stepper.cursor.chapter]!;
  const Cmp = ch.Component;
  const stepText = ch.narrations[stepper.cursor.step] ?? "";

  const { mode, cycleMode, autoStarted, setAutoStarted } = useAutoMode();

  // Audio path follows the convention: /audio/<chapter-id>/<step+1>.mp3
  // (1-indexed file names match what `extract-narrations.ts` outputs.)
  // Empty narration → no audio src, Auto mode falls back to estimate.
  //
  // 真人口播（VO-First）改走「整段连续音频 + 绝对时间轴翻页」（useTimelineAuto），
  // 见 references/VO-FIRST-ALIGNMENT.md —— 别用每步切片，会割裂 + 漂移。
  const playerMode = mode === "auto" ? "manual" : mode;
  const audioSrc =
    playerMode === "manual" || stepText === ""
      ? null
      : `${import.meta.env.BASE_URL}audio/${ch.id}/${stepper.cursor.step + 1}.mp3`;

  const onAutoAdvance = useCallback(() => stepper.next(), [stepper]);

  useAudioPlayer({
    src: audioSrc,
    mode: playerMode,
    trailMs: 200,
    estimateFallbackMs: estimateMs(stepText),
    onAutoAdvance,
    autoStarted,
  });

  useTimelineAuto({
    enabled: mode === "auto",
    src: `${import.meta.env.BASE_URL}${VO_FULL_SRC}`,
    timeline: TIMELINE,
    autoStarted,
    jumpToGlobal: stepper.jumpToGlobal,
  });

  return (
    <>
      <Stage onAdvance={stepper.next}>
        <div key={ch.id} className="scene">
          <Cmp step={stepper.cursor.step} />
        </div>
        <AvatarSafeZone corner={AVATAR_CORNER} />
      </Stage>
      <ProgressBar
        chapters={CHAPTERS}
        cursor={stepper.cursor}
        onJumpChapter={stepper.jumpToChapter}
      />
      <AutoToggle mode={mode} onCycle={cycleMode} />
      <AutoStartGate
        visible={mode === "auto" && !autoStarted}
        onStart={() => setAutoStarted(true)}
      />
    </>
  );
}
