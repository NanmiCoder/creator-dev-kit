import { Waveform, Compass, SpeakerHigh } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { SoundField } from "./SoundField";

const FEATURES = [
  {
    icon: Waveform,
    title: "个性化 HRTF",
    text: "基于耳廓与头形的专属声学映射，校准你个人听觉的方位误差。",
  },
  {
    icon: Compass,
    title: "9 轴姿态追踪",
    text: "转头时声场保持静止，声像与你之间的相对位置实时重算。",
  },
  {
    icon: SpeakerHigh,
    title: "全景声原生支持",
    text: "全景声、5.1 与 7.1 混音源无需转换，直接进入空间声场。",
  },
];

export function Sound() {
  return (
    <section id="sound" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-center gap-5">
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent" />
            <h2 className="text-[clamp(2rem,4.6vw,3.4rem)] font-semibold tracking-tight text-ink">
              声音的方位
            </h2>
          </div>
          <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.9] text-ink-2">
            空间音频不是环绕声。它是对头部朝向的实时响应，是声源在房间中保持稳定的存在感。
            NOCTURNE ONE 通过个性化 HRTF 与 9 轴姿态追踪，让每一个声像都锚定在真实方位上。
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:gap-16">
          <Reveal delay={0.1}>
            <ul className="divide-y divide-white/[0.07]">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-5 py-7 first:pt-0 last:pb-0">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-ink-2">
                    <f.icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-medium text-ink">{f.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-[1.8] text-ink-2">
                      {f.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16} y={34}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(207,154,85,0.07),transparent_66%)]"
              />
              <SoundField />
              <p className="mt-6 flex items-center justify-center gap-2.5 text-[12px] tracking-[0.22em] text-ink-3">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent anim-breathe" />
                移动指针 · 声场随方位实时响应
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
