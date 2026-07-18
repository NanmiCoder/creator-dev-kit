import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./ReviewCriteria.css";

const cssVar = (vars: Record<string, string>): CSSProperties =>
  vars as CSSProperties;

type SignalKey = "maintainer" | "activity" | "value";
type EvidenceKey = "commit" | "download" | "contributor";

const signalCards: Array<{
  key: SignalKey;
  label: string;
  title: string;
  note: string;
}> = [
  {
    key: "maintainer",
    label: "identity",
    title: "Maintainer",
    note: "核心维护者",
  },
  {
    key: "activity",
    label: "rhythm",
    title: "Activity",
    note: "持续发生",
  },
  {
    key: "value",
    label: "impact",
    title: "Value",
    note: "用户价值",
  },
];

const matrixRows: Array<{
  key: SignalKey;
  title: string;
  label: string;
  cells: string[];
}> = [
  {
    key: "maintainer",
    title: "身份",
    label: "core",
    cells: ["owner", "triage", "merge"],
  },
  {
    key: "activity",
    title: "活跃",
    label: "live",
    cells: ["commit", "issue", "release"],
  },
  {
    key: "value",
    title: "价值",
    label: "used",
    cells: ["users", "docs", "impact"],
  },
];

const evidenceCards: Array<{
  key: EvidenceKey;
  title: string;
  note: string;
  value: string;
}> = [
  {
    key: "commit",
    title: "commit",
    note: "最近维护",
    value: "active",
  },
  {
    key: "download",
    title: "release 下载",
    note: "真实使用",
    value: "usage",
  },
  {
    key: "contributor",
    title: "贡献者",
    note: "社区参与",
    value: "people",
  },
];

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
    <section className={`rc-scene rc-step-${step}`}>
      <div className="rc-kicker rc-down">CODEX FOR OSS · {label}</div>
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
    <div className="rc-word-stack">
      <div className="rc-eyebrow rc-fade">{eyebrow}</div>
      <h1>
        <span className="rc-rise-wrap">
          <span className="rc-rise">{top}</span>
        </span>
        <span className="rc-rise-wrap">
          <span className="rc-rise rc-accent" style={{ animationDelay: "210ms" }}>
            {accent}
          </span>
        </span>
      </h1>
      {note ? (
        <p className="rc-fade" style={{ animationDelay: "600ms" }}>
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
      className={`rc-soft-card rc-card-pop ${className}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

function StarCase({ hot }: { hot: boolean }) {
  return (
    <SoftCard className={hot ? "rc-star-card rc-star-card-hot" : "rc-star-card"} delay={260}>
      <span>star count</span>
      <b>50K</b>
      <em>{hot ? "也可能不过" : "不是单因子"}</em>
    </SoftCard>
  );
}

function SignalMatrix({ step }: { step: number }) {
  const rowPower =
    step === 3
      ? { maintainer: 3, activity: 0, value: 0 }
      : step === 4
        ? { maintainer: 3, activity: 1, value: 0 }
        : step === 5
          ? { maintainer: 3, activity: 3, value: 0 }
          : { maintainer: 3, activity: 3, value: 3 };
  const activeKey: SignalKey = step === 3 ? "maintainer" : step <= 5 ? "activity" : "value";
  const score = rowPower.maintainer + rowPower.activity + rowPower.value;

  return (
    <div className="rc-signal-matrix">
      <div className="rc-matrix-head">
        <span>review matrix</span>
        <b>{score}/9</b>
      </div>
      <div className="rc-matrix-rails" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      {matrixRows.map((row, rowIndex) => (
        <div
          key={row.key}
          className={row.key === activeKey ? "rc-matrix-row rc-matrix-row-hot" : "rc-matrix-row"}
          style={cssVar({
            "--rc-row-level": `${rowPower[row.key]}`,
            "--rc-row-delay": `${240 + rowIndex * 90}ms`,
          })}
        >
          <div className="rc-matrix-label">
            <span>{row.label}</span>
            <b>{row.title}</b>
          </div>
          <div className="rc-matrix-cells">
            {row.cells.map((cell, i) => (
              <div
                key={cell}
                className={i < rowPower[row.key] ? "rc-matrix-cell rc-matrix-cell-on" : "rc-matrix-cell"}
                style={cssVar({ "--rc-cell-delay": `${360 + rowIndex * 110 + i * 80}ms` })}
              >
                {cell}
              </div>
            ))}
          </div>
          <div className="rc-matrix-meter">
            <span />
          </div>
        </div>
      ))}
      <div className={score === 9 ? "rc-matrix-verdict rc-matrix-verdict-hot" : "rc-matrix-verdict"}>
        {score === 9 ? "ready for proof" : "single star is weak"}
      </div>
    </div>
  );
}

function ProofGauge({ step }: { step: number }) {
  const activeCount = step <= 10 ? 0 : step === 11 ? 1 : 3;
  const gaugeValue = step === 10 ? 14 : step === 11 ? 38 : step === 12 ? 78 : 100;
  const needle = step === 10 ? "-48deg" : step === 11 ? "-14deg" : step === 12 ? "30deg" : "52deg";
  const status = step <= 11 ? "unknown" : step === 12 ? "checking" : "verified";

  return (
    <div className="rc-proof-gauge">
      <div className="rc-gauge-face">
        <svg className="rc-gauge-svg" viewBox="0 0 520 300" role="img" aria-label="proof gauge">
          <path className="rc-gauge-track" d="M70 240 A190 190 0 0 1 450 240" />
          <path
            className="rc-gauge-fill"
            d="M70 240 A190 190 0 0 1 450 240"
            pathLength="100"
            style={cssVar({ "--rc-gauge-value": `${gaugeValue}` })}
          />
        </svg>
        <div className="rc-gauge-needle" style={cssVar({ "--rc-needle": needle })} />
        <div className="rc-gauge-hub" />
        <div className="rc-gauge-readout">
          <span>proof state</span>
          <b>{status}</b>
        </div>
      </div>
      <div className="rc-proof-stream">
        {evidenceCards.map((item, i) => (
          <div
            key={item.key}
            className={i < activeCount ? "rc-proof-weight rc-proof-weight-on" : "rc-proof-weight"}
            style={cssVar({
              "--rc-weight-delay": `${260 + i * 120}ms`,
              "--rc-weight-x": `${i * 132}px`,
            })}
          >
            <span>{item.note}</span>
            <b>{item.title}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function CounterScene({ step }: { step: number }) {
  const isFail = step === 1;
  return (
    <Shell step={step} label="NOT ONLY STAR">
      <div className="rc-counter-scene">
        <WordStack
          eyebrow="反常识点"
          top={isFail ? "50K star" : "审核不只"}
          accent={isFail ? "也没过" : "看 star"}
          note={isFail ? "star 很高，不等于自动通过。" : "它更像一组维护信号。"}
        />
        <div className="rc-review-desk">
          <StarCase hot={isFail} />
          <div className="rc-signal-mini">
            {signalCards.map((card, i) => (
              <span key={card.key} style={cssVar({ "--rc-mini-delay": `${420 + i * 120}ms` })}>
                {card.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function DisclaimerScene() {
  return (
    <Shell step={2} label="PERSONAL READ">
      <div className="rc-disclaimer-scene">
        <WordStack
          eyebrow="先说清楚"
          top="个人判断"
          accent="不是官方标准"
          note="这里只拆我自己的申请经验。"
        />
        <SoftCard className="rc-note-card" delay={300}>
          <span>source</span>
          <b>experience</b>
          <em>不要当成政策原文</em>
        </SoftCard>
      </div>
    </Shell>
  );
}

function SignalsScene({ step }: { step: number }) {
  const active =
    step === 3 ? "maintainer" : step === 4 || step === 5 ? "activity" : "value";
  const headline =
    step === 3
      ? ["核心项目", "维护者"]
      : step === 4
        ? ["最近维护", "活不活跃"]
        : step === 5
          ? ["issue / release", "持续发生"]
          : ["真的带来", "用户价值"];

  return (
    <Shell step={step} label="SIGNAL MIX">
      <div className="rc-signals-scene">
        <WordStack
          eyebrow="维护信号组合"
          top={headline[0]}
          accent={headline[1]}
          note={active === "activity" ? "看项目是不是还在运转。" : "看申请和项目是否匹配。"}
        />
        <SignalMatrix step={step} />
      </div>
    </Shell>
  );
}

function PlainScene({ step }: { step: number }) {
  const warning = step >= 8;
  const probability = step === 9;
  return (
    <Shell step={step} label="PLAIN WORDS">
      <div className="rc-plain-scene">
        <div className={warning ? "rc-human-card rc-human-muted" : "rc-human-card rc-card-pop"}>
          <span>{warning ? "package only" : "plain words"}</span>
          <b>{probability ? "通过概率" : warning ? "包装项目" : "翻译成人话"}</b>
          <em>{probability ? "不高" : warning ? "申请风险" : "别只堆 star"}</em>
        </div>
        <WordStack
          eyebrow={warning ? "申请风险" : "换一种说法"}
          top={probability ? "概率" : warning ? "纯包装" : "要证明"}
          accent={probability ? "不高" : warning ? "GitHub 项目" : "真实维护"}
          note={warning ? "申请材料要回到真实使用。" : "审核看到的是项目生命力。"}
        />
      </div>
    </Shell>
  );
}

function ProofScene({ step }: { step: number }) {
  const headline =
    step === 10
      ? ["真的有人", "在用"]
      : step === 11
        ? ["怎么", "证明？"]
        : step === 12
          ? ["证据", "三件套"]
          : ["都能", "证明"];

  return (
    <Shell step={step} label="EVIDENCE">
      <div className="rc-proof-scene">
        <WordStack
          eyebrow="最后落到证据"
          top={headline[0]}
          accent={headline[1]}
          note={step >= 12 ? "用可验证的项目行为说话。" : "把维护信号变成材料。"}
        />
        <ProofGauge step={step} />
      </div>
    </Shell>
  );
}

export default function ReviewCriteria({ step }: ChapterStepProps) {
  if (step <= 1) return <CounterScene step={step} />;
  if (step === 2) return <DisclaimerScene />;
  if (step <= 6) return <SignalsScene step={step} />;
  if (step <= 9) return <PlainScene step={step} />;
  if (step <= 13) return <ProofScene step={step} />;

  return null;
}
