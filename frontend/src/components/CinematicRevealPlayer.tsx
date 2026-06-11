import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Activity, 
  Tv, 
  Sparkles, 
  Compass, 
  Layout, 
  Monitor, 
  ShieldAlert 
} from 'lucide-react';
import { VideoSynth } from '../video_synth';

// Initialize the VideoSynth singleton
const synth = new VideoSynth();

interface Scene {
  id: number;
  title: string;
  duration: number; // in seconds
  startTime: number; // in seconds
  image: string;
  narration: string;
  visual: string;
  action: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: "The AI Swarm Age",
    duration: 10,
    startTime: 0,
    image: "/assets/scenes/scene1.png",
    narration: "AI agents are becoming the workforce of the future.",
    visual: "Dark global map grid, thousands of autonomous AI agent nodes pulsing with active workflow metrics.",
    action: "Neoclassical ambient tech score initializes. Soft heartbeat pulses engage."
  },
  {
    id: 2,
    title: "System Anomaly & Chaos",
    duration: 12,
    startTime: 10,
    image: "/assets/scenes/scene2.png",
    narration: "But every intelligent system creates new risks.",
    visual: "Glitch transition, red threat vectors injecting databases, prompt injections and security alerts cascading.",
    action: "Warning digital alarm triggers. Chaos static noise sweep sweeps the soundscape."
  },
  {
    id: 3,
    title: "Sentinel Swarm AI Reveal",
    duration: 13,
    startTime: 22,
    image: "/assets/scenes/scene3.png",
    narration: "Introducing Sentinel Swarm AI.",
    visual: "Volumetric blue light sweeps away the crimson alerts, revealing the full Sentinel Swarm AI Command Center dashboard in 3D grid perspective.",
    action: "Orchestral technology riser peaks, resolving into a majestic product reveal chime."
  },
  {
    id: 4,
    title: "The Agent Swarm Architecture",
    duration: 13,
    startTime: 35,
    image: "/assets/scenes/scene4.png",
    narration: "A self-governing swarm of intelligent security agents.",
    visual: "Orchestration graph: User -> Planner -> Security -> Memory -> Validator -> Compliance -> Recovery. Data flows, rotating trust scores.",
    action: "Rhythmic digital ticking, ascending synth chimes sync to data flow transits."
  },
  {
    id: 5,
    title: "Live Attack Lab Isolation",
    duration: 14,
    startTime: 48,
    image: "/assets/scenes/scene5.png",
    narration: "Threats detected. Analyzed. Neutralized.",
    visual: "Intrusion isolation simulation. Red prompt injection tries to penetrate, but is blocked by a glowing blue forcefield ring.",
    action: "Metallic forcefield clank triggers, alarm silenced."
  },
  {
    id: 6,
    title: "Swarm Self-Healing",
    duration: 10,
    startTime: 62,
    image: "/assets/scenes/scene6.png",
    narration: "Resilient by design. Self-healing by default.",
    visual: "Recovery agent lasers scrub the infected validator node back to healthy green. Memory cache syncs from key vault.",
    action: "Energy beam pulse sweeps, resolving to a high success chime."
  },
  {
    id: 7,
    title: "C-Level Executive GRC Dashboard",
    duration: 10,
    startTime: 72,
    image: "/assets/scenes/scene7.png",
    narration: "From technical defense to executive confidence.",
    visual: "Sleek GRC overview, financial loss prevented ($530,000), compliance score 99/100, SOC2 audit cleared.",
    action: "Smooth swipe transition sound, bright brass chords."
  },
  {
    id: 8,
    title: "2030 Secure Swarm Vision",
    duration: 8,
    startTime: 82,
    image: "/assets/scenes/scene8.png",
    narration: "The operating system for the age of autonomous intelligence.",
    visual: "Thousands of agents collaborating globally in a secure lattice. Real-time trust graph, zero-trust active.",
    action: "Majestic string swell peaks, transition to logo riser."
  },
  {
    id: 9,
    title: "Outro: Logo Reveal",
    duration: 10,
    startTime: 90,
    image: "/assets/scenes/scene9.png",
    narration: "SENTINEL SWARM AI: Secure. Govern. Scale. The Future of Autonomous AI Security.",
    visual: "Fade to dark. Bold volumetric brand logo reveal of SENTINEL SWARM AI. Taglines fade in under.",
    action: "Heavy sub-bass impact drop, cybernetic chime chime, tech echo tail."
  }
];

