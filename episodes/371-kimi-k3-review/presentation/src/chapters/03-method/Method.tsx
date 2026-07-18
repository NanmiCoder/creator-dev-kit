import type { ChapterStepProps } from "../../registry/types";
import "./Method.css";

const ASSET = `${import.meta.env.BASE_URL}assets/`;

function PipelineRail() {
  return (
    <div className="mt-pipeline" aria-hidden="true">
      <span className="mt-pipeline-line" />
      <i /><i /><i /><i />
      <b />
    </div>
  );
}

function CodeSheet() {
  return (
    <div className="mt-code-sheet" aria-label="匿名代码示意">
      <div className="mt-code-line mt-code-line-wide"><span /></div>
      <div className="mt-code-line"><span /></div>
      <div className="mt-code-line mt-code-line-mid"><span /></div>
      <div className="mt-code-line mt-code-line-short"><span /></div>
      <div className="mt-redaction mt-redaction-one" />
      <div className="mt-redaction mt-redaction-two" />
      <div className="mt-redaction mt-redaction-three" />
    </div>
  );
}

export default function Method({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="mt-scene mt-rules">
        <span className="mt-kicker">TEST PROTOCOL</span>
        <div className="mt-rules-copy">
          <span>还是老规矩</span>
          <strong>证据先行</strong>
        </div>
        <PipelineRail />
        <div className="mt-protocol-stamp"><i />PROTOCOL READY</div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="mt-scene mt-anonymous">
        <span className="mt-kicker">GATE 01 · SOURCE IDENTITY</span>
        <CodeSheet />
        <div className="mt-gate-copy">
          <span>01</span>
          <strong>代码匿名</strong>
          <em>IDENTITY REMOVED</em>
        </div>
        <div className="mt-scan-line" aria-hidden="true" />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="mt-scene mt-runtime">
        <span className="mt-kicker">GATE 02 · REAL RUNTIME</span>
        <div className="mt-runtime-core">
          <div className="mt-power-switch"><i /></div>
          <div className="mt-runtime-copy">
            <span>02</span>
            <strong>真实启动</strong>
            <em>PROCESS ACTIVE</em>
          </div>
        </div>
        <div className="mt-signal" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="mt-scene mt-tests">
        <span className="mt-kicker">GATE 03 · TEST EXECUTION</span>
        <div className="mt-test-copy">
          <span>03</span>
          <strong>真实跑测试</strong>
          <em>RUN · OBSERVE · VERIFY</em>
        </div>
        <div className="mt-test-matrix" aria-label="测试执行状态矩阵">
          {Array.from({ length: 16 }, (_, index) => <i key={index} />)}
          <b />
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="mt-scene mt-review">
        <span className="mt-kicker">GATE 04 · INDEPENDENT CODE REVIEW</span>

        <div className="mt-review-source">
          <div className="mt-source-lines"><i /><i /><i /><i /></div>
          <strong>匿名代码</strong>
        </div>

        <div className="mt-review-rail mt-review-rail-top" aria-hidden="true"><i /></div>
        <div className="mt-review-rail mt-review-rail-bottom" aria-hidden="true"><i /></div>

        <div className="mt-review-agent mt-review-codex">
          <div><img src={`${ASSET}openai.svg`} alt="OpenAI" /></div>
          <span>CODEX</span>
          <em>REVIEW A</em>
        </div>
        <div className="mt-review-agent mt-review-sol">
          <div><img src={`${ASSET}openai.svg`} alt="OpenAI" /></div>
          <span>GPT-5.6 SOL</span>
          <em>REVIEW B</em>
        </div>

        <div className="mt-review-merge" aria-hidden="true"><i /><i /></div>
        <div className="mt-review-report">
          <span>MULTI-AGENT CROSS REVIEW</span>
          <strong>代码质量</strong>
          <div><i />EVIDENCE MERGED</div>
        </div>
      </section>
    );
  }

  return null;
}
