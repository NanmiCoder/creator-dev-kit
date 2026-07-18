import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./ApplicationMethod.css";

const cssVar = (vars: Record<string, string>): CSSProperties =>
  vars as CSSProperties;

type FieldTone = "idle" | "hot" | "done";
type IdentityKey = "commit" | "github" | "gpt";

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
    <section className={`am-scene am-step-${step}`}>
      <div className="am-kicker am-down">CODEX FOR OSS · {label}</div>
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
  note: string;
}) {
  return (
    <div className="am-word-stack">
      <div className="am-eyebrow am-fade">{eyebrow}</div>
      <h1>
        <span className="am-rise-wrap">
          <span className="am-rise">{top}</span>
        </span>
        <span className="am-rise-wrap">
          <span className="am-rise am-accent" style={{ animationDelay: "220ms" }}>
            {accent}
          </span>
        </span>
      </h1>
      <p className="am-fade" style={{ animationDelay: "620ms" }}>
        {note}
      </p>
    </div>
  );
}

function AutoField({
  label,
  value,
  tone,
  index,
}: {
  label: string;
  value: string;
  tone: FieldTone;
  index: number;
}) {
  return (
    <div
      className={`am-auto-field am-field-${tone}`}
      style={cssVar({ "--am-field-delay": `${220 + index * 110}ms` })}
    >
      <span>{label}</span>
      <div className="am-auto-input">
        <b>{value}</b>
        <i />
      </div>
    </div>
  );
}

function AutoFormPanel({ step }: { step: number }) {
  const fields = [
    ["application", step >= 0 ? "Open Source Credits" : ""],
    ["project owner", step >= 1 ? "GitHub maintainer" : ""],
    ["assistant handoff", step >= 2 ? "agent reads page" : ""],
  ] as const;

  return (
    <div className="am-auto-form am-card-pop">
      <div className="am-browser-bar">
        <span />
        <span />
        <span />
        <b>application form</b>
      </div>
      <div className="am-auto-fields">
        {fields.map(([label, value], i) => (
          <AutoField
            key={label}
            label={label}
            value={value || "waiting"}
            tone={i === step ? "hot" : i < step ? "done" : "idle"}
            index={i}
          />
        ))}
      </div>
      <div className={step >= 2 ? "am-autofill-pulse am-autofill-pulse-hot" : "am-autofill-pulse"}>
        autofill control
      </div>
    </div>
  );
}

function AgentTaskQueue({ active }: { active: number }) {
  const queue = [
    ["profile", "GitHub profile"],
    ["repo", "repo pick"],
    ["copy", "project-specific copy"],
    ["handoff", "no manual fill"],
    ["context", "profile to Codex"],
    ["browser", "browser fill"],
    ["retry", "retry set"],
  ] as const;
  const fillRows = [
    ["profile url", active >= 0 ? "loaded" : ""],
    ["target repo", active >= 1 ? "best fit" : ""],
    ["project value", active >= 2 ? "custom copy" : ""],
    ["browser action", active >= 5 ? "typing" : active >= 3 ? "queued" : ""],
    ["attempts", active >= 6 ? "many runs" : ""],
  ] as const;

  return (
    <div className="am-agent-workbench">
      <div className="am-task-queue">
        {queue.map(([key, label], i) => (
          <div
            key={key}
            className={
              i === active
                ? "am-task-row am-task-row-hot"
                : i < active
                  ? "am-task-row am-task-row-done"
                  : "am-task-row"
            }
            style={cssVar({ "--am-task-delay": `${210 + i * 70}ms` })}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <b>{label}</b>
            <i />
          </div>
        ))}
      </div>
      <div className="am-agent-fill-panel">
        <div className="am-fill-title">
          <span>form automation</span>
          <b>{active >= 6 ? "retry" : active >= 5 ? "fill" : "prepare"}</b>
        </div>
        <div className="am-fill-flow">
          {fillRows.map(([label, value], i) => (
            <div
              key={label}
              className={value ? "am-fill-row am-fill-row-on" : "am-fill-row"}
              style={cssVar({ "--am-fill-delay": `${260 + i * 80}ms` })}
            >
              <span>{label}</span>
              <b>{value || "pending"}</b>
            </div>
          ))}
        </div>
        <div className={active >= 5 ? "am-browser-cursor am-browser-cursor-on" : "am-browser-cursor"} />
      </div>
    </div>
  );
}

