import { mockBookings } from './mockData';
import { Booking, BookingDTO, BookingStatus } from '../domain/types';

export class BookingRepository {
  private bookings: Booking[];

  constructor() {
    this.bookings = [...mockBookings];
  }

  // Get all bookings
  getAll(): Booking[] {
    return this.bookings.map((b) => this.dtoToEntity(b));
  }

  // Get booking by ID
  getById(id: string): Booking | undefined {
    const booking = this.bookings.find((b) => b.id === id);
    return booking ? this.dtoToEntity(booking) : undefined;
  }

  // Get active bookings (confirmed or completed)
  getActive(): Booking[] {
    return this.bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'completed')
      .map((b) => this.dtoToEntity(b));
  }

  // Check if time slot is available
  isSlotAvailable(date: string, time: string, durationMinutes: number): boolean {
    const slotStart = this.timeToMinutes(time);
    const slotEnd = slotStart + durationMinutes;

    const conflicts = this.bookings.filter(
      (b) =>
        b.date === date &&
        b.status === 'confirmed' &&
        this.hasTimeConflict(this.timeToMinutes(b.time), this.timeToMinutes(b.time) + b.durationMinutes, slotStart, slotEnd),
    );

    return conflicts.length === 0;
  }

  // Create new booking
  create(data: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const id = Date.now().toString();
    const newBooking: Booking = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  // Cancel booking
  cancel(id: string): Booking | undefined {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return undefined;
    booking.status = 'cancelled';
    return this.dtoToEntity(booking);
  }

  // Helper: convert time string to minutes since midnight
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper: check if two time ranges overlap
  private hasTimeConflict(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 < end2 && start2 < end1;
  }

  // Convert DTO to entity
  private dtoToEntity(dto: BookingDTO): Booking {
    return {
      id: dto.id,
      serviceId: dto.serviceId,
      serviceName: dto.serviceName,
      date: dto.date,
      time: dto.time,
      durationMinutes: dto.durationMinutes,
      priceEuro: dto.priceEuro,
      status: dto.status,
      createdAt: dto.createdAt,
    };
  }
}

// Singleton instance
export const bookingRepository = new BookingRepository();
