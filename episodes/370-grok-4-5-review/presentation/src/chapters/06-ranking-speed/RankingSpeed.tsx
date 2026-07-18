import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./RankingSpeed.css";

const A = `${import.meta.env.BASE_URL}assets/`;

const MODELS = [
  { rank: "01", name: "OPUS 4.8", score: "8.86", logo: "anthropic.svg", width: "88.6%" },
  { rank: "02", name: "GPT 5.5", score: "8.62", logo: "openai.svg", width: "86.2%" },
  { rank: "03", name: "GROK 4.5", score: "8.32", logo: "xai.svg", width: "83.2%" },
  { rank: "04", name: "GLM 5.2", score: "8.14", logo: "zhipu.svg", width: "81.4%" },
] as const;

function Kicker({ children }: { children: string }) {
  return <div className="rs-kicker">BENCH RESULT · {children}</div>;
}

function RankingBoard({ count }: { count: number }) {
  if (count === 0) {
    return (
      <section className="rs-scene rs-scope">
        <Kicker>SCOPE LOCK</Kicker>
        <div className="rs-scope-bracket"><i /><i /></div>
        <div className="rs-scope-main">
          <strong className="hero-num">2</strong>
          <div><span>REAL PROJECTS</span><em>本期范围</em></div>
        </div>
        <div className="rs-scope-cross"><span>ALL CAPABILITIES</span><i /><b /></div>
      </section>
    );
  }

  return (
    <section className="rs-scene rs-board-scene">
      <Kicker>LIVE LEADERBOARD</Kicker>
      <div className="rs-board-title"><span>CURRENT</span><strong>{String(count).padStart(2, "0")}</strong></div>
      <div className="rs-board">
        {MODELS.slice(0, count).map((model, index) => (
          <div className={`rs-row ${model.rank === "03" ? "is-grok" : ""} ${model.rank === "04" ? "is-zhipu" : ""}`} key={model.name} style={{ "--row": index } as CSSProperties}>
            <span className="rs-rank">{model.rank}</span>
            <div className={`rs-logo-box ${model.rank === "01" || model.rank === "02" ? "is-wide" : ""}`}><img src={`${A}${model.logo}`} alt="" /></div>
            <strong>{model.name}</strong>
            <div className="rs-score-track"><i style={{ width: model.width }} /></div>
            <em className="hero-num">{model.score}</em>
          </div>
        ))}
      </div>
      <div className="rs-board-scope">2 PROJECTS ONLY</div>
    </section>
  );
}

function Logo({ src, name }: { src: string; name: string }) {
  return <div className={`rs-model-mark ${src === "zhipu.svg" ? "is-zhipu" : ""} ${src === "anthropic.svg" || src === "openai.svg" ? "is-wide" : ""}`}><img src={`${A}${src}`} alt="" /><span>{name}</span></div>;
}

export default function RankingSpeed({ step }: ChapterStepProps) {
  if (step <= 4) return <RankingBoard count={step} />;

  if (step === 5) {
    return (
      <section className="rs-scene rs-tier">
        <Kicker>COMPETITIVE TIER</Kicker>
        <div className="rs-tier-band"><span>FIRST TIER</span><i /></div>
        <div className="rs-tier-line" aria-hidden="true" />
        <div className="rs-tier-model rs-tier-opus"><Logo src="anthropic.svg" name="OPUS 4.8" /><strong>8.86</strong></div>
        <div className="rs-tier-model rs-tier-gpt"><Logo src="openai.svg" name="GPT 5.5" /><strong>8.62</strong></div>
        <div className="rs-tier-model rs-tier-grok"><Logo src="xai.svg" name="GROK 4.5" /><strong>8.32</strong><b /></div>
        <div className="rs-not-equal"><span>同梯队</span><i>≠</i><strong>追平</strong></div>
      </section>
    );
  }

  if (step === 6) {
    const rows = [
      ["OPUS 4.8", "8.50", "9.40"],
      ["GPT 5.5", "8.10", "9.40"],
      ["GROK 4.5", "7.63", "9.35"],
    ];
    return (
      <section className="rs-scene rs-gap">
        <Kicker>WHERE THE GAP LIVES</Kicker>
        <div className="rs-gap-table">
          <div className="rs-gap-head"><span>MODEL</span><strong>AUTH</strong><strong>SKILLS</strong></div>
          {rows.map(([name, auth, skills], index) => (
            <div className={`rs-gap-row ${name === "GROK 4.5" ? "is-grok" : ""}`} key={name} style={{ "--gap-row": index } as CSSProperties}>
              <span>{name}</span><strong>{auth}</strong><strong>{skills}</strong>
            </div>
          ))}
          <div className="rs-lens" aria-hidden="true"><i /><b /></div>
        </div>
        <div className="rs-gap-causes">
          <span>SECURITY</span><i /><span>CONCURRENCY</span>
        </div>
      </section>
    );
  }

  if (step === 7) {
    return (
      <section className="rs-scene rs-coordinate">
        <Kicker>QUALITY × DELIVERY TIME</Kicker>
        <div className="rs-axis-y"><span>0 MIN</span><span>45 MIN</span><i /></div>
        <div className="rs-axis-x"><span>8.0</span><span>SCORE</span><span>8.4</span><i /></div>
        <div className="rs-grid-lines" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="rs-dot rs-dot-glm"><img src={`${A}zhipu.svg`} alt="" /><strong>40+</strong><span>8.14</span></div>
        <div className="rs-dot rs-dot-grok"><img src={`${A}xai.svg`} alt="" /><strong>&lt;10</strong><span>8.32</span></div>
        <div className="rs-speed-vector" aria-hidden="true"><i /><b /></div>
      </section>
    );
  }

  if (step === 8) {
    return (
      <section className="rs-scene rs-race">
        <Kicker>SAME PROJECT · DELIVERY RACE</Kicker>
        <div className="rs-clock rs-clock-glm">
          <Logo src="zhipu.svg" name="GLM 5.2" />
          <strong className="hero-num">40+</strong><span>MIN</span>
          <div className="rs-lap"><i /></div>
        </div>
        <div className="rs-clock rs-clock-grok">
          <Logo src="xai.svg" name="GROK 4.5" />
          <strong className="hero-num">&lt;10</strong><span>MIN</span>
          <div className="rs-lap"><i /></div>
        </div>
        <div className="rs-finish-line" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
      </section>
    );
  }

  return (
    <section className="rs-scene rs-multiplier">
      <Kicker>SKILLS AGENT · FINAL LAP</Kicker>
      <div className="rs-three-min">
        <span>SKILLS AGENT</span>
        <strong className="hero-num">~3</strong>
        <em>MIN</em>
      </div>
      <div className="rs-collapse-track" aria-hidden="true"><i /><b /><span /></div>
      <div className="rs-times"><small>APPROX.</small><strong className="hero-num">4×</strong><span>FASTER</span></div>
    </section>
  );
}
