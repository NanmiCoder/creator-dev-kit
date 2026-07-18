import type { ChapterStepProps } from "../../registry/types";
import "./Verdict.css";

/* ── 内联图标（SVG 几何，无 emoji）── */
/* 解禁 / 闸门抬起：锁开 */
const IconUnlock = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-1.9" />
  </svg>
);
/* 仍上锁 */
const IconLock = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
/* 配给 / 限量：漏斗 */
const IconRation = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
  </svg>
);
/* 闸门 / 禁止：圆斜杠 */
const IconBan = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
/* 全球 / 地球：经纬 */
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M4.5 7h15M4.5 17h15" />
  </svg>
);
/* 选中 / 推荐：对勾 */
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6" />
  </svg>
);
/* 终端 / 编程工具：尖括号 */
const IconTerminal = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M7.5 9.5l3 2.5-3 2.5" /><line x1="13" y1="15" x2="17" y2="15" />
  </svg>
);
/* 时钟 / 待开放：圆 + 指针 */
const IconClock = () => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
  </svg>
);

/**
 * 章 6 · verdict —— 裁决 + 真实选型。
 * 论点：把这一周连起来看 → 配给制（Mythos 解禁限美 / Fable5 禁非美 / GPT-5.6 限量）→
 *   全片金句「能力不再稀缺，权限才稀缺」→ 强模型因特殊原因不给中国/他国 →
 *   真实选型：国外 GPT-5.5+Codex；国内 GLM-5.2 / DeepSeek V4 Pro + Claude Code；GPT-5.6 待开放第一时间实测。
 * 屏=信息图（关键词/卡片/时间线/几何符号），整句字幕后期加。子元素按 SRT cue 绝对延时（相对步起始秒）揭示。
 * 主内容避开右上角 432×432 头像安全区（眉标走左上，主体居中/偏下）。
 */
