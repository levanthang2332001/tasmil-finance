import { Injectable } from '@nestjs/common';
import {
  CHAIN_NAMES,
  ChainId,
  getTokenBySymbol,
  Token,
} from 'src/shared/utils/token-address';
import { fromWei, toWei } from 'src/shared/utils/number';
import { SwapParameters } from '../../entities/cetus/swap.entity';
import { LoggerService } from 'src/shared/services/logger.service';
import { SwapQuote, SwapQuoteResponse } from '../../entities/cetus/swap.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CetusSwapService {
  private readonly logger = new LoggerService(CetusSwapService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get('kyberswap.apiUrl') || '';
    this.apiKey = this.configService.get('kyberswap.apiKey') || '';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-client-id': this.apiKey,
    };
  }

  private validateTokens(
    tokenIn: Token | undefined,
    tokenOut: Token | undefined,
  ): void {
    if (!tokenIn || !tokenOut) {
      throw new Error('Invalid token address');
    }
  }

  private buildQueryParams(
    tokenIn: Token,
    tokenOut: Token,
    amount: number,
  ): URLSearchParams {
    const queryParams = new URLSearchParams();
    queryParams.append('tokenIn', tokenIn.address);
    queryParams.append('tokenOut', tokenOut.address);
    queryParams.append('amountIn', toWei(amount, tokenIn.decimals).toString());
    queryParams.append('gasInclude', 'true');
    return queryParams;
  }

  private async fetchSwapQuote(
    queryParams: URLSearchParams,
  ): Promise<SwapQuoteResponse> {
    const response = await fetch(
      `${this.apiUrl}/${CHAIN_NAMES[ChainId.ETHEREUM]}/api/v1/routes?${queryParams}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(`KyberSwap API error: ${response.statusText}`);
    }

    const data = (await response.json()) as SwapQuoteResponse;
    if (!data) {
      throw new Error('No data returned from KyberSwap API');
    }

    return data;
  }

  private formatSwapQuote(
    quote: SwapQuote,
    tokenIn: Token,
    tokenOut: Token,
  ): SwapQuote {
    return {
      ...quote,
      amountIn: fromWei(quote.amountIn, tokenIn.decimals).toString(),
      amountOut: fromWei(quote.amountOut, tokenOut.decimals).toString(),
      sourceToken: tokenIn,
      destinationToken: tokenOut,
    };
  }

  getMissingParameterPrompt(missingParam: keyof SwapParameters): string {
    const prompts: Record<keyof SwapParameters, string> = {
      fromToken: 'Which token would you like to swap from?',
      toToken: 'Which token would you like to swap to?',
      amount: 'How much would you like to swap?',
      chainId: 'Which chain would you like to swap on?',
    };
    return prompts[missingParam];
  }

  async getSwapQuote(params: SwapParameters): Promise<SwapQuote> {
    try {
      const { fromToken, toToken, amount, chainId } = params;
      const tokenIn = getTokenBySymbol(
        chainId,
        fromToken?.toLowerCase() as string,
      );
      const tokenOut = getTokenBySymbol(
        chainId,
        toToken?.toLowerCase() as string,
      );

      this.validateTokens(tokenIn, tokenOut);
      const queryParams = this.buildQueryParams(tokenIn!, tokenOut!, amount!);
      const data = await this.fetchSwapQuote(queryParams);

      this.logger.debug(
        `Swap quote received: ${JSON.stringify(data.data.routeSummary, null, 2)}`,
      );
      return this.formatSwapQuote(data.data.routeSummary, tokenIn!, tokenOut!);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get swap quote: ${message}`);
    }
  }

  async executeSwap(quote: SwapQuote): Promise<string> {
    try {
      const response = await fetch(
        `${this.apiUrl}/arbitrum/api/v1/route/build`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(quote),
        },
      );

      if (!response.ok) {
        throw new Error(`KyberSwap API error: ${response.statusText}`);
      }

      const data = (await response.json()) as { txHash: string };
      if (!data.txHash) {
        throw new Error('No transaction hash returned from KyberSwap API');
      }

      this.logger.debug(`Swap executed with hash: ${data.txHash}`);
      return data.txHash;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to execute swap: ${message}`);
    }
  }
}
