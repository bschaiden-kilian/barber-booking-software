/** ISO weekday: 1 = Monday … 7 = Sunday */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface WeeklyScheduleEntryRow {
  id: string
  barber_id: string
  day_of_week: number
  open_time: string   // HH:mm Vienna local time
  close_time: string  // HH:mm Vienna local time
  is_working: boolean
}

export class WeeklyScheduleEntry {
  constructor(
    public readonly id: string,
    public readonly barberId: string,
    public readonly dayOfWeek: DayOfWeek,
    public readonly openTime: string,
    public readonly closeTime: string,
    public readonly isWorking: boolean,
  ) {}

  static fromJSON(row: WeeklyScheduleEntryRow): WeeklyScheduleEntry {
    return new WeeklyScheduleEntry(
      row.id,
      row.barber_id,
      row.day_of_week as DayOfWeek,
      row.open_time,
      row.close_time,
      row.is_working,
    )
  }

  toJSON(): WeeklyScheduleEntryRow {
    return {
      id: this.id,
      barber_id: this.barberId,
      day_of_week: this.dayOfWeek,
      open_time: this.openTime,
      close_time: this.closeTime,
      is_working: this.isWorking,
    }
  }
}
