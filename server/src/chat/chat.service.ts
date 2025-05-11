import {
  AIMessage,
  HumanMessage,
  MessageContent,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { AgentType } from './entities/chat.entity';

@Injectable()
export class ChatService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService(ChatService.name);
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
      temperature: 0.7,
    });

    this.logger.log('AI model initialized');
  }

  private formatMessageContent(content: MessageContent): string {
    if (typeof content === 'string') {
      return content;
    }
    if (Array.isArray(content)) {
      return content
        .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
        .join(' ');
    }
    return JSON.stringify(content);
  }

  async processMessage(
    message: string,
    context: string = '',
    history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    agentType?: AgentType,
  ): Promise<string> {
    try {
      const messages = [
        new SystemMessage(
          'You are a specialized DeFi assistant with expertise in multiple protocols. You can help with:\n' +
            '- Token swaps and liquidity provision\n' +
            '- Portfolio analysis and position management\n' +
            '- Health factor monitoring and risk assessment\n' +
            '- Market analysis and price trends\n' +
            '- Borrowing, lending, and yield optimization\n' +
            '- Position management and withdrawals\n' +
            '- General DeFi strategy and protocol interactions',
        ),
      ];

      // Add conversation history
      history.forEach(({ role, content }) => {
        if (role === 'user') {
          messages.push(new HumanMessage(content));
        } else {
          messages.push(new AIMessage(content));
        }
      });

      // Add context if provided
      if (context) {
        messages.push(new SystemMessage(`Context: ${context}`));
      }

      // Add current message
      messages.push(new HumanMessage(message));

      const response = await this.model.invoke(messages);
      return this.formatMessageContent(response.content);
    } catch (error) {
      this.logger.error('Failed to process message with AI', error);
      throw error;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.model.invoke([new HumanMessage(prompt)]);
      return this.formatMessageContent(response.content);
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw error;
    }
  }
}
