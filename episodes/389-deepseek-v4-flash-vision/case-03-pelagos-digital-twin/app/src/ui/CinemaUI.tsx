import { AnimatePresence, motion } from 'motion/react';
import { Broadcast, FilmSlate } from '@phosphor-icons/react';
import { useStore } from '../store';

/* 电影模式：收起大部分 UI，镜头沿预设路径巡航；任意交互平滑退出 */

export function CinemaUI() {
  const cinema = useStore((s) => s.cinema);

  return (
    <AnimatePresence>
      {cinema && (
        <motion.div
          className="cinema-ui"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="cinema-chip glass">
            <FilmSlate size={14} weight="fill" style={{ color: 'var(--accent)' }} />
            <span className="mono cinema-label">CINEMA · 巡航中</span>
            <span className="dot breath" style={{ background: 'var(--accent)' }} />
          </div>
          <div className="cinema-hint glass-soft">
            <Broadcast size={13} />
            <span>任意操作退出巡航 · 按 M 或 Esc</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
