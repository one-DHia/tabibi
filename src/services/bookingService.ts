import crypto from 'crypto';
import { Appointment, CreateBookingInput, LockSlotInput } from '../types/booking.types.js';
import { calculateReminderTimes } from '../utils/date.js';
import { calculateLockExpiration } from './slotEngine.js';
import { buildTrilingualConfirmation, sendWhatsAppMessage } from './openwaService.js';
import { checkDeviceRateLimit, recordBookingAttempt } from '../config/rateLimit.js';

// In-memory state for high-speed conflict prevention & dev fallback
const appointmentsStore = new Map<string, Appointment>();
const slotLocksStore = new Map<string, { deviceId: string; expiresAt: number }>();

function slotKey(slug: string, date: string, time: string): string {
  return `${slug}__${date}__${time}`;
}

export function lockSlotForPatient(input: LockSlotInput): { success: boolean; error?: string } {
  const key = slotKey(input.cabinetSlug, input.date, input.time);
  const now = Date.now();

  const existingLock = slotLocksStore.get(key);
  if (existingLock && existingLock.expiresAt > now && existingLock.deviceId !== input.deviceId) {
    return { success: false, error: 'slot_already_taken' };
  }

  const { expiresAt } = calculateLockExpiration();
  slotLocksStore.set(key, { deviceId: input.deviceId, expiresAt: expiresAt.getTime() });
  return { success: true };
}

export async function createAppointment(
  input: CreateBookingInput,
  ip: string,
  cabinetInfo: { name: string; address: string; phone: string }
): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
  if (!checkDeviceRateLimit(input.deviceId)) {
    return { success: false, error: 'rate_limit_device' };
  }

  const key = slotKey(input.cabinetSlug, input.date, input.time);
  const now = Date.now();
  const existingLock = slotLocksStore.get(key);

  if (existingLock && existingLock.expiresAt > now && existingLock.deviceId !== input.deviceId) {
    return { success: false, error: 'slot_already_taken' };
  }

  const { reminder24hAt, reminder2hAt } = calculateReminderTimes(input.date, input.time);
  const secureToken = crypto.randomBytes(16).toString('hex');

  const appointment: Appointment = {
    id: crypto.randomUUID(),
    cabinetId: input.cabinetSlug,
    patientName: input.patientName,
    patientWhatsapp: input.patientWhatsapp,
    appointmentDate: input.date,
    appointmentTime: input.time,
    status: 'confirmed',
    reminder24hSent: false,
    reminder2hSent: false,
    reminder24hAt,
    reminder2hAt,
    secureToken,
    deviceId: input.deviceId,
    createdAt: new Date().toISOString(),
  };

  appointmentsStore.set(appointment.id, appointment);
  slotLocksStore.delete(key);
  recordBookingAttempt(ip, input.deviceId);

  // Send WhatsApp confirmation
  const message = buildTrilingualConfirmation({
    toPhone: input.patientWhatsapp,
    patientName: input.patientName,
    cabinetName: cabinetInfo.name,
    cabinetAddress: cabinetInfo.address,
    cabinetPhone: cabinetInfo.phone,
    dateStr: input.date,
    timeStr: input.time,
    secureToken,
  });

  await sendWhatsAppMessage(input.patientWhatsapp, message);
  return { success: true, appointment };
}

export function getAppointmentByToken(token: string): Appointment | undefined {
  for (const appt of appointmentsStore.values()) {
    if (appt.secureToken === token) return appt;
  }
  return undefined;
}

export function cancelAppointmentByDoctor(id: string): boolean {
  const appt = appointmentsStore.get(id);
  if (!appt) return false;
  appt.status = 'cancelled';
  appointmentsStore.set(id, appt);
  return true;
}
