import { ENV } from './env.js';

interface IpRecord {
  timestamps: number[];
}

const ipHistory = new Map<string, IpRecord>();
const activeDeviceReservations = new Set<string>();

export function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = ENV.RATE_LIMIT_IP_WINDOW_HOURS * 60 * 60 * 1000;
  const record = ipHistory.get(ip) || { timestamps: [] };

  const recent = record.timestamps.filter((t) => now - t < windowMs);
  ipHistory.set(ip, { timestamps: recent });

  return recent.length < ENV.RATE_LIMIT_IP_MAX;
}

export function checkDeviceRateLimit(deviceId: string): boolean {
  if (!deviceId) return true;
  return !activeDeviceReservations.has(deviceId);
}

export function recordBookingAttempt(ip: string, deviceId: string): void {
  const now = Date.now();
  const record = ipHistory.get(ip) || { timestamps: [] };
  record.timestamps.push(now);
  ipHistory.set(ip, record);

  if (deviceId) {
    activeDeviceReservations.add(deviceId);
  }
}

export function releaseDeviceBooking(deviceId: string): void {
  if (deviceId) {
    activeDeviceReservations.delete(deviceId);
  }
}
