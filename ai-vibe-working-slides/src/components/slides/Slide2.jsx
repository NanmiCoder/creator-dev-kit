import { motion } from "framer-motion";
import { BriefcaseBusiness, Code2, FileText, Search, Sparkles } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const lanes = [
  { icon: Code2, title: "开发", text: "对着 Claude Code 直接讲复杂需求" },
  { icon: Search, title: "研究", text: "跟 OpenClaw 龙虾边走边聊需求" },
  { icon: FileText, title: "内容", text: "提纲、灵感、改稿全靠说" },
  { icon: BriefcaseBusiness, title: "协作", text: "GPT / Gemini / DeepSeek / 豆包" },
];

function Slide2() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb left-[6%] top-[16%] h-72 w-72 bg-[var(--primary-300)]" />

      <div className="grid flex-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative z-10 flex flex-col justify-center gap-8">
          <TitleArea
            eyebrow="SHIFT / 02"
            title={
              <>
                从 Vibe Coding
                <br />
                到 Vibe Working
              </>
            }
            subtitle="越来越多普通人也在用 AI 工具辅助日常工作。不只是 coding，而是整个工作方式都在变。"
            maxWidth="42rem"
          />

          <motion.div variants={itemVariants} className="flex items-end gap-4">
            <div className="glass-card rounded-[28px] px-6 py-5">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-200)]">Scope</p>
              <p className="metric-number text-[var(--text-100)]">1 → N</p>
            </div>
            <div className="glass-muted max-w-sm rounded-[28px] px-5 py-5">
              <div className="flex items-center gap-2 text-[var(--accent-100)]">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em]">AI Usage</span>
              </div>
              <p className="mt-3 text-lg leading-7 text-[var(--text-100)]">
                从"写代码时用 AI"
                <br />
                变成"工作时先把意图交给 AI"
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="relative z-10 flex items-center">
          <div className="grid w-full gap-4 md:grid-cols-2">
            {lanes.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className={`rounded-[30px] p-6 ${index === 1 ? "accent-panel" : "glass-card"}`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${index === 1 ? "bg-white/16 text-white" : "bg-[var(--text-100)] text-white"}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className={`mt-6 text-2xl font-bold ${index === 1 ? "text-white" : "text-[var(--text-100)]"}`}>
                  {title}
                </h3>
                <p className={`mt-3 text-sm leading-6 ${index === 1 ? "text-white/88" : "text-[var(--text-200)]"}`}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <ConclusionBanner text="查资料、整理信息、写内容、推进任务……AI 正在变成很多人的日常协作对象。" />
    </SlideLayout>
  );
}

export default Slide2;
