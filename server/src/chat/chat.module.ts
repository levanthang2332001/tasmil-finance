import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { IntentService } from './services/intent.service';
import { VoiceService } from './services/voice.service';
import { VoiceController } from './voice.controller';

@Module({
  controllers: [ChatController, VoiceController],
  providers: [ChatService, IntentService, VoiceService],
  exports: [ChatService],
})
export class ChatModule {}
