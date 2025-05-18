/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

import {
  AgentType,
  ChatRequest,
  ChatResponse,
  MessageHistoryEntry,
} from './entities/chat.entity';
import { DeFiIntent } from './entities/intent.entity';
import { BorrowParams } from './entities/navi/borrow.entity';
import { RepayParams } from './entities/navi/repay.entity';
import { SupplyParams } from './entities/navi/supply.entity';
import { WithdrawParams } from './entities/navi/withdraw.entity';
import { IntentService } from './intent';
import { MarketIntentService } from './intent/market.intent';
import { NaviIntentService } from './intent/navi.intent';
import { MarketService } from './services/market.service';
import { NaviService } from './services/navi.service';
// import Cetus services
import { CetusSwapService } from './services/swap.service';
import {
  SwapParams,
  ParamsField,
  SwapQuote,
} from './entities/cetus/swap.entity';
import { ChatResponseType } from './entities/cetus/cetus.entity';

@Controller('chat')
export class ChatController {
  private messageHistory: Map<string, MessageHistoryEntry[]> = new Map();

  constructor(
    private readonly intentService: IntentService,
    private readonly swapService: CetusSwapService,
    private readonly chatService: ChatService,
    private readonly marketService: MarketService,
    private readonly marketIntentService: MarketIntentService,
    private readonly naviService: NaviService,
    private readonly naviIntent: NaviIntentService,
  ) {}

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

  // private async handleMarketIntent(
  //   intent: DeFiIntent & { params: MarketParams },
  // ): Promise<ChatResponse> {
  //   if (intent.missingFields.length > 0) {
  //     const missingField = intent.missingFields[0] as keyof MarketParams;
  //     const response =
  //       this.marketIntentService.getMissingParameterPrompt(missingField);
  //     return {
  //       type: ChatResponseType.BOT,
  //       message: `${intent.context ? intent.context + '\n' : ''}${response}`,
  //       intent,
  //     };
  //   }

  //   const formatToken =
  //     normalizeChainName(intent.params.token as string) || 'bitcoin';

  //   const quote = await this.marketService.getTokenInfo(formatToken);
  //   const analysisIntent = await this.marketIntentService.analysisIntent(quote);

  //   return {
  //     type: ChatResponseType.BOT,
  //     message: `Here's the market data for ${intent.params.token} over ${intent.params.timeframe} timeframe.
  //      ${analysisIntent}`,
  //     intent,
  //   };
  // }

  private async handleBorrowIntent(
    intent: DeFiIntent & { params: BorrowParams },
  ): Promise<ChatResponse> {
    return {
      message: `Here's the borrow data for ${intent.params.amount} ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleWithdrawIntent(
    intent: DeFiIntent & { params: WithdrawParams },
  ): Promise<ChatResponse> {
    return {
      message: `Here's the withdraw data for ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleRepayIntent(
    intent: DeFiIntent & { params: RepayParams },
  ): Promise<ChatResponse> {
    return {
      message: `Here's the repay data for ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleDefaultIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    console.log('default intent', intent);
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

  private async handleNaviIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      default: () => this.handleDefaultIntent(intent, chatMessage),
      borrow: () =>
        this.handleBorrowIntent(
          intent as DeFiIntent & { params: BorrowParams },
        ),
      withdraw: () => this.handleWithdrawIntent(intent),
      repay: () => this.handleRepayIntent(intent),
    };

    const handler =
      (await intentHandlers[intent.actionType ?? 'default']) ??
      intentHandlers.default;
    return handler?.();
  }

  private async handleCetusIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      default: () => this.handleDefaultIntent(intent, chatMessage),
      swap: () => this.handleSwapIntent(intent),
    };

    const handler = intentHandlers.swap;
    return handler();
  }

  private async handleObjectKeyIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      default: () => this.handleDefaultIntent(intent, chatMessage),
      navi: () => this.handleNaviIntent(intent, chatMessage),
      cetus: () => this.handleCetusIntent(intent, chatMessage),
    };

    const handler =
      intentHandlers[intent.agentType ?? 'default'] ?? intentHandlers.default;
    return handler?.();
  }

  @Post('message')
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
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        message: `Sorry, I encountered an error: ${errorMessage}`,
      };
    }
  }

  @Post('execute-swap')
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
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        message: `Sorry, I couldn't execute the swap: ${errorMessage}`,
      };
    }
  }
}
