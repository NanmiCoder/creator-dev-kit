import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./FirstAnchorChapter.css";

const files = ["script.md", "vo-full.mp3", "timeline.srt"];
const scanItems = ["像不像视频", "普通不普通", "信息密度", "转场", "字体颜色节奏"];
const themes = ["bauhaus-bold", "paper-press", "midnight-press", "newsroom"];

function FileDrop() {
  return (
    <div className="ch5-file-drop" aria-hidden="true">
      {files.map((file, index) => (
        <div
          className="ch5-file-card card"
          style={{ "--i": index } as CSSProperties}
          key={file}
        >
          <span />
          <strong>{file}</strong>
        </div>
      ))}
      <div className="ch5-skill-core">web-video-presentation</div>
    </div>
  );
}

function AnchorStrip() {
  return (
    <div className="ch5-strip" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          className={`ch5-frame ${index === 0 ? "is-anchor" : ""}`}
          style={{ "--i": index } as CSSProperties}
          key={index}
        >
          <span>{index === 0 ? "CH 01" : `CH ${String(index + 1).padStart(2, "0")}`}</span>
        </div>
      ))}
      <div className="ch5-anchor-lock">anchor</div>
    </div>
  );
}

function StyleAnchor() {
  return (
    <div className="ch5-anchor-board" aria-hidden="true">
      <div className="ch5-anchor-window card">
        <div className="ch5-window-bar" />
        <div className="ch5-window-title">第一章</div>
        <div className="ch5-window-rule" />
        <div className="ch5-window-blocks">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="ch5-ripple one" />
      <div className="ch5-ripple two" />
    </div>
  );
}

function ReviewScanner() {
  return (
    <div className="ch5-scanner card" aria-hidden="true">
      <div className="ch5-scan-line" />
      {scanItems.map((item, index) => (
        <div
          className="ch5-scan-row"
          style={{ "--i": index } as CSSProperties}
          key={item}
        >
          <span>{item}</span>
          <i />
        </div>
      ))}
    </div>
  );
}

function FeedbackDiff() {
  return (
    <div className="ch5-diff-wrap" aria-hidden="true">
      <div className="ch5-bubble card">这一页太像普通 PPT 了。</div>
      <div className="ch5-diff card">
        <p className="is-out">- 大段文字直接铺满画面</p>
        <p className="is-in">+ 只保留一个主判断</p>
        <p className="is-in">+ 加入时间轴和画面演示</p>
      </div>
    </div>
  );
}

function ThemeWall() {
  return (
    <div className="ch5-theme-wall" aria-hidden="true">
      {themes.map((theme, index) => (
        <div
          className={`ch5-theme-card card ${theme === "midnight-press" ? "is-selected" : ""}`}
          style={{ "--i": index } as CSSProperties}
          key={theme}
        >
          <span>{theme}</span>
          <i />
        </div>
      ))}
    </div>
  );
}

export default function FirstAnchorChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch5-scene ch5-files">
        <div className="ch5-kicker">Chapter 05 / first anchor</div>
        <div className="ch5-copy">
          <div className="hero-num ch5-num">03</div>
          <h2>三份文件先投进去。</h2>
          <p>口播稿、音频、SRT，进入 web-video-presentation。</p>
        </div>
        <FileDrop />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch5-scene ch5-anchor-strip-scene">
        <div className="ch5-kicker">do not build all</div>
        <div className="ch5-strip-copy">
          <h2>不要一上来做全片。</h2>
          <p>先把整条 film strip 收束到第一章。</p>
        </div>
        <AnchorStrip />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch5-scene ch5-style-anchor-scene">
        <div className="ch5-kicker">style anchor</div>
        <div className="ch5-style-copy">
          <h2>第一章决定全片的视频感。</h2>
          <p>后面的章节都要沿着这个锚点继续。</p>
        </div>
        <StyleAnchor />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch5-scene ch5-review">
        <div className="ch5-kicker">review scan</div>
        <div className="ch5-review-copy">
          <h2>先扫一遍，再继续做后面。</h2>
        </div>
        <ReviewScanner />
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="ch5-scene ch5-feedback">
        <div className="ch5-kicker">natural language iteration</div>
        <div className="ch5-feedback-copy">
          <h2>第一版不用完美。</h2>
          <p>用自然语言反馈，让页面自己长出差异。</p>
        </div>
        <FeedbackDiff />
      </section>
    );
  }

  return (
    <section className="ch5-scene ch5-themes">
      <div className="ch5-kicker">theme selection</div>
      <div className="ch5-theme-copy">
        <h2>本项目选 midnight-press。</h2>
        <p>暖色暗底、热橙强调、终端和电影感。</p>
      </div>
      <ThemeWall />
    </section>
  );
}
