'use client';

import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Service } from '../domain/types';
import { serviceRepository } from '../data/ServiceRepository';

type ServiceState = {
  services: Service[];
};

type ServiceAction =
  | { type: 'LOAD_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'RESET' };

const initialState: ServiceState = {
  services: [],
};

function serviceReducer(state: ServiceState, action: ServiceAction): ServiceState {
  switch (action.type) {
    case 'LOAD_SERVICES':
      return { services: action.payload };
    case 'ADD_SERVICE':
      return { services: [...state.services, action.payload] };
    case 'UPDATE_SERVICE':
      return {
        services: state.services.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'DELETE_SERVICE':
      return {
        services: state.services.filter((s) => s.id !== action.payload),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const ServiceContext = createContext<{
  state: ServiceState;
  loadServices: () => void;
  addService: (data: Omit<Service, 'id'>) => void;
  updateService: (id: string, data: Partial<Omit<Service, 'id'>>) => void;
  deleteService: (id: string) => void;
} | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(serviceReducer, initialState);

  const loadServices = useCallback(() => {
    const services = serviceRepository.getAll();
    dispatch({ type: 'LOAD_SERVICES', payload: services });
  }, []);

  const addService = useCallback((data: Omit<Service, 'id'>) => {
    const newService = serviceRepository.create(data);
    dispatch({ type: 'ADD_SERVICE', payload: newService });
  }, []);

  const updateService = useCallback((id: string, data: Partial<Omit<Service, 'id'>>) => {
    const updated = serviceRepository.update(id, data);
    if (updated) {
      dispatch({ type: 'UPDATE_SERVICE', payload: updated });
    }
  }, []);

  const deleteService = useCallback((id: string) => {
    serviceRepository.delete(id);
    dispatch({ type: 'DELETE_SERVICE', payload: id });
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        state,
        loadServices,
        addService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}
