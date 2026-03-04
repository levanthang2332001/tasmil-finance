import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { CommunityModule } from './modules/community/community.module';
import { RedisModule } from './infra/redis/redis.module';
import { SupabaseModule } from './infra/supabase/supabase.module';
import { AccountsModule } from './modules/wallet/accounts.module';
import { AuthModule } from './infra/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    RedisModule.forRoot(),
    SupabaseModule,
    ChatModule,
    AccountsModule,
    AuthModule,
    CommunityModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
