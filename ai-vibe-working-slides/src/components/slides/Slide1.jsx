import { motion } from "framer-motion";
import { AudioWaveform, Bot, Sparkles } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";
import { WaveTrackIcon } from "../ui/Icons";

const pillars = [
  { icon: Sparkles, title: "自然输入", text: "不用先把想法压缩成几行字" },
  { icon: AudioWaveform, title: "完整上下文", text: "让 AI 更快接住意图和语境" },
  { icon: Bot, title: "连续执行", text: "整理、补全、推进后续任务" },
];

function Slide1() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb left-[4%] top-[12%] h-56 w-56 bg-[var(--primary-300)]" />
      <div className="glow-orb right-[10%] top-[18%] h-72 w-72 bg-[var(--accent-200)]" />

      <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative z-10 flex flex-col gap-8">
          <TitleArea
            eyebrow="AI WORKFLOW / 01"
            title={
              <>
                Vibe Working
                <br />
                不是下一阵风
              </>
            }
            subtitle="AI 不只是写代码了，基本不打字，全是说。随时随地跟 AI 对话，这就是 Vibe Working。"
            maxWidth="46rem"
          />

          <motion.div
            variants={itemVariants}
            className="glass-card relative max-w-2xl overflow-hidden rounded-[32px] px-6 py-6 md:px-8"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--primary-300)]/70 blur-3xl" />
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--text-100)] text-white">
                <WaveTrackIcon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--text-200)]">
                  One High-Efficiency Path
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--text-100)] md:text-3xl">
                  更低摩擦的输入层
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-200)] md:text-base">
                  随时随地 麦克风 + AI 语音输入法 + 各种 AI 工具 = Vibe Working
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="relative z-10">
          <div className="glass-card rounded-[36px] p-4 md:p-5">
            <div className="grid gap-4">
              {pillars.map(({ icon: Icon, title, text }, index) => (
                <div
                  key={title}
                  className={`rounded-[26px] px-5 py-5 ${index === 1 ? "bg-[linear-gradient(120deg,rgba(1,155,152,0.16),rgba(193,255,255,0.8))]" : "glass-muted"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--text-100)] text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-100)]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-200)]">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="glass-muted rounded-[24px] px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--text-200)]">
                  Audience
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--text-100)]">程序员 / 白领 / 创作者</p>
              </div>
              <div className="glass-muted rounded-[24px] px-5 py-4">
                <div className="flex items-center gap-2 text-[var(--accent-100)]">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-sm font-semibold uppercase tracking-[0.22em]">Shift</p>
                </div>
                <p className="mt-2 text-lg font-bold text-[var(--text-100)]">从写代码，扩展到做工作</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ConclusionBanner text="AI 工作流提速的关键，往往是更低摩擦的输入方式。" />
    </SlideLayout>
  );
}

export default Slide1;
