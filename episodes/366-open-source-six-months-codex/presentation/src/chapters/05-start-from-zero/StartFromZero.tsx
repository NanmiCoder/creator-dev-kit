import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./StartFromZero.css";

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
    <section className={`sz-scene sz-step-${step}`}>
      <div className="sz-kicker sz-down">START FROM ZERO · {label}</div>
      {children}
    </section>
  );
}

function Headline({
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
    <div className="sz-headline">
      <div className="sz-eyebrow sz-fade">{eyebrow}</div>
      <h1>
        <span className="sz-rise-wrap">
          <span className="sz-rise">{top}</span>
        </span>
        <span className="sz-rise-wrap">
          <span className="sz-rise sz-accent" style={{ animationDelay: "210ms" }}>
            {accent}
          </span>
        </span>
      </h1>
      {note ? (
        <p className="sz-fade" style={{ animationDelay: "600ms" }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

function GrowthPathRadar({ step }: { step: number }) {
  const radarLevel = step < 4 ? 0 : Math.min(3, Math.max(0, step - 4));
  const pathLevel = Math.min(5, Math.max(1, step - 1));
  const radarPoints = [
    "360,102 360,360 360,360",
    "360,102 360,360 360,360",
    "360,102 576,486 360,360",
    "360,102 576,486 144,486",
  ][radarLevel];
  const radarLabels = [
    { key: "problem", title: "真实问题", className: "sz-radar-axis-problem" },
    { key: "usable", title: "别人能用", className: "sz-radar-axis-usable" },
    { key: "maintain", title: "持续维护", className: "sz-radar-axis-maintain" },
  ] as const;
  const pathNodes = [
    { key: "need", title: "自己需要", note: "seed" },
    { key: "public", title: "别人需要", note: "signal" },
    { key: "ai", title: "AI 降难度", note: "boost" },
    { key: "problem", title: "真实问题", note: "axis 01" },
    { key: "usable", title: "别人能用", note: "axis 02" },
    { key: "maintain", title: "持续维护", note: "axis 03" },
  ] as const;

  return (
    <div className={`sz-growth-board sz-growth-level-${pathLevel} sz-radar-level-${radarLevel}`}>
      <div className="sz-path-panel">
        <div className="sz-path-line" />
        {pathNodes.map((node, i) => (
          <div
            key={node.key}
            className={`sz-path-node sz-path-node-${i} ${
              i <= pathLevel ? "sz-path-node-lit" : "sz-path-node-waiting"
            }`}
          >
            <span>{node.note}</span>
            <b>{node.title}</b>
          </div>
        ))}
      </div>
      <div className="sz-radar-panel">
        <svg className="sz-radar-svg" viewBox="0 0 720 620" aria-hidden="true">
          <polygon className="sz-radar-grid sz-radar-grid-outer" points="360,62 630,520 90,520" />
          <polygon className="sz-radar-grid sz-radar-grid-mid" points="360,178 528,462 192,462" />
          <line className="sz-radar-axis" x1="360" y1="360" x2="360" y2="62" />
          <line className="sz-radar-axis" x1="360" y1="360" x2="630" y2="520" />
          <line className="sz-radar-axis" x1="360" y1="360" x2="90" y2="520" />
          <polygon className="sz-radar-shape" points={radarPoints} />
        </svg>
        {radarLabels.map((label, i) => (
          <div
            key={label.key}
            className={`sz-radar-label ${label.className} ${
              radarLevel > i ? "sz-radar-label-lit" : ""
            }`}
          >
            {label.title}
          </div>
        ))}
        <div className="sz-radar-core">
          <span>{radarLevel === 0 ? "open" : `${radarLevel}/3`}</span>
          <b>{radarLevel === 0 ? "能力面未完成" : "开源能力面"}</b>
        </div>
      </div>
    </div>
  );
}

function Stamp({
  children,
  tone,
  delay,
}: {
  children: ReactNode;
  tone: "quiet" | "hot";
  delay: number;
}) {
  return (
    <div className={`sz-stamp sz-stamp-${tone}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function QuestionIntro({ step }: { step: number }) {
  return (
    <Shell step={step} label={step === 0 ? "QUESTION" : "ADVICE"}>
      <div className="sz-intro-scene">
        <Headline
          eyebrow={step === 0 ? "从零开始" : "先别走偏"}
          top={step === 0 ? "没有项目" : "不要硬造"}
          accent={step === 0 ? "还有机会吗" : "福利项目"}
          note={step === 0 ? "问题先摆出来。" : "动机错了，项目很快会空掉。"}
        />
        <div className="sz-stamp-stage">
          <Stamp tone={step === 0 ? "hot" : "quiet"} delay={260}>
            0 repo
          </Stamp>
          <Stamp tone={step === 1 ? "hot" : "quiet"} delay={440}>
            别硬造
          </Stamp>
          <Stamp tone="quiet" delay={620}>
            真实需要
          </Stamp>
        </div>
      </div>
    </Shell>
  );
}

function ToolSeed({ step }: { step: number }) {
  const aiStep = step === 3;
  return (
    <Shell step={step} label={aiStep ? "SHIFT" : "SEED"}>
      <div className="sz-seed-scene">
        <Headline
          eyebrow={aiStep ? "难点已经变了" : "正确起点"}
          top={aiStep ? "写代码" : "自己需要"}
          accent={aiStep ? "不是最难" : "别人也需要"}
          note={aiStep ? "AI 已经把实现门槛降下来了。" : "小工具先从真实痛点长出来。"}
        />
        <GrowthPathRadar step={step} />
      </div>
    </Shell>
  );
}

function DifficultyScene({ step }: { step: number }) {
  const active = Math.max(0, step - 5);
  const focus = [
    { title: "真实问题", note: "先找到痛点" },
    { title: "别人能用", note: "交付要完整" },
    { title: "持续维护", note: "长期有回应" },
  ] as const;
  const isOverview = step === 4;
  const hero = isOverview ? ["真正难的", "三件事"] : [focus[active]!.title, focus[active]!.note];

  return (
    <Shell step={step} label="HARD PARTS">
      <div className="sz-hard-scene">
        <Headline
          eyebrow={isOverview ? "难点清单" : "判断标准"}
          top={hero[0]}
          accent={hero[1]}
          note={isOverview ? "不是代码量，而是能不能持续解决问题。" : undefined}
        />
        <GrowthPathRadar step={step} />
      </div>
    </Shell>
  );
}

function OpenSourceValueMap({ active }: { active: number }) {
  const items = [
    { key: "tool", label: "小工具", step: 2, x: "42%", y: "58%" },
    { key: "skill", label: "skill", step: 3, x: "57%", y: "37%" },
    { key: "prompt", label: "prompt", step: 5, x: "45%", y: "64%" },
    { key: "workflow", label: "workflow", step: 6, x: "70%", y: "28%" },
    { key: "github", label: "GitHub", step: 7, x: "82%", y: "22%" },
    { key: "time", label: "省时间", step: 8, x: "88%", y: "16%" },
  ] as const;
  const hotKey =
    active === 2
      ? "tool"
      : active === 3 || active === 4
        ? "skill"
        : active === 5
          ? "prompt"
          : active === 6
            ? "workflow"
            : active === 7
              ? "github"
              : active >= 8
                ? "time"
                : "";
  const beamWidth = `${Math.min(82, 24 + active * 7)}%`;

  return (
    <div className={`sz-value-map sz-value-active-${active}`}>
      <div className="sz-value-axis sz-value-axis-x">
        <span>自己用</span>
        <b>别人复用</b>
      </div>
      <div className="sz-value-axis sz-value-axis-y">
        <span>一次性</span>
        <b>可维护</b>
      </div>
      <div className="sz-value-quadrants">
        <div>临时解决</div>
        <div>可分享</div>
        <div>持续资产</div>
        <div>开源价值</div>
      </div>
      <div className="sz-value-beam" style={cssVar({ "--sz-beam-width": beamWidth })} />
      {items.map((item) => {
        const visible = active >= item.step;
        const hot = hotKey === item.key;
        const settled = active > item.step;
        return (
          <div
            key={item.key}
            className={`sz-value-marker ${visible ? "sz-value-marker-on" : ""} ${
              hot ? "sz-value-marker-hot" : ""
            } ${settled ? "sz-value-marker-settled" : ""}`}
            style={cssVar({ "--sz-x": item.x, "--sz-y": item.y })}
          >
            {item.label}
          </div>
        );
      })}
      <div className="sz-value-orbit">
        <span />
      </div>
    </div>
  );
}

function DirectionScene({ step }: { step: number }) {
  const active = Math.max(0, step - 8);
  const modes = [
    { label: "普通开发者", title: "更适合", note: "从小处开始" },
    { label: "不必大而全", title: "轻一点", note: "范围收住" },
    { label: "小工具", title: "一个工具", note: "解决一件事" },
    { label: "skill", title: "一个 skill", note: "复用经验" },
    { label: "high star", title: "skills 很火", note: "需求很明确" },
    { label: "prompt", title: "一段提示词", note: "也能开源" },
    { label: "workflow", title: "脚本 工作流", note: "提示词" },
    { label: "GitHub", title: "放到", note: "GitHub 上" },
    { label: "value", title: "省时间", note: "就是价值" },
  ] as const;
  const item = modes[active]!;

  return (
    <Shell step={step} label="OPEN SOURCE VALUE">
      <div className="sz-direction-scene">
        <Headline
          eyebrow={item.label}
          top={item.title}
          accent={item.note}
          note={active >= 6 ? "能沉淀、能复用、能帮到别人。" : undefined}
        />
        <OpenSourceValueMap active={active} />
      </div>
    </Shell>
  );
}

export default function StartFromZero({ step }: ChapterStepProps) {
  if (step <= 1) return <QuestionIntro step={step} />;
  if (step <= 3) return <ToolSeed step={step} />;
  if (step <= 7) return <DifficultyScene step={step} />;
  if (step <= 16) return <DirectionScene step={step} />;

  return null;
}
