'use client';

import Link from 'next/link';
import React from 'react';

export function Header() {
  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          ✂️ Barber Booking
        </Link>
        <nav className="flex gap-4">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Book
          </Link>
          <Link
            href="/admin"
            className="px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
