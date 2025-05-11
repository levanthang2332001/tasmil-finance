import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { IntentService } from './intent';
import { MarketService } from './services/market.service';
import { CetusSwapService } from './services/cetus/swap.service';
import { MarketIntentService } from './intent/market.intent';
import { SwapIntentService } from './intent/swap.intent';
import { NaviIntentService } from './intent/navi.intent';
import { NaviService } from './services/navi/navi.service';
@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    IntentService,
    MarketService,
    CetusSwapService,
    MarketIntentService,
    SwapIntentService,
    NaviService,
    NaviIntentService,
  ],
  exports: [ChatService],
})
export class ChatModule {}
