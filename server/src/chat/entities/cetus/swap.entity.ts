import { ChainId, Token } from 'src/shared/utils/token-address';

export enum SwapActionType {
  SWAP = 'swap',
}

export type SwapParameters = {
  fromToken: string | null;
  toToken: string | null;
  amount: number | null;
  chainId: ChainId;
};

export enum ParamsField {
  FROM_TOKEN = 'fromToken',
  TO_TOKEN = 'toToken',
  AMOUNT = 'amount',
  CHAIN_ID = 'chainId',
}
export interface SwapQuote {
  tokenIn: string;
  amountIn: string;
  amountInUsd: string;
  tokenInMarketPriceAvailable: boolean;
  tokenOut: string;
  amountOut: string;
  amountOutUsd: string;
  tokenOutMarketPriceAvailable: boolean;
  gas: string;
  gasPrice: string;
  gasUsd: string;
  l1FeeUsd: string;
  extraFee: string;
  route: string[];
  routeID: string;
  checksum: string;
  timestamp: number;
  chainId: ChainId;
  sourceToken?: Token;
  destinationToken?: Token;
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
  chainId?: number;
}
