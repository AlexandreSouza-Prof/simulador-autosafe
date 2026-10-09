// ===================================================================
// SISTEMA DE ÁUDIO SINTETIZADO (WEB AUDIO API - 100% OFFLINE / ZERO ASSET)
// ===================================================================

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type, duration, gainLevel = 0.1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback not allowed yet');
    }
  }

  click() {
    this.playTone(800, 'sine', 0.05, 0.05);
  }

  hazardFound() {
    // Alerta bitonal de perigo detectado
    this.playTone(520, 'sawtooth', 0.12, 0.08);
    setTimeout(() => this.playTone(780, 'sawtooth', 0.2, 0.08), 100);
  }

  success() {
    // Fanfarra curta de acerto
    this.playTone(523.25, 'triangle', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.1), 80); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.12), 160); // G5
  }

  error() {
    // Buzz grave de erro
    this.playTone(180, 'square', 0.25, 0.08);
  }

  stageComplete() {
    // Vitória de conclusão de etapa
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.25, 0.12), i * 120);
    });
  }

  playAirHiss(duration = 0.25, gainLevel = 0.06) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter a 3400 Hz para simular vazamento sibilante de linha de pressão
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn('Audio hiss playback unavailable:', e);
    }
  }
}

window.soundFx = new SoundFX();
