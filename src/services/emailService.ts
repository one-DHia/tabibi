import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { ENV } from '../config/env.js';

export interface ConfirmationEmailInput {
  toEmail: string;
  patientName: string;
  cabinetName: string;
  cabinetAddress: string;
  cabinetPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  secureToken: string;
}

export function buildConfirmationHtml(input: ConfirmationEmailInput): string {
  const trackingUrl = `${ENV.APP_URL}/r/${input.secureToken}`;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="utf-8" /></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFCFF; color: #0F172A; padding: 24px; margin: 0;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #059669; margin: 0; font-size: 24px; font-weight: 800;">✦ Tabibi</h2>
          <p style="color: #64748B; font-size: 14px; margin-top: 4px;">Confirmation de votre consultation médicale</p>
        </div>
        <p style="font-size: 16px; line-height: 1.5;">Bonjour <strong>${input.patientName}</strong>,</p>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">Votre rendez-vous a bien été enregistré auprès du cabinet médical. Voici le récapitulatif :</p>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <div style="margin-bottom: 10px;"><strong>🏥 Cabinet :</strong> ${input.cabinetName}</div>
          <div style="margin-bottom: 10px;"><strong>📅 Date :</strong> ${input.appointmentDate}</div>
          <div style="margin-bottom: 10px;"><strong>⏰ Heure :</strong> ${input.appointmentTime}</div>
          <div style="margin-bottom: 10px;"><strong>📍 Adresse :</strong> ${input.cabinetAddress}</div>
          <div><strong>📞 Téléphone :</strong> ${input.cabinetPhone}</div>
        </div>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${trackingUrl}" style="background: linear-gradient(135deg, #059669 0%, #0284C7 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 700; font-size: 14px; display: inline-block;">Accéder à ma fiche consultation</a>
        </div>
        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.5; text-align: center;">
          📞 <strong>Pour annuler ou modifier :</strong> Veuillez contacter directement le secrétariat du cabinet par téléphone.
        </div>
        <div style="border-top: 1px solid #E2E8F0; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #94A3B8; text-align: center;">
          Message automatique généré par Tabibi.dz — Zéro spam, aucune commercialisation de données.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendConfirmationEmail(
  input: ConfirmationEmailInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!input.toEmail || !input.toEmail.includes('@')) {
    return { success: false, error: 'invalid_email' };
  }

  const smtpUser = process.env.SMTP_USER || ENV.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || ENV.SMTP_PASS;

  // 1. Priorité à Gmail SMTP (sans nom de domaine requis)
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || ENV.SMTP_FROM || `Tabibi <${smtpUser}>`,
        to: input.toEmail,
        subject: `Confirmation de rendez-vous — ${input.cabinetName}`,
        html: buildConfirmationHtml(input),
      });

      console.log(`[Gmail SMTP Success] E-mail envoyé à ${input.toEmail} (ID: ${info.messageId})`);
      return { success: true, id: info.messageId };
    } catch (err: any) {
      console.error('[Gmail SMTP Error]', err);
      return { success: false, error: err?.message || 'smtp_failed' };
    }
  }

  // 2. Fallback Resend
  const resendKey = process.env.RESEND_API_KEY || ENV.RESEND_API_KEY;
  if (resendKey) {
    try {
      const client = new Resend(resendKey);
      const { data, error } = await client.emails.send({
        from: process.env.RESEND_FROM_EMAIL || ENV.RESEND_FROM_EMAIL,
        to: [input.toEmail],
        subject: `Confirmation de rendez-vous — ${input.cabinetName}`,
        html: buildConfirmationHtml(input),
      });

      if (error) return { success: false, error: error.message };
      return { success: true, id: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message || 'resend_failed' };
    }
  }

  // 3. Fallback Dev / Simulation
  console.log(`[Email Mock] Aucun SMTP ni Resend configuré. E-mail simulé pour ${input.toEmail}`);
  return { success: true, id: 'mock-email-id' };
}
