import { motion } from "framer-motion";
import { ArrowRight, AudioWaveform, Bot, Mic, Workflow } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const chain = [
  { icon: Mic, title: "LARK A1", text: "稳定收音" },
  { icon: AudioWaveform, title: "AI 输入法", text: "即时转文字" },
  { icon: Bot, title: "AI 工具", text: "理解、整理、补全" },
  { icon: Workflow, title: "结果产出", text: "内容 / 任务 / 代码" },
];

function Slide9() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb right-[7%] top-[20%] h-72 w-72 bg-[var(--primary-300)]" />

      <div className="flex flex-1 flex-col justify-center gap-10">
        <TitleArea
          eyebrow="PIPELINE / 09"
          title="完整工作流怎么串起来"
          subtitle="把硬件、输入法和 AI 工具接成一条顺畅链路，效率才会稳定。"
          maxWidth="44rem"
        />

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {chain.map(({ icon: Icon, title, text }, index) => (
            <motion.div key={title} variants={itemVariants} className="contents">
              <div className="glass-card rounded-[30px] p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--text-100)] text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--text-100)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-200)]">{text}</p>
              </div>
              {index < chain.length - 1 ? (
                <div className="hidden items-center justify-center md:flex">
                  <ArrowRight className="h-6 w-6 text-[var(--accent-100)]" />
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["边走边聊需求", "工作室讲复杂需求", "随时记灵感写提纲"].map((item) => (
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

      <ConclusionBanner text="LARK A1 + AI 语音输入法 + 各种 AI 工具，随时随地跑通整条链路。" />
    </SlideLayout>
  );
}

export default Slide9;
