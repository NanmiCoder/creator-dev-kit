import type { ChapterStepProps } from "../../registry/types";
import "./Auth.css";

function ImageAgentMark() {
  return (
    <div className="au-image-agent" aria-hidden="true">
      <span /><span /><span /><span />
      <b>IMAGE AGENT</b>
    </div>
  );
}

function SystemLayers() {
  return (
    <div className="au-system-layers" aria-hidden="true">
      <span>FRONTEND</span>
      <span>BACKEND</span>
      <span>AUTH</span>
      <span>DATA</span>
    </div>
  );
}

function AuthCore() {
  return (
    <div className="au-auth-core" aria-hidden="true">
      <span /><span /><span />
      <b>AUTH</b>
    </div>
  );
}

export default function Auth({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="au-scene au-task">
        <span className="au-kicker">REAL PROJECT 01</span>
        <div className="au-task-content">
          <ImageAgentMark />
          <div className="au-task-rail" aria-hidden="true"><i /></div>
          <div className="au-task-copy">
            <span>不是新写一个登录页</span>
            <strong>认证迁移</strong>
            <em>把整套用户体系接进图片 Agent</em>
          </div>
        </div>
        <div className="au-login-only" aria-hidden="true">
          <span>SIMPLE LOGIN</span><i />
        </div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="au-scene au-reference">
        <span className="au-kicker">REFERENCE → UNDERSTAND → ADAPT</span>
        <div className="au-reference-content">
          <div className="au-reference-system card">
            <span>成熟参考项目</span>
            <strong>完整系统</strong>
            <SystemLayers />
          </div>
          <div className="au-reference-pipe" aria-hidden="true">
            <i /><i /><i />
            <b>读懂后迁移</b>
          </div>
          <div className="au-reference-target card">
            <ImageAgentMark />
            <strong>重新适配</strong>
            <span>图片生成项目</span>
          </div>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="au-scene au-explore">
        <span className="au-kicker">PARALLEL EXPLORATION</span>
        <div className="au-explore-copy">
          <strong>多个<br /><em>SubAgent</em></strong>
          <span>同时进入参考项目</span>
        </div>
        <div className="au-explore-map" aria-hidden="true">
          <svg viewBox="0 0 760 680">
            <path d="M110 110 L380 340 L650 110 M110 570 L380 340 L650 570" />
            <path d="M380 340 L380 95 M380 340 L380 585" />
          </svg>
          <div className="au-repo-core"><SystemLayers /></div>
          <span className="au-agent au-agent-a"><b>A</b>前端</span>
          <span className="au-agent au-agent-b"><b>B</b>后端</span>
          <span className="au-agent au-agent-c"><b>C</b>认证</span>
          <span className="au-agent au-agent-d"><b>D</b>数据</span>
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="au-scene au-providers">
        <span className="au-kicker">AUTHENTICATION MIGRATION</span>
        <div className="au-provider-copy">
          <strong>两条登录链路</strong>
          <span>迁入同一个认证核心</span>
        </div>
        <div className="au-provider-flow">
          <div className="au-provider-list">
            <div className="au-provider-card"><i>01</i><strong>GitHub</strong></div>
            <div className="au-provider-card"><i>02</i><strong>Google</strong></div>
          </div>
          <div className="au-provider-lines" aria-hidden="true"><span /><span /></div>
          <AuthCore />
          <div className="au-provider-output" aria-hidden="true"><span /><b>已接入图片 Agent</b></div>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="au-scene au-isolation">
        <span className="au-kicker">SESSION OWNERSHIP</span>
        <div className="au-isolation-heading">
          <strong>任务跟着用户走</strong>
          <span>不同用户的图片 Session 互不串线</span>
        </div>
        <div className="au-lanes" aria-hidden="true">
          <div className="au-lane au-lane-a">
            <b>USER A</b>
            <i className="au-user-dot" />
            <div className="au-session"><span /><span /><span /><em>SESSION A</em></div>
          </div>
          <div className="au-lane-gate"><span /><i /></div>
          <div className="au-lane au-lane-b">
            <b>USER B</b>
            <i className="au-user-dot" />
            <div className="au-session"><span /><span /><span /><em>SESSION B</em></div>
          </div>
        </div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="au-scene au-safety">
        <span className="au-kicker">SECURITY CHECK</span>
        <div className="au-safety-copy">
          <span>历史模型的扣分区</span>
          <strong>会登录<br />不等于<em>安全</em></strong>
        </div>
        <div className="au-safety-demo" aria-hidden="true">
          <div className="au-owner au-owner-a"><b>A</b><span>USER A</span></div>
          <div className="au-forbidden-route"><i /><strong>BLOCKED</strong></div>
          <div className="au-owner au-owner-b"><b>B</b><span>USER B · TASK</span></div>
          <div className="au-safety-wall"><span /><span /><span /><span /></div>
        </div>
      </section>
    );
  }

  if (step === 6) {
    return (
      <section className="au-scene au-result">
        <span className="au-kicker">PIC · AUTH MIGRATION</span>
        <div className="au-result-score">
          <span>图片 Agent 认证迁移</span>
          <strong className="hero-num">7.75</strong>
          <em>高完成度，但仍缺两块明确需求</em>
        </div>
        <div className="au-result-rank">
          <span>单项排名</span>
          <strong className="hero-num">03</strong>
          <em>第三</em>
          <div className="au-result-gaps"><i />邮箱验证<i />密码重置</div>
        </div>
        <div className="au-result-line" aria-hidden="true"><span /></div>
      </section>
    );
  }

  return null;
}
