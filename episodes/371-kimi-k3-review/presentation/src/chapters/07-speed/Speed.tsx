import type { ChapterStepProps } from "../../registry/types";
import "./Speed.css";

const ASSET = `${import.meta.env.BASE_URL}assets/`;

function KimiMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`sp-kimi-mark${compact ? " is-compact" : ""}`}>
      <img src={`${ASSET}kimi.png`} alt="Kimi" />
      <span>KIMI K3</span>
    </div>
  );
}

function ChronoFace() {
  return (
    <div className="sp-chrono" aria-hidden="true">
      <span className="sp-chrono-ring" />
      <span className="sp-chrono-hand" />
      <i className="sp-chrono-center" />
      {Array.from({ length: 12 }, (_, index) => (
        <i className={`sp-chrono-tick sp-chrono-tick-${index}`} key={index} />
      ))}
    </div>
  );
}

export default function Speed({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="sp-scene sp-feel">
        <div className="sp-feel-radar" aria-hidden="true">
          <span /><span /><span />
          <i className="sp-feel-sweep" />
        </div>
        <div className="sp-feel-center">
          <KimiMark />
          <strong>相当顶</strong>
          <span className="sp-feel-caption">真实项目 · 实测体感</span>
        </div>
        <div className="sp-feel-signal" aria-hidden="true"><span /></div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="sp-scene sp-bottleneck">
        <div className="sp-bottleneck-copy">
          <span>INFERENCE</span>
          <strong>推理速度<br />比较慢</strong>
          <em>问题指向算力供给</em>
        </div>
        <div className="sp-pipeline" aria-label="算力供给形成的推理瓶颈示意图">
          <div className="sp-pipe-wide">
            <i /><i /><i /><i />
          </div>
          <div className="sp-pipe-neck"><span /></div>
          <div className="sp-pipe-output"><i /><i /></div>
          <div className="sp-compute-label">
            <span>COMPUTE</span>
            <strong>算力</strong>
          </div>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="sp-scene sp-grok-run">
        <div className="sp-grok-brand">
          <img src={`${ASSET}xai.svg`} alt="xAI" />
          <span>GROK 4.5</span>
        </div>
        <div className="sp-stopwatch">
          <span className="sp-stopwatch-label">TOTAL RUN TIME</span>
          <strong className="hero-num">10</strong>
          <em>MIN</em>
        </div>
        <div className="sp-project-race" aria-label="两个测试项目在十分钟内完成">
          <div className="sp-race-line">
            <span>PROJECT 01</span>
            <i className="sp-race-runner sp-runner-one" />
            <b>DONE</b>
          </div>
          <div className="sp-race-line">
            <span>PROJECT 02</span>
            <i className="sp-race-runner sp-runner-two" />
            <b>DONE</b>
          </div>
          <div className="sp-race-finish"><span>FINISH</span></div>
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="sp-scene sp-kimi-run">
        <div className="sp-baseline-memory">
          <img src={`${ASSET}xai.svg`} alt="xAI" />
          <span>GROK 4.5</span>
          <strong>10 MIN</strong>
        </div>
        <div className="sp-duration-divider" aria-hidden="true"><span /></div>
        <div className="sp-kimi-duration">
          <KimiMark compact />
          <strong className="hero-num">1H+</strong>
          <span>一个多小时</span>
        </div>
        <div className="sp-hour-dial">
          <ChronoFace />
          <div className="sp-card-limit">
            <span>BOTTLENECK</span>
            <strong>显卡</strong>
          </div>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="sp-scene sp-reputation">
        <div className="sp-reputation-stream sp-stream-local">
          <span>国内</span>
          <i /><i /><i />
        </div>
        <div className="sp-reputation-stream sp-stream-global">
          <span>国外</span>
          <i /><i /><i />
        </div>
        <div className="sp-reputation-core">
          <KimiMark compact />
          <strong>评价很高</strong>
        </div>
        <div className="sp-reputation-cut">
          <span>BUT</span>
          <strong>推理速度，仍是缺点</strong>
        </div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="sp-scene sp-final-choke">
        <div className="sp-final-lane" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className="sp-final-copy">
          <span>唯一反复出现的短板</span>
          <strong>推理慢</strong>
        </div>
        <div className="sp-final-wall">
          <span>ROOT CAUSE</span>
          <strong>缺卡</strong>
        </div>
      </section>
    );
  }

  return null;
}
