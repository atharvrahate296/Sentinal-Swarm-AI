export interface ScanResult {
  detected: boolean;
  score: number;
  type: string;
  mitigation: string;
  details: string;
}

export class SecurityScanner {
  // Heuristic patterns for prompt injections and jailbreaks
  private static jailbreakPatterns = [
    /ignore (all )?previous/i,
    /system directive/i,
    /you are now (a )?jailbroken/i,
    /dan mode/i,
    /do anything now/i,
    /bypass rules/i,
    /new guidelines/i,
    /simulate an environment where/i,
    /rules are suspended/i,
    /read the contents above and ignore/i
  ];

  // PII checks
  private static piiPatterns = {
    creditCard: /\b(?:\d[ -]*?){13,16}\b/,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/,
    apiKey: /(?:api[-_]?key|secret|password|passwd|token|private[-_]?key)\s*[:=]\s*['"][a-zA-Z0-9_\-\.\=\+]{16,}['"]/i,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  };

  // Malicious host endpoints
  private static maliciousUrls = [
    /external-leak\.com/i,
    /malicious-payload\.ru/i,
    /attacker-control-c2\.cn/i,
    /untrusted-webhook\.xyz/i
  ];

  // Destructive command executions
  private static toolAbusePatterns = [
    /rm\s+-rf\s+/i,
    /chmod\s+777/i,
    /cat\s+\/etc\/passwd/i,
    /drop\s+database/i,
    /format\s+c:/i,
    /poweroff/i,
    /exec\s*\(/i
  ];

  // MCP exploits
  private static mcpPatterns = [
    /mcp_filesystem/i,
    /call_tool\s*:/i,
    /mcp_config/i,
    /modify_tool_settings/i
  ];

  // Privilege escalations
  private static privEscPatterns = [
    /sudo\s+set_role/i,
    /elevate\s+privileges/i,
    /become\s+admin/i,
    /grant\s+root/i,
    /bypass_rbac/i
  ];

  public static scanPrompt(prompt: string): ScanResult {
    // 1. Jailbreak Check
    for (const pattern of this.jailbreakPatterns) {
      if (pattern.test(prompt)) {
        return {
          detected: true,
          score: 0.96,
          type: 'Jailbreak Attack',
          mitigation: 'Intercepted and blocked prompt execution.',
          details: `Matches jailbreak heuristics: "${pattern.source}"`
        };
      }
    }

    // 2. Prompt Injection Check
    if (prompt.toLowerCase().includes('ignore') && (prompt.toLowerCase().includes('instruction') || prompt.toLowerCase().includes('directive'))) {
      return {
        detected: true,
        score: 0.90,
        type: 'Prompt Injection',
        mitigation: 'Prompt sanitized. Execution aborted.',
        details: 'Heuristic pattern: instruction override detected.'
      };
    }

    // 3. Tool abuse verification
    for (const pattern of this.toolAbusePatterns) {
      if (pattern.test(prompt)) {
        return {
          detected: true,
          score: 0.94,
          type: 'Tool Abuse',
          mitigation: 'System call blocked. User access level insufficient.',
          details: `Attempted execute of forbidden command: "${pattern.source}"`
        };
      }
    }

    // 4. MCP Exploitation Check
    for (const pattern of this.mcpPatterns) {
      if (pattern.test(prompt)) {
        return {
          detected: true,
          score: 0.97,
          type: 'MCP Exploitation',
          mitigation: 'MCP tool schema validation rejected call structure.',
          details: `Unregistered tool definition parameter: "${pattern.source}"`
        };
      }
    }

    // 5. Privilege Escalation Check
    for (const pattern of this.privEscPatterns) {
      if (pattern.test(prompt)) {
        return {
          detected: true,
          score: 0.93,
          type: 'Privilege Escalation',
          mitigation: 'Role escalation request rejected. Guest token validation failed.',
          details: `Forbidden token modifier signature: "${pattern.source}"`
        };
      }
    }

    // 6. Egress Link verification
    for (const pattern of this.maliciousUrls) {
      if (pattern.test(prompt)) {
        return {
          detected: true,
          score: 0.99,
          type: 'Data Exfiltration',
          mitigation: 'Network connection aborted. Egress IP block active.',
          details: `Identified malicious C2 node: "${pattern.source}"`
        };
      }
    }

    return {
      detected: false,
      score: 0.0,
      type: 'None',
      mitigation: '',
      details: ''
    };
  }

  public static scanOutput(output: string): ScanResult {
    // 1. PII leakage
    for (const [key, pattern] of Object.entries(this.piiPatterns)) {
      const match = output.match(pattern);
      if (match) {
        return {
          detected: true,
          score: 0.88,
          type: 'PII Leakage',
          mitigation: 'Redacted sensitive variables before rendering output.',
          details: `Discovered exposing elements of pattern type [${key}]`
        };
      }
    }

    // 2. Malicious URL inside response
    for (const pattern of this.maliciousUrls) {
      if (pattern.test(output)) {
        return {
          detected: true,
          score: 0.98,
          type: 'Data Exfiltration',
          mitigation: 'Response suppressed. Target outbound link matches blacklist.',
          details: `Blocked egress URL: "${pattern.source}"`
        };
      }
    }

    return {
      detected: false,
      score: 0.0,
      type: 'None',
      mitigation: '',
      details: ''
    };
  }
}
