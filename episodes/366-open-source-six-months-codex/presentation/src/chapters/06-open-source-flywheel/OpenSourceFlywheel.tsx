import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./OpenSourceFlywheel.css";

type WheelKey =
  | "source"
  | "ai"
  | "local"
  | "open"
  | "user"
  | "signal"
  | "repair"
  | "version"
  | "video"
  | "newUser";

type Panel = "origin" | "build" | "publish" | "loop" | "lesson";

type StepTuple = [
  string,
  string,
  string,
  string,
  string,
  WheelKey,
  WheelKey,
  number,
  number,
  string,
  string,
  string[],
  Panel,
];

const cssVar = (vars: Record<string, string>): CSSProperties =>
  vars as CSSProperties;

const wheelNodes: { key: WheelKey; label: string; value: string; tag: string }[] = [
  { key: "source", label: "源码", value: "泄露", tag: "seed" },
  { key: "ai", label: "AI", value: "补缺口", tag: "patch" },
  { key: "local", label: "本地", value: "跑通", tag: "debug" },
  { key: "open", label: "开源", value: "发布", tag: "repo" },
  { key: "user", label: "用户", value: "进入", tag: "start" },
  { key: "signal", label: "需求/bug", value: "反馈", tag: "signal" },
  { key: "repair", label: "修复/功能", value: "迭代", tag: "work" },
  { key: "version", label: "版本", value: "发出", tag: "release" },
  { key: "video", label: "视频", value: "解释", tag: "media" },
  { key: "newUser", label: "新用户", value: "回流", tag: "growth" },
];

const loopOrder: WheelKey[] = ["user", "signal", "repair", "version", "video", "newUser"];

const nodeAngles = wheelNodes.reduce<Record<WheelKey, number>>((acc, node, index) => {
  acc[node.key] = -90 + index * (360 / wheelNodes.length);
  return acc;
}, {} as Record<WheelKey, number>);

const loopEdges = loopOrder.map((key, index) => ({
  from: key,
  to: index === loopOrder.length - 1 ? "signal" : loopOrder[index + 1],
}));

