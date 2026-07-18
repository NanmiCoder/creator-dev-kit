import type { ChapterStepProps } from "../../registry/types";
import "./Method.css";

function Kicker({ children }: { children: string }) {
  return <div className="mt-kicker">BENCH METHOD · {children}</div>;
}

function MethodRail({ active }: { active: "prompt" | "base" | "accept" }) {
  const entries = [
    ["prompt", "01", "PROMPT", "提示词"],
    ["base", "02", "BASE", "基线代码"],
    ["accept", "03", "ACCEPT", "验收标准"],
  ] as const;

  return (
    <div className="mt-rail">
      <div className="mt-rail-line" aria-hidden="true" />
      {entries.map(([id, no, en, cn]) => (
        <div className={`mt-rail-cell ${active === id ? "is-active" : ""}`} key={id}>
          <span>{no}</span>
          <strong>{en}</strong>
          <em>{cn}</em>
        </div>
      ))}
    </div>
  );
}

function TerminalGlyph() {
  return (
    <svg viewBox="0 0 170 120" aria-hidden="true">
      <rect x="3" y="3" width="164" height="114" />
      <path d="M24 32l22 18-22 18M60 70h42" />
      <circle cx="24" cy="18" r="3" /><circle cx="36" cy="18" r="3" /><circle cx="48" cy="18" r="3" />
    </svg>
  );
}

function BrowserGlyph() {
  return (
    <svg viewBox="0 0 230 150" aria-hidden="true">
      <rect x="3" y="3" width="224" height="144" />
      <path d="M3 34h224M22 18h34M78 18h112" />
      <rect x="21" y="53" width="50" height="72" />
      <path d="M87 59h111M87 79h78M87 99h96M87 119h60" />
    </svg>
  );
}

export default function Method({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="mt-scene mt-measure">
        <Kicker>SAME INPUT</Kicker>
        <div className="mt-measure-copy">
          <small>CONTROL VARIABLES</small>
          <strong>同一把尺</strong>
        </div>
        <MethodRail active="base" />
        <div className="mt-ruler" aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => <i key={i} />)}
          <b />
        </div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="mt-scene mt-project-a">
        <Kicker>PROJECT A</Kicker>
        <MethodRail active="accept" />
        <div className="mt-a-index hero-num">A</div>
        <div className="mt-a-copy">
          <span>IMAGE AGENT</span>
          <strong>认证迁移</strong>
        </div>
        <div className="mt-a-target" aria-hidden="true">
          <i /><i /><i /><i />
          <b />
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="mt-scene mt-migration">
        <Kicker>CROSS-PROJECT MIGRATION</Kicker>
        <div className="card mt-project-card mt-source">
          <span>SOURCE PROJECT</span>
          <strong>已有认证</strong>
          <div className="mt-source-stack"><i /><i /><i /></div>
        </div>
        <div className="mt-transfer">
          <div className="mt-transfer-track"><i /></div>
          <div className="mt-auth-package">
            <small>AUTH</small>
            <strong>6</strong>
            <span>MODULES</span>
          </div>
        </div>
        <div className="card mt-project-card mt-target">
          <span>TARGET AGENT</span>
          <strong>图片生成</strong>
          <div className="mt-image-grid"><i /><i /><i /><i /></div>
        </div>
      </section>
    );
  }

  if (step === 3) {
    const nodes = ["邮箱", "RESET", "2 TOKEN", "OAUTH", "归属"];
    return (
      <section className="mt-scene mt-explore">
        <Kicker>EXPLORE BEFORE ADAPT</Kicker>
        <div className="mt-explore-core">
          <span>OTHER PROJECT</span>
          <strong>跨项目探索</strong>
          <i aria-hidden="true" />
        </div>
        <svg className="mt-orbits" viewBox="0 0 1200 650" aria-hidden="true">
          <path d="M600 325C420 80 160 104 76 314C6 490 246 610 420 520" />
          <path d="M600 325C790 72 1070 116 1133 326C1185 502 963 614 780 520" />
          <path d="M600 325C518 174 362 190 320 324C278 458 452 526 536 444" />
        </svg>
        <div className="mt-domain-nodes">
          {nodes.map((node, index) => <span style={{ "--node": index } as React.CSSProperties} key={node}>{node}</span>)}
        </div>
        <div className="mt-explore-exit">ADAPT <b /></div>
      </section>
    );
  }

  if (step === 4) {
    const events = ["thinking", "text", "tool_call", "tool_result", "done"];
    return (
      <section className="mt-scene mt-transform">
        <Kicker>PROJECT B · PRODUCTIZE</Kicker>
        <div className="mt-cli-pane">
          <TerminalGlyph />
          <span>CLI AGENT</span>
        </div>
        <div className="mt-transform-arrow" aria-hidden="true"><i /><b /></div>
        <div className="mt-web-pane">
          <BrowserGlyph />
          <span>WEB APP</span>
        </div>
        <div className="mt-event-stream">
          {events.map((event, index) => <i style={{ "--event": index } as React.CSSProperties} key={event}>{event}</i>)}
        </div>
      </section>
    );
  }

  if (step === 5) {
    const gates = [
      ["01", "ANON", "代码匿名"],
      ["02", "BOOT", "真实启动"],
      ["03", "TEST", "真实测试"],
      ["04", "REVIEW", "交叉审查"],
    ];
    return (
      <section className="mt-scene mt-funnel">
        <Kicker>EVIDENCE PIPELINE</Kicker>
        <div className="mt-gate-track" aria-hidden="true"><i /></div>
        <div className="mt-gates">
          {gates.map(([no, en, cn], index) => (
            <div className="mt-gate" style={{ "--gate": index } as React.CSSProperties} key={en}>
              <span>{no}</span><strong>{en}</strong><em>{cn}</em><b />
            </div>
          ))}
        </div>
        <div className="mt-review-orbit" aria-hidden="true">
          <i /><i /><i />
          <strong>CODE</strong>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-scene mt-three-checks">
      <Kicker>FINAL ACCEPTANCE</Kicker>
      <div className="mt-check-head"><span>ONLY</span><strong className="hero-num">3</strong></div>
      <div className="mt-check-line" aria-hidden="true"><i /></div>
      <div className="mt-checks">
        <div className="mt-check mt-check-run"><span>RUN</span><strong>能跑</strong><i /></div>
        <div className="mt-check mt-check-test"><span>TEST</span><strong>能测</strong><i /></div>
        <div className="mt-check mt-check-use"><span>INTERACT</span><strong>能交互</strong><i /></div>
      </div>
    </section>
  );
}
