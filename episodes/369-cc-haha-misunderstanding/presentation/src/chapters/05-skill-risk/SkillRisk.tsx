import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ChapterStepProps } from "../../registry/types";
import "./skillRisk.css";

gsap.registerPlugin(useGSAP);

type Phase = "risk" | "market" | "permissions" | "scanner";
type RiskKey = "model" | "skill";
type MarketStage = "store" | "belief" | "drawer" | "zip" | "lens";

const riskLines: Array<{ key: RiskKey; label: string; title: string; body: string }> = [
  { key: "model", label: "入口 01", title: "上游模型", body: "返回什么，Agent 就可能照做什么" },
  { key: "skill", label: "入口 02", title: "Skill / Plugin / MCP", body: "把能力装进本地环境，再交给 Agent 调用" },
];

const packageCards = [
  { title: "Skill", meta: "工作流包", body: "说明、脚本、约定动作" },
  { title: "Plugin", meta: "服务桥", body: "把外部服务接进来" },
  { title: "MCP", meta: "工具服务", body: "把工具暴露给模型" },
];

const installModules = [
  { title: "剪辑", body: "视频流水线", cap: "ffmpeg / 渲染" },
  { title: "爬虫", body: "数据抓取", cap: "cookie / 网络" },
  { title: "部署", body: "自动上线", cap: "env / 令牌" },
];

const permissionNodes = [
  { id: "files", title: "读取", body: "项目文件" },
  { id: "write", title: "修改", body: "工作区" },
  { id: "shell", title: "执行", body: "本机命令" },
  { id: "net", title: "联网", body: "下载依赖" },
  { id: "secrets", title: "密钥", body: ".env / 密钥" },
];