const stepTuples: StepTuple[] = [
  ["START", "起点很小", "刚做", "cc-haha", "一个真实需求，先成为飞轮的轴心。", "open", "source", -18, 0, "项目起步", "0 to 1", ["真实需求", "先跑通", "小起点"], "origin"],
  ["NO GRAND PLAN", "不是宏大叙事", "没想", "做大", "先把眼前问题压进可执行轨道。", "source", "ai", -8, 1, "不是大项目", "single need", ["轻启动", "先验证", "不空想"], "origin"],
  ["LEAK", "最早的触发器", "源码", "泄露", "事件变成材料，材料推动第一圈。", "source", "ai", 4, 2, "事件触发", "source", ["Claude Code", "源代码", "机会点"], "origin"],
  ["DEMAND", "判断需求", "肯定", "有人要", "需求信号接上用户这一端。", "user", "signal", 16, 3, "需求成立", "people", ["有人想用", "本地化", "确定痛点"], "origin"],
  ["LOCAL", "最朴素的目标", "本地", "跑起来", "目标越具体，飞轮越容易吃上力。", "local", "open", 30, 4, "目标清晰", "local run", ["能启动", "能交互", "能复现"], "build"],
  ["SOURCE", "拿到材料", "泄露", "源代码", "先有材料，再谈修补。", "source", "ai", 45, 5, "材料到位", "raw code", ["repo", "缺口", "可读"], "build"],
  ["AI PATCH", "用 AI 补齐", "AI", "补代码", "缺口被补上，轨道继续往前。", "ai", "local", 62, 6, "补缺", "patch", ["生成", "补齐", "验证"], "build"],
  ["DEBUG", "进入现场", "本地", "调试", "报错、修复、重跑，把动能留在系统里。", "local", "open", 80, 7, "调试中", "debug", ["报错", "修复", "重跑"], "build"],
  ["RUNNING", "第一个闭环", "真的", "跑起来", "可运行状态让下一步公开变得可信。", "local", "open", 100, 8, "可运行", "works", ["启动", "可用", "闭环"], "build"],
  ["PUBLISH", "从自己用到公开", "开源", "写出来", "项目被放到外部世界，飞轮开始接触空气。", "open", "video", 122, 9, "公开", "OSS", ["README", "repo", "说明"], "publish"],
  ["MEDIA", "让它被看见", "自媒体", "发声", "视频把仓库里的变化送到用户面前。", "video", "user", 145, 10, "传播", "video", ["视频", "讲清楚", "被看见"], "publish"],
  ["FIRST USERS", "第一批反馈源", "用户", "进来了", "用户进入，闭环开始正式转动。", "user", "signal", 170, 10, "首批用户", "users", ["试用", "关注", "真实场景"], "loop"],
  ["REQUEST", "用户开始推动", "提出", "需求", "用户把需求推到下一段轨道。", "user", "signal", 205, 10, "需求进入", "ask", ["场景", "功能", "优先级"], "loop"],
  ["BUG", "真实使用的代价", "反馈", "bug", "需求和 bug 变成最具体的修复信号。", "signal", "repair", 240, 10, "问题暴露", "bug", ["复现", "日志", "修复点"], "loop"],
  ["RELEASE", "维护动作", "修 加", "发版本", "修复和功能被打包成版本节奏。", "repair", "version", 276, 10, "迭代", "release", ["修 bug", "加功能", "发版"], "loop"],
  ["NEW VIDEO", "新功能再传播", "新功能", "发视频", "版本需要被解释，视频点亮下一段。", "version", "video", 314, 10, "二次传播", "feature", ["功能点", "教程", "传播"], "loop"],
  ["MORE USERS", "传播带来增量", "新用户", "回来", "视频带来新用户，闭环回到入口。", "video", "newUser", 354, 10, "增长", "more", ["新用户", "新场景", "新反馈"], "loop"],
  ["MORE ISSUES", "用户带来信号", "新 issue", "继续来", "新用户继续带回新的需求和问题。", "newUser", "signal", 396, 10, "信号增加", "issues", ["bug", "需求", "讨论"], "loop"],
  ["NEW VERSION", "信号推动形态", "新版本", "继续发", "信号再次推动修复、功能、版本。", "signal", "repair", 440, 10, "产品化", "release", ["issue", "版本", "维护"], "loop"],
  ["DESKTOP", "产品形态变化", "桌面端", "版本", "版本越滚越厚，甚至长出新形态。", "version", "video", 486, 10, "桌面版", "desktop", ["桌面端", "更完整", "新需求"], "loop"],
  ["FAST GROWTH", "飞轮转起来之后", "增长", "很快", "每一圈都把下一圈推得更轻。", "newUser", "signal", 536, 10, "加速", "fast", ["用户", "issue", "版本"], "lesson"],
  ["OPEN SOURCE", "更大的规律", "开源项目", "先跑通", "开源项目靠真实使用把轨道磨顺。", "open", "user", 590, 10, "通用套路", "OSS", ["开源项目", "用户", "反馈"], "lesson"],
  ["PATTERN", "创业产品也一样", "创业产品", "同一套", "本质都是反馈驱动迭代。", "repair", "version", 648, 10, "通用套路", "pattern", ["创业产品", "反馈循环", "迭代"], "lesson"],
  ["USERS FIRST", "先有真实使用", "先有", "用户", "用户让项目转得更快，也更准。", "user", "signal", 710, 10, "用户优先", "users first", ["真实场景", "真实需求", "快起来"], "lesson"],
  ["LIMIT", "个人想法有上限", "单靠自己", "太局限", "闭门想象替代不了真实反馈。", "signal", "repair", 776, 10, "回到反馈", "limit", ["别空想", "看反馈", "继续迭代"], "lesson"],
];

const steps = stepTuples.map(
  ([label, eyebrow, title, accent, note, active, next, rotation, build, status, metric, chips, panel]) => ({
    label,
    eyebrow,
    title,
    accent,
    note,
    active,
    next,
    rotation,
    build,
    status,
    metric,
    chips,
    panel,
  }),
);

function polarPoint(key: WheelKey) {
  const angle = (nodeAngles[key] * Math.PI) / 180;
  const radius = 340;
  return {
    x: 430 + Math.cos(angle) * radius,
    y: 430 + Math.sin(angle) * radius,
  };
}

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
    <section className={`fw-scene fw-step-${step}`}>
      <div className="fw-kicker">OPEN SOURCE FLYWHEEL · {label}</div>
      {children}
    </section>
  );
}

function WordStack({
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
    <div className="fw-word-stack">
      <div className="fw-eyebrow">{eyebrow}</div>
      <h1>
        <span>{title}</span>
        <span className="fw-accent">{accent}</span>
      </h1>
      <p>{note}</p>
    </div>
  );
}

