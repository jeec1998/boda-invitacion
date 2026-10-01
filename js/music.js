/**
 * REPRODUCTOR DE MÚSICA DE BODA
 * Soporta archivos de audio reales (MP3 / WAV para la canción de entrada de la novia / marcha nupcial)
 * con respaldo automático a Web Audio API (Canon / Piano) si el archivo de audio aún no se encuentra.
 */

class RomanticAudioPlayer {
  constructor() {
    this.isPlaying = false;
    this.activeMode = null; // 'audio-file' | 'synth'
    
    // Archivo de audio principal: Thinking Out Loud (Ed Sheeran)
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.preload = "auto";
    
    // Rutas candidatas: Local primero, respaldo a CDN de ChungDoi y WAV local
    this.candidateSources = [
      'assets/audio/thinking-out-loud.mp3',
      'https://cdn.chungdoi.com/music/thinking-out-loud.mp3',
      'assets/audio/entrada-novia.wav'
    ];
    this.currentSourceIndex = 0;
    this.setupAudioElement();

    // Web Audio API para respaldo sintetizado
    this.ctx = null;
    this.timer = null;
    this.masterGain = null;
    this.noteIndex = 0;
    this.melody = [
      293.66, 369.99, 440.00, 587.33,
      220.00, 277.18, 329.63, 440.00,
      246.94, 293.66, 369.99, 493.88,
      185.00, 220.00, 277.18, 369.99,
      196.00, 246.94, 293.66, 392.00,
      220.00, 293.66, 369.99, 440.00,
      196.00, 246.94, 293.66, 392.00,
      220.00, 277.18, 329.63, 440.00
    ];
  }

  setupAudioElement() {
    if (this.currentSourceIndex < this.candidateSources.length) {
      this.audioElement.src = this.candidateSources[this.currentSourceIndex];
    }
    
    this.audioElement.addEventListener('error', () => {
      this.currentSourceIndex++;
      if (this.currentSourceIndex < this.candidateSources.length) {
        this.audioElement.src = this.candidateSources[this.currentSourceIndex];
        if (this.isPlaying && this.activeMode === 'audio-file') {
          this.audioElement.play().catch(() => this.startSynth());
        }
      } else {
        if (this.isPlaying && this.activeMode === 'audio-file') {
          this.startSynth();
        }
      }
    });
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, time, duration = 1.4) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.exponentialRampToValueAtTime(0.25, time + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);
  }

  scheduleNotes() {
    if (!this.isPlaying || this.activeMode !== 'synth') return;
    const note = this.melody[this.noteIndex];
    const now = this.ctx.currentTime;
    
    this.playTone(note, now, 1.6);
    if (this.noteIndex % 4 === 0) {
      this.playTone(note / 2, now, 2.2);
    }
    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.timer = setTimeout(() => this.scheduleNotes(), 480);
  }

  startSynth() {
    this.activeMode = 'synth';
    this.initContext();
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.5);
    }
    this.scheduleNotes();
  }

  stopSynth() {
    clearTimeout(this.timer);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    }
  }

  /**
   * Reproduce con incremento gradual de volumen al interactuar con el sobre
   */
  async playWithFadeIn(targetVolume = 0.5, durationMs = 1500) {
    if (this.isPlaying) return true;
    this.isPlaying = true;
    
    try {
      this.audioElement.volume = 0;
      await this.audioElement.play();
      this.activeMode = 'audio-file';

      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        this.audioElement.volume = progress * targetVolume;
        if (progress < 1 && this.isPlaying && this.activeMode === 'audio-file') {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
      return true;
    } catch (err) {
      console.warn("Audio file play blocked or failed, falling back to synth:", err);
      this.startSynth();
      return true;
    }
  }

  async toggle() {
    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.activeMode === 'audio-file') {
        this.audioElement.pause();
      } else {
        this.stopSynth();
      }
      this.activeMode = null;
      return false;
    } else {
      return await this.playWithFadeIn(0.5, 800);
    }
  }
}

export const musicPlayer = new RomanticAudioPlayer();
if (typeof window !== 'undefined') {
  window.weddingMusic = musicPlayer;
}
