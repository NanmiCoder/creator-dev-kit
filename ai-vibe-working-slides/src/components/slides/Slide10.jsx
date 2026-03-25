import { motion } from "framer-motion";
import { Check, Mic, Sparkles } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const recap = [
  "随时随地说",
  "小声也能收录",
  "AI 即时响应",
];

function Slide10() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb left-[5%] top-[18%] h-80 w-80 bg-[var(--primary-300)]" />
      <div className="glow-orb right-[10%] top-[14%] h-72 w-72 bg-[var(--accent-200)]" />

      <div className="flex flex-1 flex-col justify-center gap-10">
        <TitleArea
          eyebrow="WRAP / 10"
          title={
            <>
              从 Vibe Coding
              <br />
              到 Vibe Working
            </>
          }
          subtitle="一个随身带的好麦克风配上 AI 语音输入法，就是这套工作流能不能真正跑顺的关键。"
          maxWidth="46rem"
        />

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div variants={itemVariants} className="glass-card rounded-[36px] p-8 md:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[var(--text-100)] text-white">
                <Mic className="h-8 w-8" />
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[var(--accent-100)] text-white">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>
            <p className="mt-8 text-3xl font-bold leading-tight text-[var(--text-100)] md:text-5xl">
              随时随地 麦克风 + AI 语音输入法 + 各种 AI 工具
              <br />
              就是这套工作流能不能跑顺的关键
            </p>
          </motion.div>

          <div className="grid gap-4">
            {recap.map((item, index) => (
              <motion.div
                key={item}
                variants={itemVariants}
                className={`rounded-[28px] px-6 py-5 ${index === 1 ? "accent-panel" : "glass-card"}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 1 ? "bg-white/16 text-white" : "bg-[var(--text-100)] text-white"}`}
                  >
                    <Check className="h-6 w-6" />
                  </div>
                  <p className={`text-2xl font-bold ${index === 1 ? "text-white" : "text-[var(--text-100)]"}`}>
                    {item}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ConclusionBanner text="随时随地的麦克风 + AI 语音输入法 + 各种 AI 工具，Vibe Working 才能真正跑顺。" />
    </SlideLayout>
  );
}

export default Slide10;
