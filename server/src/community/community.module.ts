import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommunityService } from './service/community.service';
import { IntentService } from './service/intent.service';
import { CronService } from './service/cron.service';
import { TwitterApiService } from './api/twitter';
import { TwitterTokenManager } from './api/token';
import { TwitterSupabase } from 'src/supabase/twitter';
import { CommunityController } from './community.controller';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    IntentService,
    CronService,
    TwitterApiService,
    TwitterTokenManager,
    TwitterSupabase,
  ],
  exports: [CommunityService, TwitterApiService, TwitterTokenManager],
})
export class CommunityModule {}
