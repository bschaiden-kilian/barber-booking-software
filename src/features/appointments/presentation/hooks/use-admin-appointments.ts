import { useState, useCallback, useEffect } from 'react'
import { addYears, subYears } from 'date-fns'
import { useServices } from '@/providers/service-context'
import type { Appointment } from '../../domain/Appointment'

type Filter = 'upcoming' | 'past' | 'all'

export function useAdminAppointments(
  barberId: string,
  filter: Filter = 'upcoming',
): {
  appointments: Appointment[]
  loading: boolean
  error: Error | null
  refresh: () => void
  cancelAppointment: (id: string, reason?: string) => Promise<void>
} {
  const { appointmentService } = useServices()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(() => {
    if (!barberId) return
    setLoading(true)
    const now = new Date()
    const from = filter === 'upcoming' ? now : subYears(now, 2)
    const to = filter === 'past' ? now : addYears(now, 2)
    appointmentService
      .listInRange(barberId, from, to)
      .then((all) => {
        if (filter === 'upcoming') {
          setAppointments(all.filter((a) => a.status === 'confirmed'))
        } else if (filter === 'past') {
          setAppointments(all.filter((a) => a.startAt < now))
        } else {
          setAppointments(all)
        }
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err : new Error(String(err))),
      )
      .finally(() => setLoading(false))
  }, [appointmentService, barberId, filter])

  useEffect(() => {
    refresh()
  }, [refresh])

  const cancelAppointment = async (id: string, reason?: string): Promise<void> => {
    await appointmentService.cancelByBarber(id, reason)
    refresh()
  }

  return { appointments, loading, error, refresh, cancelAppointment }
}
