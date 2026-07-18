import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { AudioEngine } from './audio.js';
import './style.css';

const FIXED_STEP = 1 / 60;
const TAU = Math.PI * 2;
const COURSE = [
  { x: 0, z: -65, halfWidth: 11 },
  { x: 34, z: -136, halfWidth: 11 },
  { x: -7, z: -210, halfWidth: 10 },
  { x: -58, z: -286, halfWidth: 11 },
  { x: -38, z: -366, halfWidth: 12 },
  { x: 37, z: -447, halfWidth: 11 },
  { x: 8, z: -540, halfWidth: 13 },
];

const COLORS = {
  deep: 0x07384b,
  hull: 0x06354a,
  hullLight: 0x0b5870,
  deck: 0xb77943,
  deckLight: 0xd6a364,
  cream: 0xfff2d8,
  sail: 0xdce8d8,
  sailShadow: 0x8fb9af,
  coral: 0xff6348,
  green: 0x45b994,
  aqua: 0x7dedeb,
  yellow: 0xffcc55,
  water: 0x078fb8,
  sand: 0xc9a862,
  grass: 0x657d48,
};

const clamp = THREE.MathUtils.clamp;
const dampFactor = (lambda, delta) => 1 - Math.exp(-lambda * delta);
const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
const formatTime = (seconds) => {
  const safe = Math.max(0, seconds || 0);
  const minutes = Math.floor(safe / 60);
  const remainder = safe - minutes * 60;
  return `${minutes}:${remainder.toFixed(1).padStart(4, '0')}`;
};

function seededRandom(seed = 1) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function interpolateCurve(points, input) {
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    if (input <= x2) return THREE.MathUtils.lerp(y1, y2, (input - x1) / (x2 - x1));
  }
  return points.at(-1)[1];
}

function createTriangleGeometry(points) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

function sampleOceanHeight(x, z, time) {
  return (
    Math.sin(x * 0.055 + time * 0.65) * 0.3 +
    Math.sin(z * 0.085 - time * 0.9 + x * 0.025) * 0.18 +
    Math.sin((x + z) * 0.16 + time * 1.4) * 0.06
  );
}

