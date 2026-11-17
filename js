// Efek suara sintetis ringan menggunakan Web Audio API (0 KB aset eksternal)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type, duration, vol = 0.15, slideTo = null) {
    if (this.muted) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, this.ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  tap() {
    this.playTone(520, 'sine', 0.05, 0.08);
  }

  hit(combo = 1, isCrit = false) {
    const baseFreq = Math.min(440 + combo * 35, 950);
    this.playTone(baseFreq, 'triangle', 0.14, 0.18, baseFreq * 1.4);
    if (isCrit) {
      setTimeout(() => this.playTone(baseFreq * 1.5, 'sine', 0.18, 0.16), 50);
    }
  }

  miss() {
    this.playTone(170, 'sawtooth', 0.25, 0.18, 95);
    if (navigator.vibrate) navigator.vibrate(120);
  }

  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.22, 0.18), i * 95);
    });
  }

  lose() {
    const notes = [330, 293.66, 261.63, 196];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'sawtooth', 0.25, 0.14), i * 120);
    });
  }
}

export const sfx = new SoundFX();
