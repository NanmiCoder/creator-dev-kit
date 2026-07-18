import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./Bigco.css";

/**
 * Chapter 04 · bigco — 大厂最新实践对照
 * 7 步 / ~83 秒。每句话一个画面,跨步即切屏。
 *
 * 节拍(每步独立 .bi- 屏):
 *   step 0 — 转场:「这里要更新一个认知」(2.0s)
 *   step 1 — 反共识大字:「已经不是要不要用 AI 写代码的时代了」(3.6s)
 *   step 2 — 四家大厂共识总览(MSFT/GH/OAI/CFLR 一行一行揭示 + 主线 bottom)(11.5s)
 *   step 3 — 微软 .NET 10 个月复盘:hero + 10 个月 stat + 4 cell flow + 收束 pull-quote(16.2s)
 *   step 4 — GitHub Copilot:5 个入口 + cloud agent 中枢 + medium-depth review 路由(21.1s)
 *   step 5 — OpenAI Codex:4 个配置文件 + 3 个输出 + 100% PR review 收束(22.7s)
 *   step 6 — Cloudflare vinext:hero + 5 项 stat(Vitest / Playwright / TS / lint / CI)(15.1s)
 *
 * 颜色 / 字体全走 midnight-press token;字号固定 px;动画用 transform + opacity;
 * 不用 vw;不用 setTimeout;每步动画时长 ≤ 对应 mp3 时长(对照 narrations.ts 注释)。
 * 公司名一律走 mono badge + 文字 label,不引真 logo(版权风险)。
 */
