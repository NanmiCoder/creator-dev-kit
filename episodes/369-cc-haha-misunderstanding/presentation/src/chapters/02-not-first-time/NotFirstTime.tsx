import { useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ChapterStepProps } from "../../registry/types";
import "./notFirstTime.css";

gsap.registerPlugin(useGSAP);

type ScenePhase = "memory" | "case" | "route" | "facts" | "scanner" | "repo";

const evidenceRail = [
  { label: "不是第一次", meta: "旧模式" },
  { label: "刚开源", meta: "刚开源" },
  { label: "旧指控", meta: "木马指控" },
  { label: "木马很忙", meta: "荒诞载荷" },
];

const busyTasks = [
  { label: "控聊天", meta: "聊天软件" },
  { label: "自动发", meta: "自动消息" },
  { label: "跨桌面", meta: "桌面端" },
  { label: "去表白", meta: "表白链路" },
];

const routeNodes = [
  { label: "Electron", meta: "桌面应用" },
  { label: "网卡", meta: "网络" },
  { label: "聊天软件", meta: "微信进程" },
  { label: "搞对象", meta: "表白链路" },
];

const acceptableConcerns = [
  { label: "缺陷", meta: "可复现" },
  { label: "功能不好用", meta: "可改进" },
  { label: "安全隐患", meta: "可讨论" },
];

const threatChips = ["木马", "肉鸡", "WiFi 中毒", "支付密码"];

const scanRows = [
  { label: "Windows 未签名", meta: "未签名安装包", level: 74 },
  { label: "Computer Use 能力", meta: "能截屏、点鼠标、敲键盘", level: 88 },
  { label: "启发式引擎", meta: "行为像远控", level: 92 },
  { label: "木马证据", meta: "代码证据缺席", level: 12 },
];

const scannerBeats = [
  {
    title: "360 报毒",
    header: "报毒",
    subline: "先看触发点，不直接下结论。",
    currentRow: 0,
    visibleRows: 1,
    verdict: false,
  },
  {
    title: "未签名 + 控制能力",
    header: "风险特征",
    subline: "Windows 未签名，加上截屏、鼠标、键盘能力，会把风险分拉高。",
    currentRow: 1,
    visibleRows: 2,
    verdict: false,
  },
  {
    title: "行为像远控",
    header: "行为匹配",
    subline: "这些动作在杀软眼里，很像远程控制类行为。",
    currentRow: 2,
    visibleRows: 3,
    verdict: false,
  },
  {
    title: "启发式标红",
    header: "直接标红",
    subline: "启发式引擎看到相似动作，会先把风险标出来。",
    currentRow: 2,
    visibleRows: 3,
    verdict: false,
  },
  {
    title: "结论：误报",
    header: "误报",
    subline: "这解释的是报毒原因，不等于项目里有木马。",
    currentRow: 3,
    visibleRows: 4,
    verdict: true,
  },
] as const;

