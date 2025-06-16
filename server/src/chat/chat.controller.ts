/* eslint-disable @typescript-eslint/require-await */
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ErrorResponse } from './dto/error-response.dto';

import {
  ChatRequest,
  ChatResponse,
  MessageHistoryEntry,
} from './entities/chat.entity';

import { DeFiIntent } from './entities/intent.entity';
import { IntentService } from './services/intent.service';
import { SuccessResponse } from './dto/success-response.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  private messageHistory: Map<string, MessageHistoryEntry[]> = new Map();
  private readonly intentService: IntentService;
  private readonly chatService: ChatService;

  constructor() {
    this.intentService = new IntentService();
    this.chatService = new ChatService();
  }

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

  private async handleObjectKeyIntent(
    intent: DeFiIntent,
    chatMessage: ChatRequest,
  ): Promise<ChatResponse> {
    const intentHandlers = {
      default: () => this.handleDefaultIntent(intent, chatMessage),
    };

    const handler = intentHandlers[intent.agentType] ?? intentHandlers.default;
    return handler?.();
  }

  private async handleError(error: unknown): Promise<ChatResponse> {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      message: `Sorry, I encountered an error: ${errorMessage}`,
    };
  }

  @Post('message')
  @ApiOkResponse({
    description: 'Message processed successfully',
    type: SuccessResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ErrorResponse,
  })
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
      return this.handleError(error);
    }
  }
}
