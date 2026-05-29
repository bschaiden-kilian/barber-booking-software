import type { WeeklyScheduleEntry } from '../domain/WeeklyScheduleEntry'

export interface WeeklyScheduleRepository {
  getForBarber(barberId: string): Promise<WeeklyScheduleEntry[]>
  upsert(entry: WeeklyScheduleEntry): Promise<WeeklyScheduleEntry>
  delete(id: string): Promise<void>
}
