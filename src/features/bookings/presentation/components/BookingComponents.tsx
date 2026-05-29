'use client';

import React from 'react';
import { useServices } from '../../../services/application/useServices';
import { Card } from '@/common/components/Card';
import { Button } from '@/common/components/Button';
import { Modal } from '@/common/components/Modal';
import { formatDate, formatTime, getNextDays } from '@/common/utils/dateHelpers';
import { Booking } from '../../domain/types';

interface ServiceSelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ServiceSelector({ selectedId, onSelect }: ServiceSelectorProps) {
  const { state: servicesState } = useServices();

  return (
    <div className="grid gap-3">
      {servicesState.services.length === 0 ? (
        <p className="text-slate-600">No services available</p>
      ) : (
        servicesState.services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`text-left p-4 rounded-lg border-2 transition-colors ${
              selectedId === service.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <h3 className="font-semibold text-slate-900">{service.name}</h3>
            <p className="text-sm text-slate-600">{service.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-500">{service.durationMinutes} min</span>
              <span className="font-semibold text-indigo-600">€{service.priceEuro}</span>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

interface DatePickerProps {
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

export function DatePicker({ onDateSelect, selectedDate }: DatePickerProps) {
  const upcomingDays = getNextDays(14);

  return (
    <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
      {upcomingDays.map((date) => (
        <button
          key={date}
          onClick={() => onDateSelect(date)}
          className={`p-3 rounded-lg border-2 text-sm transition-colors ${
            selectedDate === date ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="font-semibold text-slate-900">{formatDate(date).split(',')[0]}</div>
          <div className="text-xs text-slate-600">{formatDate(date).split(',')[1]}</div>
        </button>
      ))}
    </div>
  );
}

interface TimePickerProps {
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
  availableTimes: string[];
}

export function TimePicker({ onTimeSelect, selectedTime, availableTimes }: TimePickerProps) {
  return (
    <div className="grid gap-2 grid-cols-3 sm:grid-cols-6">
      {availableTimes.length === 0 ? (
        <p className="text-slate-600 col-span-full">No available times</p>
      ) : (
        availableTimes.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`p-2 rounded-lg border-2 text-sm font-medium transition-colors ${
              selectedTime === time ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            {formatTime(time)}
          </button>
        ))
      )}
    </div>
  );
}

interface BookingSummaryProps {
  serviceName: string | null;
  date: string | null;
  time: string | null;
  price: number | null;
}

export function BookingSummary({ serviceName, date, time, price }: BookingSummaryProps) {
  return (
    <Card className="bg-slate-50">
      <h3 className="font-semibold text-slate-900 mb-3">Booking Summary</h3>
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Service:</span>
          <span className="font-medium text-slate-900">{serviceName || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Date:</span>
          <span className="font-medium text-slate-900">{date ? formatDate(date) : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Time:</span>
          <span className="font-medium text-slate-900">{time ? formatTime(time) : '—'}</span>
        </div>
        <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
          <span className="text-slate-600">Total:</span>
          <span className="font-semibold text-indigo-600">€{price || '0'}</span>
        </div>
      </div>
    </Card>
  );
}

interface BookingConfirmationProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export function BookingConfirmation({ isOpen, booking, onClose }: BookingConfirmationProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✅ Booking Confirmed!"
      actions={<Button onClick={onClose}>Close</Button>}
    >
      {booking && (
        <div className="space-y-3">
          <p className="text-slate-700">Your appointment has been confirmed!</p>
          <Card className="bg-indigo-50">
            <div className="grid gap-2 text-sm">
              <div>
                <span className="text-slate-600">Service:</span>
                <p className="font-semibold text-slate-900">{booking.serviceName}</p>
              </div>
              <div>
                <span className="text-slate-600">Date & Time:</span>
                <p className="font-semibold text-slate-900">
                  {formatDate(booking.date)} at {formatTime(booking.time)}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Reference:</span>
                <p className="font-mono text-slate-900">{booking.id}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
}
