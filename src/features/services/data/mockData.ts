import { ServiceDTO } from '../domain/types';

export const mockServices: ServiceDTO[] = [
  {
    id: '1',
    name: 'Haircut',
    description: 'Classic haircut with styling',
    durationMinutes: 30,
    priceEuro: 25,
  },
  {
    id: '2',
    name: 'Beard Trim',
    description: 'Professional beard trim and shaping',
    durationMinutes: 20,
    priceEuro: 15,
  },
  {
    id: '3',
    name: 'Shave',
    description: 'Traditional hot shave',
    durationMinutes: 25,
    priceEuro: 20,
  },
  {
    id: '4',
    name: 'Hair Coloring',
    description: 'Full head hair coloring',
    durationMinutes: 60,
    priceEuro: 40,
  },
];
