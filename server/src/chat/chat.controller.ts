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
  CetusActionType,
  CetusParams,
  DeFiIntent,
  IntentType,
  MarketParams,
  NaviActionType,
  NaviParams,
  SwapParams,
} from './entities/intent.entity';
import { ParamsField, SwapQuote } from './entities/swap.entity';
import { IntentService } from './intent';
import { MarketIntentService } from './intent/market.intent';
import { MarketService } from './services/market.service';
import { SwapService } from './services/swap.service';
import { NaviService } from './services/navi.service';

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

  private isSwapIntent(
    intent: DeFiIntent,
  ): intent is DeFiIntent & { params: SwapParams } {
    return intent.type === IntentType.SWAP;
  }

  private isMarketIntent(
    intent: DeFiIntent,
  ): intent is DeFiIntent & { params: MarketParams } {
    return intent.type === IntentType.MARKET;
  }

  private isNaviIntent(
    intent: DeFiIntent,
  ): intent is DeFiIntent & { params: NaviParams } {
    return (
      (intent.type === IntentType.ACTION ||
        intent.type === IntentType.QUERY ||
        intent.type === IntentType.INFO) &&
      typeof intent.agentActionType === 'string' &&
      Object.values(NaviActionType).includes(
        intent.agentActionType as NaviActionType,
      )
    );
  }

  private isCetusIntent(
    intent: DeFiIntent,
  ): intent is DeFiIntent & { params: CetusParams } {
    return (
      (intent.type === IntentType.ACTION ||
        intent.type === IntentType.QUERY ||
        intent.type === IntentType.INFO) &&
      typeof intent.agentActionType === 'string' &&
      Object.values(CetusActionType).includes(
        intent.agentActionType as CetusActionType,
      )
    );
  }

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
      return {
        type: ChatResponseType.BOT,
        message: `I need more information about the market data you're looking for. ${intent.context}`,
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

  private async handleNaviIntent(
    intent: DeFiIntent & { params: NaviParams },
    userId: string,
  ): Promise<ChatResponse> {
    try {
      if (intent.missingFields.length > 0) {
        return {
          type: ChatResponseType.ACTION_REQUIRED,
          message: `I need more information to process your request. ${
            intent.context
          }. Missing: ${intent.missingFields.join(', ')}.`,
          intent,
          agentType: AgentType.NAVI,
          actionType: intent.agentActionType || 'unknown',
        };
      }

      // Process based on action type
      const actionType =
        (intent.agentActionType as NaviActionType) || NaviActionType.PORTFOLIO;

      switch (actionType) {
        case NaviActionType.PORTFOLIO:
          return {
            type: ChatResponseType.DATA_VISUALIZATION,
            message: 'Here is your portfolio overview.',
            intent,
            agentType: AgentType.NAVI,
            actionType: NaviActionType.PORTFOLIO,
            visualizationType: 'portfolio',
            data: await this.naviService.getPortfolio(userId),
          };

        case NaviActionType.POSITION:
          return {
            type: ChatResponseType.DATA_VISUALIZATION,
            message: `Here are your positions for address ${intent.params.address}.`,
            intent,
            agentType: AgentType.NAVI,
            actionType: NaviActionType.POSITION,
            visualizationType: 'positions',
            data: await this.naviService.getPositions(intent.params.address!),
          };

        case NaviActionType.HEALTH:
          return {
            type: ChatResponseType.INFO,
            message: `Your health factor for address ${intent.params.address} is ${await this.naviService.getHealthFactor(
              intent.params.address!,
            )}.`,
            intent,
            agentType: AgentType.NAVI,
            actionType: NaviActionType.HEALTH,
          };

        case NaviActionType.REWARD: {
          const rewards = '0.00 NAVI';
          return {
            type: ChatResponseType.INFO,
            message: `Your current rewards are ${rewards}.`,
            intent,
            agentType: AgentType.NAVI,
            actionType: NaviActionType.REWARD,
          };
        }

        case NaviActionType.BORROW:
        case NaviActionType.SUPPLY:
        case NaviActionType.WITHDRAW:
        case NaviActionType.REPAY:
          return {
            type: ChatResponseType.ACTION_REQUIRED,
            message: `Would you like to ${actionType.toLowerCase()} ${
              intent.params.amount
            } ${intent.params.asset}?`,
            intent,
            agentType: AgentType.NAVI,
            actionType,
            data: {
              asset: intent.params.asset,
              amount: intent.params.amount,
            },
          };

        default: {
          // Process general request via Navi service
          const actionMessage = actionType ? `${String(actionType)}: ` : '';
          const response = await this.naviService.processNaviMessage(
            `${actionMessage}${JSON.stringify(intent.params)}`,
          );
          return {
            type: ChatResponseType.BOT,
            message: response,
            intent,
            agentType: AgentType.NAVI,
          };
        }
      }
    } catch (error) {
      return {
        type: ChatResponseType.ERROR,
        message: `Sorry, I encountered an error with Navi: ${error.message}`,
        agentType: AgentType.NAVI,
      };
    }
  }

  private async handleCetusIntent(
    intent: DeFiIntent & { params: CetusParams },
  ): Promise<ChatResponse> {
    try {
      if (intent.missingFields.length > 0) {
        return {
          type: ChatResponseType.ACTION_REQUIRED,
          message: `I need more information to process your Cetus request. ${
            intent.context
          }. Missing: ${intent.missingFields.join(', ')}.`,
          intent,
          agentType: AgentType.CETUS,
          actionType: intent.agentActionType || 'unknown',
        };
      }

      const actionType =
        (intent.agentActionType as CetusActionType) || CetusActionType.POOL;

      await Promise.resolve();

      switch (actionType) {
        case CetusActionType.POOL:
        case CetusActionType.LIQUIDITY: {
          const poolData = { liquidity: '1000000', volume24h: '500000' };
          return {
            type: ChatResponseType.DATA_VISUALIZATION,
            message: `Here is the information for ${intent.params.pool} pool.`,
            intent,
            agentType: AgentType.CETUS,
            actionType,
            visualizationType: 'pool',
            data: {
              pool: intent.params.pool,
              poolData,
            },
          };
        }

        case CetusActionType.APR:
        case CetusActionType.YIELD: {
          // Mock implementation
          const apr = '5.2%';
          return {
            type: ChatResponseType.INFO,
            message: `The current APR for ${intent.params.pool} pool is ${apr}.`,
            intent,
            agentType: AgentType.CETUS,
            actionType,
          };
        }

        case CetusActionType.STAKE:
        case CetusActionType.UNSTAKE:
        case CetusActionType.FARM:
          return {
            type: ChatResponseType.ACTION_REQUIRED,
            message: `Would you like to ${actionType.toLowerCase()} ${
              intent.params.amount
            } ${intent.params.token}?`,
            intent,
            agentType: AgentType.CETUS,
            actionType,
            data: {
              token: intent.params.token,
              amount: intent.params.amount,
            },
          };

        case CetusActionType.SWAP:
          // For Cetus swaps, redirect to the general swap handler
          return {
            type: ChatResponseType.ACTION_REQUIRED,
            message: `Would you like to swap on Cetus?`,
            intent,
            agentType: AgentType.CETUS,
            actionType: CetusActionType.SWAP,
          };

        default: {
          const actionMessage = actionType
            ? `${String(actionType)}`
            : 'unknown';
          return {
            type: ChatResponseType.BOT,
            message: `I'm processing your Cetus request for ${actionMessage}.`,
            intent,
            agentType: AgentType.CETUS,
          };
        }
      }
    } catch (error) {
      return {
        type: ChatResponseType.ERROR,
        message: `Sorry, I encountered an error with Cetus: ${error.message}`,
        agentType: AgentType.CETUS,
      };
    }
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
          agentType: chatMessage.agentType || AgentType.DEFAULT,
        };
      }

      if (this.isSwapIntent(intent)) {
        return this.handleSwapIntent(intent);
      }

      if (this.isMarketIntent(intent)) {
        return this.handleMarketIntent(intent);
      }

      if (this.isNaviIntent(intent)) {
        return this.handleNaviIntent(intent, chatMessage.userId);
      }

      if (this.isCetusIntent(intent)) {
        return this.handleCetusIntent(intent);
      }

      const response = await this.chatService.processMessage(
        chatMessage.content,
        intent?.context || '',
        [],
        chatMessage.agentType,
      );

      return {
        type: ChatResponseType.BOT,
        message: response,
        intent,
        agentType: chatMessage.agentType || AgentType.DEFAULT,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        type: ChatResponseType.ERROR,
        message: `Sorry, I encountered an error: ${errorMessage}`,
        agentType: chatMessage.agentType || AgentType.DEFAULT,
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
