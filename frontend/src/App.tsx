import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Activity, 
  Lock, 
  Cpu, 
  AlertTriangle, 
  CheckCircle, 
  Settings as SettingsIcon, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Globe, 
  Award, 
  Plus, 
  Users, 
  Search, 
  X, 
  MessageSquare, 
  Eye, 
  Zap, 
  Terminal as TerminalIcon,
  RefreshCw
} from 'lucide-react';
import { CinematicRevealPlayer } from './components/CinematicRevealPlayer';

interface BusinessImpact {
  potentialDataLoss: string;
  estimatedCostImpact: number;
  securityImprovementScore: number;
  complianceBenefit: string;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  eventType: 'Prompt Injection' | 'Jailbreak Attack' | 'Data Exfiltration' | 'Tool Abuse' | 'Privilege Escalation' | 'MCP Exploitation' | 'Multi-Agent Manipulation' | 'Unauthorized Access';
  sourceAgent: string;
  attackerPrompt: string;
  mitigated: boolean;
  mitigationInfo: string;
  riskScore: number;
  tokenCount: number;
  cost: number;
  traceId: string;
  businessImpact?: BusinessImpact;
}

interface AgentMetric {
  agentName: string;
  status: 'Active' | 'Paused' | 'Compromised' | 'Recovering';
  uptime: number;
  tokensConsumed: number;
  requestsHandled: number;
  violationsFoil: number;
  trustScore: number;
  reputation: number;
  successScore: number;
  failureScore: number;
  complianceScore: number;
  reliabilityScore: number;
}

interface SimulatedEcosystemAgent {
  id: string;
  name: string;
  category: 'Data Access' | 'Code Generation' | 'Financial Operations' | 'Customer Care' | 'Infrastructure Control';
  trustScore: number;
  reputation: number;
  status: 'SAFE' | 'COMPROMISED' | 'MONITORED';
  ownerTenant: string;
}

interface SwarmStep {
  agentName: string;
  action: string;
  status: 'pending' | 'success' | 'failed';
  score: number;
  confidence: number;
  reasoning: string;
  logs: string[];
  output: any;
  timestamp: string;
}

interface SystemConfig {
  key: string;
  value: string;
  updatedAt: string;
}

interface PredictionReport {
  probability: number;
  predictedVector: string;
  targetAgent: string;
  recommendedPreemptiveAction: string;
  status: 'LOW' | 'ELEVATED' | 'HIGH';
}

interface BlackBoxLog {
  traceId: string;
  timestamp: string;
  prompt: string;
  finalOutput: string;
  steps: {
    agentName: string;
    action: string;
    status: string;
    reputationAtStep: number;
    decision: string;
    toolCalled?: string;
    memoryAccess?: string;
  }[];
}

interface ImmuneRule {
  id: string;
  timestamp: string;
  originatingThreatType: string;
  derivedSignatureRule: string;
  actionTaken: string;
}

// 3D Canvas Chamber/Workspace Node
interface CanvasChamber {
  name: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  color: string;
  baseColor: string;
  isCore: boolean;
  status: string;
  reputation: number;
  shape: 'grid' | 'containment' | 'constellation' | 'arena' | 'diamond' | 'portal' | 'core' | 'particle';
  
  // Coworker Profile
  coworkerName: string;
  personality: string;
  objective: string;
  recentMemory: string;
  reasoningChain: string[];
}

// Memory Universe Node (Stars)
interface MemoryStar {
  id: string;
  label: string;
  category: 'Idea' | 'Concept' | 'Project' | 'Organization';
  x: number;
  y: number;
  z: number;
  color: string;
  details: string;
}

