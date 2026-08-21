import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SILHOUETTES } from '../data/world';

/* 远处风场层次：剪影风机，雾中层次感，不参与交互 */

function buildSilhouetteGeometry() {
  const tower = new THREE.CylinderGeometry(1.7, 3.4, 58, 7);
  tower.translate(0, 29, 0);
  const nacelle = new THREE.BoxGeometry(8, 3.2, 3.8);
  nacelle.translate(1, 60, 0);
  const hub = new THREE.CylinderGeometry(2.2, 2.2, 2.8, 8);
  hub.rotateZ(Math.PI / 2);
  hub.translate(6, 60, 0);
  const parts = [tower, nacelle, hub];
  for (let k = 0; k < 3; k++) {
    const blade = new THREE.BoxGeometry(0.7, 30, 1.6);
    blade.translate(0, 16, 0);
    blade.rotateX((k * Math.PI * 2) / 3);
    blade.translate(6, 60, 0);
    parts.push(blade);
  }
  const merged = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  return merged;
}

export function DistantFarm() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const assets = useMemo(() => ({
    geo: buildSilhouetteGeometry(),
    mat: new THREE.MeshStandardMaterial({ color: 0x2b3541, metalness: 0.2, roughness: 0.9 }),
  }), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const one = new THREE.Vector3(1, 1, 1);
    SILHOUETTES.forEach((s, i) => {
      e.set(0, s.yaw, 0);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(s.x, 0, s.z), q, one.setScalar(s.s));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[assets.geo, assets.mat, SILHOUETTES.length]}
      raycast={() => null}
      frustumCulled={false}
    />
  );
}
