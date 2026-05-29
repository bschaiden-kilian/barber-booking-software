import { useContext } from 'react';
import { ServiceContext } from './ServiceContext';

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within ServiceProvider');
  }
  return context;
}
