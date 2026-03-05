/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
// import { JwtAuthGuard } from 'src/infra/auth/jwt-auth.guard';
import { GenerateWalletDto } from 'src/utils/input';

interface ITasmilWalletResponse {
  success: boolean;
  data: { tasmilAddress: string; id: string };
  message: string;
}

@Controller('accounts')
// @UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('check-user/:address')
  async checkUser(@Param('address') address: string) {
    try {
      const account = await this.accountsService.getPrivateKeyByAddress(address);

      if (!account) {
        return {
          success: false,
          message: 'User account not found',
        };
      }

      const data = this.accountsService.getAccountByPrivateKey(account);

      return {
        success: true,
        data: data,
        message: 'User account retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  @Post('generate-tasmil-wallet')
  async generateTasmilWallet(
    @Body() body: GenerateWalletDto,
  ): Promise<ITasmilWalletResponse> {
    try {
      const { address } = body;
      const account = await this.accountsService.getAccount(address);
      return {
        success: true,
        data: account as { tasmilAddress: string; id: string; privateKey: string },
        message: 'Tasmil wallet generated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: { tasmilAddress: '', id: '' },
        message: (error as Error).message || 'Failed to generate Tasmil wallet',
      };
    }
  }
}
