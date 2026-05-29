export interface AvailableSlot {
  startAt: Date
  endAt: Date
}

export { HoldExpiredError, HoldNotFoundError, HoldMismatchError } from '@/features/appointments/domain/errors'
