import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommunityService } from './services/community.service';
import { TweetAnalysisService } from './services/tweet-analysis.service';
import { CronService } from './services/cron.service';
import { TwitterApiService } from './api/twitter';
import { TwitterTokenManager } from './api/token';
import { CommunityController } from './community.controller';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    TweetAnalysisService,
    CronService,
    TwitterApiService,
    TwitterTokenManager,
  ],
  exports: [CommunityService, TwitterApiService, TwitterTokenManager],
})
export class CommunityModule {}
