import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { SupabaseModule } from 'src/infra/supabase/supabase.module';
import { AppJwtModule } from 'src/infra/jwt/jwt.module';

@Module({
  imports: [SupabaseModule, AppJwtModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
