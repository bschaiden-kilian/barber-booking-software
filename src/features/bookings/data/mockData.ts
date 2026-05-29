import { BookingDTO } from '../domain/types';

export const mockBookings: BookingDTO[] = [
  {
    id: '101',
    serviceId: '1',
    serviceName: 'Haircut',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '10:00',
    durationMinutes: 30,
    priceEuro: 25,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '102',
    serviceId: '2',
    serviceName: 'Beard Trim',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '14:00',
    durationMinutes: 20,
    priceEuro: 15,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];
