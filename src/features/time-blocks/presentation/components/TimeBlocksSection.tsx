import { useState } from 'react'
import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/ErrorMessage'
import { EmptyState } from '@/components/EmptyState'
import { Spinner } from '@/components/Spinner'
import { formatInVienna, todayInVienna } from '@/utils/date'
import type { useTimeBlocks } from '../hooks/use-time-blocks'
import type { TimeBlock } from '../../domain/TimeBlock'

type TimeBlocksHook = ReturnType<typeof useTimeBlocks>

interface AddBlockFormState {
  date: string
  startTime: string
  endTime: string
  label: string
}

const EMPTY_FORM: AddBlockFormState = {
  date: '',
  startTime: '12:00',
  endTime: '13:00',
  label: '',
}

interface BlockFormErrors {
  date?: string
  startTime?: string
  endTime?: string
}

function validateBlockForm(form: AddBlockFormState): BlockFormErrors {
  const errors: BlockFormErrors = {}
  const today = todayInVienna()

  if (!form.date) {
    errors.date = 'Datum erforderlich'
  } else if (form.date < today) {
    errors.date = 'Datum darf nicht in der Vergangenheit liegen'
  }

  if (!form.startTime) errors.startTime = 'Startzeit erforderlich'
  if (!form.endTime) errors.endTime = 'Endzeit erforderlich'
  if (form.startTime && form.endTime && form.endTime <= form.startTime) {
    errors.endTime = 'Endzeit muss nach Startzeit liegen'
  }

  return errors
}

function blockDate(block: TimeBlock): string {
  return formatInVienna(block.startAt, 'yyyy-MM-dd')
}

function blockStartTime(block: TimeBlock): string {
  return formatInVienna(block.startAt, 'HH:mm')
}

function blockEndTime(block: TimeBlock): string {
  return formatInVienna(block.endAt, 'HH:mm')
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}

function isPast(block: TimeBlock): boolean {
  return blockDate(block) < todayInVienna()
}

interface BlockRowProps {
  block: TimeBlock
  onDelete: (id: string) => void
  mutating: boolean
}

