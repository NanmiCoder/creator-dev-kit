import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./CompoundReturn.css";

const cssVar = (vars: Record<string, string>): CSSProperties =>
  vars as CSSProperties;

type CurveNodeKey = "recognition" | "chance" | "work" | "codex";
type QuestionKey = "role" | "usage" | "proof";

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
    <section className={`cr-scene cr-step-${step}`}>
      <div className="cr-kicker">CODEX FOR OSS · {label}</div>
      {children}
    </section>
  );
}

function Headline({
  eyebrow,
  title,
  accent,
  note,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  note?: string;
}) {
  return (
    <div className="cr-headline">
      <div className="cr-eyebrow">{eyebrow}</div>
      <h1>
        <span>{title}</span>
        <span className="cr-accent">{accent}</span>
      </h1>
      {note ? <p>{note}</p> : null}
    </div>
  );
}

const curveCopy = [
  ["COMPOUND", "长期复利", "开源项目", "会复利", "不是一次性回报。", 0, ""],
  ["EARLY COST", "前期成本", "不赚钱", "也会累", "短期在低位横着走，体感最重。", 1, ""],
  ["THREE RETURNS", "它会带来", "三种", "回报", "认可、机会、作品，逐步落到曲线上。", 2, "recognition"],
  ["RECOGNITION", "第一件事", "真的", "有人用", "认可来自真实使用。", 3, "recognition"],
  ["OPPORTUNITY", "第二件事", "6 个月", "Codex", "机会来自持续维护。", 4, "chance"],
  ["FREE CODEX", "这次的结果", "免费", "Codex 套餐", "福利是长期维护的一次结算。", 5, "codex"],
  ["SUMMARY", "最后收束", "总结", "一下", "把申请和项目心态放在一起看。", 6, "work"],
] as const;

const curveNodes: {
  key: CurveNodeKey;
  label: string;
  value: string;
  x: number;
  y: number;
}[] = [
  { key: "recognition", label: "认可", value: "有人用", x: 334, y: 472 },
  { key: "chance", label: "机会", value: "被看见", x: 546, y: 342 },
  { key: "work", label: "作品", value: "留得住", x: 705, y: 232 },
  { key: "codex", label: "6 个月 Codex", value: "结算点", x: 828, y: 146 },
];

