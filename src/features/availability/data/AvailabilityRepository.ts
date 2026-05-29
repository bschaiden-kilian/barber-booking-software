import { defaultWorkingHours } from './mockData';
import { TimeSlot, WorkingHours } from '../domain/types';

export class AvailabilityRepository {
  private workingHours: WorkingHours[];

  constructor() {
    this.workingHours = JSON.parse(JSON.stringify(defaultWorkingHours));
  }

  // Get working hours
  getWorkingHours(): WorkingHours[] {
    return JSON.parse(JSON.stringify(this.workingHours));
  }

  // Set working hours
  setWorkingHours(hours: WorkingHours[]): WorkingHours[] {
    this.workingHours = JSON.parse(JSON.stringify(hours));
    return this.getWorkingHours();
  }

  // Get working hours for a specific day
  getHoursForDay(dayOfWeek: string): WorkingHours | undefined {
    return this.workingHours.find((h) => h.dayOfWeek === dayOfWeek);
  }

  // Generate available time slots for a date (30-min intervals)
  generateAvailableSlots(date: string, bookedTimes: Array<{ time: string; duration: number }> = []): TimeSlot[] {
    const dayOfWeek = this.getDayOfWeekString(new Date(date));
    const hours = this.getHoursForDay(dayOfWeek);

    if (!hours || !hours.enabled) {
      return [];
    }

    const slots: TimeSlot[] = [];
    const [startHour, startMin] = hours.startTime.split(':').map(Number);
    const [endHour, endMin] = hours.endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + 30 <= endMinutes) {
      const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`;

      // Check if slot overlaps with booked times
      const isBooked = bookedTimes.some(
        (booking) => this.hasTimeConflict(this.timeToMinutes(booking.time), this.timeToMinutes(booking.time) + booking.duration, currentMinutes, currentMinutes + 30),
      );

      slots.push({
        date,
        time,
        available: !isBooked,
      });

      currentMinutes += 30;
    }

    return slots;
  }

  // Helper: get day of week string
  private getDayOfWeekString(date: Date): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  }

  // Helper: convert time string to minutes
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper: check if time ranges overlap
  private hasTimeConflict(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 < end2 && start2 < end1;
  }
}

// Singleton instance
export const availabilityRepository = new AvailabilityRepository();
