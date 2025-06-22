export type SwapParams = {
  fromToken: string;
  toToken: string;
  amount: number;
};

export type LiquidityParams = {
  tokenA: string;
  tokenB: string;
  amountA: number;
  amountB: number;
};

export type StakingParams = {
  token: string;
  amount: number;
  duration?: number;
};

export type BorrowParams = {
  token: string;
  amount: number;
  collateralToken?: string;
  collateralAmount?: number;
  ltv?: number; // Loan-to-Value ratio
};

export type SupplyParams = {
  token: string;
  amount: number;
  duration?: number;
  interestRate?: number;
};

export type RepayParams = {
  token: string;
  amount: number | 'max';
  repayFrom?: 'wallet' | 'deposited collateral';
};

export type WithdrawParams = {
  token: string;
  amount: number | 'max';
};

export type ClaimRewardParams = {
  token?: string;
  platform?: string;
};

export type PlaceLimitOrderParams = {
  token: string;
  amount: number;
  price: number;
  side: 'buy' | 'sell';
};

export type PlaceMarketOrderParams = {
  token: string;
  amount: number;
  side: 'buy' | 'sell';
};

export type RemoveLiquidityParams = {
  tokenA: string;
  tokenB: string;
  liquidityAmount: number;
  minAmountA?: number;
  minAmountB?: number;
};

export type ParamsType =
  | SwapParams
  | LiquidityParams
  | StakingParams
  | BorrowParams
  | SupplyParams
  | RepayParams
  | WithdrawParams
  | ClaimRewardParams
  | PlaceLimitOrderParams
  | PlaceMarketOrderParams
  | RemoveLiquidityParams;

export type ActionType =
  | 'swap'
  | 'liquidity'
  | 'staking'
  | 'borrow'
  | 'supply'
  | 'repay'
  | 'withdraw'
  | 'claim_reward'
  | 'place_limit_order'
  | 'place_market_order'
  | 'remove_liquidity'
  | 'unknown';

export interface DeFiIntent {
  actionType: ActionType;
  params: ParamsType;
  confidence: number;
  missingFields: string[];
  context: string;
}
