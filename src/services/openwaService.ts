import { t } from '../i18n/index.js';
import { ENV } from '../config/env.js';

export interface WhatsAppMessagePayload {
  toPhone: string;
  patientName: string;
  cabinetName: string;
  cabinetAddress: string;
  cabinetPhone: string;
  dateStr: string;
  timeStr: string;
  secureToken: string;
}

export function buildTrilingualConfirmation(p: WhatsAppMessagePayload): string {
  const detailUrl = `${ENV.APP_URL}/r/${p.secureToken}`;

  return [
    `🇩🇿 *${t('whatsapp.confirmation_header', 'ar')}*`,
    `مرحباً *${p.patientName}*، تم تسجيل موعدك مع *${p.cabinetName}*.`,
    `📅 ${t('whatsapp.date_prefix', 'ar')}: ${p.dateStr} | ⏰ ${t('whatsapp.time_prefix', 'ar')}: ${p.timeStr}`,
    `📍 ${t('whatsapp.address_prefix', 'ar')}: ${p.cabinetAddress}`,
    `📞 ${t('whatsapp.cancellation_notice', 'ar')} (${p.cabinetPhone})`,
    `⛔ ${t('whatsapp.automated_warning', 'ar')}`,
    `🔗 تفاصيل الموعد: ${detailUrl}`,
    '',
    `🇫🇷 *${t('whatsapp.confirmation_header', 'fr')}*`,
    `Bonjour *${p.patientName}*, votre RDV avec *${p.cabinetName}* est confirmé.`,
    `📅 ${t('whatsapp.date_prefix', 'fr')}: ${p.dateStr} | ⏰ ${t('whatsapp.time_prefix', 'fr')}: ${p.timeStr}`,
    `📍 ${t('whatsapp.address_prefix', 'fr')}: ${p.cabinetAddress}`,
    `📞 ${t('whatsapp.cancellation_notice', 'fr')} (${p.cabinetPhone})`,
    `⛔ ${t('whatsapp.automated_warning', 'fr')}`,
    '',
    `🇬🇧 *${t('whatsapp.confirmation_header', 'en')}*`,
    `Hello *${p.patientName}*, your appointment with *${p.cabinetName}* is confirmed.`,
    `📅 ${t('whatsapp.date_prefix', 'en')}: ${p.dateStr} | ⏰ ${t('whatsapp.time_prefix', 'en')}: ${p.timeStr}`,
  ].join('\n');
}

export function buildReminderMessage(p: WhatsAppMessagePayload, type: '24h' | '2h'): string {
  const headerKey = type === '24h' ? 'whatsapp.reminder_24h_header' : 'whatsapp.reminder_2h_header';
  return [
    `🔔 *${t(headerKey, 'fr')}*`,
    `Cabinet: *${p.cabinetName}*`,
    `Date: ${p.dateStr} à ${p.timeStr}`,
    `Adresse: ${p.cabinetAddress}`,
    `📞 Pour annuler, appelez le: ${p.cabinetPhone}`,
    `⛔ ${t('whatsapp.automated_warning', 'fr')}`,
  ].join('\n');
}

export async function sendWhatsAppMessage(phone: string, text: string): Promise<boolean> {
  // In production with Open-WA active session, sends via client.sendText
  // Log message safely for demonstration / development
  console.log(`[WhatsApp Outbound] To: ${phone}\n---\n${text}\n---`);
  return true;
}
