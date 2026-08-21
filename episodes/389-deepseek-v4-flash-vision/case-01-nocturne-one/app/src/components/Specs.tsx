import { useRef } from "react";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { useBooking } from "./booking/booking";

const SPECS: { label: string; value: string }[] = [
  { label: "整机重量", value: "312 g" },
  { label: "单元", value: "38 mm 镀铍振膜" },
  { label: "蓝牙", value: "5.4 · LE Audio" },
  { label: "续航", value: "42 h" },
  { label: "快充", value: "10 min / 6 h" },
  { label: "编解码", value: "LDAC · AAC · SBC" },
  { label: "降噪", value: "混合式 · 48 dB" },
  { label: "充电", value: "USB-C · 无线充电" },
];

export function Specs() {
  const { open } = useBooking();
  const ctaRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="specs" className="relative scroll-mt-24 py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:gap-24">
          <div>
            <Reveal>
              <div className="flex items-center gap-5">
                <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent" />
                <h2 className="text-[clamp(2rem,4.6vw,3.4rem)] font-semibold tracking-tight text-ink">
                  规格与价格
                </h2>
              </div>
              <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.9] text-ink-2">
                为安静的聆听者而造。每一项参数都以实验室实测为准，不追求纸面峰值。
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12">
                <p className="text-[12px] tracking-[0.3em] text-ink-3">首发价</p>
                <p className="num mt-2 text-[clamp(2.6rem,5.4vw,4rem)] font-medium leading-none text-ink">
                  ¥3,499
                </p>
                <p className="mt-4 text-[13px] leading-[1.8] text-ink-3">
                  9 月 18 日全球首发 · 预约用户将收到优先购买通知
                </p>
                <div className="mt-8">
                  <Magnetic
                    ref={ctaRef}
                    onClick={() => open(ctaRef.current)}
                    className="btn btn-primary"
                  >
                    预约试听
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.14}>
            <dl className="border-t border-white/[0.1]">
              {SPECS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex items-baseline justify-between gap-6 py-[18px] ${
                    i === SPECS.length - 1 ? "" : "border-b border-white/[0.08]"
                  }`}
                >
                  <dt className="text-[13px] tracking-[0.14em] text-ink-3">
                    {s.label}
                  </dt>
                  <dd className="num text-right text-[15px] text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[12px] leading-[1.8] text-ink-3">
              续航数据基于 ANC 关闭与 LDAC 传输下实测，ANC 开启续航为 38 小时。
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
