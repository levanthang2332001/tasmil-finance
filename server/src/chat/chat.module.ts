import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { IntentService } from './intent';
import { MarketService } from './services/market.service';
import { SwapService } from './services/swap.service';
import { MarketIntentService } from './intent/market.intent';
import { SwapIntentService } from './intent/swap.intent';
import { NaviService } from './services/navi.service';
@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    IntentService,
    MarketService,
    SwapService,
    MarketIntentService,
    SwapIntentService,
    NaviService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
