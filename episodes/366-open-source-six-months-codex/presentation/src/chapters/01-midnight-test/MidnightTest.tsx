import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./MidnightTest.css";

const cssVar = (vars: Record<string, string>): CSSProperties =>
  vars as CSSProperties;

function Shell({
  step,
  label,
  children,
}: {
  step: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className={`mp-scene mp-step-${step}`}>
      <div className="mp-kicker mp-down">CODEX FOR OSS · {label}</div>
      {children}
    </section>
  );
}

function WordStack({
  eyebrow,
  top,
  accent,
  note,
}: {
  eyebrow: string;
  top: string;
  accent: string;
  note?: string;
}) {
  return (
    <div className="mp-word-stack">
      <div className="mp-eyebrow mp-fade">{eyebrow}</div>
      <h1>
        <span className="mp-rise-wrap">
          <span className="mp-rise">{top}</span>
        </span>
        <span className="mp-rise-wrap">
          <span className="mp-rise mp-accent" style={{ animationDelay: "220ms" }}>
            {accent}
          </span>
        </span>
      </h1>
      {note ? (
        <p className="mp-fade" style={{ animationDelay: "620ms" }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

function SoftCard({
  className = "",
  delay = 0,
  children,
  style,
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`mp-soft-card mp-card-pop ${className}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

function StampCard({
  text,
  tone,
  delay,
}: {
  text: string;
  tone: "no" | "yes";
  delay: number;
}) {
  return (
    <div className={`mp-stamp-card mp-stamp-${tone}`} style={{ animationDelay: `${delay}ms` }}>
      {text}
    </div>
  );
}

function Tile({
  title,
  note,
  active,
  delay,
}: {
  title: string;
  note: string;
  active: boolean;
  delay: number;
}) {
  return (
    <SoftCard className={active ? "mp-tile mp-tile-active" : "mp-tile"} delay={delay}>
      <b>{title}</b>
      <span>{note}</span>
    </SoftCard>
  );
}

function BenefitScene({ step }: { step: number }) {
  const states = [
    {
      label: "FREE",
      eyebrow: "刚刚发生的结果",
      top: "一分钱",
      accent: "没花",
      note: "先把结论放出来。",
      chips: ["0 RMB", "real account", "not a lottery"],
    },
    {
      label: "OPENAI",
      eyebrow: "不是第三方活动",
      top: "OpenAI",
      accent: "送的",
      note: "官方给到开源维护者。",
      chips: ["official", "open source", "maintainer"],
    },
    {
      label: "CODEX",
      eyebrow: "真正值钱的是这个",
      top: "6 个月",
      accent: "Codex",
      note: "ChatGPT Pro with Codex。",
      chips: ["6 months", "Codex", "Pro"],
    },
  ] as const;
  const s = states[step]!;
  return (
    <Shell step={step} label={s.label}>
      <div className="mp-benefit-scene">
        <WordStack eyebrow={s.eyebrow} top={s.top} accent={s.accent} note={s.note} />
        <div className="mp-chip-cloud">
          {s.chips.map((chip, i) => (
            <SoftCard key={chip} className="mp-chip" delay={320 + i * 140}>
              {chip}
            </SoftCard>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function ValueScene({ step }: { step: number }) {
  const phase = step - 3;
  const hero = [
    ["20X", "这个档位"],
    ["$200", "一个月"],
    ["6 个月", "直接送"],
    ["8000+", "人民币价值"],
  ][phase]!;
  const activeMonths = phase >= 2 ? 6 : 0;
  return (
    <Shell step={step} label="VALUE">
      <div className="mp-value-scene">
        <WordStack
          eyebrow="价值换算"
          top={hero[0]}
          accent={hero[1]}
          note="价值不是抽象数字。"
        />
        <div
          className={`mp-value-board mp-value-phase-${phase}`}
          style={cssVar({
            "--mp-plan-fill": phase >= 0 ? "1" : "0",
            "--mp-month-fill": phase >= 1 ? "100%" : "0%",
            "--mp-total-fill": phase >= 3 ? "1" : "0",
            "--mp-months-active": `${activeMonths}`,
          })}
        >
          <div className="mp-conversion-row mp-conversion-plan">
            <span>Codex plan</span>
            <div className="mp-plan-meter">
              <i />
              <b>20X</b>
            </div>
          </div>
          <div className="mp-conversion-row mp-conversion-month">
            <span>Monthly cost</span>
            <div className="mp-month-column">
              <i />
              <b>$200</b>
              <em>/ month</em>
            </div>
          </div>
          <div className="mp-month-stack" aria-label="6 months">
            {Array.from({ length: 6 }, (_, index) => (
              <span
                key={index}
                className={index < activeMonths ? "mp-month-block mp-month-on" : "mp-month-block"}
                style={cssVar({ "--mp-block-index": `${index}` })}
              >
                M{index + 1}
              </span>
            ))}
          </div>
          <div className="mp-total-value">
            <span>Accumulated value</span>
            <b>8000+</b>
            <i />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function LegitimacyScene({ step }: { step: number }) {
  const mode = step - 7;
  const hero = [
    ["不是", "抽奖"],
    ["不是", "灰产羊毛"],
    ["官方", "OSS 福利"],
  ][mode]!;
  return (
    <Shell step={step} label="OFFICIAL">
      <div className="mp-legit-scene">
        <WordStack
          eyebrow="先把性质说清楚"
          top={hero[0]}
          accent={hero[1]}
          note={mode === 2 ? "面向开源项目维护者。" : "排除错误理解。"}
        />
        <div className="mp-stamp-stage">
          <StampCard text="不是抽奖" tone={mode === 0 ? "yes" : "no"} delay={280} />
          <StampCard text="不是灰产" tone={mode === 1 ? "yes" : "no"} delay={480} />
          <StampCard text="官方福利" tone={mode === 2 ? "yes" : "no"} delay={680} />
        </div>
      </div>
    </Shell>
  );
}

function PivotScene({ step }: { step: number }) {
  const isLogic = step === 11;
  return (
    <Shell step={step} label="PIVOT">
      <div className="mp-pivot-scene">
        <div className={isLogic ? "mp-muted-claim mp-slide-away" : "mp-muted-claim"}>
          <span>这期不是</span>
          <b>炫耀结果</b>
        </div>
        <div className="mp-pivot-main">
          <span className="mp-eyebrow mp-fade">
            {isLogic ? "真正有意思的是" : "先把重点挪开"}
          </span>
          <h2>
            <span className="mp-rise-wrap">
              <span className="mp-rise">{isLogic ? "审核" : "不是"}</span>
            </span>
            <span className="mp-rise-wrap">
              <span className="mp-rise mp-accent" style={{ animationDelay: "220ms" }}>
                {isLogic ? "逻辑" : "炫耀"}
              </span>
            </span>
          </h2>
        </div>
      </div>
    </Shell>
  );
}

function ProjectScene({ step }: { step: number }) {
  const mediaHot = step >= 12 && step <= 14;
  const ccHot = step >= 15 && step <= 16;
  const mediaVerdict = step >= 14;
  const ccVerdict = step >= 16;
  const headline =
    step === 12
      ? ["50K", "star"]
    : step === 13
        ? ["Media", "Crawler"]
        : step === 14
          ? ["多次", "未过"]
          : step === 15
            ? ["cc-haha", "新项目"]
            : ["10K+", "通过"];

  return (
    <Shell step={step} label="COUNTER CASE">
      <div className="mp-project-scene">
        <WordStack
          eyebrow={mediaHot ? "反常识 A" : "反常识 B"}
          top={headline[0]}
          accent={headline[1]}
          note={mediaHot ? "star 很高，但申请没有通过。" : "star 更少，这次反而通过。"}
        />
        <div className="mp-counter-chart">
          <div className="mp-chart-scale">
            <span>repo signal</span>
            <i />
          </div>
          <div
            className={`mp-chart-row mp-media-row ${mediaHot ? "mp-row-hot" : ""} ${
              mediaVerdict ? "mp-row-fail" : ""
            }`}
          >
            <div className="mp-row-label">
              <b>MediaCrawler</b>
              <span>50K star</span>
            </div>
            <div className="mp-star-bar">
              <i />
              <em>long bar</em>
            </div>
            <div className="mp-gate-result">{mediaVerdict ? "未通过" : "待审核"}</div>
          </div>
          <div
            className={`mp-chart-row mp-cc-row ${ccHot ? "mp-row-hot" : ""} ${
              ccVerdict ? "mp-row-pass" : ""
            }`}
          >
            <div className="mp-row-label">
              <b>cc-haha</b>
              <span>{ccVerdict ? "10K+ star" : "new repo"}</span>
            </div>
            <div className="mp-star-bar">
              <i />
              <em>short bar</em>
            </div>
            <div className="mp-gate-result">{ccVerdict ? "通过" : "未揭示"}</div>
          </div>
          <div className="mp-review-gate">
            <span>审核不是 star 排序</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function QuestionScene({ step }: { step: number }) {
  const first = step === 17;
  return (
    <Shell step={step} label="QUESTION">
      <div className="mp-question-scene">
        <div className="mp-big-mark mp-card-pop">?</div>
        <WordStack
          eyebrow={first ? "核心问题" : "给普通开发者的问题"}
          top={first ? "审核到底" : "从 0 做"}
          accent={first ? "看什么" : "还有机会吗"}
          note={first ? "star 不是唯一答案。" : "这个问题会决定后面怎么讲。"}
        />
      </div>
    </Shell>
  );
}

function PromiseScene({ step }: { step: number }) {
  const active = step - 19;
  const tiles = [
    ["申请经验", "怎么填、怎么证明、怎么提高概率"],
    ["开源理解", "为什么它看重维护信号"],
    ["毫无保留", "把踩过的坑直接摊开讲"],
  ] as const;
  return (
    <Shell step={step} label="PROMISE">
      <div className="mp-promise-scene">
        <WordStack
          eyebrow="这期会讲什么"
          top={tiles[active]![0]}
          accent={active === 2 ? "分享给你" : "拆开讲"}
          note={tiles[active]![1]}
        />
        <div className="mp-tile-grid">
          {tiles.map(([title, note], i) => (
            <Tile key={title} title={title} note={note} active={i === active} delay={240 + i * 130} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

function OfficialScene({ step }: { step: number }) {
  const active = step - 22;
  const nodes = [
    ["entry", "官方表单", "真实入口"],
    ["clear", "页面写清", "福利范围"],
    ["maintainer", "maintainer", "开源维护者"],
    ["api", "API credits", "调用额度"],
    ["pro", "ChatGPT Pro", "6 months"],
    ["codex", "Pro with Codex", "关键套餐"],
    ["x20", "Codex 20X", "高频编码"],
    ["oss", "开源项目", "issue / release"],
    ["value", "非常香", "daily use"],
  ] as const;
  const [activeId, top, accent] = nodes[active]!;
  return (
    <Shell step={step} label="OFFICIAL PAGE">
      <div className="mp-official-scene">
        <WordStack
          eyebrow="进入官方页面"
          top={top}
          accent={accent}
          note="先看官方入口到底写了什么。"
        />
        <div className="mp-browser-card mp-application-map mp-card-pop">
          <div className="mp-browser-title">OpenAI for Open Source</div>
          <div className="mp-map-canvas">
            <svg className="mp-map-lines" viewBox="0 0 760 460" aria-hidden="true">
              <path className={active >= 1 ? "mp-line-on" : ""} d="M92 82 H328" />
              <path className={active >= 2 ? "mp-line-on" : ""} d="M328 82 H548" />
              <path className={active >= 3 ? "mp-line-on" : ""} d="M548 112 C548 178 412 184 412 238" />
              <path className={active >= 4 ? "mp-line-on" : ""} d="M548 112 C548 184 662 184 662 238" />
              <path className={active >= 5 ? "mp-line-on" : ""} d="M662 290 C662 348 548 354 548 388" />
              <path className={active >= 6 ? "mp-line-on" : ""} d="M548 388 H326" />
              <path className={active >= 7 ? "mp-line-on" : ""} d="M326 388 H132" />
              <path className={active >= 8 ? "mp-line-on" : ""} d="M132 388 C132 310 246 306 326 306" />
            </svg>
            {nodes.map(([id, title, note], index) => (
              <div
                key={id}
                className={`mp-map-node mp-node-${id} ${
                  index <= active ? "mp-node-seen" : ""
                } ${id === activeId ? "mp-node-active" : ""}`}
              >
                <b>{title}</b>
                <span>{note}</span>
              </div>
            ))}
          </div>
          <div className="mp-map-caption">
            <span>application branch</span>
            <b>{"maintainer -> API credits / ChatGPT Pro -> Codex 20X -> 高频使用"}</b>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function MidnightTest({ step }: ChapterStepProps) {
  if (step <= 2) return <BenefitScene step={step} />;
  if (step <= 6) return <ValueScene step={step} />;
  if (step <= 9) return <LegitimacyScene step={step} />;
  if (step <= 11) return <PivotScene step={step} />;
  if (step <= 16) return <ProjectScene step={step} />;
  if (step <= 18) return <QuestionScene step={step} />;
  if (step <= 21) return <PromiseScene step={step} />;
  if (step <= 30) return <OfficialScene step={step} />;

  return null;
}
