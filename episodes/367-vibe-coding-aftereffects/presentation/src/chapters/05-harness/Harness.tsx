import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Harness.css";

/**
 * Chapter 05 · harness — Vibe Coding 后遗症
 * 5 步 / ~35 秒。每句话一个画面,跨步即切屏。
 *
 * 节拍(每步独立 .ha-screen-N 屏):
 *   step 0 — 总命题:从 vibe coding 走向 harness coding(左右双词 + accent 横条 + 过渡箭头)
 *   step 1 — 核心定义:"harness = 给 AI 装轨道"(左词 / 等号 / 右句 · 4.05s 短屏)
 *   step 2 — 三不是 ①:NOT 一句需求自由发挥 / BUT 先写清业务流程·性能·兜底·边界(10.83s 最长屏)
 *   step 3 — 三不是 ②:NOT 直接碰主干生产 / BUT 分支·worktree·sandbox·预览环境(四层隔离漏斗)
 *   step 4 — 三不是 ③:NOT 能跑就合 / BUT 测试·diff review·灰度·回滚(四道闸门串行)
 *
 * 视觉走 midnight-press token · warm espresso 暗底 + 火热橙 accent;
 * 字号固定 px;动画用 transform + opacity;不用 vw;不用 setTimeout;
 * 每步动画时长 ≤ 对应 mp3 时长。
 */
