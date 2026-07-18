import type { ChapterStepProps } from "../../registry/types";
import "./Security.css";

/* ── 内联图标（SVG 几何，无 emoji）── */
/* 盾牌 + 内嵌对勾：网络安全 */
const IconShield = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.5 20 6v6c0 4.6-3.2 7.6-8 9.5-4.8-1.9-8-4.9-8-9.5V6Z" />
    <path d="M8.6 12.2l2.4 2.4 4.4-4.6" />
  </svg>
);
/* 放大镜：暗示"抠字眼" */
const IconLens = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10.5" cy="10.5" r="7" /><path d="M15.6 15.6 21 21" />
  </svg>
);
/* 漏洞 / bug：ExploitBench 主题 */
const IconBug = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="8" width="10" height="10" rx="5" /><path d="M9.5 8V6a2.5 2.5 0 0 1 5 0v2" />
    <path d="M4 11h3M17 11h3M4 16h3M17 16h3M12 8.5v9.5" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6" />
  </svg>
);
const IconCross = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
/* 推主头像占位（人形） */
const IconUser = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="3.6" /><path d="M5 19.5a7 7 0 0 1 14 0" />
  </svg>
);
/* Twitter / X 小鸟（几何，非品牌 emoji） */
const IconBird = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" stroke="none">
    <path d="M22 5.9c-.7.3-1.5.55-2.3.65a4 4 0 0 0 1.76-2.2 8 8 0 0 1-2.54.97 4 4 0 0 0-6.81 3.64A11.3 11.3 0 0 1 3.6 4.8a4 4 0 0 0 1.24 5.33 4 4 0 0 1-1.8-.5v.05a4 4 0 0 0 3.2 3.92 4 4 0 0 1-1.8.07 4 4 0 0 0 3.73 2.78A8 8 0 0 1 2 18.1a11.3 11.3 0 0 0 6.1 1.79c7.33 0 11.34-6.07 11.34-11.34l-.01-.52A8 8 0 0 0 22 5.9Z" />
  </svg>
);

/**
 * 章 4 · security —— 网安"史上最强"·抠字眼。
 * 官方喊"史上最强网安模型"，但在 ExploitBench 上只是用 ~1/3 算力【追平】Mythos
 * 预览版——赢在省、不在更强；个别维度 Mythos 还更高。基调=祛魅/泼冷水（绿+橙+灰）。
 * 屏幕=信息图（盾牌/算力对比柱/判词/贴图卡），整句字幕后期加。子元素按 cue 绝对延时揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中/偏下）。
 */
