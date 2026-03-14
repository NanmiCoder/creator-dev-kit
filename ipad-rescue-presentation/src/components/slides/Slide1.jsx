import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw } from 'lucide-react';
import TitleArea from '../ui/TitleArea';
import ConclusionBanner from '../ui/ConclusionBanner';
import { containerVariants, itemVariants } from '../../animations';

export default function Slide1() {
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
          top: '-100px',
          right: '-100px'
        }}
      />
      <div
        className="glow-bg opacity-20"
        style={{
          backgroundColor: 'var(--accent-200)',
          width: '400px',
          height: '400px',
          bottom: '-100px',
          left: '-100px'
        }}
      />

      <TitleArea
        title="我把吃灰两年的 iPad 救活了"
        subtitle="靠一只 OpenClaw 龙虾"
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-8 relative z-10">
        <div className="grid grid-cols-3 gap-8 max-w-6xl w-full px-8">
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-8 flex flex-col items-center text-center"
          >
            <img src="/openclaw-logo.png" alt="OpenClaw" className="w-16 h-16 object-contain" />
            <h3 className="text-2xl font-bold mt-4 mb-2" style={{ color: 'var(--text-100)' }}>
              OpenClaw 龙虾
            </h3>
            <p className="text-lg" style={{ color: 'var(--text-200)' }}>
              AI 帮你从 0 到 1 搭骨架
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-8 flex flex-col items-center text-center"
          >
            <Lightbulb size={64} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-2xl font-bold mt-4 mb-2" style={{ color: 'var(--text-100)' }}>
              灵感不等人
            </h3>
            <p className="text-lg" style={{ color: 'var(--text-200)' }}>
              想到就改，不等回到工作室
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-8 flex flex-col items-center text-center"
          >
            <RefreshCw size={64} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-2xl font-bold mt-4 mb-2" style={{ color: 'var(--text-100)' }}>
              进入工作流
            </h3>
            <p className="text-lg" style={{ color: 'var(--text-200)' }}>
              第一反应拿起 iPad 开始
            </p>
          </motion.div>
        </div>

        <ConclusionBanner text="你的 iPad 现在在干嘛？" />
      </div>
    </motion.div>
  );
}