export default function HarnessChapter({ step }: ChapterStepProps) {
  /* ─── step 0 · 总命题:从 vibe coding 走向 harness coding ─── */
  if (step === 0) {
    return (
      <div className="ha-scene">
        <div className="ha-masthead">
          <span className="ha-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ha-issue mono">NO. 367 · PARADIGM SHIFT</span>
        </div>
        <hr className="rule ha-rule" />

        <div className="ha-shift">
          <div className="ha-kicker">
            <span className="dot-accent" />
            <span className="mono">// THE LEAP</span>
          </div>

          <h1 className="ha-h1-shift">
            <span className="ha-shift-from">
              <MaskReveal show duration={800}>
                <span className="serif-it">vibe</span>
              </MaskReveal>
              <MaskReveal show delay={280} duration={900}>
                <span className="serif-cn">&nbsp;coding</span>
              </MaskReveal>
            </span>

            <span className="ha-shift-arrow serif-it" aria-hidden="true">
              <MaskReveal show delay={900} duration={700}>
                <span>→</span>
              </MaskReveal>
            </span>

            <span className="ha-shift-to">
              <MaskReveal show delay={1500} duration={900}>
                <span className="serif-it ha-em">harness</span>
              </MaskReveal>
              <MaskReveal show delay={2000} duration={900}>
                <span className="serif-cn">&nbsp;coding</span>
              </MaskReveal>
            </span>
          </h1>

          <div className="ha-shift-bar" aria-hidden="true">
            <span className="ha-shift-bar-line" />
            <span className="ha-shift-bar-tag mono">
              FROM CHAOS · TO RAILS
            </span>
            <span className="ha-shift-bar-line" />
          </div>

          <p className="ha-shift-sub">
            <MaskReveal show delay={2800} duration={900}>
              <span className="serif-cn">关键不是回到手敲代码,而是</span>
            </MaskReveal>
          </p>
        </div>

        <div className="ha-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 05 / 06 · HARNESS
        </div>
      </div>
    );
  }

  /* ─── step 1 · 核心定义:"harness = 给 AI 装轨道" ─── */
  if (step === 1) {
    return (
      <div className="ha-scene">
        <div className="ha-masthead">
          <span className="ha-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ha-issue mono">NO. 367 · DEFINITION</span>
        </div>
        <hr className="rule ha-rule" />

        <div className="ha-define">
          <div className="ha-kicker">
            <span className="dot-accent" />
            <span className="mono">// CORE DEFINITION</span>
          </div>

          <div className="ha-define-eq">
            <div className="ha-define-lhs">
              <MaskReveal show duration={800}>
                <span className="serif-it ha-define-lhs-word">harness</span>
              </MaskReveal>
            </div>

            <span className="ha-define-op serif-it" aria-hidden="true">
              <MaskReveal show delay={600} duration={600}>
                <span>=</span>
              </MaskReveal>
            </span>

            <div className="ha-define-rhs">
              <MaskReveal show delay={1200} duration={900}>
                <span className="serif-cn ha-define-rhs-zh">给 AI</span>
              </MaskReveal>
              <MaskReveal show delay={1700} duration={900}>
                <span className="serif-it ha-em ha-define-rhs-zh">&nbsp;装轨道</span>
              </MaskReveal>
            </div>
          </div>

          <div className="ha-define-rails" aria-hidden="true">
            <span className="ha-rail" />
            <span className="ha-rail ha-rail-spoke" />
            <span className="ha-rail" />
            <span className="ha-rail ha-rail-spoke" />
            <span className="ha-rail" />
            <span className="ha-rail ha-rail-spoke" />
            <span className="ha-rail" />
          </div>
        </div>

        <div className="ha-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 05 / 06 · DEFINITION
        </div>
      </div>
    );
  }

  /* ─── step 2 · 三不是 ①:先写清业务流程 / 性能 / 兜底 / 边界 ─── */
  if (step === 2) {
    return (
      <div className="ha-scene">
        <div className="ha-masthead">
          <span className="ha-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ha-issue mono">NO. 367 · NOT #1 · SPEC</span>
        </div>
        <hr className="rule ha-rule" />

        <div className="ha-not">
          <div className="ha-kicker">
            <span className="dot-accent" />
            <span className="mono">// RULE 01 · NOT FREE-FORM</span>
          </div>

          <div className="ha-not-board">
            <div className="ha-not-col ha-not-col-bad">
              <div className="ha-not-col-lbl mono">
                <span className="ha-not-mark">×</span>
                NOT
              </div>
              <p className="ha-not-bad-line">
                <MaskReveal show duration={700}>
                  <span className="serif-cn">一句需求,</span>
                </MaskReveal>
                <MaskReveal show delay={400} duration={700}>
                  <span className="serif-it ha-not-bad-em">让它自由发挥</span>
                </MaskReveal>
              </p>
              <div className="ha-not-bad-tag mono">// VIBE · FREE-FORM</div>
            </div>

            <span className="ha-not-arrow serif-it" aria-hidden="true">
              <MaskReveal show delay={1300} duration={700}>
                <span>→</span>
              </MaskReveal>
            </span>

            <div className="ha-not-col ha-not-col-good">
              <div className="ha-not-col-lbl ha-not-col-lbl-good mono">
                <span className="ha-not-mark ha-not-mark-good">✓</span>
                BUT
              </div>
              <p className="ha-not-good-line">
                <MaskReveal show delay={1700} duration={800}>
                  <span className="serif-cn">先把</span>
                </MaskReveal>
                <MaskReveal show delay={2100} duration={800}>
                  <span className="serif-it ha-em">spec</span>
                </MaskReveal>
                <MaskReveal show delay={2400} duration={800}>
                  <span className="serif-cn">&nbsp;写清楚</span>
                </MaskReveal>
              </p>

              <div className="ha-not-spec">
                <div className="ha-not-spec-item">
                  <span className="ha-not-spec-num mono">01</span>
                  <span className="ha-not-spec-lbl serif-cn">业务流程</span>
                  <span className="ha-not-spec-en mono">/ FLOW</span>
                </div>
                <div className="ha-not-spec-item">
                  <span className="ha-not-spec-num mono">02</span>
                  <span className="ha-not-spec-lbl serif-cn">性能指标</span>
                  <span className="ha-not-spec-en mono">/ SLO</span>
                </div>
                <div className="ha-not-spec-item">
                  <span className="ha-not-spec-num mono">03</span>
                  <span className="ha-not-spec-lbl serif-cn">失败兜底</span>
                  <span className="ha-not-spec-en mono">/ FALLBACK</span>
                </div>
                <div className="ha-not-spec-item">
                  <span className="ha-not-spec-num mono">04</span>
                  <span className="ha-not-spec-lbl serif-cn">模块边界</span>
                  <span className="ha-not-spec-en mono">/ BOUNDARY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ha-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 05 / 06 · RULE 01 / 03
        </div>
      </div>
    );
  }

  /* ─── step 3 · 三不是 ②:分支 / worktree / sandbox / 预览环境 ─── */
  if (step === 3) {
    return (
      <div className="ha-scene">
        <div className="ha-masthead">
          <span className="ha-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ha-issue mono">NO. 367 · NOT #2 · ISOLATION</span>
        </div>
        <hr className="rule ha-rule" />

        <div className="ha-iso">
          <div className="ha-kicker">
            <span className="dot-accent" />
            <span className="mono">// RULE 02 · NOT TOUCH MAIN</span>
          </div>

          <div className="ha-iso-board">
            <div className="ha-iso-side ha-iso-side-bad">
              <div className="ha-iso-side-lbl mono">
                <span className="ha-not-mark">×</span>
                NOT
              </div>
              <p className="ha-iso-bad-line">
                <MaskReveal show duration={700}>
                  <span className="serif-cn">直接碰</span>
                </MaskReveal>
                <MaskReveal show delay={400} duration={700}>
                  <span className="serif-it ha-not-bad-em">&nbsp;主干 · 生产</span>
                </MaskReveal>
              </p>
              <div className="ha-iso-bad-lock mono">
                <span className="ha-iso-lock-mark">⨯</span>
                MAIN · LOCKED
              </div>
            </div>

            <div className="ha-iso-side ha-iso-side-good">
              <div className="ha-iso-side-lbl ha-iso-side-lbl-good mono">
                <span className="ha-not-mark ha-not-mark-good">✓</span>
                BUT
              </div>
              <div className="ha-iso-funnel">
                <div className="ha-iso-node ha-iso-node-1">
                  <span className="ha-iso-node-tier mono">L1</span>
                  <span className="ha-iso-node-name serif-cn">分支</span>
                  <span className="ha-iso-node-en mono">/ branch</span>
                </div>
                <div className="ha-iso-arrow serif-it" aria-hidden="true">→</div>
                <div className="ha-iso-node ha-iso-node-2">
                  <span className="ha-iso-node-tier mono">L2</span>
                  <span className="ha-iso-node-name serif-it">worktree</span>
                  <span className="ha-iso-node-en mono">/ isolated copy</span>
                </div>
                <div className="ha-iso-arrow serif-it" aria-hidden="true">→</div>
                <div className="ha-iso-node ha-iso-node-3">
                  <span className="ha-iso-node-tier mono">L3</span>
                  <span className="ha-iso-node-name serif-it">sandbox</span>
                  <span className="ha-iso-node-en mono">/ sealed env</span>
                </div>
                <div className="ha-iso-arrow serif-it" aria-hidden="true">→</div>
                <div className="ha-iso-node ha-iso-node-4">
                  <span className="ha-iso-node-tier mono">L4</span>
                  <span className="ha-iso-node-name serif-cn">预览环境</span>
                  <span className="ha-iso-node-en mono">/ preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ha-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 05 / 06 · RULE 02 / 03
        </div>
      </div>
    );
  }

  /* ─── step 4 · 三不是 ③:测试 / diff review / 灰度 / 回滚 ─── */
  return (
    <div className="ha-scene">
      <div className="ha-masthead">
        <span className="ha-brand serif-it">Vibe Coding 后遗症</span>
        <span className="ha-issue mono">NO. 367 · NOT #3 · GATES</span>
      </div>
      <hr className="rule ha-rule" />

      <div className="ha-gates">
        <div className="ha-kicker">
          <span className="dot-accent" />
          <span className="mono">// RULE 03 · NOT MERGE-ON-GREEN</span>
        </div>

        <div className="ha-gates-board">
          <div className="ha-gates-bad">
            <div className="ha-iso-side-lbl mono">
              <span className="ha-not-mark">×</span>
              NOT
            </div>
            <p className="ha-gates-bad-line">
              <MaskReveal show duration={700}>
                <span className="serif-cn">能跑</span>
              </MaskReveal>
              <MaskReveal show delay={350} duration={700}>
                <span className="serif-it ha-not-bad-em">&nbsp;就合</span>
              </MaskReveal>
            </p>
            <span className="ha-gates-bad-tag mono">// MERGE ON GREEN · UNSAFE</span>
          </div>

          <div className="ha-gates-good">
            <div className="ha-iso-side-lbl ha-iso-side-lbl-good mono">
              <span className="ha-not-mark ha-not-mark-good">✓</span>
              BUT
            </div>
            <p className="ha-gates-good-line">
              <MaskReveal show delay={1000} duration={800}>
                <span className="serif-cn">每个改动都要过</span>
              </MaskReveal>
              <MaskReveal show delay={1500} duration={800}>
                <span className="serif-it ha-em">&nbsp;四道闸门</span>
              </MaskReveal>
            </p>

            <div className="ha-gates-chain">
              <div className="ha-gate">
                <span className="ha-gate-num mono">G1</span>
                <span className="ha-gate-zh serif-cn">测试</span>
                <span className="ha-gate-en mono">/ TESTS</span>
              </div>
              <span className="ha-gate-sep serif-it" aria-hidden="true">›</span>
              <div className="ha-gate">
                <span className="ha-gate-num mono">G2</span>
                <span className="ha-gate-zh serif-it">diff review</span>
                <span className="ha-gate-en mono">/ REVIEW</span>
              </div>
              <span className="ha-gate-sep serif-it" aria-hidden="true">›</span>
              <div className="ha-gate">
                <span className="ha-gate-num mono">G3</span>
                <span className="ha-gate-zh serif-cn">灰度</span>
                <span className="ha-gate-en mono">/ CANARY</span>
              </div>
              <span className="ha-gate-sep serif-it" aria-hidden="true">›</span>
              <div className="ha-gate ha-gate-last">
                <span className="ha-gate-num mono">G4</span>
                <span className="ha-gate-zh serif-cn">回滚</span>
                <span className="ha-gate-en mono">/ ROLLBACK</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ha-foot mono">
        <span className="dot-accent" />
        &nbsp;CHAPTER 05 / 06 · END · NEXT: TAKE
      </div>
    </div>
  );
}