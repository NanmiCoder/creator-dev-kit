import { motion } from "framer-motion";
import { ArrowRight, AudioWaveform, Bot, Sparkles } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const steps = [
  { icon: Sparkles, title: "随时随地", text: "走路、工作室、家里、咖啡厅" },
  { icon: AudioWaveform, title: "麦克风 + AI 语音输入法", text: "闪电说 / 智谱 AI 把语音变文字" },
  { icon: Bot, title: "各种 AI 工具", text: "GPT / Claude / OpenClaw / DeepSeek" },
];

function Slide3() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb right-[7%] top-[14%] h-80 w-80 bg-[var(--primary-300)]" />

      <div className="flex flex-1 flex-col justify-center gap-10">
        <TitleArea
          eyebrow="FORMULA / 03"
          title="关键组合"
          subtitle="这套工作方式里最关键的一个组合——跑通之后效率完全不一样。"
          maxWidth="44rem"
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <motion.div key={title} variants={itemVariants} className="contents">
              <div className="glass-card rounded-[30px] p-6 md:p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--text-100)] text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[var(--text-100)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-200)]">{text}</p>
              </div>
              {index < steps.length - 1 ? (
                <div className="hidden items-center justify-center lg:flex">
                  <div className="glass-muted rounded-full p-3 text-[var(--accent-100)]">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["边走边说", "随时输入", "AI 即时响应"].map((item) => (
            <motion.div
              key={item}
              variants={itemVariants}
              className="glass-muted rounded-[24px] px-5 py-4 text-center text-base font-semibold text-[var(--text-100)]"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      <ConclusionBanner text="随时随地的麦克风 + AI 语音输入法 + 各种 AI 工具，效率完全不一样。" />
    </SlideLayout>
  );
}

export default Slide3;
