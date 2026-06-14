import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Tv,
  Sparkles,
} from 'lucide-react';

// Lazy-load VideoSynth only when playback starts
let synthInstance: any = null;
async function getSynth() {
  if (!synthInstance) {
    const { VideoSynth } = await import('../video_synth');
    synthInstance = new VideoSynth();
  }
  return synthInstance;
}

interface Scene {
  id: number;
  title: string;
  duration: number;
  startTime: number;
  image: string;
  narration: string;
  visual: string;
  action: string;
}

const SCENES: Scene[] = [
  { id: 1, title: "The AI Swarm Age", duration: 10, startTime: 0, image: "/assets/scenes/scene1.png", narration: "AI agents are becoming the workforce of the future.", visual: "Dark global map grid, thousands of autonomous AI agent nodes pulsing.", action: "Neoclassical ambient tech score initializes." },
  { id: 2, title: "System Anomaly & Chaos", duration: 12, startTime: 10, image: "/assets/scenes/scene2.png", narration: "But every intelligent system creates new risks.", visual: "Glitch transition, red threat vectors injecting databases.", action: "Warning digital alarm triggers." },
  { id: 3, title: "Sentinel Swarm AI Reveal", duration: 13, startTime: 22, image: "/assets/scenes/scene3.png", narration: "Introducing Sentinel Swarm AI.", visual: "Blue light sweeps away alerts, revealing the Command Center.", action: "Orchestral technology riser peaks." },
  { id: 4, title: "Agent Swarm Architecture", duration: 13, startTime: 35, image: "/assets/scenes/scene4.png", narration: "A self-governing swarm of intelligent security agents.", visual: "Orchestration graph with data flows and trust scores.", action: "Rhythmic digital ticking, ascending synth chimes." },
  { id: 5, title: "Live Attack Isolation", duration: 14, startTime: 48, image: "/assets/scenes/scene5.png", narration: "Threats detected. Analyzed. Neutralized.", visual: "Intrusion isolation with glowing blue forcefield ring.", action: "Metallic forcefield clank triggers." },
  { id: 6, title: "Swarm Self-Healing", duration: 10, startTime: 62, image: "/assets/scenes/scene6.png", narration: "Resilient by design. Self-healing by default.", visual: "Recovery agent lasers scrub infected validator node.", action: "Energy beam pulse sweeps." },
  { id: 7, title: "Executive GRC Dashboard", duration: 10, startTime: 72, image: "/assets/scenes/scene7.png", narration: "From technical defense to executive confidence.", visual: "Sleek GRC overview with financial loss prevented.", action: "Smooth swipe transition sound." },
  { id: 8, title: "2030 Secure Vision", duration: 8, startTime: 82, image: "/assets/scenes/scene8.png", narration: "The operating system for autonomous intelligence.", visual: "Thousands of agents in secure global lattice.", action: "Majestic string swell peaks." },
  { id: 9, title: "Logo Reveal", duration: 10, startTime: 90, image: "/assets/scenes/scene9.png", narration: "SENTINEL SWARM AI: Secure. Govern. Scale.", visual: "Bold volumetric brand logo reveal.", action: "Heavy sub-bass impact drop." },
];

const TOTAL_DURATION = 100;

