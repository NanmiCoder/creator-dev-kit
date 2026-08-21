import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { StructureDiagram } from "./StructureDiagram";
import { Reveal } from "./Reveal";

const SCENES = [
  {
    name: "耳罩",
    sub: "悬浮记忆棉",
    text: "自适应记忆棉贴合耳廓，蛋白皮表面透气不闷热，长时间聆听也保持轻量。",
    stat: "整机 312 g",
  },
  {
    name: "声学腔体",
    sub: "透明双腔体",
    text: "前后腔独立调校，38 mm 镀铍振膜在玻璃腔体中保持精准的声学响应。",
    stat: "38 mm 镀铍振膜",
  },
  {
    name: "头梁",
    sub: "钛合金一体头梁",
    text: "CNC 钛合金骨架，压力均匀分布在 12 个接触点，内衬为悬浮皮革。",
    stat: "12 点压力分布",
  },
];

const WINDOWS = [
  [0.03, 0.1, 0.3, 0.37],
  [0.35, 0.42, 0.62, 0.69],
  [0.67, 0.74, 0.94, 1],
] as const;

function sceneStyle(
  p: MotionValue<number>,
  i: number,
): { opacity: MotionValue<number>; scale: MotionValue<number>; y: MotionValue<number> } {
  const [a, b, c, d] = WINDOWS[i];
  return {
    opacity: useTransform(p, [a, b, c, d], [0.3, 1, 1, 0.3]),
    scale: useTransform(p, [a, b, c, d], [0.96, 1.02, 1.02, 0.96]),
    y: useTransform(p, [a, b, c, d], [34, 0, 0, -34]),
  };
}

/* Text blocks fully hide when inactive, so ghost titles never overlap. */
function textStyle(
  p: MotionValue<number>,
  i: number,
): { opacity: MotionValue<number>; y: MotionValue<number> } {
  const [a, b, c, d] = WINDOWS[i];
  return {
    opacity: useTransform(p, [a, b, c, d], [0, 1, 1, 0]),
    y: useTransform(p, [a, b, c, d], [34, 0, 0, -34]),
  };
}

export function Structure() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const s0 = sceneStyle(scrollYProgress, 0);
  const s1 = sceneStyle(scrollYProgress, 1);
  const s2 = sceneStyle(scrollYProgress, 2);
  const t0 = textStyle(scrollYProgress, 0);
  const t1 = textStyle(scrollYProgress, 1);
  const t2 = textStyle(scrollYProgress, 2);
  const railFill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scenes = [s0, s1, s2];
  const texts = [t0, t1, t2];

  return (
    <section id="structure" className="relative">
      <div ref={ref} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden py-24">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <Reveal>
              <div className="flex items-center gap-5">
                <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent" />
                <h2 className="text-[clamp(1.9rem,4.4vw,3.2rem)] font-semibold tracking-tight text-ink">
                  结构的逻辑
                </h2>
              </div>
            </Reveal>

            <div className="mt-10 grid items-center gap-8 lg:mt-14 lg:grid-cols-[auto_minmax(0,42fr)_minmax(0,58fr)] lg:gap-14">
              {/* progress rail (desktop) */}
              <div
                className="hidden flex-col gap-0 lg:flex"
                aria-hidden="true"
              >
                <div className="relative h-[240px] w-px bg-white/[0.09]">
                  <motion.div
                    style={{ scaleY: railFill }}
                    className="absolute inset-0 origin-top bg-gradient-to-b from-accent to-accent/30"
                  />
                </div>
                <div className="mt-6 flex flex-col gap-4">
                  {SCENES.map((s, i) => (
                    <motion.span
                      key={s.name}
                      style={{ opacity: scenes[i].opacity }}
                      className="flex items-center gap-3 text-[13px] tracking-[0.18em] text-ink-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {s.name}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* scene copy */}
              <div className="relative h-[300px] sm:h-[260px] lg:h-[280px]">
                {SCENES.map((s, i) => {
                  const st = texts[i];
                  return (
                    <motion.div
                      key={s.name}
                      style={{ opacity: st.opacity, y: st.y }}
                      className="absolute inset-0"
                    >
                      <p className="text-[12px] tracking-[0.3em] text-accent">
                        {s.sub}
                      </p>
                      <h3 className="mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold tracking-tight text-ink">
                        {s.name}
                      </h3>
                      <p className="mt-4 max-w-[44ch] text-[14px] leading-[1.9] text-ink-2">
                        {s.text}
                      </p>
                      <p className="num mt-5 text-[13px] text-ink-3">
                        {s.stat}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* exploded diagram */}
              <div className="mx-auto h-[40vh] w-full max-w-[360px] lg:h-[56vh] lg:max-w-[430px]">
                <StructureDiagram band={s2} chamber={s1} cushion={s0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
