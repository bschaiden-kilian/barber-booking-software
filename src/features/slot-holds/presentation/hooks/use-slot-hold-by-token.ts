import { useState, useEffect } from 'react'
import { useServices } from '@/providers/service-context'
import type { SlotHold } from '../../domain/SlotHold'

export function useSlotHoldByToken(token: string | null): {
  hold: SlotHold | null
  loading: boolean
  error: Error | null
} {
  const { slotHoldService } = useServices()
  const [hold, setHold] = useState<SlotHold | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!token) {
      setHold(null)
      setLoading(false)
      return
    }
    setLoading(true)
    slotHoldService
      .getByToken(token)
      .then(setHold)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err : new Error(String(err))),
      )
      .finally(() => setLoading(false))
  }, [slotHoldService, token])

  return { hold, loading, error }
}
