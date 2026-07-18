import type { ChapterStepProps } from "../../registry/types";
import "./Open.css";

/* ── 内联图标（SVG，无 emoji）── */
const IconWarn = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 21 19 H3 Z" /><line x1="12" y1="9.5" x2="12" y2="14" /><circle cx="12" cy="17" r="0.7" fill="currentColor" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconGov = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" /><path d="M5 21V10l7-5 7 5v11" /><path d="M9.5 21v-5h5v5" />
  </svg>
);
const IconArrowUp = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V6" /><path d="M6 12l6-6 6 6" />
  </svg>
);

/* 数字滚轮 count-up：滚一整圈后落到目标 d */
const Roll = ({ d, delay }: { d: number; delay: number }) => (
  <span className="op-roll">
    <span className="op-roll-col" style={{ animationDelay: `${delay}ms`, ["--op-to" as string]: `${-(10 + d)}em` }}>
      {"01234567890123456789".split("").map((c, i) => <span key={i}>{c}</span>)}
    </span>
  </span>
);

/**
 * 章 1 · open —— 开场。最强模型 GPT-5.6，但你用不上 → Mythos 剧本重演。
 * 屏幕=信息图（关键词/数字/图），整句字幕后期加。每步子元素按 SRT cue 绝对延时揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中/偏下）。
 */
