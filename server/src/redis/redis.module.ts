import { Module, DynamicModule, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { RedisCacheService } from './services/redisCacheService';
import { RedisConfigService } from './connection/redisConnect';

@Global()
@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        ConfigModule,
        CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const redisConfig = new RedisConfigService(configService);
            const config = redisConfig.getCacheConfig();

            const keyvRedis = new KeyvRedis({
              username: config.username,
              password: config.password,
              socket: {
                host: config.host,
                port: config.port,
              },
            });

            const keyv = new Keyv({ store: keyvRedis });

            return {
              stores: [keyv],
              ttl: config.ttl * 1000, // Convert to milliseconds
              isGlobal: true,
            };
          },
        }),
      ],
      providers: [
        RedisCacheService,
        {
          provide: RedisConfigService,
          useFactory: (configService: ConfigService) => {
            return new RedisConfigService(configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [RedisCacheService, CacheModule],
    };
  }
}
