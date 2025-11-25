import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { RedisCacheService } from 'src/redis/services/redisCacheService';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RedisModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests per TTL window (default for most endpoints)
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RedisCacheService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AuthModule {}
