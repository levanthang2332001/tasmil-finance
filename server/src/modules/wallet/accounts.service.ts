import {
  Account,
  Ed25519PrivateKey,
  PrivateKey,
  PrivateKeyVariants,
} from '@aptos-labs/ts-sdk';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { VaultSupabase } from 'src/infra/supabase/index';
import { Decrypt, Encrypt } from 'src/utils/index';
import { IAccount } from './entities/account.entities';
dotenv.config();

interface IAccountResult {
  id: string;
  tasmilAddress: string;
  privateKey: string;
}

@Injectable()
export class AccountsService {
  private readonly password: string;

  constructor(private readonly vault: VaultSupabase) {
    if (!process.env.PASSWORD_ENCRYPT) {
      throw new Error('Missing required PASSWORD_ENCRYPT environment variable');
    }
    this.password = process.env.PASSWORD_ENCRYPT;
  }

  private generateAccount(): IAccount {
    const account = Account.generate();
    const privateKey = PrivateKey.formatPrivateKey(
      account.privateKey.toString(),
      'ed25519' as PrivateKeyVariants,
    );
    const publicKey = account.publicKey.toString();
    const accountAddress = account.accountAddress.toString();

    return {
      privateKey,
      publicKey,
      accountAddress,
    };
  }

  private async checkUserExist(accountAddress: string): Promise<boolean> {
    const vaultData = await this.vault.getVault({
      secret_name: accountAddress,
    });
    return vaultData !== null;
  }

  public async getAccount(address: string): Promise<IAccountResult | null> {
    const userExist = await this.checkUserExist(address);

    if (userExist) {
      const vaultData = await this.vault.getVault({ secret_name: address });

      if (!vaultData) {
        throw new Error('Vault data not found');
      }

      const data = JSON.parse(vaultData.secret_value) as {
        cipherText: string;
        salt: string;
        iv: string;
      };

      const decrypted = Decrypt({
        cipherText: data.cipherText,
        password: this.password,
        saltB64: data.salt,
        ivB64: data.iv,
      });

      return this.getAccountByPrivateKey(
        decrypted.prKey,
      ) as unknown as IAccountResult;
    }

    const taslmil_account = this.generateAccount();

    const encrypted = Encrypt({
      prKey: taslmil_account.privateKey,
      password: this.password,
    });

    const formattedEncrypted = JSON.stringify({
      cipherText: encrypted.cipherText,
      salt: encrypted.salt,
      iv: encrypted.iv,
    });

    const insertVault = await this.vault.insertVault({
      secret_name: address,
      secret_value: formattedEncrypted,
    });

    return {
      id: insertVault?.id || '',
      tasmilAddress: taslmil_account.accountAddress,
      privateKey: formattedEncrypted,
    };
  }

  public async getPrivateKeyByAddress(address: string): Promise<string | null> {
    const userExist = await this.checkUserExist(address);

    if (userExist) {
      const vaultData = await this.vault.getVault({ secret_name: address });

      if (!vaultData) {
        throw new Error('Vault data not found');
      }

      const data = JSON.parse(vaultData as unknown as string) as {
        cipherText: string;
        salt: string;
        iv: string;
      };

      const decrypted = Decrypt({
        cipherText: data.cipherText,
        password: this.password,
        saltB64: data.salt,
        ivB64: data.iv,
      });

      return decrypted.prKey;
    }
    return null;
  }

  public getAccountByPrivateKey(prKey: string) {
    try {
      const formattedPrivateKey = PrivateKey.formatPrivateKey(
        prKey,
        'ed25519' as PrivateKeyVariants,
      );
      const privateKey = new Ed25519PrivateKey(formattedPrivateKey);
      const tasmilAddress = Account.fromPrivateKey({
        privateKey: privateKey,
      }).accountAddress.toString();
      return {
        tasmilAddress: tasmilAddress,
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
