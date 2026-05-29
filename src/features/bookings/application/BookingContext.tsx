'use client';

import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Booking } from '../domain/types';
import { bookingRepository } from '../data/BookingRepository';

type BookingState = {
  bookings: Booking[];
};

type BookingAction =
  | { type: 'LOAD_BOOKINGS'; payload: Booking[] }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'CANCEL_BOOKING'; payload: string }
  | { type: 'RESET' };

const initialState: BookingState = {
  bookings: [],
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'LOAD_BOOKINGS':
      return { bookings: action.payload };
    case 'ADD_BOOKING':
      return { bookings: [...state.bookings, action.payload] };
    case 'CANCEL_BOOKING':
      return {
        bookings: state.bookings.map((b) =>
          b.id === action.payload ? { ...b, status: 'cancelled' as const } : b,
        ),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const BookingContext = createContext<{
  state: BookingState;
  loadBookings: () => void;
  addBooking: (data: Omit<Booking, 'id' | 'createdAt'>) => Booking | null;
  cancelBooking: (id: string) => void;
} | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const loadBookings = useCallback(() => {
    const bookings = bookingRepository.getAll();
    dispatch({ type: 'LOAD_BOOKINGS', payload: bookings });
  }, []);

  const addBooking = useCallback((data: Omit<Booking, 'id' | 'createdAt'>) => {
    const isAvailable = bookingRepository.isSlotAvailable(data.date, data.time, data.durationMinutes);
    if (!isAvailable) {
      return null;
    }
    const newBooking = bookingRepository.create(data);
    dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    return newBooking;
  }, []);

  const cancelBooking = useCallback((id: string) => {
    bookingRepository.cancel(id);
    dispatch({ type: 'CANCEL_BOOKING', payload: id });
  }, []);

  return (
    <BookingContext.Provider
      value={{
        state,
        loadBookings,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
