import type { ChapterStepProps } from "../../registry/types";
import "./Models.css";

/* ── 三个天体符号（SVG 几何，无 emoji）── */
/* Sol = 太阳：实心圆 + 放射光芒 */
const GlyphSun = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <circle cx="32" cy="32" r="12" fill="currentColor" stroke="none" />
    <g className="mo-sun-rays">
      <line x1="32" y1="4" x2="32" y2="13" />
      <line x1="32" y1="51" x2="32" y2="60" />
      <line x1="4" y1="32" x2="13" y2="32" />
      <line x1="51" y1="32" x2="60" y2="32" />
      <line x1="12.2" y1="12.2" x2="18.6" y2="18.6" />
      <line x1="45.4" y1="45.4" x2="51.8" y2="51.8" />
      <line x1="51.8" y1="12.2" x2="45.4" y2="18.6" />
      <line x1="18.6" y1="45.4" x2="12.2" y2="51.8" />
    </g>
  </svg>
);
/* Terra = 地球：圆 + 经纬线 + 倾斜赤道环 */
const GlyphEarth = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <circle cx="32" cy="32" r="20" />
    <ellipse cx="32" cy="32" rx="20" ry="7.5" />
    <line x1="12" y1="32" x2="52" y2="32" />
    <path d="M32 12 C20 22 20 42 32 52" />
    <path d="M32 12 C44 22 44 42 32 52" />
  </svg>
);
/* Luna = 月亮：标准月牙 */
const GlyphMoon = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" stroke="none">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const IconArrowDown = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v13" /><path d="M6 12l6 6 6 6" transform="translate(0 -6)" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6" />
  </svg>
);

/**
 * 章 2 · models —— 三个型号 Sol / Terra / Luna。
 * 寓意 太阳/地球/月亮；定位 旗舰/均衡(性价比)/最便宜量大；价格落点 Terra 最实在。
 * 屏幕=信息图（卡片/关键词/数字/几何符号），整句字幕后期加。子元素按 cue 绝对延时揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中/偏下）。
 */
