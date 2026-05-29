import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/providers/service-context'
import { ScheduleException } from '../../domain/ScheduleException'

export function useScheduleExceptions(barberId: string) {
  const { scheduleExceptionService } = useServices()

  const [exceptions, setExceptions] = useState<ScheduleException[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [mutating, setMutating] = useState(false)
  const [mutateError, setMutateError] = useState<string | null>(null)

  useEffect(() => {
    if (!barberId) return
    let cancelled = false
    setLoading(true)
    scheduleExceptionService
      .getForBarber(barberId)
      .then((list) => {
        if (!cancelled)
          setExceptions([...list].sort((a, b) => a.exceptionDate.localeCompare(b.exceptionDate)))
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [scheduleExceptionService, barberId])

  const addException = useCallback(
    async (params: {
      date: string
      isOpen: boolean
      openTime?: string
      closeTime?: string
      reason?: string
    }) => {
      // TODO: conflict detection — checking for confirmed appointments on this date
      // requires cross-feature orchestration (appointmentService). Defer to a future
      // page-level hook. Log a warning so the barber notices in dev.
      console.warn(
        '[schedule-exceptions] Conflict detection not implemented: confirmed appointments on',
        params.date,
        'are not checked before adding this exception.',
      )

      setMutating(true)
      setMutateError(null)

      const tempId = crypto.randomUUID()
      const optimistic = new ScheduleException(
        tempId,
        barberId,
        params.date,
        params.isOpen,
        params.openTime,
        params.closeTime,
        params.reason,
      )

      setExceptions((prev) =>
        [...prev, optimistic].sort((a, b) => a.exceptionDate.localeCompare(b.exceptionDate)),
      )

      try {
        const saved = await scheduleExceptionService.upsert(optimistic)
        setExceptions((prev) => prev.map((e) => (e.id === tempId ? saved : e)))
      } catch (err: unknown) {
        setExceptions((prev) => prev.filter((e) => e.id !== tempId))
        setMutateError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen')
      } finally {
        setMutating(false)
      }
    },
    [scheduleExceptionService, barberId],
  )

  const removeException = useCallback(
    async (id: string) => {
      setMutating(true)
      setMutateError(null)

      // Capture snapshot for rollback; captured at call time via the closure.
      // useCallback deps include exceptions so the snapshot is always current.
      const snapshot = exceptions
      setExceptions((prev) => prev.filter((e) => e.id !== id))

      try {
        await scheduleExceptionService.delete(id)
      } catch (err: unknown) {
        setExceptions(snapshot)
        setMutateError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen')
      } finally {
        setMutating(false)
      }
    },
    [scheduleExceptionService, exceptions],
  )

  return {
    exceptions,
    loading,
    loadError,
    mutating,
    mutateError,
    addException,
    removeException,
  }
}
