import { buildReminderMessage, sendWhatsAppMessage } from './openwaService.js';
import { Appointment } from '../types/booking.types.js';

let schedulerInterval: NodeJS.Timeout | null = null;

// Registry of appointments to check (synced with BDD / store)
const activeAppointments: Appointment[] = [];

export function registerAppointmentForReminders(appt: Appointment): void {
  activeAppointments.push(appt);
}

export async function processDueReminders(): Promise<void> {
  const now = new Date().toISOString();

  for (const appt of activeAppointments) {
    if (appt.status !== 'confirmed') continue;

    // Check 24h reminder
    if (!appt.reminder24hSent && appt.reminder24hAt <= now) {
      appt.reminder24hSent = true;
      const text = buildReminderMessage(
        {
          toPhone: appt.patientWhatsapp,
          patientName: appt.patientName,
          cabinetName: 'Cabinet Médical',
          cabinetAddress: 'Adresse',
          cabinetPhone: '0550000000',
          dateStr: appt.appointmentDate,
          timeStr: appt.appointmentTime,
          secureToken: appt.secureToken,
        },
        '24h'
      );
      await sendWhatsAppMessage(appt.patientWhatsapp, text);
    }

    // Check 2h reminder
    if (!appt.reminder2hSent && appt.reminder2hAt <= now) {
      appt.reminder2hSent = true;
      const text = buildReminderMessage(
        {
          toPhone: appt.patientWhatsapp,
          patientName: appt.patientName,
          cabinetName: 'Cabinet Médical',
          cabinetAddress: 'Adresse',
          cabinetPhone: '0550000000',
          dateStr: appt.appointmentDate,
          timeStr: appt.appointmentTime,
          secureToken: appt.secureToken,
        },
        '2h'
      );
      await sendWhatsAppMessage(appt.patientWhatsapp, text);
    }
  }
}

export function startReminderScheduler(intervalMs = 5 * 60 * 1000): void {
  if (schedulerInterval) return;
  console.log('[Scheduler] Reminder scheduler active (running every 5 min)');
  schedulerInterval = setInterval(() => {
    processDueReminders().catch((err) => console.error('[Scheduler Error]', err));
  }, intervalMs);
}

export function stopReminderScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
