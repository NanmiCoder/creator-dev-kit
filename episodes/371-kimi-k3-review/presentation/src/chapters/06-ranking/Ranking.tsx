import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./Ranking.css";

const ASSET = `${import.meta.env.BASE_URL}assets/`;

type Model = {
  rank: string;
  name: string;
  score: string;
  logo: string;
  logoClass?: string;
};

const MODELS: Model[] = [
  { rank: "01", name: "CLAUDE OPUS 4.8", score: "8.86", logo: "anthropic.svg" },
  { rank: "02", name: "GPT-5.5", score: "8.62", logo: "openai.svg" },
  { rank: "03", name: "KIMI K3", score: "8.41", logo: "kimi.png", logoClass: "is-kimi" },
  { rank: "04", name: "GROK 4.5", score: "8.32", logo: "xai.svg" },
  { rank: "05", name: "GLM-5.2", score: "8.14", logo: "zhipu.svg", logoClass: "is-zhipu" },
];

function EmptyBoard() {
  return (
    <div className="rk-empty-board" aria-label="五个排名席位">
      {MODELS.map((model, index) => (
        <div className="rk-empty-row" key={model.rank} style={{ "--rk-i": index } as CSSProperties}>
          <span>{model.rank}</span><i /><b />
        </div>
      ))}
    </div>
  );
}

function RankingBoard({ current }: { current: number }) {
  return (
    <div className="rk-board">
      {MODELS.map((model, index) => {
        const state = index < current ? "is-past" : index === current ? "is-current" : "is-future";
        return (
          <div className={`rk-row ${state}`} key={model.rank}>
            <span className="rk-row-rank">{model.rank}</span>
            <span className={`rk-logo ${model.logoClass ?? ""}`}>
              <img src={`${ASSET}${model.logo}`} alt={`${model.name} logo`} />
            </span>
            <strong>{model.name}</strong>
            <em className="hero-num">{model.score}</em>
          </div>
        );
      })}
    </div>
  );
}

function RankReveal({ current }: { current: number }) {
  const model = MODELS[current];
  return (
    <section className="rk-scene rk-reveal">
      <div className="rk-rank-hero">
        <span>COMPOSITE RANK</span>
        <strong className="hero-num">#{model.rank}</strong>
        <div className="rk-rank-score">
          <i />
          <b className="hero-num">{model.score}</b>
          <em>FINAL SCORE</em>
        </div>
      </div>
      <RankingBoard current={current} />
    </section>
  );
}

function WeightDial({ complete }: { complete: boolean }) {
  return (
    <div className={`rk-weight-dial ${complete ? "is-complete" : ""}`}>
      <svg viewBox="0 0 420 420" aria-hidden="true">
        <circle className="rk-dial-track" cx="210" cy="210" r="164" />
        <circle className="rk-dial-auth" cx="210" cy="210" r="164" />
        {complete ? <circle className="rk-dial-web" cx="210" cy="210" r="164" /> : null}
      </svg>
      <div className="rk-dial-center"><strong className="hero-num">100</strong><span>COMPOSITE</span></div>
    </div>
  );
}

export default function Ranking({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="rk-scene rk-opening">
        <div className="rk-opening-copy">
          <span>FINAL BOARD</span>
          <strong>最后看<br />总榜</strong>
        </div>
        <div className="rk-opening-radar" aria-hidden="true">
          <i /><i /><i /><i /><i />
          <b>5</b>
          <span>MODELS</span>
        </div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="rk-scene rk-weight rk-weight-auth">
        <div className="rk-weight-copy">
          <span>PROJECT WEIGHT</span>
          <strong className="hero-num">60</strong>
          <em>%</em>
          <p>图片 Agent<br />+ 用户认证迁移</p>
        </div>
        <WeightDial complete={false} />
        <div className="rk-weight-rail"><i /><b>MAIN PROJECT</b></div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="rk-scene rk-weight rk-weight-complete">
        <div className="rk-weight-split">
          <div className="rk-weight-part is-auth"><strong className="hero-num">60</strong><span>图片 AGENT<br />认证迁移</span></div>
          <div className="rk-weight-plus">+</div>
          <div className="rk-weight-part is-web"><strong className="hero-num">40</strong><span>WEB AGENT</span></div>
        </div>
        <WeightDial complete />
        <div className="rk-total-lock"><i />100% LOCKED</div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="rk-scene rk-board-intro">
        <div className="rk-board-title">
          <span>2 PROJECTS · 5 MODELS</span>
          <strong>综合排名</strong>
          <em>同一提示词 · 同一评审标准</em>
        </div>
        <EmptyBoard />
      </section>
    );
  }

  if (step === 4) return <RankReveal current={0} />;
  if (step === 5) return <RankReveal current={1} />;
  if (step === 6) return <RankReveal current={2} />;
  if (step === 7) return <RankReveal current={3} />;
  if (step === 8) return <RankReveal current={4} />;

  if (step === 9) {
    return (
      <section className="rk-scene rk-scope">
        <div className="rk-scope-projects">
          <div className="rk-scope-project is-auth"><strong className="hero-num">60</strong><span>图片 AGENT<br />+ 认证迁移</span></div>
          <div className="rk-scope-link"><i /><b>真实项目</b><i /></div>
          <div className="rk-scope-project is-web"><strong className="hero-num">40</strong><span>WEB AGENT</span></div>
        </div>
        <div className="rk-scope-copy"><span>THIS RANKING REPRESENTS</span><strong>仅限这两个项目</strong></div>
      </section>
    );
  }

  if (step === 10) {
    return (
      <section className="rk-scene rk-boundary">
        <div className="rk-boundary-orbit" aria-hidden="true"><i /><i /><i /><i /><i /><b /></div>
        <div className="rk-boundary-copy"><span>BENCHMARK SCOPE</span><strong>两个真实项目</strong><i /><em>≠</em><b>模型全部能力</b></div>
      </section>
    );
  }

  return null;
}
