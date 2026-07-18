import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./AgentTeamsParallelChapter.css";

const lanes = [
  { name: "A", scope: "开头", file: "01-hook", progress: 92 },
  { name: "B", scope: "工具链", file: "03-voice-srt", progress: 76 },
  { name: "C", scope: "Review", file: "07-review", progress: 84 },
  { name: "D", scope: "录屏", file: "08-record", progress: 68 },
];

const folders = [
  "06-agentteams-parallel",
  "07-multimodal-review",
  "08-auto-recording",
  "09-wrap-up",
];

function Kicker({ children }: { children: string }) {
  return <div className="ch6-kicker">{children}</div>;
}

function TaskBoard({ active }: { active: boolean }) {
  const tasks = ["anchor ok", "split chapters", "assign lanes", "merge deck"];

  return (
    <div className={`ch6-task-board ${active ? "is-active" : ""}`} aria-hidden="true">
      <div className="ch6-board-head">
        <span>project board</span>
        <i />
      </div>
      {tasks.map((task, index) => (
        <div
          className="ch6-task-row"
          style={{ "--i": index } as CSSProperties}
          key={task}
        >
          <span className="ch6-task-check" />
          <strong>{task}</strong>
          <em>{index === 0 ? "done" : "ready"}</em>
        </div>
      ))}
      <div className="ch6-unlock-line" />
    </div>
  );
}

function TeamConsole({ active }: { active: boolean }) {
  return (
    <div className={`ch6-team-console ${active ? "is-active" : ""}`} aria-hidden="true">
      <div className="ch6-console-top">
        <span />
        <span />
        <span />
        <strong>AgentTeams</strong>
      </div>
      <div className="ch6-agent-ring">
        {lanes.map((lane, index) => (
          <div
            className="ch6-agent-dot"
            style={{ "--i": index } as CSSProperties}
            key={lane.name}
          >
            {lane.name}
          </div>
        ))}
        <div className="ch6-agent-core">local</div>
      </div>
    </div>
  );
}

function Swimlanes({ step }: { step: number }) {
  return (
    <div className="ch6-swimlanes" aria-hidden="true">
      {lanes.map((lane, index) => (
        <div
          className={`ch6-lane ${step >= index + 2 ? "is-lit" : ""}`}
          style={{ "--i": index, "--p": lane.progress } as CSSProperties}
          key={lane.name}
        >
          <div className="ch6-lane-agent">agent {lane.name}</div>
          <div className="ch6-lane-scope">{lane.scope}</div>
          <div className="ch6-lane-file">{lane.file}</div>
          <div className="ch6-lane-track">
            <span />
          </div>
        </div>
      ))}
    </div>
  );
}

function FolderMerge({ active }: { active: boolean }) {
  return (
    <div className={`ch6-folder-merge ${active ? "is-active" : ""}`} aria-hidden="true">
      <div className="ch6-presentation-root">
        <span>presentation/src/chapters</span>
      </div>
      {folders.map((folder, index) => (
        <div
          className="ch6-folder"
          style={{ "--i": index } as CSSProperties}
          key={folder}
        >
          <i />
          <span>{folder}</span>
        </div>
      ))}
      <div className="ch6-merge-pipe" />
    </div>
  );
}

function SplitRules() {
  const rules = ["chapter folder", "CSS prefix", "motion rhythm"];

  return (
    <div className="ch6-rules" aria-hidden="true">
      {rules.map((rule, index) => (
        <div className="ch6-rule-chip" style={{ "--i": index } as CSSProperties} key={rule}>
          <span>{rule}</span>
        </div>
      ))}
      <div className="ch6-coupling-meter">
        <span>low coupling</span>
        <i />
      </div>
    </div>
  );
}

function LocalPipeline() {
  const files = ["outline.md", "chapter.tsx", "chapter.css", "narrations.ts"];

  return (
    <div className="ch6-local-pipeline" aria-hidden="true">
      <div className="ch6-terminal card">
        <div className="ch6-terminal-line">minimax-code workspace</div>
        <div className="ch6-terminal-line accent">plan - assign - write - review</div>
        <div className="ch6-terminal-cursor" />
      </div>
      <div className="ch6-conveyor">
        {files.map((file, index) => (
          <span style={{ "--i": index } as CSSProperties} key={file}>
            {file}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProgressConfluence() {
  return (
    <div className="ch6-confluence" aria-hidden="true">
      <svg viewBox="0 0 860 460" role="img" aria-label="parallel chapter streams merge">
        <path className="ch6-path" d="M40 70 C250 70 250 220 430 220 C590 220 590 390 820 390" />
        <path className="ch6-path delay-a" d="M40 170 C230 170 270 220 430 220" />
        <path className="ch6-path delay-b" d="M40 290 C240 290 270 220 430 220" />
        <path className="ch6-path delay-c" d="M40 390 C250 390 250 220 430 220" />
      </svg>
      <div className="ch6-final-deck">
        <strong>web PPT</strong>
        <span>complete</span>
      </div>
    </div>
  );
}

export default function AgentTeamsParallelChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch6-scene ch6-unlock">
        <Kicker>Chapter 06 / production opens</Kicker>
        <div className="ch6-copy">
          <div className="hero-num ch6-num">04</div>
          <h1>第一章确认后，完整项目开工。</h1>
          <p>先有风格锚点，再把剩下章节拆成可执行任务。</p>
        </div>
        <TaskBoard active />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch6-scene ch6-teams">
        <Kicker>AgentTeams enters</Kicker>
        <div className="ch6-copy narrow">
          <h1>多 Agent 进入同一个工作台。</h1>
          <p>MiniMax Code 负责把任务、文件和上下文组织起来。</p>
        </div>
        <TeamConsole active />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch6-scene ch6-lanes-scene">
        <Kicker>parallel lanes</Kicker>
        <div className="ch6-lanes-title">
          <h1>每个 Agent 只盯一段。</h1>
          <p>开头、工具链、review、录屏并行推进。</p>
        </div>
        <Swimlanes step={step} />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch6-scene ch6-merge-scene">
        <Kicker>folder merge</Kicker>
        <div className="ch6-copy compact">
          <h1>独立 chapter folder，最后汇入 presentation。</h1>
        </div>
        <FolderMerge active />
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="ch6-scene ch6-split-scene">
        <Kicker>why this splits well</Kicker>
        <div className="ch6-copy compact">
          <h1>网页 PPT 天然适合拆。</h1>
          <p>章节隔离，CSS 前缀隔离，页面动画和布局节奏也能独立推进。</p>
        </div>
        <SplitRules />
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="ch6-scene ch6-local-scene">
        <Kicker>local production line</Kicker>
        <div className="ch6-copy">
          <h1>它不是问答窗口。</h1>
          <p>它是在本地把文件、任务、章节和 review 串成生产线。</p>
        </div>
        <LocalPipeline />
      </section>
    );
  }

  return (
    <section className="ch6-scene ch6-final-scene">
      <Kicker>confluence</Kicker>
      <div className="ch6-final-copy">
        <h1>并行产出，汇成完整网页 PPT。</h1>
        <p>多个章节同时生长，最终合成一条可录屏的视频链路。</p>
      </div>
      <ProgressConfluence />
    </section>
  );
}