function BlockRow({ block, onDelete, mutating }: BlockRowProps) {
  const past = isPast(block)
  const date = blockDate(block)

  const handleDelete = () => {
    if (window.confirm(`Zeitblock ${blockStartTime(block)}–${blockEndTime(block)} am ${formatDate(date)} löschen?`)) {
      onDelete(block.id)
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-stone-700">{formatDate(date)}</span>
        <span className="text-sm text-stone-500">
          {blockStartTime(block)} – {blockEndTime(block)}
        </span>
        {block.reason && (
          <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-600">
            {block.reason}
          </span>
        )}
        {past && (
          <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-500">
            Vergangen
          </span>
        )}
      </div>

      {/* Deleting past blocks is allowed (cleanup). Creating/editing past blocks is blocked. */}
      <Button variant="danger" size="sm" onClick={handleDelete} disabled={mutating}>
        Löschen
      </Button>
    </div>
  )
}

interface AddBlockFormProps {
  onSubmit: (params: {
    date: string
    startTime: string
    endTime: string
    label?: string
  }) => Promise<void>
  onCancel: () => void
  mutating: boolean
}

function AddBlockForm({ onSubmit, onCancel, mutating }: AddBlockFormProps) {
  const [form, setForm] = useState<AddBlockFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<BlockFormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AddBlockFormState, boolean>>>({})

  const today = todayInVienna()

  const handleBlur = (field: keyof AddBlockFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const errs = validateBlockForm(form)
    setErrors((prev) => ({ ...prev, [field]: errs[field as keyof BlockFormErrors] }))
  }

  const handleChange = (patch: Partial<AddBlockFormState>) => {
    const updated = { ...form, ...patch }
    setForm(updated)
    // Clear errors for changed fields
    const clearedFields = Object.keys(patch) as (keyof AddBlockFormState)[]
    setErrors((prev) => {
      const next = { ...prev }
      clearedFields.forEach((f) => delete next[f as keyof BlockFormErrors])
      return next
    })
  }

  const handleSubmit = async () => {
    setTouched({ date: true, startTime: true, endTime: true })
    const errs = validateBlockForm(form)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return

    await onSubmit({
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      label: form.label || undefined,
    })
  }

  return (
    <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
      <p className="mb-3 text-sm font-medium text-stone-700">Neuer Zeitblock</p>

      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600">Datum *</label>
          <input
            type="date"
            min={today}
            value={form.date}
            onChange={(e) => handleChange({ date: e.target.value })}
            onBlur={() => handleBlur('date')}
            className={`w-48 rounded-md border px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 ${
              errors.date ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600">Zeit *</label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              step={900}
              value={form.startTime}
              onChange={(e) => handleChange({ startTime: e.target.value })}
              onBlur={() => handleBlur('startTime')}
              className={`rounded-md border px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 ${
                errors.startTime ? 'border-red-500' : 'border-stone-300'
              }`}
            />
            <span className="text-stone-400">–</span>
            <input
              type="time"
              step={900}
              value={form.endTime}
              onChange={(e) => handleChange({ endTime: e.target.value })}
              onBlur={() => handleBlur('endTime')}
              className={`rounded-md border px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 ${
                errors.endTime ? 'border-red-500' : 'border-stone-300'
              }`}
            />
          </div>
          {errors.startTime && <p className="text-xs text-red-600">{errors.startTime}</p>}
          {errors.endTime && <p className="text-xs text-red-600">{errors.endTime}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600">Bezeichnung (optional)</label>
          <input
            type="text"
            placeholder="z. B. Mittagspause"
            value={form.label}
            onChange={(e) => handleChange({ label: e.target.value })}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

        {/* V1 design decision: overlapping blocks on the same date are allowed.
            The barber is responsible for managing their own schedule. Conflict
            detection with appointments is already deferred — adding block-level
            overlap rejection in V1 would be premature without a real use case. */}

        <div className="flex gap-2 pt-1">
          <Button onClick={() => { void handleSubmit() }} loading={mutating} size="sm">
            Hinzufügen
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={mutating}>
            Abbrechen
          </Button>
        </div>
      </div>
    </div>
  )
}

export function TimeBlocksSection({
  blocks,
  loading,
  loadError,
  mutating,
  mutateError,
  addBlock,
  removeBlock,
}: TimeBlocksHook) {
  const [showPast, setShowPast] = useState(false)
  const [showForm, setShowForm] = useState(false)

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (loadError) {
    return <ErrorMessage message={`Fehler beim Laden: ${loadError.message}`} />
  }

  const visible = showPast ? blocks : blocks.filter((b) => !isPast(b))

  return (
    <div>
      {mutateError && <ErrorMessage message={mutateError} className="mb-4" />}

      <div className="mb-3 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={showPast}
            onChange={(e) => setShowPast(e.target.checked)}
            className="rounded border-stone-300"
          />
          Vergangene anzeigen
        </label>

        {!showForm && (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
            + Zeitblock hinzufügen
          </Button>
        )}
      </div>

      {visible.length === 0 && !showForm ? (
        <EmptyState
          title="Keine Zeitblöcke"
          description="Blockiere Zeiten für Mittagspausen, Besorgungen oder andere Abwesenheiten."
        />
      ) : (
        <div className="space-y-2">
          {visible.map((block) => (
            <BlockRow
              key={block.id}
              block={block}
              onDelete={(id) => { void removeBlock(id) }}
              mutating={mutating}
            />
          ))}
        </div>
      )}

      {showForm && (
        <AddBlockForm
          onSubmit={async (params) => {
            await addBlock(params)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
          mutating={mutating}
        />
      )}
    </div>
  )
}
