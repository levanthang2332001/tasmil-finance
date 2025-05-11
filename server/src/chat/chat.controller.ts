/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Post } from '@nestjs/common';
import { ChainId, normalizeChainName } from 'src/shared/utils/token-address';
import { getTxHash } from 'src/shared/utils/tx-hash';
import { ChatService } from './chat.service';
import {
  AgentType,
  ChatMessage,
  ChatResponse,
  ChatResponseType,
  MessageHistoryEntry,
} from './entities/chat.entity';
import {
  BorrowParams,
  CetusActionType,
  CetusParams,
  DeFiIntent,
  HealthParams,
  IntentType,
  MarketParams,
  NaviActionType,
  NaviParams,
  PortfolioParams,
  PositionParams,
  RepayParams,
  RewardParams,
  StakeParams,
  SupplyParams,
  SwapParams,
  UnstakeParams,
  WithdrawParams,
} from './entities/intent.entity';
import { ParamsField, SwapQuote } from './entities/swap.entity';
import { IntentService } from './intent';
import { MarketIntentService } from './intent/market.intent';
import { MarketService } from './services/market.service';
import { SwapService } from './services/swap.service';
import { NaviService } from './services/navi.service';
import { NaviIntentService } from './intent/navi.intent';
@Controller('chat')
export class ChatController {
  private messageHistory: Map<string, MessageHistoryEntry[]> = new Map();

