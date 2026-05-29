import type { ScheduleException } from '../domain/ScheduleException'

export interface ScheduleExceptionRepository {
  getForBarber(barberId: string): Promise<ScheduleException[]>
  getForDate(barberId: string, date: string): Promise<ScheduleException | null>
  upsert(exception: ScheduleException): Promise<ScheduleException>
  delete(id: string): Promise<void>
}
