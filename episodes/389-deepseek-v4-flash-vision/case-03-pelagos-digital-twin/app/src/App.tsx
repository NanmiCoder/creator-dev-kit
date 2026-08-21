import { Component, useEffect, useRef, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from './store';
import { liveNow } from './data/weather';
import { Scene } from './three/Scene';
import { TopBar } from './ui/TopBar';
import { AssetTree } from './ui/AssetTree';
import { ContextPanel } from './ui/ContextPanel';
import { Timeline } from './ui/Timeline';
import { AlertCenter } from './ui/AlertCenter';
import { CinemaUI } from './ui/CinemaUI';
import { Sheet } from './ui/Sheet';
import { BootOverlay } from './ui/Boot';
import { DegradedMap } from './ui/Degraded';
import { Toasts } from './ui/Toasts';
import { useMediaQuery } from './hooks/useMediaQuery';

const webglSupported = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
})();

export default function App() {
  const webglFailed = useStore((s) => s.webglFailed);
  const visible = useStore((s) => s.visible);
  const setVisible = useStore((s) => s.setVisible);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const cinema = useStore((s) => s.cinema);
  const setCinema = useStore((s) => s.setCinema);
  const setSceneReady = useStore((s) => s.setSceneReady);
  const failWebgl = useStore((s) => s.failWebgl);
  const select = useStore((s) => s.select);
  const moved = useRef(0);

  useEffect(() => {
    if (!webglSupported) failWebgl();
  }, [failWebgl]);

  /* 实时走时：live 状态下每秒推进演示时钟 */
  useEffect(() => {
    const iv = setInterval(() => {
      const st = useStore.getState();
      if (st.live) st.setTime(liveNow(), true);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  /* 标签页隐藏 → 暂停渲染循环 */
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [setVisible]);

  /* 键盘：Esc 返回总览 / F 聚焦 / M 电影模式 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const st = useStore.getState();
      if (e.key === 'Escape') {
        if (st.cinema) { st.setCinema(false); return; }
        if (st.taskFormOpen) { st.setTaskFormOpen(false); return; }
        if (st.alertOpen) { st.setAlertOpen(false); return; }
        if (st.selected !== null) st.select(null, { focus: true });
        return;
      }
      const k = e.key.toLowerCase();
      if (k === 'f') {
        if (st.selected !== null) st.select(st.selected, { focus: true });
        else st.select(0, { focus: true });
      } else if (k === 'm' && !st.webglFailed) {
        st.setCinema(!st.cinema);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* 电影模式：任意交互平滑退出 */
  useEffect(() => {
    if (!cinema) return;
    const exit = () => useStore.getState().setCinema(false);
    window.addEventListener('pointerdown', exit, { capture: true });
    window.addEventListener('wheel', exit, { capture: true });
    const timer = setTimeout(exit, 90_000);
    return () => {
      window.removeEventListener('pointerdown', exit, { capture: true });
      window.removeEventListener('wheel', exit, { capture: true });
      clearTimeout(timer);
    };
  }, [cinema]);

  return (
    <div className="app">
      {/* 3D 画布层 */}
      <div className="scene-layer">
        {!webglFailed && (
          <CanvasErrorBoundary onError={failWebgl}>
            <Canvas
              dpr={isDesktop ? [1, 2] : [1, 1.5]}
              camera={{ fov: 42, near: 1, far: 12000, position: [1700, 340, 2300] }}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
              frameloop={visible ? 'always' : 'never'}
              onCreated={() => setSceneReady()}
              onPointerMissed={() => {
                if (moved.current < 8) select(null, { focus: true });
              }}
            >
              <Scene />
              <DragTrack moved={moved} />
            </Canvas>
          </CanvasErrorBoundary>
        )}
        {webglFailed && <DegradedMap />}
      </div>

      {/* 操作层 */}
      <div className="ui-layer">
        <AnimatePresence>
          {!cinema && (
            <motion.div key="topbar" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
              <TopBar compact={!isDesktop} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDesktop && !cinema && (
            <motion.div key="tree" className="panel-slot panel-slot-left" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.05 }}>
              <AssetTree />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDesktop && !cinema && (
            <motion.div key="ctx" className="panel-slot panel-slot-right" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }} transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}>
              <ContextPanel compact={false} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDesktop && !cinema && (
            <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AlertCenter />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!cinema && (
            <motion.div key="timeline" className="timeline-slot" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.15 }}>
              <Timeline compact={!isDesktop} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isDesktop && !cinema && <Sheet />}
        <CinemaUI />
        <Toasts />
      </div>

      <BootOverlay />
    </div>
  );
}

/* Canvas 内指针轨迹追踪（区分拖拽与点击） */
function DragTrack({ moved }: { moved: React.MutableRefObject<number> }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    let sx = 0, sy = 0;
    const down = (e: PointerEvent) => { sx = e.clientX; sy = e.clientY; moved.current = 0; };
    const move = (e: PointerEvent) => { moved.current = Math.max(moved.current, Math.hypot(e.clientX - sx, e.clientY - sy)); };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
    };
  }, [gl, moved]);
  return null;
}

/* Canvas 崩溃兜底：降级到平面总览而非白屏 */
class CanvasErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
