import { motion } from "framer-motion";
import { AudioWaveform, Mic, TriangleAlert, Volume2 } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const painPoints = [
  { icon: AudioWaveform, title: "嘈杂环境干扰", text: "咖啡厅、共享工位环境音收进去，识别准确率下降" },
  { icon: TriangleAlert, title: "需要返工", text: "识别出错后还得回去手动修改，体验打折扣" },
  { icon: Volume2, title: "场景顾虑", text: "得说比较大声识别才稳定，旁边有人会不自在" },
];

function Slide6() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb left-[8%] top-[18%] h-64 w-64 bg-[var(--accent-200)]" />

      <div className="grid flex-1 items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10">
          <TitleArea
            eyebrow="FRICTION / 06"
            title="高频使用后的瓶颈"
            subtitle="自带麦克风日常用还行，但高频语音输入时会遇到场景限制。"
            maxWidth="40rem"
          />
        </div>

        <div className="grid gap-4">
          {painPoints.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="glass-card rounded-[28px] border-l-[6px] border-l-[var(--accent-100)] px-6 py-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-100)] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-100)]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-200)]">{text}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="glass-card relative overflow-hidden rounded-[30px] p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--accent-100),var(--primary-100))]" />
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--text-100)] text-white">
                <Mic className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-200)]">Typical Scenes</p>
                <p className="mt-2 text-xl font-bold text-[var(--text-100)]">咖啡厅 / 共享工位 / 开放办公室</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ConclusionBanner text="不是语音输入不好用，而是自带麦克风在这些场景下撑不住。" />
    </SlideLayout>
  );
}

export default Slide6;
