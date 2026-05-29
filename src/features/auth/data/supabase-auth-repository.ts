import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthRepository } from './auth-repository'
import type { Barber } from '../domain/Barber'

export class SupabaseAuthRepository implements AuthRepository {
  constructor(private client: SupabaseClient) {}

  async getByAuthId(_authUserId: string): Promise<Barber | null> {
    throw new Error('not implemented')
  }

  async getCurrent(): Promise<Barber | null> {
    throw new Error('not implemented')
  }
}
