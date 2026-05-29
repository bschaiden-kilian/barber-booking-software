import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/providers/service-context'
import type { Appointment } from '../../domain/Appointment'

export function useAppointments(barberId: string): {
  data: Appointment[]
  loading: boolean
  error: Error | null
  refresh: () => void
} {
  const { appointmentService } = useServices()
  const [data, setData] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(() => {
    setLoading(true)
    appointmentService.listUpcoming(barberId)
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false))
  }, [appointmentService, barberId])

  useEffect(() => { refresh() }, [refresh])

  return { data, loading, error, refresh }
}
