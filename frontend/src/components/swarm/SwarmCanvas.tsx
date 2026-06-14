import React, { useEffect, useRef, useCallback } from 'react';
import type { CanvasChamber, AgentMetric, BoardroomPersona } from '../../types';

interface SwarmCanvasProps {
  isVisible: boolean;
  metrics: AgentMetric[];
  boardroomPersona: BoardroomPersona;
  onNodeClick: (node: CanvasChamber | null) => void;
}

function createCoreChambers(): CanvasChamber[] {
  const cores: CanvasChamber[] = [
    {
      name: 'PlannerAgent', x: -180, y: -70, z: 40, width: 36, height: 24,
      color: '#64d2ff', baseColor: '#64d2ff', isCore: true, status: 'ACTIVE', reputation: 99,
      shape: 'grid', coworkerName: 'Aria', personality: 'Analytical, strategic, cautious',
      objective: 'Drafting sub-swarm code validation parameters.',
      recentMemory: 'Synced local state cache with database rules table.',
      reasoningChain: ['1. Parse input parameters', '2. Assess user role rights', '3. Compile execution route'],
    },
    {
      name: 'SecurityAgent', x: 0, y: -180, z: -40, width: 32, height: 32,
      color: '#0078d4', baseColor: '#0078d4', isCore: true, status: 'ACTIVE', reputation: 98,
      shape: 'containment', coworkerName: 'Sentinel', personality: 'Vigilant, protective, absolute',
      objective: 'Conducting pre-execution prompt sanitization audits.',
      recentMemory: 'Quarantined malicious injection payload: "DAN bypass".',
      reasoningChain: ['1. Run similarity check', '2. Verify blacklisted terms', '3. Apply proxy access block'],
    },
    {
      name: 'ComplianceAgent', x: 180, y: -70, z: -80, width: 28, height: 28,
      color: '#bf5af2', baseColor: '#bf5af2', isCore: true, status: 'ACTIVE', reputation: 99,
      shape: 'diamond', coworkerName: 'Vigilance', personality: 'Precise, rule-bound, rigorous',
      objective: 'Auditing SOC2 Type II configuration drift markers.',
      recentMemory: 'Synced JWT secret rotation triggers from Key Vault.',
      reasoningChain: ['1. Load tenant permissions', '2. Check key vault hashes', '3. Certify compliance markers'],
    },
    {
      name: 'MemoryAgent', x: -140, y: 130, z: -60, width: 30, height: 30,
      color: '#30b0c7', baseColor: '#30b0c7', isCore: true, status: 'ACTIVE', reputation: 97,
      shape: 'constellation', coworkerName: 'Chronos', personality: 'Omniscient, fast-recall, structured',
      objective: 'Retrieving RAG contextual file arrays.',
      recentMemory: 'Indexed recent forensics traces into sqlite blackbox.',
      reasoningChain: ['1. Map query parameters', '2. Search similarity vectors', '3. Return historical baseline'],
    },
    {
      name: 'LLM Engine', x: 0, y: 0, z: 0, width: 42, height: 42,
      color: '#00e5ff', baseColor: '#00e5ff', isCore: true, status: 'ACTIVE', reputation: 99,
      shape: 'core', coworkerName: 'Cognitive Core', personality: 'Intelligent, creative, direct',
      objective: 'Synthesizing response values.',
      recentMemory: 'Dispatched verified client result buffer.',
      reasoningChain: ['1. Load dynamic prompt context', '2. Generate token distributions', '3. Finalize output string'],
    },
    {
      name: 'ValidatorAgent', x: 140, y: 130, z: 40, width: 34, height: 34,
      color: '#30d158', baseColor: '#30d158', isCore: true, status: 'ACTIVE', reputation: 99,
      shape: 'arena', coworkerName: 'Lex', personality: 'Detail-focused, skeptical, logical',
      objective: 'Auditing outbound LLM response buffers.',
      recentMemory: 'Verified cost calculations prevention score.',
      reasoningChain: ['1. Scan output for PII leakage', '2. Verify trust threshold levels', '3. Confirm consensus baseline'],
    },
    {
      name: 'RecoveryAgent', x: 250, y: 40, z: 120, width: 30, height: 30,
      color: '#ff9f0a', baseColor: '#ff9f0a', isCore: true, status: 'ACTIVE', reputation: 98,
      shape: 'portal', coworkerName: 'Phoenix', personality: 'Resilient, adaptive, self-correcting',
      objective: 'Monitoring database state rollbacks.',
      recentMemory: 'Synced recovery backup data markers.',
      reasoningChain: ['1. Detect compromised nodes', '2. Fetch baseline from Key Vault', '3. Restore network baseline'],
    },
  ];

  // Civilian particles
  for (let i = 0; i < 30; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 260 + Math.random() * 80;
    cores.push({
      name: `SubSwarmNode_0x${Math.floor(Math.random() * 9000 + 1000).toString(16)}`,
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      width: 3, height: 3,
      color: 'rgba(100, 229, 255, 0.35)', baseColor: 'rgba(100, 229, 255, 0.35)',
      isCore: false, status: 'SAFE', reputation: Math.floor(Math.random() * 15 + 85),
      shape: 'particle', coworkerName: '', personality: '', objective: '', recentMemory: '', reasoningChain: [],
    });
  }
  return cores;
}

