export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO string
  time: string; // HH:mm format
  durationMinutes: number;
  priceEuro: number;
  status: BookingStatus;
  createdAt: string; // ISO string
};

export type BookingDTO = {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  priceEuro: number;
  status: BookingStatus;
  createdAt: string;
};
