'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '../../application/useBooking';
import { Card } from '@/common/components/Card';
import { Button } from '@/common/components/Button';
import { formatDate, formatTime } from '@/common/utils/dateHelpers';

export function UpcomingBookings() {
  const { state, loadBookings, cancelBooking } = useBooking();

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const upcomingBookings = state.bookings.filter((b) => b.status === 'confirmed').sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  if (upcomingBookings.length === 0) {
    return (
      <Card>
        <p className="text-slate-600">No upcoming bookings</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {upcomingBookings.map((booking) => (
        <Card key={booking.id} className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-slate-900">{booking.serviceName}</h3>
            <p className="text-sm text-slate-600">
              {formatDate(booking.date)} at {formatTime(booking.time)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Duration: {booking.durationMinutes} min</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-semibold text-indigo-600">€{booking.priceEuro}</span>
            <Button size="sm" variant="danger" onClick={() => cancelBooking(booking.id)}>
              Cancel
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
