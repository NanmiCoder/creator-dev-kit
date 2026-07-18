import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./CostSignal.css";

type FlowKey = "issue" | "release" | "media" | "feedback";

const cssVar = (vars: Record<string, string>): CSSProperties =>
  vars as CSSProperties;

const states = [
  {
    label: "MONTHLY BILL",
    kicker: "CODEX COST SIGNAL",
    eyebrow: "订阅账本",
    title: "两三千",
    accent: "说没就没",
    note: "AI 工具是长期成本。",
    mode: "ledger",
    focus: "bill",
    flow: "issue",
    amount: "2000+",
    amountLabel: "RMB / month",
    cards: [
      { tag: "AI", value: "订阅", tone: "hot" },
      { tag: "month", value: "每个月", tone: "quiet" },
      { tag: "budget", value: "两三千", tone: "hot" },
      { tag: "result", value: "很快消失", tone: "signal" },
    ],
    stamps: ["真实支出", "不是一次性花费"],
  },
  {
    label: "REAL USE",
    kicker: "CODEX COST SIGNAL",
    eyebrow: "用途切换",
    title: "不是玩",
    accent: "修 issue",
    note: "消耗进入维护现场。",
    mode: "work",
    focus: "issue",
    flow: "issue",
    amount: "issue",
    amountLabel: "main use",
    cards: [
      { tag: "triage", value: "复现", tone: "quiet" },
      { tag: "debug", value: "定位", tone: "quiet" },
      { tag: "fix", value: "修 issue", tone: "hot" },
      { tag: "review", value: "回归", tone: "signal" },
    ],
    stamps: ["开源维护", "消耗有去处"],
  },
  {
    label: "SHIP LOOP",
    kicker: "CODEX COST SIGNAL",
    eyebrow: "维护闭环",
    title: "改 bug",
    accent: "发版本",
    note: "从问题到发布。",
    mode: "work",
    focus: "release",
    flow: "release",
    amount: "ship",
    amountLabel: "loop",
    cards: [
      { tag: "bug", value: "修复", tone: "hot" },
      { tag: "test", value: "验证", tone: "quiet" },
      { tag: "release", value: "版本", tone: "signal" },
      { tag: "users", value: "反馈", tone: "quiet" },
    ],
    stamps: ["维护成本", "换来版本"],
  },
  {
    label: "MEDIA KIT",
    kicker: "CODEX COST SIGNAL",
    eyebrow: "内容生产",
    title: "自媒体",
    accent: "素材",
    note: "项目之外也在产出。",
    mode: "work",
    focus: "media",
    flow: "media",
    amount: "media",
    amountLabel: "side use",
    cards: [
      { tag: "script", value: "文案", tone: "quiet" },
      { tag: "asset", value: "素材", tone: "hot" },
      { tag: "demo", value: "演示", tone: "quiet" },
      { tag: "publish", value: "发布", tone: "signal" },
    ],
    stamps: ["讲清项目", "沉淀内容"],
  },
  {
    label: "BEYOND MONEY",
    kicker: "CODEX COST SIGNAL",
    eyebrow: "意义升级",
    title: "不只是",
    accent: "省钱",
    note: "账本开始变成信号。",
    mode: "signal",
    focus: "beyond",
    flow: "feedback",
    amount: "signal",
    amountLabel: "turning point",
    cards: [
      { tag: "save", value: "省钱", tone: "quiet" },
      { tag: "grant", value: "福利", tone: "quiet" },
      { tag: "meaning", value: "认可", tone: "hot" },
      { tag: "next", value: "信号", tone: "signal" },
    ],
    stamps: ["成本之外", "看见反馈"],
  },
  {
    label: "OSS TIME",
    kicker: "CODEX COST SIGNAL",
    eyebrow: "长期回声",
    title: "开源这么久",
    accent: "被看见",
    note: "它像一次持续维护的回声。",
    mode: "signal",
    focus: "recognized",
    flow: "feedback",
    amount: "years",
    amountLabel: "oss time",
    cards: [
      { tag: "history", value: "长期做", tone: "quiet" },
      { tag: "maintain", value: "持续维护", tone: "hot" },
      { tag: "signal", value: "被看见", tone: "signal" },
      { tag: "grant", value: "结果", tone: "quiet" },
    ],
    stamps: ["不是偶然", "长期反馈"],
  },
  {
    label: "FEEDBACK SIGNAL",
    kicker: "CODEX COST SIGNAL",
    eyebrow: "最终判断",
    title: "非常好的",
    accent: "反馈信号",
    note: "长期做开源，被系统性看见。",
    mode: "signal",
    focus: "feedback",
    flow: "feedback",
    amount: "OSS",
    amountLabel: "recognized",
    cards: [
      { tag: "time", value: "做了很久", tone: "quiet" },
      { tag: "repo", value: "持续维护", tone: "quiet" },
      { tag: "feedback", value: "正反馈", tone: "hot" },
      { tag: "signal", value: "继续做", tone: "signal" },
    ],
    stamps: ["开源回声", "值得继续"],
  },
] as const;