export function CinematicRevealPlayer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set([0, 1]));

  const theaterRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const lastTriggeredSceneId = useRef<number | null>(null);

  // Preload adjacent scene images
  useEffect(() => {
    const toLoad = new Set(imagesLoaded);
    for (let i = Math.max(0, currentSceneIndex - 1); i <= Math.min(SCENES.length - 1, currentSceneIndex + 2); i++) {
      toLoad.add(i);
    }
    if (toLoad.size !== imagesLoaded.size) {
      setImagesLoaded(toLoad);
    }
  }, [currentSceneIndex]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setIsPlaying(p => !p); }
      else if (e.code === 'KeyM') { setIsMuted(m => !m); }
      else if (e.code === 'KeyR') { handleRestart(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mute sync
  useEffect(() => {
    if (synthInstance) synthInstance.setMute(isMuted);
  }, [isMuted]);

  // Audio trigger on scene change
  useEffect(() => {
    const activeScene = SCENES[currentSceneIndex];
    if (isPlaying && activeScene && lastTriggeredSceneId.current !== activeScene.id) {
      lastTriggeredSceneId.current = activeScene.id;
      getSynth().then(synth => {
        switch (activeScene.id) {
          case 1: synth.startMusic(); break;
          case 2: synth.triggerChaosGlitch(); break;
          case 3: synth.triggerProductReveal(); break;
          case 5: synth.triggerBlockEffect(); break;
          case 6: synth.triggerHealEffect(); break;
          case 9: synth.triggerLogoSubDrop(); break;
        }
      });
    }
  }, [currentSceneIndex, isPlaying]);

  // Play/pause synth sync
  useEffect(() => {
    if (!isPlaying) {
      if (synthInstance) { synthInstance.stopMusic(); }
      lastTriggeredSceneId.current = null;
    } else {
      getSynth().then(synth => synth.startMusic());
    }
  }, [isPlaying]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (synthInstance) { synthInstance.stopMusic(); }
      lastTriggeredSceneId.current = null;
    };
  }, []);

  // Playback loop
  const animatePlayback = (time: number) => {
    if (previousTimeRef.current !== null) {
      const delta = (time - previousTimeRef.current) / 1000;
      setCurrentTime(prev => {
        const next = prev + delta * playbackSpeed;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          if (synthInstance) synthInstance.stopMusic();
          return TOTAL_DURATION;
        }
        return next;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animatePlayback);
  };

  useEffect(() => {
    if (isPlaying) {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animatePlayback);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null;
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, playbackSpeed]);

  // Scene detection
  useEffect(() => {
    const idx = SCENES.findIndex(s => currentTime >= s.startTime && currentTime < s.startTime + s.duration);
    if (idx !== -1 && idx !== currentSceneIndex) setCurrentSceneIndex(idx);
    else if (currentTime >= TOTAL_DURATION) setCurrentSceneIndex(SCENES.length - 1);
  }, [currentTime, currentSceneIndex]);

  const handlePlayPause = () => {
    if (currentTime >= TOTAL_DURATION) setCurrentTime(0);
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (synthInstance) { synthInstance.stopMusic(); }
    lastTriggeredSceneId.current = null;
    setCurrentTime(0);
    setCurrentSceneIndex(0);
    if (!isPlaying) setIsPlaying(true);
    else { getSynth().then(s => s.startMusic()); }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isPlaying && synthInstance) { synthInstance.stopMusic(); lastTriggeredSceneId.current = null; }
    setCurrentTime(val);
    const idx = SCENES.findIndex(s => val >= s.startTime && val < s.startTime + s.duration);
    if (idx !== -1) setCurrentSceneIndex(idx);
    if (isPlaying) { setTimeout(() => { if (isPlaying && synthInstance) synthInstance.startMusic(); }, 50); }
  };

  const toggleFullscreen = () => {
    if (!theaterRef.current) return;
    if (!document.fullscreenElement) theaterRef.current.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  const activeScene = SCENES[currentSceneIndex];

  return (
    <div className="cinematic-container">
      <div className="cinematic-theater" ref={theaterRef}>
        <div className="cinematic-screen">
          {SCENES.map((scene, idx) => {
            const isActive = idx === currentSceneIndex;
            const shouldLoad = imagesLoaded.has(idx);
            return (
              <div
                key={scene.id}
                className={`cinematic-slide ken-burns-${scene.id} ${isActive ? 'active' : ''} ${scene.id === 2 ? 'scene-chaos' : ''}`}
              >
                {shouldLoad && (
                  <img
                    src={scene.image}
                    alt={scene.title}
                    className="cinematic-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="100%" height="100%" fill="%230b0d12"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%230078d4">${scene.title}</text></svg>`;
                    }}
                  />
                )}
                {scene.id === 2 && <div className="cinematic-glitch-overlay" />}
                <div className="cinematic-light-sweep" />
              </div>
            );
          })}

          <div className="cinematic-overlay">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>
                <Tv size={12} aria-hidden="true" />
                <span>SENTINEL SWARM AI KEYNOTE</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                16:9 // HD
              </div>
            </div>

            <div className="cinematic-subtitles">
              <div className="cinematic-narration">"{activeScene?.narration}"</div>
              <div className="cinematic-subtext">
                {activeScene?.title} — {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </div>
            </div>
          </div>
        </div>

        <div className="scene-timeline-map" role="progressbar" aria-valuenow={currentTime} aria-valuemin={0} aria-valuemax={TOTAL_DURATION}>
          {SCENES.map((scene, idx) => (
            <div
              key={scene.id}
              className={`scene-timeline-segment ${currentTime > scene.startTime ? 'passed' : ''} ${idx === currentSceneIndex ? 'active' : ''}`}
              style={{ width: `${(scene.duration / TOTAL_DURATION) * 100}%` }}
            />
          ))}
        </div>

        <div className="cinematic-controls">
          <div className="cinematic-progress-container">
            <span className="cinematic-time-label">{formatTime(currentTime)}</span>
            <div style={{ position: 'relative', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max={TOTAL_DURATION}
                step="0.05"
                value={currentTime}
                onChange={handleScrub}
                className="cinematic-scrubber"
                aria-label="Playback position"
              />
              <div className="cinematic-progress-fill" style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }} />
            </div>
            <span className="cinematic-time-label">{formatTime(TOTAL_DURATION)}</span>
          </div>

          <div className="cinematic-actions-row">
            <div className="cinematic-btn-group">
              <button className="btn btn-secondary" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} type="button">
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button className="btn btn-secondary" onClick={handleRestart} aria-label="Restart" type="button">
                <RotateCcw size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Unmute' : 'Mute'} type="button">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <span className="cinematic-scene-tag">{activeScene?.title}</span>
            </div>

            <div className="cinematic-btn-group">
              <label className="sr-only" htmlFor="playback-speed">Playback speed</label>
              <select
                id="playback-speed"
                className="glass-select"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem' }}
              >
                <option value="1">1.0x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>
              <button className="btn btn-secondary" onClick={toggleFullscreen} aria-label="Toggle fullscreen" type="button">
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="cinematic-specs-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} className="text-info" aria-hidden="true" />
          <span className="card-title">Audio-Visual Specifications</span>
        </div>
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Style</span>
            <span className="spec-value">Build Keynote + Apple Launch Event</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Audio</span>
            <span className="spec-value">Neoclassical Synth (Web Audio API)</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Visual Quality</span>
            <span className="spec-value">HD Conceptual Stills</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Theme</span>
            <span className="spec-value">Secure OS for Autonomous AI</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderBottom: '1px solid var(--border-subtle)', margin: '4px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="spec-label">Active Scene Details</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.78rem' }}>
            <div className="panel-reasoning-step">
              <strong style={{ color: '#fff' }}>Visual:</strong>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: '3px' }}>{activeScene?.visual}</div>
            </div>
            <div className="panel-reasoning-step" style={{ borderLeftColor: 'var(--accent-warning)' }}>
              <strong style={{ color: '#fff' }}>Narration:</strong>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: '3px' }}>"{activeScene?.narration}"</div>
            </div>
            <div className="panel-reasoning-step" style={{ borderLeftColor: 'var(--accent-success)' }}>
              <strong style={{ color: '#fff' }}>Audio:</strong>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: '3px' }}>{activeScene?.action}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
