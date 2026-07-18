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

/** 头像贴右上角（本期出镜视频）。主内容避让该角约 432×432；录制态(?auto=1)自动隐藏。 */
const AVATAR_CORNER: AvatarCorner = "top-right";

/**
 * Estimate spoken duration of a Chinese narration string. Native pace
 * ≈ 4 char/s → 250ms per char. Used as `audio`-mode fallback only when a
 * step's clip is missing. (Auto mode no longer uses per-step clips.)
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

  // ── 音频策略（VO-First）──
  // Auto 模式（录制）走「整段连续音频 + 绝对时间轴翻页」(useTimelineAuto)：
  //   播一条完整口播 vo-full.mp3 → 零割裂；按 SRT 绝对时间翻页 → 零漂移、逐帧对齐。
  // useAudioPlayer 退化为只服务 `audio` 模式（手动翻页时预览每步切片，本期不用）。
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
