import { Injectable } from '@nestjs/common';
import {
  createClient,
  SupabaseClient as SBClient,
} from '@supabase/supabase-js';

@Injectable()
export class SupabaseClient {
  private readonly client: SBClient;

  constructor() {
    const url = process.env.SUPABASE_URL || '';
    const key = process.env.SUPABASE_ROLE_KEY || '';

    if (!url || !key) {
      throw new Error('Missing Supabase URL or role key');
    }

    this.client = createClient(url, key);
  }

  public getClient(): SBClient {
    return this.client;
  }
}
