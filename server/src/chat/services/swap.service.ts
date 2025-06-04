import {
  d,
  adjustForSlippage,
  initCetusSDK,
  Percentage,
  Pool,
  TickMath,
} from '@cetusprotocol/cetus-sui-clmm-sdk';
import { Injectable, Logger } from '@nestjs/common';
import {
  SwapParameters,
  SwapRequest,
  SwapResponse,
  SwapQuote,
} from '../entities/cetus/swap.entity';
import { BN } from 'bn.js';
import {
  CoinMetadata,
  SuiTransactionBlockResponse,
} from '@mysten/sui/dist/cjs/client';
import { Tokens } from 'src/shared/utils/address';

@Injectable()
export class CetusSwapService {
  private readonly logger = new Logger(CetusSwapService.name);
  private readonly sdk = initCetusSDK({ network: 'mainnet' });

  constructor() {}
  getMissingParameterPrompt(missingParam: keyof SwapParameters): string {
    const prompts: Record<keyof SwapParameters, string> = {
      fromToken: 'Which token would you like to swap from?',
      toToken: 'Which token would you like to swap to?',
      amount: 'How much would you like to swap?',
      a2b: 'Should the swap be A to B?',
      byAmountIn: 'Should the amount be calculated by input amount?',
    };
    return prompts[missingParam];
  }

  private async getPoolByCoins(
    token_a: string,
    token_b: string,
  ): Promise<Pool | null> {
    try {
      const pool = await this.sdk.Pool.getPoolByCoins([token_a, token_b]);
      return pool[0];
    } catch (error) {
      this.logger.error(`Error getting pool: ${error}`);
      return null;
    }
  }

  private async getCoinMetadata(
    coinType: string,
  ): Promise<CoinMetadata | null> {
    try {
      const coinMetadata = await this.sdk.fullClient.getCoinMetadata({
        coinType: coinType,
      });
      return coinMetadata;
    } catch (error) {
      this.logger.error(`Error getting coin metadata: ${error}`);
      return null;
    }
  }

  private async isCheckDecimals(coinMetadata: string): Promise<number> {
    const metadata = await this.sdk.fullClient.getCoinMetadata({
      coinType: coinMetadata,
    });
    return metadata?.decimals || 0;
  }

  private async calculateOptimalRoute(
    request: SwapRequest,
    symbolA: string,
    symbolB: string,
  ): Promise<SwapResponse> {
    try {
      console.log('tokenIn', request.tokenIn);
      console.log('tokenOut', request.tokenOut);

      const pool = await this.getPoolByCoins(request.tokenIn, request.tokenOut);
      if (!pool) {
        throw new Error('No pool found for the token pair');
      }

      if (!request.tokenIn || !request.tokenOut) {
        throw new Error('Token in or token out is not provided');
      }

      if (!request.amount) {
        throw new Error('Amount is not provided');
      }

      const coinMetadataA = await this.getCoinMetadata(request.tokenIn);
      const coinMetadataB = await this.getCoinMetadata(request.tokenOut);

      if (!coinMetadataA || !coinMetadataB) {
        throw new Error('Could not fetch metadata for one or both tokens');
      }

      // Determine token order based on pool configuration
      const isTokenAInPool = pool.coinTypeA === request.tokenIn;
      const isTokenBInPool = pool.coinTypeB === request.tokenIn;

      if (!isTokenAInPool && !isTokenBInPool) {
        throw new Error('Token not found in pool');
      }

      // Set a2b based on token position in pool
      const a2b = isTokenAInPool;

      let decimalsA: number;
      let decimalsB: number;
      if (a2b === false) {
        decimalsA = coinMetadataA.decimals;
        decimalsB = coinMetadataB.decimals;
      } else {
        decimalsA = coinMetadataB.decimals;
        decimalsB = coinMetadataA.decimals;
      }

      const coinAmount = new BN(request.amount);

      // if true, means fixed the amount of input
      const byAmountIn = true;

      const swapQuote = await this.sdk.Swap.preswap({
        pool: pool,
        currentSqrtPrice: pool.current_sqrt_price,
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        decimalsA: decimalsA,
        decimalsB: decimalsB,
        a2b: a2b,
        byAmountIn,
        amount: coinAmount.toString(),
      });

      console.log("swapQuote", swapQuote);

      return {
        poolAddress: pool.poolAddress,
        coinTypeIn: request.tokenIn,
        coinTypeOut: request.tokenOut,
        symbolA: symbolA,
        symbolB: symbolB,
        amountIn: swapQuote?.estimatedAmountIn || '0',
        amountOut: swapQuote?.estimatedAmountOut || '0',
        decimalsA: decimalsA,
        decimalsB: decimalsB,
        a2b: a2b,
        byAmountIn: byAmountIn,
        slippage: request.slippage.toString(),
        fee: swapQuote?.estimatedFeeAmount || '0',
      };
    } catch (error) {
      this.logger.error(`Error calculating swap route: ${error}`);
      throw error;
    }
  }

