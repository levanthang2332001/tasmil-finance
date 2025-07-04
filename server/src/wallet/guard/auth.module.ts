import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisCacheService } from 'src/redis/services/redisCacheService';

@Module({
  imports: [RedisModule],
  controllers: [AuthController],
  providers: [AuthService, RedisCacheService],
})
export class AuthModule {}
