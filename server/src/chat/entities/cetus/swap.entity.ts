

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
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  amountInUsd: string;
  amountOutUsd: string;
  tokenInMarketPriceAvailable: boolean;
  tokenOutMarketPriceAvailable: boolean;
  priceImpact: string;
  fee: string;
  transactionData: {
    poolAddress: string;
    coinTypeIn: string;
    coinTypeOut: string;
    amountIn: string;
    amountOut: string;
    a2b: boolean;
    byAmountIn: boolean;
    slippage: string;
  };
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
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  amountInUsd: string;
  amountOutUsd: string;
  tokenInMarketPriceAvailable: boolean;
  tokenOutMarketPriceAvailable: boolean;
  priceImpact: string;
  fee: string;
  transactionData: {
    poolAddress: string;
    coinTypeIn: string;
    coinTypeOut: string;
    amountIn: string;
    amountOut: string;
    a2b: boolean;
    byAmountIn: boolean;
    slippage: string;
  };
  estimatedOutput: {
    priceImpact: string;
    fee: string;
  };
} 
