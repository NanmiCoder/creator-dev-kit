import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import TitleArea from '../ui/TitleArea';
import ConclusionBanner from '../ui/ConclusionBanner';
import { containerVariants, itemVariants } from '../../animations';

export default function Slide4() {
  const problems = [
    { title: 'AI 味太重', desc: '表述太满、句子太工整、转折太像模板' },
    { title: '手机改不动', desc: '来回拉结构、改句子、看上下文，屏幕太小' },
    { title: '等电脑又断了', desc: '灵感和执行力在等待中流失' },
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
        className="glow-bg opacity-20"
        style={{
          backgroundColor: 'var(--accent-200)',
          width: '600px',
          height: '600px',
          bottom: '-150px',
          right: '-150px'
        }}
      />

      <TitleArea
        title="但 AI 初稿，还不能直接用"
        subtitle="从初稿到成片，中间还差一步"
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-8 relative z-10">
        <div className="grid grid-cols-3 gap-6 max-w-5xl w-full px-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card rounded-xl p-8 flex flex-col items-start"
              style={{ borderLeft: `4px solid var(--accent-100)` }}
            >
              <AlertTriangle size={36} style={{ color: 'var(--accent-100)', flexShrink: 0 }} />
              <h3 className="text-xl font-bold mt-4 mb-3" style={{ color: 'var(--text-100)' }}>
                {problem.title}
              </h3>
              <p className="text-base" style={{ color: 'var(--text-200)' }}>
                {problem.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <ConclusionBanner text="不是缺初稿，是缺一个把灵感和改稿接起来的设备" isAccent={true} />
      </div>
    </motion.div>
  );
}
