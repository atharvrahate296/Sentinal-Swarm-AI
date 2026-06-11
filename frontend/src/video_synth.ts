// VideoSynth.ts: Web Audio API Synthesizer for Sentinel Swarm AI Cinematic Video Player
export class VideoSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  
  // Audio Nodes
  private masterVolume: GainNode | null = null;
  private synthVolume: GainNode | null = null;
  private sfxVolume: GainNode | null = null;

  // Background Synth Loop Nodes
  private chordOscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private pulseInterval: any = null;

  constructor() {
    // Audio Context is initialized on play to comply with browser autoplay security policies
  }

  public init() {
    if (this.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Setup routing nodes
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
    this.masterVolume.connect(this.ctx.destination);

    this.synthVolume = this.ctx.createGain();
    this.synthVolume.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.synthVolume.connect(this.masterVolume);

    this.sfxVolume = this.ctx.createGain();
    this.sfxVolume.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.sfxVolume.connect(this.masterVolume);
  }

  public startMusic() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isPlaying = true;
    this.startAmbientLoop();
    this.startHeartbeatPulse();
  }

  public stopMusic() {
    this.isPlaying = false;
    
    // Stop and clear chord oscillators
    this.chordOscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.chordOscillators = [];

    if (this.lfo) {
      try { this.lfo.stop(); } catch(e) {}
      this.lfo = null;
    }

    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterVolume && this.ctx) {
      const targetVolume = muted ? 0 : 0.6;
      this.masterVolume.gain.linearRampToValueAtTime(targetVolume, this.ctx.currentTime + 0.1);
    }
  }

  // Plays a deep chord progression (Ebm -> Gb -> Bbm -> Db) to fit the futuristic tone
  private startAmbientLoop() {
    if (!this.ctx || !this.synthVolume) return;

    // Create low pass filter to make the chords sound warm and deep
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(5, this.ctx.currentTime);
    this.filter.connect(this.synthVolume);

    // Create an LFO to modulate filter cutoff frequency, creating a "pulsing/breathing" feel
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // very slow oscillation (5 seconds)
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.filter.frequency);
    this.lfo.start();

    // Trigger chords sequentially
    const chordFrequencies = [
      [77.78, 92.50, 116.54, 155.56], // Ebm chord (Eb2, Gb2, Bb2, Eb3)
      [92.50, 116.54, 138.59, 185.00], // Gb chord (Gb2, Bb2, Db3, Gb3)
      [116.54, 146.83, 174.61, 233.08], // Bbm chord (Bb2, D3, F3, Bb3)
      [138.59, 164.81, 207.65, 277.18]  // Db chord (Db2, E2, Ab2, Db3)
    ];

    let currentChordIndex = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.filter) return;

      // Stop previous chord
      this.chordOscillators.forEach(osc => {
        try {
          osc.stop();
        } catch(e) {}
      });
      this.chordOscillators = [];

      const freqs = chordFrequencies[currentChordIndex];
      const now = this.ctx.currentTime;

      freqs.forEach(freq => {
        if (!this.ctx || !this.filter) return;
        
        // Triangle wave for base, Sine wave for sub-frequencies
        const osc = this.ctx.createOscillator();
        osc.type = freq < 100 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Individual gain node for fade-in/fade-out
        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.08, now + 1.0); // slow fade-in
        oscGain.gain.setValueAtTime(0.08, now + 7.5);
        oscGain.gain.linearRampToValueAtTime(0, now + 9.5); // slow fade-out

        osc.connect(oscGain);
        oscGain.connect(this.filter);
        osc.start(now);
        this.chordOscillators.push(osc);
      });

      currentChordIndex = (currentChordIndex + 1) % chordFrequencies.length;
      
      // Schedule next chord change in 10 seconds
      if (this.isPlaying) {
        setTimeout(() => playChord(), 10000);
      }
    };

    playChord();
  }

  // Synthesizes a technology heartbeat pulse (low Kick drum sound) every 2 seconds
  private startHeartbeatPulse() {
    if (!this.ctx || !this.synthVolume) return;

    const pulse = () => {
      if (!this.isPlaying || !this.ctx || !this.synthVolume) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.3); // Pitch drop

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35); // Fast volume decay

      osc.connect(gain);
      gain.connect(this.synthVolume);

      osc.start(now);
      osc.stop(now + 0.4);

      if (this.isPlaying) {
        this.pulseInterval = setTimeout(() => pulse(), 2000);
      }
    };

    pulse();
  }

  // SFX: Scene 2 Chaos Glitch Alarm
  public triggerChaosGlitch() {
    if (!this.ctx || !this.sfxVolume) return;

    const now = this.ctx.currentTime;
    
    // 1. Synthesize red digital noise using an oscillator with rapid LFO pitch modulation
    const noiseOsc = this.ctx.createOscillator();
    noiseOsc.type = 'sawtooth';
    noiseOsc.frequency.setValueAtTime(120, now);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(22, now); // fast pitch oscillation (vibrato/buzz)
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(90, now);

    lfo.connect(lfoGain);
    lfoGain.connect(noiseOsc.frequency);

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.Q.setValueAtTime(4, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    noiseGain.gain.setValueAtTime(0.18, now + 1.2);
    noiseGain.gain.linearRampToValueAtTime(0, now + 1.5);

    noiseOsc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.sfxVolume);

    lfo.start(now);
    noiseOsc.start(now);
    
    lfo.stop(now + 1.5);
    noiseOsc.stop(now + 1.5);

    // 2. Synthesize double alarm beep
    this.playBeep(440, 0.15, now + 0.1);
    this.playBeep(330, 0.15, now + 0.35);
  }

  // SFX: Scene 3 Riser & Chord Swell (Sentinel Product Reveal)
  public triggerProductReveal() {
    if (!this.ctx || !this.sfxVolume) return;

    const now = this.ctx.currentTime;

    // 1. Sound riser: ascending pitch sweep representing anticipation
    const riserOsc = this.ctx.createOscillator();
    riserOsc.type = 'sine';
    riserOsc.frequency.setValueAtTime(80, now);
    riserOsc.frequency.exponentialRampToValueAtTime(650, now + 2.5);

    const riserGain = this.ctx.createGain();
    riserGain.gain.setValueAtTime(0, now);
    riserGain.gain.linearRampToValueAtTime(0.15, now + 2.0);
    riserGain.gain.linearRampToValueAtTime(0, now + 2.5);

    riserOsc.connect(riserGain);
    riserGain.connect(this.sfxVolume);

    riserOsc.start(now);
    riserOsc.stop(now + 2.6);

    // 2. Majestic Chord Swell: sweeps in at the end of the riser (2.4s mark)
    const swellTime = now + 2.4;
    const notes = [196.00, 293.66, 392.00, 493.88, 587.33]; // G major chord (G3, D4, G4, B4, D5)

    notes.forEach((freq, index) => {
      if (!this.ctx || !this.sfxVolume) return;

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, swellTime);

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0, swellTime);
      gainNode.gain.linearRampToValueAtTime(0.12 - (index * 0.01), swellTime + 0.6); // layered entry
      gainNode.gain.setValueAtTime(0.12 - (index * 0.01), swellTime + 2.5);
      gainNode.gain.linearRampToValueAtTime(0, swellTime + 4.0);

      osc.connect(gainNode);
      gainNode.connect(this.sfxVolume);

      osc.start(swellTime);
      osc.stop(swellTime + 4.1);
    });
  }

  // SFX: Scene 5 Blocked/Quarantined Shield Sound
  public triggerBlockEffect() {
    if (!this.ctx || !this.sfxVolume) return;

    const now = this.ctx.currentTime;
    
    // Metallic "CLANK" bubble shield activation
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.45);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(12, now); // metallic resonance

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxVolume);

    osc.start(now);
    osc.stop(now + 0.55);

    // Dynamic warning alert
    this.playBeep(880, 0.12, now);
    this.playBeep(880, 0.12, now + 0.15);
  }

  // SFX: Scene 6 Self-Healing Scrubbing/Laser Pulse
  public triggerHealEffect() {
    if (!this.ctx || !this.sfxVolume) return;

    const now = this.ctx.currentTime;
    
    // Laser swipe sweep: rapid upward pitch sweep
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxVolume);

    osc.start(now);
    osc.stop(now + 0.85);

    // High success chime
    this.playBeep(523.25, 0.15, now + 0.6); // C5
    this.playBeep(659.25, 0.15, now + 0.75); // E5
    this.playBeep(783.99, 0.3, now + 0.9); // G5
  }

  // SFX: Final Logo Reveal Sub-Bass Drop Impact
  public triggerLogoSubDrop() {
    if (!this.ctx || !this.sfxVolume) return;

    const now = this.ctx.currentTime;

    // 1. Massive sub-bass boom (sine wave sweeping 110Hz down to 25Hz)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 2.0);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    subOsc.connect(subGain);
    subGain.connect(this.sfxVolume);

    subOsc.start(now);
    subOsc.stop(now + 2.3);

    // 2. High metallic chime echo (cybernetic brand stamp)
    const highFrequencies = [880.00, 1109.73, 1318.51, 1760.00]; // A major 7th chime (A5, C#6, E6, A6)
    
    highFrequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxVolume) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.sfxVolume);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  // Helper: Play a standard synth beep
  private playBeep(freq: number, duration: number, startTime: number) {
    if (!this.ctx || !this.sfxVolume) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxVolume);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}
