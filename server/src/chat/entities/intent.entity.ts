export enum IntentType {
  UNKNOWN = 'unknown',
  SWAP = 'swap',
  MARKET = 'market',
  PORTFOLIO = 'portfolio',
  BORROW = 'borrow',
  SUPPLY = 'supply',
  WITHDRAW = 'withdraw',
  REPAY = 'repay',
  POSITION = 'position',
  HEALTH = 'health',
  REWARD = 'reward',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  FARM = 'farm',
  POOL = 'pool',
  LIQUIDITY = 'liquidity',
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

export interface DefiParams {
  asset?: string;
  amount?: string;
}

export interface BorrowParams extends DefiParams {}
export interface SupplyParams extends DefiParams {}
export interface WithdrawParams extends DefiParams {}
export interface RepayParams extends DefiParams {}

export interface AddressParams {
  address?: string;
}

export interface HealthParams extends AddressParams {}
export interface PortfolioParams extends AddressParams {}
export interface PositionParams extends AddressParams {}

export interface RewardParams extends AddressParams {}
export interface PoolParams extends AddressParams {}
export interface LiquidityParams extends AddressParams {}
export interface AprParams extends AddressParams {}

export interface StakeParams extends DefiParams {
  token?: string;
}
export interface UnstakeParams extends DefiParams {
  token?: string;
}
export interface FarmParams extends DefiParams {
  token?: string;
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
  params: SwapParams | MarketParams | NaviParams | CetusParams | GenericParams;
  confidence: number;
  missingFields: string[];
  context: string;
}
