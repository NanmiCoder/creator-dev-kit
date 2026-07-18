import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Hook.css";

/**
 * Chapter 01 · hook — Vibe Coding 后遗症
 * 6 步 / ~25 秒。每句话一个画面,跨步即切屏。
 *
 * 节拍(每步独立 .hk-screen-N 屏):
 *   step 0 — masthead + 居中 hero「很扎心」+ V2EX 数据
 *   step 1 — 客服 Agent hero + 替代目标(大时间线 + 在线/电话 pill)
 *   step 2 — 团队构成(3 虚线空缺 + Java/前端 实 tag,大警告"无 AI 工程师")
 *   step 3 — Codex hero + 进度条 + LEARNING & SHIPPING 状态
 *   step 4 — v1 上线(大对勾 + v1.0 SHIPPED)
 *   step 5 — 问题开始爆(alert 闪烁 · 1.6s 反转)
 *
 * 颜色 / 字体全走 midnight-press token;字号固定 px;动画用 transform + opacity;
 * 不用 vw;不用 setTimeout;每步动画时长 ≤ 对应 mp3 时长。
 */
export default function HookChapter({ step }: ChapterStepProps) {
  /* ─── step 0 · 钩子 · masthead + 居中 hero「很扎心」+ V2EX 数据 ─── */
  if (step === 0) {
    return (
      <div className="hk-scene">
        <div className="hk-masthead">
          <span className="hk-brand serif-it">Vibe Coding 后遗症</span>
          <span className="hk-issue mono">NO. 367 · 2026.07.02</span>
        </div>
        <hr className="rule hk-rule" />

        <div className="hk-cover">
          <div className="hk-kicker">
            <span className="dot-accent" />
            <span className="mono">FROM V2EX · POST #1224558</span>
          </div>

          <h1 className="hk-h1">
            <MaskReveal show duration={900}>
              <span className="serif-it hk-em">这两天</span>
            </MaskReveal>
            <MaskReveal show delay={220} duration={900}>
              <span className="serif-cn">V2EX</span>
            </MaskReveal>
            <MaskReveal show delay={440} duration={900}>
              <span className="serif-cn">有个帖子</span>
            </MaskReveal>
            <MaskReveal show delay={680} duration={1100}>
              <span className="serif-it hk-em">很扎心</span>
            </MaskReveal>
          </h1>

          <div className="hk-meta">
            <div className="hk-meta-cell">
              <span className="hk-meta-num mono">5,039</span>
              <span className="hk-meta-lbl mono">VIEWS</span>
            </div>
            <div className="hk-meta-sep" />
            <div className="hk-meta-cell">
              <span className="hk-meta-num mono">92</span>
              <span className="hk-meta-lbl mono">REPLIES</span>
            </div>
            <div className="hk-meta-sep" />
            <div className="hk-meta-cell">
              <span className="hk-meta-num mono">01</span>
              <span className="hk-meta-lbl mono">THANKS</span>
            </div>
          </div>
        </div>

        <div className="hk-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 01 / 06 · HOOK
        </div>
      </div>
    );
  }

  /* ─── step 1 · 客服 Agent + 替代目标 ─── */
  if (step === 1) {
    return (
      <div className="hk-scene">
        <div className="hk-masthead">
          <span className="hk-brand serif-it">Vibe Coding 后遗症</span>
          <span className="hk-issue mono">NO. 367 · THE SUBJECT</span>
        </div>
        <hr className="rule hk-rule" />

        <div className="hk-target">
          <div className="hk-target-time">
            <div className="hk-time-lbl mono">// TIMELINE · 2026</div>
            <div className="hk-time-axis">
              <span className="hk-time-node hk-time-node-start">
                <span className="hk-time-dot hk-time-dot-done" />
                <span className="hk-time-txt mono">Q1 · START</span>
              </span>
              <span className="hk-time-seg">
                <span className="hk-time-line" />
              </span>
              <span className="hk-time-node">
                <span className="hk-time-dot" />
                <span className="hk-time-txt mono">Q2</span>
              </span>
              <span className="hk-time-seg hk-time-seg-pending">
                <span className="hk-time-line hk-time-line-pending" />
              </span>
              <span className="hk-time-node hk-time-node-pending">
                <span className="hk-time-dot" />
                <span className="hk-time-txt mono">Q3 · ?</span>
              </span>
            </div>
          </div>

          <div className="hk-target-hero">
            <h2 className="hk-h2 hk-h2-xl">
              <MaskReveal show duration={900}>
                <span className="serif-cn">客服</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={1100}>
                <span className="serif-it hk-em">Agent</span>
              </MaskReveal>
            </h2>

            <div className="hk-target-pills">
              <span className="mono hk-target-pre">想替代</span>
              <MaskReveal show delay={1500} duration={700}>
                <span className="hk-target-pill">
                  <span className="dot-accent" />
                  &nbsp;在线客服
                </span>
              </MaskReveal>
              <span className="serif-it hk-target-amp">&amp;</span>
              <MaskReveal show delay={2700} duration={700}>
                <span className="hk-target-pill">
                  <span className="dot-accent" />
                  &nbsp;电话客服
                </span>
              </MaskReveal>
            </div>
          </div>
        </div>

        <div className="hk-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 01 / 06 · THE SUBJECT
        </div>
      </div>
    );
  }

  /* ─── step 2 · 团队构成 · 3 虚线空缺 + Java/前端 实 tag ─── */
  if (step === 2) {
    return (
      <div className="hk-scene">
        <div className="hk-masthead">
          <span className="hk-brand serif-it">Vibe Coding 后遗症</span>
          <span className="hk-issue mono">NO. 367 · THE TEAM</span>
        </div>
        <hr className="rule hk-rule" />

        <div className="hk-team">
          <div className="hk-team-hero">
            <div className="hk-kicker">
              <span className="dot-accent" />
              <span className="mono">// THE GAP</span>
            </div>
            <h2 className="hk-h2 hk-h2-lg">
              <MaskReveal show duration={900}>
                <span className="serif-cn">团队里</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={900}>
                <span className="serif-it hk-em">没有</span>
              </MaskReveal>
            </h2>
            <h3 className="hk-h3-warning">
              <MaskReveal show delay={900} duration={1000}>
                <span className="serif-it hk-em">AI Agent</span>
              </MaskReveal>
              <MaskReveal show delay={1400} duration={900}>
                <span className="serif-cn">&nbsp;工程师</span>
              </MaskReveal>
            </h3>
          </div>

          <div className="hk-team-roles">
            <div className="hk-role hk-role-empty">
              <span className="hk-role-num mono">01</span>
              <span className="hk-role-lbl mono">AI Agent Eng.</span>
              <span className="hk-role-tag mono">VACANT</span>
            </div>
            <div className="hk-role hk-role-empty">
              <span className="hk-role-num mono">02</span>
              <span className="hk-role-lbl mono">AI Agent Eng.</span>
              <span className="hk-role-tag mono">VACANT</span>
            </div>
            <div className="hk-role hk-role-empty">
              <span className="hk-role-num mono">03</span>
              <span className="hk-role-lbl mono">AI Agent Eng.</span>
              <span className="hk-role-tag mono">VACANT</span>
            </div>
            <div className="hk-role hk-role-filled">
              <span className="hk-role-num mono">04</span>
              <span className="hk-role-lbl mono">BACKEND</span>
              <span className="hk-role-tag hk-role-tag-name">Java</span>
            </div>
            <div className="hk-role hk-role-filled">
              <span className="hk-role-num mono">05</span>
              <span className="hk-role-lbl mono">FRONTEND</span>
              <span className="hk-role-tag hk-role-tag-name">前端</span>
            </div>
          </div>
        </div>

        <div className="hk-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 01 / 06 · THE TEAM
        </div>
      </div>
    );
  }

  /* ─── step 3 · Codex 赶工 ─── */
  if (step === 3) {
    return (
      <div className="hk-scene">
        <div className="hk-masthead">
          <span className="hk-brand serif-it">Vibe Coding 后遗症</span>
          <span className="hk-issue mono">NO. 367 · THE RUSH</span>
        </div>
        <hr className="rule hk-rule" />

        <div className="hk-rush">
          <div className="hk-rush-hero">
            <div className="hk-kicker">
              <span className="dot-accent" />
              <span className="mono">// THE WORKFLOW</span>
            </div>
            <h2 className="hk-h2 hk-h2-lg">
              <MaskReveal show duration={700}>
                <span className="serif-cn">一边学 ·</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={1000}>
                <span className="serif-it hk-em">Codex</span>
              </MaskReveal>
            </h2>
            <p className="hk-rush-sub">
              <MaskReveal show delay={1100} duration={800}>
                <span className="serif-cn">一边</span>
              </MaskReveal>
              <MaskReveal show delay={1400} duration={800}>
                <span className="serif-it hk-em">赶进度</span>
              </MaskReveal>
            </p>
          </div>

          <div className="hk-rush-panel">
            <div className="hk-rush-stat">
              <span className="mono hk-rush-stat-lbl">// STATUS</span>
              <span className="mono hk-rush-stat-val">
                <span className="dot-accent" />
                &nbsp;LEARNING &amp; SHIPPING
              </span>
            </div>
            <div className="hk-rush-progress">
              <span className="mono hk-rush-progress-lbl">// PROGRESS</span>
              <span className="hk-rush-progress-bar">
                <span className="hk-rush-progress-fill" />
              </span>
            </div>
          </div>
        </div>

        <div className="hk-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 01 / 06 · THE RUSH
        </div>
      </div>
    );
  }

  /* ─── step 4 · v1 上线(大对勾 + v1.0 SHIPPED) ─── */
  if (step === 4) {
    return (
      <div className="hk-scene">
        <div className="hk-masthead">
          <span className="hk-brand serif-it">Vibe Coding 后遗症</span>
          <span className="hk-issue mono">NO. 367 · T + MONTHS</span>
        </div>
        <hr className="rule hk-rule" />

        <div className="hk-ship">
          <div className="hk-ship-tick">
            <div className="hk-tick-circle">
              <span className="serif-it hk-tick-mark">✓</span>
            </div>
            <span className="hk-tick-glow" />
          </div>

          <div className="hk-ship-body">
            <div className="hk-kicker">
              <span className="dot-accent" />
              <span className="mono">v1.0 · SHIPPED</span>
            </div>
            <h2 className="hk-h2 hk-h2-lg">
              <MaskReveal show duration={700}>
                <span className="serif-cn">第一版</span>
              </MaskReveal>
              <MaskReveal show delay={250} duration={900}>
                <span className="serif-it hk-em">上线了</span>
              </MaskReveal>
            </h2>
            <p className="hk-ship-sub mono">
              <span className="dot-accent" />
              &nbsp;T + 几个月 · 客服 Agent v1
            </p>
          </div>
        </div>

        <div className="hk-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 01 / 06 · SHIPPED
        </div>
      </div>
    );
  }

  /* ─── step 5 · 问题开始爆(1.6s 反转) ─── */
  return (
    <div className="hk-scene hk-climax">
      <div className="hk-masthead">
        <span className="hk-brand serif-it">Vibe Coding 后遗症</span>
        <span className="hk-issue mono">NO. 367 · TURNING POINT</span>
      </div>
      <hr className="rule hk-rule" />

      <div className="hk-climax-body">
        <div className="hk-climax-status">
          <span className="hk-climax-dot hk-climax-dot-alert" />
          <span className="mono hk-climax-lbl">// ALERT · CRITICAL</span>
        </div>

        <h2 className="hk-climax-h">
          <MaskReveal show delay={200} duration={700}>
            <span className="serif-cn">然后</span>
          </MaskReveal>
          <MaskReveal show delay={500} duration={900}>
            <span className="serif-it hk-em">问题开始爆</span>
          </MaskReveal>
        </h2>
      </div>

      <div className="hk-foot mono">
        <span className="dot-accent" />
        &nbsp;CHAPTER 01 / 06 · END · NEXT: SHOCK
      </div>
    </div>
  );
}