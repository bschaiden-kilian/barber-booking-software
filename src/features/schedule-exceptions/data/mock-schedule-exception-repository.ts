import { addDays, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { ScheduleExceptionRepository } from './schedule-exception-repository'
import { ScheduleException } from '../domain/ScheduleException'
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

const CLOSED_DATE = format(addDays(toZonedTime(new Date(), BARBER_TIMEZONE), 7), 'yyyy-MM-dd')

const SEED: ScheduleException[] = [
  new ScheduleException(
    '00000000-0000-0000-0002-000000000001',
    MOCK_BARBER_ID,
    CLOSED_DATE,
    false,
    undefined,
    undefined,
    'Urlaub',
  ),
]

export class MockScheduleExceptionRepository implements ScheduleExceptionRepository {
  private store: ScheduleException[] = [...SEED]

  async getForBarber(barberId: string): Promise<ScheduleException[]> {
    await mockLatency()
    return this.store.filter((e) => e.barberId === barberId)
  }

  async getForDate(barberId: string, date: string): Promise<ScheduleException | null> {
    await mockLatency()
    return this.store.find((e) => e.barberId === barberId && e.exceptionDate === date) ?? null
  }

  async upsert(exception: ScheduleException): Promise<ScheduleException> {
    return mockWrite(() => {
      const idx = this.store.findIndex(
        (e) => e.barberId === exception.barberId && e.exceptionDate === exception.exceptionDate,
      )
      if (idx >= 0) {
        this.store[idx] = exception
      } else {
        this.store.push(exception)
      }
      return exception
    })
  }

  async delete(id: string): Promise<void> {
    return mockWrite(() => {
      this.store = this.store.filter((e) => e.id !== id)
    })
  }
}
