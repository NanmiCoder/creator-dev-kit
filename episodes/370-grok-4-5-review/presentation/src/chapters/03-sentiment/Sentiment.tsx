import type { ChapterStepProps } from "../../registry/types";
import "./Sentiment.css";

const A = `${import.meta.env.BASE_URL}assets/`;

const commentTiles = Array.from({ length: 35 }, (_, index) => index);
const topTiles = Array.from({ length: 10 }, (_, index) => index);

function Kicker({ children }: { children: string }) {
  return <div className="st-kicker">{children}</div>;
}

function XMark() {
  return <div className="st-x-mark" aria-label="X platform"><strong>X</strong><span>PLATFORM</span></div>;
}

export default function Sentiment({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="st-scene st-pool">
        <Kicker>COMMUNITY SAMPLE · BILI / DOUYIN / X</Kicker>
        <div className="st-comment-field" aria-hidden="true">
          {commentTiles.map((tile) => <i key={tile} />)}
        </div>
        <div className="st-pool-count">
          <strong className="hero-num">5,842</strong>
          <span>RAW COMMENTS</span>
        </div>
        <div className="st-filter-line"><i /></div>
        <div className="st-relevant-count">
          <span>真正相关</span>
          <strong className="hero-num">1,553</strong>
          <em>26.6%</em>
        </div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="st-scene st-position">
        <Kicker>COMMUNITY POSITIONING</Kicker>
        <div className="st-position-board">
          <div className="st-ceiling"><span>TOP EDGE</span></div>
          <div className="st-position-column st-speed">
            <i><b /></i>
            <strong>速度</strong>
            <span>FAST</span>
          </div>
          <div className="st-position-column st-code">
            <i><b /></i>
            <strong>编程</strong>
            <span>STRONG</span>
          </div>
          <div className="st-position-stop">
            <span>第一梯队</span>
            <strong>≠ #1</strong>
          </div>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="st-scene st-fable">
        <Kicker>COMMUNITY COMPARISON · CLAUDE FAMILY</Kicker>
        <div className="st-versus-axis" aria-hidden="true"><span /></div>
        <div className="st-model-plate st-fable-plate">
          <img src={`${A}anthropic.svg`} alt="Anthropic" />
          <div><span>CLAUDE</span><strong>FABLE 5</strong></div>
          <em>37</em>
        </div>
        <div className="st-model-plate st-grok-plate">
          <img src={`${A}xai.svg`} alt="xAI" />
          <div><span>GROK</span><strong>4.5</strong></div>
          <em>19</em>
        </div>
        <div className="st-comparison-tag"><b>社区判断</b><span>弱于票</span></div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="st-scene st-tier">
        <Kicker>COMMUNITY SIGNAL · NOT BENCHMARK SCORE</Kicker>
        <div className="st-tier-stack">
          <div className="st-tier-row st-tier-opus">
            <span>01</span><img src={`${A}anthropic.svg`} alt="" /><strong>OPUS 4.8</strong><i />
          </div>
          <div className="st-tier-row st-tier-gpt">
            <span>02</span><img src={`${A}openai.svg`} alt="" /><strong>GPT 5.5</strong><i />
          </div>
          <div className="st-tier-row st-tier-grok">
            <span>03</span><img src={`${A}xai.svg`} alt="" /><strong>GROK 4.5</strong><i />
          </div>
        </div>
        <div className="st-tier-gap">
          <span>COMMUNITY GAP</span>
          <i><b /></i>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="st-scene st-x-pulse">
        <Kicker>X PLATFORM · 616 RELEVANT COMMENTS</Kicker>
        <div className="st-x-orbit">
          <XMark />
          <div className="st-orbit-ring st-ring-outer" />
          <div className="st-orbit-ring st-ring-inner" />
          <span className="st-orbit-dot st-dot-1" />
          <span className="st-orbit-dot st-dot-2" />
          <span className="st-orbit-dot st-dot-3" />
        </div>
        <div className="st-positive-metric">
          <span>POSITIVE</span>
          <strong className="hero-num">59.3%</strong>
          <div className="st-positive-bar"><i /></div>
          <em>365 / 616</em>
        </div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="st-scene st-toplikes">
        <Kicker>TOP-LIKED POSITIVE POSTS · TOP 10</Kicker>
        <div className="st-like-rack">
          {topTiles.map((tile) => (
            <div className="st-like-tile" key={tile}>
              <span>{String(tile + 1).padStart(2, "0")}</span>
              <i /><i /><i />
              <b />
            </div>
          ))}
        </div>
        <div className="st-like-scan"><span>按点赞排序</span><i /></div>
      </section>
    );
  }

  if (step === 6) {
    return (
      <section className="st-scene st-source-map">
        <Kicker>WHO OWNS THE HIGH-LIKE VOICE?</Kicker>
        <div className="st-source-rack">
          {topTiles.map((tile) => (
            <div className={`st-source-tile ${tile < 8 ? "is-official" : "is-community"}`} key={tile}>
              <span>{String(tile + 1).padStart(2, "0")}</span>
              {tile < 8 ? (
                <strong>OFFICIAL</strong>
              ) : <i />}
            </div>
          ))}
        </div>
        <div className="st-source-total">
          <strong className="hero-num">8 / 10</strong>
          <span><b>MUSK / CURSOR</b><b>AGGREGATED</b></span>
        </div>
      </section>
    );
  }

  return (
    <section className="st-scene st-evidence">
      <Kicker>SIGNAL → EVIDENCE</Kicker>
      <div className="st-noise-stack" aria-hidden="true">
        <span>MUSK</span><span>CURSOR</span><span>LIKES</span><span>X</span>
      </div>
      <div className="st-evidence-gate"><i /><b /></div>
      <div className="st-code-proof">
        <div className="st-terminal-top"><span /><span /><span /><b>REAL PROJECT</b></div>
        <div className="st-proof-flow">
          <div><span>01</span><strong>RUN</strong></div>
          <i />
          <div><span>02</span><strong>TEST</strong></div>
          <i />
          <div><span>03</span><strong>INTERACT</strong></div>
        </div>
        <div className="st-proof-verdict"><span>证据</span><b>&gt;</b><span>声量</span></div>
      </div>
    </section>
  );
}
