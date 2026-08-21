import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import type CameraControlsImpl from 'camera-controls';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';
import { useStore } from '../store';
import { FIELD_CENTER, TURBINES } from '../data/world';

/* ============================================================
   镜头叙事：
   1) 开场序列（可跳过）：高空 → 掠海 → 穿过第一排 → 运维总览
   2) 聚焦机组：从当前视角平滑飞近
   3) 电影模式：预设路径巡航，任意交互平滑退出
   ============================================================ */

const OVERVIEW_POS = new THREE.Vector3(820, 300, 1480);
const OVERVIEW_TGT = new THREE.Vector3(0, 40, -100);

const INTRO: Array<{ pos: [number, number, number]; tgt: [number, number, number]; dur: number }> = [
  { pos: [760, 26, 1210], tgt: [-150, 55, 300], dur: 1550 },
  { pos: [240, 20, 700], tgt: [0, 85, 300], dur: 1650 },
  { pos: [820, 300, 1480], tgt: [0, 40, -100], dur: 1750 },
];

const CINEMA_PTS = [
  [2300, 170, 1500],
  [2250, 250, -350],
  [1600, 300, -2150],
  [-350, 270, -2650],
  [-2250, 230, -1500],
  [-2300, 150, 150],
  [-900, 135, 1650],
  [900, 190, 1950],
];

export function CameraRig() {
  const controls = useRef<CameraControlsImpl | null>(null);
  const { camera, gl } = useThree();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (controls.current) {
      const dbg = (window as unknown as Record<string, unknown>).__PELAGOS_DEBUG__ as Record<string, unknown> | undefined;
      if (dbg) dbg.controls = controls.current;
    }
  });

  /* ---------- 开场镜头序列 ---------- */
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const st = useStore.getState();
    if (st.introDone || st.cinema) return;
    let alive = true;

    const finish = () => {
      if (!alive) return;
      alive = false;
      cleanup();
      if (!useStore.getState().introDone) {
        useStore.getState().setIntroDone();
      }
    };

    const cleanup = () => {
      dom.removeEventListener('pointerdown', skip);
      dom.removeEventListener('wheel', skip);
      dom.removeEventListener('touchstart', skip);
      win.removeEventListener('keydown', skip);
    };

    const dom = gl.domElement;
    const win = window;
    const skip = () => {
      if (!alive) return;
      // 快速收束到总览（若用户点击了机组，后续 focusReq 会接管）
      c.stop();
      c.smoothTime = reduced ? 0.05 : 0.5;
      c.setLookAt(
        camera.position.x, camera.position.y, camera.position.z,
        OVERVIEW_TGT.x, OVERVIEW_TGT.y, OVERVIEW_TGT.z,
        true,
      );
      window.setTimeout(() => { c.smoothTime = 0.16; }, reduced ? 80 : 560);
      finish();
    };
    dom.addEventListener('pointerdown', skip);
    dom.addEventListener('wheel', skip, { passive: true });
    dom.addEventListener('touchstart', skip, { passive: true });
    win.addEventListener('keydown', skip);

    if (reduced) {
      c.setLookAt(OVERVIEW_POS.x, OVERVIEW_POS.y, OVERVIEW_POS.z, OVERVIEW_TGT.x, OVERVIEW_TGT.y, OVERVIEW_TGT.z, false);
      finish();
      return () => cleanup();
    }

    // 起始位置
    c.setLookAt(1700, 340, 2300, 0, 50, 0, false);

    let step = 0;
    const runStep = () => {
      if (!alive) return;
      if (step >= INTRO.length) {
        finish();
        return;
      }
      const s = INTRO[step];
      c.smoothTime = s.dur / 1000;
      c.setLookAt(s.pos[0], s.pos[1], s.pos[2], s.tgt[0], s.tgt[1], s.tgt[2], true);
      step++;
      timer = window.setTimeout(runStep, s.dur + 40);
    };
    let timer = window.setTimeout(runStep, 120);
    void skip;

    return () => {
      alive = false;
      window.clearTimeout(timer);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- 聚焦机组 / 返回总览 ---------- */
  const focusN = useStore((s) => s.focusReq?.n ?? 0);
  useEffect(() => {
    const c = controls.current;
    const st = useStore.getState();
    if (!c || st.cinema) return;
    const id = st.focusReq?.id ?? null;
    const smooth = reduced ? 0.38 : 1.15;
    c.smoothTime = smooth;
    if (id === null) {
      c.setLookAt(OVERVIEW_POS.x, OVERVIEW_POS.y, OVERVIEW_POS.z, OVERVIEW_TGT.x, OVERVIEW_TGT.y, OVERVIEW_TGT.z, true);
      const t = window.setTimeout(() => { c.smoothTime = 0.16; }, smooth * 1000 + 60);
      return () => window.clearTimeout(t);
    }
    const t = TURBINES[id];
    // 从当前相机方位接近机组，避免穿场
    const dir = camera.position.clone().sub(new THREE.Vector3(t.x, 0, t.z));
    dir.y = 0;
    if (dir.lengthSq() < 1) dir.set(1, 0, 0.8);
    dir.normalize();
    const pos = new THREE.Vector3(t.x, 0, t.z).addScaledVector(dir, 430);
    pos.y = 78;
    const tgt = new THREE.Vector3(t.x, 84, t.z);
    c.setLookAt(pos.x, pos.y, pos.z, tgt.x, tgt.y, tgt.z, true);
    const timer = window.setTimeout(() => { c.smoothTime = 0.16; }, smooth * 1000 + 60);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusN]);

  /* ---------- 电影模式 ---------- */
  const cinema = useStore((s) => s.cinema);
  const cine = useRef({
    active: false,
    pos: new THREE.Vector3(),
    tgt: new THREE.Vector3(),
    offset: new THREE.Vector3(),
    curve: null as THREE.CatmullRomCurve3 | null,
  });

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const state = cine.current;
    if (cinema) {
      state.active = true;
      const pts = CINEMA_PTS.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
      state.curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.55);
      state.pos.copy(camera.position);
      c.getTarget(state.tgt);
      state.offset.copy(camera.position).sub(state.curve.getPointAt(0));
      c.stop();
      c.enabled = false;
    } else if (state.active) {
      state.active = false;
      c.enabled = true;
      c.smoothTime = 0.4;
      c.setLookAt(camera.position.x, camera.position.y, camera.position.z, state.tgt.x, state.tgt.y, state.tgt.z, true);
      const timer = window.setTimeout(() => { c.smoothTime = 0.16; }, 500);
      return () => window.clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinema]);

  useFrame((_, dt) => {
    const state = cine.current;
    const c = controls.current;
    if (!state.active || !c || !state.curve) return;
    const period = 58;
    const tt = (performance.now() / 1000) % period / period;
    const pos = state.curve.getPointAt(tt);
    const ahead = state.curve.getPointAt((tt + 0.042) % 1);
    state.offset.multiplyScalar(Math.exp(-1.5 * dt));
    const target = pos.clone().add(state.offset);
    const look = ahead.clone().lerp(new THREE.Vector3(FIELD_CENTER.x, 40, FIELD_CENTER.z), 0.35);
    look.y = Math.max(look.y, 55);
    const k = 1 - Math.exp(-2.6 * dt);
    state.pos.lerp(target, k);
    state.tgt.lerp(look, k);
    camera.position.copy(state.pos);
    camera.lookAt(state.tgt);
  });

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={70}
      maxDistance={3400}
      maxPolarAngle={1.53}
      minPolarAngle={0.06}
      smoothTime={0.16}
      draggingSmoothTime={0.12}
    />
  );
}
