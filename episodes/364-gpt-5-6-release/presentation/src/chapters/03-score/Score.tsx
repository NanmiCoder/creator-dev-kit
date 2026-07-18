import type { ChapterStepProps } from "../../registry/types";
import "./Score.css";

/* ── 内联图标（SVG，无 emoji）── */
const IconUp = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V6" /><path d="M6 12l6-6 6 6" />
  </svg>
);
const IconDown = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v13" /><path d="M6 12l6 6 6-6" />
  </svg>
);
const IconCash = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" />
  </svg>
);
const IconSplit = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4v6a4 4 0 0 0 4 4h10" /><path d="M5 20v-6" /><path d="M16 11l3 3-3 3" />
  </svg>
);
const IconBot = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4.5" y="8" width="15" height="11" rx="3" /><path d="M12 4v4" /><circle cx="12" cy="3.2" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="13" r="1.1" fill="currentColor" stroke="none" /><circle cx="14.5" cy="13" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4h6l-1 6 4 3H6l4-3-1-6Z" /><path d="M12 16v4" />
  </svg>
);

/**
 * 章 3 · score —— 91 分怎么来的 + 真榜缺席（埋包袱）。
 * 91.9 靠 Ultra 模式（拆小助手并行）；普通模式 88.76 ≈ Mythos 88（没拉开）；
 * 最能分高下的真榜（SWE-bench Pro / Verified / DeepSWE）全藏 = 信号。包袱留到第 7 章。
 * 屏=信息图，整句字幕后期加。每步子元素按 SRT cue 绝对延时（相对步起始秒）揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中/偏下）。
 */
