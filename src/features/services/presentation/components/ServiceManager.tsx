'use client';

import React, { useState, useEffect } from 'react';
import { useServices } from '../../application/useServices';
import { Card } from '@/common/components/Card';
import { Button } from '@/common/components/Button';
import { Input } from '@/common/components/Input';
import { Modal } from '@/common/components/Modal';
import { Service } from '../../domain/types';
import { validateServiceName, validateDuration, validatePrice } from '@/common/utils/validators';

export function ServiceManager() {
  const { state, loadServices, addService, deleteService } = useServices();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 30,
    priceEuro: 25,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateServiceName(formData.name)) {
      newErrors.name = 'Service name is required (max 100 chars)';
    }
    if (!validateDuration(formData.durationMinutes)) {
      newErrors.duration = 'Duration must be between 1 and 480 minutes';
    }
    if (!validatePrice(formData.priceEuro)) {
      newErrors.price = 'Price must be between 0.01 and 10000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddService = () => {
    if (!validateForm()) return;

    addService({
      name: formData.name,
      description: formData.description,
      durationMinutes: formData.durationMinutes,
      priceEuro: formData.priceEuro,
    });

    setFormData({ name: '', description: '', durationMinutes: 30, priceEuro: 25 });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Services</h3>
        <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
          + Add Service
        </Button>
      </div>

      {state.services.length === 0 ? (
        <Card>
          <p className="text-slate-600">No services configured</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {state.services.map((service) => (
            <Card key={service.id} className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-slate-900">{service.name}</h4>
                <p className="text-sm text-slate-600">{service.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>{service.durationMinutes} min</span>
                  <span>€{service.priceEuro}</span>
                </div>
              </div>
              <Button size="sm" variant="danger" onClick={() => deleteService(service.id)}>
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Service"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService}>Add Service</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Service Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="e.g., Buzz Cut"
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description"
          />
          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            max="480"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
            error={errors.duration}
          />
          <Input
            label="Price (€)"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.priceEuro}
            onChange={(e) => setFormData({ ...formData, priceEuro: parseFloat(e.target.value) })}
            error={errors.price}
          />
        </div>
      </Modal>
    </div>
  );
}
