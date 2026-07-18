import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Perspective.css";

/**
 * Chapter 03 · perspective — 评论区三派 + 我自己的实践
 * 8 步 / ~76 秒。每句话一个画面,跨步即切屏。
 *
 * 节拍(每步独立 .pe-screen-N 屏):
 *   step 0 — 派 1 + 派 2 详情卡 + 派 3 teaser 占位(「下段揭晓」)+ 顶部 92 replies 计数条
 *   step 1 — 揭晓派 3:hero「先把边界搭好」+ 100% AI 也能写 + 预条件 reveal
 *   step 2 — 转折短屏:「这一点我自己也很有感触」(签名感 underline 揭示)
 *   step 3 — 第一人称时间线:开源初期 → 4 类 AI 真快产物(UI / 重复代码 / 测试脚本 / 迁移脚本)
 *   step 4 — 真正的消耗:大字「确认它没有埋雷」+ 写 vs debug 时长对比双柱
 *   step 5 — 我的工作流矩阵:4 个圆(单测 / 覆盖率 / 前端 E2E / 桌面 Computer Use),逐个点亮
 *   step 6 — 妥协短屏:「就算做到这些,还是会有意想不到的 bug」+ 一行 bug 弹出
 *   step 7 — 金句收束:测试不是银弹,但没有测试就是裸奔 + accent 横条
 *
 * 颜色 / 字体全走 midnight-press token;字号固定 px;动画用 transform + opacity;
 * 不用 vw;不用 setTimeout;每步动画时长 ≤ 对应 mp3 时长。
 *
 * NOTE: step 0 / step 1 与 narrations.ts 必须严格同步:narration[0] 只覆盖 script 段 9
 * (前 2 派),narration[1] 才揭晓派 3(段 10)。视觉上 step 0 已用 teaser 占位避免
 * 「UI 抢先展示尚未口播的事实」的内容同步违约。
 */
