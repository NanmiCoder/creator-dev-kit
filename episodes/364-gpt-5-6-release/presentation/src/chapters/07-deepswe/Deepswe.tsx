import type { ChapterStepProps } from "../../registry/types";
import "./Deepswe.css";

/* ── 内联图标（SVG，无 emoji）── */
const IconLock = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6Z" /><path d="m9 12 2 2 4-4" />
  </svg>
);
const IconBan = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M5.6 5.6 18.4 18.4" />
  </svg>
);
const IconCash = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" />
  </svg>
);

/* 数字滚轮 count-up：滚一整圈后落到目标 d（仿章 1 Roll）。 */
const Roll = ({ d, delay }: { d: number; delay: number }) => (
  <span className="ds-roll">
    <span className="ds-roll-col" style={{ animationDelay: `${delay}ms`, ["--ds-to" as string]: `${-(10 + d)}em` }}>
      {"01234567890123456789".split("").map((c, i) => <span key={i}>{c}</span>)}
    </span>
  </span>
);

/* 横向条形榜单一行（仿章 1 op-s2：等宽轨道 + 不同 fill 宽度）。 */
type BarTone = "lead" | "close" | "open";
const Bar = ({
  rank, name, tag, value, width, tone, rowDelay, fillDelay, numDelay, hero, dim,
}: {
  rank: string;
  name: string;
  tag?: string;
  value: string;
  width: string;
  tone: BarTone;
  rowDelay: number;
  fillDelay: number;
  numDelay: number;
  hero?: boolean;
  dim?: boolean;
}) => (
  <div
    className={`ds-row${hero ? " ds-row-hero" : ""}${dim ? " ds-row-dim" : ""} ds-fade`}
    style={{ animationDelay: `${rowDelay}ms` }}
  >
    <span className="ds-rank">{rank}</span>
    <span className="ds-name">
      {name}
      {tag ? <em>{tag}</em> : null}
    </span>
    <span className={`ds-track ds-track-${tone}`}>
      <span
        className={`ds-fill ds-fill-${tone} ds-grow`}
        style={{ ["--ds-w" as string]: width, animationDelay: `${fillDelay}ms` }}
      />
    </span>
    {hero ? (
      <span className={`ds-num ds-num-${tone}`}>
        {value.split("").map((c, i) =>
          c === "." ? (
            <span key={i} className="ds-pt">.</span>
          ) : (
            <Roll key={i} d={Number(c)} delay={numDelay + i * 110} />
          ),
        )}
      </span>
    ) : (
      <span className={`ds-num ds-num-${tone} ds-fade`} style={{ animationDelay: `${numDelay}ms` }}>{value}</span>
    )}
  </div>
);

/**
 * 章 7 · deepswe —— 全片高潮 · 抖包袱。第 3 章埋的「DeepSWE 上谁高谁低 / 国产排第几」揭晓。
 * 基准（屏上务必准确）：DeepSWE = 抗污染真榜 113 题；GPT-5.6 不在榜（锁着）；
 *   闭源领跑 Claude Fable 5 69.9(#1) / GPT-5.5 67.0 / Opus 4.8 59.0；
 *   国产最强开源 GLM-5.2 ≈ 44（低闭源一档）；价格屠夫 GLM-5.2 $3.92/题 vs Fable 5 $21.63/题；DeepSeek V4 Pro 也在开源前列。
 * ⚠️ 口播把 GPT-5.5 口误成 60 分，屏上一律 67.0。
 * 屏=信息图，整句字幕后期加。每步子元素按 SRT cue 绝对延时（相对步起始秒）揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中/偏下）。
 */
