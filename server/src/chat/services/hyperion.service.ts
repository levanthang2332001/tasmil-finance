import { Network } from '@aptos-labs/ts-sdk';
import { Injectable, Logger } from '@nestjs/common';
import {
  EstimatePoolRequest,
  EstimatePoolResponse,
  EstimateSwapRequest,
  EstimateSwapResponse,
  ExecutePoolRequest,
  ExecutePoolResponse,
  ExecuteSwapRequest,
  ExecuteSwapResponse,
} from '../entities/hyperion.entity';

@Injectable()
export class HyperionService {
  private readonly logger = new Logger(HyperionService.name);
  private sdk: any;
  private FeeTierIndex: any;
  private priceToTick: any;

  constructor() {}

  private async initSDK() {
    if (this.sdk) return;
    const sdkModule = await import('@hyperionxyz/sdk');
    this.FeeTierIndex = sdkModule.FeeTierIndex;
    this.priceToTick = sdkModule.priceToTick;
    this.sdk = sdkModule.initHyperionSDK({
      network: Network.MAINNET,
      APTOS_API_KEY: process.env.APTOS_API_KEY || '',
    });
  }

  getMissingParameterSwapPrompt(
    missingParam: keyof Omit<EstimateSwapRequest, 'safeMode'>,
  ): string {
    const prompts: Record<keyof Omit<EstimateSwapRequest, 'safeMode'>, string> =
      {
        fromToken: 'Which token would you like to swap from?',
        toToken: 'Which token would you like to swap to?',
        amount: 'How much would you like to swap?',
      };
    return prompts[missingParam];
  }

  async estimateSwap(
    params: EstimateSwapRequest,
  ): Promise<EstimateSwapResponse> {
    if (!this.sdk) await this.initSDK();
    try {
      const currencyAAmount = Math.pow(10, 7);
      const { amountOut, path } = await this.sdk.Swap.estToAmount({
        amount: currencyAAmount,
        from: params.fromToken,
        to: params.toToken,
        safeMode: params.safeMode || false,
      });

      this.logger.debug(
        `Swap estimation - amountOut: ${amountOut}, path: ${JSON.stringify(path)}`,
      );

      return {
        amountOut,
        path,
      };
    } catch (error) {
      this.logger.error(
        `Failed to estimate swap: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async executeSwap(params: ExecuteSwapRequest): Promise<ExecuteSwapResponse> {
    if (!this.sdk) await this.initSDK();
    try {
      const swapPayload = await this.sdk.Swap.swapTransactionPayload({
        currencyA: params.currencyA,
        currencyB: params.currencyB,
        currencyAAmount: params.currencyAAmount,
        currencyBAmount: 0, // Will be calculated by the SDK
        slippage: 0.1,
        poolRoute: [], // Will be determined by the SDK
        recipient: '', // Should be set to user's address
      });

      this.logger.debug(
        `Swap execution payload generated: ${JSON.stringify(swapPayload)}`,
      );

      return {
        transactionPayload: swapPayload,
      };
    } catch (error) {
      this.logger.error(
        `Failed to execute swap: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  getMissingParameterPoolPrompt(
    missingParam: keyof Omit<
      EstimatePoolRequest,
      'feeTierIndex' | 'tickLower' | 'tickUpper' | 'currentPriceTick'
    >,
  ): string {
    const prompts: Record<
      keyof Omit<
        EstimatePoolRequest,
        'feeTierIndex' | 'tickLower' | 'tickUpper' | 'currentPriceTick'
      >,
      string
    > = {
      currencyA:
        'Which token would you like to use as currency A? (e.g. 0x1234567890123456789012345678901234567890)',
      currencyB:
        'Which token would you like to use as currency B? (e.g. 0x1234567890123456789012345678901234567890)',
      currencyAAmount:
        'How much would you like to use as currency A? (e.g. 1000000000000000000)',
    };
    return prompts[missingParam];
  }

  async estimatePool(
    params: EstimatePoolRequest,
  ): Promise<EstimatePoolResponse> {
    if (!this.sdk) await this.initSDK();
    try {
      const decimalsRatio = Math.pow(10, 8 - 6);
      const feeTierIndex =
        this.FeeTierIndex[params.feeTierIndex || 'PER_0.05_SPACING_5'];

      const currentPriceTick = this.priceToTick({
        price: params.currentPriceTick || 995,
        feeTierIndex,
        decimalsRatio,
      });

      const tickLower = this.priceToTick({
        price: params.tickLower || 992,
        feeTierIndex,
        decimalsRatio,
      });

      const tickUpper = this.priceToTick({
        price: params.tickUpper || 1336,
        feeTierIndex,
        decimalsRatio,
      });

      const [_, currencyBAmount] = await this.sdk.Pool.estCurrencyBAmountFromA({
        currencyA: params.currencyA,
        currencyB: params.currencyB,
        currencyAAmount: params.currencyAAmount,
        feeTierIndex,
        tickLower: Number(tickLower || 0),
        tickUpper: Number(tickUpper || 0),
        currentPriceTick: Number(currentPriceTick || 0),
      });

      return {
        currencyBAmount: Number(currencyBAmount),
      };
    } catch (error) {
      this.logger.error(
        `Failed to estimate pool: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async executePool(params: ExecutePoolRequest): Promise<ExecutePoolResponse> {
    if (!this.sdk) await this.initSDK();
    try {
      const poolPayload = await this.sdk.Pool.createPoolTransactionPayload({
        currencyA: params.currencyA,
        currencyB: params.currencyB,
        currencyAAmount: params.currencyAAmount,
        currencyBAmount: params.currencyBAmount || 0, // Will be calculated by the SDK
        feeTierIndex: Number(
          this.FeeTierIndex[params.feeTierIndex || 'PER_0.05_SPACING_5'],
        ),
        currentPriceTick: Number(params.currentPriceTick || 0),
        tickLower: Number(params.tickLower || 0),
        tickUpper: Number(params.tickUpper || 0),
        slippage: params.slippage || 0.1,
      });

      return {
        transactionPayload: poolPayload,
      };
    } catch (error) {
      this.logger.error(
        `Failed to execute pool: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
