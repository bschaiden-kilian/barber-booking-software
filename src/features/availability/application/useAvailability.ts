import { useContext } from 'react';
import { AvailabilityContext } from './AvailabilityContext';

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error('useAvailability must be used within AvailabilityProvider');
  }
  return context;
}
