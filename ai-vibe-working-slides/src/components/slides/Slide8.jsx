import { motion } from "framer-motion";
import { AudioWaveform, BatteryCharging, Mic, Sparkles } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const features = [
  { icon: Mic, title: "小巧性价比高", text: "放口袋就能带走，配 3D 打印三角支架放桌上也方便" },
  { icon: Sparkles, title: "灵敏度高", text: "压低声音也能清晰收录，旁边有人小声说也没问题" },
  { icon: AudioWaveform, title: "降噪实用", text: "基本只收你的声音，环境音过滤掉，不影响 AI 识别" },
  { icon: BatteryCharging, title: "续航强劲", text: "搭配充电盒，两只麦同时工作约 50 小时，一周很少充电" },
];

function Slide8() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb left-[5%] top-[14%] h-72 w-72 bg-[var(--primary-300)]" />
      <div className="glow-orb right-[5%] top-[26%] h-72 w-72 bg-[var(--accent-200)]" />

      <div className="grid flex-1 items-center gap-8 lg:grid-cols-[0.84fr_1.16fr]">
        <div className="relative z-10">
          <TitleArea
            eyebrow="PRODUCT FIT / 08"
            title="猛玛 LARK A1"
            subtitle="专为随时随地的语音工作流打造——小巧、灵敏、降噪强。"
            maxWidth="38rem"
          />

          <motion.div variants={itemVariants} className="glass-card mt-8 rounded-[36px] p-8">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,var(--text-100),var(--primary-100))] text-white">
              <Mic className="h-14 w-14" />
            </div>
            <p className="mt-6 text-center text-sm uppercase tracking-[0.24em] text-[var(--text-200)]">
              Battery + Mobility
            </p>
            <p className="metric-number mt-4 text-center text-[var(--text-100)]">50H</p>
            <p className="mt-3 text-center text-base leading-7 text-[var(--text-200)]">
              两只麦 + 充电盒
              <br />
              一周内很少需要补电
            </p>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className={`rounded-[30px] p-6 ${index === 2 ? "accent-panel" : "glass-card"}`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${index === 2 ? "bg-white/16 text-white" : "bg-[var(--text-100)] text-white"}`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h3 className={`mt-6 text-2xl font-bold ${index === 2 ? "text-white" : "text-[var(--text-100)]"}`}>
                {title}
              </h3>
              <p className={`mt-3 text-sm leading-6 ${index === 2 ? "text-white/88" : "text-[var(--text-200)]"}`}>
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <ConclusionBanner text="小巧、灵敏、降噪、长续航，适合随时随地的 Vibe Working 工作方式。" />
    </SlideLayout>
  );
}

export default Slide8;
