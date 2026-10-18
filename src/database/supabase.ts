import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '../config/env.js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return (
    !ENV.SUPABASE_URL.includes('placeholder') &&
    !ENV.SUPABASE_ANON_KEY.includes('placeholder')
  );
}
