import { SwapQuote } from './cetus/swap.entity';
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
  quote?: SwapQuote;
}

export interface MessageHistoryEntry {
  content: string;
  timestamp: number;
}
