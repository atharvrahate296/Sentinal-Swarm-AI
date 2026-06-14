import React, { useEffect, useRef } from 'react';

interface MemoryCanvasProps {
  isVisible: boolean;
}

interface MemoryStar {
  label: string;
  x: number;
  y: number;
  z: number;
  color: string;
}

const STAR_COLORS = ['#64d2ff', '#bf5af2', '#ff9f0a', '#30d158'];
const LABELS = [
  'db.keys.vault', 'entra.tenant.id', 'jwt.signature.secret', 'mcp.filesystem.write',
  'policy.compliance.soc2', 'reputation.agent.metrics', 'blackbox.forensics.replay',
  'predictive.threat.likelihood', 'consensus.weight', 'outage.breach.saved',
  'subswarm.financial.ops', 'validation.pii.buffer', 'agent.aria.objective',
  'recovery.phoenix.baseline', 'security.sentinel.filters', 'jwt.key.rotations',
];

function createStars(): MemoryStar[] {
  const stars: MemoryStar[] = [];
  for (let i = 0; i < 70; i++) {
    stars.push({
      label: LABELS[i % LABELS.length] + `_0x${i.toString(16)}`,
      x: (Math.random() - 0.5) * 1400,
      y: (Math.random() - 0.5) * 1400,
      z: (Math.random() - 0.5) * 1400,
      color: STAR_COLORS[i % 4],
    });
  }
  return stars;
}

export function MemoryCanvas({ isVisible }: MemoryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<MemoryStar[]>(createStars());
  // Store base z so we can animate without drift
  const baseZ = useRef<number[]>(starsRef.current.map(s => s.z));

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frameId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const speed = time * 0.02;

      starsRef.current.forEach((star, i) => {
        // Use time-based z offset instead of mutation
        const animZ = ((baseZ.current[i] + speed) % 1400) - 700;
        const depth = (animZ + 700) / 1400;
        const scale = 0.4 + depth * 0.6;
        const screenX = centerX + star.x * scale;
        const screenY = centerY + star.y * scale;

        if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, 2 * scale, 0, 2 * Math.PI);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = 0.3 + depth * 0.7;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Labels for closer stars
          if (animZ > 300) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + depth * 0.3})`;
            ctx.font = '8px monospace';
            ctx.fillText(star.label, screenX + 6, screenY + 3);
          }
        }
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible]);

  return (
    <div className="canvas-swarm-container" style={{ display: isVisible ? 'block' : 'none' }}>
      <canvas
        ref={canvasRef}
        className="swarm-canvas"
        role="img"
        aria-label="Memory universe visualization showing data constellation nodes"
      />
    </div>
  );
}
