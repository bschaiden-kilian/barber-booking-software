import { addMinutes, getDay } from 'date-fns'
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz'
import { BARBER_TIMEZONE } from '@/constants'

/** UTC instant of 00:00:00.000 on the given date in the specified timezone. */
export function startOfDayInBarberTz(date: Date, tz: string): Date {
  const local = toZonedTime(date, tz)
  return fromZonedTime(
    new Date(local.getFullYear(), local.getMonth(), local.getDate(), 0, 0, 0, 0),
    tz,
  )
}

/** UTC instant of 23:59:59.999 on the given date in the specified timezone. */
export function endOfDayInBarberTz(date: Date, tz: string): Date {
  const local = toZonedTime(date, tz)
  return fromZonedTime(
    new Date(local.getFullYear(), local.getMonth(), local.getDate(), 23, 59, 59, 999),
    tz,
  )
}

/** ISO weekday (1=Monday … 7=Sunday) for a UTC Date evaluated in the given timezone. */
export function isoWeekday(date: Date, tz: string): number {
  const local = toZonedTime(date, tz)
  const jsDay = getDay(local) // 0 = Sunday
  return jsDay === 0 ? 7 : jsDay
}

/** Format a time range as "HH:mm–HH:mm" in the given timezone. */
export function formatTimeSlot(start: Date, end: Date, tz: string): string {
  return `${formatInTimeZone(start, tz, 'HH:mm')}–${formatInTimeZone(end, tz, 'HH:mm')}`
}

/** Format a date as "Montag, 5. Juni 2026" in the given timezone (German locale style). */
export function formatDateLong(date: Date, tz: string): string {
  return formatInTimeZone(date, tz, 'EEEE, d. MMMM yyyy')
}

/** Convert a UTC Date to the equivalent local Date object in Vienna time. */
export function toViennaTime(utcDate: Date): Date {
  return toZonedTime(utcDate, BARBER_TIMEZONE)
}

/** Convert a local Date interpreted as Vienna time to UTC. */
export function fromViennaTime(localDate: Date): Date {
  return fromZonedTime(localDate, BARBER_TIMEZONE)
}

/** Format a UTC Date using a date-fns format string, displayed in Vienna time. */
export function formatInVienna(utcDate: Date, formatStr: string): string {
  return formatInTimeZone(utcDate, BARBER_TIMEZONE, formatStr)
}

/** Current date as YYYY-MM-DD in Vienna timezone. */
export function todayInVienna(): string {
  return formatInVienna(new Date(), 'yyyy-MM-dd')
}

/**
 * Generate a grid of UTC slot start times for a given Vienna calendar day.
 * @param viennaDate - YYYY-MM-DD representing the day in Vienna local time
 * @param openTime   - HH:mm opening time in Vienna local time
 * @param closeTime  - HH:mm closing time in Vienna local time (last slot must end by this)
 * @param slotDurationMinutes - length of each slot
 */
export function generateSlotGrid(
  viennaDate: string,
  openTime: string,
  closeTime: string,
  slotDurationMinutes: number
): Date[] {
  const [year, month, day] = viennaDate.split('-').map(Number)
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)

  const openUtc = fromZonedTime(
    new Date(year, (month as number) - 1, day, openH, openM),
    BARBER_TIMEZONE
  )
  const closeUtc = fromZonedTime(
    new Date(year, (month as number) - 1, day, closeH, closeM),
    BARBER_TIMEZONE
  )

  const slots: Date[] = []
  let cursor = openUtc
  while (cursor < closeUtc) {
    const slotEnd = addMinutes(cursor, slotDurationMinutes)
    if (slotEnd <= closeUtc) {
      slots.push(cursor)
    }
    cursor = slotEnd
  }
  return slots
}

/**
 * ISO weekday number (1 = Monday … 7 = Sunday) for a UTC Date,
 * evaluated in Vienna local time.
 */
export function isoWeekdayInVienna(utcDate: Date): number {
  const local = toViennaTime(utcDate)
  const jsDay = getDay(local) // 0 = Sunday
  return jsDay === 0 ? 7 : jsDay
}
