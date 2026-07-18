export class AudioEngine {
  constructor() {
    this.context = null;
    this.master = null;
    this.ambientGain = null;
    this.windFilter = null;
    this.chargeOscillator = null;
    this.chargeGain = null;
    this.muted = false;
    this.isPaused = false;
  }

  async init() {
    if (this.context) {
      await this.context.resume();
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = 0.72;
    this.master.connect(this.context.destination);
    this.#startAmbience();
    await this.context.resume();
  }

  async resume() {
    if (this.context?.state === 'suspended') await this.context.resume();
  }

  setMuted(muted) {
    this.muted = muted;
    if (!this.master || !this.context) return;
    const target = muted ? 0 : this.isPaused ? 0.11 : 0.72;
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(target, this.context.currentTime, 0.04);
  }

  setPaused(paused) {
    this.isPaused = paused;
    if (!this.master || !this.context || this.muted) return;
    this.master.gain.setTargetAtTime(paused ? 0.11 : 0.72, this.context.currentTime, 0.06);
  }

  setSpeed(speed, trimQuality = 1) {
    if (!this.context || !this.ambientGain || !this.windFilter) return;
    const now = this.context.currentTime;
    const speedRatio = Math.min(1, speed / 24);
    this.ambientGain.gain.setTargetAtTime(0.045 + speedRatio * 0.1, now, 0.1);
    this.windFilter.frequency.setTargetAtTime(500 + speedRatio * 1800, now, 0.12);

    if (trimQuality < 0.36 && Math.random() < 0.008) this.sailFlap();
  }

  countdown(step) {
    const frequency = step === 0 ? 880 : 360 + (4 - step) * 70;
    this.#tone(frequency, step === 0 ? 0.44 : 0.16, step === 0 ? 0.18 : 0.1, 'sine');
    if (step === 0) {
      this.#tone(1320, 0.2, 0.09, 'triangle', 0.07);
      this.#noise(0.38, 0.035, 1600, 'bandpass');
    }
  }

  collect() {
    this.#tone(740, 0.12, 0.09, 'sine');
    this.#tone(1110, 0.22, 0.075, 'triangle', 0.07);
    this.#tone(1480, 0.18, 0.045, 'sine', 0.15);
  }

  gate(perfect = false) {
    const notes = perfect ? [523, 784, 1047] : [440, 660, 880];
    notes.forEach((frequency, index) => {
      this.#tone(frequency, 0.32, 0.085 - index * 0.012, 'sine', index * 0.085);
    });
    this.#noise(0.18, 0.03, 2200, 'highpass', 0.03);
  }

  startCharge() {
    if (!this.context || this.chargeOscillator) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    oscillator.type = 'sine';
    oscillator.frequency.value = 110;
    filter.type = 'lowpass';
    filter.frequency.value = 950;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
    oscillator.connect(filter).connect(gain).connect(this.master);
    oscillator.start(now);
    this.chargeOscillator = oscillator;
    this.chargeGain = gain;
  }

  updateCharge(amount) {
    if (!this.context || !this.chargeOscillator) return;
    const now = this.context.currentTime;
    this.chargeOscillator.frequency.setTargetAtTime(110 + amount * 470, now, 0.025);
    this.chargeGain.gain.setTargetAtTime(0.025 + amount * 0.055, now, 0.04);
  }

  endCharge(amount, boosted) {
    if (this.context && this.chargeOscillator) {
      const now = this.context.currentTime;
      this.chargeGain.gain.cancelScheduledValues(now);
      this.chargeGain.gain.setTargetAtTime(0.0001, now, 0.025);
      this.chargeOscillator.stop(now + 0.18);
    }
    this.chargeOscillator = null;
    this.chargeGain = null;
    if (boosted) this.boost(amount);
  }

  boost(amount = 1) {
    this.#tone(74, 0.38, 0.16 + amount * 0.05, 'sine');
    this.#tone(148, 0.22, 0.06, 'triangle', 0.015);
    this.#noise(0.72 + amount * 0.4, 0.12 + amount * 0.08, 900 + amount * 1200, 'bandpass');
  }

  sailFlap() {
    this.#noise(0.09, 0.018, 2400, 'highpass');
  }

  collision() {
    this.#tone(92, 0.25, 0.17, 'triangle');
    this.#noise(0.36, 0.11, 420, 'lowpass');
  }

  finish() {
    [392, 523, 659, 784, 1047].forEach((frequency, index) => {
      this.#tone(frequency, 0.5, 0.075, index % 2 ? 'triangle' : 'sine', index * 0.11);
    });
  }

  click() {
    this.#tone(620, 0.06, 0.04, 'triangle');
  }

  #startAmbience() {
    const sampleRate = this.context.sampleRate;
    const duration = 4;
    const buffer = this.context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = last * 0.985 + white * 0.015;
      data[index] = white * 0.28 + last * 1.8;
    }

    const source = this.context.createBufferSource();
    const lowpass = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.loop = true;
    lowpass.type = 'bandpass';
    lowpass.frequency.value = 620;
    lowpass.Q.value = 0.42;
    gain.gain.value = 0.055;
    source.connect(lowpass).connect(gain).connect(this.master);
    source.start();
    this.ambientGain = gain;
    this.windFilter = lowpass;
  }

  #tone(frequency, duration, volume, type = 'sine', delay = 0) {
    if (!this.context || !this.master) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  #noise(duration, volume, frequency, filterType = 'bandpass', delay = 0) {
    if (!this.context || !this.master) return;
    const start = this.context.currentTime + delay;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = 0.55;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(this.master);
    source.start(start);
    source.stop(start + duration + 0.03);
  }
}
