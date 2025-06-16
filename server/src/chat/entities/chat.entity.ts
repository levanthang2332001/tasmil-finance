import { DeFiIntent } from './intent.entity';

export enum AgentType {
  UNKNOWN = 'unknown',
}

export interface ChatRequest {
  agentType?: AgentType;
  userId: string;
  content: string;
}

export interface ChatResponse {
  intent?: DeFiIntent;
  message: string;
  data?: any;
}

export interface MessageHistoryEntry {
  content: string;
  timestamp: number;
}
