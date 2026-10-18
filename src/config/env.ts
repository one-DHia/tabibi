import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url().default('https://placeholder.supabase.co'),
  SUPABASE_ANON_KEY: z.string().min(1).default('placeholder-key'),
  APP_URL: z.string().default('http://localhost:3000'),
  LOCK_DURATION_MINUTES: z.coerce.number().default(15),
  RATE_LIMIT_IP_MAX: z.coerce.number().default(2),
  RATE_LIMIT_IP_WINDOW_HOURS: z.coerce.number().default(2),
  RESEND_API_KEY: z.string().optional().default(''),
  RESEND_FROM_EMAIL: z.string().default('Tabibi <onboarding@resend.dev>'),
});

export const ENV = envSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
  APP_URL: process.env.APP_URL,
  LOCK_DURATION_MINUTES: process.env.LOCK_DURATION_MINUTES,
  RATE_LIMIT_IP_MAX: process.env.RATE_LIMIT_IP_MAX,
  RATE_LIMIT_IP_WINDOW_HOURS: process.env.RATE_LIMIT_IP_WINDOW_HOURS,
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'Tabibi <onboarding@resend.dev>',
});
