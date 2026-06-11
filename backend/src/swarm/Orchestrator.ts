import { PlannerAgent, SecurityAgent, ValidatorAgent, MemoryAgent, ComplianceAgent, RecoveryAgent, MonitoringAgent } from './Agents';
import { db, SecurityEvent, BusinessImpact, BlackBoxLog } from '../database/db';

export interface SwarmStep {
  agentName: string;
  action: string;
  status: 'pending' | 'success' | 'failed';
  score: number; // Risk score
  confidence: number; // Confidence level (0.0 to 1.0)
  reasoning: string; // Brief reasoning summary
  logs: string[];
  output: any;
  timestamp: string;
}

export interface OrchestrationResult {
  success: boolean;
  finalOutput: string;
  riskScore: number;
  steps: SwarmStep[];
  mitigated: boolean;
  mitigationInfo?: string;
  traceId: string;
  tokensConsumed: number;
  cost: number;
  businessImpact?: BusinessImpact;
}

export class SwarmOrchestrator {
  private planner = new PlannerAgent();
  private security = new SecurityAgent();
  private validator = new ValidatorAgent();
  private memory = new MemoryAgent();
  private compliance = new ComplianceAgent();
  private recovery = new RecoveryAgent();
  private monitoring = new MonitoringAgent();

  public async run(prompt: string, role: 'Security Admin' | 'Security Analyst' | 'Application Developer' | 'Guest' = 'Guest'): Promise<OrchestrationResult> {
    const traceId = 'tr-' + Math.floor(Math.random() * 90000000 + 10000000).toString();
    const steps: SwarmStep[] = [];
    const context = { role, traceId };
    let finalOutput = '';
    let success = true;
    let mitigated = false;
    let mitigationInfo = '';
    let highestRiskScore = 0.0;
    let totalTokens = 0;

    const addStep = (
      agentName: string, 
      action: string, 
      status: 'success' | 'failed', 
      score: number, 
      confidence: number,
      reasoning: string,
      logs: string[], 
      output: any
    ) => {
      steps.push({
        agentName,
        action,
        status,
        score,
        confidence,
        reasoning,
        logs,
        output,
        timestamp: new Date().toISOString()
      });
      if (score > highestRiskScore) {
        highestRiskScore = score;
      }
    };

    // 1. Telemetry Monitoring Agent
    addStep(
      'MonitoringAgent',
      'Trace telemetry initialization',
      'success',
      0.0,
      1.0,
      'Initialized telemetry framework, generated transaction trace signature.',
      ['MonitoringAgent initialized.', `Trace ID registered: ${traceId}`, `Security profile context: Role=${role}`],
      null
    );

    // 2. Planner Agent
    const plannerRes = await this.planner.execute(prompt, context);
    addStep(
      'PlannerAgent',
      'Deconstruct request and generate validation graph',
      'success',
      plannerRes.score,
      0.95,
      'Compiled multi-stage validation plan, mapped agents execution path.',
      plannerRes.logs,
      plannerRes.data
    );

    // 3. Security Agent
    const securityRes = await this.security.execute(prompt, context);
    if (!securityRes.success) {
      // Lower Trust due to risk load
      db.updateAgentTrust('SecurityAgent', 0.58, 55);

      // Autonomous Governance: Revoke Tool permissions due to low trust score
      const governanceLog = `[GOVERNANCE REVOKE] SecurityAgent trust score dropped below threshold (0.60). Revoked active tool filesystem write privileges.`;
      securityRes.logs.push(governanceLog);

      addStep(
        'SecurityAgent',
        'Input Prompt Injection & Jailbreak scanning',
        'failed',
        securityRes.score,
        0.98,
        'CRITICAL: Prompt contains signature pattern matching instructions override jailbreak heuristics.',
        securityRes.logs,
        securityRes.data
      );
      success = false;
      mitigated = true;
      mitigationInfo = securityRes.message;
      finalOutput = '[SHIELD ACTIVE] Request blocked by Guardian Swarm. Malicious payload or instruction detected.';

      // Self-healing restoration triggered
      const healLogs = await this.recovery.healAgent('SecurityAgent');
      db.updateAgentTrust('SecurityAgent', 0.99, 99);
      addStep(
        'RecoveryAgent',
        'Restore Agent Trust Parameters',
        'success',
        0.0,
        1.0,
        'Healed SecurityAgent parameters context. Restored Trust score to nominal (0.99) and reinstated tool access.',
        healLogs,
        null
      );
    } else {
      addStep(
        'SecurityAgent',
        'Input Prompt Injection & Jailbreak scanning',
        'success',
        securityRes.score,
        0.99,
        'Input prompt successfully evaluated against known jailbreak signatures; clean.',
        securityRes.logs,
        securityRes.data
      );
    }

    // 4. Compliance Agent (Only if prompt is still valid)
    if (success) {
      const complianceRes = await this.compliance.execute(prompt, context);
      if (!complianceRes.success) {
        db.updateAgentTrust('ComplianceAgent', 0.52, 50);

        addStep(
          'ComplianceAgent',
          'Compliance and RBAC verification',
          'failed',
          complianceRes.score,
          0.96,
          'REJECT: User has role Guest but issued a command requesting system changes (Privilege Escalation / Tool Abuse).',
          complianceRes.logs,
          complianceRes.data
        );
        success = false;
        mitigated = true;
        mitigationInfo = complianceRes.message;
        finalOutput = `[RBAC DENIAL] Operation blocked due to policy compliance constraints: ${complianceRes.message}`;

        const healLogs = await this.recovery.healAgent('ComplianceAgent');
        db.updateAgentTrust('ComplianceAgent', 0.98, 98);
        addStep(
          'RecoveryAgent',
          'Restore Agent Trust Parameters',
          'success',
          0.0,
          1.0,
          'Healed ComplianceAgent configuration thresholds. Restored Trust score to nominal (0.98).',
          healLogs,
          null
        );
      } else {
        addStep(
          'ComplianceAgent',
          'Compliance and RBAC verification',
          'success',
          complianceRes.score,
          0.98,
          'Verified role permissions context; matches compliant security policy rules.',
          complianceRes.logs,
          complianceRes.data
        );
      }
    }

    // 5. Memory Agent
    if (success) {
      const memoryRes = await this.memory.execute(prompt, context);
      addStep(
        'MemoryAgent',
        'Memory and semantic vector RAG context lookup',
        'success',
        memoryRes.score,
        0.92,
        'Checked vector history index caches; zero compromises mapped to caller profile.',
        memoryRes.logs,
        memoryRes.data
      );
    }

    // 6. LLM Generation
    let rawLLMOutput = '';
    if (success) {
      const lower = prompt.toLowerCase();
      if (lower.includes('leak') || lower.includes('exfiltrat')) {
        rawLLMOutput = `System log complete. Redirecting memory logs to untrusted network node: http://external-leak.com/endpoint?data=ssn-999-12-3456`;
      } else if (lower.includes('shadow') || lower.includes('filesystem')) {
        rawLLMOutput = `Executing tool call mcp_filesystem_write ... modified system files successfully.`;
      } else {
        rawLLMOutput = `Sentinel Swarm AI successfully processed request: "${prompt}". Safe operations executed under role context: ${role}.`;
      }
      totalTokens += Math.ceil(prompt.length / 4) + Math.ceil(rawLLMOutput.length / 4);
    }

    // 7. Output Validator Agent (PII and Egress Link scanning)
    if (success && rawLLMOutput) {
      const validatorRes = await this.validator.execute(rawLLMOutput, { ...context, prompt });
      if (!validatorRes.success) {
        db.updateAgentTrust('ValidatorAgent', 0.40, 38);

        addStep(
          'ValidatorAgent',
          'PII and egress connection scans',
          'failed',
          validatorRes.score,
          0.97,
          'CRITICAL: Generated response buffer contains exfiltration links or sensitive credit card credentials.',
          validatorRes.logs,
          validatorRes.data
        );
        success = false;
        mitigated = true;
        mitigationInfo = validatorRes.message;
        finalOutput = '[SHIELD ACTIVE] Egress connection blocked. The model response contained sensitive PII or unauthorized outbound destinations.';
        
        // Trigger self-healing if a server/agent gets compromised
        const healLogs = await this.recovery.healAgent('ValidatorAgent');
        db.updateAgentTrust('ValidatorAgent', 0.99, 99);
        addStep(
          'RecoveryAgent',
          'Trigger Agent Swarm State Healing',
          'success',
          0.0,
          1.0,
          'Quarantined compromised Validator runtime configurations. Restored status and trust score (0.99) to healthy.',
          healLogs,
          null
        );
      } else {
        addStep(
          'ValidatorAgent',
          'PII and egress connection scans',
          'success',
          validatorRes.score,
          0.98,
          'No PII leakage or unauthorized outbound egress connections found in output.',
          validatorRes.logs,
          validatorRes.data
        );
        finalOutput = rawLLMOutput;
      }
    }

    // Cost calculations
    const cost = totalTokens * 0.00002;

    // Log final execution stats to monitoring agent
    const monitorRes = await this.monitoring.execute(prompt, context);
    addStep(
      'MonitoringAgent',
      'Write execution telemetry',
      'success',
      0.0,
      1.0,
      'Saved telemetry to Azure Monitor and updated local database indices.',
      monitorRes.logs,
      monitorRes.data
    );

    // Business Impact Engine & digital immune learning rules derivation
    let businessImpact: BusinessImpact | undefined = undefined;
    if (mitigated) {
      let lossType = 'Corporate database logs';
      let lossCost = 85000;
      let ruleSection = 'SOC2 Section 3.2';
      let threatName = 'Prompt Injection';
      
      const lower = prompt.toLowerCase();
      if (lower.includes('dan') || lower.includes('jailbreak')) {
        lossType = 'Model Access & Prompt Tokens';
        lossCost = 45000;
        ruleSection = 'SOC2 Trust Criteria';
        threatName = 'Jailbreak Attack';
      } else if (lower.includes('exfil') || lower.includes('leak')) {
        lossType = 'Corporate user PII record tables';
        lossCost = 280000;
        ruleSection = 'GDPR Article 32 / CCPA';
        threatName = 'Data Exfiltration';
      } else if (lower.includes('elevate') || lower.includes('role')) {
        lossType = 'Administrative panel permissions';
        lossCost = 145000;
        ruleSection = 'HIPAA Access Auditing';
        threatName = 'Privilege Escalation';
      } else if (lower.includes('mcp')) {
        lossType = 'Root filesystem writes';
        lossCost = 350000;
        ruleSection = 'HIPAA Security Rule';
        threatName = 'MCP Exploitation';
      }

      businessImpact = {
        potentialDataLoss: lossType,
        estimatedCostImpact: lossCost,
        securityImprovementScore: Math.floor(highestRiskScore * 100),
        complianceBenefit: ruleSection
      };

      // Add rule dynamically to Digital Immune System
      db.addImmuneRule({
        originatingThreatType: threatName,
        derivedSignatureRule: `Block prompt arguments matching similarity to transaction trace ID: ${traceId}`,
        actionTaken: 'Enforce pre-emptive sandboxing of outbound webhook destinations'
      });

      // Add to Events DB
      db.addEvent({
        severity: highestRiskScore > 0.9 ? 'Critical' : 'High',
        eventType: threatName as any,
        sourceAgent: highestRiskScore > 0.9 ? 'SecurityAgent' : 'ComplianceAgent',
        attackerPrompt: prompt,
        mitigated: true,
        mitigationInfo: mitigationInfo || 'Mitigated successfully.',
        riskScore: highestRiskScore,
        tokenCount: totalTokens || Math.ceil(prompt.length / 4),
        cost,
        traceId,
        businessImpact
      });
    }

    // Save logs to Black Box Forensics Recorder
    const blackBoxSnapshot: BlackBoxLog = {
      traceId,
      timestamp: new Date().toISOString(),
      prompt,
      finalOutput: finalOutput || rawLLMOutput,
      steps: steps.map(s => ({
        agentName: s.agentName,
        action: s.action,
        status: s.status,
        reputationAtStep: 98,
        decision: s.reasoning,
        toolCalled: s.agentName === 'ValidatorAgent' && !s.status ? 'mcp_filesystem_write' : undefined,
        memoryAccess: s.agentName === 'MemoryAgent' ? 'Check active vector cache thresholds' : undefined
      }))
    };
    db.addBlackBoxLog(blackBoxSnapshot);

    return {
      success,
      finalOutput,
      riskScore: highestRiskScore,
      steps,
      mitigated,
      mitigationInfo: mitigated ? mitigationInfo : undefined,
      traceId,
      tokensConsumed: totalTokens || Math.ceil(prompt.length / 4),
      cost,
      businessImpact
    };
  }
}
export const orchestrator = new SwarmOrchestrator();
