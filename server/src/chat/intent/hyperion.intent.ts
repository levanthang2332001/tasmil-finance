import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { ChatRequest, ChatResponse } from '../entities/chat.entity';
import {
  EstimatePoolRequest,
  EstimateSwapRequest,
} from '../entities/hyperion.entity';
import { DeFiIntent } from '../entities/intent.entity';
import { HyperionService } from '../services/hyperion.service';

@Injectable()
export class HyperionIntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;
  private readonly hyperionService: HyperionService;

  constructor() {
    this.hyperionService = new HyperionService();
    this.logger = new LoggerService('HyperionIntentService');
    this.initializeModel();
  }

  private initializeModel(): void {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4-turbo-preview',
      temperature: 0,
    });
    this.logger.log('Hyperion Intent model initialized');
  }

  validateSwapIntent(params: EstimateSwapRequest): string[] {
    const missingFields: string[] = [];
    if (!params.fromToken) missingFields.push('fromToken');
    if (!params.toToken) missingFields.push('toToken');
    if (!params.amount) missingFields.push('amount');
    return missingFields;
  }

  validateLiquidityIntent(params: EstimatePoolRequest): string[] {
    const missingFields: string[] = [];
    if (!params.currencyA) missingFields.push('currencyA');
    if (!params.currencyB) missingFields.push('currencyB');
    if (!params.currencyAAmount) missingFields.push('currencyAAmount');
    if (!params.feeTierIndex) missingFields.push('feeTierIndex');
    if (!params.currentPriceTick) missingFields.push('currentPriceTick');
    if (!params.tickLower) missingFields.push('tickLower');
    if (!params.tickUpper) missingFields.push('tickUpper');
    return missingFields;
  }

  async handleHyperionSwapIntent(
    intent: DeFiIntent & { params: EstimateSwapRequest },
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    if (intent.missingFields && intent.missingFields.length < 0) {
      const missingField = intent.missingFields[0] as keyof EstimateSwapRequest;
      return {
        message: `I need more information to process your swap request. What ${missingField} would you like to use?`,
        intent,
      };
    }

    const quote = await this.hyperionService.estimateSwap({
      fromToken: intent.params.fromToken,
      toToken: intent.params.toToken,
      amount: intent.params.amount,
    });
    return {
      message: 'Hyperion swap intent',
      intent,
    };
  }

  async handleHyperionLiquidityIntent(
    intent: DeFiIntent & { params: EstimatePoolRequest },
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    if (intent.missingFields && intent.missingFields.length < 0) {
      const missingField = intent.missingFields[0] as keyof EstimatePoolRequest;
      return {
        message: `I need more information to process your liquidity request. What ${missingField} would you like to use?`,
        intent,
      };
    }

    const quote = await this.hyperionService.estimatePool({
      currencyA: intent.params.currencyA,
      currencyB: intent.params.currencyB,
      currencyAAmount: intent.params.currencyAAmount,
    });

    return {
      message: 'Hyperion liquidity intent',
      intent,
    };
  }
}
