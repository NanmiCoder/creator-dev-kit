import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ChapterStepProps } from "../../registry/types";
import "./OpenSourceAccused.css";

gsap.registerPlugin(useGSAP);

type StatKey = "stars" | "forks" | "downloads" | "releases";
type ScenePhase =
  | "origin"
  | "time"
  | "data"
  | "object"
  | "comment"
  | "threat"
  | "spread"
  | "reaction"
  | "proof"
  | "absurd";

const stats: Array<{ key: StatKey; label: string; value: string; body: string; level: number }> = [
  { key: "stars", label: "GitHub 星标", value: "13,000+", body: "被持续围观", level: 78 },
  { key: "forks", label: "分叉复查", value: "8,000+", body: "被拉走复查", level: 56 },
  { key: "downloads", label: "安装包", value: "110,000+", body: "安装包累计下载", level: 92 },
  { key: "releases", label: "公开版本", value: "13", body: "公开迭代版本", level: 46 },
];

const claimChain = [
  { word: "木马", note: "软件本体", body: "先把项目定性成恶意程序" },
  { word: "肉鸡", note: "机器控制", body: "再把电脑说成被远程接管" },
  { word: "IP 暴露", note: "网络身份", body: "继续扩展到网络身份泄露" },
  { word: "二次安装", note: "继续投放", body: "最后升级成可继续装木马" },
];

const spreadNodes = ["WiFi", "设备", "支付", "密码"];

const publicProof = [
  { title: "免费开源", body: "代码可以被任何人拉下来审" },
  { title: "多人使用", body: "下载量和分叉都在持续暴露问题" },
  { title: "公开代码", body: "仓库历史会留下每次变更轨迹" },
];

const dataSteps: StatKey[] = ["stars", "forks", "downloads", "releases"];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SignalNav() {
  return (
    <div className="oa-signal-nav oa-gsap-in" aria-hidden>
      <span>cc-haha</span>
      <i />
      <span>开源项目</span>
      <i />
      <span>信任链</span>
    </div>
  );
}

function TechMesh() {
  return (
    <div className="oa-mesh" aria-hidden>
      <div className="oa-mesh-line oa-mesh-line-a" />
      <div className="oa-mesh-line oa-mesh-line-b" />
      <div className="oa-mesh-line oa-mesh-line-c" />
      <div className="oa-mesh-dot oa-mesh-dot-a" />
      <div className="oa-mesh-dot oa-mesh-dot-b" />
      <div className="oa-mesh-dot oa-mesh-dot-c" />
    </div>
  );
}

