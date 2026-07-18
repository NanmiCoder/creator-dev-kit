import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./AutoRecordingChapter.css";

const meterBars = [28, 54, 86, 42, 112, 68, 96, 34, 122, 76, 48, 104];
const timelineDots = ["preview", "capture", "audio", "cue"];

function PreviewConsole({ autoOn = false }: { autoOn?: boolean }) {
  return (
    <div className="ch8-browser" aria-hidden="true">
      <div className="ch8-browser-top">
        <span />
        <span />
        <span />
        <div className="ch8-address">localhost:5174/?auto=1</div>
        <div className={autoOn ? "ch8-auto is-on" : "ch8-auto"}>
          <i />
          auto
        </div>
      </div>
      <div className="ch8-browser-body">
        <div className="ch8-terminal">
          <span>ready</span>
          <strong>presentation server</strong>
          <em>press space to record</em>
        </div>
        <div className="ch8-stage-mini">
          <b>16:9</b>
          <i />
        </div>
      </div>
    </div>
  );
}

function CaptureRig({ locked = false }: { locked?: boolean }) {
  return (
    <div className={locked ? "ch8-capture is-locked" : "ch8-capture"} aria-hidden="true">
      <div className="ch8-crop-frame">
        <span className="ch8-crop-a" />
        <span className="ch8-crop-b" />
        <span className="ch8-crop-c" />
        <span className="ch8-crop-d" />
        <div className="ch8-ratio-label">1920 x 1080</div>
        <div className="ch8-stage-lines">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

function RecordingHud() {
  return (
    <div className="ch8-hud" aria-hidden="true">
      <div className="ch8-hud-top">
        <span className="ch8-rec-dot" />
        <strong>REC SYSTEM AUDIO</strong>
        <em>00:00:18</em>
      </div>
      <div className="ch8-meter">
        {meterBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            style={
              {
                "--h": `${height}px`,
                "--d": `${index * 52}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="ch8-hud-note">speaker output captured</div>
    </div>
  );
}

function AudioDriver() {
  return (
    <div className="ch8-driver" aria-hidden="true">
      <div className="ch8-driver-wave">
        {meterBars.concat(meterBars.slice(0, 4)).map((height, index) => (
          <span
            key={`wave-${height}-${index}`}
            style={
              {
                "--h": `${Math.max(20, height - 16)}px`,
                "--d": `${index * 34}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="ch8-driver-track">
        <div className="ch8-track-fill" />
        <div className="ch8-playhead" />
        {timelineDots.map((dot, index) => (
          <i
            key={dot}
            className="ch8-state-dot"
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="ch8-state-labels">
        <span>audio</span>
        <span>page state</span>
      </div>
    </div>
  );
}

function CueCards() {
  return (
    <div className="ch8-cues" aria-hidden="true">
      <div className="ch8-cue-card ch8-cue-current">
        <span>cue 197</span>
        <strong>网页在播放</strong>
      </div>
      <div className="ch8-cue-card ch8-cue-next">
        <span>cue 198</span>
        <strong>动画跟着走</strong>
      </div>
      <div className="ch8-cue-switch" />
    </div>
  );
}

export default function AutoRecordingChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch8-scene ch8-preview">
        <div className="ch8-kicker">Chapter 08 / auto recording</div>
        <div className="ch8-copy">
          <h2>先打开本地预览。</h2>
          <p>自动播放开关点亮，录屏前只确认一个地址。</p>
        </div>
        <PreviewConsole autoOn />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch8-scene ch8-web">
        <div className="ch8-kicker">web first</div>
        <div className="ch8-web-mark hero-num">WEB</div>
        <div className="ch8-web-copy">
          <h2>它本质还是网页。</h2>
          <p>HTML、CSS、JavaScript 控制画面，浏览器只是最终舞台。</p>
        </div>
        <PreviewConsole />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch8-scene ch8-crop">
        <div className="ch8-kicker">fixed capture area</div>
        <div className="ch8-crop-copy">
          <h2>录屏框吸附到 16:9。</h2>
          <p>只录固定舞台，不录浏览器外壳和桌面杂讯。</p>
        </div>
        <CaptureRig locked />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch8-scene ch8-sound">
        <div className="ch8-kicker">system audio</div>
        <RecordingHud />
        <div className="ch8-sound-copy">
          <h2>系统声音一起录进去。</h2>
          <p>录到的就是已经配好的口播音频，不需要现场硬讲。</p>
        </div>
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="ch8-scene ch8-audio">
        <div className="ch8-kicker">audio drives state</div>
        <div className="ch8-audio-copy">
          <h2>声音拉着页面往前走。</h2>
          <p>playhead 经过一个时间点，页面状态就推进一格。</p>
        </div>
        <AudioDriver />
      </section>
    );
  }

  return (
    <section className="ch8-scene ch8-cue">
      <div className="ch8-kicker">cue switching</div>
      <div className="ch8-cue-copy">
        <h2>一句话，对应一个画面动作。</h2>
        <p>上一句亮当前卡片，下一句切到新卡片和新动画。</p>
      </div>
      <CueCards />
    </section>
  );
}
