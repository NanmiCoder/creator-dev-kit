import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { useStore } from '../store';
import { HUB_Y, TURBINES, statusOf } from '../data/world';
import { powerAt, rpmOf, tempAt, vibrationAt, windAtTurbine, yawErrorAt } from '../data/weather';
import { STATUS_LABEL } from '../data/ops';
import { useMediaQuery } from '../hooks/useMediaQuery';

/* 3D 场景内交互层：选中/悬停光环 + 玻璃铭牌（Html） */

const fmt = (v: number, d = 1) => v.toFixed(d);

export function Selection3D() {
  const selected = useStore((s) => s.selected);
  const hoverId = useStore((s) => s.hoverId);
  const cinema = useStore((s) => s.cinema);
  const t = useStore((s) => s.t);
  useStore((s) => s.twinVersion);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const ringSel = useRef<THREE.Mesh>(null);
  const ringHov = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    const time = performance.now() / 1000;
    if (ringSel.current) {
      const s = 1 + Math.sin(time * 2.2) * 0.03;
      ringSel.current.scale.setScalar(s);
    }
    void dt;
  });

  const sel = selected !== null ? TURBINES[selected] : null;
  const hov = hoverId !== null ? TURBINES[hoverId] : null;
  const selStatus = sel ? statusOf(sel.id) : null;

  return (
    <group>
      {/* 选中光环 */}
      {sel && (
        <mesh ref={ringSel} position={[sel.x, 1.6, sel.z]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <torusGeometry args={[58, 0.9, 8, 64]} />
          <meshBasicMaterial color="#de804a" transparent opacity={0.85} toneMapped={false} />
        </mesh>
      )}
      {/* 悬停光环（克制） */}
      {hov && hov.id !== selected && (
        <mesh ref={ringHov} position={[hov.x, 1.3, hov.z]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
          <torusGeometry args={[58, 0.5, 8, 64]} />
          <meshBasicMaterial color="#e7edf3" transparent opacity={0.3} toneMapped={false} />
        </mesh>
      )}

      {/* 悬停编号 */}
      {hov && hov.id !== selected && !cinema && !isMobile && (
        <Html position={[hov.x, HUB_Y + 30, hov.z]} center style={{ pointerEvents: 'none' }} zIndexRange={[30, 0]}>
          <div className="hover-tag">
            <span className="dot" style={{ background: '#de804a', boxShadow: '0 0 8px rgba(222,128,74,.8)' }} />
            <span className="mono" style={{ fontWeight: 600, fontSize: 12 }}>{hov.code}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 10.5 }}>{STATUS_LABEL[statusOf(hov.id)]}</span>
          </div>
        </Html>
      )}

      {/* 选中玻璃铭牌 */}
      {sel && !cinema && !isMobile && (
        <Html position={[sel.x, HUB_Y + 26, sel.z]} center style={{ pointerEvents: 'none' }} zIndexRange={[30, 0]}>
          <AnimatePresence>
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="plate glass"
            >
              <div className="plate-head">
                <span className="mono plate-code">{sel.code}</span>
                <span className={`chip st-${selStatus}`}>
                  <span className={`dot dot-st-${selStatus}`} />
                  {STATUS_LABEL[selStatus!]}
                </span>
              </div>
              <div className="plate-grid">
                <PlateRow label="实时功率" value={`${fmt(powerAt(t, sel.id), 2)} MW`} />
                <PlateRow label="叶轮转速" value={`${fmt(rpmOf(windAtTurbine(t, sel.id), selStatus ?? 'normal') * 9.5493, 1)} rpm`} />
                <PlateRow label="机舱温度" value={`${fmt(tempAt(t, sel.id, windAtTurbine(t, sel.id)), 1)} °C`} />
                <PlateRow label="偏航角" value={`${fmt((sel.baseYaw + yawErrorAt(t, sel.id)) % 360, 1)}°`} />
              </div>
            </motion.div>
          </AnimatePresence>
        </Html>
      )}
    </group>
  );
}

function PlateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="plate-row">
      <span className="label">{label}</span>
      <span className="mono plate-val">{value}</span>
    </div>
  );
}
