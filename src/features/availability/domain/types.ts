export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type WorkingHours = {
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  enabled: boolean;
};

export type TimeSlot = {
  date: string; // ISO string (YYYY-MM-DD)
  time: string; // HH:mm format
  available: boolean;
  reason?: string; // e.g., "Before working hours", "Fully booked"
};

export type AvailabilityDTO = {
  workingHours: WorkingHours[];
};