function SceneShell({
  step,
  label,
  children,
}: {
  step: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className={`cs-scene cs-step-${step}`}>
      <div className="cs-kicker cs-enter-down">CODEX FOR OSS · {label}</div>
      {children}
    </section>
  );
}

function HeroCopy({
  eyebrow,
  title,
  accent,
  note,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  note: string;
}) {
  return (
    <div className="cs-hero-copy">
      <div className="cs-eyebrow cs-fade">{eyebrow}</div>
      <h1>
        <span className="cs-rise-wrap">
          <span className="cs-rise">{title}</span>
        </span>
        <span className="cs-rise-wrap">
          <span className="cs-rise cs-accent" style={{ animationDelay: "210ms" }}>
            {accent}
          </span>
        </span>
      </h1>
      <p className="cs-fade" style={{ animationDelay: "620ms" }}>
        {note}
      </p>
    </div>
  );
}

function StampStack({ stamps }: { stamps: readonly string[] }) {
  return (
    <div className="cs-stamp-stack">
      {stamps.map((stamp, index) => (
        <div
          className="cs-stamp cs-pop"
          key={stamp}
          style={cssVar({
            animationDelay: `${520 + index * 140}ms`,
            "--cs-tilt": index === 0 ? "-3deg" : "2deg",
          })}
        >
          {stamp}
        </div>
      ))}
    </div>
  );
}

function CostLedgerFlow({
  step,
  flow,
  amount,
  amountLabel,
}: {
  step: number;
  flow: FlowKey;
  amount: string;
  amountLabel: string;
}) {
  const monthFill = step === 0 ? "74%" : "100%";
  const paths = [
    { key: "issue", title: "修 issue", meta: "复现 / 定位 / 回归" },
    { key: "release", title: "发版本", meta: "bugfix -> ship" },
    { key: "media", title: "自媒体素材", meta: "文案 / demo / 发布" },
  ] as const;
  return (
    <div
      className={`cs-ledger-flow cs-flow-${flow}`}
      style={cssVar({
        "--cs-month-fill": monthFill,
        "--cs-issue-flow": step >= 1 ? "1" : "0",
        "--cs-release-flow": step >= 2 ? "1" : "0",
        "--cs-media-flow": step >= 3 ? "1" : "0",
        "--cs-feedback-flow": step >= 4 ? "1" : "0",
      })}
    >
      <div className="cs-ledger-panel cs-pop">
        <div className="cs-ledger-head">
          <span>{amountLabel}</span>
          <b>{amount}</b>
        </div>
        <div className="cs-monthly-bar">
          <i />
          <em>monthly spend</em>
        </div>
        <div className="cs-ledger-lines">
          <span>AI 订阅</span>
          <span>持续消耗</span>
          <span>维护投入</span>
        </div>
      </div>

      <div className="cs-flow-map">
        <svg className="cs-flow-lines" viewBox="0 0 720 420" aria-hidden="true">
          <path className="cs-issue-line" d="M92 80 C230 80 256 78 356 78" />
          <path className="cs-release-line" d="M92 80 C226 148 260 198 356 198" />
          <path className="cs-media-line" d="M92 80 C224 244 260 318 356 318" />
          <path className="cs-feedback-line" d="M520 78 C638 100 638 198 638 198" />
          <path className="cs-feedback-line" d="M520 198 H638" />
          <path className="cs-feedback-line" d="M520 318 C638 296 638 198 638 198" />
        </svg>
        <div className="cs-source-node">
          <span>账本支出</span>
          <b>两三千 / 月</b>
        </div>
        {paths.map((path) => (
          <div
            key={path.key}
            className={`cs-flow-node cs-node-${path.key} ${
              flow === path.key || step >= 4 ? "cs-node-hot" : ""
            } ${step >= (path.key === "issue" ? 1 : path.key === "release" ? 2 : 3) ? "cs-node-seen" : ""}`}
          >
            <b>{path.title}</b>
            <span>{path.meta}</span>
          </div>
        ))}
        <div className={`cs-feedback-node ${step >= 4 ? "cs-node-hot cs-node-seen" : ""}`}>
          <span>汇合</span>
          <b>feedback signal</b>
        </div>
      </div>
    </div>
  );
}

function CostSignal({ step }: ChapterStepProps) {
  const state = states[step] ?? states[0];

  return (
    <SceneShell step={step} label={state.label}>
      <main className={`cs-stage cs-mode-${state.mode}`}>
        <HeroCopy
          eyebrow={state.eyebrow}
          title={state.title}
          accent={state.accent}
          note={state.note}
        />
        <div className="cs-board">
          <CostLedgerFlow
            step={step}
            flow={state.flow}
            amount={state.amount}
            amountLabel={state.amountLabel}
          />
          <StampStack stamps={state.stamps} />
        </div>
      </main>
    </SceneShell>
  );
}

export default CostSignal;
