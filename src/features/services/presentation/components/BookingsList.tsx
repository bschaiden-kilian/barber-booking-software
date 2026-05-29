'use client';

import React, { useEffect } from 'react';
import { useBooking } from '../../../bookings/application/useBooking';
import { Card } from '@/common/components/Card';
import { Button } from '@/common/components/Button';
import { formatDate, formatTime } from '@/common/utils/dateHelpers';

export function BookingsList() {
  const { state, loadBookings } = useBooking();

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const allBookings = state.bookings.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  if (allBookings.length === 0) {
    return (
      <Card>
        <p className="text-slate-600">No bookings yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {allBookings.map((booking) => (
        <Card key={booking.id} className={booking.status === 'cancelled' ? 'opacity-50' : ''}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-slate-900">{booking.serviceName}</h4>
              <p className="text-sm text-slate-600">
                {formatDate(booking.date)} at {formatTime(booking.time)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Duration: {booking.durationMinutes} min • €{booking.priceEuro}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'cancelled'
                    ? 'bg-slate-200 text-slate-700'
                    : booking.status === 'completed'
                    ? 'bg-green-200 text-green-700'
                    : 'bg-blue-200 text-blue-700'
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
