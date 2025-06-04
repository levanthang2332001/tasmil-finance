

export enum SwapActionType {
  SWAP = 'swap',
}

export type SwapParameters = {
  fromToken: string;
  toToken: string;
  amount: number;
  a2b: boolean;
  byAmountIn: boolean;
};

export enum ParamsField {
  FROM_TOKEN = 'fromToken',
  TO_TOKEN = 'toToken',
  AMOUNT = 'amount',
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

export interface SwapQuoteResponse {
  data: {
    routeSummary: SwapQuote;
  };
}

export interface SwapParams {
  fromToken?: string;
  toToken?: string;
  amount?: string;
  a2b?: boolean;
  byAmountIn?: boolean;
}

export interface SwapRequest {
  tokenIn: string;  // token address
  tokenOut: string; // token address
  amount: string;   // amount in smallest unit
  slippage: number; // slippage tolerance in percentage (e.g., 0.5 for 0.5%)
  a2b?: boolean;
  byAmountIn?: boolean;
}

export interface SwapResponse {
  poolAddress: string;
  coinTypeIn: string;
  coinTypeOut: string;
  symbolA: string;
  symbolB: string;
  decimalsA: number;
  decimalsB: number;
  amountIn: string;
  amountOut: string;
  a2b: boolean;
  byAmountIn: boolean;
  slippage: string;
  fee: string;
} 
