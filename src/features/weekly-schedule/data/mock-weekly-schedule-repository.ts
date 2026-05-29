import type { WeeklyScheduleRepository } from './weekly-schedule-repository'
import { WeeklyScheduleEntry, type DayOfWeek } from '../domain/WeeklyScheduleEntry'
import { MOCK_BARBER_ID } from '@/constants/mock-ids'

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

const SEED: WeeklyScheduleEntry[] = ([1, 2, 3, 4, 5] as DayOfWeek[]).map(
  (day) =>
    new WeeklyScheduleEntry(
      `00000000-0000-0000-0001-${String(day).padStart(12, '0')}`,
      MOCK_BARBER_ID,
      day,
      '09:00',
      '18:00',
      true,
    ),
)

// Saturday: 09:00–13:00
SEED.push(
  new WeeklyScheduleEntry(
    '00000000-0000-0000-0001-000000000006',
    MOCK_BARBER_ID,
    6,
    '09:00',
    '13:00',
    true,
  ),
)

// Sunday: closed
SEED.push(
  new WeeklyScheduleEntry(
    '00000000-0000-0000-0001-000000000007',
    MOCK_BARBER_ID,
    7,
    '09:00',
    '18:00',
    false,
  ),
)

export class MockWeeklyScheduleRepository implements WeeklyScheduleRepository {
  private store = new Map<string, WeeklyScheduleEntry[]>([
    [MOCK_BARBER_ID, [...SEED]],
  ])

  async getForBarber(barberId: string): Promise<WeeklyScheduleEntry[]> {
    await mockLatency()
    return this.store.get(barberId) ?? []
  }

  async upsert(entry: WeeklyScheduleEntry): Promise<WeeklyScheduleEntry> {
    return mockWrite(() => {
      const current = this.store.get(entry.barberId) ?? []
      const idx = current.findIndex((e) => e.dayOfWeek === entry.dayOfWeek)
      if (idx >= 0) {
        current[idx] = entry
      } else {
        current.push(entry)
      }
      this.store.set(entry.barberId, current)
      return entry
    })
  }

  async delete(id: string): Promise<void> {
    return mockWrite(() => {
      for (const [barberId, entries] of this.store) {
        this.store.set(barberId, entries.filter((e) => e.id !== id))
      }
    })
  }
}
