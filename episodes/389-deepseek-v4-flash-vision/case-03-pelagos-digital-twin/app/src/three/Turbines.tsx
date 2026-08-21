import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useStore } from '../store';
import { HUB_Y, ROTOR_R, TURBINES, statusOf, type TurbineState } from '../data/world';
import { powerAt, riskAt, rpmOf, windAtTurbine, yawErrorAt } from '../data/weather';
import type { ViewMode } from '../data/ops';

/* ============================================================
   24 台风机：塔筒+机舱+轮毂合并几何（InstancedMesh）
   + 叶轮 72 实例 + 航标灯 + 基座阴影盘
   每帧独立更新：转速随风速/状态、偏航漂移、航标灯闪烁、模式配色
   ============================================================ */

const D2R = Math.PI / 180;

const STATUS_COLOR: Record<TurbineState, number> = {
  normal: 0xa9b6c2,
  derated: 0xd9a35b,
  offline: 0x5f6c7a,
  maintenance: 0xde804a,
};

const HEAT_STOPS = [
  [0, 0x24313e], [0.35, 0x46688a], [0.72, 0xc9854a], [1, 0xee9a5e],
] as const;
const RISK_STOPS = [
  [0, 0x35485c], [0.5, 0xb08a4e], [1, 0xe06a45],
] as const;

const ramp = (out: THREE.Color, stops: readonly (readonly [number, number])[], v: number) => {
  const t = Math.min(1, Math.max(0, v));
  for (let i = 0; i < stops.length - 1; i++) {
    if (t <= stops[i + 1][0]) {
      const f = (t - stops[i][0]) / (stops[i + 1][0] - stops[i][0] || 1);
      out.lerpColors(new THREE.Color(stops[i][1]), new THREE.Color(stops[i + 1][1]), f);
      return out;
    }
  }
  out.set(stops[stops.length - 1][1]);
  return out;
};

function buildTurbineGeometry() {
  const tower = new THREE.CylinderGeometry(2.5, 4.7, 84, 12);
  tower.translate(0, 42, 0);
  const nacelle = new THREE.BoxGeometry(13, 4.8, 5.8);
  nacelle.translate(1.5, HUB_Y, 0);
  const hub = new THREE.CylinderGeometry(3.6, 3.6, 4.6, 14);
  hub.rotateZ(Math.PI / 2);
  hub.translate(9, HUB_Y, 0);
  const merged = mergeGeometries([tower, nacelle, hub]);
  tower.dispose(); nacelle.dispose(); hub.dispose();
  return merged;
}

function buildBladeGeometry() {
  const blade = new THREE.CylinderGeometry(0.38, 2.45, 52, 6);
  blade.scale(1, 1, 0.3);
  blade.rotateY(0.34); // 桨距角
  blade.translate(0, 3.7 + 26, 0);
  return blade;
}

