import { fromZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'
import type { TimeBlockRepository, CreateTimeBlockInput } from './time-block-repository'
import { TimeBlock } from '../domain/TimeBlock'
import { MOCK_BARBER_ID } from '@/constants/mock-ids'
import { BARBER_TIMEZONE } from '@/constants'

// Set to 1.0 to always trigger failure (useful for testing rollback behaviour)
const WRITE_FAILURE_RATE = 0.05

function mockLatency(): Promise<void> {
  return new Promise((r) => setTimeout(r, 50 + Math.random() * 100))
}

async function mockWrite<T>(fn: () => T): Promise<T> {
  await mockLatency()
  if (Math.random() < WRITE_FAILURE_RATE) {
    throw new Error('Speichern fehlgeschlagen (simulierter Fehler)')
  }
  return fn()
}

function makeTodayLunchBlock(): TimeBlock {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const [year, month, day] = todayStr.split('-').map(Number)
  return new TimeBlock(
    '00000000-0000-0000-0003-000000000001',
    MOCK_BARBER_ID,
    fromZonedTime(new Date(year!, (month as number) - 1, day!, 12, 0), BARBER_TIMEZONE),
    fromZonedTime(new Date(year!, (month as number) - 1, day!, 13, 0), BARBER_TIMEZONE),
    'Mittagspause',
  )
}

export class MockTimeBlockRepository implements TimeBlockRepository {
  private store: TimeBlock[] = [makeTodayLunchBlock()]

  async getForBarber(barberId: string): Promise<TimeBlock[]> {
    await mockLatency()
    return this.store.filter((b) => b.barberId === barberId)
  }

  async getForRange(barberId: string, from: Date, to: Date): Promise<TimeBlock[]> {
    await mockLatency()
    return this.store.filter(
      (b) => b.barberId === barberId && b.startAt < to && b.endAt > from,
    )
  }

  async create(input: CreateTimeBlockInput): Promise<TimeBlock> {
    return mockWrite(() => {
      const created = new TimeBlock(
        crypto.randomUUID(),
        input.barberId,
        input.startAt,
        input.endAt,
        input.reason,
      )
      this.store.push(created)
      return created
    })
  }

  async delete(id: string): Promise<void> {
    return mockWrite(() => {
      this.store = this.store.filter((b) => b.id !== id)
    })
  }
}
