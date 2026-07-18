import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ChapterStepProps } from "../../registry/types";
import "./trustAndClose.css";

gsap.registerPlugin(useGSAP);

type ScenePhase = "rubric" | "record" | "emotion" | "close";

const rubricCards = [
  {
    title: "备案 / 主体",
    meta: "能追到运营者",
    body: "国内中转先看备案、公司主体、服务条款。",
  },
  {
    title: "体量 / 口碑",
    meta: "长期有人使用",
    body: "优先知名度更高、运营时间更长的服务。",
  },
  {
    title: "官方 / 可追责",
    meta: "信任链更短",
    body: "能走官方就走官方，出了事知道敲谁的门。",
  },
];

const pipelineNodes = [
  { title: "提示词", meta: "你的文件与命令" },
  { title: "中转站", meta: "服务入口" },
  { title: "模型", meta: "上游返回" },
  { title: "Agent", meta: "本地执行" },
];

const recordMarkers = ["2019", "2021", "2023", "2026"];

const emotionBeats = [
  { title: "生气", meta: "无证据定性", body: "技术问题可以聊，先扣恶意动机不行。" },
  { title: "拉黑", meta: "停止消耗", body: "不把评论区变成无限辩护场。" },
  { title: "难受", meta: "免费交付被倒扣风险", body: "开源不是免疫质疑，但也不该被随手定罪。" },
];

const closePills = ["模型入口", "Skill", "开源"];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getScenePhase(step: number): ScenePhase {
  if (step <= 3) return "rubric";
  if (step <= 6) return "record";
  if (step <= 10) return "emotion";
  return "close";
}

function StepShell({ children, variant }: { children: React.ReactNode; variant: ScenePhase }) {
  return (
    <section className={cx("tc-page", `tc-page--${variant}`)}>
      <div className="tc-signal-nav tc-gsap-in" aria-hidden>
        <span>cc-haha</span>
        <i />
        <span>信任</span>
        <i />
        <span>收束</span>
      </div>
      {children}
    </section>
  );
}

function TechBackdrop() {
  return (
    <div className="tc-backdrop" aria-hidden>
      <div className="tc-grid-line tc-grid-line-a" />
      <div className="tc-grid-line tc-grid-line-b" />
      <div className="tc-grid-line tc-grid-line-c" />
      <div className="tc-field-dot tc-field-dot-a" />
      <div className="tc-field-dot tc-field-dot-b" />
      <div className="tc-field-dot tc-field-dot-c" />
    </div>
  );
}

