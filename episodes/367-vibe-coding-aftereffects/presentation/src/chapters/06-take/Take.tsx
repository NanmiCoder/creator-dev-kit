import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Take.css";

/**
 * Chapter 06 · take — 结论 + 互动
 * 8 步 / ~57 秒。每句话一个画面,跨步即切屏。
 *
 * 节拍(每步独立 .ta-screen-N 屏):
 *   step 0 — 转折反驳:「恰恰相反」 + mono 代码片段(8.7s)
 *   step 1 — 转变 4 动词:测试 / review / 回滚 / 看得懂(9.0s)
 *   step 2 — 主金句:AI 让代码变便宜了,但让理解、验证、架构和责任变贵了(6.2s,双行排版 · 最大字)
 *   step 3 — 回扣:这才是 vibe coding 最大的后遗症(2.9s,与 Ch.2 step 7 闭环)
 *   step 4 — 互动引子:评论区我想问你一个问题(3.3s)
 *   step 5 — 二选一:Accept All 派 vs Review All 派(6.1s,双卡对峙)
 *   step 6 — 二次互动:把最崩溃的经历打在评论区(5.8s,评论框 mockup)
 *   step 7 — 签名:阿江 / 我们下期见 / 拜拜(6.6s)
 *
 * 颜色 / 字体全走 midnight-press token;字号固定 px;动画用 transform + opacity;
 * 不用 vw;不用 setTimeout;每步动画时长 ≤ 对应 mp3 时长。
 */
