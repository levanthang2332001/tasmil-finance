/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ErrorResponse } from './dto/error-response.dto';
import {
  ParamsField,
  SwapParams,
  SwapQuote,
} from './entities/cetus/swap.entity';
import {
  ChatRequest,
  ChatResponse,
  MessageHistoryEntry,
} from './entities/chat.entity';
import {
  EstimatePoolRequest,
  EstimateSwapRequest,
  ExecuteCreatePoolRequest,
  ExecuteSwapRequest,
  HYPERION_ACTION,
} from './entities/hyperion.entity';
import { DeFiIntent } from './entities/intent.entity';
import { IntentService } from './intent';
import { HyperionIntentService } from './intent/hyperion.intent';
import { HyperionService } from './services/hyperion.service';
import { CetusSwapService } from './services/swap.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  private messageHistory: Map<string, MessageHistoryEntry[]> = new Map();
  private readonly hyperionIntentService: HyperionIntentService;
  private readonly intentService: IntentService;
  private readonly swapService: CetusSwapService;
  private readonly hyperionService: HyperionService;
  private readonly chatService: ChatService;

  constructor() {
    this.hyperionIntentService = new HyperionIntentService();
    this.intentService = new IntentService();
    this.swapService = new CetusSwapService();
    this.hyperionService = new HyperionService();
    this.chatService = new ChatService();
  }

  private getRecentMessages(userId: string, limit: number = 3): string {
    const userMessages = this.messageHistory.get(userId) || [];
    const recentMessages = userMessages
      .slice(-limit)
      .map((entry) => entry.content)
      .join('\n');
    return recentMessages;
  }

  private updateMessageHistory(userId: string, content: string): void {
    const userMessages = this.messageHistory.get(userId) || [];
    userMessages.push({
      content,
      timestamp: Date.now(),
    });
    // Keep only last 10 messages
    if (userMessages.length > 10) {
      userMessages.shift();
    }
    this.messageHistory.set(userId, userMessages);
  }

  private async handleSwapIntent(
    intent: DeFiIntent & { params: SwapParams },
  ): Promise<ChatResponse> {
    if (intent.missingFields && intent.missingFields.length < 0) {
      const missingField = intent.missingFields[0] as ParamsField;
      return {
        message: `I need more information to process your swap request. What ${missingField} would you like to use?`,
        intent,
      };
    }

    const quote = await this.swapService.getSwapQuote({
      fromToken: intent.params.fromToken!,
      toToken: intent.params.toToken!,
      amount: intent.params.amount ? parseFloat(intent.params.amount) : 1,
      a2b: intent.params.a2b ?? true,
      byAmountIn: intent.params.byAmountIn ?? true,
    });

    console.log('quote', quote);

    return {
      message: `I found a swap route for you:
      Input: ${quote.amountIn} ${intent.params.fromToken}
      Output: ${quote.amountOut} ${intent.params.toToken}
      amount: ${intent.params.amount}
      Gas Price: ${quote.fee}
      Would you like to proceed with the swap?`,
      quote,
      intent,
    };
  }

  private async handleDefaultIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    console.log('=> default intent', intent);
    const response = await this.chatService.processMessage(
      chatMessage.content,
      intent?.context || '',
      [],
    );

    return {
      message: response,
      intent,
    };
  }

  private async handleHyperionIntent(
    intent: DeFiIntent & { params: EstimateSwapRequest | EstimatePoolRequest },
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      swap: () =>
        this.hyperionIntentService.handleHyperionSwapIntent(
          intent as DeFiIntent & { params: EstimateSwapRequest },
          chatMessage,
        ),
      liquidity: () =>
        this.hyperionIntentService.handleHyperionLiquidityIntent(
          intent as DeFiIntent & { params: EstimatePoolRequest },
          chatMessage,
        ),
      default: () => this.handleDefaultIntent(intent, chatMessage),
    };

    const handler =
      intentHandlers[intent.actionType as HYPERION_ACTION] ??
      intentHandlers.default;
    return handler();
  }

  private async handleCetusIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      default: () => this.handleDefaultIntent(intent, chatMessage),
      // swap: () => this.handleSwapIntent(intent),
    };

    const handler = intentHandlers.default;
    return handler();
  }

  private async handleObjectKeyIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      default: () => this.handleDefaultIntent(intent, chatMessage),
      hyperion: () =>
        this.handleHyperionIntent(
          intent as DeFiIntent & {
            params: EstimateSwapRequest | EstimatePoolRequest;
          },
          chatMessage,
        ),
      cetus: () => this.handleCetusIntent(intent, chatMessage),
    };

    const handler = intentHandlers[intent.agentType] ?? intentHandlers.default;
    return handler?.();
  }

  private async handleError(error: unknown): Promise<ChatResponse> {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      message: `Sorry, I encountered an error: ${errorMessage}`,
    };
  }

  @Post('message')
  @ApiOkResponse({
    description: 'Message processed successfully',
    type: Object,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
  async sendMessage(@Body() chatMessage: ChatRequest): Promise<ChatResponse> {
    try {
      this.updateMessageHistory(chatMessage.userId, chatMessage.content);
      const recentContext = this.getRecentMessages(chatMessage.userId);

      // Extract intent including agent-specific context
      const intent = await this.intentService.extractIntent(
        `Previous messages:\n${recentContext}\n\nCurrent message: ${chatMessage.content}`,
        chatMessage.agentType,
      );

      if (!intent) {
        return {
          message:
            "I couldn't understand your request. Please try again with more details.",
          intent: undefined,
        };
      }

      return this.handleObjectKeyIntent(intent, chatMessage);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('execute-swap-liquid-swap')
  async executeSwap(
    @Body() quote: SwapQuote,
    @Body() signer: string,
  ): Promise<ChatResponse> {
    try {
      const txHash = (await this.swapService.getTxHash(
        quote,
        signer,
      )) as unknown as string;
      return {
        message: `Great! Your swap has been executed. You can track the transaction here: ${txHash}`,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('execute-swap-hyperion')
  async executeSwapHyperion(
    @Body() quote: ExecuteSwapRequest,
    @Body() signer: string,
  ): Promise<ChatResponse> {
    try {
      const txHash = await this.hyperionService.executeSwap(quote);
      return {
        message: `Great! Your swap has been executed. You can track the transaction here: `,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('execute-create-pool-hyperion')
  async executeCreatePoolHyperion(
    @Body() quote: ExecuteCreatePoolRequest,
    @Body() signer: string,
  ): Promise<ChatResponse> {
    try {
      const txHash = await this.hyperionService.executePool(quote);
      return {
        message: `Great! Your liquidity has been executed. You can track the transaction here: `,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('execute-add-liquidity-hyperion')
  async executeAddLiquidityHyperion(
    @Body() quote: ExecuteCreatePoolRequest,
    @Body() signer: string,
  ): Promise<ChatResponse> {
    try {
      // const txHash = await this.hyperionService.executeAddLiquidity(quote);
      return {
        message: `Great! Your liquidity has been executed. You can track the transaction here: `,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post('execute-remove-liquidity-hyperion')
  async executeRemoveLiquidityHyperion(
    @Body() quote: ExecuteCreatePoolRequest,
    @Body() signer: string,
  ): Promise<ChatResponse> {
    try {
      // const txHash = await this.hyperionService.executeRemoveLiquidity(quote);
      return {
        message: `Great! Your liquidity has been executed. You can track the transaction here: `,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}
