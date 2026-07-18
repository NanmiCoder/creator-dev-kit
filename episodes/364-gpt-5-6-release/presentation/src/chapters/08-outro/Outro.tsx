import type { ChapterStepProps } from "../../registry/types";
import "./Outro.css";

/* ── 内联图标（SVG，无 emoji）── */
/* 雷达 / 持续监测：扫描中的待解锁意象 */
const IconRadar = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5.4" opacity="0.55" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <path d="M12 12 19 7" strokeWidth="2" />
  </svg>
);
/* 解锁：从被锁到开放 */
const IconUnlock = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-1.9" />
  </svg>
);
/* 加号 / 铃铛主体（关注按钮内） */
const IconBell = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

/**
 * 章 8 · outro —— 结尾 + CTA。全片最后一屏，要有"片尾"质感。
 * 屏幕=信息图（承诺/落版），整句字幕后期加。每步子元素按 SRT cue 绝对延时揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中）。
 */
export default function Outro({ step }: ChapterStepProps) {
  /* ───────── s0 [295.066] 持续跟进的承诺 ───────── */
  if (step === 0) {
    return (
      <section className="ou-scene ou-s0" key="s0">
        <span className="ou-beam" />

        {/* 大尺度雷达扫描场（全屏背景意象：同心环 + 旋转扫描 + 脉冲 + 刻度） */}
        <div className="ou-s0-radarfield ou-pop" style={{ animationDelay: "120ms" }} aria-hidden="true">
          <span className="ou-s0-rf-grid" />
          <span className="ou-s0-rf-ring ou-s0-rf-ring-a" />
          <span className="ou-s0-rf-ring ou-s0-rf-ring-b" />
          <span className="ou-s0-rf-ring ou-s0-rf-ring-c" />
          <span className="ou-s0-rf-cross ou-s0-rf-cross-h" />
          <span className="ou-s0-rf-cross ou-s0-rf-cross-v" />
          <span className="ou-s0-rf-sweep" />
          <span className="ou-s0-rf-ping" />
          <span className="ou-s0-rf-ping ou-s0-rf-ping2" />
          <span className="ou-s0-rf-core"><IconRadar /></span>
          <span className="ou-s0-rf-blip ou-s0-rf-blip1" />
          <span className="ou-s0-rf-blip ou-s0-rf-blip2" />
          <span className="ou-s0-rf-blip ou-s0-rf-blip3" />
        </div>

        <div className="ou-kicker ou-down" style={{ animationDelay: "0ms" }}>
          <span className="ou-dot" />STILL WATCHING · 持续跟进
        </div>

        <h1 className="ou-s0-hero">
          <span className="ou-rise-wrap">
            <span className="ou-rise" style={{ animationDelay: "0ms" }}>等 </span>
          </span>
          <span className="ou-rise-wrap">
            <span className="ou-rise ou-accent" style={{ animationDelay: "120ms" }}>GPT-5.6</span>
          </span>
          <span className="ou-rise-wrap">
            <span className="ou-rise" style={{ animationDelay: "240ms" }}> 真正开放</span>
          </span>
        </h1>

        <div className="ou-s0-or">
          <span className="ou-s0-or-tag ou-fade" style={{ animationDelay: "1634ms" }}>
            <span className="ou-s0-or-ic"><IconUnlock /></span>或者，国产模型有新动作
          </span>
        </div>

        <div className="ou-s0-promise ou-slam" style={{ animationDelay: "3267ms" }}>
          第一时间 · 给大家<span className="ou-accent">实测</span>
        </div>
        <span className="ou-s0-underline" style={{ animationDelay: "3267ms" }} />
      </section>
    );
  }

  /* ───────── s1 [299.933] CTA 落版 ───────── */
  return (
    <section className="ou-scene ou-s1" key="s1">
      <span className="ou-beam ou-beam-end" />

      {/* 关注按钮（脉冲 / 高亮） */}
      <button className="ou-s1-follow ou-slam" style={{ animationDelay: "0ms" }} type="button" tabIndex={-1}>
        <span className="ou-s1-follow-pulse" />
        <span className="ou-s1-follow-ic"><IconBell /></span>
        <span className="ou-s1-follow-t">关注一下我</span>
      </button>

      {/* 署名落版 */}
      <div className="ou-s1-sign">
        <span className="ou-s1-sign-pre ou-fade" style={{ animationDelay: "733ms" }}>我是</span>
        <span className="ou-s1-sign-name ou-rise-wrap">
          <span className="ou-rise" style={{ animationDelay: "733ms" }}>阿江</span>
        </span>
      </div>
      <span className="ou-s1-namebar" style={{ animationDelay: "733ms" }} />

      <div className="ou-s1-bye ou-up" style={{ animationDelay: "1333ms" }}>
        我们下期视频 <span className="ou-accent">再见</span>
      </div>

      <div className="ou-s1-foot mono ou-fade" style={{ animationDelay: "1333ms" }}>
        GPT-5.6 · 程序员阿江 · THE END
      </div>
    </section>
  );
}
