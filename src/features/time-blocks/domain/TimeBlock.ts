export interface TimeBlockRow {
  id: string
  barber_id: string
  start_at: string  // ISO 8601 UTC
  end_at: string    // ISO 8601 UTC
  reason: string | null
}

export class TimeBlock {
  constructor(
    public readonly id: string,
    public readonly barberId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly reason: string | undefined,
  ) {}

  static fromJSON(row: TimeBlockRow): TimeBlock {
    return new TimeBlock(
      row.id,
      row.barber_id,
      new Date(row.start_at),
      new Date(row.end_at),
      row.reason ?? undefined,
    )
  }

  toJSON(): TimeBlockRow {
    return {
      id: this.id,
      barber_id: this.barberId,
      start_at: this.startAt.toISOString(),
      end_at: this.endAt.toISOString(),
      reason: this.reason ?? null,
    }
  }
}
