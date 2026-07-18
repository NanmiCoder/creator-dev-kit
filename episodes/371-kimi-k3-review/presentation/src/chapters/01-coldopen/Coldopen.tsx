import type { ChapterStepProps } from "../../registry/types";
import "./Coldopen.css";

const ASSET = `${import.meta.env.BASE_URL}assets/`;

type ModelNodeProps = {
  logo: string;
  name: string;
  delay: string;
  kind?: "kimi" | "zhipu";
};

function ModelNode({ logo, name, delay, kind }: ModelNodeProps) {
  return (
    <div className={`k3-model-node ${kind ? `is-${kind}` : ""}`} style={{ "--node-delay": delay } as React.CSSProperties}>
      <span className="k3-node-index" />
      <div className="k3-node-logo"><img src={`${ASSET}${logo}`} alt={`${name} logo`} /></div>
      <strong>{name}</strong>
    </div>
  );
}

function SignalRail() {
  return <div className="k3-signal-rail" aria-hidden="true"><span /></div>;
}

export default function Coldopen({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="k3-scene k3-release">
        <div className="k3-release-slit" aria-hidden="true" />
        <div className="k3-release-mark">
          <img src={`${ASSET}kimi.png`} alt="Kimi" />
          <div>
            <span>MOONSHOT AI</span>
            <strong>KIMI K3</strong>
          </div>
        </div>
        <div className="k3-release-state"><i />JUST RELEASED</div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="k3-scene k3-scale">
        <div className="k3-scale-core">
          <span className="k3-eyebrow">OPEN 3T-CLASS MODEL</span>
          <strong className="hero-num">2.8T</strong>
          <em>PARAMETERS</em>
        </div>
        <div className="k3-context-track" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="k3-context-end">
          <span>CONTEXT WINDOW</span>
          <strong className="hero-num">1M</strong>
          <em>1,048,576 TOKENS</em>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="k3-scene k3-arena">
        <div className="k3-arena-copy">
          <span className="k3-eyebrow">FRONTEND CODE ARENA</span>
          <strong>上一代</strong>
          <div className="k3-rank-shift"><b className="hero-num">18</b><i /><b className="hero-num">01</b></div>
          <em>FROM #18 TO #1</em>
        </div>
        <div className="k3-arena-lift">
          <div className="k3-rank-scale" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}
          </div>
          <div className="k3-logo-car"><img src={`${ASSET}kimi.png`} alt="Kimi" /></div>
          <div className="k3-finish-line"><span />#01</div>
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="k3-scene k3-benchmark">
        <div className="k3-benchmark-heading">
          <span className="k3-eyebrow">SAME TEST · HISTORICAL BASELINE</span>
          <strong>四个历史模型</strong>
          <em>两个真实工程项目</em>
        </div>
        <SignalRail />
        <div className="k3-model-track">
          <ModelNode logo="anthropic.svg" name="OPUS 4.8" delay="0.35s" />
          <ModelNode logo="openai.svg" name="GPT-5.5" delay="2.15s" />
          <ModelNode logo="xai.svg" name="GROK 4.5" delay="5.05s" />
          <ModelNode logo="zhipu.svg" name="GLM-5.2" delay="6.55s" kind="zhipu" />
        </div>
        <div className="k3-benchmark-meta"><span>SAME PROMPTS</span><span>SAME BASELINE</span><span>SAME STANDARD</span></div>
      </section>
    );
  }

  return null;
}