export default function Security({ step }: ChapterStepProps) {
  /* ───────── s0 [113.600] 主打网安 + "史上最强网安模型" + 但要抠字眼 ───────── */
  if (step === 0) {
    return (
      <section className="se-scene se-s0" key="s0">
        <div className="se-kicker se-down" style={{ animationDelay: "0ms" }}>
          <span className="se-dot" />GPT-5.6 SOL · 网络安全 SECURITY
        </div>
        {/* 「Sol 旗舰版」0ms ·「主打网络安全」2166ms */}
        <div className="se-s0-top">
          <span className="se-s0-shield se-pop" style={{ animationDelay: "0ms" }}><IconShield /></span>
          <span className="se-s0-eyebrow se-fade" style={{ animationDelay: "0ms" }}>
            Sol 旗舰版，<span className="se-fade" style={{ animationDelay: "2166ms" }}><em>主打网络安全</em></span>
          </span>
        </div>
        {/* 「官方原话 史上」3733ms ·「最强网安模型」5133ms —— 带引号 + 放大镜暗示抠字眼 */}
        <h1 className="se-s0-quote">
          <span className="se-s0-qmark se-fade" style={{ animationDelay: "3733ms" }}>“</span>
          <span className="se-rise-wrap"><span className="se-rise se-s0-strongest" style={{ animationDelay: "3733ms" }}>史上最强</span></span>
          <span className="se-rise-wrap"><span className="se-rise" style={{ animationDelay: "5133ms" }}>网安模型</span></span>
          <span className="se-s0-qmark se-s0-qmark-r se-fade" style={{ animationDelay: "5133ms" }}>”</span>
          <span className="se-s0-lens se-pop" style={{ animationDelay: "6700ms" }}><IconLens /></span>
          <span className="se-s0-lens-star se-pop" style={{ animationDelay: "6700ms" }}>*</span>
        </h1>
        <span className="se-s0-line" style={{ animationDelay: "5500ms" }} />
        {/* 「但你得抠它字眼」6700ms */}
        <div className="se-s0-foot se-fade" style={{ animationDelay: "6700ms" }}>
          <span className="se-s0-foot-ic"><IconLens /></span>但你得<b>抠它的字眼</b>
        </div>
      </section>
    );
  }

  /* ───────── s1 [121.700] ExploitBench：1/3 算力追平 Mythos 预览版 ───────── */
  if (step === 1) {
    return (
      <section className="se-scene se-s1" key="s1">
        <div className="se-kicker se-down" style={{ animationDelay: "0ms" }}>
          <span className="se-dot" />挖漏洞评测 · EXPLOIT BENCHMARK
        </div>
        {/* 「专门考挖漏洞能力的榜」0ms */}
        <div className="se-s1-head se-fade" style={{ animationDelay: "0ms" }}>
          专门考<span className="se-accent">挖漏洞能力</span>的榜单
        </div>
        {/* 「ExploitBench」1733ms */}
        <div className="se-s1-bench se-pop" style={{ animationDelay: "1733ms" }}>
          <span className="se-s1-bench-ic"><IconBug /></span>ExploitBench
        </div>

        {/* 算力对比柱：Mythos 满格 vs Sol 1/3，同到一条达成线 */}
        <div className="se-s1-stage">
          {/* 达成线 + "≈ 追平" 5066ms */}
          <span className="se-s1-goal" style={{ animationDelay: "5066ms" }}>
            <span className="se-s1-goal-tag se-pop" style={{ animationDelay: "5066ms" }}>同等效果</span>
          </span>
          <span className="se-s1-eq" style={{ animationDelay: "5066ms" }}>
            <span className="se-s1-eq-sign se-pop" style={{ animationDelay: "5066ms" }}>≈</span>
            <span className="se-s1-eq-t se-fade" style={{ animationDelay: "5266ms" }}>追平</span>
          </span>

          {/* Mythos 满格算力（灰）3166ms */}
          <div className="se-s1-col se-s1-col-mythos">
            <span className="se-s1-bar se-s1-bar-mythos se-grow-y" style={{ ["--se-h" as string]: "420px", animationDelay: "3166ms" }}>
              <span className="se-s1-bar-cap se-fade" style={{ animationDelay: "3700ms" }}>满算力</span>
            </span>
            <span className="se-s1-col-name se-fade" style={{ animationDelay: "3166ms" }}>
              Mythos 预览版<em>FULL COMPUTE</em>
            </span>
          </div>

          {/* Sol 约 1/3 算力（绿，更省）3166ms；顶部"省下的"幽灵框 */}
          <div className="se-s1-col se-s1-col-sol">
            <span className="se-s1-bar se-s1-bar-sol se-grow-y" style={{ ["--se-h" as string]: "140px", animationDelay: "3166ms" }}>
              <span className="se-s1-saved se-fade" style={{ height: "280px", animationDelay: "4400ms" }}>
                <span className="se-s1-saved-t">省下的<br />算力</span>
              </span>
              <span className="se-s1-bar-cap se-fade" style={{ animationDelay: "3700ms" }}>
                <span className="se-s1-bar-sol-num">⅓</span><span className="se-s1-bar-unit se-s1-bar-sol-num"> 算力</span>
              </span>
            </span>
            <span className="se-s1-col-name se-fade" style={{ animationDelay: "3166ms" }}>
              GPT-5.6 <strong>Sol</strong><em>≈ 1/3 COMPUTE</em>
            </span>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s2 [128.633] 抠字眼：追平 ✓ / 更省 ✓ / 碾压 ✗ ───────── */
  if (step === 2) {
    return (
      <section className="se-scene se-s2" key="s2">
        <div className="se-kicker se-down" style={{ animationDelay: "0ms" }}>
          <span className="se-dot se-dot-mix" />抠字眼 · READ THE FINE PRINT
        </div>
        {/* 「你注意，是追平」0ms */}
        <div className="se-s2-head se-fade" style={{ animationDelay: "0ms" }}>
          你注意啊——<em>到底是哪几个字</em>
        </div>
        <div className="se-verdicts">
          {/* 追平 ✓ 0ms */}
          <div className="se-verdict se-verdict-yes se-pop" style={{ animationDelay: "0ms" }}>
            <span className="se-verdict-mark"><span className="se-verdict-mark-ic"><IconCheck /></span></span>
            <span className="se-verdict-word">追平</span>
            <span className="se-verdict-sub">MATCHED</span>
          </div>
          {/* 更省 ✓ 1400ms */}
          <div className="se-verdict se-verdict-yes se-pop" style={{ animationDelay: "1400ms" }}>
            <span className="se-verdict-mark"><span className="se-verdict-mark-ic"><IconCheck /></span></span>
            <span className="se-verdict-word">更省</span>
            <span className="se-verdict-sub">CHEAPER</span>
          </div>
          {/* 碾压 ✗ 1400ms（与"不是碾压"同一拍） */}
          <div className="se-verdict se-verdict-no se-pop" style={{ animationDelay: "1400ms" }}>
            <span className="se-verdict-mark"><span className="se-verdict-mark-ic"><IconCross /></span></span>
            <span className="se-verdict-word">碾压</span>
            <span className="se-verdict-sub">NOT CRUSHING</span>
          </div>
        </div>
        {/* 落句：「它赢在省」3333ms ·「不是赢在更强」4000ms */}
        <div className="se-s2-foot">
          <span className="se-fade" style={{ animationDelay: "3333ms" }}>它<span className="se-win">赢在省</span>，</span>
          <span className="se-fade" style={{ animationDelay: "4000ms" }}>不是<span className="se-not">赢在更强</span></span>
        </div>
      </section>
    );
  }

  /* ───────── s3 [133.733] 反证 + 收：个别维度 Mythos 还更高 → 听听就行 ───────── */
  return (
    <section className="se-scene se-s3" key="s3">
      <div className="se-kicker se-down" style={{ animationDelay: "0ms" }}>
        <span className="se-dot se-dot-mix" />反证 · COUNTER-EVIDENCE
      </div>
      {/* 左右铺满：左=Twitter 贴图反证；右=结论（个别≠全面 → 听听就行）*/}
      <div className="se-s3-grid">
      <div className="se-s3-col-card">
      {/* Twitter 贴图小卡：「Twitter 上有人贴图」0ms */}
      <div className="se-s3-card se-pop" style={{ animationDelay: "0ms" }}>
        <div className="se-s3-card-top">
          <span className="se-s3-avatar"><span className="se-s3-avatar-ic"><IconUser /></span></span>
          <span className="se-s3-handle"><b>某网友</b><span>@on_twitter</span></span>
          <span className="se-s3-bird"><IconBird /></span>
        </div>
        {/* 「个别维度 Mythos 还更高」2033ms */}
        <div className="se-s3-card-body se-fade" style={{ animationDelay: "2033ms" }}>
          实测下来，<span className="se-hi">个别维度上 Mythos 分数还更高</span>。
        </div>
        {/* 迷你维度条：这一项 Mythos(橙) 反超 Sol(灰) 2033ms */}
        <div className="se-s3-mini">
          <div className="se-s3-mini-row se-fade" style={{ animationDelay: "2333ms" }}>
            <span className="se-s3-mini-name">该维度</span>
            <span className="se-s3-mini-track">
              <span className="se-s3-mini-fill se-s3-mini-fill-mythos se-grow" style={{ ["--se-w" as string]: "100%", animationDelay: "2533ms" }} />
            </span>
            <span className="se-s3-mini-val se-s3-mini-val-hi">Mythos</span>
          </div>
          <div className="se-s3-mini-row se-fade" style={{ animationDelay: "2333ms" }}>
            <span className="se-s3-mini-name">该维度</span>
            <span className="se-s3-mini-track">
              <span className="se-s3-mini-fill se-s3-mini-fill-sol se-grow" style={{ ["--se-w" as string]: "82%", animationDelay: "2533ms" }} />
            </span>
            <span className="se-s3-mini-val se-s3-mini-val-lo">Sol</span>
          </div>
        </div>
      </div>
      </div>
      <div className="se-s3-col-out">
      {/* 标签：「个别，不是全面」4333ms */}
      <div className="se-s3-badge se-stamp" style={{ animationDelay: "4333ms" }}>
        <b>个别</b> ≠ 全面
      </div>
      {/* 落版：「所以 史上最强 四个字」5600ms ·「听听就行」7300ms */}
      <div className="se-s3-kicker-out se-fade" style={{ animationDelay: "5600ms" }}>
        所以<span className="se-q">“史上最强”</span>这四个字——
      </div>
      <div className="se-s3-final se-stamp" style={{ animationDelay: "7300ms" }}>听听就行</div>
      </div>
      </div>
    </section>
  );
}
