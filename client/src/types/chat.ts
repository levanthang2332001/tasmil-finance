export enum MESSAGE_TYPE {
  USER = "user",
  BOT = "bot",
  UNKNOWN = "unknown",
}

export enum AgentType {
  NAVI = "navi",
  CETUS = "cetus",
  SUILEND = "suiLend",
}

export enum NAVI_ACTION_TYPE {
  BORROW = "borrow",
  WITHDRAW = "withdraw",
  REPAY = "repay",
}

export enum CETUS_ACTION_TYPE {
  SWAP = "swap",
}

export interface Message {
  id: string;
  timestamp: Date;
  message: string;
  actionType: NAVI_ACTION_TYPE | CETUS_ACTION_TYPE | MESSAGE_TYPE;
  data?: { [key: string]: string | boolean };
}

export interface SwapQuote {
  poolAddress: string;
  coinTypeIn: string;
  coinTypeOut: string;
  symbolA?: string;
  symbolB?: string;
  decimalsA: number;
  decimalsB: number;
  amountIn: string;
  amountOut: string;
  a2b: boolean;
  byAmountIn: boolean;
  slippage: string;
  fee: string;
}

export interface ChatResponse {
  id: string;
  timestamp: Date;
  message: string;
  intent: {
    actionType: NAVI_ACTION_TYPE | CETUS_ACTION_TYPE | MESSAGE_TYPE;
    agentType: AgentType;
    confidence: number;
    context: string;
    missingFields: string[];
    params: { [key: string]: string };
  };
  quote?: SwapQuote;
}
