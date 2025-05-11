import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';

@Injectable()
export class CetusIntent {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('CetusIntent');
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
    this.logger.log('Cetus Intent model initialized');
  }

  validateCetusIntent(params: any): string[] {
    const missingFields: string[] = [];
    const actionType = params.actionType;

    if (!actionType) {
      missingFields.push('actionType');
      return missingFields;
    }

    // switch (actionType) {
    //   case CetusActionType.STAKE:
    //   case CetusActionType.UNSTAKE:
    //   case CetusActionType.FARM:
    //     if (!params.token) missingFields.push('token');
    //     if (!params.amount) missingFields.push('amount');
    //     break;
    //   case CetusActionType.POOL:
    //   case CetusActionType.LIQUIDITY:
    //   case CetusActionType.APR:
    //   case CetusActionType.YIELD:
    //     if (!params.pool) missingFields.push('pool');
    //     break;
    // }

    return missingFields;
  }
}
