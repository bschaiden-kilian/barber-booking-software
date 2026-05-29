import { useState } from 'react'
import { useServices } from '@/providers/service-context'
import type { SlotHold } from '../../domain/SlotHold'

export function useSlotHold(): {
  hold: SlotHold | null
  loading: boolean
  error: Error | null
  createHold: (barberId: string, startAt: Date, endAt: Date) => Promise<void>
  releaseHold: () => Promise<void>
} {
  const { slotHoldService } = useServices()
  const [hold, setHold] = useState<SlotHold | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createHold = async (barberId: string, startAt: Date, endAt: Date): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const newHold = await slotHoldService.createHold(barberId, startAt, endAt)
      setHold(newHold)
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }

  const releaseHold = async (): Promise<void> => {
    if (!hold) return
    await slotHoldService.releaseHold(hold.holdToken)
    setHold(null)
  }

  return { hold, loading, error, createHold, releaseHold }
}
