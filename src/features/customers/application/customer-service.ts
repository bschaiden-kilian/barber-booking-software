import type { CustomerRepository } from '../data/customer-repository'
import type { Customer } from '../domain/Customer'

export interface ICustomerService {
  upsertByEmail(barberId: string, name: string, email: string, phone?: string): Promise<Customer>
  getById(id: string): Promise<Customer | null>
  listForBarber(barberId: string): Promise<Customer[]>
}

export class CustomerService implements ICustomerService {
  constructor(private repo: CustomerRepository) {}

  async upsertByEmail(barberId: string, name: string, email: string, phone?: string): Promise<Customer> {
    return this.repo.upsert({ barberId, name, email, phone })
  }

  async getById(id: string): Promise<Customer | null> {
    return this.repo.getById(id)
  }

  async listForBarber(barberId: string): Promise<Customer[]> {
    return this.repo.listForBarber(barberId)
  }
}
