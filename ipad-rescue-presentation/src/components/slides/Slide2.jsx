import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Clock, FileText } from 'lucide-react';
import TitleArea from '../ui/TitleArea';
import ConclusionBanner from '../ui/ConclusionBanner';
import { containerVariants, itemVariants } from '../../animations';

export default function Slide2() {
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
          backgroundColor: 'var(--primary-300)',
          width: '600px',
          height: '600px',
          top: '-150px',
          right: '-150px'
        }}
      />

      <TitleArea
        title="以前为什么 iPad 总吃灰？"
        subtitle="不是 iPad 不行，是移动端办公差那么一口气"
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-8 relative z-10">
        <div className="grid grid-cols-3 gap-6 max-w-6xl w-full px-8">
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 flex flex-col items-start relative"
          >
            <div className="absolute top-4 right-4 opacity-20">
              <Layers size={80} style={{ color: 'var(--primary-100)' }} />
            </div>
            <Layers size={48} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: 'var(--text-100)' }}>
              移动端不能打
            </h3>
            <p className="text-base" style={{ color: 'var(--text-200)' }}>
              标题、Hook、结构、案例、结尾——稍微复杂一点，软件就接不住
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 flex flex-col items-start relative"
          >
            <div className="absolute top-4 right-4 opacity-20">
              <Clock size={80} style={{ color: 'var(--primary-100)' }} />
            </div>
            <Clock size={48} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: 'var(--text-100)' }}>
              灵感不等人
            </h3>
            <p className="text-base" style={{ color: 'var(--text-200)' }}>
              沙发上、咖啡店、地铁上突然想到，等坐回电脑前已经没了
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 flex flex-col items-start relative"
          >
            <div className="absolute top-4 right-4 opacity-20">
              <FileText size={80} style={{ color: 'var(--primary-100)' }} />
            </div>
            <FileText size={48} style={{ color: 'var(--primary-100)' }} />
            <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: 'var(--text-100)' }}>
              只能记标题
            </h3>
            <p className="text-base" style={{ color: 'var(--text-200)' }}>
              临时记个标题行，正式写？还是得回电脑
            </p>
          </motion.div>
        </div>

        <ConclusionBanner text="它始终没有进入工作流，吃灰很正常" />
      </div>
    </motion.div>
  );
}
