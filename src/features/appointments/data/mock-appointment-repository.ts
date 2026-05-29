import { subDays, addDays, addMinutes } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import type { AppointmentRepository, CreateAppointmentInput, CreateFromHoldInput } from './appointment-repository'
import { Appointment } from '../domain/Appointment'
import { MOCK_BARBER_ID, MOCK_CUSTOMER_1_ID, MOCK_CUSTOMER_2_ID, MOCK_CUSTOMER_3_ID } from '@/constants/mock-ids'
import { BARBER_TIMEZONE } from '@/constants'
import type { SlotHoldRepository } from '@/features/slot-holds/data/slot-hold-repository'

function slot(daysOffset: number, hour: number, durationMinutes = 30): { startAt: Date; endAt: Date } {
  const base = daysOffset < 0 ? subDays(new Date(), Math.abs(daysOffset)) : addDays(new Date(), daysOffset)
  const startAt = fromZonedTime(
    new Date(base.getFullYear(), base.getMonth(), base.getDate(), hour, 0),
    BARBER_TIMEZONE,
  )
  return { startAt, endAt: addMinutes(startAt, durationMinutes) }
}

function makeAppointment(
  id: string,
  customerId: string,
  daysOffset: number,
  hour: number,
  status: Appointment['status'],
  cancellationToken: string,
  durationMinutes = 30,
): Appointment {
  const { startAt, endAt } = slot(daysOffset, hour, durationMinutes)
  return new Appointment(id, MOCK_BARBER_ID, customerId, startAt, endAt, status, cancellationToken, undefined, undefined)
}

const SEED: Appointment[] = [
  makeAppointment('00000000-0000-0000-0005-000000000001', MOCK_CUSTOMER_1_ID, -5, 10, 'completed', '00000000-0000-0000-0006-000000000001'),
  makeAppointment('00000000-0000-0000-0005-000000000002', MOCK_CUSTOMER_2_ID, -3, 14, 'completed', '00000000-0000-0000-0006-000000000002'),
  makeAppointment('00000000-0000-0000-0005-000000000003', MOCK_CUSTOMER_3_ID, 1, 11, 'confirmed', '00000000-0000-0000-0006-000000000003'),
  makeAppointment('00000000-0000-0000-0005-000000000004', MOCK_CUSTOMER_1_ID, 2, 15, 'confirmed', '00000000-0000-0000-0006-000000000004', 60),
  makeAppointment('00000000-0000-0000-0005-000000000005', MOCK_CUSTOMER_2_ID, 4, 9, 'confirmed', '00000000-0000-0000-0006-000000000005'),
  makeAppointment('00000000-0000-0000-0005-000000000006', MOCK_CUSTOMER_3_ID, 6, 16, 'confirmed', '00000000-0000-0000-0006-000000000006'),
  makeAppointment('00000000-0000-0000-0005-000000000007', MOCK_CUSTOMER_1_ID, 8, 10, 'confirmed', '00000000-0000-0000-0006-000000000007', 60),
  makeAppointment('00000000-0000-0000-0005-000000000008', MOCK_CUSTOMER_2_ID, 11, 14, 'confirmed', '00000000-0000-0000-0006-000000000008'),
]

export class MockAppointmentRepository implements AppointmentRepository {
  private store: Appointment[] = [...SEED]

  constructor(private slotHoldRepo: SlotHoldRepository) {}

  async getById(id: string): Promise<Appointment | null> {
    return this.store.find((a) => a.id === id) ?? null
  }

  async getForBarber(barberId: string): Promise<Appointment[]> {
    return this.store.filter((a) => a.barberId === barberId)
  }

  async getForRange(barberId: string, from: Date, to: Date): Promise<Appointment[]> {
    return this.store.filter(
      (a) => a.barberId === barberId && a.startAt < to && a.endAt > from,
    )
  }

  async getByCancellationToken(token: string): Promise<Appointment | null> {
    return this.store.find((a) => a.cancellationToken === token) ?? null
  }

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const created = new Appointment(
      crypto.randomUUID(),
      input.barberId,
      input.customerId,
      input.startAt,
      input.endAt,
      input.status,
      input.cancellationToken,
      input.cancelledAt,
      input.cancellationReason,
    )
    this.store.push(created)
    return created
  }

  async createFromHold(input: CreateFromHoldInput): Promise<Appointment> {
    const hold = await this.slotHoldRepo.getByToken(input.holdToken)
    if (!hold) throw new Error(`Hold not found in mock store: ${input.holdToken}`)
    const created = new Appointment(
      crypto.randomUUID(),
      hold.barberId,
      input.customerId,
      hold.startAt,
      hold.endAt,
      'confirmed',
      crypto.randomUUID(),
      undefined,
      undefined,
    )
    this.store.push(created)
    return created
  }

  async cancelByToken(token: string): Promise<Appointment | null> {
    const idx = this.store.findIndex((a) => a.cancellationToken === token)
    if (idx < 0) return null
    const old = this.store[idx]!
    const updated = new Appointment(
      old.id, old.barberId, old.customerId,
      old.startAt, old.endAt,
      'cancelled',
      old.cancellationToken,
      new Date(),
      old.cancellationReason,
    )
    this.store[idx] = updated
    return updated
  }

  async cancelById(id: string, reason?: string): Promise<Appointment> {
    const idx = this.store.findIndex((a) => a.id === id)
    if (idx < 0) throw new Error(`Appointment ${id} not found`)
    const old = this.store[idx]!
    const updated = new Appointment(
      old.id, old.barberId, old.customerId,
      old.startAt, old.endAt,
      'cancelled',
      old.cancellationToken,
      new Date(),
      reason,
    )
    this.store[idx] = updated
    return updated
  }

  async updateStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const idx = this.store.findIndex((a) => a.id === id)
    if (idx < 0) throw new Error(`Appointment ${id} not found`)
    const old = this.store[idx]!
    const updated = new Appointment(
      old.id, old.barberId, old.customerId,
      old.startAt, old.endAt,
      status,
      old.cancellationToken,
      old.cancelledAt,
      old.cancellationReason,
    )
    this.store[idx] = updated
    return updated
  }
}
