import type { CustomerRepository, UpsertCustomerInput } from './customer-repository'
import { Customer } from '../domain/Customer'
import { MOCK_BARBER_ID, MOCK_CUSTOMER_1_ID, MOCK_CUSTOMER_2_ID, MOCK_CUSTOMER_3_ID } from '@/constants/mock-ids'

const SEED: Customer[] = [
  new Customer(MOCK_CUSTOMER_1_ID, MOCK_BARBER_ID, 'Max Mustermann', 'max.mustermann@example.com', '+43 676 1234567'),
  new Customer(MOCK_CUSTOMER_2_ID, MOCK_BARBER_ID, 'Anna Huber', 'anna.huber@example.com', undefined),
  new Customer(MOCK_CUSTOMER_3_ID, MOCK_BARBER_ID, 'Thomas Berger', 't.berger@example.com', '+43 699 9876543'),
]

export class MockCustomerRepository implements CustomerRepository {
  private store: Customer[] = [...SEED]

  async getById(id: string): Promise<Customer | null> {
    return this.store.find((c) => c.id === id) ?? null
  }

  async findByEmail(barberId: string, email: string): Promise<Customer | null> {
    return this.store.find((c) => c.barberId === barberId && c.email === email) ?? null
  }

  async listForBarber(barberId: string): Promise<Customer[]> {
    return this.store.filter((c) => c.barberId === barberId)
  }

  async upsert(input: UpsertCustomerInput): Promise<Customer> {
    const existing = this.store.find(
      (c) => c.barberId === input.barberId && c.email === input.email,
    )
    if (existing) {
      const updated = new Customer(existing.id, input.barberId, input.name, input.email, input.phone)
      this.store = this.store.map((c) => (c.id === existing.id ? updated : c))
      return updated
    }
    const created = new Customer(crypto.randomUUID(), input.barberId, input.name, input.email, input.phone)
    this.store.push(created)
    return created
  }
}
