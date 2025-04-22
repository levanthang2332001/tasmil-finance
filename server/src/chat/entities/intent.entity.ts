export enum IntentType {
  UNKNOWN = 'unknown',
  SWAP = 'swap',
  MARKET = 'market',
  INFO = 'info',
  ACTION = 'action',
  QUERY = 'query',
}

export enum NaviActionType {
  PORTFOLIO = 'portfolio',
  POSITION = 'position',
  HEALTH = 'health',
  REWARD = 'reward',
  BORROW = 'borrow',
  SUPPLY = 'supply',
  WITHDRAW = 'withdraw',
  REPAY = 'repay',
}

export enum CetusActionType {
  LIQUIDITY = 'liquidity',
  POOL = 'pool',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  FARM = 'farm',
  YIELD = 'yield',
  APR = 'apr',
  SWAP = 'swap',
}

export interface SwapParams {
  fromToken?: string;
  toToken?: string;
  amount?: string;
  chainId?: number;
}

export interface MarketParams {
  token?: string;
  timeframe?: string;
}

export interface NaviParams {
  actionType?: NaviActionType;
  asset?: string;
  amount?: string;
  address?: string;
}

export interface CetusParams {
  actionType?: CetusActionType;
  token?: string;
  pool?: string;
  amount?: string;
}

// Generic params type that can be extended for other agents
export interface GenericParams {
  [key: string]: any;
}

export interface DeFiIntent {
  type: IntentType;
  agentActionType?: NaviActionType | CetusActionType | string;
  params: SwapParams | MarketParams | NaviParams | CetusParams | GenericParams;
  confidence: number;
  missingFields: string[];
  context: string;
}