function IdentityLinkCheck({ active }: { active: number }) {
  const sources: Array<{
    key: IdentityKey;
    label: string;
    value: string;
    on: boolean;
    locked: boolean;
  }> = [
    {
      key: "commit",
      label: "commit",
      value: "git author",
      on: active >= 0,
      locked: active >= 1,
    },
    {
      key: "github",
      label: "GitHub",
      value: active >= 3 ? "public mail" : "profile mail",
      on: active >= 2,
      locked: active >= 3,
    },
    {
      key: "gpt",
      label: "GPT",
      value: "account mail",
      on: active >= 4,
      locked: active >= 4,
    },
  ];

  return (
    <div className="am-link-check">
      <div className={active >= 5 ? "am-email-axis am-email-axis-pass" : "am-email-axis"}>
        <span>shared email</span>
        <b>dev@example.com</b>
        <i>{active >= 5 ? "pass rate up" : "matching"}</i>
      </div>
      <svg className="am-link-lines" viewBox="0 0 780 560" aria-hidden="true">
        <path className={active >= 1 ? "am-link-line am-link-line-on" : "am-link-line"} d="M128 124 C270 124 324 252 390 280" />
        <path className={active >= 3 ? "am-link-line am-link-line-on" : "am-link-line"} d="M126 280 C250 280 310 280 390 280" />
        <path className={active >= 4 ? "am-link-line am-link-line-on" : "am-link-line"} d="M128 436 C270 436 324 308 390 280" />
      </svg>
      <div className="am-identity-sources">
        {sources.map((source, i) => (
          <div
            key={source.key}
            className={
              source.locked
                ? "am-identity-source am-identity-source-locked"
                : source.on
                  ? "am-identity-source am-identity-source-on"
                  : "am-identity-source"
            }
            style={cssVar({ "--am-source-y": `${i * 156}px` })}
          >
            <span>{source.label}</span>
            <b>{source.value}</b>
            <i>{source.locked ? "matched" : source.on ? "checking" : "waiting"}</i>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormScene({ step }: { step: number }) {
  const active = step;
  const copy = [
    {
      eyebrow: "申请方法",
      top: "怎么",
      accent: "申请",
      note: "先把动作拆成一个官方表单。",
      title: "Official Application",
      focus: "开始申请",
    },
    {
      eyebrow: "流程核心",
      top: "官方",
      accent: "表单",
      note: "复杂度不在入口，在怎么证明项目。",
      title: "OpenAI for Open Source",
      focus: "填写表单",
    },
    {
      eyebrow: "把入口交给工具",
      top: "链接",
      accent: "给 agent",
      note: "让正在用的 agent 直接读表单。",
      title: "Agent Input",
      focus: "读取链接",
    },
  ] as const;
  const item = copy[active]!;

  return (
    <Shell step={step} label="APPLICATION">
      <div className="am-form-scene">
        <WordStack
          eyebrow={item.eyebrow}
          top={item.top}
          accent={item.accent}
          note={item.note}
        />
        <AutoFormPanel step={active} />
      </div>
    </Shell>
  );
}

function AgentScene({ step }: { step: number }) {
  const active = step - 3;
  const states = [
    {
      eyebrow: "输入材料",
      top: "GitHub",
      accent: "主页",
      note: "先让 Codex 理解公开主页。",
    },
    {
      eyebrow: "项目筛选",
      top: "最可能",
      accent: "申请",
      note: "不是所有项目都同样适合。",
    },
    {
      eyebrow: "针对填写",
      top: "项目",
      accent: "特点",
      note: "每个项目的价值点要分别写。",
    },
    {
      eyebrow: "人工动作减少",
      top: "没有",
      accent: "手填",
      note: "核心是让 agent 处理重复表单。",
    },
    {
      eyebrow: "交给 Codex",
      top: "主页",
      accent: "丢进去",
      note: "输入足够干净，它就能开始拆解。",
    },
    {
      eyebrow: "浏览器执行",
      top: "自动",
      accent: "填写",
      note: "用浏览器插件完成页面内动作。",
    },
    {
      eyebrow: "次数策略",
      top: "很多次",
      accent: "尝试",
      note: "多项目、多版本，逐步逼近通过率。",
    },
  ] as const;
  const item = states[active]!;

  return (
    <Shell step={step} label="AGENT FILL">
      <div className="am-agent-scene">
        <WordStack
          eyebrow={item.eyebrow}
          top={item.top}
          accent={item.accent}
          note={item.note}
        />
        <AgentTaskQueue active={active} />
      </div>
    </Shell>
  );
}

function EmailScene({ step }: { step: number }) {
  const active = step - 10;
  const states = [
    {
      eyebrow: "关键注意点",
      top: "commit",
      accent: "邮箱",
      note: "审核会看身份信号是否一致。",
    },
    {
      eyebrow: "身份信号",
      top: "git commit",
      accent: "邮箱",
      note: "提交记录里的身份也要对上。",
    },
    {
      eyebrow: "主页信号",
      top: "GitHub",
      accent: "一致",
      note: "主页邮箱和 commit 邮箱最好对齐。",
    },
    {
      eyebrow: "公开设置",
      top: "邮箱",
      accent: "公开",
      note: "让审核能看到这一层证明。",
    },
    {
      eyebrow: "最终组合",
      top: "GPT 账号",
      accent: "一致",
      note: "GPT 账号也最好和 GitHub 对齐。",
    },
    {
      eyebrow: "通过率信号",
      top: "一致性",
      accent: "提高",
      note: "身份链越清楚，材料越可信。",
    },
  ] as const;
  const item = states[active]!;

  return (
    <Shell step={step} label="EMAIL CHECK">
      <div className="am-email-scene">
        <WordStack
          eyebrow={item.eyebrow}
          top={item.top}
          accent={item.accent}
          note={item.note}
        />
        <IdentityLinkCheck active={active} />
      </div>
    </Shell>
  );
}

export default function ApplicationMethod({ step }: ChapterStepProps) {
  if (step <= 2) return <FormScene step={step} />;
  if (step <= 9) return <AgentScene step={step} />;
  if (step <= 15) return <EmailScene step={step} />;

  return null;
}
