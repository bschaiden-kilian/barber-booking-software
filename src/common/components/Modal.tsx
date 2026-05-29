'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
        <div className="px-6 py-4">{children}</div>
        {actions && <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">{actions}</div>}
      </div>
    </div>
  );
}
