import { AvailabilityDTO, WorkingHours } from '../domain/types';

export const defaultWorkingHours: WorkingHours[] = [
  { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', enabled: true },
  { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', enabled: true },
  { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', enabled: true },
  { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', enabled: true },
  { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00', enabled: true },
  { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '15:00', enabled: true },
  { dayOfWeek: 'Sunday', startTime: '09:00', endTime: '17:00', enabled: false },
];

export const mockAvailability: AvailabilityDTO = {
  workingHours: defaultWorkingHours,
};
