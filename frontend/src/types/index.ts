// Shared TypeScript interfaces for Sentinel Swarm AI

export interface BusinessImpact {
  potentialDataLoss: string;
  estimatedCostImpact: number;
  securityImprovementScore: number;
  complianceBenefit: string;
}

export interface SecurityEvent {
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

export interface AgentMetric {
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

export interface SimulatedEcosystemAgent {
  id: string;
  name: string;
  category: 'Data Access' | 'Code Generation' | 'Financial Operations' | 'Customer Care' | 'Infrastructure Control';
  trustScore: number;
  reputation: number;
  status: 'SAFE' | 'COMPROMISED' | 'MONITORED';
  ownerTenant: string;
}

export interface SwarmStep {
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

export interface SystemConfig {
  key: string;
  value: string;
  updatedAt: string;
}

export interface PredictionReport {
  probability: number;
  predictedVector: string;
  targetAgent: string;
  recommendedPreemptiveAction: string;
  status: 'LOW' | 'ELEVATED' | 'HIGH';
}

export interface BlackBoxLog {
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

export interface ImmuneRule {
  id: string;
  timestamp: string;
  originatingThreatType: string;
  derivedSignatureRule: string;
  actionTaken: string;
}

export interface CanvasChamber {
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
  coworkerName: string;
  personality: string;
  objective: string;
  recentMemory: string;
  reasoningChain: string[];
}

export interface MemoryStar {
  id: string;
  label: string;
  category: 'Idea' | 'Concept' | 'Project' | 'Organization';
  x: number;
  y: number;
  z: number;
  color: string;
  details: string;
}

export interface TerminalLog {
  agent: string;
  msg: string;
  time: string;
}

export type ActiveTab = 'swarm' | 'memory' | 'executive' | 'reveal' | 'settings' | 'pitch';
export type BoardroomPersona = 'CEO' | 'CISO' | 'Operations' | 'Investor';
export type RbacRole = 'Security Admin' | 'Security Analyst' | 'Application Developer' | 'Guest';
export type ThreatLevel = 'NOMINAL' | 'EVALUATING' | 'MITIGATED' | 'COMPROMISED';
export type StorytellingPhase = 'IDLE' | 'DETECTED' | 'ASSEMBLE' | 'INVESTIGATE' | 'REASON' | 'DECIDE' | 'RECOVER' | 'SUMMARY';

export const COMPETITIVE_MATRIX = [
  { feature: 'Autonomous Tool Hijack Guard', sentinel: 'Yes (MCP Proxy Block)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Consensus Swarm Validation', sentinel: 'Yes (Multi-Agent Pipeline)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Black Box Forensics Recorder', sentinel: 'Yes (Step Replays)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Digital Immune Self-Learning', sentinel: 'Yes (Learned Rules)', copilot: 'No', crowdstrike: 'No' },
  { feature: 'Swarm Self-Healing Rollbacks', sentinel: 'Yes (Recovery Agent)', copilot: 'No', crowdstrike: 'No' },
];
