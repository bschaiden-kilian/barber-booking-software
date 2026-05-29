'use client';

import React, { useState } from 'react';
import { Card } from '@/common/components/Card';
import { Button } from '@/common/components/Button';
import { ServiceManager } from '../components/ServiceManager';
import { AvailabilityManager } from '../../../availability/presentation/components/AvailabilityManager';
import { BookingsList } from '../components/BookingsList';

type AdminTab = 'services' | 'availability' | 'bookings';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('services');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Admin Dashboard</h1>
        <p className="text-slate-600">Manage services, availability, and view bookings</p>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { id: 'services', label: 'Services' },
          { id: 'availability', label: 'Availability' },
          { id: 'bookings', label: 'Bookings' },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'secondary'}
            onClick={() => setActiveTab(tab.id as AdminTab)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'services' && <ServiceManager />}
      {activeTab === 'availability' && <AvailabilityManager />}
      {activeTab === 'bookings' && <BookingsList />}
    </div>
  );
}
