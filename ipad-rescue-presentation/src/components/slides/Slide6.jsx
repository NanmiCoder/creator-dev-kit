import React from 'react';
import { motion } from 'framer-motion';
import { Tablet, Keyboard, Hand, Pencil } from 'lucide-react';
import { containerVariants, itemVariants } from '../../animations';

export default function Slide6() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="h-full flex flex-col relative"
    >
      {/* 光晕装饰 */}
      <div
        className="glow-bg opacity-25"
        style={{
          backgroundColor: 'var(--primary-100)',
          width: '600px',
          height: '600px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-10 relative z-10">
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <Tablet size={80} style={{ color: 'var(--primary-100)' }} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-100)' }}>
            WPS for Pad 实操演示
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-200)' }}>
            接下来切换到 iPad 实操
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-8 max-w-2xl text-center"
        >
          <p className="text-lg mb-6" style={{ color: 'var(--text-100)' }}>
            打开 OpenClaw 龙虾生成的 Word → 在 WPS for Pad 中编辑改稿
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Keyboard size={32} style={{ color: 'var(--primary-100)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>键鼠</span>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: 'var(--bg-300)' }} />
            <div className="flex flex-col items-center gap-2">
              <Hand size={32} style={{ color: 'var(--primary-100)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>触控</span>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: 'var(--bg-300)' }} />
            <div className="flex flex-col items-center gap-2">
              <Pencil size={32} style={{ color: 'var(--primary-100)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-200)' }}>Apple Pencil</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
