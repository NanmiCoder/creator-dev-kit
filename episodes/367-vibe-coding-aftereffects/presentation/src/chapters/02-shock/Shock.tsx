import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Shock.css";

/**
 * Chapter 02 · shock — Vibe Coding 后遗症
 * 5 步 / ~38 秒。每句话一个画面,跨步即切屏。
 *
 * 节拍(每步独立 .sh-screen-N 屏):
 *   step 0 — 三栏症状并列(电话崩 / 沉默超时 / 人工救火),mono 数据角标 + stagger
 *   step 1 — 反差短屏:留白 + 大字「不是 bug 多」
 *   step 2 — pull-quote 引述 OP 原话,左红条 accent + 引用块滑入
 *   step 3 — 金句落点:大字「vibe coding 最大的后遗症」—— 中心 hero
 *   step 4 — 重新框定:三动词「理解 / 验证 / 维护」逐个揭示
 *
 * 颜色 / 字体全走 midnight-press token;字号固定 px;动画用 transform + opacity;
 * 不用 vw;不用 setTimeout;每步动画时长 ≤ 对应 mp3 时长。
 */
export default function ShockChapter({ step }: ChapterStepProps) {
  /* ─── step 0 · 三栏症状并列 · stagger ─── */
  if (step === 0) {
    return (
      <div className="sh-scene">
        <div className="sh-masthead">
          <span className="sh-brand serif-it">Vibe Coding 后遗症</span>
          <span className="sh-issue mono">NO. 367 · THE SYMPTOMS</span>
        </div>
        <hr className="rule sh-rule" />

        <div className="sh-kicker">
          <span className="dot-accent" />
          <span className="mono">// POST-LAUNCH · 三连击</span>
        </div>

        <div className="sh-symptoms">
          {/* ── 症状 1 · 电话线路 ── */}
          <div className="sh-symptom sh-symptom-1">
            <div className="sh-symptom-id">
              <span className="sh-symptom-num hero-num">01</span>
              <span className="mono sh-symptom-lbl">SYMPTOM · 01</span>
            </div>
            <div className="sh-symptom-sub">
              <MaskReveal show duration={700}>
                <span className="serif-cn">电话线路</span>
              </MaskReveal>
            </div>
            <div className="sh-symptom-issue">
              <MaskReveal show delay={600} duration={900}>
                <span className="serif-it sh-em">并发一高</span>
              </MaskReveal>
              <MaskReveal show delay={1300} duration={900}>
                <span className="serif-cn sh-em-cn">就</span>
              </MaskReveal>
              <MaskReveal show delay={1700} duration={900}>
                <span className="serif-it sh-em">崩</span>
              </MaskReveal>
            </div>
            <div className="sh-symptom-tag mono">
              <span className="dot-accent" />
              &nbsp;CRASH @ PEAK LOAD
            </div>
          </div>

          {/* ── 症状 2 · 在线 / 语音 ── */}
          <div className="sh-symptom sh-symptom-2">
            <div className="sh-symptom-id">
              <span className="sh-symptom-num hero-num">02</span>
              <span className="mono sh-symptom-lbl">SYMPTOM · 02</span>
            </div>
            <div className="sh-symptom-sub">
              <MaskReveal show delay={2400} duration={700}>
                <span className="serif-cn">在线 · 语音客服</span>
              </MaskReveal>
            </div>
            <div className="sh-symptom-issue sh-symptom-issue-stack">
              <MaskReveal show delay={2900} duration={800}>
                <span className="serif-it sh-em">沉默</span>
              </MaskReveal>
              <span className="sh-issue-sep mono">/</span>
              <MaskReveal show delay={3400} duration={800}>
                <span className="serif-it sh-em">超时</span>
              </MaskReveal>
              <span className="sh-issue-sep mono">/</span>
              <MaskReveal show delay={3900} duration={800}>
                <span className="serif-it sh-em">丢上下文</span>
              </MaskReveal>
            </div>
            <div className="sh-symptom-tag mono">
              <span className="dot-accent" />
              &nbsp;SILENT · TIMEOUT · DROP CTX
            </div>
          </div>

          {/* ── 症状 3 · 人工救火 ── */}
          <div className="sh-symptom sh-symptom-3">
            <div className="sh-symptom-id">
              <span className="sh-symptom-num hero-num">03</span>
              <span className="mono sh-symptom-lbl">SYMPTOM · 03</span>
            </div>
            <div className="sh-symptom-sub">
              <MaskReveal show delay={4500} duration={700}>
                <span className="serif-cn">人工客服</span>
              </MaskReveal>
            </div>
            <div className="sh-symptom-issue">
              <MaskReveal show delay={5200} duration={900}>
                <span className="serif-it sh-em">反过来</span>
              </MaskReveal>
              <MaskReveal show delay={6000} duration={900}>
                <span className="serif-cn">救火</span>
              </MaskReveal>
            </div>
            <div className="sh-symptom-tag mono">
              <span className="dot-accent" />
              &nbsp;HUMAN TAKEOVER · INVERTED
            </div>
          </div>

          <div className="sh-symptom-axis">
            <span className="mono sh-axis-lbl">// T0 · SHIPPED</span>
            <span className="sh-axis-arrow" />
            <span className="mono sh-axis-lbl">// T+ · MELTDOWN</span>
          </div>
        </div>

        <div className="sh-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 02 / 06 · SHOCK · SYMPTOMS
        </div>
      </div>
    );
  }

  /* ─── step 1 · 反差短屏 · 不是 bug 多 ─── */
  if (step === 1) {
    return (
      <div className="sh-scene sh-scene-bridge">
        <div className="sh-masthead">
          <span className="sh-brand serif-it">Vibe Coding 后遗症</span>
          <span className="sh-issue mono">NO. 367 · THE TWIST</span>
        </div>
        <hr className="rule sh-rule" />

        <div className="sh-bridge">
          <div className="sh-bridge-pre">
            <MaskReveal show duration={600}>
              <span className="mono">// 但这个帖子真正吓人的</span>
            </MaskReveal>
          </div>

          <h2 className="sh-bridge-h">
            <MaskReveal show delay={700} duration={900}>
              <span className="serif-cn">不是</span>
            </MaskReveal>
            <MaskReveal show delay={1100} duration={1100}>
              <span className="serif-it sh-em">bug 多</span>
            </MaskReveal>
          </h2>

          <div className="sh-bridge-strike mono">
            <span className="dot-accent" />
            &nbsp;// THE ACTUAL HORROR IS ELSEWHERE
          </div>
        </div>

        <div className="sh-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 02 / 06 · SHOCK · THE TWIST
        </div>
      </div>
    );
  }

  /* ─── step 2 · pull-quote 引述 OP · 左红条 accent ─── */
  if (step === 2) {
    return (
      <div className="sh-scene sh-scene-quote">
        <div className="sh-masthead">
          <span className="sh-brand serif-it">Vibe Coding 后遗症</span>
          <span className="sh-issue mono">NO. 367 · THE QUOTE</span>
        </div>
        <hr className="rule sh-rule" />

        <div className="sh-quote">
          <div className="sh-quote-meta">
            <span className="sh-quote-tag mono">
              <span className="dot-accent" />
              &nbsp;OP · V2EX #1224558
            </span>
            <span className="mono sh-quote-lbl">// 后补的那一句</span>
          </div>

          <div className="sh-quote-body">
            <span className="sh-quote-bar" aria-hidden="true" />
            <blockquote className="sh-quote-text">
              <MaskReveal show delay={400} duration={900}>
                <span className="serif-cn">现在这个项目</span>
              </MaskReveal>
              <MaskReveal show delay={1100} duration={900}>
                <span className="serif-it sh-em">脱离 AI</span>
              </MaskReveal>
              <MaskReveal show delay={1900} duration={900}>
                <span className="serif-cn">,已经</span>
              </MaskReveal>
              <MaskReveal show delay={2500} duration={1000}>
                <span className="serif-it sh-em">没人能看懂</span>
              </MaskReveal>
              <MaskReveal show delay={3400} duration={900}>
                <span className="serif-cn">,</span>
              </MaskReveal>
              <MaskReveal show delay={3700} duration={1000}>
                <span className="serif-it sh-em">没人能改了</span>
              </MaskReveal>
              <span className="serif-cn">。</span>
            </blockquote>
          </div>

          <div className="sh-quote-foot mono">
            <span className="sh-foot-rule" />
            &nbsp;— POST · 2026.07.02 · 92 REPLIES
          </div>
        </div>

        <div className="sh-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 02 / 06 · SHOCK · THE QUOTE
        </div>
      </div>
    );
  }

  /* ─── step 3 · 金句落点 · vibe coding 最大的后遗症 ─── */
  if (step === 3) {
    return (
      <div className="sh-scene sh-scene-punch">
        <div className="sh-masthead">
          <span className="sh-brand serif-it">Vibe Coding 后遗症</span>
          <span className="sh-issue mono">NO. 367 · THE LANDING</span>
        </div>
        <hr className="rule sh-rule" />

        <div className="sh-punch">
          <div className="sh-punch-kicker">
            <MaskReveal show duration={500}>
              <span className="mono">// 这句话就是</span>
            </MaskReveal>
          </div>

          <h2 className="sh-punch-h">
            <MaskReveal show delay={400} duration={700}>
              <span className="serif-cn">vibe coding</span>
            </MaskReveal>
            <MaskReveal show delay={900} duration={900}>
              <span className="serif-it sh-em">最大的</span>
            </MaskReveal>
            <MaskReveal show delay={1500} duration={1000}>
              <span className="serif-cn">后遗症</span>
            </MaskReveal>
          </h2>

          <div className="sh-punch-rule">
            <span className="sh-punch-rule-bar" />
            <span className="mono sh-punch-rule-lbl">// THE AFTEREFFECT</span>
          </div>
        </div>

        <div className="sh-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 02 / 06 · SHOCK · THE LANDING
        </div>
      </div>
    );
  }

  /* ─── step 4 · 重新框定 · 三动词逐个揭示 ─── */
  return (
    <div className="sh-scene sh-scene-reframe">
      <div className="sh-masthead">
        <span className="sh-brand serif-it">Vibe Coding 后遗症</span>
        <span className="sh-issue mono">NO. 367 · THE REFRAME</span>
      </div>
      <hr className="rule sh-rule" />

      <div className="sh-reframe">
        <div className="sh-reframe-lead">
          <MaskReveal show duration={700}>
            <span className="serif-cn">不是 AI 写不出代码,</span>
          </MaskReveal>
          <MaskReveal show delay={700} duration={700}>
            <span className="serif-cn">而是团队</span>
          </MaskReveal>
          <MaskReveal show delay={1300} duration={700}>
            <span className="serif-it sh-em">失去了</span>
          </MaskReveal>
        </div>

        <div className="sh-reframe-verbs">
          <div className="sh-verb">
            <span className="sh-verb-bar sh-verb-bar-1" />
            <MaskReveal show delay={2100} duration={800}>
              <span className="serif-it sh-verb-txt">理解</span>
            </MaskReveal>
            <span className="mono sh-verb-en">UNDERSTAND</span>
          </div>
          <span className="sh-verb-comma serif-it">、</span>
          <div className="sh-verb">
            <span className="sh-verb-bar sh-verb-bar-2" />
            <MaskReveal show delay={3100} duration={800}>
              <span className="serif-it sh-verb-txt">验证</span>
            </MaskReveal>
            <span className="mono sh-verb-en">VERIFY</span>
          </div>
          <span className="sh-verb-comma serif-it">、</span>
          <div className="sh-verb">
            <span className="sh-verb-bar sh-verb-bar-3" />
            <MaskReveal show delay={4100} duration={800}>
              <span className="serif-it sh-verb-txt">维护</span>
            </MaskReveal>
            <span className="mono sh-verb-en">MAINTAIN</span>
          </div>
          <span className="sh-verb-tail">
            <MaskReveal show delay={5100} duration={700}>
              <span className="serif-cn">它的能力</span>
            </MaskReveal>
          </span>
        </div>

        <div className="sh-reframe-foot mono">
          <span className="dot-accent" />
          &nbsp;// NOT THE CODE — THE CAPABILITY
        </div>
      </div>

      <div className="sh-foot mono">
        <span className="dot-accent" />
        &nbsp;CHAPTER 02 / 06 · SHOCK · END · NEXT: PERSPECTIVE
      </div>
    </div>
  );
}