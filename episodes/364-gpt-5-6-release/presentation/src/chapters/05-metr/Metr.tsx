import type { ChapterStepProps } from "../../registry/types";
import "./Metr.css";

/* ── 内联图标（SVG，无 emoji）── */
/* 放大镜：钻评测漏洞 / 找漏洞 */
const IconScope = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /><path d="M11 8v6M8 11h6" />
  </svg>
);
/* 钥匙/翻答案：翻出藏起来的答案 */
const IconKey = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="4.2" /><path d="M11 11l8 8" /><path d="M16.5 16.5l2-2" /><path d="M19 19l1.6-1.6" />
  </svg>
);
/* 尖括号 </>：源码里找现成解 */
const IconCode = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 7l-5 5 5 5" /><path d="M15 7l5 5-5 5" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
/* 盾牌：防守严密的系统 */
const IconShield = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z" /><path d="M9.5 12l1.8 1.8L15 10" />
  </svg>
);
/* METR 标记：实验室棱镜（三角分光） */
const GlyphPrism = () => (
  <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 8 38 36 H6 Z" /><path d="M14 24h22" /><path d="M22 8v28" />
  </svg>
);

/**
 * 章 5 · metr —— 第三方评测机构 METR + 能力边界。
 * 我们测不了 → 看 METR（拿到预览权限）；旗舰作弊率全场最高（三种手法）→ 能力分作废；
 * 但没明显更强、离自动化 AI 研发远；网安能力边界：能找漏洞/写攻击代码，但打不进防守严密系统、没到 Critical。
 * 屏幕=信息图（仪表/印章/裁决/红线/危险等级表），整句字幕后期加。子元素按 cue 绝对延时揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中/偏下）。
 */