function RelayRubricScene({ step }: { step: number }) {
  const activeCard = step <= 1 ? -1 : step === 2 ? 0 : 1;
  const activeNode = step === 0 ? 2 : step === 1 ? 1 : step === 2 ? 1 : 3;

  return (
    <StepShell variant="rubric">
      <div className="tc-rubric-layout">
        <div className="tc-rubric-copy">
          <div className="tc-kicker tc-gsap-in">模型中转的信任入口</div>
          <h1 className="tc-rubric-title tc-gsap-in">
            {step === 0 ? "先问模型是谁递来的" : step === 1 ? "中转站不是一个 URL" : "挑能被看见的服务"}
          </h1>
          <p className="tc-subline tc-gsap-in">
            {step === 0
              ? "Agent 的动作从上游返回开始，信任链要从模型入口查起。"
              : step === 1
                ? "它夹在你和模型之间，也夹在命令返回的路上。"
                : "不是绝对安全，只是黑箱更少、责任边界更清楚。"}
          </p>
        </div>

        <div className="tc-provider-board tc-gsap-in">
          <div className="tc-board-topline">
            <span>中转判断</span>
            <strong>{step < 2 ? "先定位链路" : step === 2 ? "看主体" : "看规模"}</strong>
          </div>
          <div className="tc-pipeline" aria-label="模型信任链">
            <svg viewBox="0 0 820 180" aria-hidden focusable="false">
              <path className="tc-draw tc-pipeline-path" d="M84 92 C214 32 304 152 412 92 S610 38 742 92" />
              <path className="tc-draw tc-pipeline-path tc-pipeline-path-soft" d="M84 126 C246 168 396 22 540 86 S666 128 742 126" />
            </svg>
            {pipelineNodes.map((node, index) => (
              <article
                className={cx("tc-pipeline-node", "tc-local-pop", index === activeNode && "is-active", index < activeNode && "is-past")}
                key={node.title}
              >
                <span>{node.meta}</span>
                <strong>{node.title}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="tc-rubric-cards">
          {rubricCards.map((card, index) => (
            <article
              className={cx(
                "tc-rubric-card",
                "tc-gsap-in",
                "tc-local-pop",
                index === activeCard && "is-active",
                index < activeCard && "is-past",
              )}
              key={card.title}
            >
              <span>{card.meta}</span>
              <strong>{card.title}</strong>
              <p>{card.body}</p>
              <div className="tc-card-meter">
                <i className="tc-meter-fill" data-level={index <= activeCard ? 86 - index * 14 : 12} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function RecordScene({ step }: { step: number }) {
  const recordBeat = Math.max(0, step - 4);
  const accusation = recordBeat >= 2;
  const title =
    recordBeat === 0
      ? ["多年开源", "长期记录"]
      : recordBeat === 1
        ? ["多年开源", "7–8 万星标"]
        : ["重指控", "投毒帽子"];
  const subline =
    recordBeat === 0
      ? "时间、使用者、审视和反馈，先构成一条公开轨迹。"
      : recordBeat === 1
        ? "星标不是免死金牌，但说明它一直暴露在公共视野里。"
        : "没有证据链时，这不是技术反馈，是很重的定性。";
  const coreLabel = recordBeat === 0 ? "公开记录" : "公开作品";
  const coreTitle = recordBeat === 0 ? "轨迹" : "星标";

  return (
    <StepShell variant="record">
      <div className="tc-record-layout">
        <div className="tc-record-copy">
          <div className="tc-kicker tc-gsap-in">长期公开记录</div>
          <h2 className="tc-record-title tc-gsap-in">
            <span>{title[0]}</span>
            <span>{title[1]}</span>
          </h2>
          <p className="tc-subline tc-gsap-in">{subline}</p>
        </div>

        <div className={cx("tc-record-stage", accusation && "is-accused")}>
          <svg className="tc-record-svg tc-gsap-in" viewBox="0 0 900 520" aria-hidden focusable="false">
            <path className="tc-draw tc-record-line" d="M80 338 C210 206 330 380 450 244 S690 126 820 248" />
            <path className="tc-draw tc-record-line tc-record-line-soft" d="M80 398 C248 438 360 196 514 292 S704 364 820 164" />
          </svg>
          {recordMarkers.map((marker, index) => (
            <div className={cx("tc-record-marker", `tc-record-marker-${index}`, !accusation && "is-active")} key={marker}>
              <span>{marker}</span>
            </div>
          ))}
          <div className={cx("tc-star-core", "tc-gsap-in", accusation && "is-muted")}>
            <span>{coreLabel}</span>
            <strong>{coreTitle}</strong>
          </div>
          <article className={cx("tc-accusation-weight", "tc-local-pop", accusation && "is-active")}>
            <span>重指控</span>
            <strong>投毒</strong>
            <p>没有证据链时，这不是技术反馈，是很重的定性。</p>
          </article>
        </div>
      </div>
    </StepShell>
  );
}

function EmotionScene({ step }: { step: number }) {
  const active = step <= 7 ? 0 : step === 8 ? 1 : 2;

  return (
    <StepShell variant="emotion">
      <div className="tc-emotion-layout">
        <div className="tc-emotion-gauge tc-gsap-in" aria-hidden>
          <svg viewBox="0 0 620 420">
            <path className="tc-gauge-base" d="M82 328 A228 228 0 0 1 538 328" />
            <path className="tc-draw tc-gauge-hot" d="M82 328 A228 228 0 0 1 538 328" />
            <line className={cx("tc-gauge-needle", `tc-gauge-needle-${active}`)} x1="310" y1="328" x2="474" y2="164" />
          </svg>
          <div className="tc-gauge-label">
            <span>边界</span>
            <strong>{emotionBeats[active]!.title}</strong>
          </div>
        </div>

        <div className="tc-emotion-copy">
          <div className="tc-kicker tc-gsap-in">作者情绪</div>
          <h2 className="tc-emotion-title tc-gsap-in">不是怕质疑，是反感无证据定性</h2>
          <div className="tc-emotion-stack">
            {emotionBeats.map((beat, index) => (
              <article
                className={cx("tc-emotion-card", "tc-gsap-in", "tc-local-pop", index === active && "is-active", index < active && "is-past")}
                key={beat.title}
              >
                <span>{beat.meta}</span>
                <strong>{beat.title}</strong>
                <p>{beat.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function CloseScene({ step }: { step: number }) {
  const final = step >= 12;

  return (
    <StepShell variant="close">
      <div className={cx("tc-close-layout", final && "is-final")}>
        <div className="tc-close-copy">
          <div className="tc-kicker tc-gsap-in">最后留一句</div>
          <h2 className="tc-close-title tc-gsap-in">
            <span>{final ? "谢谢看到最后" : "你真正选择的"}</span>
            <span>{final ? "下期见" : "是信任谁"}</span>
          </h2>
          <p className="tc-subline tc-gsap-in">
            {final ? "觉得有用，顺手点一下；到这里收住，下期见。" : "便宜的不是接口，昂贵的是把判断权交出去。"}
          </p>
        </div>

        <div className="tc-close-system tc-gsap-in" aria-hidden>
          <div className="tc-orbit">
            <svg viewBox="0 0 620 620">
              <circle className="tc-orbit-ring tc-orbit-ring-a" cx="310" cy="310" r="122" />
              <circle className="tc-orbit-ring tc-orbit-ring-b" cx="310" cy="310" r="202" />
              <circle className="tc-orbit-ring tc-orbit-ring-c" cx="310" cy="310" r="282" />
              <path className="tc-draw tc-orbit-path" d="M108 318 C190 118 424 114 510 300 S322 534 164 438" />
            </svg>
            <div className="tc-orbit-core">
              <span>信任</span>
              <strong>{final ? "收尾" : "谁"}</strong>
            </div>
            {closePills.map((pill, index) => (
              <div className={cx("tc-orbit-pill", `tc-orbit-pill-${index}`, final && "is-soft")} key={pill}>
                {pill}
              </div>
            ))}
          </div>
          <div className={cx("tc-final-prompt", "tc-local-pop", final && "is-active")}>
            <span>点赞 / 关注</span>
            <strong>一键三连</strong>
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function renderScene(step: number, phase: ScenePhase) {
  switch (phase) {
    case "rubric":
      return <RelayRubricScene step={step} />;
    case "record":
      return <RecordScene step={step} />;
    case "emotion":
      return <EmotionScene step={step} />;
    case "close":
      return <CloseScene step={step} />;
  }
}

export default function TrustAndClose({ step }: ChapterStepProps) {
  const root = useRef<HTMLElement>(null);
  const phase = getScenePhase(step);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const still = document.body.classList.contains("qa-still");
      const entrants = scope.querySelectorAll(".tc-gsap-in");
      const paths = scope.querySelectorAll<SVGPathElement>(".tc-draw");
      const meters = scope.querySelectorAll<HTMLElement>(".tc-meter-fill");

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
          duration: 0.86 + index * 0.12,
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
      const meters = scope.querySelectorAll<HTMLElement>(".tc-meter-fill");
      const activeLocal = scope.querySelectorAll<HTMLElement>(".tc-local-pop.is-active");

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

      if (!still && activeLocal.length > 0) {
        gsap.fromTo(
          activeLocal,
          { y: 8, scale: 0.985 },
          { y: 0, scale: 1, duration: 0.34, ease: "power3.out", clearProps: "transform" },
        );
      }
    },
    { scope: root, dependencies: [step] },
  );

  return (
    <main ref={root} className={cx("tc-shell", `tc-step-${step}`, `tc-phase-${phase}`)}>
      <TechBackdrop />
      {renderScene(step, phase)}
    </main>
  );
}
