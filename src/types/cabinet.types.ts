export interface Cabinet {
  id: string;
  userId: string;
  slug: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean;
  openTime: string; // "08:30"
  closeTime: string; // "16:30"
  breakStart?: string; // "12:00"
  breakEnd?: string; // "13:00"
}

export interface WorkingHoursConfig {
  cabinetId: string;
  slotDurationMinutes: number; // e.g. 20, 30
  schedules: DaySchedule[];
}
