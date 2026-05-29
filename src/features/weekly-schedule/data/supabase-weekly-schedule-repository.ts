import type { SupabaseClient } from '@supabase/supabase-js'
import type { WeeklyScheduleRepository } from './weekly-schedule-repository'
import type { WeeklyScheduleEntry } from '../domain/WeeklyScheduleEntry'

export class SupabaseWeeklyScheduleRepository implements WeeklyScheduleRepository {
  constructor(private client: SupabaseClient) {}

  async getForBarber(_barberId: string): Promise<WeeklyScheduleEntry[]> {
    throw new Error('not implemented')
  }

  async upsert(_entry: WeeklyScheduleEntry): Promise<WeeklyScheduleEntry> {
    throw new Error('not implemented')
  }

  async delete(_id: string): Promise<void> {
    throw new Error('not implemented')
  }
}
