import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/providers/service-context'
import type { Customer } from '../../domain/Customer'

export function useCustomers(barberId: string): {
  customers: Customer[]
  loading: boolean
  error: Error | null
  refresh: () => void
} {
  const { customerService } = useServices()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(() => {
    setLoading(true)
    customerService.listForBarber(barberId)
      .then(setCustomers)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false))
  }, [customerService, barberId])

  useEffect(() => { refresh() }, [refresh])

  return { customers, loading, error, refresh }
}