const TOTAL_DURATION = 100; // Total video length in seconds

export function CinematicRevealPlayer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const theaterRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const lastTriggeredSceneId = useRef<number | null>(null);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === 'KeyM') {
        setIsMuted(m => !m);
      } else if (e.code === 'KeyR') {
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update mute status in the synth singleton
  useEffect(() => {
    synth.setMute(isMuted);
  }, [isMuted]);

  // Audio trigger effect based on current scene transition
  useEffect(() => {
    const activeScene = SCENES[currentSceneIndex];
    if (isPlaying && activeScene && lastTriggeredSceneId.current !== activeScene.id) {
      lastTriggeredSceneId.current = activeScene.id;
      
      // Trigger sound effects for corresponding scenes
      switch (activeScene.id) {
        case 1:
          synth.startMusic();
          break;
        case 2:
          synth.triggerChaosGlitch();
          break;
        case 3:
          synth.triggerProductReveal();
          break;
        case 5:
          synth.triggerBlockEffect();
          break;
        case 6:
          synth.triggerHealEffect();
          break;
        case 9:
          synth.triggerLogoSubDrop();
          break;
        default:
          break;
      }
    }
  }, [currentSceneIndex, isPlaying]);

  // Stop sound design when paused or finished
  useEffect(() => {
    if (!isPlaying) {
      synth.stopMusic();
      lastTriggeredSceneId.current = null;
    } else {
      synth.startMusic();
    }
  }, [isPlaying]);

  // Clean up synthesizer on component unmount
  useEffect(() => {
    return () => {
      synth.stopMusic();
      lastTriggeredSceneId.current = null;
    };
  }, []);

  // Main animation frame playback tick loop
  const animatePlayback = (time: number) => {
    if (previousTimeRef.current !== null) {
      const delta = (time - previousTimeRef.current) / 1000; // convert to seconds
      setCurrentTime(prev => {
        const next = prev + delta * playbackSpeed;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          synth.stopMusic();
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
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = null;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Detect and update current scene based on currentTime
  useEffect(() => {
    const sceneIdx = SCENES.findIndex(
      (scene) => currentTime >= scene.startTime && currentTime < (scene.startTime + scene.duration)
    );
    if (sceneIdx !== -1 && sceneIdx !== currentSceneIndex) {
      setCurrentSceneIndex(sceneIdx);
    } else if (currentTime === TOTAL_DURATION) {
      setCurrentSceneIndex(SCENES.length - 1);
    }
  }, [currentTime, currentSceneIndex]);

  const handlePlayPause = () => {
    if (currentTime >= TOTAL_DURATION) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    synth.stopMusic();
    lastTriggeredSceneId.current = null;
    setCurrentTime(0);
    setCurrentSceneIndex(0);
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      synth.startMusic();
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetVal = parseFloat(e.target.value);
    
    // Stop music during drag so synthesizer resets properly
    if (isPlaying) {
      synth.stopMusic();
      lastTriggeredSceneId.current = null;
    }
    
    setCurrentTime(targetVal);
    
    // Recalculate scene immediately on scrubber drag
    const sceneIdx = SCENES.findIndex(
      (scene) => targetVal >= scene.startTime && targetVal < (scene.startTime + scene.duration)
    );
    if (sceneIdx !== -1) {
      setCurrentSceneIndex(sceneIdx);
    }

    if (isPlaying) {
      // Small timeout to allow state to settle before restarting synth loop
      setTimeout(() => {
        if (isPlaying) synth.startMusic();
      }, 50);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaybackSpeed(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!theaterRef.current) return;
    if (!document.fullscreenElement) {
      theaterRef.current.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen mode: ", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeScene = SCENES[currentSceneIndex];

  return (
    <div className="cinematic-container">
      {/* 16:9 Theater Player Box */}
      <div className="cinematic-theater" ref={theaterRef}>
        <div className="cinematic-screen">
          {SCENES.map((scene, idx) => {
            const isActive = idx === currentSceneIndex;
            const isChaos = scene.id === 2;
            return (
              <div 
                key={scene.id} 
                className={`cinematic-slide ken-burns-${scene.id} ${isActive ? 'active' : ''} ${isChaos ? 'scene-chaos' : ''}`}
              >
                {/* Widescreen Image Stills */}
                <img 
                  src={scene.image} 
                  alt={scene.title} 
                  className="cinematic-img" 
                  onError={(e) => {
                    // Fallback to stylized loading box if assets fail
                    (e.target as any).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="100%" height="100%" fill="%230b0d12"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%230078d4">SENTINEL SWARM AI - SCENE STILL</text></svg>';
                  }}
                />

                {/* Glitch Overlay (Scene 2 specific) */}
                {isChaos && <div className="cinematic-glitch-overlay"></div>}

                {/* Lighting Sweep */}
                <div className="cinematic-light-sweep"></div>
              </div>
            );
          })}

          {/* Letterbox & Vignette Overlay */}
          <div className="cinematic-overlay">
            {/* Top header details (only in fullscreen or overlay) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600 }}>
                <Tv size={14} className="trend-up" />
                <span>SENTINEL SWARM AI KEYNOTE PRESENTATION</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                4K UHD // 16:9 // COMPLIANT
              </div>
            </div>

            {/* Apple/Build Style Bottom Captions */}
            <div className="cinematic-subtitles">
              <div className="cinematic-narration">
                "{activeScene?.narration}"
              </div>
              <div className="cinematic-subtext">
                {activeScene?.title} — {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </div>
            </div>
          </div>
        </div>

        {/* Video Scrubber Tracker segments */}
        <div className="scene-timeline-map">
          {SCENES.map((scene, idx) => {
            const passed = currentTime > scene.startTime;
            const active = idx === currentSceneIndex;
            const segmentWidth = `${(scene.duration / TOTAL_DURATION) * 100}%`;
            return (
              <div 
                key={scene.id}
                className={`scene-timeline-segment ${passed ? 'passed' : ''} ${active ? 'active' : ''}`}
                style={{ width: segmentWidth }}
              />
            );
          })}
        </div>

        {/* Controller Bar */}
        <div className="cinematic-controls acrylic">
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
              />
              <div 
                className="cinematic-progress-fill" 
                style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
              />
            </div>
            <span className="cinematic-time-label">{formatTime(TOTAL_DURATION)}</span>
          </div>

          <div className="cinematic-actions-row">
            <div className="cinematic-btn-group">
              <button className="btn btn-secondary" onClick={handlePlayPause} style={{ padding: '8px 14px' }}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button className="btn btn-secondary" onClick={handleRestart} style={{ padding: '8px 14px' }}>
                <RotateCcw size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => setIsMuted(!isMuted)} style={{ padding: '8px 14px' }}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              
              <span className="cinematic-scene-tag">
                {activeScene?.title}
              </span>
            </div>

            <div className="cinematic-btn-group">
              {/* Playback speed selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>SPEED:</span>
                <select 
                  value={playbackSpeed} 
                  onChange={handleSpeedChange}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1">1.0x (Nominal)</option>
                  <option value="1.5">1.5x (Accelerated)</option>
                  <option value="2">2.0x (Fast)</option>
                </select>
              </div>

              <button className="btn btn-secondary" onClick={toggleFullscreen} style={{ padding: '8px 14px' }}>
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Technical Blueprint panel */}
      <div className="dashboard-card acrylic cinematic-specs-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} className="trend-up" />
          <span className="card-title" style={{ color: '#ffffff' }}>Cinematic Reveal Audio-Visual Specifications</span>
        </div>
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Style Directive</span>
            <span className="spec-value">Microsoft Build Keynote + Apple Launch Event</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Synthesized Audio Soundtrack</span>
            <span className="spec-value">Neoclassical Technology Synth (Web Audio API)</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Visual Quality</span>
            <span className="spec-value">4K Ultra HD Conceptual Stills</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Active Core Theme</span>
            <span className="spec-value">Secure Operating System for Autonomous AI</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderBottom: '1px solid var(--border-subtle)', margin: '4px 0' }} />

        {/* Scene logs detail panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Active Scene Stage Directions & Synthesis Log
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 2fr', gap: '12px', fontSize: '0.8rem' }}>
            <div style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '8px' }}>
              <strong style={{ color: '#ffffff' }}>Visual Stage:</strong>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>{activeScene?.visual}</div>
            </div>
            <div style={{ borderLeft: '2px solid var(--accent-warning)', paddingLeft: '8px' }}>
              <strong style={{ color: '#ffffff' }}>Speech Narration:</strong>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>"{activeScene?.narration}"</div>
            </div>
            <div style={{ borderLeft: '2px solid var(--accent-success)', paddingLeft: '8px' }}>
              <strong style={{ color: '#ffffff' }}>Audio Synthesis Event:</strong>
              <div style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>{activeScene?.action}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
