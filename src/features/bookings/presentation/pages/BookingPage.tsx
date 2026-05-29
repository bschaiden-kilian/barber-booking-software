'use client';

import React, { useState, useEffect } from 'react';
import { useServices } from '../../../services/application/useServices';
import { useAvailability } from '../../../availability/application/useAvailability';
import { useBooking } from '../../application/useBooking';
import { Booking } from '../../domain/types';
import { Card } from '@/common/components/Card';
import { Button } from '@/common/components/Button';
import { ServiceSelector, DatePicker, TimePicker, BookingSummary, BookingConfirmation } from '../components/BookingComponents';
import { UpcomingBookings } from '../components/UpcomingBookings';

export function BookingPage() {
  const { state: servicesState, loadServices } = useServices();
  const { state: availState, loadWorkingHours, getAvailableSlots } = useAvailability();
  const { state: bookingState, loadBookings, addBooking } = useBooking();

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadServices();
    loadWorkingHours();
    loadBookings();
  }, [loadServices, loadWorkingHours, loadBookings]);

  // Generate available times when date changes
  useEffect(() => {
    if (selectedDate) {
      const bookedOnDate = bookingState.bookings
        .filter((b) => b.date === selectedDate && b.status === 'confirmed')
        .map((b) => ({ time: b.time, duration: b.durationMinutes }));

      const slots = getAvailableSlots(selectedDate, bookedOnDate);
      const times = slots.filter((s) => s.available).map((s) => s.time);
      setAvailableTimes(times);
      setSelectedTime(null);
    }
  }, [selectedDate, bookingState.bookings, getAvailableSlots]);

  const selectedService = servicesState.services.find((s) => s.id === selectedServiceId);

  const handleConfirmBooking = () => {
    if (!selectedServiceId || !selectedDate || !selectedTime) return;

    const service = servicesState.services.find((s) => s.id === selectedServiceId);
    if (!service) return;

    const booking = addBooking({
      serviceId: service.id,
      serviceName: service.name,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: service.durationMinutes,
      priceEuro: service.priceEuro,
      status: 'confirmed',
    });

    if (booking) {
      setConfirmedBooking(booking);
      // Reset form
      setSelectedServiceId(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableTimes([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Book Your Appointment</h2>

            {/* Step 1: Service Selection */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 1: Select a Service</h3>
              <ServiceSelector selectedId={selectedServiceId} onSelect={setSelectedServiceId} />
            </div>

            {selectedServiceId && (
              <>
                {/* Step 2: Date Selection */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 2: Select a Date</h3>
                  <DatePicker onDateSelect={setSelectedDate} selectedDate={selectedDate} />
                </div>

                {/* Step 3: Time Selection */}
                {selectedDate && (
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Step 3: Select a Time</h3>
                    <TimePicker
                      onTimeSelect={setSelectedTime}
                      selectedTime={selectedTime}
                      availableTimes={availableTimes}
                    />
                  </div>
                )}

                {/* Action Button */}
                {selectedDate && selectedTime && (
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <Button onClick={handleConfirmBooking} size="lg" className="w-full">
                      Confirm Booking
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <BookingSummary
            serviceName={selectedService?.name || null}
            date={selectedDate}
            time={selectedTime}
            price={selectedService?.priceEuro || null}
          />

          {/* Upcoming Bookings */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Bookings</h3>
            <UpcomingBookings />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <BookingConfirmation
        isOpen={!!confirmedBooking}
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />
    </div>
  );
}
