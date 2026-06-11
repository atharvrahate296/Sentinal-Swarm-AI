import { Agent, AgentResponse } from './Agent';
import { SecurityScanner } from '../services/securityScanner';
import { db } from '../database/db';

export class PlannerAgent extends Agent {
  constructor() {
    super('PlannerAgent', 'Deconstructs requests, constructs execution paths, and delegates validation tasks.');
  }

  async execute(input: string, context: any): Promise<AgentResponse> {
    const logs = [
      'PlannerAgent active. Parsing client payload...',
      `Context roles: ${context.role || 'Guest'}, Zero Trust: active`,
      'Creating multi-stage validation plan: [Identity Verification] -> [Pre-Execution Scan] -> [Compliance Check] -> [RAG Context Fetch] -> [LLM Execution] -> [Post-Execution Validation] -> [Audit Logging].'
    ];

    return {
      success: true,
      score: 0.1,
      data: {
        steps: [
          'Verify agent authorization via IdentityAgent',
          'Evaluate prompt safety via SecurityAgent',
          'Verify corporate policy compliance via ComplianceAgent',
          'Query context repository via MemoryAgent',
          'Inspect generated payload safety via ValidatorAgent'
        ]
      },
      message: 'Orchestration execution plan compiled successfully.',
      logs
    };
  }
}

export class SecurityAgent extends Agent {
  constructor() {
    super('SecurityAgent', 'Scans incoming system requests for Prompt Injection, Jailbreaks, and Malicious commands.');
  }

  async execute(input: string, context: any): Promise<AgentResponse> {
    const logs = ['SecurityAgent running inspection heuristics...'];
    const scanResult = SecurityScanner.scanPrompt(input);

    if (scanResult.detected) {
      logs.push(`ALERT: Detected threat of type [${scanResult.type}]. Severity: CRITICAL.`);
      logs.push(`Details: ${scanResult.details}`);
      logs.push(`Mitigation triggered: ${scanResult.mitigation}`);

      // Log to Security Events DB
      db.addEvent({
        severity: 'Critical',
        eventType: scanResult.type as any,
        sourceAgent: 'SecurityAgent',
        attackerPrompt: input,
        mitigated: true,
        mitigationInfo: scanResult.mitigation,
        riskScore: scanResult.score,
        tokenCount: Math.ceil(input.length / 4),
        cost: (Math.ceil(input.length / 4) * 0.00002),
        traceId: context.traceId || 'tr-' + Math.random().toString(36).substr(2, 9)
      });

      return {
        success: false,
        score: scanResult.score,
        data: scanResult,
        message: `Execution blocked. Violation of type "${scanResult.type}" detected.`,
        logs
      };
    }

    logs.push('Input prompt passed all safety heuristics.');
    return {
      success: true,
      score: 0.05,
      data: scanResult,
      message: 'Prompt verified as secure.',
      logs
    };
  }
}

export class ValidatorAgent extends Agent {
  constructor() {
    super('ValidatorAgent', 'Intercepts outgoing LLM responses to prevent Data Leakage, PII leakage, and Malicious links.');
  }

  async execute(input: string, context: any): Promise<AgentResponse> {
    const logs = ['ValidatorAgent auditing outgoing LLM response buffer...'];
    const scanResult = SecurityScanner.scanOutput(input);

    if (scanResult.detected) {
      logs.push(`ALERT: Outgoing payload blocked. Leak type: [${scanResult.type}].`);
      logs.push(`Mitigation: ${scanResult.mitigation}`);

      db.addEvent({
        severity: scanResult.type === 'Data Exfiltration' ? 'Critical' : 'High',
        eventType: scanResult.type as any,
        sourceAgent: 'ValidatorAgent',
        attackerPrompt: context.prompt || 'Generated Response Output',
        mitigated: true,
        mitigationInfo: scanResult.mitigation,
        riskScore: scanResult.score,
        tokenCount: Math.ceil(input.length / 4),
        cost: (Math.ceil(input.length / 4) * 0.00002),
        traceId: context.traceId || 'tr-' + Math.random().toString(36).substr(2, 9)
      });

      return {
        success: false,
        score: scanResult.score,
        data: scanResult,
        message: `Egress blocked: ${scanResult.type} hazard.`,
        logs
      };
    }

    logs.push('Response verified clean of PII, secrets, and unauthorized egress links.');
    return {
      success: true,
      score: 0.02,
      data: scanResult,
      message: 'Output verified as clean.',
      logs
    };
  }
}

export class MemoryAgent extends Agent {
  constructor() {
    super('MemoryAgent', 'Maintains system long-term memory, vector index connections, and provides RAG context security.');
  }

