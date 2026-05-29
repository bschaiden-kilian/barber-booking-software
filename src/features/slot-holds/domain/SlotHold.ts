export interface SlotHoldRow {
  id: string
  barber_id: string
  start_at: string    // ISO 8601 UTC
  end_at: string      // ISO 8601 UTC
  hold_token: string
  expires_at: string  // ISO 8601 UTC
}

export class SlotHold {
  constructor(
    public readonly id: string,
    public readonly barberId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    public readonly holdToken: string,
    public readonly expiresAt: Date,
  ) {}

  static fromJSON(row: SlotHoldRow): SlotHold {
    return new SlotHold(
      row.id,
      row.barber_id,
      new Date(row.start_at),
      new Date(row.end_at),
      row.hold_token,
      new Date(row.expires_at),
    )
  }

  toJSON(): SlotHoldRow {
    return {
      id: this.id,
      barber_id: this.barberId,
      start_at: this.startAt.toISOString(),
      end_at: this.endAt.toISOString(),
      hold_token: this.holdToken,
      expires_at: this.expiresAt.toISOString(),
    }
  }
}
