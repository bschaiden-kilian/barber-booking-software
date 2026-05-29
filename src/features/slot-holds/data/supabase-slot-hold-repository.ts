import type { SupabaseClient } from '@supabase/supabase-js'
import type { SlotHoldRepository, CreateSlotHoldInput } from './slot-hold-repository'
import type { SlotHold } from '../domain/SlotHold'

export class SupabaseSlotHoldRepository implements SlotHoldRepository {
  constructor(private client: SupabaseClient) {}

  async create(_input: CreateSlotHoldInput): Promise<SlotHold> {
    throw new Error('not implemented')
  }

  async getByToken(_holdToken: string): Promise<SlotHold | null> {
    throw new Error('not implemented')
  }

  async getActiveForRange(_barberId: string, _from: Date, _to: Date): Promise<SlotHold[]> {
    throw new Error('not implemented in Phase 2a')
  }

  async deleteByToken(_holdToken: string): Promise<void> {
    throw new Error('not implemented')
  }

  async deleteExpired(_barberId: string): Promise<void> {
    throw new Error('not implemented')
  }
}
