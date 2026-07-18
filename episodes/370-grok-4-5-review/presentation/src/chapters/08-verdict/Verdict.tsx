import type { ChapterStepProps } from "../../registry/types";
import "./Verdict.css";

const A = `${import.meta.env.BASE_URL}assets/`;

function Kicker({ children }: { children: string }) {
  return <div className="vd-kicker">{children}</div>;
}

function Brand({ logo, label }: { logo: string; label: string }) {
  return <div className="vd-brand"><img src={`${A}${logo}`} alt="" /><strong>{label}</strong></div>;
}

export default function Verdict({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="vd-scene vd-choice">
        <Kicker>FINAL DECISION</Kicker>
        <div className="vd-choice-core"><span>你的起点</span><strong>怎么选</strong></div>
        <div className="vd-choice-card is-member"><i>X</i><div><span>ALREADY</span><strong>已有会员</strong></div></div>
        <div className="vd-choice-card is-none"><i>—</i><div><span>NO PLAN</span><strong>没有订阅</strong></div></div>
        <svg className="vd-choice-lines" viewBox="0 0 1500 620" aria-hidden="true"><path d="M750 305 C540 305 555 64 410 64 M750 305 C960 305 1000 594 1090 594" /></svg>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="vd-scene vd-passport">
        <Kicker>PATH A · X MEMBER</Kicker>
        <div className="vd-pass">
          <div className="vd-pass-x">X</div>
          <div className="vd-pass-copy"><span>MEMBERSHIP</span><strong>ACTIVE</strong><i><b /></i></div>
        </div>
        <div className="vd-plug-line"><i /><b /><i /></div>
        <div className="vd-grok-slot"><Brand logo="xai.svg" label="GROK 4.5" /><span>TOOLCHAIN</span></div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="vd-scene vd-coordinate">
        <Kicker>TASK FIT</Kicker>
        <div className="vd-axis-y"><span>速度优先</span><i /></div>
        <div className="vd-axis-x"><i /><span>任务复杂度</span></div>
        <div className="vd-fit-zone"><span>GROK 4.5</span><strong>轻复杂度</strong><b>快速执行</b></div>
        <div className="vd-fit-dot"><i /></div>
        <div className="vd-complex-label is-low">LIGHT</div><div className="vd-complex-label is-high">COMPLEX</div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="vd-scene vd-gate">
        <Kicker>PATH B · NO SUBSCRIPTION</Kicker>
        <div className="vd-gate-card">
          <Brand logo="xai.svg" label="GROK 4.5" />
          <div className="vd-gate-lock"><span>NEW PLAN</span><strong>?</strong></div>
          <i className="vd-gate-bar" />
        </div>
        <div className="vd-gate-answer"><span>仅为一个模型</span><strong>不建议新开</strong></div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="vd-scene vd-codex">
        <Kicker>MY DEFAULT ROUTE</Kicker>
        <div className="vd-route-old"><Brand logo="xai.svg" label="GROK" /><i /></div>
        <div className="vd-route-track"><span /><span /><span /><b /></div>
        <div className="vd-codex-card">
          <Brand logo="openai.svg" label="CODEX" />
          <strong>主路径</strong>
        </div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="vd-scene vd-sol">
        <Kicker>CODEX · MODEL CORE</Kicker>
        <div className="vd-sol-orbit"><span>CODEX</span><i /><b /></div>
        <img src={`${A}openai.svg`} alt="OpenAI" />
        <div className="vd-sol-name"><span>GPT</span><strong className="hero-num">5.6</strong><b>SOL</b></div>
        <div className="vd-sol-scan"><i /><i /><i /><i /></div>
      </section>
    );
  }

  if (step === 6) {
    return (
      <section className="vd-scene vd-reset">
        <Kicker>USAGE RHYTHM</Kicker>
        <div className="vd-reset-dial">
          <svg viewBox="0 0 420 420" aria-hidden="true"><circle cx="210" cy="210" r="168" /><path d="M210 42 A168 168 0 1 1 72 305" /></svg>
          <div><strong className="hero-num">2–3</strong><span>DAYS</span></div>
          <i />
        </div>
        <div className="vd-quota">
          <span>RESET CYCLE</span><strong>额度充足</strong>
          <div>{Array.from({ length: 8 }, (_, index) => <i style={{ "--vd-i": index } as React.CSSProperties} key={index} />)}</div>
        </div>
      </section>
    );
  }

  if (step === 7) {
    return (
      <section className="vd-scene vd-balance">
        <Kicker>SPEED × QUALITY</Kicker>
        <div className="vd-balance-beam"><i /><b /></div>
        <div className="vd-balance-side is-speed"><span>SPEED</span><strong>慢一点</strong><div><i /></div></div>
        <div className="vd-balance-side is-quality"><span>QUALITY</span><strong>质量更高</strong><div><i /></div></div>
        <div className="vd-balance-pivot">CODEX</div>
      </section>
    );
  }

  return (
    <section className="vd-scene vd-outro">
      <Kicker>FINAL MAP</Kicker>
      <div className="vd-outro-path is-x"><span>X MEMBER</span><Brand logo="xai.svg" label="GROK" /><strong>快速任务</strong></div>
      <div className="vd-outro-path is-codex"><span>DEFAULT</span><Brand logo="openai.svg" label="CODEX" /><strong>质量主路</strong></div>
      <div className="vd-outro-rule"><i /><b /></div>
      <div className="vd-outro-bye"><span>RELAKKES · 阿江</span><strong>我们下期见</strong></div>
    </section>
  );
}
