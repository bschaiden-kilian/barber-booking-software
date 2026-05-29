import type { ScheduleExceptionRepository } from '../data/schedule-exception-repository'
import type { ScheduleException } from '../domain/ScheduleException'

export interface IScheduleExceptionService {
  getForBarber(barberId: string): Promise<ScheduleException[]>
  getForDate(barberId: string, date: string): Promise<ScheduleException | null>
  upsert(exception: ScheduleException): Promise<ScheduleException>
  delete(id: string): Promise<void>
}

export class ScheduleExceptionService implements IScheduleExceptionService {
  constructor(private repo: ScheduleExceptionRepository) {}

  async getForBarber(barberId: string): Promise<ScheduleException[]> {
    return this.repo.getForBarber(barberId)
  }

  async getForDate(barberId: string, date: string): Promise<ScheduleException | null> {
    return this.repo.getForDate(barberId, date)
  }

  async upsert(exception: ScheduleException): Promise<ScheduleException> {
    return this.repo.upsert(exception)
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id)
  }
}
