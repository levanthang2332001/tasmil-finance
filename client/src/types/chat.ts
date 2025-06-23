export enum ACTION_TYPE {
  USER = "user",
  UNKNOWN = "unknown",
  SWAP = "swap",
  LIQUIDITY = "liquidity",
  STAKING = "staking",
  BORROW = "borrow",
  SUPPLY = "supply",
  REPAY = "repay",
  WITHDRAW = "withdraw",
  CLAIM_REWARD = "claim_reward",
  PLACE_LIMIT_ORDER = "place_limit_order",
  PLACE_MARKET_ORDER = "place_market_order",
  REMOVE_LIQUIDITY = "remove_liquidity",
}

export interface ChatMessage {
  id: string;
  timestamp: Date;
  message: string;
  actionType: ACTION_TYPE;
  data?: { [key: string]: string | boolean };
}

export interface ChatResponse {
  id: string;
  timestamp: Date;
  message: string;
  intent: {
    actionType: ACTION_TYPE;
    confidence: number;
    context: string;
    missingFields: string[];
    params: { [key: string]: string };
  };
}