function RotatingFlywheel({
  active,
  next,
  rotation,
  build,
  panel,
}: {
  active: WheelKey;
  next: WheelKey;
  rotation: number;
  build: number;
  panel: Panel;
}) {
  const activeEdge = `${active}-${next}`;
  const visibleKeys = new Set(wheelNodes.slice(0, Math.max(1, build)).map((node) => node.key));
  const allVisible = build >= wheelNodes.length;
  const displayEdges = loopEdges.some((edge) => `${edge.from}-${edge.to}` === activeEdge)
    ? loopEdges
    : [...loopEdges, { from: active, to: next }];

  return (
    <div
      className={`fw-flywheel fw-panel-${panel}`}
      style={cssVar({
        "--fw-rotation": `${rotation}deg`,
        "--fw-build": `${build}`,
        "--fw-energy-offset": `${Math.max(0, 2136 - build * 214)}`,
      })}
    >
      <div className="fw-wheel-core">
        <span>flywheel</span>
        <b>{panel === "lesson" ? "加速" : panel === "loop" ? "闭环" : "起转"}</b>
      </div>
      <div className="fw-wheel-rotor">
        <svg className="fw-track" viewBox="0 0 860 860" aria-hidden="true">
          <circle className="fw-track-base" cx="430" cy="430" r="340" />
          <circle className="fw-track-energy" cx="430" cy="430" r="340" />
          {displayEdges.map((edge) => {
            const from = polarPoint(edge.from);
            const to = polarPoint(edge.to);
            const key = `${edge.from}-${edge.to}`;
            const isHot = key === activeEdge || (active === "newUser" && edge.from === "newUser");
            return (
              <line
                key={key}
                className={isHot ? "fw-track-edge fw-track-edge-hot" : "fw-track-edge"}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
              />
            );
          })}
        </svg>
        {wheelNodes.map((node) => {
          const angle = nodeAngles[node.key];
          const isHot = node.key === active;
          const isNext = node.key === next;
          const isVisible = allVisible || visibleKeys.has(node.key) || isHot || isNext;

          return (
            <div
              key={node.key}
              className={[
                "fw-node-slot",
                isVisible ? "fw-node-visible" : "",
                isHot ? "fw-node-hot" : "",
                isNext ? "fw-node-next" : "",
              ].join(" ")}
              style={cssVar({
                "--fw-angle": `${angle}deg`,
                "--fw-counter": `${-(angle + rotation)}deg`,
              })}
            >
              <div className="fw-node">
                <span>{node.label}</span>
                <b>{node.value}</b>
                <i>{node.tag}</i>
              </div>
            </div>
          );
        })}
      </div>
      <div className="fw-force-meter" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function StatusPanel({
  status,
  metric,
  chips,
  active,
  next,
  panel,
}: {
  status: string;
  metric: string;
  chips: string[];
  active: WheelKey;
  next: WheelKey;
  panel: Panel;
}) {
  return (
    <div className={`fw-status fw-panel-${panel}`}>
      <div className="fw-status-top">
        <span>current state</span>
        <b>{status}</b>
      </div>
      <div className="fw-route">
        <span>active path</span>
        <strong>
          {wheelNodes.find((node) => node.key === active)?.label}
          <em>-&gt;</em>
          {wheelNodes.find((node) => node.key === next)?.label}
        </strong>
      </div>
      <div className="fw-metric">
        <span>signal</span>
        <strong>{metric}</strong>
      </div>
      <div className="fw-chip-row">
        {chips.map((chip) => (
          <em key={chip}>{chip}</em>
        ))}
      </div>
    </div>
  );
}

export default function OpenSourceFlywheel({ step }: ChapterStepProps) {
  const current = steps[step] ?? steps[steps.length - 1];

  return (
    <Shell step={step} label={current.label}>
      <main className="fw-layout">
        <WordStack
          eyebrow={current.eyebrow}
          title={current.title}
          accent={current.accent}
          note={current.note}
        />
        <div className="fw-board">
          <RotatingFlywheel
            active={current.active}
            next={current.next}
            rotation={current.rotation}
            build={current.build}
            panel={current.panel}
          />
          <StatusPanel
            status={current.status}
            metric={current.metric}
            chips={current.chips}
            active={current.active}
            next={current.next}
            panel={current.panel}
          />
        </div>
      </main>
    </Shell>
  );
}