export default function BigcoChapter({ step }: ChapterStepProps) {
  /* ─── step 0 · 转场 ─── */
  if (step === 0) {
    return (
      <div className="bi-scene">
        <div className="bi-masthead">
          <span className="bi-brand serif-it">Vibe Coding 后遗症</span>
          <span className="bi-issue mono">NO. 367 · THE UPDATE</span>
        </div>
        <hr className="rule bi-rule" />

        <div className="bi-turn">
          <div className="bi-turn-kicker mono">
            <span className="dot-accent" />
            &nbsp;// CHAPTER 04 / 06 · RECONSENSUS
          </div>
          <h2 className="bi-turn-h">
            <MaskReveal show duration={700}>
              <span className="serif-cn">这里要</span>
            </MaskReveal>
            <MaskReveal show delay={300} duration={700}>
              <span className="serif-it bi-em">更新</span>
            </MaskReveal>
            <MaskReveal show delay={600} duration={900}>
              <span className="serif-cn">一个认知</span>
            </MaskReveal>
          </h2>
          <div className="bi-turn-sub mono">
            <span className="dot-accent" />
            &nbsp;BIGCO · WHAT THE LARGEST LABS ACTUALLY DO
          </div>
        </div>

        <div className="bi-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 04 / 06 · THE UPDATE
        </div>
      </div>
    );
  }

  /* ─── step 1 · 反共识大字 ─── */
  if (step === 1) {
    return (
      <div className="bi-scene">
        <div className="bi-masthead">
          <span className="bi-brand serif-it">Vibe Coding 后遗症</span>
          <span className="bi-issue mono">NO. 367 · THE NEW NORMAL</span>
        </div>
        <hr className="rule bi-rule" />

        <div className="bi-statement">
          <div className="bi-kicker">
            <span className="dot-accent" />
            <span className="mono">// RE-CONSENSUS</span>
          </div>
          <h2 className="bi-statement-h">
            <MaskReveal show duration={700}>
              <span className="serif-cn">现在已经不是要不要用</span>
            </MaskReveal>
            <MaskReveal show delay={500} duration={1100}>
              <span className="serif-it bi-em">AI</span>
            </MaskReveal>
            <MaskReveal show delay={900} duration={1100}>
              <span className="serif-cn">&nbsp;写代码的时代了</span>
            </MaskReveal>
          </h2>
          <div className="bi-statement-quote" />
        </div>

        <div className="bi-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 04 / 06 · THE NEW NORMAL
        </div>
      </div>
    );
  }

  /* ─── step 2 · 四家大厂共识总览 ─── */
  if (step === 2) {
    return (
      <div className="bi-scene">
        <div className="bi-masthead">
          <span className="bi-brand serif-it">Vibe Coding 后遗症</span>
          <span className="bi-issue mono">NO. 367 · BIGCO 4 / 4</span>
        </div>
        <hr className="rule bi-rule" />

        <div className="bi-overview">
          <div className="bi-kicker">
            <span className="dot-accent" />
            <span className="mono">// THE FOUR LARGEST LABS</span>
          </div>

          <div className="bi-overview-rows">
            <div className="bi-row bi-row-0">
              <div className="bi-row-badge">
                <span className="bi-row-code">MSFT</span>
                <span className="bi-badge">.NET runtime</span>
              </div>
              <h3 className="bi-row-name">
                微软
                <span className="bi-row-name-en">Microsoft · 10-mo retrospective</span>
              </h3>
              <p className="bi-row-desc">
                <span className="bi-em">10 个月</span>复盘 — 每个 PR 都收到 AI review
              </p>
            </div>

            <div className="bi-row bi-row-1">
              <div className="bi-row-badge">
                <span className="bi-row-code">GH</span>
                <span className="bi-badge">Copilot</span>
              </div>
              <h3 className="bi-row-name">
                GitHub
                <span className="bi-row-name-en">Copilot cloud agent · 5 entry points</span>
              </h3>
              <p className="bi-row-desc">
                从 issue / Actions / IDE / Slack / Jira 全部都能
                <span className="bi-em"> 启动 Copilot</span>
              </p>
            </div>

            <div className="bi-row bi-row-2">
              <div className="bi-row-badge">
                <span className="bi-row-code">OAI</span>
                <span className="bi-badge">Codex</span>
              </div>
              <h3 className="bi-row-name">
                OpenAI
                <span className="bi-row-name-en">Codex · AGENTS.md + 100% PR review</span>
              </h3>
              <p className="bi-row-desc">
                Codex <span className="bi-em">review 100% PR</span>,不只是写代码
              </p>
            </div>

            <div className="bi-row bi-row-3">
              <div className="bi-row-badge">
                <span className="bi-row-code">CFLR</span>
                <span className="bi-badge">vinext</span>
              </div>
              <h3 className="bi-row-name">
                Cloudflare
                <span className="bi-row-name-en">vinext · almost 100% AI-written</span>
              </h3>
              <p className="bi-row-desc">
                几乎每行 AI 写,但 <span className="bi-em">1700+ Vitest + 380 Playwright</span>
              </p>
            </div>
          </div>

          <div className="bi-overview-thread">
            <span className="bi-overview-thread-lbl">// THE THREAD</span>
            <h3 className="bi-overview-thread-h">
              默认 <span className="bi-em">AI 参与</span>写代码 / 查代码 / 改代码 / 提 PR · 真正的差距在
              <span className="bi-em"> 工程流水线</span>
            </h3>
          </div>
        </div>

        <div className="bi-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 04 / 06 · BIGCO OVERVIEW
        </div>
      </div>
    );
  }

  /* ─── step 3 · Microsoft .NET runtime · 10 个月复盘 ─── */
  if (step === 3) {
    return (
      <div className="bi-scene">
        <div className="bi-masthead">
          <span className="bi-brand serif-it">Vibe Coding 后遗症</span>
          <span className="bi-issue mono">NO. 367 · MICROSOFT</span>
        </div>
        <hr className="rule bi-rule" />

        <div className="bi-ms">
          <div className="bi-ms-left">
            <div className="bi-kicker">
              <span className="dot-accent" />
              <span className="mono">// 01 · MSFT</span>
            </div>
            <div className="bi-ms-org">
              <span className="bi-row-code">MSFT</span>
              <div>
                <div className="bi-ms-org-name">微软 · .NET runtime</div>
                <div className="bi-ms-org-sub">Copilot Coding Agent · 10-month retrospective</div>
              </div>
            </div>
            <h2 className="bi-ms-headline">
              <MaskReveal show duration={900}>
                <span className="serif-cn">默认</span>
              </MaskReveal>
              <MaskReveal show delay={300} duration={900}>
                <span className="serif-it bi-em">AI</span>
              </MaskReveal>
              <MaskReveal show delay={500} duration={1100}>
                <span className="serif-cn">&nbsp;参与写代码 ·</span>
              </MaskReveal>
              <MaskReveal show delay={1100} duration={1100}>
                <span className="serif-it bi-em">每个 PR 都 review</span>
              </MaskReveal>
            </h2>
          </div>

          <div className="bi-ms-right">
            <div className="bi-ms-stat">
              <span className="bi-ms-stat-num">10</span>
              <div className="bi-ms-stat-meta">
                <span className="bi-ms-stat-lbl">// MONTHS</span>
                <span className="bi-ms-stat-unit">复盘周期</span>
              </div>
            </div>

            <div className="bi-ms-flow">
              <div className="bi-ms-flow-cell bi-ms-flow-0">
                <span className="bi-ms-flow-num">/01</span>
                <span className="bi-ms-flow-lbl">写代码</span>
                <span className="bi-ms-flow-en">WRITE</span>
              </div>
              <div className="bi-ms-flow-cell bi-ms-flow-1">
                <span className="bi-ms-flow-num">/02</span>
                <span className="bi-ms-flow-lbl">查代码</span>
                <span className="bi-ms-flow-en">SEARCH</span>
              </div>
              <div className="bi-ms-flow-cell bi-ms-flow-2">
                <span className="bi-ms-flow-num">/03</span>
                <span className="bi-ms-flow-lbl">改代码</span>
                <span className="bi-ms-flow-en">REFACTOR</span>
              </div>
              <div className="bi-ms-flow-cell bi-ms-flow-3">
                <span className="bi-ms-flow-num">/04</span>
                <span className="bi-ms-flow-lbl">提 PR</span>
                <span className="bi-ms-flow-en">OPEN PR</span>
              </div>
            </div>

            <div className="bi-ms-final">
              <span className="bi-ms-final-lbl">// BOTTOM LINE</span>
              <p className="bi-ms-final-quote">
                不管 <span className="bi-em">人写的</span> · <span className="bi-em">AI 写的</span> · 还是
                <span className="bi-em"> 外部贡献者写的</span>,每个 PR <span className="bi-em">都收到 AI review</span>。
              </p>
            </div>
          </div>
        </div>

        <div className="bi-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 04 / 06 · MICROSOFT · NEXT: GITHUB
        </div>
      </div>
    );
  }

  /* ─── step 4 · GitHub Copilot cloud agent · 5 入口 + medium-depth review ─── */
  if (step === 4) {
    return (
      <div className="bi-scene">
        <div className="bi-masthead">
          <span className="bi-brand serif-it">Vibe Coding 后遗症</span>
          <span className="bi-issue mono">NO. 367 · GITHUB</span>
        </div>
        <hr className="rule bi-rule" />

        <div className="bi-gh">
          <div className="bi-gh-header">
            <div className="bi-gh-title">
              <div className="bi-kicker">
                <span className="dot-accent" />
                <span className="mono">// 02 · GH</span>
              </div>
              <h2 className="bi-gh-h">
                <MaskReveal show duration={900}>
                  <span className="serif-cn">GitHub</span>
                </MaskReveal>
                <MaskReveal show delay={300} duration={1100}>
                  <span className="serif-it bi-em">&nbsp;Copilot cloud agent</span>
                </MaskReveal>
                <MaskReveal show delay={1200} duration={900}>
                  <span className="serif-cn">&nbsp;· 5 个入口</span>
                </MaskReveal>
              </h2>
            </div>
            <div className="bi-row-code" style={{ fontSize: "32px" }}>GH</div>
          </div>

          <div className="bi-gh-flow">
            <div className="bi-gh-entries">
              <div className="bi-gh-entry bi-gh-entry-0">
                <span className="bi-gh-entry-icon">/01</span>
                <span className="bi-gh-entry-lbl">issue</span>
                <span className="bi-gh-entry-en">GitHub Issues</span>
              </div>
              <div className="bi-gh-entry bi-gh-entry-1">
                <span className="bi-gh-entry-icon">/02</span>
                <span className="bi-gh-entry-lbl">Actions</span>
                <span className="bi-gh-entry-en">GitHub Actions</span>
              </div>
              <div className="bi-gh-entry bi-gh-entry-2">
                <span className="bi-gh-entry-icon">/03</span>
                <span className="bi-gh-entry-lbl">IDE</span>
                <span className="bi-gh-entry-en">VS Code / JetBrains</span>
              </div>
              <div className="bi-gh-entry bi-gh-entry-3">
                <span className="bi-gh-entry-icon">/04</span>
                <span className="bi-gh-entry-lbl">Slack</span>
                <span className="bi-gh-entry-en">Mention Copilot</span>
              </div>
              <div className="bi-gh-entry bi-gh-entry-4">
                <span className="bi-gh-entry-icon">/05</span>
                <span className="bi-gh-entry-lbl">Jira</span>
                <span className="bi-gh-entry-en">Jira ticket</span>
              </div>
            </div>

            <div className="bi-gh-bridge">
              <div className="bi-gh-bridge-side" />
              <div className="bi-gh-bridge-mid">
                <span className="bi-gh-bridge-mid-lbl">// IN THE BACKGROUND</span>
                <h3 className="bi-gh-bridge-mid-h">cloud agent · 干活 → 开 PR</h3>
              </div>
              <div className="bi-gh-bridge-side bi-gh-bridge-side-right" />
            </div>
          </div>

          <div className="bi-gh-review">
            <div className="bi-gh-review-block">
              <div className="bi-kicker">
                <span className="dot-accent" />
                <span className="mono">// COPILOT CODE REVIEW</span>
              </div>
              <h3 className="bi-gh-review-h">
                已经支持 <span className="bi-em">medium-depth review</span>
              </h3>
            </div>
            <div className="bi-gh-routing">
              <span className="bi-gh-routing-tag">// ROUTING</span>
              <p className="bi-gh-routing-h">复杂 PR</p>
              <span className="bi-gh-routing-arrow">→</span>
              <p className="bi-gh-routing-h">
                <span className="bi-em">更强</span>的推理模型
              </p>
            </div>
          </div>
        </div>

        <div className="bi-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 04 / 06 · GITHUB · NEXT: OPENAI
        </div>
      </div>
    );
  }

  /* ─── step 5 · OpenAI Codex · AGENTS.md + 100% PR review ─── */
  if (step === 5) {
    return (
      <div className="bi-scene">
        <div className="bi-masthead">
          <span className="bi-brand serif-it">Vibe Coding 后遗症</span>
          <span className="bi-issue mono">NO. 367 · OPENAI</span>
        </div>
        <hr className="rule bi-rule" />

        <div className="bi-oai">
          <div className="bi-oai-header">
            <div className="bi-kicker">
              <span className="dot-accent" />
              <span className="mono">// 03 · OAI · CODEX</span>
            </div>
            <p className="bi-oai-hint">
              不只是让 Codex <span style={{ color: "var(--accent)" }}>帮你写一下</span>
            </p>
          </div>

          <h2 className="bi-oai-h">
            <MaskReveal show duration={900}>
              <span className="serif-cn">OpenAI</span>
            </MaskReveal>
            <MaskReveal show delay={300} duration={1100}>
              <span className="serif-it bi-em">&nbsp;Codex</span>
            </MaskReveal>
            <MaskReveal show delay={1200} duration={900}>
              <span className="serif-cn">&nbsp;官方建议</span>
            </MaskReveal>
          </h2>

          <div className="bi-oai-pipeline">
            <div className="bi-oai-side">
              <span className="bi-oai-side-lbl">// STEP 1 · 写清楚</span>
              <div className="bi-oai-file bi-oai-file-0">
                <span className="bi-oai-file-icon">.MD</span>
                <div>
                  <div className="bi-oai-file-name">AGENTS.md</div>
                  <div className="bi-oai-file-desc">给 Codex 的"工作守则"</div>
                </div>
              </div>
              <div className="bi-oai-file bi-oai-file-1">
                <span className="bi-oai-file-icon">$ ▸</span>
                <div>
                  <div className="bi-oai-file-name">测试命令</div>
                  <div className="bi-oai-file-desc">让 Codex 能跑 / 能验</div>
                </div>
              </div>
              <div className="bi-oai-file bi-oai-file-2">
                <span className="bi-oai-file-icon">PR ▸</span>
                <div>
                  <div className="bi-oai-file-name">PR 预期</div>
                  <div className="bi-oai-file-desc">每个 PR 长什么样 / 改了什么</div>
                </div>
              </div>
              <div className="bi-oai-file bi-oai-file-3">
                <span className="bi-oai-file-icon">.MD</span>
                <div>
                  <div className="bi-oai-file-name">code_review.md</div>
                  <div className="bi-oai-file-desc">固化 review 规则与上下文</div>
                </div>
              </div>
            </div>

            <div className="bi-oai-arrow" aria-hidden="true">→</div>

            <div className="bi-oai-output">
              <span className="bi-oai-side-lbl">// STEP 2 · Codex 输出</span>
              <div className="bi-oai-output-row">
                <span className="bi-oai-output-pill">补测试</span>
                <span className="bi-oai-output-pill">跑检查</span>
                <span className="bi-oai-output-pill">review diff</span>
              </div>
            </div>
          </div>

          <div className="bi-oai-footer">
            <div className="bi-oai-footer-bar">
              <span className="bi-oai-footer-bar-lbl">// OPENAI 内部</span>
              <h3 className="bi-oai-footer-bar-h">
                Codex 会 review OpenAI <span className="bi-em">100% 的 PR</span>。
              </h3>
            </div>
          </div>
        </div>

        <div className="bi-foot mono">
          <span className="dot-accent" />
          &nbsp;CHAPTER 04 / 06 · OPENAI · NEXT: CLOUDFLARE
        </div>
      </div>
    );
  }

  /* ─── step 6 · Cloudflare vinext · 极端样本 ─── */
  return (
    <div className="bi-scene">
      <div className="bi-masthead">
        <span className="bi-brand serif-it">Vibe Coding 后遗症</span>
        <span className="bi-issue mono">NO. 367 · CLOUDFLARE · END</span>
      </div>
      <hr className="rule bi-rule" />

      <div className="bi-cf">
        <div className="bi-cf-left">
          <div className="bi-kicker">
            <span className="dot-accent" />
            <span className="mono">// 04 · CFLR · EXTREME</span>
          </div>
          <div className="bi-cf-org">
            <span className="bi-row-code">CFLR</span>
            <div>
              <div className="bi-cf-org-name">Cloudflare · vinext</div>
              <div className="bi-cf-org-sub">Almost every line is AI-written</div>
            </div>
          </div>
          <h2 className="bi-cf-headline">
            <MaskReveal show duration={900}>
              <span className="serif-cn">几乎每一行</span>
            </MaskReveal>
            <MaskReveal show delay={400} duration={1100}>
              <span className="serif-it bi-em">AI</span>
            </MaskReveal>
            <MaskReveal show delay={700} duration={1100}>
              <span className="serif-cn">&nbsp;写的</span>
            </MaskReveal>
          </h2>
          <div className="bi-cf-quote">
            <span className="bi-cf-quote-lbl">// AUTHOR NOTE</span>
            <p className="bi-cf-quote-h">
              架构决策 / 优先级 / 发现 AI 走错方向,<span className="bi-em">仍然由人掌舵</span>。
            </p>
          </div>
        </div>

        <div className="bi-cf-stats">
          <div className="bi-cf-stats-head">
            <span className="bi-cf-stats-head-lbl">// THE QUALITY GATE</span>
            <span className="bi-cf-stats-head-sub">EVERY PR · ALL GATES</span>
          </div>
          <div className="bi-cf-stat-grid">
            <div className="bi-cf-stat bi-cf-stat-0 bi-cf-stat-is-feature">
              <div className="bi-cf-stat-info">
                <span className="bi-cf-stat-num">1,700+</span>
                <span className="bi-cf-stat-lbl">// UNIT TESTS</span>
              </div>
              <span className="bi-cf-stat-rule">Vitest</span>
            </div>
            <div className="bi-cf-stat bi-cf-stat-1 bi-cf-stat-is-feature">
              <div className="bi-cf-stat-info">
                <span className="bi-cf-stat-num">380</span>
                <span className="bi-cf-stat-lbl">// E2E TESTS</span>
              </div>
              <span className="bi-cf-stat-rule">Playwright</span>
            </div>
            <div className="bi-cf-stat bi-cf-stat-2">
              <div className="bi-cf-stat-info">
                <span className="bi-cf-stat-num">TS</span>
                <span className="bi-cf-stat-lbl">// TYPE SAFETY</span>
              </div>
              <span className="bi-cf-stat-rule">TypeScript</span>
            </div>
            <div className="bi-cf-stat bi-cf-stat-3">
              <div className="bi-cf-stat-info">
                <span className="bi-cf-stat-num">LINT</span>
                <span className="bi-cf-stat-lbl">// CODE STYLE</span>
              </div>
              <span className="bi-cf-stat-rule">eslint</span>
            </div>
            <div className="bi-cf-stat bi-cf-stat-4" style={{ gridColumn: "span 2" }}>
              <div className="bi-cf-stat-info">
                <span className="bi-cf-stat-num">CI</span>
                <span className="bi-cf-stat-lbl">// CONTINUOUS INTEGRATION</span>
              </div>
              <span className="bi-cf-stat-rule">每个 PR 都跑</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bi-foot mono">
        <span className="dot-accent" />
        &nbsp;CHAPTER 04 / 06 · CLOUDFLARE · END · NEXT: HARNESS
      </div>
    </div>
  );
}
