import { Logger } from "@nestjs/common";
import { SupabaseClient } from "./client"
import { IInsertVaultRequest, IReadVaultRequest } from "../interfaces/vault.interface";


export class VaultSupabase {
  private readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = new SupabaseClient();
  }

  public async insertVault(params: IInsertVaultRequest) {
    try {
      const client = await this.supabaseClient.checkClient();
      const { data, error } = await client.rpc('insert_secret', {
        secret_name: params.secret_name,
        secret_value: params.secret_value
      });

      if(error) { Logger.error(error.message); }

      return data;
    } catch (error) {
      Logger.error(error);
    }
  }

  public async getVault(params: IReadVaultRequest) {
    try {
      const client = await this.supabaseClient.checkClient();
      const { data, error } = await client.rpc('read_secret', {
        secret_name: params.secret_name
      });

      if(error) { 
        Logger.error(error.message);
        return null;
      }

      return data;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }
}