import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServices } from '@/providers/service-context'
import { HoldExpiredError, HoldNotFoundError } from '@/features/appointments/domain/errors'

export { HoldExpiredError, HoldNotFoundError }

interface HoldSlotArgs {
  barberId: string
  startAt: Date
  endAt: Date
}

interface ConfirmBookingArgs {
  barberId: string
  holdToken: string
  name: string
  email: string
  phone: string
}

export function useBookingFlow(): {
  holdSlot: (args: HoldSlotArgs) => Promise<{ holdToken: string; expiresAt: Date }>
  confirmBooking: (args: ConfirmBookingArgs) => Promise<{ appointmentId: string; cancellationToken: string } | undefined>
  loading: boolean
  error: Error | null
} {
  const { customerService, slotHoldService, appointmentService } = useServices()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const holdSlot = async ({ barberId, startAt, endAt }: HoldSlotArgs) => {
    setLoading(true)
    setError(null)
    try {
      const hold = await slotHoldService.createHold(barberId, startAt, endAt)
      return { holdToken: hold.holdToken, expiresAt: hold.expiresAt }
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const confirmBooking = async ({ barberId, holdToken, name, email, phone }: ConfirmBookingArgs) => {
    setLoading(true)
    setError(null)
    try {
      const customer = await customerService.upsertByEmail(barberId, name, email, phone)

      const appointment = await appointmentService.createFromHold({
        holdToken,
        customerId: customer.id,
      })

      return {
        appointmentId: appointment.id,
        cancellationToken: appointment.cancellationToken,
      }
    } catch (err: unknown) {
      if (err instanceof HoldExpiredError || err instanceof HoldNotFoundError) {
        navigate('/book?expired=1', { replace: true })
        return undefined
      }
      const e = err instanceof Error ? err : new Error(String(err))
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { holdSlot, confirmBooking, loading, error }
}
