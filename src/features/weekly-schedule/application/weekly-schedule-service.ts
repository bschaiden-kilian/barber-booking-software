import type { WeeklyScheduleRepository } from '../data/weekly-schedule-repository'
import type { WeeklyScheduleEntry } from '../domain/WeeklyScheduleEntry'

export interface IWeeklyScheduleService {
  getForBarber(barberId: string): Promise<WeeklyScheduleEntry[]>
  upsertEntry(entry: WeeklyScheduleEntry): Promise<WeeklyScheduleEntry>
  deleteEntry(id: string): Promise<void>
}

export class WeeklyScheduleService implements IWeeklyScheduleService {
  constructor(private repo: WeeklyScheduleRepository) {}

  async getForBarber(barberId: string): Promise<WeeklyScheduleEntry[]> {
    return this.repo.getForBarber(barberId)
  }

  async upsertEntry(entry: WeeklyScheduleEntry): Promise<WeeklyScheduleEntry> {
    return this.repo.upsert(entry)
  }

  async deleteEntry(id: string): Promise<void> {
    return this.repo.delete(id)
  }
}
