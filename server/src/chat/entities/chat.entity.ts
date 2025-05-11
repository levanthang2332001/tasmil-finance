import { DeFiIntent } from './intent.entity';

export enum AgentType {
  NAVI = 'navi',
  CETUS = 'cetus',
}

export interface ChatRequest {
  agentType?: AgentType;
  userId: string;
  content: string;
}

export interface ChatResponse {
  intent?: DeFiIntent;
  message: string;
}

export interface MessageHistoryEntry {
  content: string;
  timestamp: number;
}
