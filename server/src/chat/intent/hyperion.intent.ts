import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import {
  EstimatePoolRequest,
  EstimateSwapRequest,
} from '../entities/hyperion.entity';

@Injectable()
export class HyperionIntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;

  constructor() {
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
}
