export type HYPERION_ACTION = 'swap' | 'liquidity';

export enum HYPERION_ACTION_ENUM {
  SWAP = 'swap',
  LIQUIDITY = 'liquidity',
}

export type EstimateSwapRequest = {
  fromToken: string;
  toToken: string;
  amount: number;
  safeMode?: boolean;
};

export interface EstimateSwapResponse {
  amountOut: number;
  path: string;
}

export type ExecuteSwapRequest = {
  currencyA: string;
  currencyB: string;
  currencyAAmount: number;
  currencyBAmount?: number;
  slippage?: number;
  poolRoute?: string[];
  recipient?: string;
};

export interface ExecuteSwapResponse {
  transactionPayload: string;
}

export interface EstimatePoolRequest {
  currencyA: string;
  currencyB: string;
  currencyAAmount: number;
  feeTierIndex?: string;
  tickLower?: number;
  tickUpper?: number;
  currentPriceTick?: number;
}

export interface EstimatePoolResponse {
  currencyBAmount: number;
}

export interface ExecuteCreatePoolRequest extends EstimatePoolRequest {
  currencyBAmount?: number;
  slippage?: number;
}

export interface ExecuteCreatePoolResponse {
  transactionPayload: string;
}

export interface ExecuteAddLiquidityRequest extends EstimatePoolRequest {
  currencyAAmount: number;
  currencyBAmount: number;
  slippage?: number;
}

export interface ExecuteAddLiquidityResponse {
  transactionPayload: string;
}

export interface ExecuteRemoveLiquidityRequest extends EstimatePoolRequest {
  currencyBAmount?: number;
  slippage?: number;
}

export interface ExecuteRemoveLiquidityResponse {
  transactionPayload: string;
}
