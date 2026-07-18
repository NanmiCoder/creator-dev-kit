import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./InstallSkillsChapter.css";

const slots = [
  { label: "审美", role: "design-taste-frontend" },
  { label: "网页视频", role: "web-video-presentation" },
];

const installLines = [
  "读取 leonxlnx/taste-skill",
  "启用 design-taste-frontend",
  "读取 ConardLi/garden-skills",
  "启用 web-video-presentation",
];

function SkillSlots({ active }: { active: number }) {
  return (
    <div className="ch4-slot-board" aria-hidden="true">
      <div className="ch4-slot-rail" />
      {slots.map((slot, index) => (
        <div
          className={`ch4-slot card ${active >= index ? "is-active" : ""}`}
          style={{ "--i": index } as CSSProperties}
          key={slot.role}
        >
          <span>{slot.label}</span>
          <strong>{slot.role}</strong>
          <i />
        </div>
      ))}
    </div>
  );
}

function QualityGate() {
  const checks = ["模板感", "留白", "字体", "节奏"];
  return (
    <div className="ch4-quality" aria-hidden="true">
      <div className="ch4-quality-title">aesthetic gate</div>
      {checks.map((check, index) => (
        <div className="ch4-quality-row" key={check}>
          <span>{check}</span>
          <div>
            <i style={{ "--i": index } as CSSProperties} />
          </div>
          <b>{index === 0 ? "拦截" : "校准"}</b>
        </div>
      ))}
    </div>
  );
}

function InstallTerminal() {
  return (
    <div className="ch4-terminal card" aria-hidden="true">
      <div className="ch4-terminal-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="ch4-prompt">
        帮我安装这两个 Skill：
        <br />
        github.com/leonxlnx/taste-skill
        <br />
        github.com/ConardLi/garden-skills
      </div>
      <div className="ch4-install-lines">
        {installLines.map((line, index) => (
          <p style={{ "--i": index } as CSSProperties} key={line}>
            <span />
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function SlashCheck() {
  const commands = ["/design-taste-frontend", "/web-video-presentation"];
  return (
    <div className="ch4-slash card" aria-hidden="true">
      <div className="ch4-slash-input">/</div>
      <div className="ch4-slash-list">
        {commands.map((command, index) => (
          <div
            className="ch4-command"
            style={{ "--i": index } as CSSProperties}
            key={command}
          >
            <span>{command}</span>
            <b>installed</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentHandOff() {
  return (
    <div className="ch4-handoff" aria-hidden="true">
      <div className="ch4-human-node">你</div>
      <div className="ch4-hand-line">
        <span />
      </div>
      <div className="ch4-agent-node card">
        <span>Agent</span>
        <strong>安装 / 验收 / 串联本地项目</strong>
      </div>
    </div>
  );
}

export default function InstallSkillsChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch4-scene ch4-slots">
        <div className="ch4-kicker">Chapter 04 / install skills</div>
        <div className="ch4-copy">
          <div className="hero-num ch4-num">02</div>
          <h2>先准备两个职责位。</h2>
          <p>一个管审美，一个管网页视频结构。</p>
        </div>
        <SkillSlots active={1} />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch4-scene ch4-taste">
        <div className="ch4-kicker">leonxlnx/taste-skill</div>
        <div className="ch4-repo-card card">
          <span>open source skill</span>
          <h2>leonxlnx/taste-skill</h2>
          <p>本期启用其中的 design-taste-frontend。</p>
        </div>
        <div className="ch4-focus-ring" aria-hidden="true">
          <span>design</span>
          <span>taste</span>
          <span>frontend</span>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch4-scene ch4-gate-scene">
        <div className="ch4-kicker">anti-template pass</div>
        <div className="ch4-copy ch4-gate-copy">
          <h2>普通模板感，先过审美质检。</h2>
          <p>不是堆卡片，而是检查画面有没有视频该有的取舍和节奏。</p>
        </div>
        <QualityGate />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch4-scene ch4-webvideo">
        <div className="ch4-kicker">ConardLi/garden-skills</div>
        <div className="ch4-stage-card card" aria-hidden="true">
          <div className="ch4-stage-aspect">16:9</div>
          <div className="ch4-stage-track">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="ch4-webvideo-copy">
          <h2>web-video-presentation</h2>
          <p>把文章或口播稿，做成点击驱动的 16:9 网页演示。</p>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="ch4-scene ch4-install">
        <div className="ch4-kicker">natural language install</div>
        <div className="ch4-install-copy">
          <h2>不用背命令。</h2>
          <p>把两个 GitHub 地址交给 MiniMax Code，用自然语言说清楚目标。</p>
        </div>
        <InstallTerminal />
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="ch4-scene ch4-verify">
        <div className="ch4-kicker">slash command check</div>
        <div className="ch4-verify-copy">
          <h2>斜杠命令里能看到，就算装好了。</h2>
        </div>
        <SlashCheck />
      </section>
    );
  }

  return (
    <section className="ch4-scene ch4-agent">
      <div className="ch4-kicker">hand it to agent</div>
      <div className="ch4-agent-copy">
        <h2>能交给 Agent 的，就别手敲复杂命令。</h2>
        <p>你理解分工，Agent 执行安装、验收和项目串联。</p>
      </div>
      <AgentHandOff />
    </section>
  );
}
