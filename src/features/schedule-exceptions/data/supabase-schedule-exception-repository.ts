import type { SupabaseClient } from '@supabase/supabase-js'
import type { ScheduleExceptionRepository } from './schedule-exception-repository'
import type { ScheduleException } from '../domain/ScheduleException'

export class SupabaseScheduleExceptionRepository implements ScheduleExceptionRepository {
  constructor(private client: SupabaseClient) {}

  async getForBarber(_barberId: string): Promise<ScheduleException[]> {
    throw new Error('not implemented')
  }

  async getForDate(_barberId: string, _date: string): Promise<ScheduleException | null> {
    throw new Error('not implemented')
  }

  async upsert(_exception: ScheduleException): Promise<ScheduleException> {
    throw new Error('not implemented')
  }

  async delete(_id: string): Promise<void> {
    throw new Error('not implemented')
  }
}
