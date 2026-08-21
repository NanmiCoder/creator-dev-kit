import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store';

/* 启动覆盖层：品牌 + 进度 + 阶段状态（场景首帧就绪后放行） */

const STAGES = [
  [0, '初始化渲染器'],
  [26, '编译海面着色器'],
  [52, '同步 SCADA 数据'],
  [78, '校准镜头'],
  [100, '就绪'],
] as const;

export function BootOverlay() {
  const bootDone = useStore((s) => s.bootDone);
  const progress = useStore((s) => s.bootProgress);
  const sceneReady = useStore((s) => s.sceneReady);
  const tickBoot = useStore((s) => s.tickBoot);
  const setBootDone = useStore((s) => s.setBootDone);

  // 伪进度推进（真实就绪由 sceneReady 兜底）
  useEffect(() => {
    const iv = setInterval(() => {
      const p = useStore.getState().bootProgress;
      if (p < 88 && !useStore.getState().bootDone) tickBoot(Math.min(88, p + 2.2 + Math.random() * 2.4));
    }, 130);
    return () => clearInterval(iv);
  }, [tickBoot]);

  useEffect(() => {
    if (sceneReady) tickBoot(100);
  }, [sceneReady, tickBoot]);

  useEffect(() => {
    if (progress >= 100 && sceneReady) {
      const timer = setTimeout(setBootDone, 420);
      return () => clearTimeout(timer);
    }
  }, [progress, sceneReady, setBootDone]);

  const stage = STAGES.find(([p]) => progress < p) ?? STAGES[STAGES.length - 1];

  return (
    <AnimatePresence>
      {!bootDone && (
        <motion.div
          className="boot"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="boot-inner">
            <span className="boot-rotor" aria-hidden>
              <i /><i /><i />
            </span>
            <h1 className="boot-brand">PELAGOS</h1>
            <div className="boot-sub mono">FIELD 07 · 海上风电数字孪生控制台</div>
            <div className="boot-bar">
              <motion.div className="boot-bar-fill" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.25 }} />
            </div>
            <div className="boot-meta">
              <span className="mono boot-pct">{Math.floor(progress)}%</span>
              <span className="boot-stage">{stage[1]}</span>
            </div>
            <div className="boot-tips label">北海 · 日落后 18 分钟 · 24 台机组在线</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
