// Peaceful Instrumental Studio Ambient Music Engine
// Uses Web Audio API to synthesize relaxing, soothing piano / harp / Rhodes pentatonic chords & chimes.
// 100% offline, zero network requests, lightweight, zero lag.

class PeacefulMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.25; // Default peaceful volume (gentle, 25%)
  private loopTimer: number | null = null;
  private chordIndex = 0;

  // Peaceful pentatonic / modal chord frequencies (Hz)
  // Cmaj9, Am9, Fmaj7#11, Gsus2/Em7
  private chords: number[][] = [
    [261.63, 329.63, 392.0, 493.88, 587.33], // C4, E4, G4, B4, D5 (Cmaj9)
    [220.0, 261.63, 329.63, 392.0, 493.88],  // A3, C4, E4, G4, B4 (Am9)
    [174.61, 261.63, 329.63, 369.99, 440.0],  // F3, C4, E4, F#4, A4 (Fmaj7#11)
    [196.0, 293.66, 392.0, 440.0, 523.25],   // G3, D4, G4, A4, C5 (Gsus4/2)
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single soft acoustic / Rhodes chime note
  private playSoftTone(freq: number, delayMs: number, duration: number, velocity: number = 0.7) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const startTime = this.ctx.currentTime + delayMs / 1000;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Warm, rounded chime / Rhodes timbre
    osc.type = 'sine';
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime); // warm octave sub-drone
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm low-pass acoustic resonance
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, startTime);
    filter.frequency.exponentialRampToValueAtTime(350, startTime + duration);

    // Soft organic attack & smooth lingering decay envelope
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.28 * velocity, startTime + 0.06); // gentle attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // peaceful fade

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    subOsc.stop(startTime + duration + 0.1);
  }

  private stepArpeggio() {
    if (!this.isPlaying || !this.ctx) return;

    const currentChord = this.chords[this.chordIndex % this.chords.length];
    this.chordIndex++;

    // Play a gentle flowing 3-note or 4-note acoustic cascade
    const order = [0, 2, 1, 3, 4];
    order.forEach((noteIdx, step) => {
      if (noteIdx < currentChord.length) {
        const freq = currentChord[noteIdx];
        const delay = step * 380; // slow, gentle acoustic cadence
        const duration = 3.6 + Math.random() * 0.8;
        const velocity = 0.5 + Math.random() * 0.35;
        this.playSoftTone(freq, delay, duration, velocity);
      }
    });

    // Schedule next chord in 3.4 seconds
    this.loopTimer = window.setTimeout(() => {
      this.stepArpeggio();
    }, 3400);
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.masterGain && this.ctx) {
      // Smooth fade in
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.4);
    }

    this.stepArpeggio();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }

    if (this.masterGain && this.ctx) {
      // Smooth fade out
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(vol: number) {
    // Clamp between 0.05 and 1.0
    const clamped = Math.max(0.05, Math.min(1.0, vol));
    this.volume = clamped;
    if (this.masterGain && this.ctx && this.isPlaying) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(clamped, this.ctx.currentTime + 0.1);
    }
  }

  public volumeDown(step: number = 0.05): number {
    this.setVolume(this.volume - step);
    return Math.round(this.volume * 100);
  }

  public volumeUp(step: number = 0.05): number {
    this.setVolume(this.volume + step);
    return Math.round(this.volume * 100);
  }

  public getVolumePercent(): number {
    return Math.round(this.volume * 100);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const peacefulMusic = new PeacefulMusicEngine();
