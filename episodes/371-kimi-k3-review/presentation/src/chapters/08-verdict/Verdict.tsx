import type { ChapterStepProps } from "../../registry/types";
import "./Verdict.css";

const ASSET = `${import.meta.env.BASE_URL}assets/`;

function PlanEvidence() {
  return (
    <div className="vd-plan-shot" aria-label="Kimi Allegretto 199 元套餐截图局部">
      <img src={`${ASSET}subscription-sanitized.png`} alt="Kimi 订阅页面中的 Allegretto 199 元套餐" />
      <span>当前订阅</span>
    </div>
  );
}

function SessionLane({ index, delay }: { index: string; delay: string }) {
  return (
    <div className="vd-session-lane" style={{ "--lane-delay": delay } as React.CSSProperties}>
      <span>SESSION {index}</span>
      <div><i /></div>
      <strong>COMPLETE</strong>
    </div>
  );
}

function FeedbackNode({ className }: { className: string }) {
  return <i className={`vd-feedback-node ${className}`} aria-hidden="true" />;
}

export default function Verdict({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="vd-scene vd-plan">
        <div className="vd-plan-copy">
          <span className="vd-kicker">SUBSCRIPTION · ALLEGRETTO</span>
          <div className="vd-price"><b>¥</b><strong className="hero-num">199</strong><em>/ 月</em></div>
          <h1>额度相对偏低</h1>
          <div className="vd-plan-rule"><i /></div>
        </div>
        <PlanEvidence />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="vd-scene vd-quota">
        <div className="vd-quota-left">
          <span className="vd-kicker">REAL TEST · TWO CONVERSATIONS</span>
          <strong className="hero-num">2</strong>
          <h1>两个对话</h1>
        </div>
        <div className="vd-session-stack">
          <SessionLane index="01" delay="0.18s" />
          <SessionLane index="02" delay="0.82s" />
        </div>
        <div className="vd-quota-gate">
          <div className="vd-quota-dial"><i /><b /></div>
          <span>额度</span>
          <strong>已用满</strong>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="vd-scene vd-feedback">
        <div className="vd-feedback-field" aria-hidden="true">
          <span className="vd-feedback-ring vd-ring-one" />
          <span className="vd-feedback-ring vd-ring-two" />
          <FeedbackNode className="vd-node-a" />
          <FeedbackNode className="vd-node-b" />
          <FeedbackNode className="vd-node-c" />
          <FeedbackNode className="vd-node-d" />
          <FeedbackNode className="vd-node-e" />
          <FeedbackNode className="vd-node-f" />
          <div className="vd-feedback-signal"><i /><i /><i /><i /></div>
        </div>
        <div className="vd-feedback-copy">
          <span className="vd-kicker">KIMI 官方用户群</span>
          <h1>有用户反馈</h1>
          <strong>额度偏低</strong>
          <p>本页为抽象反馈信号，非群聊截图</p>
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="vd-scene vd-multimodal">
        <div className="vd-capability vd-cap-code">
          <span>CODE</span>
          <div className="vd-code-glyph" aria-hidden="true"><i /><i /><i /><i /></div>
          <strong>编程能力</strong>
        </div>
        <div className="vd-capability vd-cap-vision">
          <span>VISION</span>
          <div className="vd-vision-glyph" aria-hidden="true"><i /><b /></div>
          <strong>图像理解</strong>
        </div>
        <div className="vd-flow vd-flow-code" aria-hidden="true"><i /></div>
        <div className="vd-flow vd-flow-vision" aria-hidden="true"><i /></div>
        <div className="vd-k3-core">
          <img src={`${ASSET}kimi.png`} alt="Kimi" />
          <strong>K3</strong>
        </div>
        <div className="vd-native-lock">
          <span>NATIVE</span>
          <strong>原生多模态</strong>
          <em>这一点很关键</em>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="vd-scene vd-alternative">
        <div className="vd-alt-context">
          <span className="vd-kicker">BASED ON TWO REAL PROJECTS</span>
          <strong>国产能力</strong>
        </div>
        <div className="vd-alt-bridge" aria-hidden="true">
          <span /><i />
          <div className="vd-alt-car"><img src={`${ASSET}kimi.png`} alt="" /></div>
        </div>
        <div className="vd-alt-result">
          <span>现实替代</span>
          <h1>有望成为<br />国外模型的替代选项</h1>
          <strong>国产模型的顶级选手</strong>
        </div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="vd-scene vd-outro">
        <div className="vd-outro-orbit" aria-hidden="true"><i /><i /></div>
        <div className="vd-outro-lockup">
          <img src={`${ASSET}kimi.png`} alt="Kimi" />
          <div><span>KIMI</span><strong>K3</strong></div>
        </div>
        <div className="vd-outro-line"><i /></div>
        <div className="vd-signoff">
          <strong>我是阿江</strong>
          <span>下期见</span>
        </div>
      </section>
    );
  }

  return null;
}
