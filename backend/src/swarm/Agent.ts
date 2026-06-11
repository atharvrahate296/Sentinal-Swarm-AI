export interface AgentResponse {
  success: boolean;
  score: number; // Risk score or confidence score
  data: any;
  message: string;
  logs: string[];
}

export abstract class Agent {
  public name: string;
  public role: string;
  public status: 'Active' | 'Paused' | 'Compromised' | 'Recovering';

  constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
    this.status = 'Active';
  }

  abstract execute(input: any, context: any): Promise<AgentResponse>;
}
