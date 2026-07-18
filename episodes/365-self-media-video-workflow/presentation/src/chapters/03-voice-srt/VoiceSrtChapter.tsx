import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../registry/types";
import "./VoiceSrtChapter.css";

const waveform = [
  36, 82, 118, 64, 154, 96, 46, 132, 76, 168, 104, 58, 146, 88, 122, 72, 158,
  98, 52, 136, 84, 176, 112, 66,
];
const queueItems = ["script.md", "voice profile", "render mp3"];
const srtRows = ["00:01:24.866", "00:01:27.600", "00:01:29.800", "00:01:39.000"];

function Kicker({ label }: { label: string }) {
  return <div className="ch3-kicker">{label}</div>;
}

function AudioTrack({ active = false }: { active?: boolean }) {
  return (
    <div className={`ch3-audio-track ${active ? "is-active" : ""}`} aria-hidden="true">
      <div className="ch3-track-head">
        <span>audio track</span>
        <i>{active ? "armed" : "idle"}</i>
      </div>
      <div className="ch3-waveform">
        {waveform.map((height, index) => (
          <span
            style={
              {
                "--h": `${height}px`,
                "--i": index,
              } as CSSProperties
            }
            key={`${height}-${index}`}
          />
        ))}
      </div>
      <div className="ch3-playhead" />
    </div>
  );
}

function EmptyCanvas() {
  return (
    <div className="ch3-empty-canvas" aria-hidden="true">
      <div className="ch3-canvas-frame">
        <span>visual stage</span>
      </div>
      <div className="ch3-nope-line" />
    </div>
  );
}

function BoneStage() {
  return (
    <div className="ch3-bone-stage" aria-hidden="true">
      <div className="ch3-script-file card">
        <span>script.md</span>
        <i />
        <i />
        <i />
      </div>
      <div className="ch3-bone-line" />
      <AudioTrack active />
      <div className="ch3-stage-shell">
        <span>web stage</span>
      </div>
    </div>
  );
}

function VoiceClone() {
  return (
    <div className="ch3-clone" aria-hidden="true">
      <div className="ch3-voice-id">
        <span>voice clone</span>
        <strong>optional path</strong>
      </div>
      <div className="ch3-clone-rings">
        <i />
        <i />
        <i />
      </div>
      <AudioTrack active />
    </div>
  );
}

function RenderQueue() {
  return (
    <div className="ch3-render" aria-hidden="true">
      <div className="ch3-render-input card">
        <span>逐字稿</span>
        <b>text ready</b>
      </div>
      <div className="ch3-render-lane">
        {queueItems.map((item, index) => (
          <div
            className="ch3-render-job"
            style={{ "--i": index } as CSSProperties}
            key={item}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="ch3-render-output card">
        <span>MP3</span>
        <b>rendered</b>
      </div>
    </div>
  );
}

function SrtCutter() {
  return (
    <div className="ch3-srt" aria-hidden="true">
      <AudioTrack active />
      <div className="ch3-srt-table card">
        {srtRows.map((row, index) => (
          <div
            className="ch3-srt-row"
            style={{ "--i": index } as CSSProperties}
            key={row}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{row}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineReady({ phase }: { phase: number }) {
  const items = [
    { label: "MP3", note: "voice fixed" },
    { label: "SRT", note: "time fixed" },
    { label: "网页", note: "states from cues" },
  ];
  return (
    <div className={`ch3-final-chain is-phase-${phase}`} aria-hidden="true">
      <div className="ch3-final-track">
        <div className="ch3-final-wave">
          {waveform.slice(0, 18).map((height, index) => (
            <span
              style={
                {
                  "--h": `${Math.max(28, height * 0.52)}px`,
                  "--i": index,
                } as CSSProperties
              }
              key={`${height}-${index}`}
            />
          ))}
        </div>
        <div className="ch3-final-cues">
          {["00:01:57", "00:02:00", "00:02:02"].map((cue, index) => (
            <i style={{ "--i": index } as CSSProperties} key={cue}>
              {cue}
            </i>
          ))}
        </div>
      </div>
      {items.map((item, index) => (
        <div
          className={`ch3-chain-node card ${phase >= index - 1 ? "is-active" : ""}`}
          style={{ "--i": index } as CSSProperties}
          key={item.label}
        >
          <span>{item.label}</span>
          <em>{item.note}</em>
        </div>
      ))}
      <div className="ch3-chain-line" />
      <div className={`ch3-adjust-note ${phase >= 1 ? "is-on" : ""}`}>
        no skill path = more tuning
      </div>
    </div>
  );
}

export default function VoiceSrtChapter({ step }: ChapterStepProps) {
  if (step === 0) {
    return (
      <section className="ch3-scene ch3-start">
        <Kicker label="Chapter 03 / voice first" />
        <div className="ch3-copy">
          <div className="ch3-overline">下面正式开始</div>
          <h1>第一步，不是做画面。</h1>
          <p>画面先空出来，真正要先锁住的是声音和时间。</p>
        </div>
        <EmptyCanvas />
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="ch3-scene ch3-voice-first">
        <Kicker label="cue 219 inserted" />
        <div className="ch3-hero-word">先做口播</div>
        <AudioTrack active />
      </section>
    );
  }

  if (step === 2) {
    return (
      <section className="ch3-scene ch3-bone">
        <Kicker label="voice is structure" />
        <div className="ch3-copy">
          <h2>口播是整个视频的骨架。</h2>
          <p>口播稿和音频先撑起来，网页舞台才知道每一步该落在哪里。</p>
        </div>
        <BoneStage />
      </section>
    );
  }

  if (step === 3) {
    return (
      <section className="ch3-scene ch3-clone-scene">
        <Kicker label="optional voice path" />
        <div className="ch3-copy is-right">
          <div className="ch3-overline">不想真人录</div>
          <h2>可以先克隆自己的音色。</h2>
          <p>MiniMax 的音频能力可以作为一条可选路径，先把口播声音做出来。</p>
        </div>
        <VoiceClone />
      </section>
    );
  }

  if (step === 4) {
    return (
      <section className="ch3-scene ch3-render-scene">
        <Kicker label="text to mp3" />
        <div className="ch3-copy">
          <h2>逐字稿进入音频渲染队列。</h2>
          <p>文案写好之后，让它生成一份可对齐的 MP3 文件。</p>
        </div>
        <RenderQueue />
      </section>
    );
  }

  if (step === 5) {
    return (
      <section className="ch3-scene ch3-srt-scene">
        <Kicker label="mp3 to srt" />
        <div className="ch3-copy">
          <h2>再把 MP3 切成 SRT 时间戳。</h2>
          <p>波形被切成一行一行的 timecode，后面的网页就能按句子推进。</p>
        </div>
        <SrtCutter />
      </section>
    );
  }

  const phase = step === 6 ? 0 : 1;
  const copy = phase === 0
    ? {
        title: "MP3 和 SRT，让声音与时间点先落定。",
        body: "网页不是凭感觉切，它会跟着这些 cue 一步一步推进。",
      }
    : {
        title: "后面网页怎么做，都方便很多。",
        body: "不用 Skill 也能做，只是后面要手动调整的地方会非常多。",
      };

  return (
    <section className="ch3-scene ch3-final">
      <Kicker label="timeline ready" />
      <div className="ch3-copy is-center">
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <TimelineReady phase={phase} />
    </section>
  );
}
