import { AgentType } from './chat.entity';

export type ParamsType = any;

export interface DeFiIntent {
  agentType: 'unknown' | AgentType;
  actionType: 'unknown';
  params: ParamsType;
  confidence: number;
  missingFields: string[];
  context: string;
}
