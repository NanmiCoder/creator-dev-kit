import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import { ProductArt } from "./ProductArt";
import { Magnetic } from "./Magnetic";
import { useBooking } from "./booking/booking";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const lineUp = {
  hidden: { y: "115%" },
  show: {
    y: "0%",
    transition: { duration: 1, ease: EASE },
  },
};

const artIn = {
  hidden: { opacity: 0, scale: 0.965, filter: "blur(16px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.35, ease: EASE, delay: 0.28 },
  },
};

const chipIn = (i: number) => ({
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE, delay: 1.05 + i * 0.14 },
  },
});

function HudChip({
  children,
  className = "",
  tail,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  tail?: React.CSSProperties;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`glass-chip px-4 py-3 ${className}`} style={style}>
      {children}
      {tail && (
        <span
          aria-hidden="true"
          className="absolute h-px w-7 bg-gradient-to-r from-white/45 to-transparent"
          style={tail}
        />
      )}
    </div>
  );
}

export function Hero() {
  const { open } = useBooking();
  const reduced = useReducedMotion();
  const ctaRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* ambient volume light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-40 left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(190,200,214,0.09),transparent_60%)]" />
        <div className="absolute bottom-[-30vh] right-[-10vw] h-[80vh] w-[60vw] bg-[radial-gradient(ellipse_at_bottom,rgba(207,154,85,0.08),transparent_62%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1440px] items-center gap-6 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-8 lg:px-12 lg:pb-10 lg:pt-24">
        {/* copy column */}
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          className="relative z-10 max-w-[560px]"
        >
          <motion.p
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-3 text-[12px] font-medium tracking-[0.32em] text-ink-3"
          >
            <span aria-hidden="true" className="h-px w-9 bg-accent/70" />
            旗舰空间音频耳机
          </motion.p>

          <h1 className="text-[clamp(2.6rem,6.4vw,5rem)] font-semibold leading-[1.08] tracking-[-0.015em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span variants={lineUp} className="block">
                听见空间，
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span variants={lineUp} className="block">
                而不只是<span className="text-accent">声音</span>。
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[46ch] text-[15px] leading-[1.9] text-ink-2 sm:text-base"
          >
            NOCTURNE ONE 以透明双腔体、个性化 HRTF 与 42
            小时续航，重新定义私人声场。
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic
              ref={ctaRef}
              onClick={() => open(ctaRef.current)}
              className="btn btn-primary"
            >
              预约试听
            </Magnetic>
            <a href="#structure" className="btn btn-ghost">
              <Play size={15} weight="fill" aria-hidden="true" />
              观看 90 秒设计故事
            </a>
          </motion.div>
        </motion.div>

        {/* product stage */}
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          className="relative mx-auto w-full max-w-[560px] lg:max-w-[640px]"
        >
          <motion.div variants={artIn} className="relative">
            {/* finish-tinted ambient glow behind the sculpture */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 top-[6%] bottom-[10%] bg-[radial-gradient(ellipse_at_center,rgba(120,128,140,0.14),transparent_68%)]"
            />
            <ProductArt />
          </motion.div>

          {/* HUD */}
          <motion.div variants={chipIn(0)} className="absolute -top-1 right-[1%]">
            <HudChip
              tail={{ top: "50%", left: "-28px", transform: "translateY(-50%)" }}
              className="anim-float-b"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-accent anim-breathe" />
                  <span className="absolute inset-0 rounded-full bg-accent/40 blur-[3px]" />
                </span>
                <div>
                  <div className="num text-[22px] leading-none text-ink">42h</div>
                  <div className="mt-1.5 text-[10px] tracking-[0.16em] text-ink-3">
                    续航 · ANC 关闭
                  </div>
                </div>
              </div>
            </HudChip>
          </motion.div>

          <motion.div
            variants={chipIn(1)}
            className="absolute top-[30%] left-[-5%] max-sm:left-0"
          >
            <HudChip
              tail={{ top: "50%", right: "-28px", transform: "translateY(-50%) rotate(180deg)" }}
              className="anim-float-a"
            >
              <div className="flex flex-col gap-2">
                <div className="flex h-4 items-end gap-[3px]" aria-hidden="true">
                  {[9, 15, 7, 13, 10].map((h, i) => (
                    <span
                      key={i}
                      className="eq-bar w-[2px] rounded-full bg-accent"
                      style={{ height: `${h}px`, animationDelay: `${i * 0.14}s` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] tracking-[0.14em] text-ink-2">
                  Spatial Engine
                </span>
              </div>
            </HudChip>
          </motion.div>

          <motion.div variants={chipIn(2)} className="absolute right-[4%] bottom-[4%]">
            <HudChip
              tail={{ top: "50%", left: "-28px", transform: "translateY(-50%)" }}
              className="anim-float-b"
              style={{ animationDelay: "1.6s" }}
            >
              <div className="flex items-center gap-3">
                <div className="num text-[22px] leading-none text-ink">38 mm</div>
                <div className="text-[10px] tracking-[0.16em] text-ink-3">
                  单元 · 镀铍振膜
                </div>
              </div>
            </HudChip>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
