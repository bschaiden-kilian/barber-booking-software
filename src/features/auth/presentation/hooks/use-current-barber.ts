import { useState, useEffect } from 'react'
import { useServices } from '@/providers/service-context'
import type { Barber } from '../../domain/Barber'

export function useCurrentBarber(): { barber: Barber | null; loading: boolean; error: Error | null } {
  const { authService } = useServices()
  const [barber, setBarber] = useState<Barber | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    authService.getCurrentBarber()
      .then(setBarber)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false))
  }, [authService])

  return { barber, loading, error }
}
