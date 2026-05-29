import type { SlotHold } from '../domain/SlotHold'

export interface CreateSlotHoldInput {
  barberId: string
  startAt: Date
  endAt: Date
  holdToken: string
  expiresAt: Date
}

export interface SlotHoldRepository {
  create(input: CreateSlotHoldInput): Promise<SlotHold>
  getByToken(holdToken: string): Promise<SlotHold | null>
  getActiveForRange(barberId: string, from: Date, to: Date): Promise<SlotHold[]>
  deleteByToken(holdToken: string): Promise<void>
  deleteExpired(barberId: string): Promise<void>
}