export function Turbines() {
  const mergedRef = useRef<THREE.InstancedMesh>(null);
  const bladesRef = useRef<THREE.InstancedMesh>(null);
  const beaconRef = useRef<THREE.InstancedMesh>(null);
  const discRef = useRef<THREE.InstancedMesh>(null);

  const assets = useMemo(() => ({
    body: buildTurbineGeometry(),
    blade: buildBladeGeometry(),
    beacon: new THREE.SphereGeometry(1.15, 10, 8),
    disc: new THREE.CircleGeometry(26, 30),
    bodyMat: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.18, roughness: 0.62 }),
    bladeMat: new THREE.MeshStandardMaterial({ color: 0xe9edf0, metalness: 0.12, roughness: 0.68 }),
    beaconMat: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    discMat: new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24, depthWrite: false }),
  }), []);

  const hoverId = useStore((s) => s.hoverId);
  const setHover = useStore((s) => s.setHover);
  const select = useStore((s) => s.select);
  useCursor(hoverId !== null);

  const angles = useRef(new Float32Array(24));
  const colorAcc = useRef(0);
  const tmp = useMemo(() => ({
    m: new THREE.Matrix4(),
    mT: new THREE.Matrix4(),
    mR: new THREE.Matrix4(),
    q: new THREE.Quaternion(),
    qI: new THREE.Quaternion(),
    e: new THREE.Euler(),
    one: new THREE.Vector3(1, 1, 1),
    zero: new THREE.Vector3(0, 0, 0),
    pos: new THREE.Vector3(),
    localPos: new THREE.Vector3(),
    c: new THREE.Color(),
    c2: new THREE.Color(),
    cRed: new THREE.Color(1, 0.3, 0.25),
  }), []);

  // 基座阴影盘：静态矩阵一次写入
  useLayoutEffect(() => {
    const disc = discRef.current;
    if (!disc) return;
    const m = new THREE.Matrix4();
    TURBINES.forEach((t, i) => {
      m.makeTranslation(t.x, 0.55, t.z);
      disc.setMatrixAt(i, m);
    });
    disc.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, dt) => {
    const st = useStore.getState();
    const t = st.t;
    const tSec = t / 1000;
    const mode: ViewMode = st.viewMode;
    const { m, mT, mR, q, qI, e, one, zero, pos, localPos, c, c2, cRed } = tmp;
    const body = mergedRef.current;
    const blades = bladesRef.current;
    const beacon = beaconRef.current;
    if (!body || !blades || !beacon) return;

    colorAcc.current += dt;
    const doColors = colorAcc.current > 0.3;
    if (doColors) colorAcc.current = 0;

    for (let i = 0; i < 24; i++) {
      const tdef = TURBINES[i];
      const wind = windAtTurbine(t, i);
      const state = statusOf(i);

      // 叶轮转速（随风速/状态独立变化）
      const omega = rpmOf(wind, state);
      angles.current[i] = (angles.current[i] + omega * dt) % (Math.PI * 2);

      // 偏航：基角 + 慢漂移 + 持续误差
      const yawDeg = tdef.baseYaw + yawErrorAt(t, i) + Math.sin(tSec * 0.05 + i * 1.7) * 1.1;
      e.set(0, yawDeg * D2R, 0);
      q.setFromEuler(e);

      pos.set(tdef.x, 0, tdef.z);
      m.compose(pos, q, one);
      body.setMatrixAt(i, m);

      // 叶轮：绕轮毂中心 (9, HUB_Y, 0) 旋转
      localPos.set(9, HUB_Y, 0);
      qI.identity();
      mR.compose(localPos, qI, one);
      mT.copy(m).multiply(mR);
      const a0 = angles.current[i];
      for (let k = 0; k < 3; k++) {
        e.set(a0 + (k * Math.PI * 2) / 3, 0, 0);
        qI.setFromEuler(e);
        mR.compose(zero, qI, one);
        tmp.m.copy(mT).multiply(mR);
        blades.setMatrixAt(i * 3 + k, tmp.m);
      }

      // 航标灯（机舱顶部，红色慢闪）
      qI.identity();
      localPos.set(1.5, HUB_Y + 4.6, 0);
      mR.compose(localPos, qI, one);
      mT.copy(m).multiply(mR);
      beacon.setMatrixAt(i, mT);
      const flash = 0.18 + 0.82 * Math.pow(Math.max(0, Math.sin(tSec * 1.9 + i * 2.7)), 5);
      beacon.setColorAt(i, c.copy(cRed).multiplyScalar(flash * 1.6));

      // 模式配色（每 0.3s 刷新）
      if (doColors) {
        if (mode === 'live') c.set(STATUS_COLOR[state]);
        else if (mode === 'heat') ramp(c, HEAT_STOPS, powerAt(t, i) / 6.2);
        else ramp(c, RISK_STOPS, riskAt(t, i) / 100);
        body.setColorAt(i, c);
        c2.copy(c).multiplyScalar(0.82);
        for (let k = 0; k < 3; k++) blades.setColorAt(i * 3 + k, c2);
      }
    }

    body.instanceMatrix.needsUpdate = true;
    blades.instanceMatrix.needsUpdate = true;
    beacon.instanceMatrix.needsUpdate = true;
    beacon.instanceColor!.needsUpdate = true;
    if (doColors) {
      body.instanceColor!.needsUpdate = true;
      blades.instanceColor!.needsUpdate = true;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(e.instanceId ?? null);
  };
  const onOut = () => setHover(null);
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.instanceId !== undefined) select(e.instanceId, { focus: true });
  };

  return (
    <group>
      <instancedMesh
        ref={discRef}
        args={[assets.disc, assets.discMat, 24]}
        raycast={() => null}
      />
      <instancedMesh
        ref={mergedRef}
        args={[assets.body, assets.bodyMat, 24]}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onClick={onClick}
      />
      <instancedMesh
        ref={bladesRef}
        args={[assets.blade, assets.bladeMat, 72]}
      />
      <instancedMesh
        ref={beaconRef}
        args={[assets.beacon, assets.beaconMat, 24]}
        raycast={() => null}
      />
    </group>
  );
}

export const ROTOR_TOP = HUB_Y + ROTOR_R;