export default function Score({ step }: ChapterStepProps) {
  /* ───────── s0 [67.066] 91.9 怎么冲上去 = Ultra 模式（拆→并行→拼）───────── */
  if (step === 0) {
    return (
      <section className="sc-scene sc-s0" key="s0">
        <div className="sc-kicker sc-down" style={{ animationDelay: "0ms" }}>
          <span className="sc-dot" />91.9 是怎么冲上去的
        </div>
        <div className="sc-s0-head">
          <span className="sc-s0-q sc-fade" style={{ animationDelay: "0ms" }}>那个</span>
          <span className="sc-s0-num sc-slam" style={{ animationDelay: "0ms" }}>91.9</span>
          <span className="sc-s0-by sc-fade" style={{ animationDelay: "1934ms" }}>
            <span className="sc-s0-tag">ULTRA 模式</span>新出的
          </span>
        </div>
        {/* 拆 → 并行 → 拼 流水线 */}
        <div className="sc-flow">
          <div className="sc-flow-main sc-pop" style={{ animationDelay: "3967ms" }}>
            <span className="sc-flow-main-ic"><IconSplit /></span>
            <span className="sc-flow-main-t">主模型</span>
            <span className="sc-flow-main-s mono">拆开</span>
          </div>
          <span className="sc-flow-arrow sc-grow-x" style={{ animationDelay: "4300ms" }} />
          <div className="sc-flow-fan">
            <div className="sc-flow-fan-label sc-fade" style={{ animationDelay: "4900ms" }}>4 个小助手 · 分头干</div>
            <div className="sc-flow-fan-row">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="sc-flow-bot sc-pop" style={{ animationDelay: `${4900 + i * 130}ms` }}>
                  <span className="sc-flow-bot-ic"><IconBot /></span>
                </div>
              ))}
            </div>
          </div>
          <span className="sc-flow-arrow sc-grow-x" style={{ animationDelay: "5600ms" }} />
          <div className="sc-flow-merge sc-pop" style={{ animationDelay: "5867ms" }}>
            <span className="sc-flow-merge-t mono">拼一块</span>
            <span className="sc-flow-merge-num">91.9</span>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s1 [75.900] 代价 + 普通模式 88.76 ≈ Mythos 88（贴脸，没拉开）───────── */
  if (step === 1) {
    return (
      <section className="sc-scene sc-s1" key="s1">
        <div className="sc-kicker sc-down" style={{ animationDelay: "0ms" }}>
          <span className="sc-dot" />ULTRA 的代价
        </div>
        <div className="sc-s1-cost">
          <div className="sc-s1-chip sc-pos sc-pop" style={{ animationDelay: "0ms" }}>
            <span className="sc-s1-chip-ic"><IconUp /></span><span className="sc-s1-chip-t">分高</span>
          </div>
          <div className="sc-s1-chip sc-neg sc-pop" style={{ animationDelay: "900ms" }}>
            <span className="sc-s1-chip-ic"><IconDown /></span><span className="sc-s1-chip-t">更慢</span>
          </div>
          <div className="sc-s1-chip sc-neg sc-pop" style={{ animationDelay: "2000ms" }}>
            <span className="sc-s1-chip-ic"><IconCash /></span><span className="sc-s1-chip-t">更烧钱</span>
          </div>
        </div>
        {/* 对照：不拆助手的普通模式 88.76 ≈ Mythos 88 */}
        <div className="sc-s1-vs sc-fade" style={{ animationDelay: "3033ms" }}>
          <div className="sc-s1-side">
            <div className="sc-s1-side-top mono">GPT-5.6 · 普通模式</div>
            <div className="sc-s1-side-sub">不拆小助手</div>
            <div className="sc-s1-side-num sc-accent">88.76</div>
          </div>
          <div className="sc-s1-approx sc-pop" style={{ animationDelay: "4466ms" }}>≈</div>
          <div className="sc-s1-side">
            <div className="sc-s1-side-top mono">ANTHROPIC · 上一期</div>
            <div className="sc-s1-side-sub">Mythos</div>
            <div className="sc-s1-side-num">88</div>
          </div>
        </div>
        <div className="sc-s1-verdict sc-stamp" style={{ animationDelay: "6333ms" }}>贴脸 · 没拉开</div>
      </section>
    );
  }

  /* ───────── s2 [83.566] 没交的榜①：SWE-bench Pro（Fable5 80.3）+ Verified ───────── */
  if (step === 2) {
    return (
      <section className="sc-scene sc-s2" key="s2">
        <div className="sc-kicker sc-down" style={{ animationDelay: "0ms" }}>
          <span className="sc-dot sc-dot-warn" />更该留心的，是它没交的卷
        </div>
        <div className="sc-s2-title sc-fade" style={{ animationDelay: "1667ms" }}>
          它<span className="sc-neg-t">没测</span>的几个榜
        </div>
        <div className="sc-cards">
          <div className="sc-card sc-pop" style={{ animationDelay: "3734ms" }}>
            <div className="sc-card-ic"><IconDoc /></div>
            <div className="sc-card-name">SWE-bench Pro</div>
            <div className="sc-card-fable sc-fade" style={{ animationDelay: "5100ms" }}>
              <span className="sc-card-fable-who mono">上期 Fable 5</span>
              <span className="sc-card-fable-num">80.3</span>
            </div>
            <div className="sc-card-seal sc-stamp" style={{ animationDelay: "4100ms" }}>未交卷</div>
          </div>
          <div className="sc-card sc-pop" style={{ animationDelay: "8434ms" }}>
            <div className="sc-card-ic"><IconDoc /></div>
            <div className="sc-card-name">Verified</div>
            <div className="sc-card-upg mono sc-fade" style={{ animationDelay: "8434ms" }}>SWE-bench Pro · 升级版</div>
            <div className="sc-card-seal sc-stamp" style={{ animationDelay: "8700ms" }}>缺考</div>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s3 [94.200] 没交的榜②：DeepSWE（社区最认真榜）→ 三张全缺席 ───────── */
  if (step === 3) {
    return (
      <section className="sc-scene sc-s3" key="s3">
        <div className="sc-kicker sc-down" style={{ animationDelay: "0ms" }}>
          <span className="sc-dot sc-dot-warn" />真榜全部缺席
        </div>
        <div className="sc-cards sc-s3-cards">
          {/* 前两张延续 s2，定格在场 */}
          <div className="sc-card sc-card-dim">
            <div className="sc-card-ic"><IconDoc /></div>
            <div className="sc-card-name">SWE-bench Pro</div>
            <div className="sc-card-sub mono">上期 Fable 5 · 80.3</div>
            <div className="sc-card-seal sc-card-seal-on">未交卷</div>
          </div>
          <div className="sc-card sc-card-dim">
            <div className="sc-card-ic"><IconDoc /></div>
            <div className="sc-card-name">Verified</div>
            <div className="sc-card-sub mono">SWE-bench Pro 升级版</div>
            <div className="sc-card-seal sc-card-seal-on">缺考</div>
          </div>
          {/* 新加 DeepSWE：社区最认 · 真榜 */}
          <div className="sc-card sc-card-hero sc-pop" style={{ animationDelay: "1966ms" }}>
            <div className="sc-card-badge sc-fade" style={{ animationDelay: "1966ms" }}>社区最认 · 真榜</div>
            <div className="sc-card-ic sc-card-ic-hero"><IconDoc /></div>
            <div className="sc-card-name sc-accent">DeepSWE</div>
            <div className="sc-card-sub mono">抗污染 · 最能看真实编程能力</div>
            <div className="sc-card-seal sc-card-seal-hero sc-stamp" style={{ animationDelay: "6266ms" }}>未交卷</div>
          </div>
        </div>
        <div className="sc-s3-foot">
          <div className="sc-s3-zero sc-fade" style={{ animationDelay: "3300ms" }}>
            最能看出<span className="sc-accent">真实编程能力</span>的榜
          </div>
          <div className="sc-s3-tally sc-pop" style={{ animationDelay: "6266ms" }}>
            GPT-5.6 · 一个都没交
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s4 [103.500] 藏榜=信号 + 埋包袱（记住 DeepSWE）───────── */
  return (
    <section className="sc-scene sc-s4" key="s4">
      <div className="sc-kicker sc-down" style={{ animationDelay: "0ms" }}>
        <span className="sc-dot" />这本身就是信号
      </div>
      <h1 className="sc-s4-line">
        <span className="sc-rise-wrap"><span className="sc-rise" style={{ animationDelay: "0ms" }}>把最能</span></span>
        <span className="sc-rise-wrap"><span className="sc-rise sc-accent" style={{ animationDelay: "240ms" }}>分高下</span></span>
        <span className="sc-rise-wrap"><span className="sc-rise" style={{ animationDelay: "480ms" }}>的榜全藏起来</span></span>
      </h1>
      <div className="sc-s4-eq sc-stamp" style={{ animationDelay: "2233ms" }}>
        藏起来 <span className="sc-s4-eq-op">=</span> 信号
      </div>
      {/* 埋扣子 */}
      <div className="sc-s4-hook sc-fade" style={{ animationDelay: "3900ms" }}>
        <div className="sc-s4-hook-q">
          DeepSWE 上，谁高谁低？
          <span className="sc-s4-hook-cn sc-fade" style={{ animationDelay: "6800ms" }}>国产能排第几？</span>
        </div>
        <div className="sc-s4-hook-late sc-pop" style={{ animationDelay: "8600ms" }}>留到最后揭晓</div>
      </div>
      <div className="sc-s4-pin sc-stamp" style={{ animationDelay: "8600ms" }}>
        <span className="sc-s4-pin-ic"><IconPin /></span>记住 · DeepSWE
      </div>
    </section>
  );
}
