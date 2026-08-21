import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { TURBINES } from '../data/world';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Sky } from './Sky';
import { Ocean } from './Ocean';
import { Turbines } from './Turbines';
import { DistantFarm } from './DistantFarm';
import { Selection3D } from './Selection3D';
import { CameraRig } from './CameraRig';
import { MOON_DIR, PAL, SUN_DIR, updatePalette } from './palette';

/* 场景组装：光照 / 雾 / 天空 / 海面 / 风场 / 交互层 / 镜头 */

export function Scene() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const fogRef = useRef<THREE.FogExp2>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.DirectionalLight>(null);
  const { scene, camera, gl } = useThree((s) => ({ scene: s.scene, camera: s.camera, gl: s.gl }));

  // 调试钩子（不影响运行时）
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__PELAGOS_DEBUG__ = {
      scene, camera, renderer: gl,
      turbines: TURBINES.map((t) => [t.x, 60, t.z]),
    };
  }, [scene, camera, gl]);

  useFrame(() => {
    const t = useStore.getState().t;
    updatePalette(t);
    if (fogRef.current) {
      fogRef.current.color.copy(PAL.fog);
      fogRef.current.density = 0.00022;
    }
    if (hemiRef.current) {
      hemiRef.current.color.copy(PAL.top).lerp(PAL.horizon, 0.5);
      hemiRef.current.groundColor.set(0x11161d);
      hemiRef.current.intensity = PAL.hemi * 1.25;
    }
    if (sunRef.current) {
      // 主光源：取太阳方位角，但把高度角钳到地平线上（避免余晖时从下往上打光）
      const ly = Math.max(SUN_DIR.y, 0.12);
      const len = Math.hypot(SUN_DIR.x, ly, SUN_DIR.z);
      sunRef.current.position.set((SUN_DIR.x / len) * 1600, (ly / len) * 1600, (SUN_DIR.z / len) * 1600);
      sunRef.current.color.copy(PAL.sun);
      sunRef.current.intensity = PAL.sunInt * 1.7 + 0.15;
    }
    if (moonRef.current) {
      moonRef.current.position.copy(MOON_DIR).multiplyScalar(1600);
      moonRef.current.intensity = PAL.moon * 0.35;
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#7a5c45', 0.00022]} />
      <hemisphereLight ref={hemiRef} args={['#46586c', '#11161d', 0.3]} />
      <directionalLight ref={sunRef} position={[0, 0, 0]} />
      <directionalLight ref={moonRef} position={[0, 0, 0]} color="#9fb6cc" />
      <Sky />
      <Ocean segments={isMobile ? 128 : 236} />
      <DistantFarm />
      <Turbines />
      <Selection3D />
      <CameraRig />
    </>
  );
}
