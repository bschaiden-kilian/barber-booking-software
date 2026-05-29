import { addMinutes } from 'date-fns'
import type { SlotHoldRepository } from '../data/slot-hold-repository'
import type { SlotHold } from '../domain/SlotHold'
import { HOLD_TTL_MINUTES } from '@/constants'

export interface ISlotHoldService {
  createHold(barberId: string, startAt: Date, endAt: Date): Promise<SlotHold>
  getByToken(token: string): Promise<SlotHold | null>
  getActiveForBarber(barberId: string, from: Date, to: Date): Promise<SlotHold[]>
  releaseHold(token: string): Promise<void>
}

export class SlotHoldService implements ISlotHoldService {
  constructor(private repo: SlotHoldRepository) {}

  async createHold(barberId: string, startAt: Date, endAt: Date): Promise<SlotHold> {
    return this.repo.create({
      barberId,
      startAt,
      endAt,
      holdToken: crypto.randomUUID(),
      expiresAt: addMinutes(new Date(), HOLD_TTL_MINUTES),
    })
  }

  async getByToken(token: string): Promise<SlotHold | null> {
    return this.repo.getByToken(token)
  }

  async getActiveForBarber(barberId: string, from: Date, to: Date): Promise<SlotHold[]> {
    return this.repo.getActiveForRange(barberId, from, to)
  }

  async releaseHold(token: string): Promise<void> {
    return this.repo.deleteByToken(token)
  }
}
