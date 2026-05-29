import type { TimeBlock } from '../domain/TimeBlock'

export interface CreateTimeBlockInput {
  barberId: string
  startAt: Date
  endAt: Date
  reason?: string
}

export interface TimeBlockRepository {
  getForBarber(barberId: string): Promise<TimeBlock[]>
  getForRange(barberId: string, from: Date, to: Date): Promise<TimeBlock[]>
  create(input: CreateTimeBlockInput): Promise<TimeBlock>
  delete(id: string): Promise<void>
}
