import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./PositioningChapter.css";

const audienceItems = ["知识科普", "技术教程", "AI 工具分享"];
const tools = ["Claude Code", "Codex", "Cursor", "MiniMax Code", "Trae", "Zcode"];
const reviewAgents = ["layout", "motion", "copy", "srt", "capture"];
const taskModules = [
  { title: "页面理解", detail: "title / content / cue" },
  { title: "布局", detail: "grid / spacing / focus" },
  { title: "动画节奏", detail: "step / motion / VO" },
];
const coverageNeeds = [
  { title: "桌面端执行", owner: "MiniMax Code" },
  { title: "图片理解", owner: "MiniMax M3" },
  { title: "分章节协作", owner: "AgentTeams" },
  { title: "Review 修改", owner: "M3 + Agents" },
];

function Kicker({ label }: { label: string }) {
  return <div className="ch2-kicker">{label}</div>;
}

function AudienceGate() {
  return (
    <div className="ch2-audience-demo" aria-hidden="true">
      <div className="ch2-adapt-zone">
        <span>adapt zone</span>
      </div>
      {audienceItems.map((item, index) => (
        <div
          className="ch2-audience-chip card"
          style={{ "--i": index } as CSSProperties}
          key={item}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{item}</strong>
        </div>
      ))}
      <div className="ch2-zone-scan" />
    </div>
  );
}

function WorkflowOrbit() {
  return (
    <div className="ch2-orbit-demo" aria-hidden="true">
      <div className="ch2-orbit-core">
        <span>workflow</span>
        <strong>CORE</strong>
      </div>
      {tools.map((tool, index) => (
        <div
          className="ch2-orbit-tool"
          style={{ "--i": index } as CSSProperties}
          key={tool}
        >
          {tool}
        </div>
      ))}
      <div className="ch2-orbit-ring ring-a" />
      <div className="ch2-orbit-ring ring-b" />
    </div>
  );
}

function ToolMatrix() {
  return (
    <div className="ch2-tool-matrix" aria-hidden="true">
      <div className="ch2-tool-column">
        <span>global</span>
        {tools.slice(0, 3).map((tool, index) => (
          <i style={{ "--i": index } as CSSProperties} key={tool}>
            {tool}
          </i>
        ))}
      </div>
      <div className="ch2-tool-column is-active">
        <span>local demo</span>
        {tools.slice(3).map((tool, index) => (
          <i style={{ "--i": index + 3 } as CSSProperties} key={tool}>
            {tool}
          </i>
        ))}
      </div>
      <div className="ch2-tool-link" />
    </div>
  );
}

function ReasonBoard() {
  return (
    <div className="ch2-reason-board" aria-hidden="true">
      <div className="ch2-reason-card card">
        <span>TTS</span>
        <div className="ch2-wave-row">
          {Array.from({ length: 22 }).map((_, index) => (
            <i
              style={
                {
                  "--i": index,
                  "--h": `${28 + (index % 5) * 16}px`,
                } as CSSProperties
              }
              key={index}
            />
          ))}
        </div>
      </div>
      <div className="ch2-plus">+</div>
      <div className="ch2-reason-card card">
        <span>vision</span>
        <div className="ch2-vision-box">
          <b />
          <b />
          <b />
          <em>image understanding</em>
        </div>
      </div>
    </div>
  );
}

function TaskScope({ phase }: { phase: number }) {
  return (
    <div className={`ch2-scope is-phase-${phase}`} aria-hidden="true">
      <div className="ch2-task-card card">
        <span>incoming task</span>
        <strong>知识科普视频制作</strong>
        <i>screen + VO + motion</i>
      </div>
      <div className="ch2-scope-stage">
        <div className="ch2-page-map">
          <span className="hero-block" />
          <span className="copy-line wide" />
          <span className="copy-line" />
          <span className="media-block" />
          <span className="timeline-block" />
        </div>
        <div className="ch2-module-row">
          {taskModules.map((task, index) => (
            <span
              className={phase >= 1 ? "is-active" : ""}
              style={{ "--i": index } as CSSProperties}
              key={task.title}
            >
              <strong>{task.title}</strong>
              <em>{task.detail}</em>
            </span>
          ))}
        </div>
      </div>
      <div className={`ch2-scope-sidebar ${phase >= 2 ? "is-rejected" : ""}`}>
        <span>backend extreme</span>
        <i>queue skipped</i>
        <b>not this task</b>
      </div>
    </div>
  );
}

function CoverageBoard({ phase }: { phase: number }) {
  return (
    <div className={`ch2-coverage is-phase-${phase}`} aria-hidden="true">
      <div className="ch2-demand-list">
        <span className="ch2-board-label">current requirements</span>
        {coverageNeeds.map((need, index) => (
          <div
            className={`ch2-demand-card card ${phase >= Math.min(index, 3) ? "is-covered" : ""}`}
            style={{ "--i": index } as CSSProperties}
            key={need.title}
          >
            <b />
            <strong>{need.title}</strong>
            <em>{need.owner}</em>
          </div>
        ))}
      </div>
      <div className="ch2-capability-stack">
        <div className="ch2-capability-card is-code">
          <span>desktop</span>
          <strong>MiniMax Code</strong>
        </div>
        <div className={`ch2-capability-card is-m3 ${phase >= 1 ? "is-on" : ""}`}>
          <span>vision model</span>
          <strong>MiniMax M3</strong>
        </div>
        <div className={`ch2-capability-card is-teams ${phase >= 2 ? "is-on" : ""}`}>
          <span>parallel work</span>
          <strong>AgentTeams</strong>
        </div>
        <div className={`ch2-covered-banner ${phase >= 3 ? "is-on" : ""}`}>
          <span>current demand</span>
          <strong>covered</strong>
        </div>
      </div>
    </div>
  );
}

