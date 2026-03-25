import { motion } from "framer-motion";
import { AudioWaveform, Mic, Sparkles, Volume2 } from "lucide-react";
import { itemVariants } from "../../animations";
import SlideLayout from "../ui/SlideLayout";
import TitleArea from "../ui/TitleArea";
import ConclusionBanner from "../ui/ConclusionBanner";

const upgrades = [
  { icon: AudioWaveform, title: "降噪实用", text: "只收你的声音，环境音过滤掉" },
  { icon: Sparkles, title: "灵敏度高", text: "压低声音也能清晰收录" },
  { icon: Volume2, title: "随身携带", text: "放口袋就走，工作室/家里/咖啡厅随时用" },
];

function Slide7() {
  return (
    <SlideLayout className="justify-between">
      <div className="glow-orb right-[8%] top-[18%] h-80 w-80 bg-[var(--primary-300)]" />

      <div className="flex flex-1 flex-col justify-center gap-10">
        <TitleArea
          eyebrow="SOLUTION / 07"
          title="从桌面麦克风到无线"
          subtitle={'之前买了贵的桌面麦克风固定在工作室，回家后发现语音需求一样大——固定在桌上的，cover 不了"随时随地都在说"。'}
          maxWidth="43rem"
        />

        <div className="grid items-center gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <motion.div variants={itemVariants} className="glass-card relative overflow-hidden rounded-[38px] p-8">
            <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,var(--primary-100),var(--accent-100))]" />
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-[var(--text-100)] text-white shadow-[0_18px_40px_rgba(1,78,96,0.2)]">
              <Mic className="h-14 w-14" />
            </div>
            <p className="mt-6 text-center text-sm uppercase tracking-[0.24em] text-[var(--text-200)]">
              Stable Input Layer
            </p>
            <p className="mt-3 text-center text-2xl font-bold text-[var(--text-100)]">所以必须换成无线的</p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {upgrades.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                variants={itemVariants}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <ConclusionBanner text={'当语音输入变成"随时随地"的需求，固定在桌上的麦克风就不够了。'} />
    </SlideLayout>
  );
}

export default Slide7;
