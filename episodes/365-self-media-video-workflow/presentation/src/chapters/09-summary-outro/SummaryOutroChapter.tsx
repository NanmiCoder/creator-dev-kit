import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./SummaryOutroChapter.css";

const machineSteps = ["Build", "Review", "Vision"];
const filmFrames = ["script", "audio", "srt", "web", "review", "record"];

function FormulaTrack() {
  return (
    <div className="ch9-formula-track" aria-hidden="true">
      <div className="ch9-formula-node is-audio">
        <span>Audio</span>
        <i />
      </div>
      <div className="ch9-formula-arrow" />
      <div className="ch9-formula-node is-web">
        <span>Web Playback</span>
        <i />
      </div>
    </div>
  );
}

function AgentMachine() {
  return (
    <div className="ch9-machine" aria-hidden="true">
      {machineSteps.map((item, index) => (
        <div
          className="ch9-machine-cell"
          key={item}
          style={{ "--i": index } as CSSProperties}
        >
          <span>agent</span>
          <strong>{item}</strong>
          <i />
        </div>
      ))}
      <div className="ch9-machine-bus" />
    </div>
  );
}

function FilmStrip() {
  return (
    <div className="ch9-film" aria-hidden="true">
      <div className="ch9-film-sprockets top">
        {filmFrames.map((frame) => (
          <i key={`top-${frame}`} />
        ))}
      </div>
      <div className="ch9-film-frames">
        {filmFrames.map((frame, index) => (
          <div
            className="ch9-film-frame"
            key={frame}
            style={{ "--i": index } as CSSProperties}
          >
            <span>{frame}</span>
          </div>
        ))}
      </div>
      <div className="ch9-film-sprockets bottom">
        {filmFrames.map((frame) => (
          <i key={`bottom-${frame}`} />
        ))}
      </div>
    </div>
  );
}

function SyncTicks() {
  return (
    <div className="ch9-sync" aria-hidden="true">
      <div className="ch9-sync-line" />
      <div className="ch9-sync-playhead" />
      <div className="ch9-sync-card card">
        <span>spoken cue</span>
        <strong>精准展示</strong>
      </div>
      {[0, 1, 2, 3].map((item) => (
        <i
          className="ch9-sync-tick"
          key={item}
          style={{ "--i": item } as CSSProperties}
        />
      ))}
    </div>
  );
}

export default function SummaryOutroChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch9-scene ch9-formula">
        <div className="ch9-kicker">Chapter 09 / summary</div>
        <div className="ch9-formula-copy">
          <h2>核心只有一句。</h2>
          <p>用音频驱动网页播放。</p>
        </div>
        <FormulaTrack />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch9-scene ch9-agents">
        <div className="ch9-kicker">agent loop</div>
        <div className="ch9-agents-copy">
          <h2>Agent 做三件事。</h2>
          <p>先生成网页，再检查页面，最后用视觉能力看真实效果。</p>
        </div>
        <AgentMachine />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch9-scene ch9-record">
        <div className="ch9-kicker">manual capture</div>
        <FilmStrip />
        <div className="ch9-record-copy">
          <h2>最后还是人工录制。</h2>
          <p>把自动播放的浏览器画面录下来，就是成片素材。</p>
        </div>
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch9-scene ch9-ticks">
        <div className="ch9-kicker">sync effect</div>
        <div className="ch9-ticks-copy">
          <h2>说到哪一句，画面就到哪一格。</h2>
          <p>同步不是靠手感，是靠已经定好的声音和时间轴。</p>
        </div>
        <SyncTicks />
      </section>
    );
  }

  return (
    <section className="ch9-scene ch9-end">
      <div className="ch9-end-card">
        <span>我是阿江</span>
        <h2>我们下期见。</h2>
      </div>
      <div className="ch9-end-rule" aria-hidden="true" />
    </section>
  );
}