export default function PerspectiveChapter({ step }: ChapterStepProps) {
  /* ─── step 0 · 三派并列 ─── */
  if (step === 0) {
    return (
      <div className="pe-scene">
        <div className="pe-masthead">
          <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
          <span className="pe-issue mono">NO. 367 · THE COMMENT SECTION</span>
        </div>
        <hr className="rule pe-rule" />

        <div className="pe-factions">
          <div className="pe-factions-head">
            <div className="pe-kicker">
              <span className="dot-accent" />
              <span className="mono">// 92 REPLIES · 3 CAMPS</span>
            </div>
            <div className="pe-counter mono">
              <span className="pe-counter-num">92</span>
              <span className="pe-counter-lbl">REPLIES</span>
            </div>
          </div>

          <div className="pe-factions-grid">
            <article className="pe-card pe-faction pe-faction-1">
              <div className="pe-faction-meta">
                <span className="pe-faction-num mono">#1</span>
                <span className="pe-faction-tag mono">CAMP · 01</span>
              </div>
              <h3 className="pe-faction-h">
                <span className="serif-cn">AI 大跃进</span>
              </h3>
              <p className="pe-faction-body">
                <span className="serif-cn pe-faction-body-cn">KPI 产物 · 嘲讽式继续 AI 化</span>
              </p>
              <div className="pe-faction-floor mono">
                <span className="dot-accent" />
                <span>&nbsp;FLOOR #1 · #9 · #17</span>
              </div>
            </article>

            <article className="pe-card pe-faction pe-faction-2">
              <div className="pe-faction-meta">
                <span className="pe-faction-num mono">#2</span>
                <span className="pe-faction-tag mono">CAMP · 02</span>
              </div>
              <h3 className="pe-faction-h">
                <span className="serif-cn">不能全怪 AI</span>
              </h3>
              <p className="pe-faction-body">
                <span className="serif-cn pe-faction-body-cn">
                  Agent 本来不是 100% 确定性 · 怎能不灰度
                </span>
              </p>
              <div className="pe-faction-floor mono">
                <span className="dot-accent" />
                <span>&nbsp;FLOOR #2 · #3 · #4 · #7</span>
              </div>
            </article>

            <article className="pe-card pe-faction pe-faction-3 pe-faction-3-teaser">
              <div className="pe-faction-meta">
                <span className="pe-faction-num mono">#3</span>
                <span className="pe-faction-tag mono">CAMP · 03</span>
              </div>
              <h3 className="pe-faction-h">
                <span className="serif-cn pe-faction-teaser-dash">———</span>
              </h3>
              <p className="pe-faction-body">
                <span className="pe-faction-teaser-label mono">// REVEALED NEXT</span>
                <span className="pe-faction-teaser-cue serif-cn">下段揭晓</span>
              </p>
              <div className="pe-faction-floor mono">
                <span className="pe-faction-teaser-floor">&nbsp;// COMING NEXT</span>
              </div>
            </article>
          </div>
        </div>

        <div className="pe-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 03 / 06 · PERSPECTIVE · 3 CAMPS
        </div>
      </div>
    );
  }

  /* ─── step 1 · 揭晓第三派 ─── */
  if (step === 1) {
    return (
      <div className="pe-scene">
        <div className="pe-masthead">
          <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
          <span className="pe-issue mono">NO. 367 · CAMP #43 · ZOOM-IN</span>
        </div>
        <hr className="rule pe-rule" />

        <div className="pe-lock">
          <div className="pe-lock-side pe-lock-side-left">
            <div className="pe-lock-card pe-lock-dim">
              <span className="pe-lock-num mono">#1</span>
              <span className="pe-lock-h serif-cn">AI 大跃进</span>
            </div>
            <div className="pe-lock-card pe-lock-dim">
              <span className="pe-lock-num mono">#2</span>
              <span className="pe-lock-h serif-cn">不能全怪 AI</span>
            </div>
          </div>

          <div className="pe-lock-main">
            <div className="pe-kicker">
              <span className="dot-accent" />
              <span className="mono">// CAMP 03 · FLOOR #43 · #46</span>
            </div>

            <div className="pe-lock-hero">
              <MaskReveal show duration={900}>
                <span className="serif-cn pe-lock-h1">先把边界搭好</span>
              </MaskReveal>
            </div>

            <div className="pe-lock-100">
              <div className="pe-lock-100-stack">
                <MaskReveal show delay={900} duration={900}>
                  <span className="pe-lock-100-num hero-num">100%</span>
                </MaskReveal>
                <MaskReveal show delay={1700} duration={900}>
                  <span className="pe-lock-100-pct mono">AI 也能写</span>
                </MaskReveal>
              </div>
              <div className="pe-lock-100-rule" />
              <MaskReveal show delay={2500} duration={900}>
                <span className="pe-lock-100-pre serif-cn">
                  单测 · Lint · 规范 · 架构边界 写清之后
                </span>
              </MaskReveal>
            </div>
          </div>
        </div>

        <div className="pe-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 03 / 06 · CAMP #43 · 100% AI 写也能做
        </div>
      </div>
    );
  }

  /* ─── step 2 · 转折短屏 · 签名感 ─── */
  if (step === 2) {
    return (
      <div className="pe-scene pe-sign-scene">
        <div className="pe-masthead">
          <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
          <span className="pe-issue mono">NO. 367 · A PERSONAL NOTE</span>
        </div>
        <hr className="rule pe-rule" />

        <div className="pe-sign">
          <div className="pe-kicker pe-kicker-center">
            <span className="dot-accent" />
            <span className="mono">// FIRST PERSON</span>
          </div>

          <h2 className="pe-sign-h">
            <MaskReveal show duration={700}>
              <span className="serif-cn">这一点</span>
            </MaskReveal>
            <MaskReveal show delay={350} duration={700}>
              <span className="serif-it pe-em">我自己</span>
            </MaskReveal>
            <MaskReveal show delay={700} duration={800}>
              <span className="serif-cn">也很有感触</span>
            </MaskReveal>
          </h2>

          <div className="pe-sign-rule" />
        </div>

        <div className="pe-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 03 / 06 · PERSONAL · 2.6s
        </div>
      </div>
    );
  }

  /* ─── step 3 · 第一人称时间线 · AI 写得快 · 4 类产物 ─── */
  if (step === 3) {
    return (
      <div className="pe-scene">
        <div className="pe-masthead">
          <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
          <span className="pe-issue mono">NO. 367 · MY OPEN-SOURCE ARC · EARLY DAYS</span>
        </div>
        <hr className="rule pe-rule" />

        <div className="pe-arc">
          <div className="pe-arc-head">
            <div className="pe-kicker">
              <span className="dot-accent" />
              <span className="mono">// OPEN SOURCE · PHASE 01 · AI IS FAST</span>
            </div>
            <h2 className="pe-arc-h">
              <MaskReveal show duration={800}>
                <span className="serif-cn">一开始觉得</span>
              </MaskReveal>
              <MaskReveal show delay={500} duration={1000}>
                <span className="serif-it pe-em">AI 写得真的快</span>
              </MaskReveal>
            </h2>
          </div>

          <div className="pe-arc-track">
            <div className="pe-arc-item pe-arc-item-1">
              <span className="pe-arc-num mono">01</span>
              <span className="pe-arc-lbl serif-cn">UI</span>
            </div>
            <div className="pe-arc-item pe-arc-item-2">
              <span className="pe-arc-num mono">02</span>
              <span className="pe-arc-lbl serif-cn">重复代码</span>
            </div>
            <div className="pe-arc-item pe-arc-item-3">
              <span className="pe-arc-num mono">03</span>
              <span className="pe-arc-lbl serif-cn">测试脚本</span>
            </div>
            <div className="pe-arc-item pe-arc-item-4">
              <span className="pe-arc-num mono">04</span>
              <span className="pe-arc-lbl serif-cn">迁移脚本</span>
            </div>
          </div>

          <div className="pe-arc-fast">
            <div className="pe-arc-fast-lbl mono">// GENERATE SPEED</div>
            <div className="pe-arc-fast-bar">
              <span className="pe-arc-fast-fill" />
            </div>
            <div className="pe-arc-fast-tag mono">FAST · FAST · FAST · FAST</div>
          </div>
        </div>

        <div className="pe-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 03 / 06 · MY OPEN-SOURCE · 4 STACKS
        </div>
      </div>
    );
  }

  /* ─── step 4 · 真正的消耗 · 大字 + debug 时长对比 ─── */
  if (step === 4) {
    return (
      <div className="pe-scene">
        <div className="pe-masthead">
          <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
          <span className="pe-issue mono">NO. 367 · THE HIDDEN COST</span>
        </div>
        <hr className="rule pe-rule" />

        <div className="pe-cost">
          <div className="pe-cost-hero">
            <div className="pe-kicker">
              <span className="dot-accent" />
              <span className="mono">// THE REAL COST</span>
            </div>
            <h2 className="pe-cost-h">
              <MaskReveal show duration={900}>
                <span className="serif-cn">真正消耗时间的</span>
              </MaskReveal>
              <MaskReveal show delay={700} duration={1100}>
                <span className="serif-it pe-em">不是写出来</span>
              </MaskReveal>
            </h2>
          </div>

          <div className="pe-cost-emph">
            <MaskReveal show delay={1500} duration={1000}>
              <span className="pe-cost-emph-h serif-cn">是确认它没有埋雷</span>
            </MaskReveal>
          </div>

          <div className="pe-cost-bars">
            <div className="pe-cost-bar">
              <div className="pe-cost-bar-lbl mono">// GENERATE</div>
              <div className="pe-cost-bar-track">
                <span className="pe-cost-bar-fill pe-cost-bar-fill-write" />
              </div>
              <div className="pe-cost-bar-tag mono">SHORT</div>
            </div>
            <div className="pe-cost-bar">
              <div className="pe-cost-bar-lbl mono">// CONFIRM NO BUGS</div>
              <div className="pe-cost-bar-track">
                <span className="pe-cost-bar-fill pe-cost-bar-fill-debug" />
              </div>
              <div className="pe-cost-bar-tag mono">LONG</div>
            </div>
          </div>
        </div>

        <div className="pe-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 03 / 06 · THE HIDDEN COST · DEBUG TAX
        </div>
      </div>
    );
  }

  /* ─── step 5 · 我的工作流矩阵 · 4 圈逐个点亮 ─── */
  if (step === 5) {
    return (
      <div className="pe-scene">
        <div className="pe-masthead">
          <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
          <span className="pe-issue mono">NO. 367 · MY WORKFLOW · 4 LAYERS</span>
        </div>
        <hr className="rule pe-rule" />

        <div className="pe-wf">
          <div className="pe-wf-head">
            <div className="pe-kicker">
              <span className="dot-accent" />
              <span className="mono">// WORKFLOW MATRIX</span>
            </div>
            <h2 className="pe-wf-h">
              <MaskReveal show duration={800}>
                <span className="serif-cn">所以我后面都会</span>
              </MaskReveal>
              <MaskReveal show delay={500} duration={900}>
                <span className="serif-it pe-em">补这一套</span>
              </MaskReveal>
            </h2>
          </div>

          <div className="pe-wf-grid">
            <div className="pe-wf-cell pe-wf-cell-1">
              <div className="pe-wf-circle">
                <span className="pe-wf-num mono">01</span>
                <span className="pe-wf-mark serif-it">μ</span>
              </div>
              <div className="pe-wf-lbl serif-cn">单测</div>
              <div className="pe-wf-sub mono">UNIT TEST</div>
            </div>
            <div className="pe-wf-cell pe-wf-cell-2">
              <div className="pe-wf-circle">
                <span className="pe-wf-num mono">02</span>
                <span className="pe-wf-mark serif-it">%</span>
              </div>
              <div className="pe-wf-lbl serif-cn">覆盖率</div>
              <div className="pe-wf-sub mono">COVERAGE</div>
            </div>
            <div className="pe-wf-cell pe-wf-cell-3">
              <div className="pe-wf-circle">
                <span className="pe-wf-num mono">03</span>
                <span className="pe-wf-mark serif-it">E2E</span>
              </div>
              <div className="pe-wf-lbl serif-cn">前端浏览器 E2E</div>
              <div className="pe-wf-sub mono">BROWSER E2E</div>
            </div>
            <div className="pe-wf-cell pe-wf-cell-4">
              <div className="pe-wf-circle">
                <span className="pe-wf-num mono">04</span>
                <span className="pe-wf-mark serif-it">CU</span>
              </div>
              <div className="pe-wf-lbl serif-cn">桌面端 Computer Use</div>
              <div className="pe-wf-sub mono">DESKTOP · COMPUTER USE</div>
            </div>
          </div>

          <div className="pe-wf-foot mono">
            <span className="dot-accent" />
            <span>&nbsp;// KEY PATHS REVIEWED BY HUMAN</span>
          </div>
        </div>

        <div className="pe-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 03 / 06 · 4 LAYERS · KEY PATHS HUMAN
        </div>
      </div>
    );
  }

  /* ─── step 6 · 妥协短屏 · 意想不到的 bug ─── */
  if (step === 6) {
    return (
      <div className="pe-scene">
        <div className="pe-masthead">
          <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
          <span className="pe-issue mono">NO. 367 · HOWEVER ·</span>
        </div>
        <hr className="rule pe-rule" />

        <div className="pe-however">
          <div className="pe-kicker pe-kicker-center">
            <span className="dot-accent" />
            <span className="mono">// THE HONEST PART</span>
          </div>

          <h2 className="pe-however-h">
            <MaskReveal show duration={800}>
              <span className="serif-cn">就算做到这些</span>
            </MaskReveal>
            <MaskReveal show delay={700} duration={1000}>
              <span className="serif-it pe-em">还是会有</span>
            </MaskReveal>
          </h2>
          <h3 className="pe-however-h-sub">
            <MaskReveal show delay={1700} duration={900}>
              <span className="serif-cn pe-em">意想不到的 bug</span>
            </MaskReveal>
          </h3>

          <div className="pe-however-bugs">
            <span className="pe-however-bug pe-however-bug-1 mono">?</span>
            <span className="pe-however-bug pe-however-bug-2 mono">!</span>
            <span className="pe-however-bug pe-however-bug-3 mono">?</span>
            <span className="pe-however-bug pe-however-bug-4 mono">!</span>
          </div>
        </div>

        <div className="pe-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 03 / 06 · THE HONEST PART · 4s
        </div>
      </div>
    );
  }

  /* ─── step 7 · 金句收束 · 测试不是银弹 ─── */
  return (
    <div className="pe-scene pe-finale">
      <div className="pe-masthead">
        <span className="pe-brand serif-it">Vibe Coding 后遗症</span>
        <span className="pe-issue mono">NO. 367 · THE TAKEAWAY</span>
      </div>
      <hr className="rule pe-rule" />

      <div className="pe-finale-body">
        <div className="pe-finale-kicker">
          <div className="pe-kicker">
            <span className="dot-accent" />
            <span className="mono">// THE TAKEAWAY</span>
          </div>
          <div className="pe-finale-rule" />
        </div>

        <h2 className="pe-finale-h">
          <MaskReveal show duration={1000}>
            <span className="serif-cn pe-finale-cn">测试</span>
          </MaskReveal>
          <MaskReveal show delay={500} duration={1000}>
            <span className="serif-it pe-em">不是银弹</span>
          </MaskReveal>
        </h2>
        <h3 className="pe-finale-h-sub">
          <MaskReveal show delay={2000} duration={1000}>
            <span className="serif-cn pe-finale-cn">但没有测试</span>
          </MaskReveal>
          <MaskReveal show delay={2700} duration={1100}>
            <span className="serif-it pe-em">就是裸奔</span>
          </MaskReveal>
        </h3>

        <div className="pe-finale-bar" />

        <p className="pe-finale-tag mono">
          <span className="dot-accent" />
          &nbsp;真正要补的是一整套工作流,不是几个测试用例
        </p>
      </div>

      <div className="pe-foot mono">
        <span className="dot-accent" />
        &nbsp;CHAPTER 03 / 06 · END · NEXT: BIGCO
      </div>
    </div>
  );
}