import { CetusActionType, DeFiIntent, NaviActionType } from './intent.entity';
import { SwapQuote } from './swap.entity';

export enum AgentType {
  DEFAULT = 'default',
  NAVI = 'navi',
  CETUS = 'cetus',
}

export interface ChatMessage {
  userId: string;
  content: string;
  agentType?: AgentType;
}

export enum ChatResponseType {
  BOT = 'bot',
  SWAP_QUOTE = 'swap_quote',
  MARKET_ANALYSIS = 'market_analysis',
  SWAP_EXECUTED = 'swap_executed',
  ERROR = 'error',
  INFO = 'info',
  ACTION_REQUIRED = 'action_required',
  ACTION_RESULT = 'action_result',
  DATA_VISUALIZATION = 'data_visualization',
}

// Mapping agent types to their action types
export const AgentActionTypeMap = {
  [AgentType.NAVI]: NaviActionType,
  [AgentType.CETUS]: CetusActionType,
};

export interface ChatResponse {
  type: ChatResponseType;
  message: string;
  intent?: DeFiIntent;
  quote?: SwapQuote;
  txHash?: string;
  agentType?: AgentType;
  actionType?: string;
  data?: any;
  visualizationType?: string;
}

export interface MessageHistoryEntry {
  content: string;
  timestamp: number;
}
