import type { ChapterStepProps } from "../../registry/types";
import "./Auth.css";

function Kicker({ children }: { children: string }) {
  return <div className="au-kicker">{children}</div>;
}

function ApiGrid() {
  return (
    <div className="au-api-grid" aria-label="12 API delivered">
      {Array.from({ length: 12 }, (_, index) => (
        <div className="au-api-cell" style={{ "--au-i": index } as React.CSSProperties} key={index}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>ENDPOINT</strong>
          <i />
        </div>
      ))}
    </div>
  );
}

function AuthCore({ mode }: { mode: "local" | "oauth" | "ownership" }) {
  const local = mode === "local";
  const oauth = mode === "oauth";
  return (
    <div className={`au-core-map is-${mode}`}>
      <div className="au-core-ring"><span>AUTH</span><strong>CORE</strong></div>
      <div className={`au-core-node au-node-email ${local ? "is-active" : ""}`}><i>@</i><span>EMAIL</span></div>
      <div className={`au-core-node au-node-reset ${local ? "is-active" : ""}`}><i>↻</i><span>RESET</span></div>
      <div className={`au-core-node au-node-token ${local ? "is-active" : ""}`}><i>2</i><span>DUAL TOKEN</span></div>
      <div className={`au-core-node au-node-github ${oauth ? "is-active" : ""}`}><i>GH</i><span>GITHUB</span></div>
      <div className={`au-core-node au-node-google ${oauth ? "is-active" : ""}`}><i>G</i><span>GOOGLE</span></div>
      <div className={`au-core-node au-node-owner ${!local && !oauth ? "is-active" : ""}`}><i>ID</i><span>OWNERSHIP</span></div>
      <svg className="au-core-lines" viewBox="0 0 900 620" aria-hidden="true">
        <path d="M450 310 L150 105 M450 310 L115 310 M450 310 L165 525 M450 310 L740 120 M450 310 L790 330 M450 310 L710 530" />
      </svg>
    </div>
  );
}

function Matrix() {
  return (
    <div className="au-matrix-grid">
      {Array.from({ length: 32 }, (_, index) => (
        <span className={index >= 29 ? "is-gap" : "is-pass"} style={{ "--au-i": index } as React.CSSProperties} key={index}>
          {index >= 29 ? "×" : ""}
        </span>
      ))}
    </div>
  );
}

export default function Auth({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="au-scene au-repo">
        <Kicker>PROJECT A · AUTH MIGRATION</Kicker>
        <div className="au-repo-window">
          <div className="au-repo-rail"><span /><span /><span /><i /></div>
          <div className="au-repo-copy">
            <span>GROK 4.5</span>
            <strong>直接动手</strong>
            <div className="au-repo-command"><i>01</i><b>AUTH MIGRATION</b><em>RUNNING · 12 ENDPOINTS</em></div>
          </div>
          <div className="au-repo-wave" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <span style={{ "--au-i": i } as React.CSSProperties} key={i} />)}</div>
        </div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="au-scene au-api">
        <Kicker>DELIVERY MAP</Kicker>
        <div className="au-api-hero"><strong className="hero-num">12</strong><div><span>/ 12</span><b>API</b></div></div>
        <ApiGrid />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="au-scene au-capability">
        <Kicker>LOCAL AUTH LAYER</Kicker>
        <AuthCore mode="local" />
        <div className="au-capability-caption"><span>邮箱验证</span><span>密码重置</span><span>双 TOKEN</span></div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="au-scene au-capability au-oauth">
        <Kicker>FEDERATED LOGIN</Kicker>
        <AuthCore mode="oauth" />
        <div className="au-oauth-gate"><span>GITHUB</span><i /> <strong>AUTH CORE</strong> <i /><span>GOOGLE</span></div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="au-scene au-complete">
        <Kicker>FUNCTION COVERAGE</Kicker>
        <div className="au-complete-map">
          <div className="au-user-node"><span>USER A</span><i /></div>
          <div className="au-task-stack"><span>TASK OWNERSHIP</span><i /><i /><i /></div>
          <div className="au-landing-node"><span>PUBLIC</span><strong>LANDING</strong></div>
          <svg viewBox="0 0 920 360" aria-hidden="true"><path d="M110 180 H330 M590 180 H810" /></svg>
        </div>
        <div className="au-complete-score"><span>功能完整性</span><strong className="hero-num">10.0</strong><i><b /></i></div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="au-scene au-boundary">
        <Kicker>SECURITY BOUNDARY</Kicker>
        <div className="au-boundary-field">
          <span className="au-boundary-user">USER</span>
          <i className="au-boundary-wall" />
          <span className="au-boundary-data">PRIVATE DATA</span>
          <b className="au-boundary-crack" aria-hidden="true" />
          <strong>边界<br />失守</strong>
        </div>
      </section>
    );
  }

  if (step === 6) {
    return (
      <section className="au-scene au-matrix">
        <Kicker>UNIFIED AUTH MATRIX</Kicker>
        <div className="au-matrix-copy"><strong className="hero-num">32</strong><span>CHECKS</span></div>
        <Matrix />
        <div className="au-matrix-result"><div><b>29</b><span>PASS</span></div><i /><div className="is-gap"><b>3</b><span>GAPS</span></div></div>
      </section>
    );
  }

  if (step === 7) {
    return (
      <section className="au-scene au-state">
        <Kicker>GAP 01 · OAUTH CALLBACK</Kicker>
        <div className="au-state-flow">
          <div><span>CALLBACK</span><b>? code=...</b></div>
          <i className="au-state-arrow" />
          <div className="au-state-missing"><span>STATE</span><strong>MISSING</strong></div>
          <i className="au-state-arrow" />
          <div className="au-state-success"><span>RESPONSE</span><strong>200</strong></div>
        </div>
        <div className="au-state-verdict"><span>应该拒绝</span><i /><strong>却显示成功</strong></div>
      </section>
    );
  }

  if (step === 8) {
    return (
      <section className="au-scene au-idor">
        <Kicker>GAP 02 · OBJECT OWNERSHIP</Kicker>
        <div className="au-idor-users"><div className="is-a">A</div><div className="is-b">B</div></div>
        <div className="au-idor-vault">
          <span>LEGACY TASK</span><strong>owner: NULL</strong><i>UNCLAIMED</i>
        </div>
        <svg className="au-idor-path" viewBox="0 0 1500 600" aria-hidden="true">
          <path d="M240 225 C600 20 900 40 1235 300" />
          <path d="M240 430 C600 530 920 500 1235 330" />
        </svg>
        <div className="au-idor-alert"><span>USER A / B</span><strong>都能读取无归属旧任务</strong></div>
      </section>
    );
  }

  return (
    <section className="au-scene au-refresh">
      <Kicker>GAP 03 · CONCURRENT REFRESH</Kicker>
      <div className="au-refresh-fork">
        <div className="au-refresh-old">TOKEN<small>OLD</small></div>
        <i className="au-refresh-line is-top" /><i className="au-refresh-line is-bottom" />
        <div className="au-refresh-new is-one">NEW<small>#1</small></div>
        <div className="au-refresh-new is-two">NEW<small>#2</small></div>
      </div>
      <div className="au-refresh-score"><span>SECURITY</span><strong className="hero-num">5.5</strong><i><b /></i></div>
      <div className="au-refresh-stamp">并发刷新 · 双后继 TOKEN</div>
    </section>
  );
}
