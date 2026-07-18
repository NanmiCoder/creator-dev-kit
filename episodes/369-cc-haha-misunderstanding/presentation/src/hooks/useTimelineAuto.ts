import { useEffect, useRef } from "react";

interface Options {
  /** 是否启用（mode === "auto"）。 */
  enabled: boolean;
  /** 完整连续口播音频路径（如 `audio/vo-full.mp3`，整段不切）。 */
  src: string;
  /** 每个全局 step 的绝对起始秒（升序，长度 = 全片总 step 数）。来自 timeline.ts。 */
  timeline: number[];
  /** AutoStartGate 起播后翻 true（浏览器需要用户手势才能自动播放）。 */
  autoStarted: boolean;
  /** 跳到第 i 个全局 step（useStepper 提供）。 */
  jumpToGlobal: (i: number) => void;
  /** Optional preview cutoff in seconds. Useful while only the first chapter exists. */
  endAt?: number;
}

/**
 * Auto 模式（录制）的「整段连续音频 + 绝对时间轴」驱动 —— VO-First（真人口播）首选。
 *
 * 不要每步播一段切片（段间有断点、听感割裂，且 ended→next→play 会累积漂移），
 * 而是播放**一条完整口播音频**，用 requestAnimationFrame 读 `audio.currentTime`，
 * 跨过 `timeline` 里某个 step 的绝对起始时刻就翻到那一页。
 *
 * 好处：音频 100% 连贯（零割裂/零夹断）；翻页死锁在 SRT 绝对时间点上、零漂移；
 * 画面翻页 / 音频 / 后期叠的真人头像逐帧对齐。
 *
 * 时间轴每帧把 cursor 拉到 `idxAt(currentTime)`，录制中误触翻页会被下一帧纠回。
 *
 * 用法（App.tsx）：auto 模式启用本 hook，并让 useAudioPlayer 的 mode 退化为
 * "manual"（auto 交给时间轴，别再每步播切片）。详见 references/VO-FIRST-ALIGNMENT.md。
 */
export function useTimelineAuto({
  enabled,
  src,
  timeline,
  autoStarted,
  jumpToGlobal,
  endAt,
}: Options) {
  // 用 ref 持最新回调 / 时间轴，避免它们的引用变化重启音频。
  const jumpRef = useRef(jumpToGlobal);
  jumpRef.current = jumpToGlobal;
  const tlRef = useRef(timeline);
  tlRef.current = timeline;

  useEffect(() => {
    if (!enabled || !autoStarted) return;

    const audio = new Audio(src);
    audio.preload = "auto";
    let raf = 0;
    let lastIdx = -1;

    // 当前时刻 t 应停在的全局 step：最大的「起始时间 ≤ t」的那个。
    const idxAt = (t: number): number => {
      const tl = tlRef.current;
      let idx = 0;
      for (let i = 0; i < tl.length; i++) {
        if (t + 0.001 >= tl[i]!) idx = i;
        else break;
      }
      return idx;
    };

    const tick = () => {
      if (typeof endAt === "number" && audio.currentTime >= endAt) {
        audio.pause();
        cancelAnimationFrame(raf);
        return;
      }
      const idx = idxAt(audio.currentTime);
      if (idx !== lastIdx) {
        lastIdx = idx;
        jumpRef.current(idx);
      }
      raf = requestAnimationFrame(tick);
    };

    audio
      .play()
      .then(() => {
        lastIdx = 0;
        jumpRef.current(0); // 起播即对齐到 step 0
        raf = requestAnimationFrame(tick);
      })
      .catch((err) => {
        // 自动播放被拦截（AutoStartGate 的手势应已解锁）/ 文件缺失。
        console.warn("timeline audio play failed:", err);
      });

    return () => {
      cancelAnimationFrame(raf);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [enabled, autoStarted, src, endAt]);
}
