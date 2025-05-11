import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { SwapParams } from '../entities/cetus/swap.entity';
@Injectable()
export class SwapIntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('SwapIntentService');
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
    this.logger.log('Swap Intent model initialized');
  }

  validateSwapIntent(params: SwapParams): string[] {
    const missingFields: string[] = [];
    if (!params.fromToken) missingFields.push('fromToken');
    if (!params.toToken) missingFields.push('toToken');
    if (!params.amount) missingFields.push('amount');
    if (!params.chainId) missingFields.push('chainId');
    return missingFields;
  }
}
