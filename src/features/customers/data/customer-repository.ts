import type { Customer } from '../domain/Customer'

export interface UpsertCustomerInput {
  barberId: string
  name: string
  email: string
  phone?: string
}

export interface CustomerRepository {
  getById(id: string): Promise<Customer | null>
  findByEmail(barberId: string, email: string): Promise<Customer | null>
  listForBarber(barberId: string): Promise<Customer[]>
  upsert(input: UpsertCustomerInput): Promise<Customer>
}
