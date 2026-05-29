import type { SupabaseClient } from '@supabase/supabase-js'
import type { TimeBlockRepository, CreateTimeBlockInput } from './time-block-repository'
import type { TimeBlock } from '../domain/TimeBlock'

export class SupabaseTimeBlockRepository implements TimeBlockRepository {
  constructor(private client: SupabaseClient) {}

  async getForBarber(_barberId: string): Promise<TimeBlock[]> {
    throw new Error('not implemented')
  }

  async getForRange(_barberId: string, _from: Date, _to: Date): Promise<TimeBlock[]> {
    throw new Error('not implemented')
  }

  async create(_input: CreateTimeBlockInput): Promise<TimeBlock> {
    throw new Error('not implemented')
  }

  async delete(_id: string): Promise<void> {
    throw new Error('not implemented')
  }
}
