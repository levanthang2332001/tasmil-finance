/* eslint-disable @typescript-eslint/require-await */
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from './chat.service';
import {
  ParamsField,
  SwapParams,
  SwapQuote,
} from './entities/cetus/swap.entity';
import {
  ChatRequest,
  ChatResponse,
  MessageHistoryEntry
} from './entities/chat.entity';
import { DeFiIntent } from './entities/intent.entity';
import { BorrowParams } from './entities/navi/borrow.entity';
import {
  NAVI_ACTION_TEST,
  RepayParams,
  SupplyParams,
  WithdrawParams
} from './entities/navi/navi.entity';
import { IntentService } from './intent';
import { NaviIntentService } from './intent/navi.intent';
import { MarketService } from './services/market.service';
import { NaviService } from './services/navi.service';
import { CetusSwapService } from './services/swap.service';
import { VoiceService } from './services/voice.service';

@Controller('chat')
export class ChatController {
  private messageHistory: Map<string, MessageHistoryEntry[]> = new Map();

  constructor(
    private readonly intentService: IntentService,
    private readonly swapService: CetusSwapService,
    private readonly chatService: ChatService,
    private readonly marketService: MarketService,
    private readonly naviService: NaviService,
    private readonly naviIntent: NaviIntentService,
    private readonly voiceService: VoiceService,
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

  private async handleSupplyIntent(
    intent: DeFiIntent & { params: SupplyParams },
  ): Promise<ChatResponse> {
    // if (intent.missingFields && intent.missingFields.length < 0) {
    //   const missingField = intent.missingFields[0] as keyof SupplyParams;
    //   return {
    //     message: `I need more information to process your supply request. What ${missingField} would you like to use?`,
    //     intent,
    //   };
    // }
    return {
      message: `Here's the supply data for ${intent.params.amount} ${intent.params.asset}.`,
      intent,
    };
  }

  private async handleBorrowIntent(
    intent: DeFiIntent & { params: BorrowParams },
  ): Promise<ChatResponse> {
    // if (intent.missingFields && intent.missingFields.length < 0) {
    //   const missingField = intent.missingFields[0] as keyof BorrowParams;
    //   return {
    //     message: `I need more information to process your borrow request. What ${missingField} would you like to use?`,
    //     intent,
    //   };
    // }
    try {
      const borrow = await this.naviService.getBorrow(
        parseFloat(intent.params.amount),
      );
      console.log('borrow', borrow);
      return {
        message: `Here's the borrow data for ${intent.params.amount} ${intent.params.asset}.`,
        intent,
      };
    } catch (error) {
      return {
        message: `Sorry, I encountered an error: ${error}`,
        intent: {
          ...intent,
          actionType: 'unknown',
        },
      };
    }
  }

  private async handleRepayIntent(
    intent: DeFiIntent & { params: RepayParams },
  ): Promise<ChatResponse> {
    // if (intent.missingFields && intent.missingFields.length < 0) {
    //   const missingField = intent.missingFields[0] as keyof RepayParams;
    //   return {
    //     message: `I need more information to process your repay request. What ${missingField} would you like to use?`,
    //     intent,
    //   };
    // }
    try {
      const repay = await this.naviService.getRepay(
        parseFloat(intent.params.amount!),
      );
      console.log('repay', repay);
      return {
        message: `Here's the repay data for ${intent.params.amount} ${intent.params.asset}.`,
        intent,
      };
    } catch (error) {
      return {
        message: `Sorry, I encountered an error: ${error}`,
        intent: {
          ...intent,
          actionType: 'unknown',
        },
      };
    }
  }

  private async handleWithdrawIntent(
    intent: DeFiIntent & { params: WithdrawParams },
  ): Promise<ChatResponse> {
    // if (intent.missingFields && intent.missingFields.length < 0) {
    //   const missingField = intent.missingFields[0] as keyof WithdrawParams;
    //   return {
    //     message: `I need more information to process your withdraw request. What ${missingField} would you like to use?`,
    //     intent,
    //   };
    // }
    try {
      const withdraw = await this.naviService.getWithdraw(
        parseFloat(intent.params.amount!),
      );
      console.log('withdraw', withdraw);
      return {
        message: `Here's the withdraw data for ${intent.params.amount} ${intent.params.asset}.`,
        intent,
      };
    } catch (error) {
      return {
        message: `Sorry, I encountered an error: ${error}`,
        intent: {
          ...intent,
          actionType: 'unknown',
        },
      };
    }
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

  private async handleNaviIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      borrow: () =>
        this.handleBorrowIntent(
          intent as DeFiIntent & { params: BorrowParams },
        ),
      withdraw: () => this.handleWithdrawIntent(intent),
      supply: () => this.handleSupplyIntent(intent),
      repay: () => this.handleRepayIntent(intent),
      default: () => this.handleDefaultIntent(intent, chatMessage),
    };

    const handler =
      intentHandlers[intent.actionType as NAVI_ACTION_TEST] ??
      intentHandlers.default;
    return handler();
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

    const handler = intentHandlers[intent.agentType] ?? intentHandlers.default;
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
  @Post('transcribe')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      // fileFilter: (_req, file, cb) => {
      //   if (!file.mimetype.match(/^audio\/(mpeg|mp4|wav|ogg|webm)$/)) {
      //     return cb(new Error('Only audio files are allowed!'), false);
      //   }
      //   cb(null, true);
      // },
      // limits: {
      //   fileSize: 10 * 1024 * 1024, // 10MB limit
      // },
    }),
  )
  async transcribe(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ transcript: string }> {
    try {
      if (!file) {
        throw new Error('No audio file provided');
      }

      const transcript = await this.voiceService.transcribeAudio(file);
      return { transcript };
    } catch (error) {
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    } finally {
      // Clean up the uploaded file after processing
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error deleting file ${file.path}:`, err);
        }
      });
    }
  }
}
