import { DeFiIntent } from './intent.entity';

export interface ChatRequest {
  user_address: string;
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
