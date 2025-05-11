import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { NAVISDKClient, NAVX } from 'navi-sdk';

@Injectable()
export class WithdrawService {
  private readonly logger: LoggerService;
  private client: NAVISDKClient;

  constructor() {
    this.logger = new LoggerService(WithdrawService.name);
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      this.client = new NAVISDKClient();
      this.logger.log('Navi SDK client initialized');
    } catch (error) {
      this.logger.error('Failed to initialize Navi SDK client', error);
      throw error;
    }
  }

  async getPortfolio(address: string): Promise<any> {
    try {
      this.logger.log(`Getting Navi portfolio for address: ${address}`);
      const account = this.client.accounts[0];
      const portfolio = await account.getNAVIPortfolio(address, true);
      return portfolio;
    } catch (error) {
      this.logger.error('Failed to get Navi portfolio', error);
      throw new Error(`Failed to get Navi portfolio: ${error.message}`);
    }
  }
}
