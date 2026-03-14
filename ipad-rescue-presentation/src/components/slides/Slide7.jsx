import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../animations';

export default function Slide7() {
  const tags = [
    'OpenClaw 龙虾',
    '灵感不等人',
    'AI 出初稿',
    'WPS for Pad',
    '进入工作流',
    '救活 iPad',
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
          backgroundColor: 'var(--primary-100)',
          width: '600px',
          height: '600px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-12 pb-8 relative z-10">
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <h1 className="text-6xl font-bold mb-6" style={{ color: 'var(--text-100)' }}>
            我那台吃灰的 iPad
          </h1>
          <h2 className="text-5xl font-bold" style={{ color: 'var(--primary-100)' }}>
            终于活过来了
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-8 max-w-4xl text-center"
        >
          <p className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-100)' }}>
            一台设备真正有用，不是看它理论上能干什么
          </p>
          <p className="text-2xl font-semibold" style={{ color: 'var(--text-100)' }}>
            而是看你会不会下意识把它拿起来用
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 max-w-4xl px-8"
        >
          {tags.map((tag, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full text-lg font-medium"
              style={{
                backgroundColor: index % 2 === 0 ? 'var(--primary-100)' : 'var(--primary-200)',
                color: 'white'
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
