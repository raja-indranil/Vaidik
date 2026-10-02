/**
 * Procedural Web Audio Engine for Vedic Celestial Ambience and Sound FX
 * Zero external audio files required - works offline, instantly and reliably.
 */

class KundliAudioEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlayingAmbience = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Start the Vedic cosmic meditative drone (Tanpura / Om harmonic overtone)
   */
  public startCosmicAmbience(volume = 0.25) {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isPlayingAmbience) {
        this.setAmbienceVolume(volume);
        return;
      }

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), this.ctx.currentTime + 3);
      this.droneGain.connect(this.ctx.destination);

      // Root Sa (D3 ~ 146.83 Hz), Pa (Fifth ~ 220.00 Hz), Octave (293.66 Hz), Sub (73.41 Hz)
      const baseFreq = 146.83;
      const harmonics = [
        { freq: baseFreq * 0.5, type: 'sine' as OscillatorType, vol: 0.35, detune: -4 },
        { freq: baseFreq, type: 'sine' as OscillatorType, vol: 0.4, detune: 0 },
        { freq: baseFreq * 1.5, type: 'sine' as OscillatorType, vol: 0.25, detune: 5 }, // Pa (5th)
        { freq: baseFreq * 2, type: 'sine' as OscillatorType, vol: 0.15, detune: 3 }, // Higher Sa
        { freq: baseFreq * 3, type: 'triangle' as OscillatorType, vol: 0.08, detune: -2 },
      ];

      this.oscillators = harmonics.map((h) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();

        osc.type = h.type;
        osc.frequency.setValueAtTime(h.freq, this.ctx!.currentTime);
        osc.detune.setValueAtTime(h.detune, this.ctx!.currentTime);

        // Add subtle natural breathing LFO for warmth
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.setValueAtTime(0.12 + Math.random() * 0.08, this.ctx!.currentTime);
        lfoGain.gain.setValueAtTime(h.vol * 0.15, this.ctx!.currentTime);
        lfo.connect(lfoGain.gain);
        lfo.start();

        oscGain.gain.setValueAtTime(h.vol, this.ctx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.droneGain!);
        osc.start();
        return osc;
      });

      this.isPlayingAmbience = true;
    } catch (e) {
      console.warn('AudioContext not allowed yet:', e);
    }
  }

  public setAmbienceVolume(volume: number) {
    if (this.droneGain && this.ctx) {
      const v = Math.max(0.0001, Math.min(1, volume));
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, this.ctx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.3);
    }
  }

  public stopCosmicAmbience() {
    if (this.droneGain && this.ctx && this.isPlayingAmbience) {
      try {
        this.droneGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1);
        setTimeout(() => {
          this.oscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          this.oscillators = [];
          this.isPlayingAmbience = false;
        }, 1100);
      } catch {
        this.isPlayingAmbience = false;
      }
    }
  }

  /**
   * Plays a resonant Tibetan singing bowl / Vedic brass chime when transitioning houses
   */
  public playTempleChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chimeFreq = 587.33; // D5 tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(chimeFreq, now);
      // Subtle pitch bend for bell strike character
      osc.frequency.exponentialRampToValueAtTime(chimeFreq * 0.998, now + 1.5);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      // Overtones
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(chimeFreq * 2.76, now);
      overtoneGain.gain.setValueAtTime(0.09, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(this.ctx.destination);
      overtoneGain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 2.6);
      overtone.stop(now + 1.3);
    } catch (e) {
      console.warn('Could not play chime:', e);
    }
  }
}

export const audioEngine = new KundliAudioEngine();
