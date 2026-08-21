import { Mark } from "./Nav";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="relative overflow-hidden pt-24 pb-10 lg:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_at_bottom,rgba(207,154,85,0.06),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-col items-center border-t border-white/[0.1] pt-16 text-center lg:pt-24">
            <span className="text-ink-2">
              <Mark size={30} />
            </span>
            <p className="mt-8 text-[clamp(2.2rem,7vw,5.2rem)] font-semibold leading-none tracking-[0.06em] text-ink">
              NOCTURNE ONE
            </p>
            <p className="mt-7 max-w-[34ch] text-[14px] leading-[1.9] text-ink-2">
              暗室中的精密声学仪器。为安静的聆听者而造。
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-ink-3">
              <a
                href="mailto:hello@nocturne.audio"
                className="transition-colors duration-200 hover:text-ink"
              >
                联系我们
              </a>
              <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
              <span>隐私政策</span>
              <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
              <span>服务条款</span>
              <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
              <a
                href="mailto:support@nocturne.audio"
                className="transition-colors duration-200 hover:text-ink"
              >
                支持
              </a>
            </div>

            <p className="mt-10 max-w-[60ch] text-[12px] leading-[1.9] text-ink-3/80">
              NOCTURNE ONE 由 NOCTURNE Audio Lab 设计于上海。页面中的声学参数均来自实验室实测。
              本页面为产品发布页，仅作展示用途。
            </p>
            <p className="num mt-6 text-[11px] tracking-[0.14em] text-ink-3/60">
              © 2026 NOCTURNE AUDIO LAB
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
