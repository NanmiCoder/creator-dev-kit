import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./MultimodalReviewChapter.css";

const shots = ["layout", "type", "motion", "contrast", "safe zone", "rhythm"];
const pins = [
  { label: "text too small", x: 68, y: 28 },
  { label: "right side empty", x: 78, y: 58 },
  { label: "motion late", x: 38, y: 72 },
];

function Kicker({ children }: { children: string }) {
  return <div className="ch7-kicker">{children}</div>;
}

function QaGate() {
  return (
    <div className="ch7-gate" aria-hidden="true">
      <div className="ch7-gate-frame">
        <span>build</span>
        <i />
        <strong>review gate</strong>
      </div>
      <div className="ch7-gate-slit" />
    </div>
  );
}

function MagnifierReview() {
  return (
    <div className="ch7-review-stage" aria-hidden="true">
      <div className="ch7-page-shot">
        <div className="ch7-shot-title" />
        <div className="ch7-shot-line wide" />
        <div className="ch7-shot-line" />
        <div className="ch7-shot-grid">
          <span />
          <span />
          <span />
        </div>
        <div className="ch7-scan-hit is-type">
          <i />
          <span>title too dominant</span>
        </div>
        <div className="ch7-scan-hit is-empty">
          <i />
          <span>right side empty</span>
        </div>
        <div className="ch7-scan-hit is-rhythm">
          <i />
          <span>motion late</span>
        </div>
      </div>
      <div className="ch7-lens">
        <span />
      </div>
    </div>
  );
}

function TextBlindSpot({ phase }: { phase: number }) {
  return (
    <div className={`ch7-blind is-phase-${phase}`} aria-hidden="true">
      <div className="ch7-text-model card">
        <span>text model</span>
        <p>tsx css narration</p>
        <p>looks valid</p>
        <p>no pixels loaded</p>
      </div>
      <div className="ch7-blind-wall">
        <span>actual screen</span>
        <div className="ch7-real-screen">
          <b />
          <i className="wide" />
          <i />
          <em>off-screen gap</em>
        </div>
        <i className="ch7-shutter" />
      </div>
    </div>
  );
}

function ScreenshotGrid({ phase }: { phase: number }) {
  return (
    <div className={`ch7-shot-grid-wrap is-phase-${phase}`} aria-hidden="true">
      {shots.map((shot, index) => (
        <div
          className={`ch7-shot-card ${phase >= 1 && index <= 2 ? "is-selected" : ""}`}
          style={{ "--i": index } as CSSProperties}
          key={shot}
        >
          <div className="ch7-shot-browser" />
          <span>{shot}</span>
        </div>
      ))}
      <div className="ch7-vision-strip">vision review</div>
    </div>
  );
}

function M3Pins({ phase }: { phase: number }) {
  return (
    <div className={`ch7-m3-board is-phase-${phase}`} aria-hidden="true">
      <div className="ch7-m3-screen">
        <div className="ch7-m3-hero" />
        <div className="ch7-m3-cols">
          <span />
          <span />
        </div>
        {pins.map((pin, index) => (
          <div
            className="ch7-pin"
            style={{ "--x": pin.x, "--y": pin.y, "--i": index } as CSSProperties}
            key={pin.label}
          >
            <i />
            <span>{pin.label}</span>
          </div>
        ))}
      </div>
      <div className="ch7-stamp">MiniMax M3</div>
    </div>
  );
}

export default function MultimodalReviewChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch7-scene ch7-gate-scene">
        <Kicker>Chapter 07 / QA gate</Kicker>
        <div className="ch7-copy">
          <div className="hero-num ch7-num">05</div>
          <h1>做完以后，先过 review。</h1>
          <p>网页视频不是写完代码就结束，画面要进检查口。</p>
        </div>
        <QaGate />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch7-scene ch7-review-scene">
        <Kicker>visual review</Kicker>
        <div className="ch7-copy compact">
          <h1>Review 非常关键。</h1>
          <p>放大镜扫过页面，检查它到底像不像视频。</p>
        </div>
        <MagnifierReview />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch7-scene ch7-blind-scene">
        <Kicker>text-only blind spot</Kicker>
        <div className="ch7-copy">
          <h1>文本模型有盲区。</h1>
          <p>只看 TSX、CSS、字幕，它可能觉得一切都成立。</p>
        </div>
        <TextBlindSpot phase={0} />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch7-scene ch7-blind-scene">
        <Kicker>actual pixels</Kicker>
        <div className="ch7-copy">
          <h1>它看不到真实画面。</h1>
          <p>字号、空白、元素位置、动效状态，要靠截图才会暴露。</p>
        </div>
        <TextBlindSpot phase={1} />
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="ch7-scene ch7-grid-scene">
        <Kicker>screenshot review</Kicker>
        <div className="ch7-copy compact">
          <h1>Review 决定效果 ok 不 ok。</h1>
          <p>多张页面状态进入检查区，问题才会显形。</p>
        </div>
        <ScreenshotGrid phase={0} />
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="ch7-scene ch7-grid-scene">
        <Kicker>vision input</Kicker>
        <div className="ch7-copy compact">
          <h1>把真实画面送进视觉区。</h1>
          <p>截图、页面状态、动画中间帧，都变成可检查的输入。</p>
        </div>
        <ScreenshotGrid phase={1} />
      </section>
    );
  }

  if (step === 6) {
    return (
      <section className="ch7-scene ch7-m3-scene">
        <Kicker>vision model</Kicker>
        <div className="ch7-copy compact">
          <h1>需要多模态视觉理解模型。</h1>
          <p>好的 review 不是说“还行”，而是把问题 pin 到页面位置。</p>
        </div>
        <M3Pins phase={0} />
      </section>
    );
  }

  return (
    <section className="ch7-scene ch7-m3-scene">
      <Kicker>MiniMax M3</Kicker>
      <div className="ch7-copy compact">
        <h1>这里用 MiniMax M3 来看画面。</h1>
        <p>它负责看见页面，再把具体修复点交回 Agent 协作。</p>
      </div>
      <M3Pins phase={1} />
    </section>
  );
}
