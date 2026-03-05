import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { IntentService } from './services/intent.service';
import { VoiceService } from './services/voice.service';
import { SwapService } from './services/swap.service';
import { VoiceController } from './voice.controller';
import { SwapController } from './swap.controller';
import { BridgeController } from './bridge.controller';
import { BridgeService } from './services/bridge.service';
import { AppJwtModule } from 'src/infra/jwt/jwt.module';

@Module({
  imports: [AppJwtModule],
  controllers: [
    ChatController,
    VoiceController,
    SwapController,
    BridgeController,
  ],
  providers: [IntentService, VoiceService, SwapService, BridgeService],
  exports: [IntentService],
})
export class ChatModule {}
