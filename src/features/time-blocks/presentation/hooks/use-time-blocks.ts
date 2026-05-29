import { useState, useEffect, useCallback } from 'react'
import { fromZonedTime } from 'date-fns-tz'
import { useServices } from '@/providers/service-context'
import { BARBER_TIMEZONE } from '@/constants'
import type { TimeBlock } from '../../domain/TimeBlock'

export function useTimeBlocks(barberId: string) {
  const { timeBlockService } = useServices()

  const [blocks, setBlocks] = useState<TimeBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [mutating, setMutating] = useState(false)
  const [mutateError, setMutateError] = useState<string | null>(null)

  useEffect(() => {
    if (!barberId) return
    let cancelled = false
    setLoading(true)
    timeBlockService
      .listAll(barberId)
      .then((list) => {
        if (!cancelled)
          setBlocks([...list].sort((a, b) => a.startAt.getTime() - b.startAt.getTime()))
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [timeBlockService, barberId])

  const addBlock = useCallback(
    async (params: {
      date: string       // YYYY-MM-DD Vienna local
      startTime: string  // HH:mm Vienna local
      endTime: string    // HH:mm Vienna local
      label?: string
    }) => {
      const [year, month, day] = params.date.split('-').map(Number)
      const [sh, sm] = params.startTime.split(':').map(Number)
      const [eh, em] = params.endTime.split(':').map(Number)

      const startAt = fromZonedTime(
        new Date(year!, (month as number) - 1, day!, sh!, sm!, 0),
        BARBER_TIMEZONE,
      )
      const endAt = fromZonedTime(
        new Date(year!, (month as number) - 1, day!, eh!, em!, 0),
        BARBER_TIMEZONE,
      )

      setMutating(true)
      setMutateError(null)

      try {
        const created = await timeBlockService.create({
          barberId,
          startAt,
          endAt,
          reason: params.label,
        })
        setBlocks((prev) =>
          [...prev, created].sort((a, b) => a.startAt.getTime() - b.startAt.getTime()),
        )
      } catch (err: unknown) {
        setMutateError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen')
      } finally {
        setMutating(false)
      }
    },
    [timeBlockService, barberId],
  )

  const removeBlock = useCallback(
    async (id: string) => {
      setMutating(true)
      setMutateError(null)

      const snapshot = blocks
      setBlocks((prev) => prev.filter((b) => b.id !== id))

      try {
        await timeBlockService.delete(id)
      } catch (err: unknown) {
        setBlocks(snapshot)
        setMutateError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen')
      } finally {
        setMutating(false)
      }
    },
    [timeBlockService, blocks],
  )

  return {
    blocks,
    loading,
    loadError,
    mutating,
    mutateError,
    addBlock,
    removeBlock,
  }
}
