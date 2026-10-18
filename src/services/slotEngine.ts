import { TimeSlot } from '../types/booking.types.js';
import { parseTimeToMinutes, formatMinutesToTime } from '../utils/date.js';
import { ENV } from '../config/env.js';

interface SlotEngineParams {
  openTime: string;
  closeTime: string;
  slotDurationMinutes: number;
  breakStart?: string;
  breakEnd?: string;
  bookedTimes: Set<string>;
  lockedSlots: Map<string, { deviceId: string; lockedUntil: number }>;
  currentDeviceId: string;
}

export function generateDailySlots(params: SlotEngineParams): TimeSlot[] {
  const {
    openTime,
    closeTime,
    slotDurationMinutes,
    breakStart,
    breakEnd,
    bookedTimes,
    lockedSlots,
    currentDeviceId,
  } = params;

  const startMinutes = parseTimeToMinutes(openTime);
  const endMinutes = parseTimeToMinutes(closeTime);
  const breakStartMin = breakStart ? parseTimeToMinutes(breakStart) : null;
  const breakEndMin = breakEnd ? parseTimeToMinutes(breakEnd) : null;

  const now = Date.now();
  const slots: TimeSlot[] = [];

  for (let m = startMinutes; m + slotDurationMinutes <= endMinutes; m += slotDurationMinutes) {
    // Skip if within break
    if (breakStartMin !== null && breakEndMin !== null) {
      if (m >= breakStartMin && m < breakEndMin) continue;
    }

    const timeStr = formatMinutesToTime(m);

    if (bookedTimes.has(timeStr)) {
      slots.push({ time: timeStr, status: 'booked' });
      continue;
    }

    const lock = lockedSlots.get(timeStr);
    if (lock && lock.lockedUntil > now) {
      // If locked by another device, it's unavailable
      if (lock.deviceId !== currentDeviceId) {
        slots.push({ time: timeStr, status: 'locked' });
        continue;
      }
    }

    slots.push({ time: timeStr, status: 'available' });
  }

  return slots;
}

export function calculateLockExpiration(): { expiresAt: Date; durationMinutes: number } {
  const duration = ENV.LOCK_DURATION_MINUTES; // 15 minutes
  const expiresAt = new Date(Date.now() + duration * 60 * 1000);
  return { expiresAt, durationMinutes: duration };
}