  constructor(
    private readonly intentService: IntentService,
    private readonly swapService: SwapService,
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

  // private isSwapIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: SwapParams } {
  //   return intent.type === IntentType.SWAP;
  // }

  // private isMarketIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: MarketParams } {
  //   return intent.type === IntentType.MARKET;
  // }

  // private isHealthIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: HealthParams } {
  //   return intent.type === IntentType.HEALTH;
  // }

  // private isPortfolioIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: PortfolioParams } {
  //   return intent.type === IntentType.PORTFOLIO;
  // }

  // private isBorrowIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: BorrowParams } {
  //   return intent.type === IntentType.BORROW;
  // }

  // private isSupplyIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: SupplyParams } {
  //   return intent.type === IntentType.SUPPLY;
  // }

  // private isWithdrawIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: WithdrawParams } {
  //   return intent.type === IntentType.WITHDRAW;
  // }

  // private isRepayIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: RepayParams } {
  //   return intent.type === IntentType.REPAY;
  // }

  // private isPositionIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: PositionParams } {
  //   return intent.type === IntentType.POSITION;
  // }

  // private isRewardIntent(
  //   intent: DeFiIntent,
  // ): intent is DeFiIntent & { params: RewardParams } {
  //   return intent.type === IntentType.REWARD;
  // }

  private async handleSwapIntent(
    intent: DeFiIntent & { params: SwapParams },
  ): Promise<ChatResponse> {
    if (intent.missingFields.length > 0) {
      const missingField = intent.missingFields[0] as ParamsField;
      const response = this.swapService.getMissingParameterPrompt(missingField);
      return {
        type: ChatResponseType.BOT,
        message: `${intent.context ? intent.context + '\n' : ''}${response}`,
        intent,
      };
    }

    const quote = await this.swapService.getSwapQuote({
      fromToken: intent.params.fromToken!,
      toToken: intent.params.toToken!,
      amount: intent.params.amount ? parseFloat(intent.params.amount) : 1,
      chainId: intent.params.chainId ?? ChainId.ETHEREUM,
    });

    return {
      type: ChatResponseType.SWAP_QUOTE,
      message: `I found a swap route for you:
      Input: ${quote.amountIn} ${intent.params.fromToken}
      Output: ${quote.amountOut} ${intent.params.toToken}
      Gas Price: ${quote.gasPrice}
      Would you like to proceed with the swap?`,
      quote,
      intent,
    };
  }

  private async handleMarketIntent(
    intent: DeFiIntent & { params: MarketParams },
  ): Promise<ChatResponse> {
    if (intent.missingFields.length > 0) {
      const missingField = intent.missingFields[0] as keyof MarketParams;
      const response =
        this.marketIntentService.getMissingParameterPrompt(missingField);
      return {
        type: ChatResponseType.BOT,
        message: `${intent.context ? intent.context + '\n' : ''}${response}`,
        intent,
      };
    }

    const formatToken =
      normalizeChainName(intent.params.token as string) || 'bitcoin';

    const quote = await this.marketService.getTokenInfo(formatToken);
    const analysisIntent = await this.marketIntentService.analysisIntent(quote);

    return {
      type: ChatResponseType.BOT,
      message: `Here's the market data for ${intent.params.token} over ${intent.params.timeframe} timeframe.
       ${analysisIntent}`,
      intent,
    };
  }

  private async handlePortfolioIntent(
    intent: DeFiIntent & { params: PortfolioParams },
  ): Promise<ChatResponse> {
    if (intent.missingFields.length > 0) {
      const missingField = intent.missingFields[0] as ParamsField;
      const response = this.naviIntent.getMissingParameterPrompt(missingField);
      return {
        type: ChatResponseType.BOT,
        message: `${intent.context ? intent.context + '\n' : ''}${response}`,
        intent,
      };
    }
    return {
      type: ChatResponseType.BOT,
      message: `Here's the portfolio data for ${intent.params.address}.`,
      intent,
    };
  }

  private async handleHealthIntent(
    intent: DeFiIntent & { params: HealthParams },
  ): Promise<ChatResponse> {
    return {
      type: ChatResponseType.BOT,
      message: `Here's the health data for ${intent.params.address}.`,
      intent,
      data: await this.naviService.getHealthFactor(intent.params.address!),
    };
  }

  private async handleBorrowIntent(
    intent: DeFiIntent & { params: BorrowParams },
  ): Promise<ChatResponse> {
    return {
      type: ChatResponseType.BOT,
      message: `Here's the borrow data for ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleSupplyIntent(
    intent: DeFiIntent & { params: SupplyParams },
  ): Promise<ChatResponse> {
    return {
      type: ChatResponseType.BOT,
      message: `Here's the supply data for ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleWithdrawIntent(
    intent: DeFiIntent & { params: WithdrawParams },
  ): Promise<ChatResponse> {
    return {
      type: ChatResponseType.BOT,
      message: `Here's the withdraw data for ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleRepayIntent(
    intent: DeFiIntent & { params: RepayParams },
  ): Promise<ChatResponse> {
    return {
      type: ChatResponseType.BOT,
      message: `Here's the repay data for ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleDefaultIntent(
    intent: DeFiIntent,
    chatMessage: ChatMessage,
  ) {
    const response = await this.chatService.processMessage(
      chatMessage.content,
      intent?.context || '',
      [],
    );

    return {
      type: ChatResponseType.BOT,
      message: response,
      intent,
    };
  }

  private async handleObjectKeyIntent(
    intent: DeFiIntent,
    chatMessage: ChatMessage,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      default: () => this.handleDefaultIntent(intent, chatMessage),
      swap: () => this.handleSwapIntent(intent),
      market: () => this.handleMarketIntent(intent),
      health: () => this.handleHealthIntent(intent),
      portfolio: () => this.handlePortfolioIntent(intent),
      borrow: () => this.handleBorrowIntent(intent),
      supply: () => this.handleSupplyIntent(intent),
      withdraw: () => this.handleWithdrawIntent(intent),
      repay: () => this.handleRepayIntent(intent),
    };

    const handler = intentHandlers[intent.type ?? 'default'];
    return handler?.();
  }

  @Post('message')
  async sendMessage(@Body() chatMessage: ChatMessage): Promise<ChatResponse> {
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
          type: ChatResponseType.BOT,
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
        type: ChatResponseType.ERROR,
        message: `Sorry, I encountered an error: ${errorMessage}`,
      };
    }
  }

  @Post('execute-swap')
  async executeSwap(@Body() quote: SwapQuote): Promise<ChatResponse> {
    try {
      const txHash = await this.swapService.executeSwap(quote);
      return {
        type: ChatResponseType.SWAP_EXECUTED,
        message: `Great! Your swap has been executed. You can track the transaction here: ${getTxHash(txHash, quote.chainId)}`,
        txHash,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        type: ChatResponseType.ERROR,
        message: `Sorry, I couldn't execute the swap: ${errorMessage}`,
      };
    }
  }
}