function CompoundCurve({ step }: { step: number }) {
  const item = curveCopy[step]!;
  const activeKey = item[6];
  const progress = item[5];

  return (
    <Shell step={step} label={item[0]}>
      <div className="cr-curve-scene">
        <Headline eyebrow={item[1]} title={item[2]} accent={item[3]} note={item[4]} />
        <div className="cr-curve-board" style={cssVar({ "--cr-progress": `${progress}` })}>
          <svg className="cr-curve-svg" viewBox="0 0 920 620" aria-hidden="true">
            <path className="cr-axis-x" d="M84 542H850" />
            <path className="cr-axis-y" d="M84 542V92" />
            <path className="cr-cost-line" d="M98 520C170 514 238 512 300 506" />
            <path
              className="cr-compound-path"
              pathLength="6"
              d="M104 512C226 522 300 504 374 456C460 400 506 338 584 288C664 236 726 206 838 116"
            />
            <path
              className="cr-compound-glow"
              pathLength="6"
              d="M104 512C226 522 300 504 374 456C460 400 506 338 584 288C664 236 726 206 838 116"
            />
          </svg>
          <div className="cr-curve-label cr-curve-short">短期：低 / 累</div>
          <div className="cr-curve-label cr-curve-long">长期：曲线抬升</div>
          {curveNodes.map((node) => {
            const active = activeKey === node.key;
            const visible =
              (node.key === "recognition" && step >= 2) ||
              (node.key === "chance" && step >= 4) ||
              (node.key === "codex" && step >= 5) ||
              (node.key === "work" && step >= 6);

            return (
              <div
                key={node.key}
                className={[
                  "cr-curve-node",
                  visible ? "cr-curve-node-visible" : "",
                  active ? "cr-curve-node-hot" : "",
                ].join(" ")}
                style={cssVar({ "--cr-x": `${node.x}px`, "--cr-y": `${node.y}px` })}
              >
                <i />
                <span>{node.label}</span>
                <b>{node.value}</b>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

const checkerCopy = [
  ["APPLY", "申请前", "想申请", "福利", "先别急着提交。", "", ""],
  ["CHECKLIST", "类似福利", "先看", "三问", "OpenAI / Anthropic 都绕不开这些信号。", "", ""],
  ["QUESTION 01", "身份信号", "你是不是", "维护者", "owner 或核心贡献者。", "role", "clear"],
  ["QUESTION 02", "项目信号", "有没有人", "在用", "持续维护比短期热度更重要。", "usage", "clear"],
  ["QUESTION 03", "使用信号", "AI 能否", "讲清楚", "Codex 这部分要说清楚。", "proof", "unknown"],
  ["AI MAINTAIN", "维护说明", "怎么帮你", "维护项目", "要落到真实维护动作。", "proof", "checking"],
  ["REAL HELP", "真实使用", "确实", "帮很大忙", "不是为了申请才写的故事。", "proof", "clear"],
  ["PROJECT ROLE", "实际作用", "项目里", "重要地位", "让工具和项目关系说得通。", "proof", "clear"],
  ["CLEAR", "把三点说清楚", "三点", "说清楚", "身份、使用、维护价值。", "all", "ready"],
  ["AUTOMATE", "申请动作", "AI", "自动化申请", "让它整理材料和表达。", "all", "apply"],
  ["RETRY", "节奏", "隔两天", "再申请", "保持克制。", "all", "apply"],
  ["OK", "说不清也没关系", "没关系", "回到项目", "答案不清楚，本身就是信号。", "all", "ready"],
] as const;

const questions: {
  key: QuestionKey;
  num: string;
  tag: string;
  label: string;
  clearAt: number;
}[] = [
  { key: "role", num: "01", tag: "role", label: "owner / 核心维护者", clearAt: 9 },
  { key: "usage", num: "02", tag: "usage", label: "有人用，持续维护", clearAt: 10 },
  { key: "proof", num: "03", tag: "AI proof", label: "Codex 帮什么", clearAt: 13 },
];

function ThreeQuestionChecker({ step }: { step: number }) {
  const idx = step - 7;
  const item = checkerCopy[idx]!;
  const focus = item[5];
  const finalState = item[6];
  const ready = idx >= 8;

  return (
    <Shell step={step} label={item[0]}>
      <div className="cr-check-scene">
        <Headline eyebrow={item[1]} title={item[2]} accent={item[3]} note={item[4]} />
        <div className={ready ? "cr-checker cr-checker-ready" : "cr-checker"}>
          {questions.map((question) => {
            const isClear = step >= question.clearAt || ready;
            const isFocus = focus === question.key || focus === "all";
            const state = isClear ? "clear" : isFocus ? finalState : "unknown";

            return (
              <div
                key={question.key}
                className={[
                  "cr-check-row",
                  `cr-state-${state}`,
                  isFocus ? "cr-check-focus" : "",
                ].join(" ")}
              >
                <i>{question.num}</i>
                <div className="cr-check-copy">
                  <span>{question.tag}</span>
                  <b>{question.label}</b>
                </div>
                <div className="cr-switch" aria-hidden="true">
                  <em />
                </div>
                <strong>{state === "clear" ? "clear" : state === "checking" ? "checking" : state === "apply" ? "apply" : ready ? "ready" : "unknown"}</strong>
              </div>
            );
          })}
          <div className={ready ? "cr-ready-strip cr-ready-hot" : "cr-ready-strip"}>
            <span>decision</span>
            <b>{idx >= 9 ? "apply" : ready ? "ready" : "checking"}</b>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const closingCopy = [
  ["DON'T RUSH", "说不清的时候", "别急着", "薅福利", "先别把目标放歪。", 0],
  ["MAKE IT REAL", "真正该做的", "项目", "做实", "真实问题、真实维护、真实用户。", 1],
  ["SHORT TERM", "短期看", "免费", "打工", "投入很重，回报很慢。", 2],
  ["LONG TERM", "长期看", "积累", "信用", "信用会在关键时刻结算。", 3],
  ["REAL ASSET", "留下来的东西", "作品", "真实用户", "这比一次福利更重要。", 4],
  ["CASE", "典型例子", "6 个月", "只是结果", "前面积累，最后变成机会。", 5],
  ["CTA", "本期结束", "一键", "三连", "有帮助就支持一下。", 5],
  ["GOODBYE", "我是阿江", "下期", "见", "继续聊真实开发和开源维护。", 5],
] as const;

const timelineItems = [
  { tag: "short", value: "免费打工", note: "投入" },
  { tag: "trust", value: "信用", note: "积累" },
  { tag: "asset", value: "作品/用户", note: "留下" },
  { tag: "chance", value: "6 个月机会", note: "结算" },
] as const;

function ClosingTimeline({ step }: { step: number }) {
  const idx = step - 19;
  const item = closingCopy[idx]!;
  const progress = item[5];

  return (
    <Shell step={step} label={item[0]}>
      <div className="cr-closing-scene">
        <Headline eyebrow={item[1]} title={item[2]} accent={item[3]} note={item[4]} />
        <div
          className="cr-timeline"
          style={cssVar({
            "--cr-timeline-progress": `${progress}`,
            "--cr-rail-width": `${Math.min(100, (progress / 5) * 100)}%`,
          })}
        >
          <div className="cr-timeline-rail" aria-hidden="true">
            <i />
          </div>
          {timelineItems.map((node, index) => {
            const active = progress >= index + 2 || (idx >= 6 && index === timelineItems.length - 1);
            return (
              <div
                key={node.tag}
                className={active ? "cr-time-node cr-time-hot" : "cr-time-node"}
                style={cssVar({ "--cr-time-left": `${78 + index * 248}px` })}
              >
                <span>{node.tag}</span>
                <b>{node.value}</b>
                <em>{node.note}</em>
              </div>
            );
          })}
          <div className={progress >= 5 ? "cr-settlement cr-settlement-hot" : "cr-settlement"}>
            <span>return</span>
            <b>{progress >= 5 ? "机会回来" : "先把项目做实"}</b>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function CompoundReturn({ step }: ChapterStepProps) {
  if (step <= 6) return <CompoundCurve step={step} />;
  if (step <= 18) return <ThreeQuestionChecker step={step} />;
  if (step <= 26) return <ClosingTimeline step={step} />;

  return null;
}
