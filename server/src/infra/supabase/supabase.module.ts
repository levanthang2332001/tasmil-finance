import { Global, Module } from '@nestjs/common';
import { SupabaseClient } from './client';
import { VaultSupabase } from './vault';
import { TwitterSupabase } from './twitter';

@Global()
@Module({
  providers: [SupabaseClient, VaultSupabase, TwitterSupabase],
  exports: [SupabaseClient, VaultSupabase, TwitterSupabase],
})
export class SupabaseModule {}
