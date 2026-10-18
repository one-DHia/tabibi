export type SlotStatus = 'available' | 'locked' | 'booked';

export interface TimeSlot {
  time: string; // e.g. "09:30"
  status: SlotStatus;
  lockedUntil?: string; // ISO string if locked
}

export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  cabinetId: string;
  patientName: string;
  patientWhatsapp: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  status: AppointmentStatus;
  reminder24hSent: boolean;
  reminder2hSent: boolean;
  reminder24hAt: string; // ISO
  reminder2hAt: string; // ISO
  secureToken: string; // token for single-use appointment link
  deviceId: string;
  createdAt: string;
}

export interface LockSlotInput {
  cabinetSlug: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  deviceId: string;
}

export interface CreateBookingInput {
  cabinetSlug: string;
  date: string;
  time: string;
  patientName: string;
  patientWhatsapp: string;
  deviceId: string;
}
