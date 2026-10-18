import { Router, Request, Response } from 'express';
import { lockSlotForPatient, createAppointment, getAppointmentByToken } from '../services/bookingService.js';
import { generateDailySlots } from '../services/slotEngine.js';
import { checkIpRateLimit } from '../config/rateLimit.js';
import { isAppointmentPast } from '../utils/date.js';
import { t } from '../i18n/index.js';
import { SupportedLanguage } from '../types/i18n.types.js';

export const bookingRouter = Router();

// Mock cabinet profile for demo / dev
const defaultCabinet = {
  id: 'cab-1',
  slug: 'cabinet-el-chifa',
  name: 'Cabinet Médical El Chifa',
  specialty: 'Médecine Générale & Cardiologie',
  address: '12 Rue Didouche Mourad, Alger',
  phone: '0550 12 34 56',
  openTime: '08:30',
  closeTime: '16:30',
  breakStart: '12:00',
  breakEnd: '13:00',
  slotDurationMinutes: 30,
};

bookingRouter.get('/api/cabinet/:slug', (_req: Request, res: Response) => {
  res.json({ success: true, cabinet: defaultCabinet });
});

bookingRouter.get('/api/cabinet/:slug/slots', (req: Request, res: Response) => {
  const deviceId = (req.query.deviceId as string) || '';
  const slots = generateDailySlots({
    openTime: defaultCabinet.openTime,
    closeTime: defaultCabinet.closeTime,
    slotDurationMinutes: defaultCabinet.slotDurationMinutes,
    breakStart: defaultCabinet.breakStart,
    breakEnd: defaultCabinet.breakEnd,
    bookedTimes: new Set(),
    lockedSlots: new Map(),
    currentDeviceId: deviceId,
  });

  res.json({ success: true, slots });
});

bookingRouter.post('/api/cabinet/:slug/lock', (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const { date, time, deviceId } = req.body;
  if (!date || !time || !deviceId) {
    res.status(400).json({ success: false, error: 'Paramètres manquants' });
    return;
  }

  const result = lockSlotForPatient({ cabinetSlug: slug, date, time, deviceId });
  res.json(result);
});

bookingRouter.post('/api/cabinet/:slug/book', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

  if (!checkIpRateLimit(ip)) {
    res.status(429).json({ success: false, error: 'rate_limit_ip' });
    return;
  }

  const { date, time, patientName, patientWhatsapp, deviceId } = req.body;
  if (!date || !time || !patientName || !patientWhatsapp || !deviceId) {
    res.status(400).json({ success: false, error: 'Champs obligatoires manquants' });
    return;
  }

  const result = await createAppointment(
    { cabinetSlug: slug, date, time, patientName, patientWhatsapp, deviceId },
    ip,
    { name: defaultCabinet.name, address: defaultCabinet.address, phone: defaultCabinet.phone }
  );

  res.json(result);
});

bookingRouter.get('/api/appointment/:token', (req: Request, res: Response) => {
  const token = String(req.params.token);
  const appt = getAppointmentByToken(token);
  const lang = (req.query.lang as SupportedLanguage) || 'fr';

  if (!appt) {
    res.status(404).json({ success: false, error: t('booking.link_expired_title', lang) });
    return;
  }

  // Token expires if appointment is in the past
  if (isAppointmentPast(appt.appointmentDate, appt.appointmentTime)) {
    res.status(410).json({
      success: false,
      expired: true,
      title: t('booking.link_expired_title', lang),
      message: t('booking.link_expired_message', lang),
    });
    return;
  }

  res.json({ success: true, appointment: appt });
});