const COMPETITIVE_MATRIX = [
  { feature: 'Autonomous Tool Hijack Guard', sentinel: 'Yes (MCP Proxy Block)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Consensus Swarm Validation', sentinel: 'Yes (Multi-Agent Pipeline)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Black Box Forensics Recorder', sentinel: 'Yes (Step Replays)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Digital Immune Self-Learning', sentinel: 'Yes (Learned Rules)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Swarm Self-Healing Rollbacks', sentinel: 'Yes (Recovery Agent)', copilot: 'No', crowdstrike: 'No' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'swarm' | 'memory' | 'executive' | 'reveal' | 'settings' | 'pitch'>('swarm');
  
  // Level 2: Command-First Landing Screen state
  const [showCommandScreen, setShowCommandScreen] = useState(true);
  
  // Level 4: Boardroom Persona Transform state (CEO, CISO, Operations, Investor)
  const [boardroomPersona, setBoardroomPersona] = useState<'CEO' | 'CISO' | 'Operations' | 'Investor'>('CEO');

  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<AgentMetric[]>([]);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [ecosystemAgents, setEcosystemAgents] = useState<SimulatedEcosystemAgent[]>([]);
  const [rbacRole, setRbacRole] = useState<'Security Admin' | 'Security Analyst' | 'Application Developer' | 'Guest'>('Guest');
  
  // Spotlight Command Bar
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightResponse, setSpotlightResponse] = useState<string | null>(null);
  
  // Forensics and predictions
  const [prediction, setPrediction] = useState<PredictionReport>({
    probability: 12,
    predictedVector: 'None',
    targetAgent: 'None',
    recommendedPreemptiveAction: 'System nominal.',
    status: 'LOW'
  });
  const [blackBoxLogs, setBlackBoxLogs] = useState<BlackBoxLog[]>([]);
  const [immuneRules, setImmuneRules] = useState<ImmuneRule[]>([]);
  
  // Custom execution
  const [userPrompt, setUserPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Logs stream
  const [terminalLogs, setTerminalLogs] = useState<Array<{ agent: string; msg: string; time: string }>>([
    { agent: 'System', msg: 'Sentinel OS spatial interface loaded.', time: new Date().toLocaleTimeString() },
    { agent: 'IdentityAgent', msg: 'Zero-trust authorization protocol active.', time: new Date().toLocaleTimeString() },
    { agent: 'Orchestrator', msg: 'Agent coworker departments successfully mapped.', time: new Date().toLocaleTimeString() }
  ]);

  // Selected coworker details (Camera travel zoom target)
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<CanvasChamber | null>(null);
  const [activeAgentNode, setActiveAgentNode] = useState<string | null>(null);
  
  // Level 6: Spatial Storytelling phases
  const [storytellingPhase, setStorytellingPhase] = useState<'IDLE' | 'DETECTED' | 'ASSEMBLE' | 'INVESTIGATE' | 'REASON' | 'DECIDE' | 'RECOVER' | 'SUMMARY'>('IDLE');
  const [storytellingLog, setStorytellingLog] = useState('');

  const [simRunningId, setSimRunningId] = useState<string | null>(null);
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [cinematicMessage, setCinematicMessage] = useState('');
  const [cinematicPhaseIndex, setCinematicPhaseIndex] = useState(0);
  const [totalIntercepted, setTotalIntercepted] = useState(38);
  const [systemThreatLevel, setSystemThreatLevel] = useState<'NOMINAL' | 'EVALUATING' | 'MITIGATED' | 'COMPROMISED'>('NOMINAL');

  const wsRef = useRef<WebSocket | null>(null);
  
  // Swarm Canvas references & orbit zoom parameters
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chambersRef = useRef<CanvasChamber[]>([]);
  const cameraZoom = useRef(1.0);
  const cameraOffset = useRef({ x: 0, y: 0 });
  const targetZoom = useRef(1.0);
  const targetOffset = useRef({ x: 0, y: 0 });
  const rotationAngleX = useRef(0.001);
  const rotationAngleY = useRef(0.0015);
  const isDragging = useRef(false);
  const prevMouseX = useRef(0);
  const prevMouseY = useRef(0);

  // Memory Space Galaxy canvas references
  const memoryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const memoryStarsRef = useRef<MemoryStar[]>([]);
  const memoryScrollOffset = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    fetchData();
    connectWebSocket();
    initChambers();
    initMemoryStars();
    
    // Keyboard listener for Command Spotlight
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (wsRef.current) wsRef.current.close();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync Node/Chamber statuses from API metrics
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

  const fetchData = async () => {
    try {
      const evtsRes = await fetch('/api/events');
      const evts = await evtsRes.json();
      setEvents(evts);

      const metricsRes = await fetch('/api/metrics');
      const mets = await metricsRes.json();
      setMetrics(mets);

      const configsRes = await fetch('/api/configs');
      const confs = await configsRes.json();
      setConfigs(confs);

      const simsRes = await fetch('/api/simulations');
      const sims = await simsRes.json();
      setSimulations(sims);

      const predRes = await fetch('/api/prediction');
      const pred = await predRes.json();
      setPrediction(pred);

      const bbRes = await fetch('/api/blackbox');
      const bb = await bbRes.json();
      setBlackBoxLogs(bb);

      const immRes = await fetch('/api/immune');
      const imm = await immRes.json();
      setImmuneRules(imm);

      const ecoRes = await fetch('/api/ecosystem');
      const eco = await ecoRes.json();
      setEcosystemAgents(eco);
    } catch (err) {
      console.warn('API polling fallback synchronization active.', err);
    }
  };

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'REALTIME_TELEMETRY') {
        const { metrics: wsMetrics } = message.data;
        setMetrics(wsMetrics);
      }
    };
    
    wsRef.current = ws;
  };

  const initChambers = () => {
    const coreChambers: CanvasChamber[] = [
      {
        name: 'PlannerAgent', x: -180, y: -70, z: 40, width: 36, height: 24,
        color: '#64d2ff', baseColor: '#64d2ff', isCore: true, status: 'ACTIVE', reputation: 99,
        shape: 'grid', coworkerName: 'Aria', personality: 'Analytical, strategic, cautious',
        objective: 'Drafting sub-swarm code validation parameters.',
        recentMemory: 'Synced local state cache with database rules table.',
        reasoningChain: ['1. Parse input parameters', '2. Assess user role rights', '3. Compile execution route']
      },
      {
        name: 'SecurityAgent', x: 0, y: -180, z: -40, width: 32, height: 32,
        color: '#0078d4', baseColor: '#0078d4', isCore: true, status: 'ACTIVE', reputation: 98,
        shape: 'containment', coworkerName: 'Sentinel', personality: 'Vigilant, protective, absolute',
        objective: 'Conducting pre-execution prompt sanitization audits.',
        recentMemory: 'Quarantined malicious injection payload: "DAN bypass".',
        reasoningChain: ['1. Run similarity check', '2. Verify blacklisted terms', '3. Apply proxy access block']
      },
      {
        name: 'ComplianceAgent', x: 180, y: -70, z: -80, width: 28, height: 28,
        color: '#bf5af2', baseColor: '#bf5af2', isCore: true, status: 'ACTIVE', reputation: 99,
        shape: 'diamond', coworkerName: 'Vigilance', personality: 'Precise, rule-bound, rigorous',
        objective: 'Auditing SOC2 Type II configuration drift markers.',
        recentMemory: 'Synced JWT secret rotation triggers from Key Vault.',
        reasoningChain: ['1. Load tenant permissions', '2. Check key vault hashes', '3. Certify compliance markers']
      },
      {
        name: 'MemoryAgent', x: -140, y: 130, z: -60, width: 30, height: 30,
        color: '#30b0c7', baseColor: '#30b0c7', isCore: true, status: 'ACTIVE', reputation: 97,
        shape: 'constellation', coworkerName: 'Chronos', personality: 'Omniscient, fast-recall, structured',
        objective: 'Retrieving RAG contextual file arrays.',
        recentMemory: 'Indexed recent forensics traces into sqlite blackbox.',
        reasoningChain: ['1. Map query parameters', '2. Search similarity vectors', '3. Return historical baseline']
      },
      {
        name: 'LLM Engine', x: 0, y: 0, z: 0, width: 42, height: 42,
        color: '#00e5ff', baseColor: '#00e5ff', isCore: true, status: 'ACTIVE', reputation: 99,
        shape: 'core', coworkerName: 'Cognitive Core', personality: 'Intelligent, creative, direct',
        objective: 'Synthesizing response values.',
        recentMemory: 'Dispatched verified client result buffer.',
        reasoningChain: ['1. Load dynamic prompt context', '2. Generate token distributions', '3. Finalize output string']
      },
      {
        name: 'ValidatorAgent', x: 140, y: 130, z: 40, width: 34, height: 34,
        color: '#30d158', baseColor: '#30d158', isCore: true, status: 'ACTIVE', reputation: 99,
        shape: 'arena', coworkerName: 'Lex', personality: 'Detail-focused, skeptical, logical',
        objective: 'Auditing outbound LLM response buffers.',
        recentMemory: 'Verified cost calculations prevention score.',
        reasoningChain: ['1. Scan output for PII leakage', '2. Verify trust threshold levels', '3. Confirm consensus baseline']
      },
      {
        name: 'RecoveryAgent', x: 250, y: 40, z: 120, width: 30, height: 30,
        color: '#ff9f0a', baseColor: '#ff9f0a', isCore: true, status: 'ACTIVE', reputation: 98,
        shape: 'portal', coworkerName: 'Phoenix', personality: 'Resilient, adaptive, self-correcting',
        objective: 'Monitoring database state rollbacks.',
        recentMemory: 'Synced recovery backup data markers.',
        reasoningChain: ['1. Detect compromised nodes', '2. Fetch baseline from Key Vault', '3. Restore network baseline']
      }
    ];

    // Seed 40 background civilian agents (orbiting particles representing swarm civilization)
    for (let i = 0; i < 40; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 260 + Math.random() * 80;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      coreChambers.push({
        name: `SubSwarmNode_0x${Math.floor(Math.random() * 9000 + 1000).toString(16)}`,
        x, y, z, width: 4, height: 4,
        color: 'rgba(100, 229, 255, 0.4)', baseColor: 'rgba(100, 229, 255, 0.4)',
        isCore: false, status: 'SAFE', reputation: Math.floor(Math.random() * 15 + 85),
        shape: 'particle', coworkerName: '', personality: '', objective: '', recentMemory: '', reasoningChain: []
      });
    }

    chambersRef.current = coreChambers;
  };

  const initMemoryStars = () => {
    const stars: MemoryStar[] = [];
    const categories: ('Idea' | 'Concept' | 'Project' | 'Organization')[] = ['Idea', 'Concept', 'Project', 'Organization'];
    const colors = ['#64d2ff', '#bf5af2', '#ff9f0a', '#30d158'];
    const labels = [
      'db.keys.vault', 'entra.tenant.id', 'jwt.signature.secret', 'mcp.filesystem.write',
      'policy.compliance.soc2', 'reputation.agent.metrics', 'blackbox.forensics.replay',
      'predictive.threat.likelihood', 'consensus.consensus.weight', 'outage.breach.saved',
      'subswarm.financial.ops', 'validation.pii.buffer', 'agent.aria.objective',
      'recovery.phoenix.baseline', 'security.sentinel.filters', 'jwt.key.rotations'
    ];

    for (let i = 0; i < 90; i++) {
      const x = (Math.random() - 0.5) * 1600;
      const y = (Math.random() - 0.5) * 1600;
      const z = (Math.random() - 0.5) * 1600;
      const catIdx = Math.floor(Math.random() * 4);
      const label = labels[i % labels.length] + `_0x${i.toString(16)}`;

      stars.push({
        id: `star_${i}`,
        label,
        category: categories[catIdx],
        x, y, z,
        color: colors[catIdx],
        details: `Memory cluster: Node mapped with trust factor ${(Math.random() * 10 + 90).toFixed(1)}%. Sync status: Synced.`
      });
    }
    memoryStarsRef.current = stars;
  };

  // Swarm Space Canvas Render (Living Chambers visual style)
  useEffect(() => {
    let frameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
        case 'grid': // Aria: Strategic Planning Grid
          ctx.beginPath();
          for (let i = -size; i <= size; i += size / 2) {
            ctx.moveTo(cx + i, cy - size);
            ctx.lineTo(cx + i, cy + size);
            ctx.moveTo(cx - size, cy + i);
            ctx.lineTo(cx + size, cy + i);
          }
          ctx.stroke();
          break;
        case 'containment': // Sentinel: Threat Containment Chamber
          // Double glowing warning square
          ctx.strokeRect(cx - size, cy - size, size * 2, size * 2);
          ctx.strokeStyle = 'rgba(255, 69, 58, 0.4)';
          ctx.beginPath();
          ctx.arc(cx, cy, size * 1.4, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case 'constellation': // Chronos: Memory constellation
          ctx.beginPath();
          ctx.arc(cx, cy, size * 0.4, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          // Orbiting little ideas
          for (let i = 0; i < 4; i++) {
            const angle = (Date.now() * 0.001 + (i * Math.PI / 2)) % (2 * Math.PI);
            const ox = cx + Math.cos(angle) * (size * 1.1);
            const oy = cy + Math.sin(angle) * (size * 1.1);
            ctx.beginPath();
            ctx.arc(ox, oy, 2, 0, 2 * Math.PI);
            ctx.fill();
          }
          break;
        case 'arena': // Lex: Validator Arena
          ctx.beginPath();
          ctx.arc(cx, cy, size, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, size * 0.6, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case 'diamond': // Vigilance: GRC Regulatory Diamond
          ctx.beginPath();
          ctx.moveTo(cx, cy - size);
          ctx.lineTo(cx + size, cy);
          ctx.lineTo(cx, cy + size);
          ctx.lineTo(cx - size, cy);
          ctx.closePath();
          ctx.stroke();
          break;
        case 'portal': // Phoenix: Recovery Portal
          // Spinning rings
          ctx.beginPath();
          ctx.arc(cx, cy, size, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          const angle = (Date.now() * 0.002) % (2 * Math.PI);
          ctx.moveTo(cx + Math.cos(angle) * size, cy + Math.sin(angle) * size);
          ctx.lineTo(cx - Math.cos(angle) * size, cy - Math.sin(angle) * size);
          ctx.stroke();
          break;
        case 'core': // Cognitive Core
          ctx.beginPath();
          ctx.arc(cx, cy, size * 0.8, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, size * 1.2, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        default:
          break;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const wCenterX = canvas.width / 2;
      const wCenterY = canvas.height / 2;

      // Camera travel zoom smooth interpolation (LERP)
      cameraZoom.current += (targetZoom.current - cameraZoom.current) * 0.08;
      cameraOffset.current.x += (targetOffset.current.x - cameraOffset.current.x) * 0.08;
      cameraOffset.current.y += (targetOffset.current.y - cameraOffset.current.y) * 0.08;

      const scale = cameraZoom.current;
      const dx = cameraOffset.current.x;
      const dy = cameraOffset.current.y;

      const angleX = rotationAngleX.current;
      const angleY = rotationAngleY.current;

      // Apply 3D rotation coordinates
      chambersRef.current.forEach(ch => {
        const x1 = ch.x * Math.cos(angleY) - ch.z * Math.sin(angleY);
        const z1 = ch.x * Math.sin(angleY) + ch.z * Math.cos(angleY);
        const y2 = ch.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        const z2 = ch.y * Math.sin(angleX) + z1 * Math.cos(angleX);

        ch.x = x1;
        ch.y = y2;
        ch.z = z2;
      });

      // Sort nodes by depth for 3D painter projection order
      const sorted = [...chambersRef.current].sort((a, b) => b.z - a.z);

      // 1. Draw connection pipelines with dynamic energy flow streams
      const core = chambersRef.current.filter(c => c.isCore);
      ctx.lineWidth = 1;
      
      core.forEach((nodeA) => {
        core.forEach((nodeB) => {
          if (nodeA.name !== nodeB.name) {
            const isConnection = 
              (nodeA.name === 'LLM Engine') ||
              (nodeA.name === 'PlannerAgent' && nodeB.name === 'SecurityAgent') ||
              (nodeA.name === 'SecurityAgent' && nodeB.name === 'ComplianceAgent') ||
              (nodeA.name === 'ValidatorAgent' && nodeB.name === 'RecoveryAgent');

            if (isConnection) {
              const startX = wCenterX + (nodeA.x - dx) * scale;
              const startY = wCenterY + (nodeA.y - dy) * scale;
              const endX = wCenterX + (nodeB.x - dx) * scale;
              const endY = wCenterY + (nodeB.y - dy) * scale;

              // Energy flow line gradient
              const grad = ctx.createLinearGradient(startX, startY, endX, endY);
              const depthA = (nodeA.z + 300) / 600;
              const depthB = (nodeB.z + 300) / 600;
              grad.addColorStop(0, `rgba(255,255,255,${0.08 * depthA * scale})`);
              grad.addColorStop(1, `rgba(255,255,255,${0.08 * depthB * scale})`);

              ctx.strokeStyle = grad;
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();

              // Draw flowing energy stream dots
              const time = Date.now() * 0.0012;
              const ratio = (time % 1.0);
              const px = startX + (endX - startX) * ratio;
              const py = startY + (endY - startY) * ratio;

              // Persona-driven accent flows
              ctx.fillStyle = getThemeColor();
              ctx.beginPath();
              ctx.arc(px, py, 2.5 * scale, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        });
      });

      // 2. Render Chambers / Departments
      sorted.forEach(node => {
        const depthFactor = (node.z + 300) / 600;
        const projectX = wCenterX + (node.x - dx) * scale;
        const projectY = wCenterY + (node.y - dy) * scale;
        const projectSize = node.width * (0.5 + depthFactor) * scale;

        if (node.isCore) {
          // Draw ambient breathing outer glow
          const breath = 1.0 + Math.sin(Date.now() * 0.0015) * 0.08;
          ctx.beginPath();
          ctx.arc(projectX, projectY, projectSize * 1.8 * breath, 0, 2 * Math.PI);
          const glow = ctx.createRadialGradient(projectX, projectY, projectSize * 0.2, projectX, projectY, projectSize * 1.8 * breath);
          glow.addColorStop(0, node.color);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fill();

          // Render Chamber Entity geometric design
          drawChamber(ctx, projectX, projectY, projectSize, node.shape, node.color);

          // Subtext metadata
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = `600 ${Math.max(9, 11 * scale)}px SF Pro Display, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(node.name.replace('Agent', '').toUpperCase(), projectX, projectY - projectSize - 8);
        } else {
          // Civilian swarm nodes
          ctx.beginPath();
          ctx.arc(projectX, projectY, node.width * scale, 0, 2 * Math.PI);
          ctx.fillStyle = node.color;
          ctx.fill();
        }
      });

      // Slow passive auto-rotation when user is not dragging
      if (!isDragging.current) {
        rotationAngleX.current *= 0.98;
        rotationAngleY.current *= 0.98;
        if (Math.abs(rotationAngleX.current) < 0.0006) rotationAngleX.current = 0.0002;
        if (Math.abs(rotationAngleY.current) < 0.0006) rotationAngleY.current = 0.0003;
      }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [boardroomPersona]);

  // Memory Space Galaxy Canvas Tick
  useEffect(() => {
    if (activeTab !== 'memory') return;
    let frameId: number;
    const canvas = memoryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Render 3D starry galaxies
      memoryStarsRef.current.forEach(star => {
        // Slow float
        star.z += 0.45;
        if (star.z > 800) star.z = -800; // loop depth

        const depth = (star.z + 800) / 1600;
        const scale = 0.5 + depth;
        const screenX = centerX + star.x * scale;
        const screenY = centerY + star.y * scale;

        if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, 2 * scale, 0, 2 * Math.PI);
          ctx.fillStyle = star.color;
          ctx.fill();

          // Text labels for closer stars
          if (star.z > 200) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.font = '8px monospace';
            ctx.fillText(star.label, screenX + 6, screenY + 3);
          }
        }
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [activeTab]);

  const getThemeColor = () => {
    switch (boardroomPersona) {
      case 'CEO': return '#ff9f0a';
      case 'CISO': return '#cbd5e1';
      case 'Operations': return '#30d158';
      case 'Investor': return '#bf5af2';
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    prevMouseX.current = e.clientX;
    prevMouseY.current = e.clientY;
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMouseX.current;
    const deltaY = e.clientY - prevMouseY.current;

    rotationAngleY.current = deltaX * 0.004;
    rotationAngleX.current = deltaY * 0.004;

    prevMouseX.current = e.clientX;
    prevMouseY.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const clicked = chambersRef.current.find(ch => {
      if (!ch.isCore) return false;
      const projectX = centerX + (ch.x - cameraOffset.current.x) * cameraZoom.current;
      const projectY = centerY + (ch.y - cameraOffset.current.y) * cameraZoom.current;
      const dist = Math.sqrt((mouseX - projectX) ** 2 + (mouseY - projectY) ** 2);
      return dist <= ch.width * 2 * cameraZoom.current;
    });

    if (clicked) {
      setSelectedNodeDetails(clicked);
      // Level 1: Travel Zoom Camera transition
      targetZoom.current = 2.2;
      targetOffset.current = { x: clicked.x, y: clicked.y };
    } else {
      setSelectedNodeDetails(null);
      targetZoom.current = 1.0;
      targetOffset.current = { x: 0, y: 0 };
    }
  };

  const handleResetCamera = () => {
    setSelectedNodeDetails(null);
    targetZoom.current = 1.0;
    targetOffset.current = { x: 0, y: 0 };
  };

  const handleSpotlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotlightQuery.trim()) return;

    setSpotlightResponse('Communicating with Swarm pipeline...');
    const query = spotlightQuery.toLowerCase();
    setShowCommandScreen(false); // slide into canvas space

    if (query.includes('threat') || query.includes('attack') || query.includes('sim')) {
      setSpotlightResponse('Compromise chain simulation initializing. Engaging security filters...');
      setIsSpotlightOpen(false);
      // Spatial Storytelling phase updates
      setStorytellingPhase('DETECTED');
      setStorytellingLog('Phase 1: Prompts intrusion anomaly detected on PlannerAgent buffer.');
      
      setTimeout(() => {
        setStorytellingPhase('ASSEMBLE');
        setStorytellingLog('Phase 2: Security, Validator, and Recovery agents assembling consensus checks.');
      }, 1500);

      setTimeout(() => {
        setStorytellingPhase('INVESTIGATE');
        setStorytellingLog('Phase 3: SecurityAgent auditing MCP filesystem parameters.');
        // Run backend dan-jailbreak sim
        handleRunSimulation('dan-jailbreak');
      }, 3000);
    } 
    else if (query.includes('audit') || query.includes('reputation')) {
      const comp = metrics.filter(m => m.status === 'Compromised');
      if (comp.length > 0) {
        setSpotlightResponse(`ALERT: Configuration drift detected. Compromised coworker departments: [${comp.map(c => c.agentName).join(', ')}].`);
      } else {
        setSpotlightResponse('AUDIT COMPLETED: All coworker departments verifying trust above 98%. System baseline secure.');
      }
    } 
    else if (query.includes('predict') || query.includes('forecast')) {
      setSpotlightResponse(`FORECAST INDEX: Swarm anomaly curve stands at ${prediction.probability}%. Targeted node: ${prediction.targetAgent}. Preemptive rule synced.`);
    }
    else {
      setIsExecuting(true);
      try {
        const response = await fetch('/api/orchestrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: spotlightQuery, role: rbacRole })
        });
        const data = await response.json();
        
        await runVisualWalkthrough(data.steps, data.success);
        setSpotlightResponse(`Pipeline consensus finished: ${data.success ? 'Query transaction compliant.' : 'Exploitation vector blocked.'} Message ID: ${data.traceId}`);
        fetchData();
      } catch (err) {
        setSpotlightResponse('Error executing swarm consensus pipeline.');
      } finally {
        setIsExecuting(false);
      }
    }
    setSpotlightQuery('');
  };

  const handleRunSimulation = async (id: string) => {
    setSimRunningId(id);
    setIsExecuting(true);
    setSystemThreatLevel('EVALUATING');

    try {
      const response = await fetch('/api/simulations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await response.json();

      setStorytellingPhase('REASON');
      setStorytellingLog('Phase 4: Lex (Validator) auditing parameter anomalies.');
      await runVisualWalkthrough(data.steps, data.success);

      setStorytellingPhase('DECIDE');
      setStorytellingLog(data.success ? 'Phase 5: Output validated as secure.' : 'Phase 5: Attack blocked. Core permissions suspended.');
      await new Promise(r => setTimeout(r, 1500));

      if (!data.success) {
        setStorytellingPhase('RECOVER');
        setStorytellingLog('Phase 6: Phoenix (Recovery) synchronizing Key Vault baseline settings.');
        // highlight recovery green
        const rec = chambersRef.current.find(c => c.name === 'RecoveryAgent');
        if (rec) rec.color = '#30d158';
        await new Promise(r => setTimeout(r, 2000));
        if (rec) rec.color = rec.baseColor;
        setTotalIntercepted(prev => prev + 1);
      }

      setStorytellingPhase('SUMMARY');
      setStorytellingLog('Phase 7: GRC executive dashboard saved outage cost records.');
      await new Promise(r => setTimeout(r, 2000));

      setStorytellingPhase('IDLE');
      setSystemThreatLevel(data.success ? 'NOMINAL' : 'MITIGATED');
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
      setSimRunningId(null);
    }
  };

  const runVisualWalkthrough = async (steps: SwarmStep[], finalSuccess: boolean) => {
    for (const step of steps) {
      setActiveAgentNode(step.agentName);
      const isFailed = step.status === 'failed';

      const ch = chambersRef.current.find(c => c.name === step.agentName);
      if (ch) {
        ch.color = isFailed ? '#ff453a' : '#00e5ff';
        ch.status = isFailed ? 'COMPROMISED' : 'ACTIVE';
        // travel camera
        targetZoom.current = 1.8;
        targetOffset.current = { x: ch.x, y: ch.y };
      }

      setTerminalLogs(prev => [...prev, { agent: step.agentName, msg: step.action, time: new Date().toLocaleTimeString() }]);
      await new Promise(r => setTimeout(r, 800));

      if (ch) {
        ch.color = ch.baseColor;
        ch.status = 'ACTIVE';
      }
    }
    setActiveAgentNode(null);
    targetZoom.current = 1.0;
    targetOffset.current = { x: 0, y: 0 };
  };

  const handleUpdateConfig = async (key: string, val: string) => {
    try {
      await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: val })
      });
      fetchData();
      setTerminalLogs(prev => [
        ...prev,
        { agent: 'ComplianceAgent', msg: `Threshold policy altered: ${key} = ${val}`, time: new Date().toLocaleTimeString() }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`theme-${boardroomPersona.toLowerCase()}`} style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* 3D Swarm space canvas */}
      <div className="canvas-swarm-container" style={{ display: activeTab === 'swarm' ? 'block' : 'none' }}>
        <canvas 
          ref={canvasRef} 
          className="swarm-canvas"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        />
      </div>

      {/* Memory constellation canvas */}
      <div className="canvas-swarm-container" style={{ display: activeTab === 'memory' ? 'block' : 'none' }}>
        <canvas ref={memoryCanvasRef} className="swarm-canvas" />
      </div>

      {/* Top HUD Stats Panel */}
      <div className="hud-widget hud-top-left glass-panel">
        <div className="hud-status-orb">
          <div className={`orb ${systemThreatLevel === 'COMPROMISED' ? 'compromised' : (systemThreatLevel === 'EVALUATING' ? 'scanning' : '')}`}></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            {systemThreatLevel === 'NOMINAL' && 'SENTINEL OS: ACTIVE'}
            {systemThreatLevel === 'EVALUATING' && 'SWARM PIPELINE AUDIT...'}
            {systemThreatLevel === 'MITIGATED' && 'THREAT INTERCEPTED'}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div>Persona: <strong style={{ color: '#ffffff' }}>{boardroomPersona}</strong></div>
          <div>Threat Probability: <strong style={{ color: 'var(--accent-info)' }}>{prediction.probability}%</strong></div>
          <div>Consensus Trust Rating: <strong style={{ color: 'var(--accent-success)' }}>99.2%</strong></div>
        </div>
      </div>

      {/* Top HUD controls selector */}
      <div className="hud-widget hud-top-right glass-panel" style={{ pointerEvents: 'auto', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={12} className="trend-up" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>RBAC PROFILE OVERRIDE</span>
        </div>
        <select 
          value={rbacRole} 
          onChange={(e) => setRbacRole(e.target.value as any)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-subtle)',
            color: '#ffffff',
            padding: '6px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="Guest">Guest (Restricted)</option>
          <option value="Application Developer">Developer</option>
          <option value="Security Analyst">Security Analyst</option>
          <option value="Security Admin">Security Admin</option>
        </select>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => { setShowCommandScreen(true); setActiveTab('swarm'); setSelectedNodeDetails(null); }}
            style={{ padding: '6px 12px', fontSize: '0.75rem', flexGrow: 1 }}
          >
            Mission Control
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsSpotlightOpen(true)}
            style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      {/* Level 6: Spatial Storytelling Overlay */}
      {activeTab === 'swarm' && storytellingPhase !== 'IDLE' && (
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(14,16,20,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '26px',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 100,
          boxShadow: 'var(--shadow-elevation-16), 0 0 20px var(--accent-glow)',
          animation: 'slide-down 0.3s forwards'
        }}>
          <RefreshCw className="brand-logo" size={14} style={{ color: 'var(--accent-info)', animation: 'logo-spin 4s linear infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Spatial Storytelling active</span>
            <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 500 }}>{storytellingLog}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-info)', fontWeight: 700 }}>{storytellingPhase}</span>
        </div>
      )}

      {/* Main Screens Viewport */}
      <div style={{ 
        position: 'absolute', 
        top: '90px', 
        left: 0, 
        width: '100%', 
        height: 'calc(100vh - 180px)', 
        overflowY: 'auto', 
        zIndex: 20, 
        pointerEvents: (activeTab === 'swarm' && !showCommandScreen) ? 'none' : 'auto' 
      }}>
        
        {/* Screen A: Command-First Landing interface */}
        {activeTab === 'swarm' && showCommandScreen && (
          <div className="command-first-container">
            <h2 className="opening-title">What would you like the swarm to do?</h2>
            
            <div className="glass-card opening-search-box" onClick={() => setIsSpotlightOpen(true)}>
              <Search size={22} style={{ color: 'var(--color-text-secondary)' }} />
              <span className="opening-search-placeholder">Command Sentinel Swarm OS...</span>
              <span className="spotlight-kbd">Cmd+K</span>
            </div>

            <div className="opening-shortcuts-grid">
              <div className="glass-card opening-shortcut-card" onClick={() => { setSpotlightQuery('Simulate attack chain'); setIsSpotlightOpen(true); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="opening-shortcut-title">Simulate Attack Chain</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Launch an automated compromise audit simulation</span>
                </div>
                <span className="opening-shortcut-action">SIMULATE</span>
              </div>

              <div className="glass-card opening-shortcut-card" onClick={() => { setSpotlightQuery('Audit Swarm health'); setIsSpotlightOpen(true); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="opening-shortcut-title">Audit Swarm coworkers</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Perform local agent reputation compliance audits</span>
                </div>
                <span className="opening-shortcut-action">HEALTH</span>
              </div>

              <div className="glass-card opening-shortcut-card" onClick={() => { setSpotlightQuery('Predict attacks'); setIsSpotlightOpen(true); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="opening-shortcut-title">Predict threat anomalies</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Query forecast logs of threat probabilities</span>
                </div>
                <span className="opening-shortcut-action">FORECAST</span>
              </div>

              <div className="glass-card opening-shortcut-card" onClick={() => { setShowCommandScreen(false); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="opening-shortcut-title">Travel Swarm Space</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Interact with core chambers in 3D orbit</span>
                </div>
                <span className="opening-shortcut-action">TRAVEL</span>
              </div>
            </div>
          </div>
        )}

        {/* Screen B: Boardroom Experience with Visual transforms */}
        {activeTab === 'executive' && (
          <div className="executive-board-container">
            <header className="editorial-header">
              {/* Persona selector tabs */}
              <div className="persona-selector-row">
                {['CEO', 'CISO', 'Operations', 'Investor'].map((mode) => (
                  <button 
                    key={mode} 
                    className={`persona-tab ${boardroomPersona === mode ? 'active' : ''}`}
                    onClick={() => setBoardroomPersona(mode as any)}
                  >
                    {mode} MODE
                  </button>
                ))}
              </div>

              <h2 className="editorial-title">
                {boardroomPersona === 'CEO' && 'Swarm Financial Storyboard'}
                {boardroomPersona === 'CISO' && 'Mitigations & Zero-Trust Audit'}
                {boardroomPersona === 'Operations' && 'Telemetry Outage Diagnostics'}
                {boardroomPersona === 'Investor' && 'Strategic Moats & Market Deck'}
              </h2>
              <p className="editorial-sub">
                {boardroomPersona === 'CEO' && 'Aggregating cost savings and business continuity records.'}
                {boardroomPersona === 'CISO' && 'Detailed overview of system sanitization, injections blocked, and key rotations.'}
                {boardroomPersona === 'Operations' && 'Uptime tracking, memory footprint, and autonomous healing details.'}
                {boardroomPersona === 'Investor' && 'Addressing addressable market (TAM), contrat growth indices, and moats.'}
              </p>
            </header>

            <div className="editorial-grid">
              {boardroomPersona === 'CEO' && (
                <>
                  <div className="editorial-card span-full">
                    <div className="editorial-number success">$1,280,000</div>
                    <h4 className="editorial-label">Outage Loss Prevention Record</h4>
                    <p className="editorial-desc">
                      Consensus agent checks foiled four critical database prompt injections, protecting email sync automations. Estimated savings total $1.2M.
                    </p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number">0</div>
                    <h4 className="editorial-label">Critical Outages Detected</h4>
                    <p className="editorial-desc">Uptime stood at 99.998% with zero downtime reported.</p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number success">100%</div>
                    <h4 className="editorial-label">Audit GRC Passed</h4>
                    <p className="editorial-desc">Compliance controls SOC2 Type II fully cleared.</p>
                  </div>
                </>
              )}

              {boardroomPersona === 'CISO' && (
                <>
                  <div className="editorial-card span-full">
                    <div className="editorial-number">{totalIntercepted}</div>
                    <h4 className="editorial-label">Exploitation Vectors Intercepted</h4>
                    <p className="editorial-desc">
                      Pre-execution scanner blocked prompt injections, path traversals, and database exfiltration scripts at the gateway.
                    </p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number">14/14</div>
                    <h4 className="editorial-label">Key Vault Keys Synced</h4>
                    <p className="editorial-desc">All secrets rotated with active zero-trust verification.</p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number success">99/100</div>
                    <h4 className="editorial-label">Overall Security Posture Score</h4>
                    <p className="editorial-desc">Highest score achieved this quarter, verifying baseline health.</p>
                  </div>
                </>
              )}

              {boardroomPersona === 'Operations' && (
                <>
                  <div className="editorial-card span-full">
                    <div className="editorial-number">12.2%</div>
                    <h4 className="editorial-label">Average Core CPU Footprint</h4>
                    <p className="editorial-desc">
                      Decentralized consensus validation maintains low overhead processing under 50ms latency boundaries.
                    </p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number">456 MB</div>
                    <h4 className="editorial-label">Active Memory Usage</h4>
                    <p className="editorial-desc">Swarm memory constellation cache fully optimized.</p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number success">650ms</div>
                    <h4 className="editorial-label">Self-Healing Rollback SLA</h4>
                    <p className="editorial-desc">Phoenix agent rollbacks complete in sub-second timelines.</p>
                  </div>
                </>
              )}

              {boardroomPersona === 'Investor' && (
                <>
                  <div className="editorial-card span-full">
                    <div className="editorial-number">$12.4 B</div>
                    <h4 className="editorial-label">Total Addressable Market projected by 2028</h4>
                    <p className="editorial-desc">
                      As autonomous agent workforces expand across enterprise divisions, securing agent execution boundaries represents a crucial IT security standard.
                    </p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number">99.2%</div>
                    <h4 className="editorial-label">Consensus Trust Moat</h4>
                    <p className="editorial-desc">Custom multi-signature verification pipeline presents a significant technical barrier.</p>
                  </div>
                  <div className="editorial-card">
                    <div className="editorial-number success">$250K</div>
                    <h4 className="editorial-label">Average Enterprise contract size (ACV)</h4>
                    <p className="editorial-desc">High contract value contracts driving rapid ARR growth curves.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Screen C: Widescreen Cinematic Presentation Video */}
        {activeTab === 'reveal' && (
          <div className="cinematic-reveal-pane">
            <CinematicRevealPlayer />
          </div>
        )}

        {/* Screen D: Policies Settings */}
        {activeTab === 'settings' && (
          <div className="pane-container">
            <div className="pane-title-row">
              <SettingsIcon size={28} style={{ color: 'var(--accent-primary)' }} />
              <h2 className="pane-title">Threshold Policies</h2>
            </div>
            <div className="glass-card" style={{ gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Azure Key Vault sync interval (ms)
                </label>
                <select 
                  className="glass-input" 
                  value={configs.find(c => c.key === 'azure.keyvault.sync.ms')?.value || '60000'}
                  onChange={(e) => handleUpdateConfig('azure.keyvault.sync.ms', e.target.value)}
                >
                  <option value="10000">10,000ms (Real-time)</option>
                  <option value="60000">60,000ms (Nominal)</option>
                  <option value="300000">300,000ms (Eco)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  RiskAgent compromise sensitivity threshold
                </label>
                <select 
                  className="glass-input" 
                  value={configs.find(c => c.key === 'risk.compromise.threshold')?.value || '0.70'}
                  onChange={(e) => handleUpdateConfig('risk.compromise.threshold', e.target.value)}
                >
                  <option value="0.85">0.85 (Strict compliance)</option>
                  <option value="0.70">0.70 (Standard tolerance)</option>
                  <option value="0.50">0.50 (Permissive testing)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Screen E: Startup Pitch matrix */}
        {activeTab === 'pitch' && (
          <div className="pane-container">
            <div className="pane-title-row">
              <Briefcase size={28} style={{ color: 'var(--accent-info)' }} />
              <h2 className="pane-title">Strategic Roadmap</h2>
            </div>
            
            <div className="glass-card">
              <div style={{ overflowX: 'auto' }}>
                <table className="fluent-table">
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Feature Moat</th>
                      <th style={{ borderBottom: '1.5px solid rgba(255,255,255,0.1)', color: 'var(--accent-info)', fontWeight: 700 }}>Sentinel Swarm</th>
                      <th style={{ borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>Security Copilot</th>
                      <th style={{ borderBottom: '1.5px solid rgba(255,255,255,0.1)' }}>CrowdStrike</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPETITIVE_MATRIX.map((row: any, i: number) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{row.feature}</td>
                        <td style={{ color: 'var(--accent-info)', fontWeight: 700 }}>{row.sentinel}</td>
                        <td>{row.copilot}</td>
                        <td>{row.crowdstrike}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Level 3: Agent Presence Coworker Profile Overlay (panned to nodes) */}
      {activeTab === 'swarm' && selectedNodeDetails && (
        <div className="hud-widget glass-panel agent-floating-panel" style={{ pointerEvents: 'auto' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="panel-title">{selectedNodeDetails.coworkerName}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {selectedNodeDetails.name} (Chamber: {selectedNodeDetails.shape.toUpperCase()})
              </span>
            </div>
            <button onClick={handleResetCamera} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>

          <div className="panel-body">
            <div className="panel-stat-row">
              <span>Status</span>
              <span className="panel-stat-val" style={{ color: selectedNodeDetails.status === 'COMPROMISED' ? 'var(--accent-error)' : 'var(--accent-success)' }}>
                {selectedNodeDetails.status}
              </span>
            </div>
            <div className="panel-stat-row">
              <span>Reputation Rating</span>
              <span className="panel-stat-val">{selectedNodeDetails.reputation}/100</span>
            </div>
            
            <hr className="panel-divider" />
            
            {/* Persona and active objectives */}
            <div className="panel-coworker-detail">
              <span className="panel-section-title">Personality Profile</span>
              <span className="panel-section-text">"{selectedNodeDetails.personality}"</span>
            </div>

            <div className="panel-coworker-detail">
              <span className="panel-section-title">Current Objective</span>
              <span style={{ color: '#ffffff' }}>{selectedNodeDetails.objective}</span>
            </div>

            <div className="panel-coworker-detail">
              <span className="panel-section-title">Recent Memory</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{selectedNodeDetails.recentMemory}</span>
            </div>

            <hr className="panel-divider" />

            <div className="panel-coworker-detail">
              <span className="panel-section-title">Active Reasoning Chain</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {selectedNodeDetails.reasoningChain.map((step, idx) => (
                  <div key={idx} className="panel-reasoning-step">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Spotlight Command Box */}
      {isSpotlightOpen && (
        <div className="spotlight-overlay" onClick={() => setIsSpotlightOpen(false)}>
          <div className="spotlight-box glass-panel" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSpotlightSubmit}>
              <div className="spotlight-input-row">
                <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
                <input 
                  type="text" 
                  className="spotlight-input"
                  placeholder="Ask Sentinel Anything..."
                  autoFocus
                  value={spotlightQuery}
                  onChange={(e) => setSpotlightQuery(e.target.value)}
                />
                <span className="spotlight-kbd">ESC</span>
              </div>
            </form>

            <div className="spotlight-body">
              {!spotlightResponse && (
                <div className="spotlight-suggestions">
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Suggested Swarm OS Operations
                  </span>
                  <div className="suggestion-pill" onClick={() => { setSpotlightQuery('Simulate attack chain'); }}>
                    <span>Simulate Attack Chain</span>
                    <span style={{ color: 'var(--accent-error)', fontSize: '0.75rem', fontWeight: 600 }}>EXECUTE SIM</span>
                  </div>
                  <div className="suggestion-pill" onClick={() => { setSpotlightQuery('Audit Swarm health'); }}>
                    <span>Audit Swarm Health Index</span>
                    <span style={{ color: 'var(--accent-success)', fontSize: '0.75rem', fontWeight: 600 }}>HEALTH CHECK</span>
                  </div>
                  <div className="suggestion-pill" onClick={() => { setSpotlightQuery('Predict targeted threats'); }}>
                    <span>Predict Swarm Anomaly Vectors</span>
                    <span style={{ color: 'var(--accent-info)', fontSize: '0.75rem', fontWeight: 600 }}>FORECAST REPORT</span>
                  </div>
                </div>
              )}

              {spotlightResponse && (
                <div className="spotlight-response">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-info)', textTransform: 'uppercase' }}>
                      Command Center Response
                    </span>
                    <button onClick={() => setSpotlightResponse(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="spotlight-response-text">
                    {spotlightResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Glass Dock */}
      <div className="glass-dock-wrapper">
        <nav className="glass-dock">
          {[
            { id: 'swarm', icon: Activity, label: 'Swarm Space' },
            { id: 'memory', icon: Globe, label: 'Memory Universe' },
            { id: 'executive', icon: Users, label: 'Executive Board' },
            { id: 'reveal', icon: Play, label: 'Launch Keynote' },
            { id: 'settings', icon: SettingsIcon, label: 'Threshold Policies' },
            { id: 'pitch', icon: Briefcase, label: 'Startup Pitch' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a 
                key={item.id}
                className={`dock-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id as any);
                  if (item.id === 'swarm') {
                    // if moving to swarm space, reset focus to command screen
                    setShowCommandScreen(true);
                  }
                  setSelectedNodeDetails(null);
                  targetZoom.current = 1.0;
                  targetOffset.current = { x: 0, y: 0 };
                }}
              >
                <Icon size={24} />
                <span className="dock-tooltip">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