export default function TakeChapter({ step }: ChapterStepProps) {
  /* ─── step 0 · 转折 · 恰恰相反(反驳预期) ─── */
  if (step === 0) {
    return (
      <div className="ta-scene">
        <div className="ta-masthead">
          <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ta-issue mono">NO. 367 · THE CONCLUSION</span>
        </div>
        <hr className="rule ta-rule" />

        <div className="ta-turn">
          <div className="ta-turn-hero">
            <div className="ta-kicker">
              <span className="dot-accent" />
              <span className="mono">// MY CONCLUSION</span>
            </div>

            <div className="ta-turn-stripped">
              <MaskReveal show duration={800}>
                <span className="ta-turn-pre">不是</span>
              </MaskReveal>
              <MaskReveal show delay={400} duration={900}>
                <span className="ta-turn-ghost">不用 AI 写代码</span>
              </MaskReveal>
            </div>

            <div className="ta-turn-row">
              <span className="ta-turn-bar" aria-hidden="true" />
              <MaskReveal show delay={2400} duration={1000}>
                <span className="serif-it ta-turn-em">恰恰相反</span>
              </MaskReveal>
            </div>

            <h2 className="ta-turn-line">
              <MaskReveal show delay={3400} duration={900}>
                <span className="serif-cn">我也让 AI</span>
              </MaskReveal>
              <MaskReveal show delay={4000} duration={1100}>
                <span className="serif-it ta-em">写</span>
              </MaskReveal>
            </h2>
          </div>

          <div className="ta-turn-snippet">
            <div className="ta-turn-snippet-head">
              <span className="dot-accent" />
              <span className="mono">// TYPICAL DAY</span>
            </div>
            <pre className="ta-turn-code mono">
              <MaskReveal show delay={1500} duration={700}>
                <span className="ta-turn-code-c">{`> ai.write(spec.ts)`}</span>
              </MaskReveal>
              {"\n"}
              <MaskReveal show delay={2200} duration={700}>
                <span className="ta-turn-code-c">{`> ai.write(api.ts  )`}</span>
              </MaskReveal>
              {"\n"}
              <MaskReveal show delay={2900} duration={700}>
                <span className="ta-turn-code-c">{`> ai.write(test.ts )`}</span>
              </MaskReveal>
              {"\n"}
              <MaskReveal show delay={3600} duration={700}>
                <span className="ta-turn-code-ok">{`// then ↓ I read every line.`}</span>
              </MaskReveal>
            </pre>
          </div>
        </div>

        <div className="ta-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 06 / 06 · THE CONCLUSION
        </div>
      </div>
    );
  }

  /* ─── step 1 · 转变 · 4 个动词 ─── */
  if (step === 1) {
    return (
      <div className="ta-scene">
        <div className="ta-masthead">
          <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ta-issue mono">NO. 367 · WHAT I CARE ABOUT</span>
        </div>
        <hr className="rule ta-rule" />

        <div className="ta-shift">
          <div className="ta-shift-head">
            <div className="ta-kicker">
              <span className="dot-accent" />
              <span className="mono">// THE SHIFT</span>
            </div>

            <h2 className="ta-shift-h">
              <MaskReveal show duration={800}>
                <span className="serif-cn">越来越</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={900}>
                <span className="serif-it ta-em">不敢</span>
              </MaskReveal>
              <MaskReveal show delay={700} duration={900}>
                <span className="serif-cn">只看</span>
              </MaskReveal>
              <MaskReveal show delay={1100} duration={1000}>
                <span className="serif-it ta-em">快不快</span>
              </MaskReveal>
            </h2>

            <p className="ta-shift-sub">
              <MaskReveal show delay={2200} duration={700}>
                <span className="serif-cn">我更关心</span>
              </MaskReveal>
            </p>
          </div>

          <div className="ta-shift-grid">
            <div className="ta-shift-card">
              <span className="ta-shift-num mono">01</span>
              <MaskReveal show delay={2900} duration={700}>
                <span className="ta-shift-cn">能不能</span>
              </MaskReveal>
              <MaskReveal show delay={3200} duration={900}>
                <span className="serif-it ta-shift-word">被测试</span>
              </MaskReveal>
              <span className="ta-shift-lbl mono">TESTABLE</span>
            </div>
            <div className="ta-shift-card">
              <span className="ta-shift-num mono">02</span>
              <MaskReveal show delay={3600} duration={700}>
                <span className="ta-shift-cn">能不能</span>
              </MaskReveal>
              <MaskReveal show delay={3900} duration={900}>
                <span className="serif-it ta-shift-word">被 review</span>
              </MaskReveal>
              <span className="ta-shift-lbl mono">REVIEWABLE</span>
            </div>
            <div className="ta-shift-card">
              <span className="ta-shift-num mono">03</span>
              <MaskReveal show delay={4300} duration={700}>
                <span className="ta-shift-cn">能不能</span>
              </MaskReveal>
              <MaskReveal show delay={4600} duration={900}>
                <span className="serif-it ta-shift-word">被回滚</span>
              </MaskReveal>
              <span className="ta-shift-lbl mono">REVERSIBLE</span>
            </div>
            <div className="ta-shift-card ta-shift-card-final">
              <span className="ta-shift-num mono">04</span>
              <MaskReveal show delay={5000} duration={700}>
                <span className="ta-shift-cn">能不能</span>
              </MaskReveal>
              <MaskReveal show delay={5300} duration={900}>
                <span className="serif-it ta-shift-word">被下一个人看懂</span>
              </MaskReveal>
              <span className="ta-shift-lbl mono">READABLE</span>
            </div>
          </div>
        </div>

        <div className="ta-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 06 / 06 · THE SHIFT
        </div>
      </div>
    );
  }

  /* ─── step 2 · 主金句 · 双行排版 ─── */
  if (step === 2) {
    return (
      <div className="ta-scene ta-scene-climax">
        <div className="ta-masthead">
          <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ta-issue mono">NO. 367 · THE TAKEAWAY</span>
        </div>
        <hr className="rule ta-rule" />

        <div className="ta-quote-body">
          <div className="ta-kicker ta-kicker-center">
            <span className="dot-accent" />
            <span className="mono">// THE ONE-LINE TAKEAWAY</span>
          </div>

          <div className="ta-quote-stack">
            <h2 className="ta-quote-line">
              <MaskReveal show duration={900}>
                <span className="serif-it ta-quote-en">AI</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={900}>
                <span className="serif-cn">让代码</span>
              </MaskReveal>
              <MaskReveal show delay={700} duration={900}>
                <span className="serif-it ta-quote-emph">变便宜了</span>
              </MaskReveal>
              <span className="ta-quote-comma serif-it">,</span>
            </h2>
            <div className="ta-quote-rule" aria-hidden="true" />
            <h2 className="ta-quote-line ta-quote-line-2">
              <MaskReveal show delay={1300} duration={800}>
                <span className="serif-cn">但让</span>
              </MaskReveal>
              <MaskReveal show delay={1600} duration={900}>
                <span className="serif-it ta-quote-emph ta-quote-emph-warm">理解</span>
              </MaskReveal>
              <MaskReveal show delay={1900} duration={700}>
                <span className="serif-cn">、</span>
              </MaskReveal>
              <MaskReveal show delay={2100} duration={900}>
                <span className="serif-it ta-quote-emph ta-quote-emph-warm">验证</span>
              </MaskReveal>
              <MaskReveal show delay={2400} duration={700}>
                <span className="serif-cn">、</span>
              </MaskReveal>
              <MaskReveal show delay={2600} duration={900}>
                <span className="serif-it ta-quote-emph ta-quote-emph-warm">架构</span>
              </MaskReveal>
              <MaskReveal show delay={2900} duration={700}>
                <span className="serif-cn">和</span>
              </MaskReveal>
              <MaskReveal show delay={3100} duration={900}>
                <span className="serif-it ta-quote-emph ta-quote-emph-warm">责任</span>
              </MaskReveal>
              <MaskReveal show delay={3500} duration={900}>
                <span className="serif-it ta-quote-final">变贵了。</span>
              </MaskReveal>
            </h2>
          </div>

          <div className="ta-quote-foot mono">
            <span className="dot-accent" />
            &nbsp;// FROM SOURCE-NOTES §本期最强观点
          </div>
        </div>

        <div className="ta-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 06 / 06 · THE TAKEAWAY
        </div>
      </div>
    );
  }

  /* ─── step 3 · 回扣 · 这才是 vibe coding 最大的后遗症 ─── */
  if (step === 3) {
    return (
      <div className="ta-scene ta-callback">
        <div className="ta-masthead">
          <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ta-issue mono">NO. 367 · THE LOOP CLOSES</span>
        </div>
        <hr className="rule ta-rule" />

        <div className="ta-cb-body">
          <div className="ta-cb-eyebrow">
            <span className="mono">↩ ECHO TO CHAPTER 02 · STEP 7</span>
          </div>

          <h2 className="ta-cb-h">
            <MaskReveal show duration={700}>
              <span className="serif-cn">这才是</span>
            </MaskReveal>
            <br />
            <MaskReveal show delay={400} duration={1100}>
              <span className="serif-it ta-cb-em">vibe coding</span>
            </MaskReveal>
            <br />
            <MaskReveal show delay={900} duration={900}>
              <span className="serif-cn">最大的</span>
            </MaskReveal>
            <MaskReveal show delay={1200} duration={1100}>
              <span className="serif-it ta-cb-em">后遗症</span>
            </MaskReveal>
          </h2>
        </div>

        <div className="ta-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 06 / 06 · END · NEXT: ASK
        </div>
      </div>
    );
  }

  /* ─── step 4 · 互动引子 · 评论区问一个问题 ─── */
  if (step === 4) {
    return (
      <div className="ta-scene">
        <div className="ta-masthead">
          <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ta-issue mono">NO. 367 · ASK YOU</span>
        </div>
        <hr className="rule ta-rule" />

        <div className="ta-ask-intro">
          <div className="ta-kicker">
            <span className="dot-accent" />
            <span className="mono">// FROM THE SPEAKER</span>
          </div>

          <h2 className="ta-ask-intro-h">
            <MaskReveal show duration={700}>
              <span className="serif-cn">最后</span>
            </MaskReveal>
            <MaskReveal show delay={300} duration={900}>
              <span className="serif-it ta-em">评论区</span>
            </MaskReveal>
            <br />
            <MaskReveal show delay={900} duration={900}>
              <span className="serif-cn">我想问</span>
            </MaskReveal>
            <MaskReveal show delay={1400} duration={1000}>
              <span className="serif-it ta-em">你</span>
            </MaskReveal>
            <MaskReveal show delay={1800} duration={900}>
              <span className="serif-cn">一个问题</span>
            </MaskReveal>
            <span className="ta-ask-intro-q">?</span>
          </h2>

          <div className="ta-ask-intro-arrow">
            <span className="serif-it">↓</span>
            <span className="mono">NEXT: ACCEPT ALL OR REVIEW ALL</span>
          </div>
        </div>

        <div className="ta-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 06 / 06 · ASK YOU
        </div>
      </div>
    );
  }

  /* ─── step 5 · 二选一 · Accept All 派 vs Review All 派 ─── */
  if (step === 5) {
    return (
      <div className="ta-scene">
        <div className="ta-masthead">
          <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ta-issue mono">NO. 367 · WHICH CAMP?</span>
        </div>
        <hr className="rule ta-rule" />

        <div className="ta-poll">
          <div className="ta-poll-head">
            <div className="ta-kicker">
              <span className="dot-accent" />
              <span className="mono">// THE POLL</span>
            </div>
            <h2 className="ta-poll-h">
              <MaskReveal show duration={700}>
                <span className="serif-cn">用 AI 写代码,</span>
              </MaskReveal>
              <MaskReveal show delay={500} duration={1000}>
                <span className="serif-it ta-em">你是哪派</span>
              </MaskReveal>
              <span className="ta-poll-q">?</span>
            </h2>
          </div>

          <div className="ta-poll-stage">
            <div className="ta-poll-card ta-poll-card-a">
              <div className="ta-poll-card-head">
                <span className="ta-poll-tag mono">A</span>
                <span className="ta-poll-tag-lbl mono">FAST · TRUST</span>
              </div>
              <h3 className="ta-poll-card-h">
                <MaskReveal show delay={1500} duration={900}>
                  <span className="serif-it ta-em">Accept</span>
                </MaskReveal>
                <MaskReveal show delay={1900} duration={700}>
                  <span className="serif-cn">&nbsp;All</span>
                </MaskReveal>
                <MaskReveal show delay={2200} duration={700}>
                  <span className="serif-it">派</span>
                </MaskReveal>
              </h3>
              <p className="ta-poll-card-sub mono">
                <MaskReveal show delay={2700} duration={700}>
                  <span>AI 写完 → 直接 Accept → 跑测试</span>
                </MaskReveal>
              </p>
              <div className="ta-poll-card-stat">
                <span className="ta-poll-stat-lbl mono">// POSTURE</span>
                <span className="ta-poll-stat-val mono">SHIP-FAST</span>
              </div>
            </div>

            <div className="ta-poll-vs">
              <span className="serif-it">VS</span>
              <span className="ta-poll-vs-rule" aria-hidden="true" />
            </div>

            <div className="ta-poll-card ta-poll-card-b">
              <div className="ta-poll-card-head">
                <span className="ta-poll-tag mono">B</span>
                <span className="ta-poll-tag-lbl mono">CAREFUL · GATE</span>
              </div>
              <h3 className="ta-poll-card-h">
                <MaskReveal show delay={2500} duration={900}>
                  <span className="serif-it ta-em">Review</span>
                </MaskReveal>
                <MaskReveal show delay={2900} duration={700}>
                  <span className="serif-cn">&nbsp;All</span>
                </MaskReveal>
                <MaskReveal show delay={3200} duration={700}>
                  <span className="serif-it">派</span>
                </MaskReveal>
              </h3>
              <p className="ta-poll-card-sub mono">
                <MaskReveal show delay={3700} duration={700}>
                  <span>AI 写完 → 必须逐行 review → 再 Accept</span>
                </MaskReveal>
              </p>
              <div className="ta-poll-card-stat">
                <span className="ta-poll-stat-lbl mono">// POSTURE</span>
                <span className="ta-poll-stat-val mono">SHIP-CLEAN</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ta-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 06 / 06 · WHICH CAMP?
        </div>
      </div>
    );
  }

  /* ─── step 6 · 二次互动 · 评论框 mockup ─── */
  if (step === 6) {
    return (
      <div className="ta-scene">
        <div className="ta-masthead">
          <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
          <span className="ta-issue mono">NO. 367 · YOUR STORY</span>
        </div>
        <hr className="rule ta-rule" />

        <div className="ta-share">
          <div className="ta-share-head">
            <div className="ta-kicker">
              <span className="dot-accent" />
              <span className="mono">// ALSO DROP IT HERE</span>
            </div>
            <h2 className="ta-share-h">
              <MaskReveal show duration={700}>
                <span className="serif-cn">把最</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={900}>
                <span className="serif-it ta-em">崩溃的经历</span>
              </MaskReveal>
              <br />
              <MaskReveal show delay={900} duration={800}>
                <span className="serif-cn">打在</span>
              </MaskReveal>
              <MaskReveal show delay={1300} duration={1000}>
                <span className="serif-it ta-em">评论区</span>
              </MaskReveal>
            </h2>
          </div>

          <div className="ta-share-mock">
            <div className="ta-share-mock-bar">
              <span className="ta-share-mock-dot" />
              <span className="ta-share-mock-dot" />
              <span className="ta-share-mock-dot" />
              <span className="ta-share-mock-url mono">
                bilibili.com / comment · 367
              </span>
            </div>

            <div className="ta-share-mock-body">
              <div className="ta-share-mock-prompt mono">
                <MaskReveal show delay={1700} duration={700}>
                  <span>// YOUR WORST AI-CODE STORY</span>
                </MaskReveal>
              </div>
              <div className="ta-share-mock-field">
                <MaskReveal show delay={2100} duration={800}>
                  <span className="serif-cn ta-share-mock-line">
                    接手了一个 AI 写的项目,
                  </span>
                </MaskReveal>
                <br />
                <MaskReveal show delay={2700} duration={800}>
                  <span className="serif-cn ta-share-mock-line">
                    三天后没人能改,
                  </span>
                </MaskReveal>
                <br />
                <MaskReveal show delay={3300} duration={900}>
                  <span className="serif-it ta-share-mock-cursor">
                    ___&nbsp;
                  </span>
                </MaskReveal>
                <span className="ta-share-mock-caret" aria-hidden="true" />
              </div>
              <div className="ta-share-mock-action mono">
                <MaskReveal show delay={4400} duration={700}>
                  <span className="ta-share-mock-btn">
                    <span className="dot-accent" />
                    &nbsp;SEND COMMENT
                  </span>
                </MaskReveal>
              </div>
            </div>
          </div>
        </div>

        <div className="ta-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 06 / 06 · YOUR STORY
        </div>
      </div>
    );
  }

  /* ─── step 7 · 签名 · 阿江 / 下期见 / 拜拜 ─── */
  return (
    <div className="ta-scene ta-scene-signoff">
      <div className="ta-masthead">
        <span className="ta-brand serif-it">Vibe Coding 后遗症</span>
        <span className="ta-issue mono">NO. 367 · SIGN OFF</span>
      </div>
      <hr className="rule ta-rule" />

      <div className="ta-signoff">
        <div className="ta-signoff-tag mono">
          <MaskReveal show duration={700}>
            <span>// END OF NO. 367 · VIBE CODING 后遗症</span>
          </MaskReveal>
        </div>

        <div className="ta-signoff-name">
          <MaskReveal show delay={400} duration={1100}>
            <span className="serif-it ta-signoff-who">阿江</span>
          </MaskReveal>
          <span className="ta-signoff-comma serif-it">,</span>
        </div>

        <div className="ta-signoff-lines">
          <p className="ta-signoff-line">
            <MaskReveal show delay={1200} duration={700}>
              <span className="serif-cn">我们</span>
            </MaskReveal>
            <MaskReveal show delay={1500} duration={700}>
              <span className="serif-it ta-em">下期见</span>
            </MaskReveal>
            <span className="serif-it">,</span>
          </p>
          <p className="ta-signoff-line ta-signoff-line-2">
            <MaskReveal show delay={2400} duration={1100}>
              <span className="serif-it ta-signoff-bye">拜拜</span>
            </MaskReveal>
            <span className="serif-it ta-signoff-dot">.</span>
          </p>
        </div>

        <div className="ta-signoff-mark">
          <span className="serif-it">~</span>
          <span className="mono">// 阿江 · NO. 367</span>
          <span className="serif-it">~</span>
        </div>
      </div>

      <div className="ta-foot mono">
        <span className="dot-accent" />
        &nbsp;CHAPTER 06 / 06 · END
      </div>
    </div>
  );
}