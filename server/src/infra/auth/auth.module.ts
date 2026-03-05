import { Module } from '@nestjs/common';
import { RedisModule } from 'src/infra/redis/redis.module';
import { AppJwtModule } from 'src/infra/jwt/jwt.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [RedisModule, AppJwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
