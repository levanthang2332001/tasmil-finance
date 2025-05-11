import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { NaviActionType, NaviParams } from '../entities/intent.entity';
import { ParamsField } from '../entities/swap.entity';

@Injectable()
export class NaviIntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('NaviIntentService');
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
    this.logger.log('Navi Intent model initialized');
  }

  getMissingParameterPrompt(missingField: ParamsField): string {
    const prompts: Record<ParamsField, string> = {
      [ParamsField.FROM_TOKEN]: 'Please provide the fromToken parameter.',
      [ParamsField.TO_TOKEN]: 'Please provide the toToken parameter.',
      [ParamsField.AMOUNT]: 'Please provide the amount parameter.',
      [ParamsField.CHAIN_ID]: 'Please provide the chainId parameter.',
    };
    return prompts[missingField];
  }

  validateHealthIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    if (!params.address) missingFields.push('address');
    return missingFields;
  }

  validatePortfolioIntent(): string[] {
    const missingFields: string[] = [];
    return missingFields;
  }

  validateBorrowIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    if (!params.asset) missingFields.push('asset');
    if (!params.amount) missingFields.push('amount');
    return missingFields;
  }

  validateSupplyIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    if (!params.asset) missingFields.push('asset');
    if (!params.amount) missingFields.push('amount');
    return missingFields;
  }

  validateWithdrawIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    if (!params.asset) missingFields.push('asset');
    if (!params.amount) missingFields.push('amount');
    return missingFields;
  }

  validateRepayIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    if (!params.asset) missingFields.push('asset');
    if (!params.amount) missingFields.push('amount');
    return missingFields;
  }

  validatePositionIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    if (!params.address) missingFields.push('address');
    return missingFields;
  }

  validateRewardIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    if (!params.address) missingFields.push('address');
    return missingFields;
  }
}