const scannerFindings = [
  { title: "命令", body: "会执行安装命令", level: "high", badge: "高风险" },
  { title: "联网", body: "会下载远端二进制", level: "medium", badge: "中风险" },
  { title: "密钥", body: "触碰 env / 令牌文件", level: "high", badge: "高风险" },
  { title: "MCP", body: "会打开本地工具服务", level: "watch", badge: "留意" },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getPhase(step: number): Phase {
  if (step <= 1) return "risk";
  if (step <= 6) return "market";
  if (step <= 10) return "permissions";
  return "scanner";
}

function getMarketStage(step: number): MarketStage {
  if (step === 3) return "belief";
  if (step === 4) return "drawer";
  if (step === 5) return "zip";
  if (step >= 6) return "lens";
  return "store";
}

function getPermissionActive(step: number) {
  if (step === 8) return new Set(["files", "write", "shell", "net"]);
  if (step === 9) return new Set(["files", "secrets"]);
  if (step >= 10) return new Set(["files", "write", "shell", "net", "secrets"]);
  return new Set<string>();
}

function SignalNav() {
  return (
    <div className="sr-signal-nav sr-gsap-in" aria-hidden>
      <span>Agent 供应链</span>
      <i />
      <span>Skill 风险</span>
    </div>
  );
}

function TechMesh() {
  return (
    <div className="sr-mesh" aria-hidden>
      <div className="sr-mesh-line sr-mesh-line-a" />
      <div className="sr-mesh-line sr-mesh-line-b" />
      <div className="sr-mesh-line sr-mesh-line-c" />
      <div className="sr-mesh-dot sr-mesh-dot-a" />
      <div className="sr-mesh-dot sr-mesh-dot-b" />
      <div className="sr-mesh-dot sr-mesh-dot-c" />
    </div>
  );
}

function StepShell({ children, variant }: { children: React.ReactNode; variant: Phase }) {
  return (
    <section className={cx("sr-page", `sr-page--${variant}`)}>
      <SignalNav />
      {children}
    </section>
  );
}

function RiskScene({ active }: { active: RiskKey }) {
  return (
    <StepShell variant="risk">
      <div className="sr-risk-layout">
        <div className="sr-risk-copy">
          <div className="sr-kicker sr-gsap-in">风险面</div>
          <h2 className="sr-hero-title sr-gsap-in">
            <span>不是一条线</span>
            <span>是两条入口</span>
          </h2>
          <div className="sr-risk-chip-row sr-gsap-in" aria-hidden>
            <span>上游返回</span>
            <i />
            <span>本地能力</span>
          </div>
        </div>
        <div className="sr-risk-rails sr-gsap-in">
          {riskLines.map((line, index) => (
            <article
              className={cx("sr-risk-rail", active === line.key && "is-active", active !== line.key && "is-dim")}
              key={line.key}
            >
              <span>{line.label}</span>
              <strong>{line.title}</strong>
              <p>{line.body}</p>
              <b>0{index + 1}</b>
            </article>
          ))}
          <svg className="sr-risk-svg" viewBox="0 0 700 430" aria-hidden focusable="false">
            <path className="sr-draw sr-risk-path" d="M62 112 C186 42 316 70 430 142 S606 256 652 116" />
            <path className="sr-draw sr-risk-path is-soft" d="M58 318 C180 220 328 246 438 302 S584 378 650 282" />
          </svg>
        </div>
      </div>
    </StepShell>
  );
}

function MarketplaceScene({ step }: { step: number }) {
  const stage = getMarketStage(step);
  const activeInstall = stage === "drawer" ? 2 : stage === "zip" || stage === "lens" ? 3 : 0;

  return (
    <StepShell variant="market">
      <div className={cx("sr-market-layout", `sr-market-stage--${stage}`)}>
        <div className="sr-market-left">
          <div className="sr-kicker sr-gsap-in">安装入口</div>
          <div className="sr-package-grid sr-gsap-in">
            {packageCards.map((card, index) => (
              <article className={cx("sr-package-card", index <= Math.max(step - 2, 0) && "is-active")} key={card.title}>
                <span>{card.meta}</span>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
          <div className="sr-belief-strip sr-gsap-in">
            <span>误判</span>
            <strong>只是提示词包</strong>
            <i />
            <em>下面可能藏着动作</em>
          </div>
          <div className="sr-lens-card sr-gsap-in">
            <span>新视角</span>
            <strong>当代码看</strong>
          </div>
        </div>

        <div className="sr-install-drawer sr-gsap-in">
          <div className="sr-drawer-top">
            <span>安装队列</span>
            <strong>{stage === "zip" ? "group-share.zip" : "Skill 架子"}</strong>
          </div>
          <div className="sr-drawer-slots">
            {installModules.map((item, index) => (
              <article className={cx("sr-install-module", index < activeInstall && "is-active")} key={item.title}>
                <span>{item.title}</span>
                <strong>{item.body}</strong>
                <p>{item.cap}</p>
              </article>
            ))}
          </div>
          <div className={cx("sr-zip-flight", (stage === "zip" || stage === "lens") && "is-active")} aria-hidden>
            <span>压缩包</span>
            <i />
            <strong>主力环境</strong>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function PermissionScene({ step }: { step: number }) {
  const active = getPermissionActive(step);
  const gate = step >= 10;

  return (
    <StepShell variant="permissions">
      <div className={cx("sr-permission-layout", gate && "is-gated")}>
        <div className="sr-dossier sr-gsap-in">
          <div className="sr-dossier-title">
            <span>Skill 包</span>
            <strong>{step === 7 ? "不只是提示词" : "可执行上下文"}</strong>
          </div>
          <div className="sr-file-stack">
            <div className={cx("sr-file-row", step >= 7 && "is-active")}>
              <span>SKILL.md</span>
              <b>Agent 指令</b>
            </div>
            <div className={cx("sr-file-row", step >= 8 && "is-active")}>
              <span>scripts/install.sh</span>
              <b>运行命令</b>
            </div>
            <div className={cx("sr-file-row", step >= 8 && "is-active")}>
              <span>workflow.ts</span>
              <b>读写工作区</b>
            </div>
            <div className={cx("sr-file-row", step >= 9 && "is-hot")}>
              <span>.env · keys</span>
              <b>隐私边界</b>
            </div>
          </div>
          <div className="sr-code-strip">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="sr-permission-map sr-gsap-in" aria-label="Skill 权限地图">
          <svg viewBox="0 0 760 580" aria-hidden focusable="false">
            <path className={cx("sr-draw sr-perm-path", active.has("files") && "is-active")} d="M380 292 C280 176 204 144 118 112" />
            <path className={cx("sr-draw sr-perm-path", active.has("write") && "is-active")} d="M380 292 C268 330 210 400 104 470" />
            <path className={cx("sr-draw sr-perm-path", active.has("shell") && "is-active")} d="M380 292 C380 174 396 100 382 50" />
            <path className={cx("sr-draw sr-perm-path", active.has("net") && "is-active")} d="M380 292 C512 180 574 144 662 126" />
            <path className={cx("sr-draw sr-perm-path", active.has("secrets") && "is-active")} d="M380 292 C524 350 608 402 680 500" />
          </svg>
          <div className={cx("sr-agent-core", step >= 7 && "is-active")}>
            <span>Agent</span>
            <strong>{gate ? "先扫描" : "执行器"}</strong>
          </div>
          {permissionNodes.map((node) => (
            <article
              className={cx(
                "sr-perm-node",
                `sr-perm-node--${node.id}`,
                active.has(node.id) && "is-active",
                node.id === "secrets" && active.has(node.id) && "is-hot",
              )}
              key={node.id}
            >
              <span>{node.title}</span>
              <strong>{node.body}</strong>
            </article>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function ScannerScene({ step }: { step: number }) {
  const scanStep = Math.max(0, step - 11);
  const progress = scanStep === 0 ? 42 : scanStep === 1 ? 76 : 100;

  return (
    <StepShell variant="scanner">
      <div className={cx("sr-scanner-layout", `sr-scan-step-${scanStep}`)}>
        <div className="sr-scanner-panel sr-gsap-in">
          <div className="sr-scanner-head">
            <span>安装前检查</span>
            <strong>{scanStep >= 1 ? "Skill Vetter" : "手动扫描"}</strong>
          </div>
          {scanStep >= 1 && (
            <div className="sr-vetter-note">
              <span>安全优先审查</span>
              <p>
                安装来自 ClawdHub、GitHub 或其他来源的 Skill 前，先检查红旗、权限范围和可疑模式。
              </p>
            </div>
          )}
          <div className="sr-scan-track" aria-hidden>
            <i className="sr-scan-fill" data-level={progress} />
          </div>
          <div className="sr-finding-list">
            {scannerFindings.map((finding, index) => (
              <article
                className={cx(
                  "sr-finding",
                  `sr-finding--${finding.level}`,
                  index <= scanStep + 1 && "is-active",
                  scanStep >= 2 && finding.level === "high" && "is-blocking",
                )}
                key={`${finding.title}-${finding.body}`}
              >
                <span>{finding.title}</span>
                <strong>{finding.body}</strong>
                <b>{finding.badge}</b>
              </article>
            ))}
          </div>
        </div>

        <div className="sr-verdict-stage sr-gsap-in">
          <div className="sr-package-shell" aria-hidden>
            <div className="sr-package-lid" />
            <div className="sr-package-body">
              <span>待审包</span>
              <strong>先别装</strong>
            </div>
            <div className="sr-scan-beam" />
          </div>
          <div className={cx("sr-verdict", scanStep >= 2 && "is-active")}>
            <span>安装闸门</span>
            <strong>{scanStep >= 2 ? "先隔离复核" : "尚未安装"}</strong>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function renderScene(step: number, phase: Phase) {
  switch (phase) {
    case "risk":
      return <RiskScene active={step === 0 ? "model" : "skill"} />;
    case "market":
      return <MarketplaceScene step={step} />;
    case "permissions":
      return <PermissionScene step={step} />;
    case "scanner":
      return <ScannerScene step={step} />;
  }
}

export default function SkillRisk({ step }: ChapterStepProps) {
  const root = useRef<HTMLElement>(null);
  const phase = getPhase(step);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const entrants = scope.querySelectorAll(".sr-gsap-in");
      const paths = scope.querySelectorAll<SVGPathElement>(".sr-draw");
      const meters = scope.querySelectorAll<HTMLElement>(".sr-meter-fill, .sr-scan-fill");
      const still = document.body.classList.contains("qa-still");

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: still ? 0 : length });
      });
      if (meters.length > 0) gsap.set(meters, { transformOrigin: "left center" });

      if (still) {
        if (entrants.length > 0) gsap.set(entrants, { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 });
        meters.forEach((meter) => gsap.set(meter, { scaleX: Number(meter.dataset.level ?? "100") / 100 }));
        return;
      }

      if (entrants.length > 0) {
        gsap.fromTo(
          entrants,
          { opacity: 0, y: 34, filter: "blur(14px)", scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.64,
            ease: "power3.out",
            stagger: 0.045,
            clearProps: "opacity,transform,filter",
          },
        );
      }

      paths.forEach((path, index) => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.88 + index * 0.08,
          delay: 0.1 + index * 0.05,
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
      const meters = scope.querySelectorAll<HTMLElement>(".sr-meter-fill, .sr-scan-fill");

      meters.forEach((meter) => {
        const level = Number(meter.dataset.level ?? "100") / 100;
        gsap.killTweensOf(meter);
        gsap.set(meter, { transformOrigin: "left center" });
        if (still) {
          gsap.set(meter, { scaleX: level });
        } else {
          gsap.to(meter, { scaleX: level, duration: 0.48, ease: "power3.out", overwrite: true });
        }
      });
    },
    { scope: root, dependencies: [step] },
  );

  return (
    <main ref={root} className={cx("sr-shell", `sr-step-${step}`, `sr-phase-${phase}`)}>
      <TechMesh />
      {renderScene(step, phase)}
    </main>
  );
}
