import type { AppointmentRepository, CreateAppointmentInput, CreateFromHoldInput } from '../data/appointment-repository'
import type { Appointment } from '../domain/Appointment'
import type { SlotHoldRepository } from '@/features/slot-holds/data/slot-hold-repository'
import { HoldNotFoundError, HoldExpiredError } from '../domain/errors'

export interface IAppointmentService {
  create(input: CreateAppointmentInput): Promise<Appointment>
  createFromHold(input: CreateFromHoldInput): Promise<Appointment>
  getByCancellationToken(token: string): Promise<Appointment | null>
  listUpcoming(barberId: string): Promise<Appointment[]>
  listInRange(barberId: string, from: Date, to: Date): Promise<Appointment[]>
  cancelByToken(token: string): Promise<Appointment | null>
  cancelByBarber(id: string, reason?: string): Promise<Appointment>
}

export class AppointmentService implements IAppointmentService {
  // SlotHoldRepository is injected here as a documented exception to feature isolation —
  // see README "Architecture Rules" for justification.
  constructor(
    private repo: AppointmentRepository,
    private slotHoldRepo: SlotHoldRepository,
  ) {}

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    return this.repo.create(input)
  }

  async createFromHold(input: CreateFromHoldInput): Promise<Appointment> {
    const hold = await this.slotHoldRepo.getByToken(input.holdToken)
    if (!hold) throw new HoldNotFoundError()
    if (hold.expiresAt <= new Date()) throw new HoldExpiredError()
    const appointment = await this.repo.createFromHold(input)
    await this.slotHoldRepo.deleteByToken(input.holdToken)
    return appointment
  }

  async getByCancellationToken(token: string): Promise<Appointment | null> {
    return this.repo.getByCancellationToken(token)
  }

  async listUpcoming(barberId: string): Promise<Appointment[]> {
    const now = new Date()
    const all = await this.repo.getForBarber(barberId)
    return all.filter((a) => a.status === 'confirmed' && a.startAt >= now)
  }

  async listInRange(barberId: string, from: Date, to: Date): Promise<Appointment[]> {
    return this.repo.getForRange(barberId, from, to)
  }

  async cancelByToken(token: string): Promise<Appointment | null> {
    return this.repo.cancelByToken(token)
  }

  async cancelByBarber(id: string, reason?: string): Promise<Appointment> {
    return this.repo.cancelById(id, reason)
  }
}
