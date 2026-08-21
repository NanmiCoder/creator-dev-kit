import * as THREE from 'three';
import { hourOf } from '../lib/util';
import { makePalette, samplePalette, sunDirOf, sunElevDeg, type Palette } from '../data/weather';

/* 每帧复用的天空/海面色板（模块级单例，零分配） */
export const PAL: Palette = makePalette();
export const SUN_DIR = new THREE.Vector3();
export const MOON_DIR = new THREE.Vector3(0.42, 0.72, -0.55).normalize();

export const updatePalette = (t: number) => {
  const e = sunElevDeg(hourOf(t));
  samplePalette(e, PAL);
  SUN_DIR.copy(sunDirOf(e));
};