export default function Deepswe({ step }: ChapterStepProps) {
  /* ───────── s0 [246.166] 回到 DeepSWE 真榜 + 硬核设计 ───────── */
  if (step === 0) {
    return (
      <section className="ds-scene ds-s0" key="s0">
        <div className="ds-kicker ds-down" style={{ animationDelay: "0ms" }}>
          <span className="ds-dot" />回到刚才那个榜
        </div>
        <div className="ds-s0-head">
          <span className="ds-s0-ic ds-pop" style={{ animationDelay: "1934ms" }}><IconDoc /></span>
          <div className="ds-s0-name-wrap">
            <h1 className="ds-s0-name">
              <span className="ds-rise-wrap"><span className="ds-rise ds-accent" style={{ animationDelay: "1934ms" }}>DeepSWE</span></span>
            </h1>
            <div className="ds-s0-sub ds-fade" style={{ animationDelay: "5367ms" }}>
              拿<span className="ds-text">真实项目</span>考模型的<span className="ds-accent">真榜</span>
            </div>
          </div>
        </div>
        {/* 硬核设计：四个标签逐个揭示 */}
        <div className="ds-s0-specs">
          <div className="ds-spec ds-spec-num ds-pop" style={{ animationDelay: "7000ms" }}>
            <span className="ds-spec-big">113</span>
            <span className="ds-spec-unit">道题</span>
          </div>
          <div className="ds-spec ds-pop" style={{ animationDelay: "8367ms" }}>
            <span className="ds-spec-ic"><IconDoc /></span>
            <span className="ds-spec-t">全是新出的</span>
          </div>
          <div className="ds-spec ds-pop" style={{ animationDelay: "10134ms" }}>
            <span className="ds-spec-ic"><IconShield /></span>
            <span className="ds-spec-t">背不到答案</span>
          </div>
          <div className="ds-spec ds-pop" style={{ animationDelay: "11434ms" }}>
            <span className="ds-spec-ic"><IconBan /></span>
            <span className="ds-spec-t">最难刷题蒙分</span>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s1 [259.566] 谁最强？先说清 GPT-5.6 不在榜 ───────── */
  if (step === 1) {
    return (
      <section className="ds-scene ds-s1" key="s1">
        <div className="ds-kicker ds-down" style={{ animationDelay: "0ms" }}>
          <span className="ds-dot" />榜上谁最强
        </div>
        <h1 className="ds-s1-q ds-fade" style={{ animationDelay: "0ms" }}>
          榜上现在<span className="ds-accent">谁最强</span>？
        </h1>
        {/* GPT-5.6 缺席占位 */}
        <div className="ds-s1-absent ds-pop" style={{ animationDelay: "1867ms" }}>
          <div className="ds-s1-absent-top mono">本该是它 · OPENAI</div>
          <div className="ds-s1-absent-name">GPT-5.6</div>
          <div className="ds-s1-absent-bar ds-fade" style={{ animationDelay: "3867ms" }}>
            <span className="ds-s1-absent-bar-empty mono">— 无成绩 —</span>
          </div>
          <div className="ds-s1-stamp ds-stamp" style={{ animationDelay: "3867ms" }}>
            <span className="ds-s1-stamp-ic"><IconLock /></span>不在榜上
          </div>
        </div>
        <div className="ds-s1-tags">
          <span className="ds-s1-tag ds-pop" style={{ animationDelay: "4967ms" }}><span className="ds-s1-tag-ic"><IconLock /></span>锁着</span>
          <span className="ds-s1-tag ds-pop" style={{ animationDelay: "4967ms" }}><span className="ds-no">✕</span>没成绩</span>
          <span className="ds-s1-tag ds-pop" style={{ animationDelay: "7067ms" }}><span className="ds-no">✕</span>评测不了</span>
        </div>
      </section>
    );
  }

  /* ───────── s2 [266.633] 闭源领跑（核心条形榜，仿章 1 op-s2 等宽轨道）───────── */
  if (step === 2) {
    return (
      <section className="ds-scene ds-s2" key="s2">
        <div className="ds-kicker ds-down" style={{ animationDelay: "0ms" }}>
          <span className="ds-dot" />真正领跑的还是闭源 · DEEPSWE
        </div>
        <div className="ds-bars">
          <Bar
            rank="#1" name="Claude Fable 5" tag="闭源 · 第一" value="69.9" width="99.7%" tone="lead"
            rowDelay={2067} fillDelay={2067} numDelay={3000} hero
          />
          <Bar
            rank="#2" name="GPT-5.5" value="67.0" width="90%" tone="close"
            rowDelay={4833} fillDelay={4833} numDelay={4833}
          />
          <Bar
            rank="#3" name="Claude Opus 4.8" value="59.0" width="63.3%" tone="close"
            rowDelay={6600} fillDelay={6600} numDelay={6600}
          />
        </div>
        <div className="ds-s2-foot ds-stamp" style={{ animationDelay: "2067ms" }}>闭源领跑</div>
      </section>
    );
  }

  /* ───────── s3 [275.366] 国产 GLM-5.2 开源第一（但低闭源一档）───────── */
  if (step === 3) {
    return (
      <section className="ds-scene ds-s3" key="s3">
        <div className="ds-kicker ds-down" style={{ animationDelay: "0ms" }}>
          <span className="ds-dot" />那国产呢 · DEEPSWE
        </div>
        <div className="ds-bars ds-bars-s3">
          {/* 闭源三条定格在场（暗一档），国产落在其下 */}
          <Bar rank="#1" name="Claude Fable 5" tag="闭源" value="69.9" width="99.7%" tone="lead" rowDelay={0} fillDelay={0} numDelay={0} dim />
          <Bar rank="#2" name="GPT-5.5" value="67.0" width="90%" tone="close" rowDelay={0} fillDelay={0} numDelay={0} dim />
          <Bar rank="#3" name="Claude Opus 4.8" value="59.0" width="63.3%" tone="close" rowDelay={0} fillDelay={0} numDelay={0} dim />
          <div className="ds-divider ds-grow-x" style={{ animationDelay: "867ms" }}>
            <span className="ds-divider-t mono ds-fade" style={{ animationDelay: "3467ms" }}>开源 · OPEN SOURCE</span>
          </div>
          <Bar
            rank="开源#1" name="GLM-5.2" tag="国产最强" value="44.0" width="13.3%" tone="open"
            rowDelay={867} fillDelay={867} numDelay={2467} hero
          />
        </div>
        <div className="ds-s3-gap ds-fade" style={{ animationDelay: "6067ms" }}>
          <span className="ds-s3-gap-lead">开源里最强</span>
          <span className="ds-s3-gap-but ds-stamp" style={{ animationDelay: "7400ms" }}>比闭源低一档</span>
        </div>
      </section>
    );
  }

  /* ───────── s4 [283.966] 价格屠夫（落点）+ DeepSeek ───────── */
  return (
    <section className="ds-scene ds-s4" key="s4">
      <div className="ds-kicker ds-down" style={{ animationDelay: "0ms" }}>
        <span className="ds-dot" />但你看它的价格 · 一道题多少钱
      </div>
      {/* 价格大对比：GLM-5.2 vs Fable 5 */}
      <div className="ds-price">
        <div className="ds-price-side ds-price-cheap ds-pop" style={{ animationDelay: "1934ms" }}>
          <div className="ds-price-top mono">国产 · GLM-5.2</div>
          <div className="ds-price-fig">
            <span className="ds-price-cur">$</span>
            <span className="ds-price-num ds-accent"><Roll d={3} delay={1934} /><span className="ds-pt">.</span><Roll d={9} delay={2054} /><Roll d={2} delay={2174} /></span>
          </div>
          <div className="ds-price-unit">每道题</div>
          <div className="ds-price-ic"><IconCash /></div>
        </div>
        <div className="ds-price-vs ds-pop" style={{ animationDelay: "5034ms" }}>VS</div>
        <div className="ds-price-side ds-price-dear ds-pop" style={{ animationDelay: "5034ms" }}>
          <div className="ds-price-top mono">闭源 · Claude Fable 5</div>
          <div className="ds-price-fig">
            <span className="ds-price-cur ds-price-cur-dear">$</span>
            <span className="ds-price-num ds-price-num-dear">21.63</span>
          </div>
          <div className="ds-price-unit">每道题</div>
          <div className="ds-price-ic ds-price-ic-dear"><IconCash /></div>
        </div>
      </div>
      <div className="ds-s4-punch ds-stamp" style={{ animationDelay: "7267ms" }}>
        约 <span className="ds-s4-punch-frac">1/5</span> · 零头都不到
      </div>
      <div className="ds-s4-ds ds-fade" style={{ animationDelay: "8534ms" }}>
        <span className="ds-s4-ds-ic"><IconDoc /></span>
        DeepSeek V4 Pro 也在<span className="ds-accent">开源前列</span>
      </div>
    </section>
  );
}
