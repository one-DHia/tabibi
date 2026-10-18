import { Router, Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../database/supabase.js';
import { ENV } from '../config/env.js';

export const authRouter = Router();

// 1. Doctor Signup & Email Verification Trigger
authRouter.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { email, password, doctorName, specialty, phone, address, slug } = req.body;

  if (!email || !password || !doctorName || !slug) {
    res.status(400).json({ success: false, error: 'Champs obligatoires manquants' });
    return;
  }

  if (!isSupabaseConfigured()) {
    console.log(`[Supabase Mock Auth] Inscription simulée pour ${email}`);
    res.json({ success: true, message: 'verify_email', mock: true });
    return;
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { doctorName, specialty, phone, address, slug },
        emailRedirectTo: `${ENV.APP_URL}/dashboard`,
      },
    });

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    // Provision cabinet record if user created
    if (data.user) {
      await supabase.from('cabinets').insert({
        user_id: data.user.id,
        slug,
        name: `Cabinet ${doctorName}`,
        specialty: specialty || 'Médecine Générale',
        address: address || 'Alger',
        phone: phone || '',
      });
    }

    res.json({ success: true, message: 'verify_email', user: data.user });
  } catch (err: any) {
    console.error('[Supabase Signup Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Erreur interne' });
  }
});

// 2. Doctor Login
authRouter.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Identifiants requis' });
    return;
  }

  if (!isSupabaseConfigured()) {
    res.json({ success: true, mock: true });
    return;
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      res.status(401).json({ success: false, error: error.message });
      return;
    }

    res.json({ success: true, session: data.session });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Reset Password
authRouter.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, error: 'E-mail requis' });
    return;
  }

  if (!isSupabaseConfigured()) {
    res.json({ success: true, mock: true });
    return;
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${ENV.APP_URL}/login`,
    });

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
