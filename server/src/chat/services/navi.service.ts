import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { NAVISDKClient, NAVX } from 'navi-sdk';
import { BorrowParams } from 'src/chat/entities/navi/borrow.entity';
// import { Scallop } from '@scallop-io/sui-scallop-sdk';

@Injectable()
export class NaviService {
  private readonly logger: LoggerService;
  private client: NAVISDKClient;

  constructor() {
    this.logger = new LoggerService(NaviService.name);
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

  getMissingParameterPrompt(missingParam: keyof BorrowParams): string {
    const prompts: Record<keyof BorrowParams, string> = {
      amount: 'How much would you like to borrow?',
      asset: 'What asset would you like to borrow?',
    };
    return prompts[missingParam];
  }

  async getSupply(amount: number): Promise<any> {
    try {
      const account = this.client.accounts[0];
      const accountCap = await account.createAccountCap();
      const supply = await account.depositToNaviWithAccountCap(
        NAVX,
        amount,
        accountCap,
      );
      return supply;
    } catch (error) {
      this.logger.error('Failed to get Navi supply', error);
      throw new Error(error.message);
    }
  }

  async getBorrow(amount: number): Promise<any> {
    try {
      const account = this.client.accounts[0];
      const borrow = await account.borrow(NAVX, amount);
      return borrow;
    } catch (error) {
      this.logger.error('Failed to get Navi borrow', error);
      throw new Error(error.message);
    }
  }

  async getRepay(amount: number): Promise<any> {
    try {
      const account = this.client.accounts[0];
      const repay = await account.repay(NAVX, amount);
      return repay;
    } catch (error) {
      this.logger.error('Failed to get Navi repay', error);
      throw new Error(error.message);
    }
  }

  async getWithdraw(amount: number): Promise<any> {
    try {
      const account = this.client.accounts[0];
      const withdraw = await account.withdraw(NAVX, amount);
      return withdraw;
    } catch (error) {
      this.logger.error('Failed to get Navi withdraw', error);
      throw new Error(error.message);
    }
  }

  // not test and confirm
  async getPortfolio(address: string): Promise<any> {
    try {
      this.logger.log(`Getting Navi portfolio for address: ${address}`);
      const account = this.client.accounts[0];
      const portfolio = await account.getNAVIPortfolio(address, true);
      return portfolio;
    } catch (error) {
      this.logger.error('Failed to get Navi portfolio', error);
      throw new Error(error.message);
    }
  }

  async getPositions(address: string): Promise<any> {
    try {
      this.logger.log(`Getting Navi positions for address: ${address}`);
      const portfolio = await this.getPortfolio(address);
      return portfolio?.positions || [];
    } catch (error) {
      this.logger.error('Failed to get Navi positions', error);
      throw new Error(error.message);
    }
  }

  async getHealthFactor(address: string): Promise<any> {
    try {
      this.logger.log(`Getting Navi health factor for address: ${address}`);
      const account = this.client.accounts[0];
      const healthFactor = await account.getHealthFactor(address);
      return { healthFactor };
    } catch (error) {
      this.logger.error('Failed to get Navi health factor', error);
      throw new Error(error.message);
    }
  }

  async getAvailableRewards(
    address: string,
    chains: number[] = [1],
  ): Promise<any> {
    try {
      this.logger.log(`Getting Navi available rewards for address: ${address}`);
      const rewards = await this.client.getAddressAvailableRewards(
        address,
        chains,
      );
      return { rewards };
    } catch (error) {
      this.logger.error('Failed to get Navi available rewards', error);
      throw new Error(error.message);
    }
  }

  async getRewardHistory(address: string): Promise<any> {
    try {
      this.logger.log(`Getting Navi reward history for address: ${address}`);
      const history = await this.client.getClaimedRewardsHistory(address);
      return { history };
    } catch (error) {
      this.logger.error('Failed to get Navi reward history', error);
      throw new Error(error.message);
    }
  }

  async processNaviMessage(message: string, address?: string): Promise<string> {
    try {
      this.logger.log(`Processing Navi message: ${message}`);

      const defaultAddress =
        '0x98331290579aee43997ccaedabdbf12f51275a4f300b1bc0dd40f64b94477090';
      const userAddress = address || defaultAddress;

      // Simple intent detection for demonstration
      if (message.toLowerCase().includes('portfolio')) {
        const portfolioData = await this.getPortfolio(userAddress);
        return `Here's your Navi portfolio summary:\nHealth Factor: ${portfolioData.healthFactor}\nTotal Value: ${portfolioData.totalValue}\nTotal Borrowed: ${portfolioData.totalBorrowed}`;
      }

      if (message.toLowerCase().includes('position')) {
        const positions = await this.getPositions(userAddress);
        if (!positions || positions.length === 0) {
          return "You don't have any positions on Navi yet.";
        }
        return `Here are your Navi positions:\n${positions.map((p: any) => `${p.token}: ${p.amount} (${p.type})`).join('\n')}`;
      }

      if (message.toLowerCase().includes('health')) {
        const healthData = await this.getHealthFactor(userAddress);
        return `Your Navi health factor is: ${healthData.healthFactor}`;
      }

      if (message.toLowerCase().includes('reward')) {
        const rewardData = await this.getAvailableRewards(userAddress);
        if (!rewardData.rewards || rewardData.rewards.length === 0) {
          return "You don't have any available rewards on Navi yet.";
        }
        return `Your available Navi rewards:\n${rewardData.rewards.map((r: any) => `${r.token}: ${r.amount}`).join('\n')}`;
      }

      if (message.toLowerCase().includes('history')) {
        const historyData = await this.getRewardHistory(userAddress);
        if (!historyData.history || historyData.history.length === 0) {
          return "You don't have any reward claim history on Navi yet.";
        }
        return `Your Navi reward claim history:\n${historyData.history.map((h: any) => `${h.token}: ${h.amount} (${new Date(h.timestamp).toLocaleDateString()})`).join('\n')}`;
      }

      return "I'm your Navi agent assistant. I can help you check your portfolio, positions, health factor, and rewards on Navi. What would you like to know?";
    } catch (error) {
      this.logger.error('Failed to process Navi message', error);
      throw error;
    }
  }
}