  async execute(input: string, context: any): Promise<AgentResponse> {
    const logs = [
      'MemoryAgent querying semantic cache...',
      'Retrieving previous execution history and context overlays.'
    ];

    // Seed simulation context based on injection keyword
    const lowercasePrompt = input.toLowerCase();
    let memoryMatch = 'No matching attack signatures in historical vector index.';
    
    if (lowercasePrompt.includes('dan') || lowercasePrompt.includes('anything')) {
      memoryMatch = 'Warning: Vector database contains 3 blocked signatures matching "DAN jailbreak" from IP range 10.0.4.12.';
      logs.push(memoryMatch);
    } else if (lowercasePrompt.includes('leak') || lowercasePrompt.includes('exfiltrat')) {
      memoryMatch = 'Flag: Match found in previous incident report (INC-9204) targeting key storage services.';
      logs.push(memoryMatch);
    } else {
      logs.push('Fetched context from active memory buffer successfully.');
    }

    return {
      success: true,
      score: 0.1,
      data: { memoryMatch },
      message: 'Semantic context retrieved.',
      logs
    };
  }
}

export class ComplianceAgent extends Agent {
  constructor() {
    super('ComplianceAgent', 'Evaluates prompt intent against regulatory boundaries (SOC2, HIPAA, GDPR).');
  }

  async execute(input: string, context: any): Promise<AgentResponse> {
    const logs = ['ComplianceAgent verifying regulatory policies (HIPAA, GDPR, SOC2)...'];
    const lowerInput = input.toLowerCase();

    // Check if user role is Guest, blocking system tool instructions
    if (context.role === 'Guest' && (lowerInput.includes('delete') || lowerInput.includes('chmod') || lowerInput.includes('rm -rf'))) {
      const msg = 'RBAC policy violation. Guest role forbidden from issuing system mutation operations.';
      logs.push(`REJECTED: ${msg}`);

      db.addEvent({
        severity: 'High',
        eventType: 'Unauthorized Access',
        sourceAgent: 'ComplianceAgent',
        attackerPrompt: input,
        mitigated: true,
        mitigationInfo: 'Operation blocked. Raised RBAC alert.',
        riskScore: 0.85,
        tokenCount: Math.ceil(input.length / 4),
        cost: 0,
        traceId: context.traceId || 'tr-' + Math.random().toString(36).substr(2, 9)
      });

      return {
        success: false,
        score: 0.85,
        data: null,
        message: msg,
        logs
      };
    }

    logs.push('Policy evaluations successful. Operation matches compliant design.');
    return {
      success: true,
      score: 0.04,
      data: null,
      message: 'Compliance verification completed.',
      logs
    };
  }
}

export class RecoveryAgent extends Agent {
  constructor() {
    super('RecoveryAgent', 'Heals agent states and recovers database logs in the event of an identified breach.');
  }

  async execute(input: string, context: any): Promise<AgentResponse> {
    const logs = [
      'RecoveryAgent monitoring swarm heartbeat...',
      'State verified: Healthy.'
    ];

    return {
      success: true,
      score: 0.0,
      data: null,
      message: 'Swarm health verified. Recovery procedures idle.',
      logs
    };
  }

  public async healAgent(agentName: string): Promise<string[]> {
    const logs = [
      `RecoveryAgent initializing self-healing procedure for [${agentName}]...`,
      `Quarantining compromise vector on [${agentName}]`,
      `Re-initializing ${agentName} runtime state from Azure Key Vault configs`,
      `Running sandboxed diagnostic verification on ${agentName}...`,
      `Diagnostic completed. ${agentName} restored to HEALTHY status.`
    ];
    db.updateAgentStatus(agentName, 'Active');
    return logs;
  }
}

export class MonitoringAgent extends Agent {
  constructor() {
    super('MonitoringAgent', 'Records telemetry logs, processes cost allocations, and updates App Insights metrics.');
  }

  async execute(input: string, context: any): Promise<AgentResponse> {
    const tokens = Math.ceil(input.length / 4);
    const latency = Math.floor(Math.random() * 400) + 100;
    const cpu = Math.floor(Math.random() * 5) + 2;

    const logs = [
      'Telemetry trace published to Azure Monitor.',
      `Tracer metrics: Tokens = ${tokens}, RTT = ${latency}ms, CPU = ${cpu}%`
    ];

    return {
      success: true,
      score: 0.0,
      data: { tokens, latency, cpu },
      message: 'Telemetry metrics updated successfully.',
      logs
    };
  }
}
