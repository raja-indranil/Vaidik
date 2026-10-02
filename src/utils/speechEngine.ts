export interface SpeechEventCallbacks {
  onStart?: () => void;
  onBoundary?: (charIndex: number, charLength?: number) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class KundliSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    this.cachedVoices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (this.cachedVoices.length === 0) {
      this.cachedVoices = this.synth.getVoices();
    }
    return this.cachedVoices;
  }

  public getBestVoiceForLanguage(lang: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices.length) return null;

    // Direct match for locale
    const exact = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
    if (exact) return exact;

    // Match starting with lang prefix
    const prefix = lang.split('-')[0].toLowerCase();
    const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (prefixMatch) return prefixMatch;

    // Fallback to any natural English or Hindi voice
    const indianVoice = voices.find((v) => v.name.includes('India') || v.lang.includes('IN'));
    if (indianVoice) return indianVoice;

    return voices[0];
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voice?: SpeechSynthesisVoice | null;
      lang?: string;
    },
    callbacks?: SpeechEventCallbacks
  ) {
    if (!this.synth || !this.isSupported) {
      callbacks?.onStart?.();
      // Emulate duration
      const words = text.split(/\s+/).length;
      const estimatedDuration = (words / 2.5) * 1000;
      setTimeout(() => {
        callbacks?.onEnd?.();
      }, estimatedDuration);
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    if (options.voice) {
      utterance.voice = options.voice;
      utterance.lang = options.voice.lang;
    } else if (options.lang) {
      utterance.lang = options.lang;
      const matchingVoice = this.getBestVoiceForLanguage(options.lang);
      if (matchingVoice) utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onboundary = (event) => {
      callbacks?.onBoundary?.(event.charIndex, (event as any).charLength || 0);
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      // Ignore user-initiated cancellation errors
      if (e.error === 'interrupted' || e.error === 'canceled') {
        return;
      }
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('Speech speak failed:', e);
      callbacks?.onEnd?.();
    }
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }

  public isPaused(): boolean {
    return !!(this.synth && this.synth.paused);
  }
}

export const speechEngine = new KundliSpeechEngine();
