import type { SlotHoldRepository, CreateSlotHoldInput } from './slot-hold-repository'
import { SlotHold } from '../domain/SlotHold'

export class MockSlotHoldRepository implements SlotHoldRepository {
  private store: SlotHold[] = []

  async create(input: CreateSlotHoldInput): Promise<SlotHold> {
    const created = new SlotHold(
      crypto.randomUUID(),
      input.barberId,
      input.startAt,
      input.endAt,
      input.holdToken,
      input.expiresAt,
    )
    this.store.push(created)
    return created
  }

  async getByToken(holdToken: string): Promise<SlotHold | null> {
    return this.store.find((h) => h.holdToken === holdToken) ?? null
  }

  async getActiveForRange(barberId: string, from: Date, to: Date): Promise<SlotHold[]> {
    const now = new Date()
    return this.store.filter(
      (h) =>
        h.barberId === barberId &&
        h.expiresAt > now &&
        h.startAt < to &&
        h.endAt > from,
    )
  }

  async deleteByToken(holdToken: string): Promise<void> {
    this.store = this.store.filter((h) => h.holdToken !== holdToken)
  }

  async deleteExpired(barberId: string): Promise<void> {
    const now = new Date()
    this.store = this.store.filter(
      (h) => !(h.barberId === barberId && h.expiresAt <= now),
    )
  }
}
