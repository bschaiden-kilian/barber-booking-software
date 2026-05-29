import type { SupabaseClient } from '@supabase/supabase-js'
import type { AppointmentRepository, CreateAppointmentInput, CreateFromHoldInput } from './appointment-repository'
import type { Appointment, AppointmentStatus } from '../domain/Appointment'

export class SupabaseAppointmentRepository implements AppointmentRepository {
  constructor(private client: SupabaseClient) {}

  async getById(_id: string): Promise<Appointment | null> {
    throw new Error('not implemented')
  }

  async getForBarber(_barberId: string): Promise<Appointment[]> {
    throw new Error('not implemented')
  }

  async getForRange(_barberId: string, _from: Date, _to: Date): Promise<Appointment[]> {
    throw new Error('not implemented')
  }

  async getByCancellationToken(_token: string): Promise<Appointment | null> {
    throw new Error('not implemented in Phase 2a')
  }

  async create(_input: CreateAppointmentInput): Promise<Appointment> {
    throw new Error('not implemented')
  }

  async createFromHold(_input: CreateFromHoldInput): Promise<Appointment> {
    throw new Error('not implemented — Phase 3: replace with SECURITY DEFINER RPC that reads hold and inserts atomically')
  }

  async cancelByToken(_token: string): Promise<Appointment | null> {
    throw new Error('not implemented')
  }

  async cancelById(_id: string, _reason?: string): Promise<Appointment> {
    throw new Error('not implemented')
  }

  async updateStatus(_id: string, _status: AppointmentStatus): Promise<Appointment> {
    throw new Error('not implemented')
  }
}
