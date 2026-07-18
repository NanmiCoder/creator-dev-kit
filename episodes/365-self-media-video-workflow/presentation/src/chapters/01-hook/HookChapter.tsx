import type { CSSProperties } from "react";
import { MaskReveal } from "../../components/MaskReveal";
import type { ChapterStepProps } from "../../registry/types";
import "./HookChapter.css";

function FrameGrid() {
  return (
    <div className="ch1-frame-grid" aria-hidden="true">
      <div className="ch1-frame-main">
        <div className="ch1-browser-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="ch1-stage-preview">
          <div className="ch1-stage-title">WEB VIDEO</div>
          <div className="ch1-stage-line" />
          <div className="ch1-stage-cards">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="ch1-mini-card ch1-mini-card-a">
        <span>16:9 stage</span>
      </div>
      <div className="ch1-mini-card ch1-mini-card-b">
        <span>timeline</span>
      </div>
    </div>
  );
}

function AudioTimeline() {
  const bars = [
    48, 92, 132, 76, 166, 118, 58, 148, 102, 178, 84, 136, 64, 156, 112, 188,
    96, 142, 72, 164, 120, 86, 150, 104,
  ];
  return (
    <div className="ch1-audio-board" aria-hidden="true">
      <div className="ch1-wave">
        {bars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            style={
              {
                "--h": `${height}px`,
                "--delay": `${index * 42}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="ch1-srt-track">
        <div className="ch1-track-line" />
        <div className="ch1-playhead" />
        <div className="ch1-cue cue-a">00:00:04.700</div>
        <div className="ch1-cue cue-b">00:00:06.300</div>
        <div className="ch1-cue cue-c">00:00:08.100</div>
      </div>
    </div>
  );
}

function WorkflowRail() {
  const items = ["稿", "MP3", "SRT", "网页", "Review", "录屏"];
  return (
    <div className="ch1-workflow" aria-hidden="true">
      <div className="ch1-workflow-line" />
      {items.map((item, index) => (
        <div
          className="ch1-workflow-node"
          style={
            {
              left: `${32 + index * 132}px`,
              top: `${210 + (index % 2) * 108}px`,
              animationDelay: `${160 + index * 190}ms`,
            } as CSSProperties
          }
          key={item}
        >
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function HookChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch1-scene ch1-cover">
        <div className="ch1-kicker">Chapter 01 / cold open</div>
        <div className="ch1-cover-copy">
          <div className="ch1-cover-overline">你现在看到的</div>
          <h1>
            <MaskReveal show duration={720}>
              <span>不是 PPT 剪片</span>
            </MaskReveal>
          </h1>
          <p>而是一条可以被录屏成片的网页视频。</p>
        </div>
        <FrameGrid />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch1-scene ch1-web">
        <div className="ch1-kicker">web stage</div>
        <div className="ch1-web-left">
          <div className="hero-num ch1-num">01</div>
          <h2>它是一个网页。</h2>
          <p>浏览器里有一个固定 16:9 舞台，画面、节拍、动画都由前端控制。</p>
        </div>
        <div className="ch1-code-stack" aria-hidden="true">
          <div className="ch1-code-card card">HTML</div>
          <div className="ch1-code-card card">CSS</div>
          <div className="ch1-code-card card">JavaScript</div>
          <div className="ch1-code-stage">
            <span>1920 x 1080</span>
          </div>
        </div>
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch1-scene ch1-sync">
        <div className="ch1-kicker">audio / srt sync</div>
        <div className="ch1-sync-copy">
          <h2>声音不是后贴上去的。</h2>
          <p>口播音频和字幕时间轴一起决定页面什么时候切换。</p>
        </div>
        <AudioTimeline />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch1-scene ch1-record">
        <div className="ch1-kicker">browser capture</div>
        <div className="ch1-record-frame">
          <div className="ch1-crop corner-a" />
          <div className="ch1-crop corner-b" />
          <div className="ch1-crop corner-c" />
          <div className="ch1-crop corner-d" />
          <div className="ch1-record-browser">
            <div className="ch1-record-stage">localhost:5174</div>
          </div>
        </div>
        <div className="ch1-record-copy">
          <h2>最后只是把浏览器录下来。</h2>
          <p>视频感来自网页本身，不来自后期堆特效。</p>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="ch1-scene ch1-comments">
        <div className="ch1-kicker">comment section</div>
        <div className="ch1-comments-copy">
          <h2>评论区问得最多的两件事</h2>
        </div>
        <div className="ch1-comment-ghosts" aria-hidden="true">
          <span>怎么做的</span>
          <span>动画怎么弄</span>
          <span>网页 PPT</span>
        </div>
        <div className="ch1-question-stack">
          <div className="ch1-question card">
            <span>01</span>
            <strong>这几期视频是怎么做的？</strong>
          </div>
          <div className="ch1-question card">
            <span>02</span>
            <strong>动画效果是怎么弄的？</strong>
          </div>
        </div>
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="ch1-scene ch1-zero">
        <div className="ch1-kicker">from zero to one</div>
        <div className="ch1-zero-mark hero-num">{"0 -> 1"}</div>
        <div className="ch1-zero-copy">
          <h2>从 0 到 1 拆给你。</h2>
          <p>不讲概念，先把整条视频生产线按真实顺序摆出来。</p>
        </div>
      </section>
    );
  }

  if (step === 6) {
    return (
      <section className="ch1-scene ch1-promise">
        <div className="ch1-kicker">full workflow</div>
        <div className="ch1-promise-copy">
          <h2>口播稿、音频、SRT、网页 PPT、Review、录屏。</h2>
          <p>从口播稿开始，到录屏成片结束，中间每个文件都能被检查、修改、复用。</p>
        </div>
        <WorkflowRail />
      </section>
    );
  }

  return (
    <section className="ch1-scene ch1-close">
      <div className="ch1-kicker">watch slowly</div>
      <div className="ch1-close-card card">
        <div className="ch1-close-label">完整过一遍</div>
        <h2>口播稿 / MP3 / SRT / 网页 PPT / Review / 录屏</h2>
        <p>先收藏起来，后面按这条链路慢慢看。</p>
      </div>
      <div className="ch1-close-meter" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
