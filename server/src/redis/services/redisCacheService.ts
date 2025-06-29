import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, Logger } from '@nestjs/common';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set<T>(key: string, value: T, ttl?: number): Promise<T | void> {
    try {
      this.logger.log(`🔄 Setting cache key: ${key}, TTL: ${ttl}ms`);
      const result = await this.cacheManager.set(key, value, ttl);
      this.logger.log(`✅ Cache set successful for key: ${key}`);

      // Verify immediately after setting
      const verification = await this.cacheManager.get(key);
      if (verification !== undefined) {
        this.logger.log(`✅ Verification successful - key exists: ${key}`);
      } else {
        this.logger.error(`❌ Verification failed - key not found: ${key}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`❌ Cache set failed for key: ${key}`, error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      this.logger.log(`🔍 Getting cache key: ${key}`);
      const result = await this.cacheManager.get<T>(key);

      if (result !== undefined) {
        this.logger.log(`✅ Cache hit for key: ${key}`);
      } else {
        this.logger.log(`❌ Cache miss for key: ${key}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`❌ Cache get failed for key: ${key}`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.logger.log(`🗑️ Deleting cache key: ${key}`);
      await this.cacheManager.del(key);
      this.logger.log(`✅ Cache delete successful for key: ${key}`);
    } catch (error) {
      this.logger.error(`❌ Cache delete failed for key: ${key}`, error);
      throw error;
    }
  }
}