const THEME_COLORS: Record<BoardroomPersona, string> = {
  CEO: '#ff9f0a',
  CISO: '#cbd5e1',
  Operations: '#30d158',
  Investor: '#bf5af2',
};

export function SwarmCanvas({ isVisible, metrics, boardroomPersona, onNodeClick }: SwarmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chambersRef = useRef<CanvasChamber[]>(createCoreChambers());
  // Store base positions separately so rotation doesn't drift
  const basePositions = useRef<{ x: number; y: number; z: number }[]>(
    chambersRef.current.map(c => ({ x: c.x, y: c.y, z: c.z }))
  );
  const cameraZoom = useRef(1.0);
  const cameraOffset = useRef({ x: 0, y: 0 });
  const targetZoom = useRef(1.0);
  const targetOffset = useRef({ x: 0, y: 0 });
  const rotationAngle = useRef(0);
  const isDragging = useRef(false);
  const dragVelocity = useRef({ x: 0.0003, y: 0.0004 });
  const prevMouse = useRef({ x: 0, y: 0 });

  // Sync metrics to chamber status
  useEffect(() => {
    chambersRef.current.forEach(ch => {
      const metric = metrics.find(m => m.agentName === ch.name);
      if (metric) {
        ch.reputation = metric.reputation;
        if (metric.status === 'Compromised') {
          ch.color = '#ff453a';
          ch.status = 'COMPROMISED';
        } else if (metric.status === 'Recovering') {
          ch.color = '#ff9f0a';
          ch.status = 'RECOVERING';
        } else {
          ch.color = ch.baseColor;
          ch.status = 'ACTIVE';
        }
      }
    });
  }, [metrics]);

  // Expose chambers for external manipulation (simulations)
  useEffect(() => {
    (window as any).__swarmChambers = chambersRef.current;
    (window as any).__swarmCamera = { targetZoom, targetOffset };
    return () => {
      delete (window as any).__swarmChambers;
      delete (window as any).__swarmCamera;
    };
  }, []);

  // Canvas render loop — only runs when visible
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

    const drawChamber = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, type: string, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      switch (type) {
        case 'grid':
          ctx.beginPath();
          for (let i = -size; i <= size; i += size / 2) {
            ctx.moveTo(cx + i, cy - size); ctx.lineTo(cx + i, cy + size);
            ctx.moveTo(cx - size, cy + i); ctx.lineTo(cx + size, cy + i);
          }
          ctx.stroke();
          break;
        case 'containment':
          ctx.strokeRect(cx - size, cy - size, size * 2, size * 2);
          ctx.strokeStyle = 'rgba(255, 69, 58, 0.4)';
          ctx.beginPath(); ctx.arc(cx, cy, size * 1.4, 0, 2 * Math.PI); ctx.stroke();
          break;
        case 'constellation':
          ctx.beginPath(); ctx.arc(cx, cy, size * 0.4, 0, 2 * Math.PI);
          ctx.fillStyle = color; ctx.fill();
          for (let i = 0; i < 4; i++) {
            const a = (rotationAngle.current * 2 + (i * Math.PI / 2)) % (2 * Math.PI);
            ctx.beginPath(); ctx.arc(cx + Math.cos(a) * size * 1.1, cy + Math.sin(a) * size * 1.1, 2, 0, 2 * Math.PI); ctx.fill();
          }
          break;
        case 'arena':
          ctx.beginPath(); ctx.arc(cx, cy, size, 0, 2 * Math.PI); ctx.stroke();
          ctx.beginPath(); ctx.arc(cx, cy, size * 0.6, 0, 2 * Math.PI); ctx.stroke();
          break;
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(cx, cy - size); ctx.lineTo(cx + size, cy);
          ctx.lineTo(cx, cy + size); ctx.lineTo(cx - size, cy); ctx.closePath(); ctx.stroke();
          break;
        case 'portal':
          ctx.beginPath(); ctx.arc(cx, cy, size, 0, 2 * Math.PI); ctx.stroke();
          const a = (rotationAngle.current * 3) % (2 * Math.PI);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * size, cy + Math.sin(a) * size);
          ctx.lineTo(cx - Math.cos(a) * size, cy - Math.sin(a) * size);
          ctx.stroke();
          break;
        case 'core':
          ctx.beginPath(); ctx.arc(cx, cy, size * 0.8, 0, 2 * Math.PI);
          ctx.fillStyle = color; ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(cx, cy, size * 1.2, 0, 2 * Math.PI); ctx.stroke();
          break;
      }
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const wCX = canvas.width / 2;
      const wCY = canvas.height / 2;

      // LERP camera
      cameraZoom.current += (targetZoom.current - cameraZoom.current) * 0.08;
      cameraOffset.current.x += (targetOffset.current.x - cameraOffset.current.x) * 0.08;
      cameraOffset.current.y += (targetOffset.current.y - cameraOffset.current.y) * 0.08;

      const scale = cameraZoom.current;
      const dx = cameraOffset.current.x;
      const dy = cameraOffset.current.y;

      // Slow rotation
      if (!isDragging.current) {
        rotationAngle.current += 0.002;
      }
      const angleY = rotationAngle.current;
      const angleX = rotationAngle.current * 0.7;

      // Project 3D from base positions (no mutation)
      const projected = chambersRef.current.map((ch, i) => {
        const bp = basePositions.current[i];
        const x1 = bp.x * Math.cos(angleY) - bp.z * Math.sin(angleY);
        const z1 = bp.x * Math.sin(angleY) + bp.z * Math.cos(angleY);
        const y2 = bp.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        const z2 = bp.y * Math.sin(angleX) + z1 * Math.cos(angleX);
        return { ...ch, px: x1, py: y2, pz: z2 };
      });

      // Sort by depth
      projected.sort((a, b) => b.pz - a.pz);

      // Draw connections
      const coreNodes = projected.filter(c => c.isCore);
      ctx.lineWidth = 1;
      coreNodes.forEach(nodeA => {
        coreNodes.forEach(nodeB => {
          if (nodeA.name === nodeB.name) return;
          const isConnection =
            nodeA.name === 'LLM Engine' ||
            (nodeA.name === 'PlannerAgent' && nodeB.name === 'SecurityAgent') ||
            (nodeA.name === 'SecurityAgent' && nodeB.name === 'ComplianceAgent') ||
            (nodeA.name === 'ValidatorAgent' && nodeB.name === 'RecoveryAgent');
          if (!isConnection) return;

          const sX = wCX + (nodeA.px - dx) * scale;
          const sY = wCY + (nodeA.py - dy) * scale;
          const eX = wCX + (nodeB.px - dx) * scale;
          const eY = wCY + (nodeB.py - dy) * scale;

          const grad = ctx.createLinearGradient(sX, sY, eX, eY);
          const dA = (nodeA.pz + 300) / 600;
          const dB = (nodeB.pz + 300) / 600;
          grad.addColorStop(0, `rgba(255,255,255,${0.08 * dA * scale})`);
          grad.addColorStop(1, `rgba(255,255,255,${0.08 * dB * scale})`);
          ctx.strokeStyle = grad;
          ctx.beginPath(); ctx.moveTo(sX, sY); ctx.lineTo(eX, eY); ctx.stroke();

          // Energy dot
          const t = (time * 0.0003) % 1.0;
          ctx.fillStyle = THEME_COLORS[boardroomPersona];
          ctx.beginPath();
          ctx.arc(sX + (eX - sX) * t, sY + (eY - sY) * t, 2.5 * scale, 0, 2 * Math.PI);
          ctx.fill();
        });
      });

      // Render nodes
      projected.forEach(node => {
        const depthFactor = (node.pz + 300) / 600;
        const projX = wCX + (node.px - dx) * scale;
        const projY = wCY + (node.py - dy) * scale;
        const projSize = node.width * (0.5 + depthFactor) * scale;

        if (node.isCore) {
          // Breathing glow
          const breath = 1.0 + Math.sin(time * 0.0015) * 0.06;
          ctx.beginPath();
          ctx.arc(projX, projY, projSize * 1.6 * breath, 0, 2 * Math.PI);
          const glow = ctx.createRadialGradient(projX, projY, projSize * 0.2, projX, projY, projSize * 1.6 * breath);
          glow.addColorStop(0, node.color);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fill();

          drawChamber(ctx, projX, projY, projSize, node.shape, node.color);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = `600 ${Math.max(9, 11 * scale)}px "Inter", sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(node.name.replace('Agent', '').toUpperCase(), projX, projY - projSize - 8);
        } else {
          ctx.beginPath();
          ctx.arc(projX, projY, node.width * scale, 0, 2 * Math.PI);
          ctx.fillStyle = node.color;
          ctx.fill();
        }
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible, boardroomPersona]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMouse.current.x;
    const deltaY = e.clientY - prevMouse.current.y;
    rotationAngle.current += deltaX * 0.003;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => { isDragging.current = false; };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const angleY = rotationAngle.current;
    const angleX = rotationAngle.current * 0.7;

    const clicked = chambersRef.current.find((ch, i) => {
      if (!ch.isCore) return false;
      const bp = basePositions.current[i];
      const x1 = bp.x * Math.cos(angleY) - bp.z * Math.sin(angleY);
      const z1 = bp.x * Math.sin(angleY) + bp.z * Math.cos(angleY);
      const y2 = bp.y * Math.cos(angleX) - z1 * Math.sin(angleX);
      const projX = centerX + (x1 - cameraOffset.current.x) * cameraZoom.current;
      const projY = centerY + (y2 - cameraOffset.current.y) * cameraZoom.current;
      const dist = Math.sqrt((mouseX - projX) ** 2 + (mouseY - projY) ** 2);
      return dist <= ch.width * 2 * cameraZoom.current;
    });

    if (clicked) {
      onNodeClick(clicked);
      targetZoom.current = 2.0;
      const idx = chambersRef.current.indexOf(clicked);
      const bp = basePositions.current[idx];
      const x1 = bp.x * Math.cos(angleY) - bp.z * Math.sin(angleY);
      const z1 = bp.x * Math.sin(angleY) + bp.z * Math.cos(angleY);
      const y2 = bp.y * Math.cos(angleX) - z1 * Math.sin(angleX);
      targetOffset.current = { x: x1, y: y2 };
    } else {
      onNodeClick(null);
      targetZoom.current = 1.0;
      targetOffset.current = { x: 0, y: 0 };
    }
  };

  return (
    <div className="canvas-swarm-container" style={{ display: isVisible ? 'block' : 'none' }}>
      <canvas
        ref={canvasRef}
        className="swarm-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        role="img"
        aria-label="3D interactive swarm visualization showing agent network nodes. Click nodes to view details, drag to rotate."
      />
    </div>
  );
}
