import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/chat/services/logger.service';
import { clearResponse } from 'src/utils/function';
import { AgentType } from '../entities/chat.entity';
import { DeFiIntent } from '../entities/intent.entity';

@Injectable()
export class IntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('IntentService');
    this.initializeModel();
  }

  private initializeModel(): void {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4o-mini',
      temperature: 0,
    });
    this.logger.log('Intent model initialized');
  }

  async extractIntent(
    message: string,
    agentType?: AgentType,
  ): Promise<DeFiIntent> {
    try {
      const systemPrompt = `You are a DeFi intent parser. Extract the user's intent and parameters from their message.
           Analyze both the current message and previous context to determine missing fields.
           Return a JSON object with the following structure:
           {
             "agentType": "${agentType || 'unknown'}",
             "actionType": one of ["unknown"],
             "params": {
               // Parameters based on the intent type
             },
             "confidence": number (0-1),
             "missingFields": string[],
             "context": string (brief explanation of what was understood and what's missing)
           }`;

      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(message),
      ]);

      const cleanContent = clearResponse(response.content as string);
      const intent = JSON.parse(cleanContent) as DeFiIntent;

      // Force agentType to match the input parameter
      intent.agentType = agentType || 'unknown';

      // Validate params based on agentType
      switch (intent.agentType) {
        default:
          intent.missingFields = [];
      }

      this.logger.log(`Extracted intent: ${JSON.stringify(intent)}`);
      return intent;
    } catch (error) {
      this.logger.error('Failed to extract intent', error);
      throw error;
    }
  }
}
