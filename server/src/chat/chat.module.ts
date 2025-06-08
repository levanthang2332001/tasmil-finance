import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { IntentService } from './intent';
import { MarketIntentService } from './intent/market.intent';
import { SwapIntentService } from './intent/swap.intent';
import { HyperionService } from './services/hyperion.service';
import { MarketService } from './services/market.service';
import { CetusSwapService } from './services/swap.service';
import { VoiceService } from './services/voice.service';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    IntentService,
    MarketService,
    CetusSwapService,
    MarketIntentService,
    SwapIntentService,
    HyperionService,
    VoiceService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
