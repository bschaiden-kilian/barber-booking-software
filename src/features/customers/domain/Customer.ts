export interface CustomerRow {
  id: string
  barber_id: string
  name: string
  email: string
  phone: string | null
}

export class Customer {
  constructor(
    public readonly id: string,
    public readonly barberId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string | undefined,
  ) {}

  static fromJSON(row: CustomerRow): Customer {
    return new Customer(
      row.id,
      row.barber_id,
      row.name,
      row.email,
      row.phone ?? undefined,
    )
  }

  toJSON(): CustomerRow {
    return {
      id: this.id,
      barber_id: this.barberId,
      name: this.name,
      email: this.email,
      phone: this.phone ?? null,
    }
  }
}
