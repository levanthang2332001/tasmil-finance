import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Accounts } from './accounts';
import { JwtAuthGuard } from 'src/Guard/jwt-auth.guard';
import { GenerateWalletDto } from 'src/utils/input';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  private readonly accountsService: Accounts;

  constructor() {
    this.accountsService = new Accounts();
  }

  @Get('check-user/:address')
  async checkUser(@Param('address') address: string) {
    try {
      const account = await this.accountsService.getAccountByAddress(address);
      if(!account) { 
        return {
          success: false,
          message: 'User account not found'
        };
      }

      const data = await this.accountsService.getAccountByPrivateKey(account);

      return {
        success: true,
        data: data,
        message: 'User account retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Post('generate-tasmil-wallet')
  async generateTasmilWallet(@Body() body: GenerateWalletDto) {
    try {
      const { address } = body;
      const account = await this.accountsService.getAccount(address);
      return {
        success: true,
        data: account,
        message: 'Tasmil wallet generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
} 