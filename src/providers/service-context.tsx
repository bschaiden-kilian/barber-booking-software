import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { MockAuthRepository } from '@/features/auth/data/mock-auth-repository'
import { SupabaseAuthRepository } from '@/features/auth/data/supabase-auth-repository'
import { AuthService, type IAuthService } from '@/features/auth/application/auth-service'
import { MockWeeklyScheduleRepository } from '@/features/weekly-schedule/data/mock-weekly-schedule-repository'
import { SupabaseWeeklyScheduleRepository } from '@/features/weekly-schedule/data/supabase-weekly-schedule-repository'
import { WeeklyScheduleService, type IWeeklyScheduleService } from '@/features/weekly-schedule/application/weekly-schedule-service'
import { MockScheduleExceptionRepository } from '@/features/schedule-exceptions/data/mock-schedule-exception-repository'
import { SupabaseScheduleExceptionRepository } from '@/features/schedule-exceptions/data/supabase-schedule-exception-repository'
import { ScheduleExceptionService, type IScheduleExceptionService } from '@/features/schedule-exceptions/application/schedule-exception-service'
import { MockTimeBlockRepository } from '@/features/time-blocks/data/mock-time-block-repository'
import { SupabaseTimeBlockRepository } from '@/features/time-blocks/data/supabase-time-block-repository'
import { TimeBlockService, type ITimeBlockService } from '@/features/time-blocks/application/time-block-service'
import { MockCustomerRepository } from '@/features/customers/data/mock-customer-repository'
import { SupabaseCustomerRepository } from '@/features/customers/data/supabase-customer-repository'
import { CustomerService, type ICustomerService } from '@/features/customers/application/customer-service'
import { MockAppointmentRepository } from '@/features/appointments/data/mock-appointment-repository'
import { SupabaseAppointmentRepository } from '@/features/appointments/data/supabase-appointment-repository'
import { AppointmentService, type IAppointmentService } from '@/features/appointments/application/appointment-service'
import { MockSlotHoldRepository } from '@/features/slot-holds/data/mock-slot-hold-repository'
import { SupabaseSlotHoldRepository } from '@/features/slot-holds/data/supabase-slot-hold-repository'
import { SlotHoldService, type ISlotHoldService } from '@/features/slot-holds/application/slot-hold-service'
import { createSupabaseClient } from '@/lib/supabase'

export interface Services {
  authService: IAuthService
  weeklyScheduleService: IWeeklyScheduleService
  scheduleExceptionService: IScheduleExceptionService
  timeBlockService: ITimeBlockService
  customerService: ICustomerService
  appointmentService: IAppointmentService
  slotHoldService: ISlotHoldService
}

export const ServiceContext = createContext<Services | null>(null)

export function ServiceProvider({ children }: { children: ReactNode }) {
  const services = useMemo<Services>(() => {
    const useMock = import.meta.env.VITE_USE_MOCK === 'true'

    if (useMock) {
      const mockSlotHoldRepo = new MockSlotHoldRepository()
      return {
        authService: new AuthService(new MockAuthRepository()),
        weeklyScheduleService: new WeeklyScheduleService(new MockWeeklyScheduleRepository()),
        scheduleExceptionService: new ScheduleExceptionService(new MockScheduleExceptionRepository()),
        timeBlockService: new TimeBlockService(new MockTimeBlockRepository()),
        customerService: new CustomerService(new MockCustomerRepository()),
        appointmentService: new AppointmentService(new MockAppointmentRepository(mockSlotHoldRepo), mockSlotHoldRepo),
        slotHoldService: new SlotHoldService(mockSlotHoldRepo),
      }
    }

    // createSupabaseClient() throws early if env vars are absent — intentional.
    const client = createSupabaseClient()
    const supabaseSlotHoldRepo = new SupabaseSlotHoldRepository(client)
    return {
      authService: new AuthService(new SupabaseAuthRepository(client)),
      weeklyScheduleService: new WeeklyScheduleService(new SupabaseWeeklyScheduleRepository(client)),
      scheduleExceptionService: new ScheduleExceptionService(new SupabaseScheduleExceptionRepository(client)),
      timeBlockService: new TimeBlockService(new SupabaseTimeBlockRepository(client)),
      customerService: new CustomerService(new SupabaseCustomerRepository(client)),
      appointmentService: new AppointmentService(new SupabaseAppointmentRepository(client), supabaseSlotHoldRepo),
      slotHoldService: new SlotHoldService(supabaseSlotHoldRepo),
    }
  }, [])

  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>
}

export function useServices(): Services {
  const ctx = useContext(ServiceContext)
  if (!ctx) throw new Error('useServices must be used within <ServiceProvider>')
  return ctx
}