const repoSignals = [
  { label: "公开仓库", value: "GitHub", meta: "源码暴露" },
  { label: "项目时间", value: "3+ 月", meta: "持续围观" },
  { label: "星标", value: "1.3 万+", meta: "公开审视" },
  { label: "分叉", value: "8000+", meta: "可拉取复查" },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getScenePhase(step: number): ScenePhase {
  if (step <= 3) return "memory";
  if (step <= 6) return "case";
  if (step <= 10) return "route";
  if (step <= 13) return "facts";
  if (step <= 18) return "scanner";
  return "repo";
}

function SignalNav() {
  return (
    <div className="nt-signal-nav nt-gsap-in" aria-hidden>
      <span>旧指控</span>
      <i />
      <span>不是第一次</span>
      <i />
      <span>误报链路</span>
    </div>
  );
}

function TechMesh() {
  return (
    <div className="nt-mesh" aria-hidden>
      <div className="nt-mesh-line nt-mesh-line-a" />
      <div className="nt-mesh-line nt-mesh-line-b" />
      <div className="nt-mesh-line nt-mesh-line-c" />
      <div className="nt-mesh-dot nt-mesh-dot-a" />
      <div className="nt-mesh-dot nt-mesh-dot-b" />
      <div className="nt-mesh-dot nt-mesh-dot-c" />
    </div>
  );
}

function GithubMark() {
  return (
    <svg className="nt-github-mark" viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56 4.56-1.52 7.85-5.83 7.85-10.91C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

function StepShell({ children, variant }: { children: ReactNode; variant: ScenePhase }) {
  return (
    <section className={cx("nt-page", `nt-page--${variant}`)}>
      <SignalNav />
      {children}
    </section>
  );
}

function EvidenceRail({ active }: { active: number }) {
  return (
    <div className="nt-evidence-rail nt-gsap-in" aria-label="过往指控证据轨">
      {evidenceRail.map((item, index) => (
        <article
          className={cx(
            "nt-rail-item",
            index === active && "is-active",
            index < active && "is-past",
          )}
          key={item.label}
        >
          <span>0{index + 1}</span>
          <strong>{item.label}</strong>
          <em>{item.meta}</em>
        </article>
      ))}
    </div>
  );
}

function BusyPanel({ active }: { active: number }) {
  return (
    <div className={cx("nt-busy-panel nt-gsap-in", active >= 3 && "is-running")} aria-hidden>
      <div className="nt-busy-topline">
        <span>离谱任务队列</span>
        <strong>{active >= 3 ? "忙不过来" : "空闲"}</strong>
      </div>
      <div className="nt-busy-grid">
        {busyTasks.map((task, index) => (
          <div className="nt-busy-task" key={task.label}>
            <span>{task.meta}</span>
            <strong>{task.label}</strong>
            <i style={{ animationDelay: `${index * 120}ms` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryScene({ step }: { step: number }) {
  const active = Math.min(step, evidenceRail.length - 1);
  const title =
    step === 0
      ? "不是第一次"
      : step === 1
        ? "刚开源，就被贴标签"
        : step === 2
          ? "旧指控：植入木马"
          : "这木马还挺忙";

  return (
    <StepShell variant="memory">
      <div className="nt-memory-layout">
        <div className="nt-memory-copy">
          <div className="nt-kicker nt-gsap-in">历史回放</div>
          <h1 className="nt-hero-title nt-gsap-in">{title}</h1>
          <p className="nt-subline nt-gsap-in">
            同一类安全指控会反复出现，关键不是情绪，而是链路能不能说清。
          </p>
        </div>
        <div className="nt-memory-board">
          <EvidenceRail active={active} />
          <BusyPanel active={active} />
        </div>
      </div>
    </StepShell>
  );
}

function ChatWindow({ active }: { active: number }) {
  return (
    <div className={cx("nt-chat-window nt-gsap-in", `nt-chat-active-${active}`)} aria-hidden>
      <div className="nt-chat-toolbar">
        <span />
        <span />
        <span />
        <strong>wx.exe</strong>
      </div>
      <div className="nt-chat-body">
        <div className="nt-chat-control">
          <span>控制层</span>
          <strong>聊天软件</strong>
        </div>
        <div className="nt-message-stack">
          <div className="nt-msg nt-msg-muted">同学</div>
          <div className="nt-msg nt-msg-active">自动表白</div>
          <div className="nt-send-line"><i /></div>
        </div>
      </div>
    </div>
  );
}

function CaseScene({ step }: { step: number }) {
  const active = Math.min(Math.max(step - 4, 0), 2);
  const title =
    active === 0 ? "控了聊天软件" : active === 1 ? "替他发了消息" : "作者当场懵住";

  return (
    <StepShell variant="case">
      <div className="nt-case-layout">
        <div className="nt-case-left">
          <div className="nt-kicker nt-gsap-in">旧案内容</div>
          <h2 className="nt-title nt-gsap-in">{title}</h2>
          <div className="nt-case-stack nt-gsap-in">
            <article className={cx("nt-case-card", active === 0 && "is-active")}>
              <span>目标</span>
              <strong>聊天软件</strong>
            </article>
            <article className={cx("nt-case-card", active === 1 && "is-active")}>
              <span>动作</span>
              <strong>自动发送</strong>
            </article>
            <article className={cx("nt-case-card", active === 2 && "is-active")}>
              <span>反应</span>
              <strong>啊??</strong>
            </article>
          </div>
        </div>
        <div className="nt-case-visual">
          <ChatWindow active={active} />
          <div className={cx("nt-shock-meter nt-gsap-in", active === 2 && "is-active")}>
            <span>作者状态</span>
            <strong>懵</strong>
            <div><i className="nt-bar-fill" data-level={active === 2 ? 96 : 28} /></div>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function RouteScene({ step }: { step: number }) {
  const active = Math.min(Math.max(step - 7, 0), 3);
  const isPunchline = active === 3;

  return (
    <StepShell variant="route">
      <div className="nt-route-layout">
        <div className="nt-route-copy">
          <div className="nt-kicker nt-gsap-in">荒诞路径</div>
          <h2 className="nt-title nt-gsap-in">
            {isPunchline ? "真有这本事，别开源了" : "一个仓库要跑完这条路"}
          </h2>
          <p className="nt-subline nt-gsap-in">
            把指控翻成系统路径，离谱感就会自己暴露出来。
          </p>
        </div>
        <div className={cx("nt-route-map", "nt-gsap-in", `nt-route-active-${active}`)} aria-hidden>
          <svg viewBox="0 0 980 520">
            <path
              className="nt-route-soft"
              d="M96 280 C210 74 384 116 474 252 S640 446 800 392"
            />
            <path
              className="nt-draw nt-route-main"
              d="M96 280 C210 74 384 116 474 252 S640 446 800 392"
            />
          </svg>
          <div className="nt-route-runner" />
          {routeNodes.map((node, index) => (
            <article
              className={cx(
                "nt-route-node",
                `nt-route-node-${index}`,
                index <= active && "is-active",
                index < active && "is-past",
              )}
              key={node.label}
            >
              <span>{node.meta}</span>
              <strong>{node.label}</strong>
            </article>
          ))}
          <div className={cx("nt-marriage-card", isPunchline && "is-active")}>
            <span>新业务</span>
            <strong>婚介所</strong>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function FactsScene({ step }: { step: number }) {
  const mode = step === 11 ? "reset" : step === 12 ? "review" : "pile";

  return (
    <StepShell variant="facts">
      <div className={cx("nt-facts-layout", `nt-facts-${mode}`)}>
        <div className="nt-facts-copy">
          <div className="nt-kicker nt-gsap-in">回到事实层</div>
          <h2 className="nt-title nt-gsap-in">
            {mode === "reset"
              ? "玩笑归玩笑"
              : mode === "review"
                ? "质疑可以，给链路"
                : "扣帽子会把问题搅浑"}
          </h2>
        </div>
        <div className="nt-facts-board nt-gsap-in">
          <div className="nt-accepted-column">
            <span className="nt-board-label">可以讨论</span>
            {acceptableConcerns.map((item) => (
              <article
                className={cx("nt-accepted-card", mode === "review" && "is-active")}
                key={item.label}
              >
                <span>{item.meta}</span>
                <strong>{item.label}</strong>
              </article>
            ))}
          </div>
          <div className="nt-divider-core">
            <span>{mode === "pile" ? "标签 ≠ 证据" : "事实"}</span>
          </div>
          <div className="nt-threat-column">
            <span className="nt-board-label">指控堆叠</span>
            <div className={cx("nt-threat-pot", mode === "pile" && "is-active")}>
              <strong>cc-haha</strong>
              {threatChips.map((chip, index) => (
                <span
                  className="nt-threat-chip"
                  style={{ animationDelay: `${index * 150}ms` }}
                  key={chip}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function ScannerScene({ step }: { step: number }) {
  const active = Math.min(Math.max(step - 14, 0), scannerBeats.length - 1);
  const beat = scannerBeats[active]!;

  return (
    <StepShell variant="scanner">
      <div className="nt-scanner-layout">
        <div className="nt-scanner-copy">
          <div className="nt-kicker nt-gsap-in">误报链路</div>
          <h2 className="nt-title nt-gsap-in">{beat.title}</h2>
          <p className="nt-subline nt-gsap-in">{beat.subline}</p>
        </div>
        <div className={cx("nt-scanner-panel", "nt-gsap-in", `nt-scan-active-${active}`, beat.verdict && "is-verdict")}>
          <div className="nt-scanner-header">
            <span>360 扫描</span>
            <strong>{beat.header}</strong>
          </div>
          <div className="nt-scan-strip" aria-hidden>
            {Array.from({ length: 18 }, (_, index) => (
              <i key={index} />
            ))}
          </div>
          <div className="nt-scan-rows">
            {scanRows.map((row, index) => (
              <article
                className={cx(
                  "nt-scan-row",
                  index < beat.visibleRows && "is-active",
                  index === beat.currentRow && "is-current",
                  index === 3 && !beat.verdict && "is-muted",
                )}
                key={row.label}
              >
                <div>
                  <span>{row.label}</span>
                  <strong>{row.meta}</strong>
                </div>
                <div className="nt-scan-meter">
                  <i
                    className="nt-bar-fill"
                    data-level={index < beat.visibleRows ? row.level : 6}
                  />
                </div>
              </article>
            ))}
          </div>
          <div className={cx("nt-verdict-card", beat.verdict && "is-active")}>
            <span>结论</span>
            <strong>跟有没有毒没关系</strong>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function RepoScene() {
  return (
    <StepShell variant="repo">
      <div className="nt-repo-layout">
        <div className="nt-repo-copy">
          <div className="nt-kicker nt-gsap-in">公开环境</div>
          <h2 className="nt-title nt-gsap-in">开源仓库不是黑箱</h2>
          <p className="nt-subline nt-gsap-in">
            代码、历史、下载、分叉都在外面；真藏东西，暴露面会反过来追着你跑。
          </p>
        </div>
        <div className="nt-repo-panel nt-gsap-in" aria-hidden>
          <div className="nt-repo-top">
            <div className="nt-github-badge">
              <GithubMark />
              <span>GitHub</span>
            </div>
            <strong>公开</strong>
          </div>
          <div className="nt-repo-name">
            <span>仓库</span>
            <strong>cc-haha</strong>
          </div>
          <div className="nt-repo-signal-grid">
            {repoSignals.map((signal) => (
              <article className="nt-repo-signal" key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <em>{signal.meta}</em>
              </article>
            ))}
          </div>
          <div className="nt-exposure-line">
            <i className="nt-bar-fill" data-level={92} />
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function renderScene(step: number, phase: ScenePhase) {
  switch (phase) {
    case "memory":
      return <MemoryScene step={step} />;
    case "case":
      return <CaseScene step={step} />;
    case "route":
      return <RouteScene step={step} />;
    case "facts":
      return <FactsScene step={step} />;
    case "scanner":
      return <ScannerScene step={step} />;
    case "repo":
      return <RepoScene />;
  }
}

export default function NotFirstTime({ step }: ChapterStepProps) {
  const root = useRef<HTMLElement>(null);
  const phase = getScenePhase(step);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const entrants = scope.querySelectorAll(".nt-gsap-in");
      const bars = scope.querySelectorAll<HTMLElement>(".nt-bar-fill");
      const paths = scope.querySelectorAll<SVGPathElement>(".nt-draw");
      const still = document.body.classList.contains("qa-still");

      if (bars.length > 0) gsap.set(bars, { transformOrigin: "left center" });
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: still ? 0 : length });
      });

      if (still) {
        if (entrants.length > 0) gsap.set(entrants, { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 });
        bars.forEach((bar) => gsap.set(bar, { scaleX: Number(bar.dataset.level ?? "100") / 100 }));
        return;
      }

      if (bars.length > 0) gsap.set(bars, { scaleX: 0 });
      if (entrants.length > 0) {
        gsap.fromTo(
          entrants,
          { opacity: 0, y: 28, filter: "blur(14px)", scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.58,
            ease: "power3.out",
            stagger: 0.045,
            clearProps: "opacity,transform,filter",
          },
        );
      }

      paths.forEach((path, index) => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.92 + index * 0.1,
          delay: 0.12,
          ease: "power2.out",
        });
      });
    },
    { scope: root, dependencies: [phase], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const still = document.body.classList.contains("qa-still");
      const bars = scope.querySelectorAll<HTMLElement>(".nt-bar-fill");

      bars.forEach((bar) => {
        const level = Number(bar.dataset.level ?? "100") / 100;
        gsap.killTweensOf(bar);
        gsap.set(bar, { transformOrigin: "left center" });
        if (still) {
          gsap.set(bar, { scaleX: level });
        } else {
          gsap.to(bar, { scaleX: level, duration: 0.48, ease: "power3.out", overwrite: true });
        }
      });
    },
    { scope: root, dependencies: [step] },
  );

  return (
    <main ref={root} className={cx("nt-shell", `nt-step-${step}`, `nt-phase-${phase}`)}>
      <TechMesh />
      {renderScene(step, phase)}
    </main>
  );
}
