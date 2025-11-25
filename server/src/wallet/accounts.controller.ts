/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { Accounts } from './accounts';
import { JwtAuthGuard } from 'src/wallet/guard/jwt-auth.guard';
import { GenerateWalletDto } from 'src/utils/input';

interface ITasmilWalletResponse {
  success: boolean;
  data: { tasmilAddress: string; id: string; privateKey?: string };
  message: string;
}

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  private readonly accountsService: Accounts;

  constructor() {
    this.accountsService = new Accounts();
  }

  @Get('check-user/:address')
  async checkUser(@Param('address') address: string, @Req() req: any) {
    // Validate that user can only access their own account
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const userWalletAddress = req.user?.walletAddress;
    if (!userWalletAddress || userWalletAddress !== address) {
      throw new UnauthorizedException('Cannot access other user accounts');
    }
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
    @Req() req: any,
  ): Promise<ITasmilWalletResponse> {
    try {
      const { address } = body;

      // Validate that user can only generate wallet for their own account
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const userWalletAddress = req.user?.walletAddress;
      if (!userWalletAddress || userWalletAddress !== address) {
        throw new UnauthorizedException('Cannot generate wallet for other user accounts');
      }

      const account = await this.accountsService.getAccount(address);

      if (!account) {
        return {
          success: false,
          data: { tasmilAddress: '', id: '' },
          message: 'Failed to generate Tasmil wallet',
        };
      }

      return {
        success: true,
        data: {
          tasmilAddress: account.tasmilAddress,
          id: account.id,
          privateKey: account.privateKey, // Encrypted private key
        },
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