export default function Metr({ step }: ChapterStepProps) {
  /* ───────── s0 [142.200] 测不了 → 看第三方 METR（拿到预览权限）───────── */
  if (step === 0) {
    return (
      <section className="me-scene me-s0" key="s0">
        <div className="me-kicker me-down" style={{ animationDelay: "0ms" }}>
          <span className="me-dot" />THIRD-PARTY EVAL · 第三方评测
        </div>
        <div className="me-s0-flip">
          {/* 旧态：我们测不了（被划掉、退场） */}
          <div className="me-s0-us me-fade" style={{ animationDelay: "0ms" }}>
            <span className="me-s0-us-x"><IconX /></span>
            <span className="me-s0-us-t">我们 · 测不了</span>
            <span className="me-s0-us-strike" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="me-s0-arrow me-pop" style={{ animationDelay: "1100ms" }}>→</span>
          {/* 新态：第三方 METR */}
          <div className="me-s0-org me-org-in" style={{ animationDelay: "1300ms" }}>
            <span className="me-s0-glyph"><GlyphPrism /></span>
            <div className="me-s0-org-tx">
              <span className="me-s0-org-name">METR</span>
              <span className="me-s0-org-sub mono me-fade" style={{ animationDelay: "1900ms" }}>独立评测机构</span>
            </div>
            <span className="me-s0-badge me-stamp" style={{ animationDelay: "3233ms" }}>
              <span className="me-s0-badge-dot" />PREVIEW · 拿到预览权限
            </span>
          </div>
        </div>
        <div className="me-s0-foot me-fade" style={{ animationDelay: "5100ms" }}>
          结果<span className="me-accent">挺有意思</span>
        </div>
      </section>
    );
  }

  /* ───────── s1 [148.500] 作弊率全场最高 + 三种作弊手法 ───────── */
  if (step === 1) {
    return (
      <section className="me-scene me-s1" key="s1">
        <div className="me-kicker me-down" style={{ animationDelay: "0ms" }}>
          <span className="me-dot me-dot-neg" />METR 实测 · 旗舰 GPT-5.6
        </div>
        <div className="me-s1-head me-fade" style={{ animationDelay: "0ms" }}>
          这个旗舰模型的
        </div>
        <div className="me-s1-gauge">
          <span className="me-s1-label me-slam" style={{ animationDelay: "2066ms" }}>作弊率</span>
          <span className="me-s1-track">
            <span className="me-s1-fill me-grow" style={{ ["--me-w" as string]: "100%", animationDelay: "3633ms" }} />
            <span className="me-s1-peak mono me-fade" style={{ animationDelay: "3633ms" }}>MAX</span>
          </span>
          <span className="me-s1-verdict me-stamp" style={{ animationDelay: "3633ms" }}>
            所有公开模型里 · 全场最高
          </span>
        </div>
        <div className="me-s1-ways">
          <div className="me-s1-way me-pop" style={{ animationDelay: "5200ms" }}>
            <span className="me-s1-way-ic"><IconScope /></span>
            <span className="me-s1-way-t">钻评测漏洞</span>
          </div>
          <div className="me-s1-way me-pop" style={{ animationDelay: "6433ms" }}>
            <span className="me-s1-way-ic"><IconKey /></span>
            <span className="me-s1-way-t">翻出藏起来的答案</span>
          </div>
          <div className="me-s1-way me-pop" style={{ animationDelay: "8366ms" }}>
            <span className="me-s1-way-ic"><IconCode /></span>
            <span className="me-s1-way-t">源码里找现成解</span>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s2 [161.000] 结论①：能力分作废 ───────── */
  if (step === 2) {
    return (
      <section className="me-scene me-s2" key="s2">
        <div className="me-kicker me-down" style={{ animationDelay: "0ms" }}>
          <span className="me-dot me-dot-neg" />METR 结论 ① · VERDICT
        </div>
        {/* 一堆能力分被划掉 */}
        <div className="me-s2-scores">
          {["代码能力", "漏洞挖掘", "推理评测", "攻防演练"].map((s, i) => (
            <div className="me-s2-score me-fade" key={s} style={{ animationDelay: `${i * 110}ms` }}>
              <span className="me-s2-score-name">{s}</span>
              <span className="me-s2-score-num mono">PASS</span>
              <span className="me-s2-score-strike" style={{ animationDelay: `${1966 + i * 90}ms` }} />
            </div>
          ))}
        </div>
        <div className="me-s2-stamp-wrap">
          <div className="me-s2-stamp me-stamp" style={{ animationDelay: "1966ms" }}>
            <span className="me-s2-stamp-line">能力分</span>
            <span className="me-s2-stamp-big">一个都不算数</span>
          </div>
          <div className="me-s2-stamp-note me-fade" style={{ animationDelay: "2500ms" }}>
            <span className="me-s2-stamp-note-ic"><IconX /></span>
            作弊刷出来的分 · 全部作废
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s3 [165.066] 结论②：没更强 + 离自动化 AI 研发远 ───────── */
  if (step === 3) {
    return (
      <section className="me-scene me-s3" key="s3">
        <div className="me-kicker me-down" style={{ animationDelay: "0ms" }}>
          <span className="me-dot" />METR 最后结论 · 挺实在
        </div>
        <div className="me-s3-subject me-fade" style={{ animationDelay: "3234ms" }}>
          GPT-5.6 <span className="me-s3-subject-tag">新旗舰</span>
        </div>
        <div className="me-s3-rulings">
          <div className="me-s3-ruling me-ruling-in" style={{ animationDelay: "6067ms" }}>
            <span className="me-s3-ruling-ic"><IconX /></span>
            <span className="me-s3-ruling-t">没明显比现在最强的<em>那几个</em>更强</span>
          </div>
          <div className="me-s3-ruling me-ruling-in" style={{ animationDelay: "8667ms" }}>
            <span className="me-s3-ruling-ic"><IconX /></span>
            <span className="me-s3-ruling-t">离自己搞 AI 研发<em>还差得远</em></span>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s4 [175.866] 能力边界（OpenAI 与 METR 同一条线）───────── */
  return (
    <section className="me-scene me-s4" key="s4">
      <div className="me-kicker me-down" style={{ animationDelay: "0ms" }}>
        <span className="me-dot" />说回网安 · 能力边界
      </div>
      <div className="me-s4-aligned me-fade" style={{ animationDelay: "900ms" }}>
        <span className="me-s4-org">OpenAI</span>
        <span className="me-s4-amp">＋</span>
        <span className="me-s4-org">METR</span>
        <span className="me-s4-same me-pop" style={{ animationDelay: "2767ms" }}>划了同一条线</span>
      </div>
      <div className="me-s4-line">
        {/* 线下：能做到（绿，勾） */}
        <div className="me-s4-can">
          <div className="me-s4-item me-s4-yes me-pop" style={{ animationDelay: "4734ms" }}>
            <span className="me-s4-item-ic"><IconScope /></span>找漏洞
          </div>
          <div className="me-s4-item me-s4-yes me-pop" style={{ animationDelay: "5800ms" }}>
            <span className="me-s4-item-ic"><IconCode /></span>写一小段攻击代码
          </div>
        </div>
        {/* 红线天花板 */}
        <div className="me-s4-redline me-redline-in" style={{ animationDelay: "7200ms" }}>
          <span className="me-s4-redline-tag mono">能力天花板 · CEILING</span>
        </div>
        {/* 线上：做不到（灰/红，叉） */}
        <div className="me-s4-cant">
          <div className="me-s4-item me-s4-no me-pop" style={{ animationDelay: "7200ms" }}>
            <span className="me-s4-item-ic"><IconShield /></span>对防守严密的系统…
          </div>
          <div className="me-s4-item me-s4-no me-pop" style={{ animationDelay: "9800ms" }}>
            <span className="me-s4-item-ic"><IconX /></span>从头打进去
          </div>
          <div className="me-s4-item me-s4-no me-pop" style={{ animationDelay: "11134ms" }}>
            <span className="me-s4-item-ic"><IconX /></span>拿到最高权限
          </div>
        </div>
      </div>
      {/* 危险等级表：最高档 Critical 灰着没点亮 */}
      <div className="me-s4-levels me-fade" style={{ animationDelay: "12867ms" }}>
        <span className="me-s4-levels-cap mono">OPENAI 危险等级</span>
        <div className="me-s4-levels-row">
          <span className="me-s4-lv me-lv-lit">Low</span>
          <span className="me-s4-lv me-lv-lit">Medium</span>
          <span className="me-s4-lv me-lv-lit me-lv-now">High</span>
          <span className="me-s4-lv me-lv-dark" style={{ animationDelay: "14600ms" }}>
            Critical<span className="me-s4-lv-off">未点亮</span>
          </span>
        </div>
        <span className="me-s4-levels-note me-fade" style={{ animationDelay: "14600ms" }}>
          没到最高那一档 · NOT CRITICAL
        </span>
      </div>
    </section>
  );
}