class WakeSystem {
  constructor(scene, maxParticles = 180) {
    this.maxParticles = maxParticles;
    this.cursor = 0;
    this.spawnAccumulator = 0;
    this.positions = new Float32Array(maxParticles * 3);
    this.sizes = new Float32Array(maxParticles);
    this.opacities = new Float32Array(maxParticles);
    this.particles = Array.from({ length: maxParticles }, () => ({
      life: 0,
      maxLife: 1,
      velocity: new THREE.Vector3(),
    }));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(this.opacities, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: { uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) } },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        uniform float uPixelRatio;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize * uPixelRatio * (120.0 / max(1.0, -mvPosition.z));
          vOpacity = aOpacity;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float edge = smoothstep(0.5, 0.12, distanceToCenter);
          float mottled = 0.82 + 0.18 * sin(gl_PointCoord.x * 17.0 + gl_PointCoord.y * 11.0);
          gl_FragColor = vec4(0.92, 0.98, 0.96, edge * vOpacity * mottled);
        }
      `,
    });
    this.points = new THREE.Points(geometry, material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
    scene.add(this.points);
  }

  reset() {
    this.particles.forEach((particle) => { particle.life = 0; });
    this.opacities.fill(0);
    this.points.geometry.attributes.aOpacity.needsUpdate = true;
  }

  emit(position, forward, speed, boost, delta) {
    if (speed < 1.4) return;
    this.spawnAccumulator += delta * (8 + speed * 2.2 + boost * 22);
    const side = new THREE.Vector3(forward.z, 0, -forward.x);
    while (this.spawnAccumulator >= 1) {
      this.spawnAccumulator -= 1;
      this.#spawnTrail(position, forward, side, -1, speed, boost);
      this.#spawnTrail(position, forward, side, 1, speed, boost);
    }
  }

  #spawnTrail(position, forward, side, sideSign, speed, boost) {
    const index = this.cursor;
    this.cursor = (this.cursor + 1) % this.maxParticles;
    const particle = this.particles[index];
    particle.life = 1.1 + Math.random() * 0.9 + boost * 0.4;
    particle.maxLife = particle.life;
    particle.velocity
      .copy(forward)
      .multiplyScalar(-0.15 - Math.random() * 0.35)
      .addScaledVector(side, sideSign * (0.2 + Math.random() * 0.55));

    const offset = index * 3;
    const stern = position.clone().addScaledVector(forward, -1.35).addScaledVector(side, sideSign * 1.18);
    this.positions[offset] = stern.x + (Math.random() - 0.5) * 0.45;
    this.positions[offset + 1] = stern.y + 0.08;
    this.positions[offset + 2] = stern.z + (Math.random() - 0.5) * 0.45;
    this.sizes[index] = 3.5 + Math.random() * 4.5 + speed * 0.13 + boost * 5;
    this.opacities[index] = 0.65 + Math.random() * 0.28;
  }

  update(delta, time) {
    for (let index = 0; index < this.maxParticles; index += 1) {
      const particle = this.particles[index];
      if (particle.life <= 0) {
        this.opacities[index] = 0;
        continue;
      }
      particle.life -= delta;
      const offset = index * 3;
      this.positions[offset] += particle.velocity.x * delta;
      this.positions[offset + 2] += particle.velocity.z * delta;
      this.positions[offset + 1] = sampleOceanHeight(this.positions[offset], this.positions[offset + 2], time) + 0.09;
      const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
      this.opacities[index] = Math.sin(lifeRatio * Math.PI) * 0.78;
      this.sizes[index] += delta * 2.4;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.aSize.needsUpdate = true;
    this.points.geometry.attributes.aOpacity.needsUpdate = true;
  }
}

class BurstSystem {
  constructor(scene, maxParticles = 160) {
    this.maxParticles = maxParticles;
    this.cursor = 0;
    this.positions = new Float32Array(maxParticles * 3);
    this.colors = new Float32Array(maxParticles * 3);
    this.sizes = new Float32Array(maxParticles);
    this.opacities = new Float32Array(maxParticles);
    this.particles = Array.from({ length: maxParticles }, () => ({
      life: 0,
      maxLife: 1,
      velocity: new THREE.Vector3(),
    }));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(this.colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(this.opacities, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) } },
      vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aOpacity;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float uPixelRatio;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize * uPixelRatio * (110.0 / max(1.0, -mvPosition.z));
          vColor = aColor;
          vOpacity = aOpacity;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    this.points = new THREE.Points(geometry, material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 9;
    scene.add(this.points);
  }

  burst(position, color, count = 22, force = 1) {
    const targetColor = new THREE.Color(color);
    for (let amount = 0; amount < count; amount += 1) {
      const index = this.cursor;
      this.cursor = (this.cursor + 1) % this.maxParticles;
      const particle = this.particles[index];
      particle.life = 0.55 + Math.random() * 0.55;
      particle.maxLife = particle.life;
      const angle = Math.random() * TAU;
      const horizontal = (1.1 + Math.random() * 3.8) * force;
      particle.velocity.set(Math.cos(angle) * horizontal, (1.8 + Math.random() * 4.5) * force, Math.sin(angle) * horizontal);
      const offset = index * 3;
      this.positions[offset] = position.x;
      this.positions[offset + 1] = position.y;
      this.positions[offset + 2] = position.z;
      this.colors[offset] = targetColor.r;
      this.colors[offset + 1] = targetColor.g;
      this.colors[offset + 2] = targetColor.b;
      this.sizes[index] = 3 + Math.random() * 5;
      this.opacities[index] = 1;
    }
  }

  update(delta) {
    for (let index = 0; index < this.maxParticles; index += 1) {
      const particle = this.particles[index];
      if (particle.life <= 0) {
        this.opacities[index] = 0;
        continue;
      }
      particle.life -= delta;
      particle.velocity.y -= 5.5 * delta;
      const offset = index * 3;
      this.positions[offset] += particle.velocity.x * delta;
      this.positions[offset + 1] += particle.velocity.y * delta;
      this.positions[offset + 2] += particle.velocity.z * delta;
      const lifeRatio = clamp(particle.life / particle.maxLife, 0, 1);
      this.opacities[index] = lifeRatio;
      this.sizes[index] *= 1 + delta * 0.8;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.aColor.needsUpdate = true;
    this.points.geometry.attributes.aSize.needsUpdate = true;
    this.points.geometry.attributes.aOpacity.needsUpdate = true;
  }
}

class SaltwindGame {
  constructor(root) {
    this.root = root;
    this.sceneHost = root.querySelector('#scene');
    this.dom = Object.fromEntries([
      'hud', 'loading', 'start-screen', 'countdown-screen', 'countdown-number', 'countdown-kicker',
      'pause-screen', 'finish-screen', 'gate-current', 'gate-pips', 'score', 'race-time',
      'best-time', 'boat-speed', 'speed-fill', 'trim-percent', 'trim-fill', 'trim-handle',
      'trim-optimal', 'trim-hint', 'charge-ring', 'charge-number', 'energy-fill', 'gust-state',
      'gust-hint', 'gate-guide', 'guide-arrow', 'gate-distance', 'race-toast', 'wind-compass',
      'wind-state', 'finish-title', 'finish-time', 'finish-score', 'finish-message', 'speed-lines', 'boost-flash',
      'start-button', 'pause-button', 'sound-button', 'flow-button', 'resume-button',
      'restart-button', 'race-again-button',
    ].map((id) => [id, root.querySelector(`#${id}`)]));

    this.isMobile = matchMedia('(max-width: 820px), (pointer: coarse)').matches;
    this.audio = new AudioEngine();
    this.keys = new Set();
    this.accumulator = 0;
    this.lastTimestamp = performance.now();
    this.countdownTimer = 0;
    this.lastCountdownStep = null;
    this.toastTimer = null;
    this.collisionCooldown = 0;
    this.steerVisual = 0;
    this.flowMode = false;
    this.elapsedVisualTime = 0;
    this.tmp = {
      forward: new THREE.Vector3(),
      side: new THREE.Vector3(),
      desiredCamera: new THREE.Vector3(),
      desiredLook: new THREE.Vector3(),
      lookTarget: new THREE.Vector3(0, 2, -12),
      projected: new THREE.Vector3(),
    };

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isMobile,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.2 : 1.5));
    this.renderer.setSize(root.clientWidth, root.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.shadowMap.enabled = !this.isMobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.sceneHost.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8dc8dd);
    this.scene.fog = new THREE.Fog(0x86bfd1, 105, 620);

    this.camera = new THREE.PerspectiveCamera(48, root.clientWidth / root.clientHeight, 0.1, 1200);
    this.camera.position.set(0, 7.5, 15);

    this.clock = new THREE.Clock();
    this.#buildLightingAndSky();
    this.#buildOcean();
    this.#buildClouds();
    this.#buildBoat();
    this.#buildCourse();
    this.#buildIslandsAndScenery();
    this.wake = new WakeSystem(this.scene, this.isMobile ? 110 : 190);
    this.bursts = new BurstSystem(this.scene, this.isMobile ? 110 : 170);
    this.#bindEvents();
    this.#resetRaceState();
    this.#loadBestTime();
    this.#resize();
  }

  async init() {
    this.renderer.setAnimationLoop((timestamp) => this.#animate(timestamp));
    try {
      if (this.renderer.compileAsync) await this.renderer.compileAsync(this.scene, this.camera);
    } catch (error) {
      console.warn('Shader warmup skipped:', error);
    }
    window.setTimeout(() => this.dom.loading.classList.add('loaded'), 380);
  }

  #buildLightingAndSky() {
    const hemisphere = new THREE.HemisphereLight(0xd8f4ff, 0x1a6472, 2.4);
    this.scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xfff0ce, 3.2);
    sun.position.set(-120, 180, 80);
    sun.castShadow = !this.isMobile;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 30;
    sun.shadow.camera.far = 420;
    sun.shadow.camera.left = -60;
    sun.shadow.camera.right = 60;
    sun.shadow.camera.top = 60;
    sun.shadow.camera.bottom = -60;
    this.scene.add(sun);
    this.sun = sun;

    const sky = new Sky();
    sky.scale.setScalar(450000);
    sky.material.uniforms.turbidity.value = 6.2;
    sky.material.uniforms.rayleigh.value = 2.8;
    sky.material.uniforms.mieCoefficient.value = 0.004;
    sky.material.uniforms.mieDirectionalG.value = 0.78;
    const elevation = THREE.MathUtils.degToRad(24);
    const azimuth = THREE.MathUtils.degToRad(210);
    const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, Math.PI / 2 - elevation, azimuth);
    sky.material.uniforms.sunPosition.value.copy(sunPosition);
    this.scene.add(sky);
    this.sky = sky;
  }

  #buildOcean() {
    const size = this.isMobile ? 900 : 1200;
    const segments = this.isMobile ? 72 : 112;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uSunDirection: { value: new THREE.Vector3(-0.48, 0.84, 0.3).normalize() },
        uDeepColor: { value: new THREE.Color(0x026f99) },
        uShallowColor: { value: new THREE.Color(0x27add0) },
        uHorizonColor: { value: new THREE.Color(0x8fc8d8) },
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vWorldPosition;
        varying float vWave;

        float getWave(vec2 point) {
          return sin(point.x * 0.055 + uTime * 0.65) * 0.30
            + sin(point.y * 0.085 - uTime * 0.90 + point.x * 0.025) * 0.18
            + sin((point.x + point.y) * 0.16 + uTime * 1.40) * 0.06;
        }

        void main() {
          vec4 worldBase = modelMatrix * vec4(position, 1.0);
          float wave = getWave(worldBase.xz);
          vec3 worldPosition = worldBase.xyz;
          worldPosition.y += wave;
          vWorldPosition = worldPosition;
          vWave = wave;
          gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uSunDirection;
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;
        uniform vec3 uHorizonColor;
        varying vec3 vWorldPosition;
        varying float vWave;

        void main() {
          vec3 normal = normalize(cross(dFdx(vWorldPosition), dFdy(vWorldPosition)));
          if (normal.y < 0.0) normal *= -1.0;
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.0);
          float sunSpec = pow(max(dot(reflect(-uSunDirection, normal), viewDirection), 0.0), 72.0);
          float sparkle = pow(max(0.0, sin(vWorldPosition.x * 1.6 + uTime * 1.8) * sin(vWorldPosition.z * 1.15 - uTime * 1.4)), 14.0);
          float distanceFade = smoothstep(90.0, 560.0, distance(cameraPosition.xz, vWorldPosition.xz));
          vec3 base = mix(uDeepColor, uShallowColor, clamp(vWave + 0.52, 0.0, 1.0));
          base += vec3(0.17, 0.36, 0.42) * fresnel;
          base += vec3(1.0, 0.88, 0.62) * sunSpec * 0.85;
          base += vec3(0.88, 0.98, 1.0) * sparkle * (1.0 - distanceFade) * 0.09;
          base = mix(base, uHorizonColor, distanceFade * 0.72);
          gl_FragColor = vec4(base, 1.0);
        }
      `,
    });
    const ocean = new THREE.Mesh(geometry, material);
    ocean.receiveShadow = true;
    ocean.frustumCulled = false;
    this.scene.add(ocean);
    this.ocean = ocean;
    this.oceanMaterial = material;
  }

  #createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const random = seededRandom(731);
    for (let index = 0; index < 16; index += 1) {
      const x = 50 + random() * 410;
      const y = 74 + random() * 55;
      const radiusX = 35 + random() * 65;
      const radiusY = 18 + random() * 32;
      context.save();
      context.translate(x, y);
      context.scale(radiusX / radiusY, 1);
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radiusY);
      gradient.addColorStop(0, 'rgba(255,255,255,.62)');
      gradient.addColorStop(0.55, 'rgba(244,250,249,.36)');
      gradient.addColorStop(1, 'rgba(244,250,249,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radiusY, 0, TAU);
      context.fill();
      context.restore();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  #buildClouds() {
    const texture = this.#createCloudTexture();
    const random = seededRandom(4421);
    this.clouds = [];
    for (let index = 0; index < (this.isMobile ? 12 : 20); index += 1) {
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0.42 + random() * 0.28,
        fog: false,
      });
      const cloud = new THREE.Sprite(material);
      const side = index % 2 ? 1 : -1;
      cloud.position.set(side * (85 + random() * 240), 36 + random() * 34, -50 - random() * 550);
      cloud.scale.set(48 + random() * 82, 13 + random() * 23, 1);
      this.scene.add(cloud);
      this.clouds.push(cloud);
    }
  }

  #buildBoat() {
    const hullMaterial = new THREE.MeshStandardMaterial({ color: COLORS.hull, roughness: 0.36, metalness: 0.12, flatShading: true });
    const hullAccentMaterial = new THREE.MeshStandardMaterial({ color: COLORS.hullLight, roughness: 0.4, flatShading: true });
    const deckMaterial = new THREE.MeshStandardMaterial({ color: COLORS.deck, roughness: 0.68, flatShading: true });
    const deckLightMaterial = new THREE.MeshStandardMaterial({ color: COLORS.deckLight, roughness: 0.7 });
    const creamMaterial = new THREE.MeshStandardMaterial({ color: COLORS.cream, roughness: 0.52, flatShading: true });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x09283a, roughness: 0.38, metalness: 0.2 });
    const mastMaterial = new THREE.MeshStandardMaterial({ color: 0xd9d6c6, roughness: 0.4 });

    const root = new THREE.Group();
    const visualRoot = new THREE.Group();
    root.add(visualRoot);
    this.scene.add(root);

    const vertices = [
      0, 0.2, -4.35,
      -1.72, 0.12, -1.75,
      -1.72, 0.05, 2.65,
      1.72, 0.05, 2.65,
      1.72, 0.12, -1.75,
      0, -1.15, -3.55,
      -1.18, -0.95, 2.36,
      1.18, -0.95, 2.36,
    ];
    const indices = [
      0, 5, 1, 1, 5, 6, 1, 6, 2,
      2, 6, 7, 2, 7, 3,
      0, 4, 5, 4, 7, 5, 4, 3, 7,
      5, 7, 6,
      0, 1, 4, 1, 3, 4, 1, 2, 3,
    ];
    const hullGeometry = new THREE.BufferGeometry();
    hullGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    hullGeometry.setIndex(indices);
    hullGeometry.computeVertexNormals();
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.castShadow = true;
    visualRoot.add(hull);

    const accent = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.2, 2.7), hullAccentMaterial);
    accent.position.set(0, -0.18, 1.05);
    accent.rotation.x = -0.03;
    visualRoot.add(accent);

    const deckShape = new THREE.Shape();
    deckShape.moveTo(0, 3.78);
    deckShape.lineTo(-1.48, 1.65);
    deckShape.lineTo(-1.48, -2.2);
    deckShape.lineTo(1.48, -2.2);
    deckShape.lineTo(1.48, 1.65);
    deckShape.closePath();
    const deck = new THREE.Mesh(new THREE.ShapeGeometry(deckShape), deckMaterial);
    deck.rotation.x = -Math.PI / 2;
    deck.position.y = 0.24;
    deck.receiveShadow = true;
    visualRoot.add(deck);

    for (let index = -3; index <= 3; index += 1) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 3.45), deckLightMaterial);
      plank.position.set(index * 0.38, 0.27, 0.7);
      visualRoot.add(plank);
    }

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.68, 2.05), creamMaterial);
    cabin.position.set(0, 0.68, 1.05);
    cabin.castShadow = true;
    visualRoot.add(cabin);
    const cabinTop = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.12, 1.54), darkMaterial);
    cabinTop.position.set(0, 1.08, 0.98);
    visualRoot.add(cabinTop);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 8.1, 8), mastMaterial);
    mast.position.set(0, 4.15, -0.48);
    mast.castShadow = true;
    visualRoot.add(mast);

    const sailPivot = new THREE.Group();
    sailPivot.position.set(0, 0.55, -0.48);
    visualRoot.add(sailPivot);
    const sailGeometry = createTriangleGeometry([
      [0, 0.36, 0],
      [0, 7.15, 0],
      [-3.55, 0.64, 0],
    ]);
    const sailMaterial = new THREE.MeshPhysicalMaterial({
      color: COLORS.sail,
      roughness: 0.7,
      transmission: 0.06,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    const sail = new THREE.Mesh(sailGeometry, sailMaterial);
    sail.castShadow = true;
    sailPivot.add(sail);

    const sailAccent = new THREE.Mesh(
      createTriangleGeometry([[0, 5.15, 0.015], [0, 6.15, 0.015], [-0.92, 5.3, 0.015]]),
      new THREE.MeshBasicMaterial({ color: COLORS.coral, side: THREE.DoubleSide }),
    );
    sailPivot.add(sailAccent);

    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.65, 7), mastMaterial);
    boom.rotation.z = Math.PI / 2;
    boom.position.set(-1.75, 0.95, 0.05);
    sailPivot.add(boom);

    const jibPivot = new THREE.Group();
    jibPivot.position.set(0, 0.8, -0.5);
    visualRoot.add(jibPivot);
    const jib = new THREE.Mesh(
      createTriangleGeometry([[0.02, 0.35, 0], [0.02, 4.8, 0], [2.2, 0.35, -0.55]]),
      new THREE.MeshPhysicalMaterial({ color: 0xcbded3, roughness: 0.72, transparent: true, opacity: 0.82, side: THREE.DoubleSide }),
    );
    jibPivot.add(jib);

    const ropeMaterial = new THREE.LineBasicMaterial({ color: 0xf1ead9, transparent: true, opacity: 0.7 });
    const ropes = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 8.14, -0.48), new THREE.Vector3(0, 0.4, -4.1),
        new THREE.Vector3(0, 8.14, -0.48), new THREE.Vector3(0, 0.4, 2.4),
        new THREE.Vector3(-3.5, 1.18, -0.48), new THREE.Vector3(-1.4, 0.32, 1.7),
      ]),
      ropeMaterial,
    );
    visualRoot.add(ropes);

    const wheel = new THREE.Group();
    wheel.position.set(0, 1.38, 1.55);
    wheel.rotation.x = Math.PI / 2;
    const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.055, 6, 22), mastMaterial);
    wheel.add(wheelRing);
    for (let index = 0; index < 6; index += 1) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 5), mastMaterial);
      spoke.rotation.z = index * Math.PI / 3;
      wheel.add(spoke);
    }
    visualRoot.add(wheel);

    const flagGeometry = createTriangleGeometry([[0, 0, 0], [0, 0.52, 0], [-1.18, 0.34, 0]]);
    const flag = new THREE.Mesh(flagGeometry, new THREE.MeshBasicMaterial({ color: COLORS.coral, side: THREE.DoubleSide }));
    flag.position.set(0, 8.03, -0.48);
    visualRoot.add(flag);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(2.7, 24),
      new THREE.MeshBasicMaterial({ color: 0x023249, transparent: true, opacity: 0.22, depthWrite: false }),
    );
    shadow.scale.set(0.7, 1.45, 1);
    shadow.rotation.x = -Math.PI / 2;
    shadow.renderOrder = 2;
    this.scene.add(shadow);

    this.boat = { root, visualRoot, sailPivot, jibPivot, sail, flag, wheel, shadow };
  }

  #createBuoy(color, phase) {
    const group = new THREE.Group();
    const colorMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.42, flatShading: true, emissive: color, emissiveIntensity: 0.05 });
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: COLORS.cream, roughness: 0.56 });
    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x163e4d, roughness: 0.45 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.28, 1.5, 10), colorMaterial);
    base.position.y = 0.78;
    base.castShadow = true;
    group.add(base);
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(1.09, 1.17, 0.43, 10), whiteMaterial);
    stripe.position.y = 0.86;
    group.add(stripe);
    const top = new THREE.Mesh(new THREE.ConeGeometry(0.78, 0.65, 10), colorMaterial);
    top.position.y = 1.83;
    group.add(top);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.75, 6), darkMaterial);
    pole.position.y = 2.84;
    group.add(pole);
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xd8ffff }),
    );
    lamp.position.y = 3.73;
    group.add(lamp);
    const ripple = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.045, 6, 30),
      new THREE.MeshBasicMaterial({ color: 0xd8ffff, transparent: true, opacity: 0.34, depthWrite: false }),
    );
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.y = 0.05;
    group.add(ripple);
    group.userData = { phase, colorMaterial, ripple, baseScale: 1 };
    this.scene.add(group);
    return group;
  }

  #createCollectible(position, index) {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.82, 0),
      new THREE.MeshStandardMaterial({
        color: COLORS.yellow,
        emissive: COLORS.coral,
        emissiveIntensity: 0.75,
        roughness: 0.22,
        metalness: 0.28,
        flatShading: true,
      }),
    );
    group.add(core);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: COLORS.aqua, transparent: true, opacity: 0.72, depthWrite: false });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.055, 6, 28), ringMaterial);
    const ringB = ringA.clone();
    ringA.rotation.x = Math.PI / 2;
    ringB.rotation.y = Math.PI / 2;
    group.add(ringA, ringB);
    group.position.copy(position);
    group.userData = { index, phase: index * 0.83, collected: false, ringA, ringB };
    this.scene.add(group);
    return group;
  }

  #buildCourse() {
    this.gates = [];
    this.allBuoys = [];
    let previous = new THREE.Vector3(0, 0, 3);
    COURSE.forEach((config, index) => {
      const center = new THREE.Vector3(config.x, 0, config.z);
      const approach = center.clone().sub(previous).setY(0).normalize();
      const left = new THREE.Vector3(approach.z, 0, -approach.x);
      const leftPosition = center.clone().addScaledVector(left, config.halfWidth);
      const rightPosition = center.clone().addScaledVector(left, -config.halfWidth);
      const leftBuoy = this.#createBuoy(COLORS.green, index * 1.7);
      const rightBuoy = this.#createBuoy(COLORS.coral, index * 1.7 + 0.9);
      leftBuoy.position.set(leftPosition.x, 0, leftPosition.z);
      rightBuoy.position.set(rightPosition.x, 0, rightPosition.z);
      this.allBuoys.push(leftBuoy, rightBuoy);

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 1.6, 18, 12, 1, true),
        new THREE.MeshBasicMaterial({
          color: COLORS.aqua,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        }),
      );
      beam.position.set(center.x, 9, center.z);
      beam.visible = index === 0;
      this.scene.add(beam);

      const gate = {
        index,
        center,
        approach,
        left,
        halfWidth: config.halfWidth,
        leftPosition,
        rightPosition,
        leftBuoy,
        rightBuoy,
        beam,
      };
      this.gates.push(gate);
      previous = center;
    });

    this.collectibles = [];
    previous = new THREE.Vector3(0, 0, 3);
    let collectibleIndex = 0;
    this.gates.forEach((gate, gateIndex) => {
      [0.38, 0.72].forEach((progress, offsetIndex) => {
        const position = previous.clone().lerp(gate.center, progress);
        const lateralPattern = [-4.2, 3.5, -2.2, 5.2, -4.5, 2.8, -3.4];
        const sideSign = offsetIndex === 0 ? 1 : -0.55;
        position.addScaledVector(gate.left, lateralPattern[gateIndex] * sideSign);
        position.y = 2.2;
        this.collectibles.push(this.#createCollectible(position, collectibleIndex));
        collectibleIndex += 1;
      });
      previous = gate.center;
    });
    this.#setActiveGate(0);
  }

  #createPalm(position, scale = 1) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1 * scale, 0.18 * scale, 2.7 * scale, 6),
      new THREE.MeshStandardMaterial({ color: 0x705136, roughness: 0.86, flatShading: true }),
    );
    trunk.position.y = 1.25 * scale;
    trunk.rotation.z = -0.08;
    group.add(trunk);
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x3f754d, roughness: 0.82, flatShading: true });
    for (let index = 0; index < 5; index += 1) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.42 * scale, 1.65 * scale, 4), leafMaterial);
      leaf.position.y = 2.75 * scale;
      leaf.rotation.z = Math.PI / 2.35;
      leaf.rotation.y = index * TAU / 5;
      group.add(leaf);
    }
    group.position.copy(position);
    return group;
  }

  #buildIslandsAndScenery() {
    const random = seededRandom(91824);
    const islandConfigs = [
      { x: -145, z: -100, sx: 42, sz: 15 },
      { x: 142, z: -214, sx: 50, sz: 18 },
      { x: -156, z: -356, sx: 55, sz: 21 },
      { x: 151, z: -505, sx: 47, sz: 17 },
      { x: -110, z: -586, sx: 35, sz: 14 },
    ];
    const sandMaterial = new THREE.MeshStandardMaterial({ color: COLORS.sand, roughness: 0.92, flatShading: true });
    const grassMaterial = new THREE.MeshStandardMaterial({ color: COLORS.grass, roughness: 0.92, flatShading: true });
    islandConfigs.forEach((config, islandIndex) => {
      const island = new THREE.Group();
      const sand = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 1), sandMaterial);
      sand.scale.set(config.sx, 4.2 + random() * 2, config.sz);
      sand.position.y = -2;
      island.add(sand);
      const grass = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 1), grassMaterial);
      grass.scale.set(config.sx * 0.74, 3.1 + random() * 1.4, config.sz * 0.72);
      grass.position.y = 0.25;
      island.add(grass);
      island.position.set(config.x, 0, config.z);
      for (let treeIndex = 0; treeIndex < 3; treeIndex += 1) {
        const palm = this.#createPalm(
          new THREE.Vector3((random() - 0.5) * config.sx * 0.9, 2.6, (random() - 0.5) * config.sz * 0.7),
          0.9 + random() * 0.8,
        );
        island.add(palm);
      }
      this.scene.add(island);
      island.userData.phase = islandIndex;
    });

    this.decorativeBuoys = [];
    for (let index = 0; index < 11; index += 1) {
      const color = index % 2 ? COLORS.coral : COLORS.green;
      const buoy = this.#createBuoy(color, index * 0.93 + 4);
      const side = index % 2 ? 1 : -1;
      buoy.scale.setScalar(0.48 + random() * 0.22);
      buoy.position.set(side * (28 + random() * 105), 0, -45 - random() * 520);
      this.decorativeBuoys.push(buoy);
    }
  }

  #bindEvents() {
    const startRace = async () => {
      await this.audio.init();
      this.audio.click();
      this.beginCountdown();
    };
    this.dom['start-button'].addEventListener('click', startRace);
    this.dom['pause-button'].addEventListener('click', () => this.togglePause());
    this.dom['resume-button'].addEventListener('click', () => this.resume());
    this.dom['restart-button'].addEventListener('click', () => this.beginCountdown());
    this.dom['race-again-button'].addEventListener('click', () => this.beginCountdown());
    this.dom['sound-button'].addEventListener('click', () => this.toggleSound());
    this.dom['flow-button'].addEventListener('click', () => {
      this.flowMode = !this.flowMode;
      this.dom.hud.classList.toggle('flow-mode', this.flowMode);
      this.dom['flow-button'].classList.toggle('active', this.flowMode);
      this.showToast(this.flowMode ? 'FLOW MODE · 纯净航行视野' : 'FULL HUD · 完整仪表', false, 1300);
      this.audio.click();
    });

    window.addEventListener('keydown', (event) => {
      if (['KeyA', 'KeyD', 'KeyW', 'KeyS', 'Space', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault();
      }
      if ((event.code === 'Escape' || event.code === 'KeyP') && !event.repeat) {
        this.togglePause();
        return;
      }
      if (event.code === 'KeyR' && !event.repeat && this.state !== 'menu') {
        this.beginCountdown();
        return;
      }
      if (event.code === 'KeyM' && !event.repeat) {
        this.toggleSound();
        return;
      }
      this.keys.add(event.code);
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
      if (event.code === 'Space' && this.charging) this.#releaseBoost();
    });

    this.root.querySelectorAll('[data-hold-key]').forEach((button) => {
      const code = button.dataset.holdKey;
      const release = () => {
        this.keys.delete(code);
        button.classList.remove('pressed');
        if (code === 'Space' && this.charging) this.#releaseBoost();
      };
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        this.keys.add(code);
        button.classList.add('pressed');
      });
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
    });

    const pauseOnBackground = () => {
      this.keys.clear();
      if (this.charging) this.#cancelCharge();
      if (this.state === 'racing') this.pause();
    };
    window.addEventListener('blur', pauseOnBackground);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseOnBackground();
    });
    window.addEventListener('resize', () => this.#resize());
  }

  #resetRaceState() {
    this.state = 'menu';
    this.position = new THREE.Vector3(0, 0, 5);
    this.previousPosition = this.position.clone();
    this.heading = 0;
    this.speed = 0;
    this.trim = 0.68;
    this.idealTrim = 0.34;
    this.trimQuality = 1;
    this.windAngle = 90;
    this.windState = 'Beam reach';
    this.windDirection = new THREE.Vector3(0.975, 0, -0.22).normalize();
    this.raceTime = 0;
    this.gateIndex = 0;
    this.score = 0;
    this.energy = 1;
    this.charge = 0;
    this.charging = false;
    this.boostTime = 0;
    this.boostStrength = 0;
    this.boostCooldown = 0;
    this.collectibleCount = 0;
    this.perfectGates = 0;
    this.collisionCooldown = 0;
    this.accumulator = 0;
    this.steerVisual = 0;
    this.keys.clear();
    window.clearTimeout(this.toastTimer);
    this.dom?.['race-toast']?.classList.remove('show', 'accent-toast');
    this.wake?.reset();
    this.collectibles?.forEach((collectible) => {
      collectible.userData.collected = false;
      collectible.visible = true;
      collectible.scale.setScalar(1);
    });
    this.#setActiveGate(0);
    this.#updateHUD();
  }

  #loadBestTime() {
    try {
      const saved = Number(localStorage.getItem('saltwind-best-time'));
      this.bestTime = Number.isFinite(saved) && saved > 0 ? saved : null;
    } catch {
      this.bestTime = null;
    }
    this.dom['best-time'].textContent = this.bestTime ? formatTime(this.bestTime) : '—:—.—';
  }

  beginCountdown() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    this.root.scrollTop = 0;
    this.root.scrollLeft = 0;
    requestAnimationFrame(() => {
      this.root.scrollTop = 0;
      this.root.scrollLeft = 0;
    });
    const wasMuted = this.audio.muted;
    this.#resetRaceState();
    this.audio.setMuted(wasMuted);
    this.audio.setPaused(false);
    this.state = 'countdown';
    this.countdownTimer = 3;
    this.lastCountdownStep = null;
    this.dom['start-screen'].classList.add('is-hidden');
    this.dom['pause-screen'].classList.add('is-hidden');
    this.dom['finish-screen'].classList.add('is-hidden');
    this.dom.hud.classList.remove('is-hidden');
    this.dom['countdown-screen'].classList.remove('is-hidden');
    this.dom['gate-guide'].classList.remove('is-hidden');
    this.#updateCountdown(0);
  }

  #startRacing() {
    if (this.state !== 'countdown') return;
    this.state = 'racing';
    this.raceTime = 0;
    this.dom['countdown-number'].textContent = 'GO';
    this.dom['countdown-kicker'].textContent = 'RIDE THE WIND · 乘风而行';
    this.#restartCountdownAnimation();
    this.audio.countdown(0);
    window.setTimeout(() => {
      if (this.state === 'racing') this.dom['countdown-screen'].classList.add('is-hidden');
    }, 720);
    this.showToast('FIND THE FIRST GATE · 找到第一道门', false, 1700);
  }

  #updateCountdown(delta) {
    if (this.state !== 'countdown') return;
    this.countdownTimer -= delta;
    const step = clamp(Math.ceil(this.countdownTimer), 1, 3);
    if (step !== this.lastCountdownStep) {
      this.lastCountdownStep = step;
      this.dom['countdown-number'].textContent = String(step);
      this.dom['countdown-kicker'].textContent = step === 1 ? 'TRIM SET · 帆位就绪' : 'READY ON THE HELM · 准备掌舵';
      this.#restartCountdownAnimation();
      this.audio.countdown(step);
    }
    if (this.countdownTimer <= 0) this.#startRacing();
  }

  #restartCountdownAnimation() {
    const element = this.dom['countdown-number'];
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = '';
  }

  togglePause() {
    if (this.state === 'racing') this.pause();
    else if (this.state === 'paused') this.resume();
  }

  pause() {
    if (this.state !== 'racing') return;
    this.state = 'paused';
    this.keys.clear();
    if (this.charging) this.#cancelCharge();
    this.audio.setPaused(true);
    this.dom['pause-screen'].classList.remove('is-hidden');
    this.dom['pause-button'].setAttribute('aria-label', '继续比赛');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'racing';
    this.lastTimestamp = performance.now();
    this.audio.resume();
    this.audio.setPaused(false);
    this.dom['pause-screen'].classList.add('is-hidden');
    this.dom['pause-button'].setAttribute('aria-label', '暂停比赛');
  }

  toggleSound() {
    this.audio.setMuted(!this.audio.muted);
    this.dom['sound-button'].setAttribute('aria-pressed', String(this.audio.muted));
    this.dom['sound-button'].title = this.audio.muted ? '打开声音' : '关闭声音';
  }

  #cancelCharge() {
    this.audio.endCharge(this.charge, false);
    this.charging = false;
    this.charge = 0;
  }

  #releaseBoost() {
    if (!this.charging) return;
    const amount = this.charge;
    const boosted = amount >= 0.18 && this.state === 'racing';
    this.audio.endCharge(amount, boosted);
    this.charging = false;
    this.charge = 0;
    if (!boosted) return;
    this.boostStrength = amount;
    this.boostTime = 0.48 + amount * 1.05;
    this.boostCooldown = 2.5;
    this.energy = Math.max(0, this.energy - amount * 0.5);
    this.speed += 1.2 + amount * 2.2;
    this.dom['boost-flash'].classList.remove('is-active');
    void this.dom['boost-flash'].offsetHeight;
    this.dom['boost-flash'].classList.add('is-active');
    this.showToast(amount > 0.86 ? 'FULL GUST! · 完美阵风' : 'GUST RELEASED · 阵风释放', true, 950);
  }

  #updatePhysics(delta) {
    this.previousPosition.copy(this.position);
    const turnInput = (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0)
      - (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0);
    const trimInput = (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0);
    this.trim = clamp(this.trim + trimInput * delta * 0.62, 0.04, 1);
    this.steerVisual = THREE.MathUtils.damp(this.steerVisual, turnInput, 7, delta);

    const speedRatio = clamp(this.speed / 10.5, 0, 1);
    const turnRate = THREE.MathUtils.lerp(0.42, 0.82, 0.28 + speedRatio * 0.72);
    this.heading = normalizeAngle(this.heading + turnInput * turnRate * delta);

    const forward = this.tmp.forward.set(Math.sin(this.heading), 0, -Math.cos(this.heading));
    const windDot = clamp(forward.dot(this.windDirection), -1, 1);
    const relativeWind = THREE.MathUtils.radToDeg(Math.acos(windDot));
    this.windAngle = relativeWind;
    this.idealTrim = clamp((relativeWind - 30) / 150, 0.08, 1);
    const trimError = Math.abs(this.trim - this.idealTrim);
    this.trimQuality = 1 - THREE.MathUtils.smoothstep(trimError, 0.08, 0.55);
    const windEfficiency = interpolateCurve([
      [0, 0.05], [30, 0.15], [45, 0.62], [70, 0.88], [90, 1],
      [120, 0.92], [150, 0.8], [180, 0.68],
    ], relativeWind);
    this.windState = relativeWind < 34 ? 'In irons'
      : relativeWind < 67 ? 'Close hauled'
        : relativeWind < 112 ? 'Beam reach'
          : relativeWind < 154 ? 'Broad reach' : 'Running';

    if (this.keys.has('Space') && !this.charging && this.boostCooldown <= 0 && this.energy > 0.16) {
      this.charging = true;
      this.charge = 0;
      this.audio.startCharge();
    }
    if (this.charging) {
      this.charge = Math.min(1, this.charge + delta / 1.05);
      this.energy = Math.max(0, this.energy - delta * 0.075);
      this.audio.updateCharge(this.charge);
      if (this.energy <= 0.02) this.#releaseBoost();
    }

    this.boostCooldown = Math.max(0, this.boostCooldown - delta);
    if (!this.charging && this.boostTime <= 0) this.energy = Math.min(1, this.energy + delta * 0.035);
    let targetSpeed = 0.85 + 9.8 * windEfficiency * (0.27 + this.trimQuality * 0.73);
    targetSpeed *= 1 - Math.abs(turnInput) * 0.11;
    if (this.charging) targetSpeed *= 0.9;
    if (this.boostTime > 0) {
      this.boostTime = Math.max(0, this.boostTime - delta);
      targetSpeed = 11.8 + this.boostStrength * 4.7;
      this.speed += (4.5 + this.boostStrength * 5.8) * delta;
    } else {
      this.boostStrength = THREE.MathUtils.damp(this.boostStrength, 0, 4, delta);
    }
    this.speed += (targetSpeed - this.speed) * dampFactor(targetSpeed > this.speed ? 2.1 : 1.55, delta);
    this.speed = clamp(this.speed, 0, 16.5);

    this.position.addScaledVector(forward, this.speed * delta);
    this.raceTime += delta;
    this.collisionCooldown = Math.max(0, this.collisionCooldown - delta);
    this.#checkGateCrossing();
    this.#checkCollectibles();
    this.#checkBuoyCollisions();
    this.audio.setSpeed(this.speed * 1.94384, this.trimQuality);
  }

  #checkGateCrossing() {
    const gate = this.gates[this.gateIndex];
    if (!gate) return;
    const previousDistance = this.previousPosition.clone().sub(gate.center).dot(gate.approach);
    const currentDistance = this.position.clone().sub(gate.center).dot(gate.approach);
    if (previousDistance > 0 || currentDistance <= 0) return;

    const denominator = currentDistance - previousDistance;
    const amount = denominator === 0 ? 0 : -previousDistance / denominator;
    const intersection = this.previousPosition.clone().lerp(this.position, clamp(amount, 0, 1));
    const lateral = Math.abs(intersection.clone().sub(gate.center).dot(gate.left));
    if (lateral > gate.halfWidth - 1.3) {
      this.showToast('MISSED THE GATE · 从浮标之间穿过', true, 1250);
      return;
    }

    const perfect = lateral <= gate.halfWidth * 0.34;
    this.score += perfect ? 1300 : 1000;
    if (perfect) this.perfectGates += 1;
    this.audio.gate(perfect);
    const burstPosition = gate.center.clone();
    burstPosition.y = sampleOceanHeight(burstPosition.x, burstPosition.z, this.elapsedVisualTime) + 3;
    this.bursts.burst(burstPosition, perfect ? COLORS.aqua : COLORS.yellow, perfect ? 42 : 30, perfect ? 1.4 : 1);
    this.showToast(
      perfect ? `PERFECT GATE · +1300 · 完美穿门` : `GATE ${this.gateIndex + 1} CLEARED · +1000`,
      false,
      1200,
    );
    this.gateIndex += 1;
    if (this.gateIndex >= this.gates.length) {
      this.#finishRace();
    } else {
      this.#setActiveGate(this.gateIndex);
    }
  }

  #checkCollectibles() {
    this.collectibles.forEach((collectible) => {
      if (collectible.userData.collected) return;
      const dx = collectible.position.x - this.position.x;
      const dz = collectible.position.z - this.position.z;
      if (dx * dx + dz * dz > 6.2) return;
      collectible.userData.collected = true;
      collectible.visible = false;
      this.collectibleCount += 1;
      this.score += 200;
      this.energy = Math.min(1, this.energy + 0.23);
      this.boostCooldown = Math.max(0, this.boostCooldown - 0.35);
      const effectPosition = collectible.position.clone();
      this.bursts.burst(effectPosition, COLORS.yellow, 26, 0.9);
      this.audio.collect();
      this.showToast(`WIND SHARD · +200 · ${this.collectibleCount}/14`, false, 900);
    });
  }

  #checkBuoyCollisions() {
    if (this.collisionCooldown > 0) return;
    for (const buoy of this.allBuoys) {
      const dx = buoy.position.x - this.position.x;
      const dz = buoy.position.z - this.position.z;
      if (dx * dx + dz * dz > 5.4) continue;
      this.collisionCooldown = 1.2;
      this.speed *= 0.54;
      this.score = Math.max(0, this.score - 100);
      this.audio.collision();
      const impact = this.position.clone();
      impact.y = sampleOceanHeight(impact.x, impact.z, this.elapsedVisualTime) + 0.7;
      this.bursts.burst(impact, 0xffffff, 34, 1.1);
      this.showToast('BUOY HIT · −100 · 碰撞减速', true, 1100);
      break;
    }
  }

  #setActiveGate(index) {
    this.gates?.forEach((gate, gateIndex) => {
      const isActive = gateIndex === index;
      const isComplete = gateIndex < index;
      gate.beam.visible = isActive;
      [gate.leftBuoy, gate.rightBuoy].forEach((buoy) => {
        buoy.userData.colorMaterial.emissiveIntensity = isActive ? 0.58 : isComplete ? 0.18 : 0.04;
        buoy.userData.baseScale = isActive ? 1.05 : 1;
      });
    });
  }

  #finishRace() {
    if (this.state !== 'racing') return;
    const timeBonus = Math.max(0, Math.round((120 - this.raceTime) * 50));
    this.score += timeBonus;
    this.state = 'finished';
    this.keys.clear();
    if (this.charging) this.#cancelCharge();
    this.audio.finish();
    this.dom['gate-guide'].classList.add('is-hidden');
    this.dom['finish-time'].textContent = formatTime(this.raceTime);
    this.dom['finish-score'].textContent = String(Math.round(this.score)).padStart(4, '0');
    this.dom['finish-message'].textContent = `7 道航门 · ${this.collectibleCount}/14 风之碎片 · ${this.perfectGates} 次完美穿门`;
    this.dom['finish-screen'].classList.remove('is-hidden');

    if (!this.bestTime || this.raceTime < this.bestTime) {
      this.bestTime = this.raceTime;
      try {
        localStorage.setItem('saltwind-best-time', String(this.bestTime));
      } catch {
        // Local storage is optional for private or locked-down browser contexts.
      }
      this.dom['best-time'].textContent = formatTime(this.bestTime);
      this.dom['finish-title'].textContent = 'A new best wind.';
    } else {
      this.dom['finish-title'].textContent = 'Wind mastered.';
    }
  }

  showToast(message, accent = false, duration = 1100) {
    window.clearTimeout(this.toastTimer);
    const toast = this.dom['race-toast'];
    toast.textContent = message;
    toast.classList.toggle('accent-toast', accent);
    toast.classList.add('show');
    this.toastTimer = window.setTimeout(() => toast.classList.remove('show'), duration);
  }

  #updatePrestartControls(delta) {
    const turnInput = (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0)
      - (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0);
    const trimInput = (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0);
    this.trim = clamp(this.trim + trimInput * delta * 0.62, 0.04, 1);
    this.heading = normalizeAngle(this.heading + turnInput * delta * 0.35);
    this.steerVisual = THREE.MathUtils.damp(this.steerVisual, turnInput, 7, delta);
  }

  #updateVisuals(delta) {
    const time = this.elapsedVisualTime;
    const forward = this.tmp.forward.set(Math.sin(this.heading), 0, -Math.cos(this.heading));
    const side = this.tmp.side.set(forward.z, 0, -forward.x);
    const oceanHeight = sampleOceanHeight(this.position.x, this.position.z, time);
    const frontHeight = sampleOceanHeight(this.position.x + forward.x * 3.2, this.position.z + forward.z * 3.2, time);
    const backHeight = sampleOceanHeight(this.position.x - forward.x * 3.2, this.position.z - forward.z * 3.2, time);
    const leftHeight = sampleOceanHeight(this.position.x + side.x * 2, this.position.z + side.z * 2, time);
    const rightHeight = sampleOceanHeight(this.position.x - side.x * 2, this.position.z - side.z * 2, time);
    const pitch = Math.atan2(frontHeight - backHeight, 6.4);
    const waveRoll = Math.atan2(rightHeight - leftHeight, 4.2) * 0.55;
    const speedRatio = clamp(this.speed / 11, 0, 1);
    const heel = -this.steerVisual * THREE.MathUtils.degToRad(7.5) * (0.25 + speedRatio * 0.75);

    this.boat.root.position.set(this.position.x, 0, this.position.z);
    this.boat.root.rotation.y = this.heading;
    this.boat.visualRoot.position.y = oceanHeight + 0.62 + Math.sin(time * 1.5) * 0.025;
    this.boat.visualRoot.rotation.x = THREE.MathUtils.damp(this.boat.visualRoot.rotation.x, pitch, 4.5, delta);
    this.boat.visualRoot.rotation.z = THREE.MathUtils.damp(this.boat.visualRoot.rotation.z, waveRoll + heel, 5.4, delta);
    const windCross = forward.x * this.windDirection.z - forward.z * this.windDirection.x;
    const sailSide = windCross >= 0 ? 1 : -1;
    const sailAngle = sailSide * THREE.MathUtils.lerp(0.12, 1.03, this.trim);
    this.boat.sailPivot.rotation.y = THREE.MathUtils.damp(this.boat.sailPivot.rotation.y, sailAngle, 5.8, delta);
    this.boat.jibPivot.rotation.y = THREE.MathUtils.damp(this.boat.jibPivot.rotation.y, sailAngle * 0.68, 6.2, delta);
    const flap = (1 - this.trimQuality) * Math.sin(time * 15) * 0.035;
    this.boat.sail.scale.x = 1 + flap;
    this.boat.flag.scale.x = 0.92 + Math.sin(time * 7.5) * 0.12;
    this.boat.flag.rotation.y = Math.sin(time * 5.2) * 0.12;
    this.boat.wheel.rotation.z = -this.steerVisual * 0.65;

    this.boat.shadow.position.set(this.position.x, oceanHeight + 0.035, this.position.z);
    this.boat.shadow.rotation.z = -this.heading;
    this.boat.shadow.material.opacity = 0.13 + speedRatio * 0.08;

    this.oceanMaterial.uniforms.uTime.value = time;
    this.ocean.position.x = Math.round(this.position.x / 50) * 50;
    this.ocean.position.z = Math.round(this.position.z / 50) * 50;

    const boostAmount = this.boostTime > 0 ? this.boostStrength : 0;
    const wakePosition = new THREE.Vector3(this.position.x, oceanHeight, this.position.z);
    if (this.state === 'racing') this.wake.emit(wakePosition, forward, this.speed, boostAmount, delta);
    this.wake.update(delta, time);
    this.bursts.update(delta);

    this.allBuoys.concat(this.decorativeBuoys).forEach((buoy) => {
      const phase = buoy.userData.phase;
      const height = sampleOceanHeight(buoy.position.x, buoy.position.z, time) + Math.sin(time * 1.35 + phase) * 0.1;
      buoy.position.y = height;
      buoy.rotation.z = Math.sin(time * 0.9 + phase) * 0.025;
      const activePulse = buoy.userData.baseScale * (1 + Math.sin(time * 3 + phase) * 0.018);
      const existingScale = buoy.scale.x < 0.8 ? buoy.scale.x : activePulse;
      if (buoy.scale.x >= 0.8) buoy.scale.setScalar(activePulse);
      buoy.userData.ripple.scale.setScalar(1 + ((time * 0.34 + phase) % 0.65));
      buoy.userData.ripple.material.opacity = 0.28 * (1 - ((time * 0.34 + phase) % 0.65));
      void existingScale;
    });

    this.collectibles.forEach((collectible) => {
      if (collectible.userData.collected) return;
      const phase = collectible.userData.phase;
      collectible.position.y = sampleOceanHeight(collectible.position.x, collectible.position.z, time) + 2.35 + Math.sin(time * 2.4 + phase) * 0.34;
      collectible.rotation.y += delta * 1.55;
      collectible.userData.ringA.rotation.z += delta * 1.7;
      collectible.userData.ringB.rotation.x -= delta * 1.2;
      const pulse = 0.95 + Math.sin(time * 3.1 + phase) * 0.08;
      collectible.scale.setScalar(pulse);
    });

    this.gates.forEach((gate, index) => {
      gate.beam.position.y = sampleOceanHeight(gate.center.x, gate.center.z, time) + 9;
      if (gate.beam.visible) {
        gate.beam.material.opacity = 0.13 + Math.sin(time * 2.7) * 0.045;
        gate.beam.scale.x = gate.beam.scale.z = 1 + Math.sin(time * 2.1) * 0.12;
      }
      if (index < this.gateIndex) gate.beam.visible = false;
    });

    this.clouds.forEach((cloud, index) => {
      cloud.position.x += Math.sin(time * 0.035 + index) * delta * 0.06;
    });

    this.#updateCamera(delta, oceanHeight, forward, side, boostAmount);
    this.#updateHUD();
    this.#updateGateGuide();
  }

  #updateCamera(delta, oceanHeight, forward, side, boostAmount) {
    const boatWorld = new THREE.Vector3(this.position.x, oceanHeight + 0.85, this.position.z);
    const cameraDistance = 16.35 + boostAmount * 3.5 + clamp(this.speed / 14, 0, 1) * 1.05;
    const cameraHeight = 8.95 + boostAmount * 0.75;
    this.tmp.desiredCamera
      .copy(boatWorld)
      .addScaledVector(forward, -cameraDistance)
      .addScaledVector(side, -this.steerVisual * 1.3)
      .add(new THREE.Vector3(0, cameraHeight, 0));
    this.tmp.desiredLook
      .copy(boatWorld)
      .addScaledVector(forward, 14 + this.speed * 0.25)
      .add(new THREE.Vector3(0, 2.4, 0));

    const cameraLambda = this.state === 'menu' ? 2.2 : 5.1;
    this.camera.position.lerp(this.tmp.desiredCamera, dampFactor(cameraLambda, delta));
    this.tmp.lookTarget.lerp(this.tmp.desiredLook, dampFactor(5.6, delta));
    this.camera.lookAt(this.tmp.lookTarget);
    const targetFov = 48 + boostAmount * 8 + clamp(this.speed - 10, 0, 4) * 0.45;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 4.2, delta);
    this.camera.updateProjectionMatrix();

    this.sun.position.set(this.position.x - 120, 180, this.position.z + 80);
    this.sun.target.position.set(this.position.x, 0, this.position.z - 40);
    this.sun.target.updateMatrixWorld();
  }

  #updateHUD() {
    if (!this.dom.hud) return;
    this.dom['gate-current'].textContent = String(Math.min(this.gateIndex, 7)).padStart(2, '0');
    this.dom.score.textContent = String(Math.round(this.score)).padStart(4, '0');
    this.dom['race-time'].textContent = formatTime(this.raceTime);
    this.dom['boat-speed'].textContent = String(Math.round(this.speed * 1.94384));
    this.dom['speed-fill'].style.width = `${clamp(this.speed * 1.94384 / 30, 0, 1) * 100}%`;

    this.dom['gate-pips'].querySelectorAll('i').forEach((pip, index) => {
      pip.classList.toggle('done', index < this.gateIndex);
      pip.classList.toggle('next', index === this.gateIndex);
    });

    const trimPercent = Math.round(this.trim * 100);
    const idealPercent = this.idealTrim * 100;
    this.dom['trim-percent'].textContent = `${trimPercent}%`;
    this.dom['trim-fill'].style.width = `${trimPercent}%`;
    this.dom['trim-handle'].style.left = `${trimPercent}%`;
    this.dom['trim-optimal'].style.left = `${idealPercent}%`;
    const trimDifference = this.trim - this.idealTrim;
    if (Math.abs(trimDifference) <= 0.1) {
      this.dom['trim-hint'].innerHTML = 'SAIL DRAWING CLEANLY <i>帆面受风良好</i>';
      this.dom['trim-hint'].classList.remove('warning');
    } else if (trimDifference > 0) {
      this.dom['trim-hint'].innerHTML = 'SHEET IN · PRESS S <i>收紧帆</i>';
      this.dom['trim-hint'].classList.add('warning');
    } else {
      this.dom['trim-hint'].innerHTML = 'EASE OUT · PRESS W <i>放松帆</i>';
      this.dom['trim-hint'].classList.add('warning');
    }

    const chargeOffset = 302 * (1 - this.charge);
    this.dom['charge-ring'].style.strokeDashoffset = String(chargeOffset);
    this.dom['charge-number'].textContent = String(Math.round(this.charge * 100));
    this.dom['energy-fill'].style.width = `${this.energy * 100}%`;
    this.dom['gust-state'].classList.toggle('charging', this.charging);
    if (this.charging) {
      this.dom['gust-state'].innerHTML = 'CHARGING <i>正在蓄力</i>';
      this.dom['gust-hint'].textContent = 'RELEASE SPACE TO RIDE THE GUST';
    } else if (this.boostCooldown > 0) {
      this.dom['gust-state'].innerHTML = 'RECOVERING <i>恢复中</i>';
      this.dom['gust-hint'].textContent = `${this.boostCooldown.toFixed(1)}s TO READY`;
    } else if (this.energy <= 0.16) {
      this.dom['gust-state'].innerHTML = 'RECHARGING <i>补充风能</i>';
      this.dom['gust-hint'].textContent = 'COLLECT WIND SHARDS FOR ENERGY';
    } else {
      this.dom['gust-state'].innerHTML = 'READY <i>准备就绪</i>';
      this.dom['gust-hint'].textContent = 'HOLD TO CHARGE · RELEASE TO BOOST';
    }

    const translations = {
      'In irons': '顶风失速',
      'Close hauled': '迎风航行',
      'Beam reach': '横风航行',
      'Broad reach': '斜顺风',
      Running: '顺风航行',
    };
    this.dom['wind-state'].innerHTML = `${this.windState} <i>${translations[this.windState]}</i>`;
    this.dom['wind-compass'].querySelector('span').style.transform = `rotate(${THREE.MathUtils.radToDeg(-this.heading) + 10}deg)`;
    this.dom['speed-lines'].classList.toggle('is-active', this.boostTime > 0.08);
  }

  #updateGateGuide() {
    const gate = this.gates[this.gateIndex];
    if (!gate || ['menu', 'finished'].includes(this.state)) {
      this.dom['gate-guide'].classList.add('is-hidden');
      return;
    }
    this.dom['gate-guide'].classList.remove('is-hidden');
    const target = this.tmp.projected.copy(gate.center);
    target.y = sampleOceanHeight(target.x, target.z, this.elapsedVisualTime) + 4.5;
    target.project(this.camera);
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;
    const screenX = clamp((target.x * 0.5 + 0.5) * width, width * 0.27, width * 0.73);
    const screenY = clamp((-target.y * 0.5 + 0.5) * height, height * 0.29, height * 0.62);
    this.dom['gate-guide'].style.left = `${screenX}px`;
    this.dom['gate-guide'].style.top = `${screenY}px`;

    const dx = gate.center.x - this.position.x;
    const dz = gate.center.z - this.position.z;
    const distance = Math.hypot(dx, dz);
    const targetHeading = Math.atan2(dx, -dz);
    const angleDelta = normalizeAngle(targetHeading - this.heading);
    this.dom['guide-arrow'].style.transform = `rotate(${THREE.MathUtils.radToDeg(angleDelta)}deg)`;
    this.dom['gate-distance'].textContent = `${Math.round(distance)}m`;
  }

  #animate(timestamp) {
    const delta = Math.min(0.05, Math.max(0, (timestamp - this.lastTimestamp) / 1000 || 0));
    this.lastTimestamp = timestamp;

    if (this.state !== 'paused') {
      this.elapsedVisualTime += delta;
      if (this.state === 'countdown') {
        this.#updatePrestartControls(delta);
        this.#updateCountdown(delta);
      } else if (this.state === 'racing') {
        this.accumulator = Math.min(this.accumulator + delta, FIXED_STEP * 5);
        while (this.accumulator >= FIXED_STEP) {
          this.#updatePhysics(FIXED_STEP);
          this.accumulator -= FIXED_STEP;
          if (this.state !== 'racing') break;
        }
      }
      this.#updateVisuals(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  #resize() {
    const width = Math.max(1, this.root.clientWidth);
    const height = Math.max(1, this.root.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.2 : 1.5));
    this.renderer.setSize(width, height, false);
  }

  getDebugState() {
    return {
      state: this.state,
      position: { x: this.position.x, z: this.position.z },
      heading: this.heading,
      speed: this.speed,
      trim: this.trim,
      trimQuality: this.trimQuality,
      raceTime: this.raceTime,
      gateIndex: this.gateIndex,
      score: this.score,
      energy: this.energy,
      charge: this.charge,
      charging: this.charging,
      boostTime: this.boostTime,
      collectibles: this.collectibleCount,
      perfectGates: this.perfectGates,
      render: {
        calls: this.renderer.info.render.calls,
        triangles: this.renderer.info.render.triangles,
      },
    };
  }

  debugPassCurrentGate() {
    if (this.state !== 'racing') return false;
    const gate = this.gates[this.gateIndex];
    if (!gate) return false;
    this.previousPosition.copy(gate.center).addScaledVector(gate.approach, -2);
    this.position.copy(gate.center).addScaledVector(gate.approach, 2);
    this.#checkGateCrossing();
    return true;
  }
}

async function boot() {
  const root = document.querySelector('#game-root');
  try {
    const game = new SaltwindGame(root);
    await game.init();
    window.__saltwind = {
      getState: () => game.getDebugState(),
      start: () => game.beginCountdown(),
      restart: () => game.beginCountdown(),
      pause: () => game.pause(),
      resume: () => game.resume(),
      passGate: () => game.debugPassCurrentGate(),
      game,
    };
  } catch (error) {
    console.error(error);
    const loading = document.querySelector('#loading');
    loading.innerHTML = '<strong>无法启动 WebGL</strong><span>请使用最新版 Chrome 并开启硬件加速</span>';
  }
}

boot();