export default function Verdict({ step }: ChapterStepProps) {
  /* ───────── s0 [192.066] 我的判断：真正的新闻不是它多强 ───────── */
  if (step === 0) {
    return (
      <section className="vd-scene vd-s0" key="s0">
        <div className="vd-kicker vd-down" style={{ animationDelay: "0ms" }}>
          <span className="vd-dot" />我的判断 · MY VERDICT
        </div>
        <div className="vd-s0-pre vd-fade" style={{ animationDelay: "1134ms" }}>
          这次真正的新闻
        </div>
        <h1 className="vd-s0-big">
          <span className="vd-s0-neq vd-pop" style={{ animationDelay: "2834ms" }}>≠</span>
          <span className="vd-s0-strong">
            <span className="vd-rise-wrap"><span className="vd-rise" style={{ animationDelay: "2834ms" }}>GPT-5.6</span></span>
            <span className="vd-s0-faint">
              <span className="vd-rise-wrap"><span className="vd-rise" style={{ animationDelay: "4334ms" }}>有多强</span></span>
              <span className="vd-s0-dim" style={{ animationDelay: "4900ms" }} />
            </span>
          </span>
        </h1>
        <div className="vd-s0-turn vd-fade" style={{ animationDelay: "5434ms" }}>
          <span className="vd-s0-arrow vd-pop" style={{ animationDelay: "5434ms" }}>→</span>
          把这<span className="vd-accent">一周</span>连起来看
        </div>
      </section>
    );
  }

  /* ───────── s1 [200.000] 这一周三件事 → 配给制 ───────── */
  if (step === 1) {
    return (
      <section className="vd-scene vd-s1" key="s1">
        <div className="vd-kicker vd-down" style={{ animationDelay: "0ms" }}>
          <span className="vd-dot" />把这一周连起来 · ONE WEEK
        </div>
        <div className="vd-s1-rail">
          {/* ① Mythos 解禁 → 100+ 美国机构 */}
          <div className="vd-s1-card vd-s1-in" style={{ animationDelay: "0ms" }}>
            <span className="vd-s1-no mono">01</span>
            <span className="vd-s1-ic vd-ic-mix"><IconUnlock /></span>
            <div className="vd-s1-name">Mythos</div>
            <div className="vd-s1-act vd-s1-act-mix">被解禁</div>
            <div className="vd-s1-to vd-fade" style={{ animationDelay: "300ms" }}>
              <span className="vd-s1-to-num">100<span className="vd-s1-plus">+</span></span>
              <span className="vd-s1-to-u">家<em>美国</em>机构</span>
            </div>
          </div>
          {/* ② Fable 5 仍禁非美国公民 */}
          <div className="vd-s1-card vd-s1-in" style={{ animationDelay: "1133ms" }}>
            <span className="vd-s1-no mono">02</span>
            <span className="vd-s1-ic vd-ic-neg"><IconLock /></span>
            <div className="vd-s1-name">Claude Fable 5</div>
            <div className="vd-s1-act vd-s1-act-neg">仍禁着</div>
            <div className="vd-s1-to vd-fade" style={{ animationDelay: "1433ms" }}>
              <span className="vd-s1-no-ic"><IconBan /></span>
              <span className="vd-s1-to-u vd-s1-to-neg">非美国公民</span>
            </div>
          </div>
          {/* ③ GPT-5.6 限量配给 */}
          <div className="vd-s1-card vd-s1-in" style={{ animationDelay: "3200ms" }}>
            <span className="vd-s1-no mono">03</span>
            <span className="vd-s1-ic vd-ic-mix"><IconRation /></span>
            <div className="vd-s1-name">GPT-5.6</div>
            <div className="vd-s1-act vd-s1-act-mix">限量配给</div>
            <div className="vd-s1-to vd-fade" style={{ animationDelay: "3500ms" }}>
              <span className="vd-s1-to-u vd-s1-to-mix">同 一 套 路</span>
            </div>
          </div>
        </div>
        <div className="vd-s1-verdict vd-stamp" style={{ animationDelay: "5633ms" }}>
          共同指向 · 配给制 RATIONING
        </div>
      </section>
    );
  }

  /* ───────── s2 [207.333] 金句：能力不再稀缺，权限才稀缺 ───────── */
  if (step === 2) {
    return (
      <section className="vd-scene vd-s2" key="s2">
        <div className="vd-s2-setup">
          <span className="vd-s2-q vd-fade" style={{ animationDelay: "0ms" }}>
            模型强不强？
          </span>
          <span className="vd-s2-strike vd-fade" style={{ animationDelay: "1433ms" }}>
            已经不重要
            <span className="vd-s2-cross" style={{ animationDelay: "1700ms" }} />
          </span>
          <span className="vd-s2-q2 vd-fade" style={{ animationDelay: "2700ms" }}>
            能不能<span className="vd-accent">轮到普通人</span>用？<em className="vd-fade" style={{ animationDelay: "5333ms" }}>比如我们，你用不到</em>
          </span>
        </div>
        <h1 className="vd-s2-thesis">
          <span className="vd-s2-line vd-s2-mute">
            <span className="vd-rise-wrap"><span className="vd-rise" style={{ animationDelay: "7067ms" }}>能力</span></span>
            <span className="vd-s2-tail"><span className="vd-rise-wrap"><span className="vd-rise" style={{ animationDelay: "7167ms" }}>不再稀缺</span></span></span>
          </span>
          <span className="vd-s2-line vd-s2-hot">
            <span className="vd-rise-wrap"><span className="vd-rise" style={{ animationDelay: "9600ms" }}>权限</span></span>
            <span className="vd-s2-tail"><span className="vd-rise-wrap"><span className="vd-rise" style={{ animationDelay: "9700ms" }}>才稀缺</span></span></span>
            <span className="vd-s2-slam" style={{ animationDelay: "9600ms" }} />
          </span>
        </h1>
      </section>
    );
  }

  /* ───────── s3 [217.833] 强模型因特殊原因不给用 ───────── */
  if (step === 3) {
    return (
      <section className="vd-scene vd-s3" key="s3">
        <div className="vd-kicker vd-down" style={{ animationDelay: "0ms" }}>
          <span className="vd-dot vd-dot-warn" />尤其国外 · OVERSEAS
        </div>
        <div className="vd-s3-stage">
          <div className="vd-s3-src vd-pop" style={{ animationDelay: "1167ms" }}>
            <span className="vd-s3-src-ic"><IconGlobe /></span>
            <span className="vd-s3-src-t">国外这么<span className="vd-accent">强</span>的模型</span>
          </div>
          <div className="vd-s3-gate">
            <span className="vd-s3-reason vd-fade" style={{ animationDelay: "3033ms" }}>因一些特殊原因</span>
            <span className="vd-s3-gate-ic vd-pop" style={{ animationDelay: "3033ms" }}><IconBan /></span>
          </div>
          <div className="vd-s3-blocked">
            <div className="vd-s3-no vd-pop" style={{ animationDelay: "3967ms" }}>
              <span className="vd-s3-x">✕</span>不给<b>中国</b>用
            </div>
            <div className="vd-s3-no vd-pop" style={{ animationDelay: "4667ms" }}>
              <span className="vd-s3-x">✕</span>或<b>其他国家</b>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s4 [223.966] 选型·国外 ───────── */
  if (step === 4) {
    return (
      <section className="vd-scene vd-s4" key="s4">
        <div className="vd-kicker vd-down" style={{ animationDelay: "0ms" }}>
          <span className="vd-dot" />真实选型 · WHAT TO USE
        </div>
        <div className="vd-s4-head vd-fade" style={{ animationDelay: "0ms" }}>
          给你一个<span className="vd-accent">真实的选型</span>
        </div>
        <div className="vd-pick-card vd-pick-in" style={{ animationDelay: "2734ms" }}>
          <div className="vd-pick-top">
            <span className="vd-pick-region">国外</span>
            <span className="vd-pick-cond vd-fade" style={{ animationDelay: "4167ms" }}>想便宜 · 量大 · 不封号</span>
          </div>
          <div className="vd-pick-arrow vd-fade" style={{ animationDelay: "6034ms" }}>→</div>
          <div className="vd-pick-combo">
            <span className="vd-pick-model vd-pop" style={{ animationDelay: "6034ms" }}>GPT-5.5</span>
            <span className="vd-pick-plus vd-fade" style={{ animationDelay: "6234ms" }}>＋</span>
            <span className="vd-pick-tool vd-pop" style={{ animationDelay: "6434ms" }}>
              <span className="vd-pick-tool-ic"><IconTerminal /></span>
              <span className="vd-pick-tool-t">Codex<em>编程工具</em></span>
            </span>
          </div>
          <div className="vd-pick-badge vd-stamp" style={{ animationDelay: "8434ms" }}>
            <span className="vd-pick-badge-ic"><IconCheck /></span>不错的选择
          </div>
        </div>
      </section>
    );
  }

  /* ───────── s5 [234.366] 选型·国内 + GPT-5.6 待开放 ───────── */
  return (
    <section className="vd-scene vd-s5" key="s5">
      <div className="vd-kicker vd-down" style={{ animationDelay: "0ms" }}>
        <span className="vd-dot" />国内选型 + 待开放 · CN & SOON
      </div>
      <div className="vd-s5-grid">
        {/* 国内推荐卡 */}
        <div className="vd-s5-pick vd-pick-in" style={{ animationDelay: "0ms" }}>
          <div className="vd-s5-region">国内</div>
          <div className="vd-s5-models">
            <span className="vd-s5-model vd-pop" style={{ animationDelay: "200ms" }}>GLM-5.2</span>
            <span className="vd-s5-or vd-fade" style={{ animationDelay: "400ms" }}>或</span>
            <span className="vd-s5-model vd-pop" style={{ animationDelay: "600ms" }}>DeepSeek V4 Pro</span>
          </div>
          <div className="vd-s5-with vd-fade" style={{ animationDelay: "2500ms" }}>
            <span className="vd-s5-plus">＋</span>
            <span className="vd-s5-cc vd-pop" style={{ animationDelay: "2500ms" }}>
              <span className="vd-s5-cc-ic"><IconTerminal /></span>Claude Code
            </span>
          </div>
          <div className="vd-s5-cap vd-stamp" style={{ animationDelay: "4467ms" }}>
            <span className="vd-s5-cap-ic"><IconCheck /></span>大多数开发任务也能干
          </div>
        </div>
        {/* GPT-5.6 待开放占位 */}
        <div className="vd-s5-soon vd-s5-soon-in" style={{ animationDelay: "6234ms" }}>
          <span className="vd-s5-soon-ic"><IconClock /></span>
          <div className="vd-s5-soon-name">GPT-5.6</div>
          <div className="vd-s5-soon-sub mono">SOL · TERRA · LUNA</div>
          <div className="vd-s5-soon-when vd-fade" style={{ animationDelay: "8400ms" }}>未来几周 · 真开放</div>
          <div className="vd-s5-soon-me vd-stamp" style={{ animationDelay: "9667ms" }}>第一时间实测</div>
        </div>
      </div>
    </section>
  );
}
