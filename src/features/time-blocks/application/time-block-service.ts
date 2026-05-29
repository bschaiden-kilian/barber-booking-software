import type { TimeBlockRepository, CreateTimeBlockInput } from '../data/time-block-repository'
import type { TimeBlock } from '../domain/TimeBlock'

export interface ITimeBlockService {
  // Used by availability calculation (booking flow)
  getForBarber(barberId: string, from: Date, to: Date): Promise<TimeBlock[]>
  // Used by admin list view — no range needed
  listAll(barberId: string): Promise<TimeBlock[]>
  create(input: CreateTimeBlockInput): Promise<TimeBlock>
  delete(id: string): Promise<void>
}

export class TimeBlockService implements ITimeBlockService {
  constructor(private repo: TimeBlockRepository) {}

  async getForBarber(barberId: string, from: Date, to: Date): Promise<TimeBlock[]> {
    return this.repo.getForRange(barberId, from, to)
  }

  async listAll(barberId: string): Promise<TimeBlock[]> {
    return this.repo.getForBarber(barberId)
  }

  async create(input: CreateTimeBlockInput): Promise<TimeBlock> {
    return this.repo.create(input)
  }

  async delete(id: string): Promise<void> {
    return this.repo.delete(id)
  }
}
