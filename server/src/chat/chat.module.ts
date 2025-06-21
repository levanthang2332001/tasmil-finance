import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { IntentService } from './services/intent.service';
import { VoiceService } from './services/voice.service';
import { VoiceController } from './voice.controller';

@Module({
  controllers: [ChatController, VoiceController],
  providers: [IntentService, VoiceService],
  exports: [IntentService],
})
export class ChatModule {}
