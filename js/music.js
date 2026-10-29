/**
 * REPRODUCTOR DE MÚSICA DE BODA
 * Soporta archivos de audio reales (MP3 / WAV para la canción de entrada de la novia / marcha nupcial)
 * con respaldo automático a Web Audio API (Canon / Piano) si el archivo de audio aún no se encuentra.
 * Incluye pausa automática cuando la página pasa a segundo plano (ej. al abrir WhatsApp o cambiar de pestaña).
 */

export const START_OFFSET_SECONDS = 7;

class RomanticAudioPlayer {
  constructor() {
    this.isPlaying = false;
    this.wasPlayingBeforeBackground = false;
    this.activeMode = null; // 'audio-file' | 'synth'
    this.startOffset = START_OFFSET_SECONDS;
    this.hasStartedInitialPlayback = false;

    // Archivo de audio principal: Thinking Out Loud (Ed Sheeran)
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.preload = "auto";
    this.audioElement.currentTime = this.startOffset;

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

    this.setupBackgroundVisibilityListeners();
  }

  setupAudioElement() {
    if (this.currentSourceIndex < this.candidateSources.length) {
      this.audioElement.src = this.candidateSources[this.currentSourceIndex];
    }

    // Al cargar los metadatos del audio, posicionar el inicio en el segundo 7 si aún no ha comenzado
    this.audioElement.addEventListener('loadedmetadata', () => {
      if (!this.hasStartedInitialPlayback || this.audioElement.currentTime < this.startOffset) {
        try {
          this.audioElement.currentTime = this.startOffset;
        } catch (_) {}
      }
    });

    this.audioElement.addEventListener('error', () => {
      this.currentSourceIndex++;
      if (this.currentSourceIndex < this.candidateSources.length) {
        this.hasStartedInitialPlayback = false;
        this.audioElement.src = this.candidateSources[this.currentSourceIndex];
        if (this.isPlaying && this.activeMode === 'audio-file') {
          this.applyStartOffsetIfNeeded();
          this.audioElement.play().catch(() => this.startSynth());
        }
      } else {
        if (this.isPlaying && this.activeMode === 'audio-file') {
          this.startSynth();
        }
      }
    });
  }

  /**
   * Posiciona la pista en el segundo inicial configurado (7s) cuando arranca por primera vez
   * o si el navegador reinició el tiempo a < 7s, respetando la posición actual al reanudar tras una pausa.
   */
  applyStartOffsetIfNeeded() {
    const current = Number(this.audioElement.currentTime) || 0;
    if (!this.hasStartedInitialPlayback || current < this.startOffset) {
      try {
        this.audioElement.currentTime = this.startOffset;
        this.hasStartedInitialPlayback = true;
      } catch (_) {}
    }
  }

  /**
   * Configura los listeners para pausar automáticamente la música cuando la invitación
   * pasa a segundo plano (cambio de pestaña, bloqueo de pantalla o apertura de WhatsApp)
   * y reanudarla al regresar.
   */
  setupBackgroundVisibilityListeners() {
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden || document.visibilityState === 'hidden') {
          this.pauseForBackground();
        } else if (document.visibilityState === 'visible') {
          this.resumeFromBackground();
        }
      });
    }

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pagehide', () => this.pauseForBackground());
      window.addEventListener('blur', () => this.pauseForBackground());
      window.addEventListener('focus', () => this.resumeFromBackground());
    }
  }

  /**
   * Sincroniza el estado visual del botón `#music-toggle-btn` en el DOM
   */
  syncButtonUI() {
    if (typeof document !== 'undefined' && typeof document.getElementById === 'function') {
      const musicBtn = document.getElementById('music-toggle-btn');
      if (musicBtn && musicBtn.classList) {
        musicBtn.classList.toggle('is-playing', this.isPlaying);
      }
    }
  }

  /**
   * Pausa inmediatamente el audio sin olvidar si estaba sonando antes de ir a segundo plano
   */
  pauseForBackground() {
    if (!this.isPlaying) return false;
    this.wasPlayingBeforeBackground = true;
    this.pause();
    return true;
  }

  /**
   * Reanuda la música si estaba reproduciéndose antes de ir a segundo plano
   */
  async resumeFromBackground() {
    if (!this.wasPlayingBeforeBackground || this.isPlaying) return false;
    this.wasPlayingBeforeBackground = false;
    const playing = await this.playWithFadeIn(0.5, 600);
    this.syncButtonUI();
    return playing;
  }

  /**
   * Detiene la reproducción activa inmediatamente (tanto archivo de audio como sintetizador)
   */
  pause() {
    if (!this.isPlaying) return false;
    this.isPlaying = false;
    if (this.activeMode === 'audio-file') {
      this.audioElement.pause();
    } else {
      this.stopSynth();
    }
    this.activeMode = null;
    this.syncButtonUI();
    return false;
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
    if (this.ctx && typeof this.ctx.suspend === 'function' && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
  }

  /**
   * Reproduce con incremento gradual de volumen al interactuar con el sobre
   */
  async playWithFadeIn(targetVolume = 0.5, durationMs = 1500) {
    if (this.isPlaying) return true;
    this.isPlaying = true;
    this.syncButtonUI();

    try {
      this.audioElement.volume = 0;
      this.applyStartOffsetIfNeeded();
      await this.audioElement.play();
      // Garantizar en navegadores móviles (iOS/Android) que si play() reinició a 0 antes de bufferizar, salte al segundo 7
      if ((Number(this.audioElement.currentTime) || 0) < this.startOffset) {
        try {
          this.audioElement.currentTime = this.startOffset;
        } catch (_) {}
      }
      this.hasStartedInitialPlayback = true;
      this.activeMode = 'audio-file';

      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const step = (now) => {
        const currentNow = typeof now === 'number' ? now : Date.now();
        const elapsed = currentNow - startTime;
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
      this.wasPlayingBeforeBackground = false;
      return this.pause();
    } else {
      const playing = await this.playWithFadeIn(0.5, 800);
      this.syncButtonUI();
      return playing;
    }
  }
}

export const musicPlayer = new RomanticAudioPlayer();
if (typeof window !== 'undefined') {
  window.weddingMusic = musicPlayer;
}
