export const TIMEZONE = 'Africa/Algiers';

export function getTodayDateString(): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function calculateReminderTimes(dateStr: string, timeStr: string): {
  reminder24hAt: string;
  reminder2hAt: string;
} {
  // Build date in local timezone
  const appointmentDate = new Date(`${dateStr}T${timeStr}:00+01:00`);
  const reminder24h = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
  const reminder2h = new Date(appointmentDate.getTime() - 2 * 60 * 60 * 1000);

  return {
    reminder24hAt: reminder24h.toISOString(),
    reminder2hAt: reminder2h.toISOString(),
  };
}

export function isAppointmentPast(dateStr: string, timeStr: string): boolean {
  const appointmentDate = new Date(`${dateStr}T${timeStr}:00+01:00`);
  return Date.now() > appointmentDate.getTime();
}
