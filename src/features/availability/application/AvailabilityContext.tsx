'use client';

import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { WorkingHours, TimeSlot } from '../domain/types';
import { availabilityRepository } from '../data/AvailabilityRepository';

type AvailabilityState = {
  workingHours: WorkingHours[];
};

type AvailabilityAction =
  | { type: 'LOAD_WORKING_HOURS'; payload: WorkingHours[] }
  | { type: 'SET_WORKING_HOURS'; payload: WorkingHours[] }
  | { type: 'RESET' };

const initialState: AvailabilityState = {
  workingHours: [],
};

function availabilityReducer(state: AvailabilityState, action: AvailabilityAction): AvailabilityState {
  switch (action.type) {
    case 'LOAD_WORKING_HOURS':
      return { workingHours: action.payload };
    case 'SET_WORKING_HOURS':
      return { workingHours: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const AvailabilityContext = createContext<{
  state: AvailabilityState;
  loadWorkingHours: () => void;
  setWorkingHours: (hours: WorkingHours[]) => void;
  getAvailableSlots: (date: string, bookedTimes: Array<{ time: string; duration: number }>) => TimeSlot[];
} | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(availabilityReducer, initialState);

  const loadWorkingHours = useCallback(() => {
    const hours = availabilityRepository.getWorkingHours();
    dispatch({ type: 'LOAD_WORKING_HOURS', payload: hours });
  }, []);

  const setWorkingHours = useCallback((hours: WorkingHours[]) => {
    const updated = availabilityRepository.setWorkingHours(hours);
    dispatch({ type: 'SET_WORKING_HOURS', payload: updated });
  }, []);

  const getAvailableSlots = useCallback(
    (date: string, bookedTimes: Array<{ time: string; duration: number }>) => {
      return availabilityRepository.generateAvailableSlots(date, bookedTimes);
    },
    [],
  );

  return (
    <AvailabilityContext.Provider
      value={{
        state,
        loadWorkingHours,
        setWorkingHours,
        getAvailableSlots,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}
