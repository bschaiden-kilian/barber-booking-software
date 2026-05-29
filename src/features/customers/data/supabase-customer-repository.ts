import type { SupabaseClient } from '@supabase/supabase-js'
import type { CustomerRepository, UpsertCustomerInput } from './customer-repository'
import type { Customer } from '../domain/Customer'

export class SupabaseCustomerRepository implements CustomerRepository {
  constructor(private client: SupabaseClient) {}

  async getById(_id: string): Promise<Customer | null> {
    throw new Error('not implemented')
  }

  async findByEmail(_barberId: string, _email: string): Promise<Customer | null> {
    throw new Error('not implemented')
  }

  async listForBarber(_barberId: string): Promise<Customer[]> {
    throw new Error('not implemented')
  }

  async upsert(_input: UpsertCustomerInput): Promise<Customer> {
    throw new Error('not implemented')
  }
}
