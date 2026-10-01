/**
 * REPRODUCTOR DE MÚSICA AMBIENTAL ROMÁNTICA
 * Utiliza Web Audio API para generar un arpegio suave y armónico estilo caja de música / piano acústico
 * garantizando reproducción instantánea sin depender de enlaces externos que puedan caducar.
 */

class RomanticAudioPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.masterGain = null;
    this.noteIndex = 0;
    
    // Progresión armónica romántica (Canon / Pachelbel / Wedding cadence en Re mayor)
    // Frecuencias en Hz:
    this.melody = [
      // Acorde D (Re)
      293.66, 369.99, 440.00, 587.33,
      // Acorde A (La)
      220.00, 277.18, 329.63, 440.00,
      // Acorde Bm (Si menor)
      246.94, 293.66, 369.99, 493.88,
      // Acorde F#m (Fa# menor)
      185.00, 220.00, 277.18, 369.99,
      // Acorde G (Sol)
      196.00, 246.94, 293.66, 392.00,
      // Acorde D (Re)
      220.00, 293.66, 369.99, 440.00,
      // Acorde G (Sol)
      196.00, 246.94, 293.66, 392.00,
      // Acorde A (La)
      220.00, 277.18, 329.63, 440.00
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
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

    // Timbre cálido y aterciopelado (onda senoidal + triángulo suave)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time); // primer armónico suave

    // Envolvente acústica tipo arpa/celesta
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
    if (!this.isPlaying) return;

    const note = this.melody[this.noteIndex];
    const now = this.ctx.currentTime;
    
    this.playTone(note, now, 1.6);

    // Variación sutil de octava para riqueza armónica
    if (this.noteIndex % 4 === 0) {
      this.playTone(note / 2, now, 2.2);
    }

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;

    // Tempo andante romántico (~480ms por nota)
    this.timer = setTimeout(() => {
      this.scheduleNotes();
    }, 480);
  }

  toggle() {
    this.initContext();

    if (this.isPlaying) {
      this.isPlaying = false;
      clearTimeout(this.timer);
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      return false;
    } else {
      this.isPlaying = true;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.5);
      }
      this.scheduleNotes();
      return true;
    }
  }
}

export const musicPlayer = new RomanticAudioPlayer();
