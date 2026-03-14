import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap } from 'lucide-react';
import TitleArea from '../ui/TitleArea';
import { containerVariants, itemVariants } from '../../animations';

export default function Slide3() {
  const steps = [
    { icon: <img src="/openclaw-logo.png" alt="OpenClaw" className="w-12 h-12 object-contain" />, title: '养龙虾做 Skill', desc: '把过往视频喂给龙虾，做成专属 Skill' },
    { icon: <MessageSquare size={48} />, title: '手机聊天出初稿', desc: '告诉它主题、Hook、观点、案例，几分钟出 Word' },
    { icon: <Zap size={48} />, title: '从 0 到 1 最难', desc: 'OpenClaw 龙虾帮你把骨架先搭起来' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col relative"
    >
      {/* 光晕装饰 */}
      <div
        className="glow-bg opacity-30"
        style={{
          backgroundColor: 'var(--primary-200)',
          width: '500px',
          height: '500px',
          bottom: '-100px',
          right: '-100px'
        }}
      />

      <TitleArea
        title="工作流变了——因为 OpenClaw 龙虾"
        subtitle="AI 帮你把骨架先搭起来"
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-8 relative z-10">
        <div className="grid grid-cols-3 gap-6 max-w-6xl w-full px-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-2xl p-8 text-center"
              style={{ borderBottom: `4px solid var(--primary-100)` }}
            >
              <div className="flex justify-center mb-4" style={{ color: 'var(--primary-100)' }}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-100)' }}>
                {step.title}
              </h3>
              <p className="text-base" style={{ color: 'var(--text-200)' }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-8 max-w-3xl text-center"
        >
          <p className="text-2xl font-semibold" style={{ color: 'var(--text-100)' }}>
            AI 负责出初稿，我负责把它改成人话
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
