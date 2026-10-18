import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { ENV } from '../config/env.js';

// Polyfill native WebSocket for Node.js < 22 required by recent @supabase/supabase-js
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = WebSocket;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        transport: WebSocket as any,
      },
    });
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return (
    !ENV.SUPABASE_URL.includes('placeholder') &&
    !ENV.SUPABASE_ANON_KEY.includes('placeholder') &&
    !ENV.SUPABASE_ANON_KEY.includes('votre-cle')
  );
}

