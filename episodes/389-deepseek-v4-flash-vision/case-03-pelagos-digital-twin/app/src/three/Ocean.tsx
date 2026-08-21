import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { waveAt } from '../data/weather';
import { MOON_DIR, PAL, SUN_DIR, updatePalette } from './palette';

/* 海面：3 组 Gerstner 波 + 菲涅尔 + 太阳/月亮高光 + 白浪 + 距离雾 */

const VERT = /* glsl */ `
uniform float uTime;
uniform float uAmpMul;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vCrest;

float wnoise(vec2 p) {
  vec2 i = floor(p);
  return fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453123);
}

vec3 gerstner(vec2 p, vec2 dir, float steep, float wavelength, float speed, float t, out vec3 n) {
  vec2 d = normalize(dir);
  float k = 6.2831853 / wavelength;
  float c = sqrt(9.8 / k);
  float f = k * (dot(d, p) - c * t);
  float a = steep / k;
  float WA = steep;
  n += vec3(-d.x * WA * cos(f), -WA * sin(f), -d.y * WA * cos(f));
  return vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
}

void main() {
  vec3 p = position;
  vec3 disp = vec3(0.0);
  vec3 nrm = vec3(0.0, 1.0, 0.0);
  float t = uTime;
  // 空间噪声调制：打破规则的平行条带
  float n1 = wnoise(p.xz * 0.0021);
  float n2 = wnoise(p.xz * 0.0009 + 17.3);
  float ph1 = (n1 - 0.5) * 6.283 * 3.0;
  float ph2 = (n2 - 0.5) * 6.283 * 3.0;
  float am1 = 0.7 + n2 * 0.6;
  float am2 = 0.62 + n1 * 0.7;
  // 三组波：主涌浪 + 次级浪 + 细碎纹（低陡度）
  disp += gerstner(p.xz + vec2(ph1 * 0.35, ph1 * 0.12), vec2(1.0, 0.15), 0.16, 260.0, 1.0, t, nrm) * uAmpMul * am1;
  disp += gerstner(p.xz + vec2(ph2 * 0.2, ph2 * 0.4), vec2(-0.45, 0.9), 0.13, 128.0, 1.0, t, nrm) * uAmpMul * am2;
  disp += gerstner(p.xz + vec2(n2 * 40.0, n1 * 40.0), vec2(0.35, -0.85), 0.1, 64.0, 1.0, t, nrm) * uAmpMul * 0.55;
  vec3 pos = p + disp;
  vWorld = (modelMatrix * vec4(pos, 1.0)).xyz;
  vNormal = normalize((modelMatrix * vec4(normalize(nrm), 0.0)).xyz);
  // 白浪系数：以理论最大波高归一（三组波 a=steep/k 之和）
  vCrest = disp.y / (uAmpMul * 14.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`;

const FRAG = /* glsl */ `
varying vec3 vWorld;
varying vec3 vNormal;
varying float vCrest;
uniform vec3 uWater;
uniform vec3 uWaterDeep;
uniform vec3 uHorizon;
uniform vec3 uSunColor;
uniform vec3 uSunDir;
uniform vec3 uMoonColor;
uniform vec3 uMoonDir;
uniform float uSunInt;
uniform float uMoonInt;
uniform float uGlowStr;
uniform vec3 uFog;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

void main() {
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 N = normalize(vNormal);

  // 微扰法线（细碎闪烁，幅度克制）
  float nz = (hash(floor(vWorld.xz * 3.0) + floor(uTime * 6.0)) - 0.5) * 0.025;
  N = normalize(N + vec3(nz, 0.0, nz * 0.7));

  // 菲涅尔用基准法线（避免波浪条带），镜面高光用波动法线
  float fres = pow(1.0 - max(dot(vec3(0.0, 1.0, 0.0), V), 0.0), 3.0);
  // 深水 → 水面 → 天空反射（掠射角映出余晖，克制）
  vec3 col = mix(uWaterDeep, uWater, 0.2 + 0.34 * fres);
  col = mix(col, uHorizon, fres * 0.16);

  // 太阳 / 月亮镜面反射
  vec3 R = reflect(-V, N);
  float sunSpec = pow(max(dot(R, normalize(uSunDir)), 0.0), 340.0);
  float moonSpec = pow(max(dot(R, normalize(uMoonDir)), 0.0), 420.0);
  col += uSunColor * sunSpec * uSunInt * (0.22 + uGlowStr * 0.6);
  col += uMoonColor * moonSpec * uMoonInt;

  // 波峰白浪（克制）
  float crest = smoothstep(0.82, 0.98, vCrest);
  col = mix(col, vec3(0.78, 0.85, 0.9), crest * 0.12);

  // 距离雾（与场景 FogExp2 一致）
  float dist = length(vWorld - cameraPosition);
  float fogF = 1.0 - exp(-pow(dist * 0.00022, 2.0));
  col = mix(col, uFog, clamp(fogF, 0.0, 1.0));

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function Ocean({ segments = 240 }: { segments?: number }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmpMul: { value: 1 },
      uWater: { value: new THREE.Color() },
      uWaterDeep: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uSunColor: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3() },
      uMoonColor: { value: new THREE.Color(0x9fb6cc) },
      uMoonDir: { value: MOON_DIR.clone() },
      uSunInt: { value: 0.4 },
      uMoonInt: { value: 0 },
      uGlowStr: { value: 0 },
      uFog: { value: new THREE.Color() },
    }),
    [],
  );

  useFrame((_, dt) => {
    const t = useStore.getState().t;
    updatePalette(t);
    const u = uniforms;
    u.uTime.value = t / 1000;
    u.uAmpMul.value = 0.3 + (waveAt(t) / 3.4) * 0.38;
    u.uWater.value.copy(PAL.water);
    u.uWaterDeep.value.copy(PAL.waterDeep);
    u.uHorizon.value.copy(PAL.horizon);
    u.uSunColor.value.copy(PAL.sun);
    u.uSunDir.value.copy(SUN_DIR);
    u.uSunInt.value = PAL.sunInt;
    u.uMoonInt.value = PAL.moon * 0.22;
    u.uGlowStr.value = PAL.glowStr;
    u.uFog.value.copy(PAL.fog);
    void dt;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null} frustumCulled={false}>
      <planeGeometry args={[7000, 7000, segments, segments]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        fog={false}
      />
    </mesh>
  );
}
