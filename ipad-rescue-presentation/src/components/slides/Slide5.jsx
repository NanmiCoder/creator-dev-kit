import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, CheckCircle, Pencil, FileText, Tablet, Film } from 'lucide-react';
import TitleArea from '../ui/TitleArea';
import ConclusionBanner from '../ui/ConclusionBanner';
import { containerVariants, itemVariants } from '../../animations';

export default function Slide5() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col relative"
    >
      <TitleArea
        title="WPS for Pad 接住了这个工作流"
        subtitle="基于大屏生态从头重构的产品"
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-8 relative z-10">
        {/* 三大功能 */}
        <div className="grid grid-cols-3 gap-6 max-w-5xl w-full px-8">
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-6"
            style={{ borderBottom: `4px solid var(--primary-100)` }}
          >
            <Monitor size={40} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-lg font-bold mt-3 mb-2" style={{ color: 'var(--text-100)' }}>
              界面与交互
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-200)' }}>
              彻底的 PC 化原生适配，打开龙虾的 Word 跟电脑一样
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-6"
            style={{ borderBottom: `4px solid var(--primary-100)` }}
          >
            <CheckCircle size={40} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-lg font-bold mt-3 mb-2" style={{ color: 'var(--text-100)' }}>
              功能完整度
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-200)' }}>
              与 PC 端真正对齐，排版、样式、批注都有
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-6"
            style={{ borderBottom: `4px solid var(--primary-100)` }}
          >
            <Pencil size={40} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-lg font-bold mt-3 mb-2" style={{ color: 'var(--text-100)' }}>
              Apple Pencil
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-200)' }}>
              深度适配，直接圈、划、标，像拿纸改稿
            </p>
          </motion.div>
        </div>

        {/* 新工作流示意 */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 max-w-5xl w-full px-8 justify-center"
        >
          <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-2">
            <img src="/openclaw-logo.png" alt="OpenClaw" className="w-6 h-6 object-contain" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-100)' }}>手机聊龙虾</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--primary-200)' }}>&gt;</span>
          <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-2">
            <FileText size={24} style={{ color: 'var(--primary-100)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-100)' }}>Word 初稿</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--primary-200)' }}>&gt;</span>
          <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-2" style={{ border: '2px solid var(--primary-100)' }}>
            <Tablet size={24} style={{ color: 'var(--primary-100)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--primary-100)' }}>iPad + WPS 改稿</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--primary-200)' }}>&gt;</span>
          <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-2">
            <Film size={24} style={{ color: 'var(--primary-100)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-100)' }}>电脑剪辑</span>
          </div>
        </motion.div>

        <ConclusionBanner text="龙虾解决从 0 到 1，WPS for Pad 把从 1 到可用接住了" />
      </div>
    </motion.div>
  );
}
