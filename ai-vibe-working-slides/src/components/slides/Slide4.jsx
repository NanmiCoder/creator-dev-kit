import { motion } from "framer-motion";
import { Code2, FileText, Search } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const scenarios = [
  { icon: Search, title: "走在路上", text: "跟 OpenClaw 龙虾边走边聊需求" },
  { icon: Code2, title: "坐在工作室", text: "对着 Claude Code 直接讲复杂需求" },
  { icon: FileText, title: "随时随地", text: "写提纲、记灵感、改文案，先说再让 AI 接" },
];

function Slide4() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb left-[4%] top-[18%] h-72 w-72 bg-[var(--accent-200)]" />

      <div className="flex flex-1 flex-col justify-center gap-10">
        <TitleArea
          eyebrow="SCENES / 04"
          title="基本不打字了，全是说"
          subtitle="键盘只用来按回车和确认，其他时候全靠嘴。"
          maxWidth="42rem"
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_0.8fr]">
          {scenarios.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className={`rounded-[32px] p-6 ${index === 1 ? "accent-panel" : "glass-card"}`}
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
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="glass-card rounded-[32px] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-200)]">Role</p>
            <p className="metric-number mt-3 text-[var(--text-100)]">Input</p>
            <p className="mt-3 text-base leading-7 text-[var(--text-200)]">
              全程语音
              <br />
              随时随地
              <br />
              跟 AI 对话
            </p>
          </motion.div>
        </div>
      </div>

      <ConclusionBanner text="语音输入已经变成整个 AI 工作流里最前置的一步。" />
    </SlideLayout>
  );
}

export default Slide4;