function GithubMark() {
  return (
    <svg className="oa-github-mark" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56 4.56-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

function StepShell({ children, variant = "standard" }: { children: React.ReactNode; variant?: string }) {
  return (
    <section className={cx("oa-page", `oa-page--${variant}`)}>
      <SignalNav />
      {children}
    </section>
  );
}

function getScenePhase(step: number): ScenePhase {
  if (step <= 1) return "origin";
  if (step === 2) return "time";
  if (step <= 6) return "data";
  if (step === 7) return "object";
  if (step <= 10) return "comment";
  if (step <= 14) return "threat";
  if (step <= 16) return "spread";
  if (step === 17) return "reaction";
  if (step <= 20) return "proof";
  return "absurd";
}

function OriginScene({ focus }: { focus: "source" | "product" }) {
  const isProduct = focus === "product";
  return (
    <StepShell variant="origin">
      <div className="oa-origin-layout">
        <div className="oa-origin-copy">
          <div className="oa-kicker oa-gsap-in">{isProduct ? "争议对象" : "开源项目"}</div>
          <h1 className="oa-hero-title oa-gsap-in">
            <span>{isProduct ? "cc-haha" : "GitHub"}</span>
            <span>{isProduct ? "桌面端 Agent" : "公开仓库"}</span>
          </h1>
          <p className="oa-subline oa-gsap-in">
            {isProduct ? "争议指向的，是这个公开仓库和桌面端 Agent。" : "源码、来源和项目形态，都在公共视野里。"}
          </p>
        </div>
        <div className="oa-repo-panel oa-gsap-in" aria-hidden>
          <div className="oa-repo-topline">
            <div className="oa-github-badge">
              <GithubMark />
              <span>GitHub</span>
            </div>
            <span className="oa-public-pill">公开</span>
          </div>
          <div className={cx("oa-repo-name", isProduct && "is-active")}>
            <span>开源仓库</span>
            <strong>cc-haha</strong>
          </div>
          <div className="oa-repo-flow">
            <div className={cx("oa-repo-chip", !isProduct && "is-active")}>
              <span>来源</span>
              <strong>Claude Code 泄露源</strong>
            </div>
            <i />
            <div className={cx("oa-repo-chip", isProduct && "is-active")}>
              <span>形态</span>
              <strong>桌面端 Agent</strong>
            </div>
          </div>
          <div className="oa-repo-footer">
            <span>macOS</span>
            <span>Windows</span>
            <span>Linux</span>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function TimeScene() {
  return (
    <StepShell variant="time">
      <div className="oa-timeline-wrap">
        <div className="oa-big-number oa-gsap-in">3</div>
        <div className="oa-time-copy">
          <div className="oa-kicker oa-gsap-in">公开运行时间</div>
          <h2 className="oa-title oa-gsap-in">三个月，足够让项目暴露在真实使用里</h2>
          <div className="oa-rule oa-gsap-in" />
          <div className="oa-time-rail oa-gsap-in" aria-hidden>
            <span>开源</span>
            <div><b /></div>
            <span>现在</span>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function DataBentoScene({ active }: { active: StatKey }) {
  return (
    <StepShell variant="data">
      <div className="oa-bento">
        {stats.map((item) => (
          <article
            className={cx(
              "oa-card oa-stat-card oa-gsap-in",
              `oa-stat-card--${item.key}`,
              item.key === active ? "is-active" : "is-dim",
            )}
            key={item.key}
          >
            <span className="oa-card-label">{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.body}</p>
            <div className="oa-mini-meter"><i className="oa-bar-fill" data-level={item.level} /></div>
          </article>
        ))}
        <article className={cx("oa-card oa-bento-timeline oa-gsap-in", active === "releases" && "is-active")}>
          <span className="oa-card-label">公开轨迹</span>
          <div className="oa-release-line">
            {Array.from({ length: 13 }, (_, index) => (
              <i key={index} className={active === "releases" && index > 8 ? "is-hot" : ""} />
            ))}
          </div>
          <p>{active === "releases" ? "版本数被点亮，发布轨迹不是黑箱。" : "这些数字都暴露在公共视野里。"}</p>
        </article>
      </div>
    </StepShell>
  );
}

function ObjectScene() {
  return (
    <StepShell variant="object">
      <div className="oa-object-stage">
        <div className="oa-kicker oa-gsap-in">争议对象</div>
        <h2 className="oa-object-title oa-gsap-in">就这么个玩意</h2>
        <div className="oa-object-card oa-gsap-in">
          <span>仓库</span>
          <strong>cc-haha</strong>
          <i />
        </div>
      </div>
    </StepShell>
  );
}

function CommentScene({ phase }: { phase: "arrive" | "quote" | "say" }) {
  const title =
    phase === "arrive"
      ? "评论区突然落下一条指控"
      : phase === "quote"
        ? "先看原始证据，不替它加戏"
        : "他说";
  return (
    <StepShell variant="comment">
      <div className={cx("oa-comment-layout", `oa-comment-layout--${phase}`)}>
        <div className="oa-comment-copy">
          <div className="oa-kicker oa-gsap-in">评论区证据</div>
          <h2 className="oa-title oa-gsap-in">{title}</h2>
          <p className="oa-subline oa-gsap-in">
            {phase === "say" ? "这条评论把风险一路推到很远。" : "先看原始评论，再看指控如何加码。"}
          </p>
        </div>
        <figure className="oa-comment-shot oa-gsap-in oa-image-scale">
          <img src={`${import.meta.env.BASE_URL}media/comment-malware-claim.png`} alt="评论截图" />
          <span className={cx("oa-comment-scan", phase !== "arrive" && "is-running")} aria-hidden />
          <figcaption>证据截图 · 2026-07-08</figcaption>
        </figure>
      </div>
    </StepShell>
  );
}

function ThreatChainScene({ active }: { active: number }) {
  return (
    <StepShell variant="threat">
      <div className="oa-threat-layout">
        <div className="oa-kicker oa-gsap-in">指控开始升级</div>
        <div className="oa-accordion" aria-label="安全指控链条">
          {claimChain.map((item, index) => (
            <article
              className={cx("oa-claim-slice", "oa-gsap-in", index === active && "is-primary", index < active && "is-past")}
              key={item.word}
            >
              <span>{item.note}</span>
              <strong>{item.word}</strong>
              <p>{item.body}</p>
              <i className="oa-claim-index">0{index + 1}</i>
            </article>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function SpreadScene({ activeUntil }: { activeUntil: number }) {
  return (
    <StepShell variant="spread">
      <div className="oa-spread-grid">
        <div className="oa-spread-copy">
          <div className="oa-kicker oa-gsap-in">影响面被一路放大</div>
          <h2 className="oa-title oa-gsap-in">
            {activeUntil < 2 ? "从 WiFi，跳到家里所有设备" : "从支付，再跳到密码"}
          </h2>
        </div>
        <div className="oa-network-map oa-gsap-in" aria-hidden>
          <svg viewBox="0 0 760 420" role="img">
            <path className="oa-draw oa-network-path" d="M74 212 C176 66 316 78 398 202 S594 356 690 118" />
            <path className="oa-draw oa-network-path is-soft" d="M84 248 C244 310 380 284 508 232 S622 156 704 282" />
          </svg>
          {spreadNodes.map((node, index) => (
            <div className={cx("oa-node", `oa-node-${index}`, index <= activeUntil && "is-active")} key={node}>
              <span>{node}</span>
            </div>
          ))}
        </div>
        <div className="oa-risk-bars oa-gsap-in">
          {spreadNodes.map((node, index) => (
            <div className={cx("oa-risk-row", index <= activeUntil && "is-active")} key={node}>
              <span>{node}</span>
              <div><i className="oa-bar-fill" data-level={index <= activeUntil ? (index + 2) * 20 : 8} /></div>
            </div>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function ReactionScene() {
  return (
    <StepShell variant="reaction">
      <div className="oa-reaction">
        <div className="oa-gauge oa-gsap-in" aria-hidden>
          <svg viewBox="0 0 520 300">
            <path className="oa-gauge-base" d="M70 254 A190 190 0 0 1 450 254" />
            <path className="oa-draw oa-gauge-hot" d="M70 254 A190 190 0 0 1 450 254" />
            <line className="oa-gauge-needle" x1="260" y1="254" x2="404" y2="112" />
          </svg>
        </div>
        <div className="oa-reaction-copy">
          <div className="oa-kicker oa-gsap-in">情绪拐点</div>
          <h2 className="oa-title oa-gsap-in">不是害怕，是被离谱链路激怒</h2>
          <p className="oa-subline oa-gsap-in">离谱链路越拉越长，真正需要的是证据。</p>
        </div>
      </div>
    </StepShell>
  );
}

function PublicProofScene({ active }: { active: number }) {
  return (
    <StepShell variant="proof">
      <div className="oa-proof-layout">
        <div className="oa-proof-copy">
          <div className="oa-kicker oa-gsap-in">反向证据</div>
          <h2 className="oa-title oa-gsap-in">公开，是开源项目最基本的压力测试</h2>
        </div>
        <div className="oa-proof-cards">
          {publicProof.map((item, index) => (
            <article className={cx("oa-proof-card oa-stack-card", index === active && "is-active", index < active && "is-past")} key={item.title}>
              <span>0{index + 1}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function AbsurdScene() {
  const items = [
    { label: "路由器", meta: "家庭网关" },
    { label: "WiFi", meta: "本地网络" },
    { label: "支付", meta: "支付层" },
    { label: "密码", meta: "凭据核心" },
  ];
  return (
    <StepShell variant="absurd">
      <div className="oa-absurd-layout">
        <div className="oa-absurd-copy">
          <div className="oa-kicker oa-gsap-in">荒诞落点</div>
          <h2 className="oa-final-title oa-gsap-in">
            <span>威胁半径</span>
            <span>被拉满</span>
          </h2>
          <p className="oa-subline oa-gsap-in">家用网络、支付系统、凭证核心，被硬串成一条线。</p>
          <div className="oa-next-cue oa-gsap-in">旧指控也曾这样扩散</div>
        </div>
        <div className="oa-radius-stage oa-gsap-in" aria-hidden>
          <svg className="oa-radius-svg" viewBox="0 0 760 600">
            <circle className="oa-radius-ring oa-radius-ring-1" cx="284" cy="300" r="86" />
            <circle className="oa-radius-ring oa-radius-ring-2" cx="284" cy="300" r="168" />
            <circle className="oa-radius-ring oa-radius-ring-3" cx="284" cy="300" r="252" />
            <path className="oa-draw oa-radius-path" d="M284 300 C368 246 430 218 500 236 S628 320 666 176" />
            <path className="oa-radius-path-soft" d="M284 300 C374 356 470 360 536 304 S628 216 666 176" />
          </svg>
          <div className="oa-radius-core">
            <span>评论</span>
            <strong>评论</strong>
          </div>
          {items.map((item, index) => (
            <div className={cx("oa-radius-node", `oa-radius-node-${index}`, index === items.length - 1 && "is-final")} key={item.label}>
              <span>{item.meta}</span>
              <strong>{item.label}</strong>
            </div>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function renderScene(step: number, phase: ScenePhase) {
  switch (phase) {
    case "origin":
      return <OriginScene focus={step === 0 ? "source" : "product"} />;
    case "time":
      return <TimeScene />;
    case "data":
      return <DataBentoScene active={dataSteps[Math.min(Math.max(step - 3, 0), dataSteps.length - 1)]!} />;
    case "object":
      return <ObjectScene />;
    case "comment":
      return <CommentScene phase={step === 8 ? "arrive" : step === 9 ? "quote" : "say"} />;
    case "threat":
      return <ThreatChainScene active={Math.min(Math.max(step - 11, 0), claimChain.length - 1)} />;
    case "spread":
      return <SpreadScene activeUntil={step === 15 ? 1 : 3} />;
    case "reaction":
      return <ReactionScene />;
    case "proof":
      return <PublicProofScene active={Math.min(Math.max(step - 18, 0), publicProof.length - 1)} />;
    case "absurd":
      return <AbsurdScene />;
  }
}

export default function OpenSourceAccused({ step }: ChapterStepProps) {
  const root = useRef<HTMLElement>(null);
  const phase = getScenePhase(step);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const entrants = scope.querySelectorAll(".oa-gsap-in");
      const bars = scope.querySelectorAll<HTMLElement>(".oa-bar-fill");
      const paths = scope.querySelectorAll<SVGPathElement>(".oa-draw");
      const stackCards = scope.querySelectorAll<HTMLElement>(".oa-stack-card");
      const still = document.body.classList.contains("qa-still");

      if (bars.length > 0) gsap.set(bars, { transformOrigin: "left center" });
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: still ? 0 : length });
      });

      if (still) {
        if (entrants.length > 0) gsap.set(entrants, { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 });
        bars.forEach((bar) => gsap.set(bar, { scaleX: Number(bar.dataset.level ?? "100") / 100 }));
        if (stackCards.length > 0) gsap.set(stackCards, { clearProps: "opacity,transform" });
        return;
      }

      if (bars.length > 0) gsap.set(bars, { scaleX: 0 });

      if (entrants.length > 0) {
        gsap.fromTo(
          entrants,
          { opacity: 0, y: 30, filter: "blur(14px)", scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.62,
            ease: "power3.out",
            stagger: 0.045,
            clearProps: "opacity,transform,filter",
          },
        );
      }

      paths.forEach((path, index) => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.92 + index * 0.12,
          delay: 0.12 + index * 0.08,
          ease: "power2.out",
        });
      });

      stackCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 72 + index * 14, rotate: index % 2 === 0 ? -4 : 4 },
          {
            opacity: 1,
            y: index * 18,
            rotate: index % 2 === 0 ? -1.6 : 1.6,
            duration: 0.62,
            delay: 0.08 + index * 0.06,
            ease: "back.out(1.45)",
            clearProps: "opacity,transform",
          },
        );
      });

      const imageScale = scope.querySelectorAll(".oa-image-scale");
      if (imageScale.length > 0) {
        gsap.fromTo(
          imageScale,
          { opacity: 0.2, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.72, ease: "power3.out", clearProps: "opacity,transform" },
        );
      }
    },
    { scope: root, dependencies: [phase], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const still = document.body.classList.contains("qa-still");
      const bars = scope.querySelectorAll<HTMLElement>(".oa-bar-fill");

      bars.forEach((bar) => {
        const level = Number(bar.dataset.level ?? "100") / 100;
        gsap.killTweensOf(bar);
        gsap.set(bar, { transformOrigin: "left center" });
        if (still) {
          gsap.set(bar, { scaleX: level });
        } else {
          gsap.to(bar, { scaleX: level, duration: 0.46, ease: "power3.out", overwrite: true });
        }
      });
    },
    { scope: root, dependencies: [step] },
  );

  return (
    <main ref={root} className={cx("oa-shell", `oa-step-${step}`, `oa-phase-${phase}`)}>
      <TechMesh />
      {renderScene(step, phase)}
    </main>
  );
}
