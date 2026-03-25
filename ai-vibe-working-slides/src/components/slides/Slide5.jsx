import { motion } from "framer-motion";
import { ArrowRight, Bot, NotebookPen, Sparkles, Workflow } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const flow = [
  { icon: Sparkles, title: "想到就说", text: "念头刚出现就能输出" },
  { icon: NotebookPen, title: "完整表达", text: "不用先压缩成几行字" },
  { icon: Bot, title: "AI 理解", text: "即时理解、整理、补全" },
  { icon: Workflow, title: "持续迭代", text: "说 → 结果 → 再说 → 再迭代" },
];

function Slide5() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb right-[3%] top-[22%] h-80 w-80 bg-[var(--primary-300)]" />

      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10">
          <TitleArea
            eyebrow="EFFICIENCY / 05"
            title="语音是最自然的表达"
            subtitle="一旦习惯了这种方式，语音输入已经变成整个 AI 工作流里最前置的一步。"
            maxWidth="38rem"
          />

          <motion.div variants={itemVariants} className="mt-6 glass-card rounded-[32px] p-7">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-200)]">Key Change</p>
            <p className="metric-number mt-4 text-[var(--text-100)]">前置一步</p>
            <p className="mt-4 text-lg leading-8 text-[var(--text-200)]">
              输入门槛更低
              <br />
              上下文更完整
              <br />
              开始动作更快
            </p>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {flow.map(({ icon: Icon, title, text }, index) => (
            <motion.div key={title} variants={itemVariants} className="contents">
              <div className="glass-card rounded-[28px] px-5 py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--text-100)] text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-[var(--text-100)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-200)]">{text}</p>
              </div>
              {index < flow.length - 1 ? (
                <div className="hidden items-center justify-center md:flex">
                  <ArrowRight className="h-6 w-6 text-[var(--accent-100)]" />
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>

      <ConclusionBanner text="说 → AI 理解 → 输出结果 → 说 → 持续迭代，这就是 Vibe Working。" />
    </SlideLayout>
  );
}

export default Slide5;