function CostMeter() {
  return (
    <div className="ch2-cost" aria-hidden="true">
      <div className="ch2-cost-rail">
        <span className="ch2-cost-fill" />
        <span className="ch2-cost-cap">sweet spot</span>
      </div>
      <div className="ch2-cost-labels">
        <i>cheap enough</i>
        <i>capable enough</i>
        <i>not always premium</i>
      </div>
    </div>
  );
}

function ReviewQueue() {
  return (
    <div className="ch2-review" aria-hidden="true">
      <div className="ch2-review-screen">
        <div className="ch2-review-bars">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="ch2-agent-lane">
        {reviewAgents.map((agent, index) => (
          <div
            className="ch2-agent card"
            style={{ "--i": index } as CSSProperties}
            key={agent}
          >
            <b />
            <span>{agent}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PositioningChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch2-scene ch2-audience">
        <Kicker label="Chapter 02 / positioning" />
        <div className="ch2-copy">
          <div className="ch2-overline">这套方法适合谁</div>
          <h1>三类内容，直接进入适配区。</h1>
          <p>知识科普、技术教程、AI 工具分享，都可以用网页视频把流程讲清楚。</p>
        </div>
        <AudienceGate />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch2-scene ch2-core">
        <Kicker label="workflow first" />
        <div className="ch2-copy is-right">
          <div className="ch2-overline">先把边界说清楚</div>
          <h2>不绑定某一个 Agent 工具。</h2>
          <p>核心是 workflow，工具名只是围绕它的执行入口。</p>
        </div>
        <WorkflowOrbit />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch2-scene ch2-tools">
        <Kicker label="tool spread" />
        <div className="ch2-copy">
          <h2>横向展开，很多工具都能做。</h2>
          <p>Claude Code、Codex、Cursor、MiniMax Code、Trae、Zcode 都可以进入同一条链路。</p>
        </div>
        <ToolMatrix />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch2-scene ch2-reasons">
        <Kicker label="why this demo" />
        <div className="ch2-copy">
          <div className="ch2-overline">本期用 MiniMax Code 演示</div>
          <h2>TTS 音频生成，加上多模态图片理解。</h2>
          <p>这两个能力刚好卡在这条视频生产线最顺手的位置。</p>
        </div>
        <ReasonBoard />
      </section>
    );
  }

  if (step >= 4 && step <= 6) {
    const phase = step - 4;
    const copy = [
      {
        overline: "task type",
        title: "知识科普视频，本质是页面任务。",
        body: "它要先进入页面结构、口播节奏和视觉表达的判断链路。",
      },
      {
        overline: "task needs",
        title: "页面理解、布局、动画节奏。",
        body: "看懂页面，摆对信息，再让每个动画跟口播 cue 对齐。",
      },
      {
        overline: "not this task",
        title: "这不是极限后端研发。",
        body: "复杂后端路径可以放到暗区，当前重点是视频画面生产。",
      },
    ][phase]!;

    return (
      <section className="ch2-scene ch2-task">
        <Kicker label="task nature" />
        <div className="ch2-copy is-wide">
          <div className="ch2-overline">{copy.overline}</div>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
        </div>
        <TaskScope phase={phase} />
      </section>
    );
  }

  if (step === 7) {
    return (
      <section className="ch2-scene ch2-balance">
        <Kicker label="cost / ability" />
        <div className="ch2-copy">
          <h2>没必要每一步都用最贵模型。</h2>
          <p>能力够用、成本合适，才适合反复改网页效果。</p>
        </div>
        <CostMeter />
      </section>
    );
  }

  if (step === 8) {
    return (
      <section className="ch2-scene ch2-reviewing">
        <Kicker label="review work split" />
        <div className="ch2-copy">
          <h2>后面会有大量效果 review。</h2>
          <p>布局、动效、文案、SRT、录屏检查，适合多个 Agent 分流。</p>
        </div>
        <ReviewQueue />
      </section>
    );
  }

  const phase = Math.min(3, step - 9);
  const finalCopy = [
    {
      overline: "workflow fit",
      title: "MiniMax Code 放进这条工作流。",
      body: "桌面端接住网页、音频、字幕和本地录制文件。",
    },
    {
      overline: "vision layer",
      title: "MiniMax M3 负责理解画面。",
      body: "图片、截图、布局问题，都能被模型看见。",
    },
    {
      overline: "team layer",
      title: "AgentTeams 负责拆工协作。",
      body: "章节、动效、review、修复，不需要一个 Agent 全扛。",
    },
    {
      overline: "current demand",
      title: "当前开发需求：已覆盖。",
      body: "不是唯一选择，但这期视频的制作需求能被这套组合接住。",
    },
  ][phase]!;

  return (
    <section className="ch2-scene ch2-final">
      <Kicker label="coverage board" />
      <div className="ch2-copy is-center">
        <div className="ch2-overline">{finalCopy.overline}</div>
        <h2>{finalCopy.title}</h2>
        <p>{finalCopy.body}</p>
      </div>
      <CoverageBoard phase={phase} />
    </section>
  );
}
