import * as dotenv from "dotenv";
import { Account, CreateEd25519AccountFromPrivateKeyArgs, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { SupabaseClient, VaultSupabase } from "../supabase/index";
import { IAccount } from "../interfaces/account.interface";
import { Decrypt, Encrypt } from "../utils/index";
dotenv.config();


export class Accounts {
  private readonly supabaseClient: SupabaseClient;
  private readonly password: string;

  constructor() {
    this.supabaseClient = new SupabaseClient();

    if (!process.env.PASSWORD_ENCRYPT) {
      throw new Error('Missing required PASSWORD_ENCRYPT environment variable');
    }
    this.password = process.env.PASSWORD_ENCRYPT;
  }

  private generateAccount(): IAccount {
    const account = Account.generate();
    const privateKey = account.privateKey.toString();
    const publicKey = account.publicKey.toString();
    const accountAddress = account.accountAddress.toString();

    return {
      privateKey,
      publicKey,
      accountAddress
    };
  }

  private async checkUserExist(accountAddress: string): Promise<boolean> {
    const vault = new VaultSupabase();
    const vaultData = await vault.getVault({ secret_name: accountAddress });
    return vaultData !== null && vaultData.length > 0;
  }

  public async getAccount(address: string) {
    const userExist = await this.checkUserExist(address);
    const vault = new VaultSupabase();

    if (userExist) {
      const vaultData = await vault.getVault({ secret_name: address });

      const data = JSON.parse(vaultData);

      const decrypted = Decrypt({
        cipherText: data.cipherText,
        password: this.password,
        saltB64: data.salt,
        ivB64: data.iv
      });

      const tasmilAddress = this.getAccountByPrivateKey(decrypted.prKey);
      return tasmilAddress;
    }

    const taslmil_account = this.generateAccount();

    const encrypted = Encrypt({
      prKey: taslmil_account.privateKey,
      password: this.password
    });

    const formattedEnscypt = JSON.stringify({ cipherText: encrypted.cipherText, salt: encrypted.salt, iv: encrypted.iv });

    const insertVault = await vault.insertVault({
      secret_name: address,
      secret_value: formattedEnscypt
    });

    console.log('inserted vault successfully');
    return insertVault;
  }

  public async getAccountByAddress(address: string): Promise<string | null> {
    const userExist = await this.checkUserExist(address);
    const vault = new VaultSupabase();

    if (userExist) {
      const vaultData = await vault.getVault({ secret_name: address });
      const data = JSON.parse(vaultData);
      const decrypted = Decrypt({
        cipherText: data.cipherText,
        password: this.password,
        saltB64: data.salt,
        ivB64: data.iv
      });
      return decrypted.prKey;
    }
    return null;
  }

  public async getAccountByPrivateKey(prKey: string) {
    try {
      const privateKey = new Ed25519PrivateKey(prKey);
      const tasmilAddress = Account.fromPrivateKey({ privateKey: privateKey }).accountAddress.toString();
      return {
        tasmilAddress: tasmilAddress,
      };
    } catch (error) {
      return error;
    }
  }
}