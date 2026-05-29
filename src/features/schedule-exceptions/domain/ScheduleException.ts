export interface ScheduleExceptionRow {
  id: string
  barber_id: string
  exception_date: string  // YYYY-MM-DD Vienna local date
  is_open: boolean
  custom_open_time: string | null   // HH:mm, only when is_open=true
  custom_close_time: string | null  // HH:mm, only when is_open=true
  reason: string | null
}

export class ScheduleException {
  constructor(
    public readonly id: string,
    public readonly barberId: string,
    public readonly exceptionDate: string,
    public readonly isOpen: boolean,
    public readonly customOpenTime: string | undefined,
    public readonly customCloseTime: string | undefined,
    public readonly reason: string | undefined,
  ) {}

  static fromJSON(row: ScheduleExceptionRow): ScheduleException {
    return new ScheduleException(
      row.id,
      row.barber_id,
      row.exception_date,
      row.is_open,
      row.custom_open_time ?? undefined,
      row.custom_close_time ?? undefined,
      row.reason ?? undefined,
    )
  }

  toJSON(): ScheduleExceptionRow {
    return {
      id: this.id,
      barber_id: this.barberId,
      exception_date: this.exceptionDate,
      is_open: this.isOpen,
      custom_open_time: this.customOpenTime ?? null,
      custom_close_time: this.customCloseTime ?? null,
      reason: this.reason ?? null,
    }
  }
}