  private convertToSwapQuote(response: SwapResponse, symbolA: string, symbolB: string): SwapQuote {
    return {
      poolAddress: response.poolAddress,
      coinTypeIn: response.coinTypeIn,
      coinTypeOut: response.coinTypeOut,
      symbolA: symbolA,
      symbolB: symbolB,
      decimalsA: response.decimalsA,
      decimalsB: response.decimalsB,
      amountIn: response.amountIn,
      amountOut: response.amountOut,
      a2b: response.a2b,
      byAmountIn: response.byAmountIn,
      slippage: response.slippage,
      fee: response.fee,
    };
  }

  private async executeSwap(
    quote: SwapQuote,
    signer,
  ): Promise<SuiTransactionBlockResponse> {
    const {
      poolAddress,
      coinTypeIn,
      coinTypeOut,
      amountIn,
      amountOut,
      a2b,
      byAmountIn,
      slippage,
    } = quote;
    const formattedSlippage = Percentage.fromDecimal(d(slippage));

    const toAmount = byAmountIn ? new BN(amountOut) : new BN(amountIn);
    const amountLimit = adjustForSlippage(toAmount, formattedSlippage, a2b);

    const swapPayLoad = await this.sdk.Swap.createSwapTransactionPayload({
      pool_id: poolAddress,
      coinTypeA: coinTypeIn,
      coinTypeB: coinTypeOut,
      amount: amountIn,
      amount_limit: amountLimit.toString(),
      a2b: a2b,
      by_amount_in: byAmountIn,
    });

    const txHash = await this.sdk.fullClient.signAndExecuteTransaction({
      transaction: swapPayLoad,
      signer: signer,
      options: {
        showEvents: true,
        showObjectChanges: true,
        showBalanceChanges: true,
      },
    });

    console.log('txHash', txHash);

    return txHash;
  }

  async getTxHash(
    quote: SwapQuote,
    signer: string,
  ): Promise<SuiTransactionBlockResponse> {
    try {
      const response = await this.executeSwap(quote, signer);
      return response;
    } catch (error) {
      this.logger.error(`Error in getTxHash: ${error}`);
      throw error;
    }
  }

  private getTokenAddress(tokenInput: string): string {
    if (typeof tokenInput !== 'string') return '';
    const tokenBySymbol = Tokens.find((t) => t.symbol.toLowerCase() === tokenInput.toLowerCase());
    return tokenBySymbol?.address || '';
  }

  async getSwapQuote(params: SwapParameters): Promise<SwapQuote> {
    const addressA = this.getTokenAddress(params.fromToken) || params.fromToken;
    const addressB = this.getTokenAddress(params.toToken) || params.toToken;

    if (!addressA || !addressB) {
      this.logger.error('Token not found');
    }

    const decimals = await this.isCheckDecimals(addressA);

    try {
      const response = await this.calculateOptimalRoute({
        tokenIn: addressA,
        tokenOut: addressB,
        amount: (params.amount * 10 ** decimals).toString(),
        slippage: 0.5,
        a2b: params.a2b,
        byAmountIn: params.byAmountIn,
      }, params.fromToken, params.toToken);
      
      return this.convertToSwapQuote(response, params.fromToken, params.toToken);
    } catch (error) {
      this.logger.error(`Error in getSwapQuote: ${error}`);
      throw error;
    }
  }
}
