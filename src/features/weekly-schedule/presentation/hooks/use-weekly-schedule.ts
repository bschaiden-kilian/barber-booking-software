import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/providers/service-context'
import { WeeklyScheduleEntry, type DayOfWeek } from '../../domain/WeeklyScheduleEntry'

export interface DayDraft {
  id: string  // '' for days not yet persisted
  dayOfWeek: DayOfWeek
  isWorking: boolean
  openTime: string   // HH:mm Vienna local
  closeTime: string  // HH:mm Vienna local
}

export interface DayErrors {
  openTime?: string
  closeTime?: string
}

type AllDayErrors = Partial<Record<DayOfWeek, DayErrors>>

// When loading a fresh barber with no schedule, seed all 7 days as closed with
// typical business-hour defaults so the barber can just toggle + save, rather
// than having to add rows from scratch. Seeding is better UX than an empty state.
function buildDraft(entries: WeeklyScheduleEntry[]): DayDraft[] {
  return ([1, 2, 3, 4, 5, 6, 7] as DayOfWeek[]).map((day) => {
    const e = entries.find((x) => x.dayOfWeek === day)
    if (e) {
      return { id: e.id, dayOfWeek: day, isWorking: e.isWorking, openTime: e.openTime, closeTime: e.closeTime }
    }
    return { id: '', dayOfWeek: day, isWorking: false, openTime: '09:00', closeTime: '18:00' }
  })
}

function validateDay(day: DayDraft): DayErrors {
  if (!day.isWorking) return {}
  const errors: DayErrors = {}
  if (!day.openTime) errors.openTime = 'Öffnungszeit erforderlich'
  if (!day.closeTime) errors.closeTime = 'Schließzeit erforderlich'
  if (day.openTime && day.closeTime && day.closeTime <= day.openTime) {
    errors.closeTime = 'Schließzeit muss nach Öffnungszeit liegen'
  }
  return errors
}

export function useWeeklySchedule(barberId: string) {
  const { weeklyScheduleService } = useServices()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [draft, setDraft] = useState<DayDraft[]>([])
  const [dirty, setDirty] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<AllDayErrors>({})

  useEffect(() => {
    if (!barberId) return
    let cancelled = false
    setLoading(true)
    weeklyScheduleService
      .getForBarber(barberId)
      .then((entries) => {
        if (cancelled) return
        setDraft(buildDraft(entries))
        setDirty(false)
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [weeklyScheduleService, barberId])

  const updateDay = useCallback(
    (day: DayOfWeek, patch: Partial<Omit<DayDraft, 'dayOfWeek' | 'id'>>) => {
      setDraft((prev) => prev.map((d) => (d.dayOfWeek === day ? { ...d, ...patch } : d)))
      setDirty(true)
      setFieldErrors((prev) => {
        if ('isWorking' in patch) return { ...prev, [day]: {} }
        const dayErrors = { ...prev[day] }
        if (patch.openTime !== undefined) delete dayErrors.openTime
        if (patch.closeTime !== undefined) delete dayErrors.closeTime
        return { ...prev, [day]: dayErrors }
      })
    },
    [],
  )

  const validateDayField = useCallback(
    (day: DayOfWeek) => {
      const dayDraft = draft.find((d) => d.dayOfWeek === day)
      if (!dayDraft) return
      setFieldErrors((prev) => ({ ...prev, [day]: validateDay(dayDraft) }))
    },
    [draft],
  )

  const save = useCallback(async () => {
    // Validate all open days before sending anything to the server
    const allErrors: AllDayErrors = {}
    let hasAnyError = false
    for (const d of draft) {
      const errs = validateDay(d)
      if (Object.keys(errs).length > 0) {
        allErrors[d.dayOfWeek] = errs
        hasAnyError = true
      }
    }
    if (hasAnyError) {
      setFieldErrors(allErrors)
      return
    }

    setSaving(true)
    setSaveError(null)
    const prevDirty = dirty
    setDirty(false) // optimistic: show as saved immediately

    try {
      const savedEntries = await Promise.all(
        draft.map((d) =>
          weeklyScheduleService.upsertEntry(
            new WeeklyScheduleEntry(
              d.id || crypto.randomUUID(),
              barberId,
              d.dayOfWeek,
              d.openTime,
              d.closeTime,
              d.isWorking,
            ),
          ),
        ),
      )
      setDraft(buildDraft(savedEntries))
    } catch (err: unknown) {
      setDirty(prevDirty) // rollback optimistic dirty=false
      setSaveError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }, [draft, dirty, barberId, weeklyScheduleService])

  return {
    loading,
    saving,
    loadError,
    saveError,
    dirty,
    draft,
    fieldErrors,
    updateDay,
    validateDayField,
    save,
  }
}
