import type { Appointment, AppointmentStatus } from '../domain/Appointment'

export interface CreateAppointmentInput {
  barberId: string
  customerId: string
  startAt: Date
  endAt: Date
  status: AppointmentStatus
  cancellationToken: string
  cancelledAt?: Date
  cancellationReason?: string
}

export interface CreateFromHoldInput {
  holdToken: string
  customerId: string
}

export interface AppointmentRepository {
  getById(id: string): Promise<Appointment | null>
  getForBarber(barberId: string): Promise<Appointment[]>
  getForRange(barberId: string, from: Date, to: Date): Promise<Appointment[]>
  getByCancellationToken(token: string): Promise<Appointment | null>
  create(input: CreateAppointmentInput): Promise<Appointment>
  createFromHold(input: CreateFromHoldInput): Promise<Appointment>
  cancelByToken(token: string): Promise<Appointment | null>
  cancelById(id: string, reason?: string): Promise<Appointment>
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>
}
