import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { PAL, SUN_DIR, updatePalette } from './palette';

/* 天空穹顶：渐变 + 地平线余晖 + 低云 + 星（自定义 shader，无后期堆叠） */

const VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vDir = wp.xyz - cameraPosition;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const FRAG = /* glsl */ `
varying vec3 vDir;
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uGlow;
uniform float uGlowStr;
uniform vec3 uSunDir;
uniform float uStars;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * vnoise(p); p = p * 2.03 + 7.7; a *= 0.5; }
  return v;
}

void main() {
  vec3 dir = normalize(vDir);
  float h = smoothstep(-0.02, 0.2, dir.y);
  vec3 col = mix(uHorizon, uTop, h);

  // 地平线余晖（贴地平线，太阳方位）
  vec3 sunH = normalize(vec3(uSunDir.x, max(uSunDir.y, 0.05), uSunDir.z));
  float d = max(dot(dir, sunH), 0.0);
  float glow = pow(d, 14.0) * 1.05 + pow(d, 3.5) * 0.38;
  col += uGlow * glow * uGlowStr * (1.0 - h * 0.78);

  // 低云带（仅贴近地平线，克制避免白雾感）
  vec2 cuv = dir.xz / (dir.y + 0.16) * 0.9 + vec2(uTime * 0.0035, 0.0);
  float cl = fbm(cuv);
  float cloudMask = smoothstep(0.55, 0.8, cl) * smoothstep(0.42, 0.04, dir.y);
  vec3 cloudCol = mix(uHorizon, vec3(0.26, 0.3, 0.36), 0.62) * (1.0 - uGlowStr * 0.3);
  col = mix(col, cloudCol, cloudMask * 0.4);

  // 星（夜间淡入）
  if (uStars > 0.001) {
    vec3 sp = floor(dir * 240.0);
    float s = hash(sp.xy + sp.z * 17.0);
    float star = step(0.9983, s);
    float tw = 0.6 + 0.4 * sin(uTime * 2.2 + s * 47.0);
    col += vec3(0.82, 0.88, 1.0) * star * tw * uStars * smoothstep(0.03, 0.22, dir.y);
  }

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function Sky() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uGlow: { value: new THREE.Color() },
      uGlowStr: { value: 0 },
      uSunDir: { value: new THREE.Vector3() },
      uStars: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((_, dt) => {
    const t = useStore.getState().t;
    updatePalette(t);
    uniforms.uTop.value.copy(PAL.top);
    uniforms.uHorizon.value.copy(PAL.horizon);
    uniforms.uGlow.value.copy(PAL.glow);
    uniforms.uGlowStr.value = PAL.glowStr;
    uniforms.uSunDir.value.copy(SUN_DIR);
    uniforms.uStars.value = PAL.stars;
    uniforms.uTime.value += dt;
  });

  return (
    <mesh raycast={() => null} frustumCulled={false}>
      <sphereGeometry args={[5600, 40, 24]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
