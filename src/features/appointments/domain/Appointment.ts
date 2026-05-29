export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show'

export interface AppointmentRow {
  id: string
  barber_id: string
  customer_id: string
  start_at: string            // ISO 8601 UTC
  end_at: string              // ISO 8601 UTC
  status: string
  cancellation_token: string
  cancelled_at: string | null // ISO 8601 UTC
  cancellation_reason: string | null
}

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly barberId: string,
    public readonly customerId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly status: AppointmentStatus,
    public readonly cancellationToken: string,
    public readonly cancelledAt: Date | undefined,
    public readonly cancellationReason: string | undefined,
  ) {}

  static fromJSON(row: AppointmentRow): Appointment {
    return new Appointment(
      row.id,
      row.barber_id,
      row.customer_id,
      new Date(row.start_at),
      new Date(row.end_at),
      row.status as AppointmentStatus,
      row.cancellation_token,
      row.cancelled_at ? new Date(row.cancelled_at) : undefined,
      row.cancellation_reason ?? undefined,
    )
  }

  toJSON(): AppointmentRow {
    return {
      id: this.id,
      barber_id: this.barberId,
      customer_id: this.customerId,
      start_at: this.startAt.toISOString(),
      end_at: this.endAt.toISOString(),
      status: this.status,
      cancellation_token: this.cancellationToken,
      cancelled_at: this.cancelledAt?.toISOString() ?? null,
      cancellation_reason: this.cancellationReason ?? null,
    }
  }
}
