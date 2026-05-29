export interface BarberRow {
  id: string
  auth_user_id: string
  business_name: string
  timezone: string
  default_appointment_duration_minutes: number
}

export class Barber {
  constructor(
    public readonly id: string,
    public readonly authUserId: string,
    public readonly businessName: string,
    public readonly timezone: string,
    public readonly defaultAppointmentDurationMinutes: number,
  ) {}

  static fromJSON(row: BarberRow): Barber {
    return new Barber(
      row.id,
      row.auth_user_id,
      row.business_name,
      row.timezone,
      row.default_appointment_duration_minutes,
    )
  }

  toJSON(): BarberRow {
    return {
      id: this.id,
      auth_user_id: this.authUserId,
      business_name: this.businessName,
      timezone: this.timezone,
      default_appointment_duration_minutes: this.defaultAppointmentDurationMinutes,
    }
  }
}
