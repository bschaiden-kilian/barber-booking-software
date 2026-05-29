import { useState, useEffect, useCallback } from 'react'
import { addMinutes } from 'date-fns'
import { useServices } from '@/providers/service-context'
import { BARBER_TIMEZONE, DEFAULT_APPOINTMENT_DURATION_MINUTES } from '@/constants'
import {
  startOfDayInBarberTz,
  endOfDayInBarberTz,
  isoWeekday,
  generateSlotGrid,
  formatInVienna,
} from '@/utils/date'
import type { AvailableSlot } from './types'

export type { AvailableSlot }

export function useAvailableSlots(
  barberId: string,
  date: Date | null,
  options?: { excludeHoldToken?: string },
): {
  slots: AvailableSlot[]
  loading: boolean
  error: Error | null
  refresh: () => void
} {
  const {
    weeklyScheduleService,
    scheduleExceptionService,
    timeBlockService,
    appointmentService,
    slotHoldService,
  } = useServices()

  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const excludeHoldToken = options?.excludeHoldToken

  const refresh = useCallback(async () => {
    if (!date) {
      setSlots([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const dayStart = startOfDayInBarberTz(date, BARBER_TIMEZONE)
      const dayEnd = endOfDayInBarberTz(date, BARBER_TIMEZONE)
      const viennaDate = formatInVienna(date, 'yyyy-MM-dd')
      const weekday = isoWeekday(date, BARBER_TIMEZONE)

      const [scheduleEntries, exception, timeBlocks, appointments, activeHolds] =
        await Promise.all([
          weeklyScheduleService.getForBarber(barberId),
          scheduleExceptionService.getForDate(barberId, viennaDate),
          timeBlockService.getForBarber(barberId, dayStart, dayEnd),
          appointmentService.listInRange(barberId, dayStart, dayEnd),
          slotHoldService.getActiveForBarber(barberId, dayStart, dayEnd),
        ])

      // Determine working hours
      let openTime: string
      let closeTime: string

      if (exception) {
        if (!exception.isOpen) {
          setSlots([])
          return
        }
        openTime = exception.customOpenTime ?? ''
        closeTime = exception.customCloseTime ?? ''
        if (!openTime || !closeTime) {
          // Fallback to weekly schedule when exception is open but has no custom times
          const entry = scheduleEntries.find((e) => e.dayOfWeek === weekday)
          if (!entry || !entry.isWorking) {
            setSlots([])
            return
          }
          openTime = entry.openTime
          closeTime = entry.closeTime
        }
      } else {
        const entry = scheduleEntries.find((e) => e.dayOfWeek === weekday)
        if (!entry || !entry.isWorking) {
          setSlots([])
          return
        }
        openTime = entry.openTime
        closeTime = entry.closeTime
      }

      // Build slot grid
      const slotStarts = generateSlotGrid(
        viennaDate,
        openTime,
        closeTime,
        DEFAULT_APPOINTMENT_DURATION_MINUTES,
      )

      // Build blocked intervals from appointments, time blocks, and active holds
      const blocked: Array<{ startAt: Date; endAt: Date }> = [
        ...appointments
          .filter((a) => a.status === 'confirmed')
          .map((a) => ({ startAt: a.startAt, endAt: a.endAt })),
        ...timeBlocks.map((b) => ({ startAt: b.startAt, endAt: b.endAt })),
        ...activeHolds
          .filter((h) => h.holdToken !== excludeHoldToken)
          .map((h) => ({ startAt: h.startAt, endAt: h.endAt })),
      ]

      const now = new Date()
      const available = slotStarts
        .map((startAt) => ({
          startAt,
          endAt: addMinutes(startAt, DEFAULT_APPOINTMENT_DURATION_MINUTES),
        }))
        .filter(
          (slot) =>
            slot.startAt > now &&
            !blocked.some((b) => b.startAt < slot.endAt && b.endAt > slot.startAt),
        )

      setSlots(available)
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [
    barberId,
    date,
    excludeHoldToken,
    weeklyScheduleService,
    scheduleExceptionService,
    timeBlockService,
    appointmentService,
    slotHoldService,
  ])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { slots, loading, error, refresh }
}
