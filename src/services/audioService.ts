// Web Audio API & Speech Synthesis Service for Affiliate Video Studio

class AudioService {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: any = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.2;
        this.bgmGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioContext(): AudioContext | null {
    this.initContext();
    return this.ctx;
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }
    return this.availableVoices;
  }

  public getThaiVoices(): SpeechSynthesisVoice[] {
    const all = this.getVoices();
    const thai = all.filter(v => v.lang.toLowerCase().includes('th') || v.name.toLowerCase().includes('thai'));
    return thai.length > 0 ? thai : all.slice(0, 5);
  }

  // Speak text using SpeechSynthesis
  public speak(
    text: string,
    voiceName?: string,
    rate: number = 1.15, // fast energetic TikTok pace
    pitch: number = 1.0,
    onEnd?: () => void,
    onStart?: () => void
  ): SpeechSynthesisUtterance | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return null;
    }

    // Cancel current speaking
    window.speechSynthesis.cancel();

    if (!text.trim()) {
      if (onEnd) onEnd();
      return null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));
    utterance.lang = 'th-TH';

    // Find requested voice or best Thai voice
    const voices = this.getVoices();
    if (voiceName) {
      const selected = voices.find(v => v.name === voiceName);
      if (selected) utterance.voice = selected;
    } else {
      const thaiVoice = voices.find(v => v.lang.includes('th') || v.name.toLowerCase().includes('thai'));
      if (thaiVoice) utterance.voice = thaiVoice;
    }

    utterance.onstart = () => {
      this.duckBgm(true);
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.duckBgm(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.duckBgm(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.duckBgm(false);
    }
  }

  // Synthesize Sound Effects using Web Audio API
  public playSoundEffect(type: 'woosh' | 'ding' | 'cash' | 'pop' | 'camera' | 'none') {
    if (type === 'none') return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      if (type === 'woosh') {
        // Fast filtered noise swoosh
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(3000, now + 0.15);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.3);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.3);
      } else if (type === 'ding') {
        // High crystal notification chime
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now); // A6
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'cash') {
        // Cha-ching cash register double-bell
        [1200, 1800, 2400].forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = now + i * 0.08;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });
      } else if (type === 'pop') {
        // Bubble pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'camera') {
        // Shutter snap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn('Sound effect playback error:', e);
    }
  }

  // Dynamic Background Music (BGM) synthesizer
  public startProceduralBgm(style: string = 'upbeat-tiktok', volume: number = 0.25) {
    this.initContext();
    if (!this.ctx || this.isBgmPlaying) return;

    this.isBgmPlaying = true;
    let step = 0;
    const bpm = style === 'lofi-chill' ? 85 : 120;
    const intervalMs = (60 / bpm) * 1000 / 2; // 8th notes

    // Chord progressions
    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];

    this.bgmInterval = setInterval(() => {
      if (!this.ctx || !this.isBgmPlaying) return;
      const now = this.ctx.currentTime;
      const bar = Math.floor(step / 8) % chords.length;
      const beatInBar = step % 8;
      const currentChord = chords[bar];

      // Bass note on beats 0, 3, 6
      if (beatInBar === 0 || beatInBar === 4) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(currentChord[0] / 2, now);

        bassGain.gain.setValueAtTime(volume * 0.4, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        bassOsc.connect(bassGain);
        if (this.bgmGain) bassGain.connect(this.bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.35);
      }

      // Synth pluck melody
      if (beatInBar % 2 === 0) {
        const noteIdx = (step % 3);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(currentChord[noteIdx] * (beatInBar === 0 ? 1 : 2), now);

        gain.gain.setValueAtTime(volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        if (this.bgmGain) gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 0.2);
      }

      // Hi-hat / click rhythm
      if (beatInBar % 2 === 1) {
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(3000, now);

        clickGain.gain.setValueAtTime(volume * 0.08, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        clickOsc.connect(clickGain);
        if (this.bgmGain) clickGain.connect(this.bgmGain);

        clickOsc.start(now);
        clickOsc.stop(now + 0.04);
      }

      step++;
    }, intervalMs);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public setBgmVolume(volume: number) {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  // Audio ducking when voiceover is active
  private duckBgm(isDucking: boolean) {
    if (this.bgmGain && this.ctx) {
      const targetVolume = isDucking ? 0.06 : 0.22;
      this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGain.gain.linearRampToValueAtTime(targetVolume, this.ctx.currentTime + 0.2);
    }
  }
}

export const audioService = new AudioService();
