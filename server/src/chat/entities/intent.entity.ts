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

export type LendingParams = {
  token: string;
  amount: number;
  duration?: number;
  interestRate?: number;
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
  | LendingParams
  | RemoveLiquidityParams;

export type ActionType =
  | 'swap'
  | 'liquidity'
  | 'staking'
  | 'borrow'
  | 'lending'
  | 'remove_liquidity'
  | 'unknown';

export interface DeFiIntent {
  actionType: ActionType;
  params: ParamsType;
  confidence: number;
  missingFields: string[];
  context: string;
}
