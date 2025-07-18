import { Injectable } from '@nestjs/common';
import {
  executeBridgeFromAptos,
  getBridgeQuote,
} from 'src/tools/stargate/bridge';
import { getTokenBySymbolAndChain } from 'src/tools/stargate/quote';
import {
  BridgeRequestDto,
  BridgeStargateRequestDto,
  ChatResponseDto,
} from '../dto';
import { LoggerService } from './logger.service';
import { aptosAgent } from 'src/utils/aptosAgent';

@Injectable()
export class BridgeService {
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService(BridgeService.name);
  }

  async quoteBridge(bridgeMessage: BridgeRequestDto): Promise<ChatResponseDto> {
    try {
      this.logger.log('Starting bridge quote calculation');

      const {
        tokenA,
        tokenB,
        amount,
        dstAddress,
        srcChainKey,
        dstChainKey,
        user_address,
      } = bridgeMessage;

      const { accounts } = await aptosAgent(user_address);

      const dataA = await getTokenBySymbolAndChain(tokenA, srcChainKey);
      const dataB = await getTokenBySymbolAndChain(tokenB, dstChainKey);

      if (!dataA || !dataB) {
        this.logger.error('Token not found');
        return {
          message: 'Token not found',
          data: null,
        };
      }

      const srcToken = dataA.address;
      const dstToken = dataB.address;

      const srcAmount = this.convertAmountFromDecimals(amount, dataA.decimals);

      const { quote } = await getBridgeQuote({
        srcToken,
        dstToken,
        srcAddress: accounts.accountAddress.toString(),
        dstAddress,
        srcChainKey,
        dstChainKey,
        srcAmount: srcAmount,
        dstAmountMin: srcAmount,
      });

      return {
        message: 'Bridge quote calculated successfully',
        data: {
          quote,
          decimalsSrcToken: dataA.decimals,
          decimalsDstToken: dataB.decimals,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return {
        message: 'Failed to calculate bridge quote',
        data: null,
      };
    }
  }

  convertAmountFromDecimals(amount: string, decimals: number): string {
    const result = Number(amount) * 10 ** decimals;
    return result.toString();
  }

  async executeBridge(
    params: BridgeStargateRequestDto,
  ): Promise<ChatResponseDto> {
    try {
      this.logger.log('Starting bridge execution');
      const { quote, user_address } = params;

      if (!quote || !user_address) {
        return {
          message: 'Invalid quote or user address',
          data: null,
        };
      }
      const { aptos, accounts } = await aptosAgent(user_address);
      const txHash = await executeBridgeFromAptos(aptos, accounts, quote);

      return {
        message: 'Bridge executed successfully',
        data: {
          transactionHash: txHash,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return {
        message: 'Failed to execute bridge',
        data: null,
      };
    }
  }
}
