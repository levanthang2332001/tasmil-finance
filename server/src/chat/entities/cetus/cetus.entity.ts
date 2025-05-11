import { SwapQuote } from "./swap.entity";

export enum CetusActionType {
  UNKNOWN = 'unknown',
  SWAP = 'swap',
  MARKET = 'market',
  CLMM = 'clmm',
}

export interface SwapParams {
  fromToken?: string;
  toToken?: string;
  amount?: string;
}

export interface MarketParams {
  token?: string;
  timeframe?: string;
}

export interface DeFiIntent {
  type: CetusActionType;
  params: SwapParams | MarketParams;
  confidence: number;
  missingFields: string[];
  context: string;
}

export enum ChatResponseType {
  BOT = 'bot',
  SWAP_QUOTE = 'swap_quote',
  CLMM_POOL = 'clmm_pool',
  MARKET_ANALYSIS = 'market_analysis',
  SWAP_EXECUTED = 'swap_executed',
  ERROR = 'error',
}


export interface ChatResponse {
  type: ChatResponseType;
  message: string;
  intent?: DeFiIntent;
  quote?: SwapQuote;
  txHash?: string;
}