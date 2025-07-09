/* eslint-disable @typescript-eslint/require-await */
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { swapTokensWithLiquidswap } from '../tools/liquidswap/swap';
import { aptosAgent } from '../utils/aptosAgent';
import { JwtAuthGuard } from '../wallet/guard/jwt-auth.guard';
import { handleAction } from './actions';
import { ChatApiDocs } from './docs/chat-api.docs';
import {
  ChatRequestDto,
  ChatResponseDto,
  PreswapRequestDto,
} from './dto/chat.dto';
import { MessageHistoryEntry } from './entities/chat.entity';
import { IntentService } from './services/intent.service';

@Controller('chat')
export class ChatController {
  private messageHistory: Map<string, MessageHistoryEntry[]> = new Map();

  constructor(private readonly intentService: IntentService) {}

  private getRecentMessages(user_address: string, limit: number = 3): string {
    const userMessages = this.messageHistory.get(user_address) || [];
    const recentMessages = userMessages
      .slice(-limit)
      .map((entry) => entry.content)
      .join('\n');
    return recentMessages;
  }

  private updateMessageHistory(user_address: string, content: string): void {
    const userMessages = this.messageHistory.get(user_address) || [];
    userMessages.push({
      content,
      timestamp: Date.now(),
    });
    // Keep only last 10 messages
    if (userMessages.length > 10) {
      userMessages.shift();
    }
    this.messageHistory.set(user_address, userMessages);
  }

  private async handleError(error: unknown): Promise<ChatResponseDto> {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      message: `Sorry, I encountered an error: ${errorMessage}`,
    };
  }

  @Post('message')
  @UseGuards(JwtAuthGuard)
  @ChatApiDocs.sendMessage.operation
  @ChatApiDocs.sendMessage.body
  @ChatApiDocs.sendMessage.okResponse
  @ChatApiDocs.sendMessage.badRequestResponse
  @ChatApiDocs.sendMessage.internalServerErrorResponse
  async sendMessage(
    @Body() chatMessage: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    try {
      this.updateMessageHistory(chatMessage.user_address, chatMessage.content);
      const recentContext = this.getRecentMessages(chatMessage.user_address);

      // Extract intent including agent-specific context
      const intent = await this.intentService.extractIntent(
        `Previous messages:\n${recentContext}\n\nCurrent message: ${chatMessage.content}`,
      );

      if (!intent) {
        return {
          message:
            "I couldn't understand your request. Please try again with more details.",
          intent: undefined,
        };
      }

      const data = await handleAction(
        intent.actionType,
        intent.params,
        chatMessage.user_address,
      );

      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('swap')
  // @ChatApiDocs.pre_swap.operation
  // @ChatApiDocs.pre_swap.body
  // @ChatApiDocs.pre_swap.okResponse
  // @ChatApiDocs.pre_swap.badRequestResponse
  // @ChatApiDocs.pre_swap.internalServerErrorResponse
  async swap(@Body() swapMessage: PreswapRequestDto): Promise<ChatResponseDto> {
    try {
      const {
        user_address,
        fromToken,
        toToken,
        fromAmount,
        curveType,
        version,
      } = swapMessage;

      const { aptos, accounts } = await aptosAgent(user_address);

      const swapRequest = {
        fromToken,
        toToken,
        amount: fromAmount,
        curveType,
        interactiveToken: 'from' as const,
        version,
      };

      const result = await swapTokensWithLiquidswap(
        swapRequest,
        aptos,
        accounts,
      );

      if (!result || !result.hash) {
        throw new HttpException(
          'Swap failed: Invalid response',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        message: 'Swap executed successfully',
        data: {
          transactionHash: result.hash,
          toAmount: result.toAmount,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Swap failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