export default function Open({ step }: ChapterStepProps) {
  /* ───────── s0 [0.000] 发布炸点 ───────── */
  if (step === 0) {
    return (
      <section className="op-scene op-s0" key="s0">
        <span className="op-beam" />
        <div className="op-kicker op-down" style={{ animationDelay: "120ms" }}>
          <span className="op-dot" />OPENAI · 今天凌晨官宣
        </div>
        <h1 className="op-s0-hero">
          <span className="op-rise-wrap"><span className="op-rise" style={{ animationDelay: "1366ms" }}>GPT</span></span>
          <span className="op-s0-num op-slam" style={{ animationDelay: "1820ms" }}>5.6</span>
        </h1>
        <span className="op-s0-line" style={{ animationDelay: "2200ms" }} />
        <div className="op-s0-sub mono op-fade" style={{ animationDelay: "2560ms" }}>
          NEXT-GEN FRONTIER MODEL · 它们口中"最强"的模型
        </div>
      </section>
    );
  }

  /* ───────── s1 [4.333] 反转：你用不上 ───────── */
  if (step === 1) {
    return (
      <section className="op-scene op-s1" key="s1">
        <div className="op-s1-pre op-fade" style={{ animationDelay: "60ms" }}>
          你、我，<span className="op-mute">几乎所有的开发者</span>
        </div>
        <h1 className="op-s1-big">
          <span className="op-rise-wrap"><span className="op-rise" style={{ animationDelay: "1533ms" }}>都没机会</span></span>
          <span className="op-rise-wrap"><span className="op-rise op-s1-neg" style={{ animationDelay: "1820ms" }}>用上它</span></span>
        </h1>
        <span className="op-s1-strike" style={{ animationDelay: "2200ms" }} />
      </section>
    );
  }

  /* ───────── s2 [7.966] 91.9 跑分 + 超过 Mythos ───────── */
  if (step === 2) {
    return (
      <section className="op-scene op-s2" key="s2">
        <div className="op-kicker op-down" style={{ animationDelay: "0ms" }}>
          <span className="op-dot" />GPT-5.6 SOL · 编程榜 TERMINAL-BENCH 2.1
        </div>
        <div className="op-s2-bars">
          <div className="op-s2-row op-fade" style={{ animationDelay: "2900ms" }}>
            <span className="op-s2-name">GPT-5.5</span>
            <span className="op-s2-track"><span className="op-s2-fill op-grow" style={{ ["--op-w" as string]: "83.4%", animationDelay: "3000ms" }} /></span>
            <span className="op-s2-num mono op-fade" style={{ animationDelay: "3700ms" }}>83.4</span>
          </div>
          <div className="op-s2-row op-fade" style={{ animationDelay: "2900ms" }}>
            <span className="op-s2-name">Mythos <em>Anthropic 最强</em></span>
            <span className="op-s2-track"><span className="op-s2-fill op-grow" style={{ ["--op-w" as string]: "88%", animationDelay: "3150ms" }} /></span>
            <span className="op-s2-num mono op-fade" style={{ animationDelay: "3850ms" }}>88</span>
          </div>
          <div className="op-s2-row op-s2-hero op-fade" style={{ animationDelay: "300ms" }}>
            <span className="op-s2-name op-accent">GPT-5.6 Sol</span>
            <span className="op-s2-track op-s2-track-hero">
              <span className="op-s2-fill op-s2-fill-hero op-grow" style={{ ["--op-w" as string]: "100%", animationDelay: "5400ms" }} />
            </span>
            <span className="op-s2-bignum">
              <Roll d={9} delay={5400} /><Roll d={1} delay={5520} /><span className="op-s2-dot">.</span><Roll d={9} delay={5640} />
            </span>
          </div>
        </div>
        <div className="op-s2-sota op-stamp" style={{ animationDelay: "7400ms" }}>
          <span className="op-s2-sota-ic"><IconArrowUp /></span>创了新高 · NEW SOTA
        </div>
        <div className="op-s2-beat op-fade" style={{ animationDelay: "9200ms" }}>
          一举<span className="op-accent">超过</span> Anthropic 最强的 Mythos
        </div>
      </section>
    );
  }

  /* ───────── s3 [20.200] 预览版 · 应美国政府要求 · 只给 20 家 ───────── */
  if (step === 3) {
    return (
      <section className="op-scene op-s3" key="s3">
        <div className="op-kicker op-down" style={{ animationDelay: "0ms" }}>
          <span className="op-dot op-dot-warn" />LIMITED PREVIEW · 预览版
        </div>
        <div className="op-s3-gov op-fade" style={{ animationDelay: "1900ms" }}>
          <span className="op-s3-gov-ic"><IconGov /></span>应美国政府要求
        </div>
        <div className="op-s3-numline">
          <span className="op-s3-only op-fade" style={{ animationDelay: "3166ms" }}>全球只开放给</span>
          <span className="op-s3-num op-slam" style={{ animationDelay: "3166ms" }}>20</span>
          <span className="op-s3-unit op-fade" style={{ animationDelay: "3520ms" }}>家<br />机构</span>
        </div>
        <div className="op-s3-tags">
          <span className="op-s3-tag op-pop" style={{ animationDelay: "4766ms" }}><span className="op-s3-tag-ic"><IconLock /></span>被批准 · ALLOWLIST</span>
          <span className="op-s3-tag op-s3-tag-no op-pop" style={{ animationDelay: "5080ms" }}><span className="op-s3-no">✕</span>你不在名单里</span>
        </div>
      </section>
    );
  }

  /* ───────── s4 [26.366] 测不了 ───────── */
  if (step === 4) {
    return (
      <section className="op-scene op-s4" key="s4">
        <div className="op-s4-q op-fade" style={{ animationDelay: "0ms" }}>
          它到底<span className="op-accent">强不强</span>？
          <span className="op-s4-cross" style={{ animationDelay: "1300ms" }} />
        </div>
        <div className="op-s4-stamp op-stamp" style={{ animationDelay: "1560ms" }}>本期 · 没法实测</div>
        <div className="op-s4-pair">
          <div className="op-s4-who op-pop" style={{ animationDelay: "3134ms" }}><span className="op-s4-x">✕</span>你 · 碰不到</div>
          <div className="op-s4-who op-pop" style={{ animationDelay: "3734ms" }}><span className="op-s4-x">✕</span>我 · 也碰不到</div>
        </div>
      </section>
    );
  }

  /* ───────── s5 [31.266] Mythos 剧本重演 ───────── */
  return (
    <section className="op-scene op-s5" key="s5">
      <div className="op-kicker op-down" style={{ animationDelay: "0ms" }}>
        <span className="op-dot" />还记得上一期的 MYTHOS 吗
      </div>
      <div className="op-s5-stage">
        <div className="op-s5-card op-s5-in" style={{ animationDelay: "1200ms" }}>
          <div className="op-s5-top mono">ANTHROPIC · 上一期</div>
          <div className="op-s5-name">Mythos</div>
          <div className="op-s5-warn op-fade" style={{ animationDelay: "3367ms" }}>
            <span className="op-s5-warn-ic"><IconWarn /></span>太危险 · 不敢公开发
          </div>
        </div>
        <div className="op-s5-echo op-pop" style={{ animationDelay: "6800ms" }}>
          <span className="op-s5-echo-ic">⟳</span>
          <span className="op-s5-echo-t mono">同一套<br />又来一遍</span>
        </div>
        <div className="op-s5-card op-s5-card-mirror op-s5-in" style={{ animationDelay: "6800ms" }}>
          <div className="op-s5-top mono">OPENAI · 这一期</div>
          <div className="op-s5-name">GPT-5.6</div>
          <div className="op-s5-warn op-s5-warn-lock op-fade" style={{ animationDelay: "7300ms" }}>
            <span className="op-s5-warn-ic"><IconLock /></span>太强 · 只给机构
          </div>
        </div>
      </div>
      <div className="op-s5-smell op-fade" style={{ animationDelay: "5534ms" }}>这味儿，你熟不熟？</div>
      <div className="op-s5-tag op-stamp" style={{ animationDelay: "8700ms" }}>剧本重演 · SAME PLAYBOOK</div>
    </section>
  );
}
