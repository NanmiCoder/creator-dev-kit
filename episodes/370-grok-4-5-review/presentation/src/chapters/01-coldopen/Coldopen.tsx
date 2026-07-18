import type { ChapterStepProps } from "../../registry/types";
import "./Coldopen.css";

const A = `${import.meta.env.BASE_URL}assets/`;

type ModelMarkProps = {
  logo: string;
  name: string;
  note: string;
  className?: string;
};

function ModelMark({ logo, name, note, className = "" }: ModelMarkProps) {
  return (
    <div className={`cd-model ${className}`}>
      <div className="cd-model-logo-box">
        <img src={`${A}${logo}`} alt="" className="cd-model-logo" />
      </div>
      <div className="cd-model-copy">
        <strong>{name}</strong>
        <span>{note}</span>
      </div>
    </div>
  );
}

function SceneLabel({ children }: { children: string }) {
  return <div className="cd-kicker">{children}</div>;
}

export default function Coldopen({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="cd-scene cd-opening">
        <SceneLabel>BREAKING · MODEL ORIGIN</SceneLabel>
        <div className="cd-musk-frame">
          <img src={`${A}musk.jpg`} alt="Elon Musk" />
          <div className="cd-musk-name">ELON MUSK</div>
        </div>

        <div className="cd-event-board">
          <img className="cd-spacex" src={`${A}spacex.svg`} alt="SpaceX" />
          <div className="cd-deal-line">
            <span className="cd-deal-tag">ACQUISITION</span>
            <span className="hero-num cd-deal-num">$60B</span>
          </div>
          <div className="cd-cursor-target">
            <span className="cd-link-line" />
            <img src={`${A}cursor-cube.svg`} alt="Cursor" />
            <span>CURSOR</span>
          </div>
          <div className="cd-launch-card">
            <span>JOINT TRAINING</span>
            <strong>GROK 4.5</strong>
            <i>RELEASED</i>
          </div>
        </div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="cd-scene cd-lineup">
        <SceneLabel>REAL PROJECT BENCHMARK · SAME TEST</SceneLabel>
        <div className="cd-lineup-title">
          <span>4 MODELS</span>
          <strong>2 个真实项目</strong>
        </div>
        <div className="cd-model-grid">
          <ModelMark logo="anthropic.svg" name="OPUS 4.8" note="ANTHROPIC" className="cd-rise-1" />
          <ModelMark logo="openai.svg" name="GPT 5.5" note="OPENAI" className="cd-rise-2" />
          <ModelMark logo="xai.svg" name="GROK 4.5" note="CURRENT TEST" className="cd-rise-3 cd-model-focus" />
          <ModelMark logo="zhipu.svg" name="GLM 5.2" note="ZHIPU AI" className="cd-rise-4" />
        </div>
        <div className="cd-bench-floor" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="cd-scene cd-cutaway">
        <div className="cd-cut-frame">
          <div className="cd-cut-top">
            <span>REAL TEST FOOTAGE</span>
            <strong>实测录屏 · 加速展示</strong>
          </div>
          <div className="cd-cut-split">
            <div className="cd-cut-task cd-cut-left">
              <span>LEFT</span>
              <strong>认证迁移</strong>
              <i>AUTH MIGRATION</i>
            </div>
            <div className="cd-cut-clock">
              <b>7.57</b>
              <span>SEC</span>
            </div>
            <div className="cd-cut-task cd-cut-right">
              <span>RIGHT</span>
              <strong>Skills Agent</strong>
              <i>WEB APPLICATION</i>
            </div>
          </div>
          <div className="cd-cut-bottom">
            <span>后期在主轨替换此段</span>
            <strong>END FRAME · 101 PASSED</strong>
          </div>
          <div className="cd-scan" aria-hidden="true" />
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="cd-scene cd-results">
        <SceneLabel>DELIVERY SNAPSHOT</SceneLabel>
        <div className="cd-result-lead">
          <span className="hero-num">&lt;10</span>
          <div>
            <strong>MINUTES</strong>
            <em>两个项目都交付</em>
          </div>
        </div>
        <div className="cd-result-grid">
          <div className="card cd-result-cell cd-result-tests">
            <span>PROJECT TESTS</span>
            <strong>101</strong>
            <i>PASSED</i>
          </div>
          <div className="card cd-result-cell cd-result-function">
            <span>FUNCTION</span>
            <strong>10.0</strong>
            <i>FULL SCORE</i>
          </div>
        </div>
        <div className="cd-result-trace" aria-hidden="true"><span /></div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="cd-scene cd-contrast">
        <SceneLabel>SAME PROJECT · TWO SIDES</SceneLabel>
        <div className="cd-score-half cd-score-function">
          <span>功能完整性</span>
          <strong className="hero-num">10.0</strong>
          <div className="cd-meter"><i /></div>
          <em>FULL DELIVERY</em>
        </div>
        <div className="cd-score-slash" aria-hidden="true" />
        <div className="cd-score-half cd-score-security">
          <span>安全性</span>
          <strong className="hero-num">5.5</strong>
          <div className="cd-meter"><i /></div>
          <em>BOUNDARY MISSED</em>
        </div>
      </section>
    );
  }

  if (step === 5) {
    const rows = [
      ["01", "OPUS 4.8", "8.86", "anthropic.svg"],
      ["02", "GPT 5.5", "8.62", "openai.svg"],
      ["03", "GROK 4.5", "8.32", "xai.svg"],
      ["04", "GLM 5.2", "8.14", "zhipu.svg"],
    ];
    return (
      <section className="cd-scene cd-ranking">
        <SceneLabel>2 REAL PROJECTS · FINAL SCORE</SceneLabel>
        <div className="cd-rank-title">
          <span>综合排名</span>
          <strong>第三</strong>
        </div>
        <div className="cd-rank-table">
          {rows.map(([rank, name, score, logo]) => (
            <div className={`cd-rank-row ${rank === "03" ? "is-grok" : ""}`} key={rank}>
              <span className="cd-rank-no">{rank}</span>
              <img src={`${A}${logo}`} alt="" />
              <strong>{name}</strong>
              <i><b style={{ width: `${Number(score) * 10}%` }} /></i>
              <em>{score}</em>
            </div>
          ))}
        </div>
        <div className="cd-rank-note"><span />真正拖后腿：认证安全与并发边界</div>
      </section>
    );
  }

  return (
    <section className="cd-scene cd-question">
      <SceneLabel>THE ONLY QUESTION</SceneLabel>
      <div className="cd-question-flags">
        <span>又快</span>
        <span>又敢写</span>
      </div>
      <div className="cd-question-main">
        <img src={`${A}xai.svg`} alt="xAI" />
        <div>
          <small>GROK 4.5</small>
          <strong>能当编程主力吗？</strong>
        </div>
      </div>
      <div className="cd-question-axis">
        <span>速度</span>
        <i><b /></i>
        <span>安全</span>
      </div>
    </section>
  );
}
