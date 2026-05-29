import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BookingPage } from '@/pages/BookingPage'
import { BookingConfirmPage } from '@/pages/BookingConfirmPage'
import { BookingSuccessPage } from '@/pages/BookingSuccessPage'
import { CancelPage } from '@/pages/CancelPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { AdminSchedulePage } from '@/pages/AdminSchedulePage'
import { AdminAppointmentsPage } from '@/pages/AdminAppointmentsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { ImpressumPage } from '@/pages/ImpressumPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  // Root redirect
  { path: '/', element: <Navigate to="/book" replace /> },

  // Customer-facing
  { path: '/book', element: <BookingPage /> },
  { path: '/book/confirm', element: <BookingConfirmPage /> },
  { path: '/book/success', element: <BookingSuccessPage /> },
  { path: '/cancel/:token', element: <CancelPage /> },

  // Admin (auth guard added in Phase 3)
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/admin/schedule', element: <AdminSchedulePage /> },
  { path: '/admin/appointments', element: <AdminAppointmentsPage /> },

  // Legal
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/impressum', element: <ImpressumPage /> },

  // 404
  { path: '*', element: <NotFoundPage /> },
])
