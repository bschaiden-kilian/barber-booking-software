'use client';

import React, { useState, useEffect } from 'react';
import { useAvailability } from '../../application/useAvailability';
import { Card } from '@/common/components/Card';
import { Button } from '@/common/components/Button';
import { Input } from '@/common/components/Input';
import { WorkingHours } from '../../domain/types';
import { formatTime } from '@/common/utils/dateHelpers';

export function AvailabilityManager() {
  const { state, loadWorkingHours, setWorkingHours } = useAvailability();
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState<WorkingHours[]>([]);

  useEffect(() => {
    loadWorkingHours();
  }, [loadWorkingHours]);

  useEffect(() => {
    setHours(state.workingHours);
  }, [state.workingHours]);

  const handleSave = () => {
    setWorkingHours(hours);
    setIsEditing(false);
  };

  const toggleDay = (day: string) => {
    setHours(
      hours.map((h) =>
        h.dayOfWeek === day
          ? { ...h, enabled: !h.enabled }
          : h,
      ),
    );
  };

  const updateTime = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setHours(
      hours.map((h) =>
        h.dayOfWeek === day
          ? { ...h, [field]: value }
          : h,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Working Hours</h3>
        <Button size="sm" variant={isEditing ? 'danger' : 'secondary'} onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </div>

      <div className="grid gap-3">
        {hours.map((hour) => (
          <Card key={hour.dayOfWeek} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{hour.dayOfWeek}</h4>
                {!isEditing && (
                  <p className="text-sm text-slate-600">
                    {hour.enabled ? `${hour.startTime} - ${hour.endTime}` : 'Closed'}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center gap-2 ml-4">
                  <input
                    type="checkbox"
                    checked={hour.enabled}
                    onChange={() => toggleDay(hour.dayOfWeek)}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  {hour.enabled && (
                    <>
                      <Input
                        type="time"
                        value={hour.startTime}
                        onChange={(e) => updateTime(hour.dayOfWeek, 'startTime', e.target.value)}
                        className="w-24"
                      />
                      <span className="text-slate-600">—</span>
                      <Input
                        type="time"
                        value={hour.endTime}
                        onChange={(e) => updateTime(hour.dayOfWeek, 'endTime', e.target.value)}
                        className="w-24"
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
