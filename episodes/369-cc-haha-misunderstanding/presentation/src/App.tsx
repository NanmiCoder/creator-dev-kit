import "./styles/fonts.css"; // Google Fonts for built-in themes
import "./styles/base.css";
import "./styles/tokens.css"; // active theme — MUST load AFTER base so theme :root overrides base defaults (hero-num / motion / radius personality knobs). See THEMES.md
import "./styles/animations.css";

import { useCallback, useEffect } from "react";
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
import { TIMELINE, VO_END_AT, VO_FULL_SRC } from "./registry/timeline";

/**
 * 头像安全区：出镜叠真人头像的视频，设成头像所在角（"top-right" / "bottom-left"
 * / "top-left" / "bottom-right"）。只避让这个小角落，不要把整条右侧都留空。
 * 辅助圆环默认隐藏，需要检查边界时用 `?safe=1` 打开。
 */
const AVATAR_CORNER: AvatarCorner = "top-right";

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

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.has("still")) document.body.classList.add("qa-still");
    const s = sp.get("step");
    if (s !== null) stepper.jumpToGlobal(Number.parseInt(s, 10) || 0);
    // Run once on mount as a QA convenience; stepper methods are stable enough for this use.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ch = CHAPTERS[stepper.cursor.chapter]!;
  const Cmp = ch.Component;
  const stepText = ch.narrations[stepper.cursor.step] ?? "";

  const { mode, cycleMode, autoStarted, setAutoStarted } = useAutoMode();

  // VO-First: auto recording plays one continuous source and flips by SRT
  // absolute timestamps. Per-step audio remains available only for audio-preview mode.
  const playerMode = mode === "auto" ? "manual" : mode;
  const audioSrc =
    playerMode !== "audio" || stepText === ""
      ? null
      : `${import.meta.env.BASE_URL}audio/${ch.id}/${stepper.cursor.step + 1}.mp3`;

  const onAutoAdvance = useCallback(() => stepper.next(), [stepper]);

  useAudioPlayer({
    src: audioSrc,
    mode: playerMode,
    trailMs: 0,
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
    endAt: VO_END_AT,
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
