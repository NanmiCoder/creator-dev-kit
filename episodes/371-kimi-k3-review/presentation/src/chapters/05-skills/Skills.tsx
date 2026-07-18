import type { ChapterStepProps } from "../../registry/types";
import "./Skills.css";

const ASSET = `${import.meta.env.BASE_URL}assets/`;

function TerminalToWeb() {
  return (
    <div className="sk-transform-stage">
      <div className="sk-terminal">
        <div className="sk-terminal-bar"><span /><span /><span /><b>skills-agent</b></div>
        <div className="sk-terminal-body">
          <p><i>&gt;</i> /skills</p>
          <p className="sk-terminal-muted">Discovered 2 skills</p>
          <p><i>+</i> news-extractor</p>
          <p><i>+</i> another-skill</p>
          <div className="sk-terminal-stream"><span />thinking</div>
          <div className="sk-terminal-stream"><span />tool_call</div>
          <div className="sk-terminal-stream"><span />tool_result</div>
        </div>
        <strong>CLI AGENT</strong>
      </div>

      <div className="sk-bridge" aria-hidden="true">
        <span /><span /><span /><span /><i />
      </div>

      <div className="sk-browser">
        <div className="sk-browser-bar"><i /><b>Skills Agent</b><span>LIVE</span></div>
        <div className="sk-browser-body">
          <aside><b>AVAILABLE SKILLS</b><span>news-extractor</span><span>another-skill</span></aside>
          <main>
            <div className="sk-chat-thinking"><i />正在思考</div>
            <div className="sk-chat-tool"><b>load_skill</b><span>news-extractor</span></div>
            <div className="sk-chat-answer"><span />实时返回完整过程</div>
          </main>
        </div>
        <strong>WEB FULL STACK</strong>
      </div>
    </div>
  );
}

function LaunchProof() {
  return (
    <div className="sk-launch-stage">
      <div className="sk-launch-title">
        <span>ONE-SHOT RUN</span>
        <strong>两个真实项目</strong>
        <em>一次跑起来</em>
      </div>
      <div className="sk-launch-lines">
        <div className="sk-launch-project sk-launch-project-pic">
          <span>01</span><strong>图片 Agent</strong><i /><em>RUNNING</em>
        </div>
        <div className="sk-launch-core">
          <img src={`${ASSET}kimi.png`} alt="Kimi" />
          <strong>KIMI K3</strong>
          <span>国产模型 · 明显提升</span>
        </div>
        <div className="sk-launch-project sk-launch-project-web">
          <span>02</span><strong>Skills Web</strong><i /><em>RUNNING</em>
        </div>
      </div>
    </div>
  );
}

function TestsPassed() {
  return (
    <div className="sk-tests-stage">
      <div className="sk-tests-copy">
        <span>PYTEST · FULL SUITE</span>
        <strong className="hero-num">104</strong>
        <em>项测试全部通过</em>
        <div className="sk-tests-command"><i />pytest tests -q <b>104 passed</b></div>
      </div>
      <div className="sk-test-matrix" aria-label="104 passed tests">
        {Array.from({ length: 104 }, (_, index) => <span key={index} style={{ "--sk-test": index } as React.CSSProperties} />)}
      </div>
    </div>
  );
}

function StopFault() {
  return (
    <div className="sk-stop-stage">
      <div className="sk-stop-head">
        <span>ABORT BEHAVIOR</span>
        <strong>点了停止</strong>
        <em>后台任务却还在继续</em>
      </div>
      <div className="sk-stop-diagram">
        <div className="sk-stop-client">
          <div><span>BROWSER</span><b>STOP</b></div>
          <strong>连接已断开</strong>
          <div className="sk-client-signal"><i /><i /><i /><i /></div>
        </div>
        <div className="sk-stop-cut" aria-hidden="true"><span /><i /></div>
        <div className="sk-stop-backend">
          <div><span>AGENT EXECUTOR</span><b>STILL RUNNING</b></div>
          <strong>后台没有终止</strong>
          <div className="sk-backend-track"><span /><i /><i /><i /><i /><i /></div>
        </div>
      </div>
    </div>
  );
}

function FinalScore() {
  return (
    <div className="sk-score-stage">
      <div className="sk-score-proof">
        <span>FINAL REVIEW · WEB AGENT</span>
        <div className="sk-score-number hero-num">9.40</div>
        <strong>Skills Web 单项得分</strong>
      </div>
      <div className="sk-score-evidence">
        <span>RESULT EVIDENCE</span>
        <div><strong className="hero-num">104</strong><em>TESTS PASSED</em></div>
        <div><strong>ONE-SHOT</strong><em>FULL STACK RUN</em></div>
        <i aria-hidden="true" />
      </div>
    </div>
  );
}

const tiedModels = [
  { logo: "anthropic.svg", name: "OPUS 4.8", kind: "anthropic" },
  { logo: "openai.svg", name: "GPT-5.5", kind: "openai" },
  { logo: "kimi.png", name: "KIMI K3", kind: "kimi" },
] as const;

function TiedFirst() {
  return (
    <div className="sk-tie-stage">
      <div className="sk-tie-copy">
        <span>SKILLS WEB · FINAL RANK</span>
        <strong>并列第一</strong>
        <em>三款模型，同为 9.40</em>
      </div>
      <div className="sk-tie-board">
        {tiedModels.map((model, index) => (
          <div className={`sk-tie-model sk-tie-${model.kind}`} key={model.name} style={{ "--sk-rank-delay": `${index * 140}ms` } as React.CSSProperties}>
            <div className="sk-tie-logo"><img src={`${ASSET}${model.logo}`} alt={`${model.name} logo`} /></div>
            <strong>{model.name}</strong>
            <span className="hero-num">9.40</span>
            <i />
          </div>
        ))}
        <div className="sk-tie-line"><span>01</span><i /></div>
      </div>
    </div>
  );
}

export default function Skills({ step }: ChapterStepProps) {
  if (step === 0) return <section className="sk-scene"><TerminalToWeb /></section>;
  if (step === 1) return <section className="sk-scene"><LaunchProof /></section>;
  if (step === 2) return <section className="sk-scene"><TestsPassed /></section>;
  if (step === 3) return <section className="sk-scene"><StopFault /></section>;
  if (step === 4) return <section className="sk-scene"><FinalScore /></section>;
  if (step === 5) return <section className="sk-scene"><TiedFirst /></section>;
  return null;
}