export default function Models({ step }: ChapterStepProps) {
  /* ───────── s0 [41.400] 三型号亮相 + 命名体系 ───────── */
  if (step === 0) {
    return (
      <section className="mo-scene mo-s0" key="s0">
        <div className="mo-kicker mo-down" style={{ animationDelay: "0ms" }}>
          <span className="mo-dot" />OPENAI · 命名体系 NAMING
        </div>
        <div className="mo-s0-head mo-fade" style={{ animationDelay: "0ms" }}>
          这次一口气发了<span className="mo-accent"> 三个 </span>型号
        </div>
        <div className="mo-cards">
          <div className="mo-card mo-card-in" style={{ animationDelay: "800ms" }}>
            <span className="mo-orbit" />
            <span className="mo-glyph mo-glyph-sun"><GlyphSun /></span>
            <span className="mo-card-name">Sol</span>
            <span className="mo-card-mean mo-fade" style={{ animationDelay: "3466ms" }}>太阳</span>
          </div>
          <div className="mo-card mo-card-in" style={{ animationDelay: "1066ms" }}>
            <span className="mo-orbit" />
            <span className="mo-glyph mo-glyph-earth"><GlyphEarth /></span>
            <span className="mo-card-name">Terra</span>
            <span className="mo-card-mean mo-fade" style={{ animationDelay: "3666ms" }}>地球</span>
          </div>
          <div className="mo-card mo-card-in" style={{ animationDelay: "1333ms" }}>
            <span className="mo-orbit" />
            <span className="mo-glyph mo-glyph-moon"><GlyphMoon /></span>
            <span className="mo-card-name">Luna</span>
            <span className="mo-card-mean mo-fade" style={{ animationDelay: "3866ms" }}>月亮</span>
          </div>
        </div>
        <div className="mo-s0-foot mo-stamp" style={{ animationDelay: "5466ms" }}>
          以后就按这套命名走 · ONE NAMING SYSTEM
        </div>
      </section>
    );
  }

  /* ───────── s1 [48.933] 三型号定位 ───────── */
  if (step === 1) {
    return (
      <section className="mo-scene mo-s1" key="s1">
        <div className="mo-kicker mo-down" style={{ animationDelay: "0ms" }}>
          <span className="mo-dot" />三档定位 · POSITIONING
        </div>
        <div className="mo-tiers">
          {/* Sol · 旗舰 */}
          <div className="mo-tier mo-tier-in" style={{ animationDelay: "0ms" }}>
            <span className="mo-tier-glyph mo-glyph-sun"><GlyphSun /></span>
            <span className="mo-tier-name">Sol</span>
            <span className="mo-tier-tag mo-tier-tag-sol mo-pop" style={{ animationDelay: "500ms" }}>旗舰 · FLAGSHIP</span>
            <span className="mo-tier-desc mo-fade" style={{ animationDelay: "560ms" }}>最强一档</span>
          </div>
          {/* Terra · 均衡（性价比之选，高亮） */}
          <div className="mo-tier mo-tier-hero mo-tier-in" style={{ animationDelay: "1100ms" }}>
            <span className="mo-tier-pick mo-stamp" style={{ animationDelay: "2567ms" }}>性价比之选</span>
            <span className="mo-tier-glyph mo-glyph-earth"><GlyphEarth /></span>
            <span className="mo-tier-name mo-accent">Terra</span>
            <span className="mo-tier-tag mo-tier-tag-hero mo-pop" style={{ animationDelay: "1600ms" }}>均衡 · BALANCED</span>
            <div className="mo-tier-metrics">
              <span className="mo-metric mo-fade" style={{ animationDelay: "2567ms" }}>
                <em>性能</em><b className="mo-accent">= GPT-5.5</b>
              </span>
              <span className="mo-metric mo-fade" style={{ animationDelay: "3967ms" }}>
                <em>价格</em><b className="mo-accent">÷ 2</b>
              </span>
            </div>
          </div>
          {/* Luna · 便宜·量大 */}
          <div className="mo-tier mo-tier-in" style={{ animationDelay: "5167ms" }}>
            <span className="mo-tier-glyph mo-glyph-moon"><GlyphMoon /></span>
            <span className="mo-tier-name">Luna</span>
            <span className="mo-tier-tag mo-tier-tag-luna mo-pop" style={{ animationDelay: "5667ms" }}>最便宜 · CHEAPEST</span>
            <span className="mo-tier-desc mo-fade" style={{ animationDelay: "7100ms" }}>便宜 · 主打量大</span>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s2 [57.400] 价格策略（落点：Terra 最实在）───────── */
  return (
    <section className="mo-scene mo-s2" key="s2">
      <div className="mo-kicker mo-down" style={{ animationDelay: "0ms" }}>
        <span className="mo-dot" />价格策略 · PRICING
      </div>
      <div className="mo-price-stage">
        {/* Sol：价格没动 */}
        <div className="mo-price-row mo-fade" style={{ animationDelay: "0ms" }}>
          <span className="mo-price-glyph mo-glyph-sun"><GlyphSun /></span>
          <span className="mo-price-name">Sol</span>
          <span className="mo-price-track">
            <span className="mo-price-fill mo-price-fill-flat mo-grow" style={{ ["--mo-w" as string]: "100%", animationDelay: "200ms" }} />
            <span className="mo-price-cap mo-cap-flat mo-fade" style={{ animationDelay: "1733ms" }}>没涨价 · = GPT-5.5</span>
          </span>
        </div>
        {/* Terra：性能不降 · 价格腰斩（高亮） */}
        <div className="mo-price-row mo-price-row-hero mo-fade" style={{ animationDelay: "3666ms" }}>
          <span className="mo-price-glyph mo-glyph-earth"><GlyphEarth /></span>
          <span className="mo-price-name mo-accent">Terra</span>
          <span className="mo-price-track mo-price-track-hero">
            {/* 旧价（幽灵满条）→ 腰斩到一半 */}
            <span className="mo-price-ghost mo-fade" style={{ animationDelay: "6033ms" }} />
            <span className="mo-price-fill mo-price-fill-hero mo-cut" style={{ animationDelay: "6633ms" }} />
            <span className="mo-price-perf mo-pop" style={{ animationDelay: "6033ms" }}>
              <span className="mo-perf-ic"><IconCheck /></span>性能不降
            </span>
            <span className="mo-price-cut mo-stamp" style={{ animationDelay: "6633ms" }}>
              <span className="mo-cut-ic"><IconArrowDown /></span>价格腰斩 ↓50%
            </span>
          </span>
        </div>
      </div>
      <div className="mo-s2-foot mo-fade" style={{ animationDelay: "7666ms" }}>
        说白了，<span className="mo-accent">多给了你两档便宜的</span>
      </div>
    </section>
  );
}
