import { useState } from "react";
import { ProductArt } from "./ProductArt";
import { Reveal } from "./Reveal";

type FinishId = "obsidian" | "mist" | "amber";

const FINISHES: {
  id: FinishId;
  name: string;
  en: string;
  desc: string;
  note: string;
  swatch: string;
}[] = [
  {
    id: "obsidian",
    name: "曜石黑",
    en: "Obsidian",
    desc: "深石墨哑光涂层",
    note: "反射率 6%，暗室中只保留一层轮廓光。",
    swatch: "linear-gradient(150deg, #43464c 0%, #232529 45%, #15161a 100%)",
  },
  {
    id: "mist",
    name: "雾银",
    en: "Mist Silver",
    desc: "冰银喷砂",
    note: "霜面冷光，细雾质感在冷光下呈银白。",
    swatch: "linear-gradient(150deg, #d6dade 0%, #9aa0a9 48%, #63686f 100%)",
  },
  {
    id: "amber",
    name: "燃琥珀",
    en: "Burnt Amber",
    desc: "低饱和琥珀金属漆",
    note: "暖调但克制，仅在高光处泛起琥珀色。",
    swatch: "linear-gradient(150deg, #b5834f 0%, #7b5334 48%, #46301f 100%)",
  },
];

const GLOWS: Record<FinishId, string> = {
  obsidian: "radial-gradient(ellipse at center, rgba(118,126,138,0.15), transparent 68%)",
  mist: "radial-gradient(ellipse at center, rgba(190,200,214,0.22), transparent 68%)",
  amber: "radial-gradient(ellipse at center, rgba(199,138,74,0.24), transparent 68%)",
};

export function Finishes() {
  const [finish, setFinish] = useState<FinishId>("obsidian");
  const active = FINISHES.find((f) => f.id === finish)!;

  return (
    <section
      id="finishes"
      className="relative scroll-mt-24 py-24 lg:py-36"
      data-finish={finish}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-center gap-5">
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent" />
            <h2 className="text-[clamp(2rem,4.6vw,3.4rem)] font-semibold tracking-tight text-ink">
              三种外观
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-20">
          {/* product stage with crossfading environment light */}
          <Reveal delay={0.1} className="relative">
            <div className="relative mx-auto w-full max-w-[520px]">
              {(Object.keys(GLOWS) as FinishId[]).map((f) => (
                <div
                  key={f}
                  aria-hidden="true"
                  className="absolute inset-x-4 top-[4%] bottom-[8%] transition-opacity duration-700"
                  style={{
                    background: GLOWS[f],
                    opacity: f === finish ? 1 : 0,
                  }}
                />
              ))}
              <ProductArt floating={false} />
            </div>
          </Reveal>

          {/* finish picker */}
          <Reveal delay={0.16}>
            <div className="mb-8 min-h-[76px]">
              <p className="text-[12px] tracking-[0.3em] text-accent">{active.en}</p>
              <h3 className="mt-2 text-[clamp(1.7rem,3.2vw,2.4rem)] font-semibold tracking-tight text-ink">
                {active.name}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.8] text-ink-2">
                {active.note}
              </p>
            </div>

            <div role="radiogroup" aria-label="选择外观" className="flex flex-col gap-3">
              {FINISHES.map((f) => {
                const selected = f.id === finish;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setFinish(f.id)}
                    className={`group flex w-full items-center gap-5 rounded-2xl border p-4 text-left transition-all duration-300 ${
                      selected
                        ? "border-accent/50 bg-white/[0.05]"
                        : "border-white/[0.08] bg-transparent hover:border-white/[0.18] hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-16 w-[52px] shrink-0 rounded-xl border transition-all duration-500 ${
                        selected ? "border-white/30" : "border-white/12"
                      }`}
                      style={{ background: f.swatch }}
                    />
                    <span className="flex-1">
                      <span
                        className={`block text-[15px] font-medium transition-colors duration-300 ${
                          selected ? "text-ink" : "text-ink-2 group-hover:text-ink"
                        }`}
                      >
                        {f.name}
                        <span className="num ml-2.5 text-[11px] font-normal tracking-[0.12em] text-ink-3">
                          {f.en}
                        </span>
                      </span>
                      <span className="mt-1 block text-[13px] text-ink-3">
                        {f.desc}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
                        selected ? "bg-accent" : "bg-white/12 group-hover:bg-white/25"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-[12px] leading-[1.8] text-ink-3">
              所有涂层均经过 36 小时盐雾与磨蚀测试，玻璃腔体为强化玻璃双面镀膜。
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
