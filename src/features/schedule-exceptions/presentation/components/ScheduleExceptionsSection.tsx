import { useState } from 'react'
import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/ErrorMessage'
import { EmptyState } from '@/components/EmptyState'
import { Spinner } from '@/components/Spinner'
import { todayInVienna } from '@/utils/date'
import type { useScheduleExceptions } from '../hooks/use-schedule-exceptions'
import type { ScheduleException } from '../../domain/ScheduleException'

type ExceptionsHook = ReturnType<typeof useScheduleExceptions>

interface AddFormState {
  date: string
  isOpen: boolean
  openTime: string
  closeTime: string
  reason: string
}

const EMPTY_FORM: AddFormState = {
  date: '',
  isOpen: false,
  openTime: '09:00',
  closeTime: '18:00',
  reason: '',
}

interface FormErrors {
  date?: string
  openTime?: string
  closeTime?: string
}

function validateForm(form: AddFormState, existing: ScheduleException[]): FormErrors {
  const errors: FormErrors = {}
  const today = todayInVienna()

  if (!form.date) {
    errors.date = 'Datum erforderlich'
  } else if (form.date < today) {
    // "past" means strictly before today; today counts as future (documented choice)
    errors.date = 'Datum darf nicht in der Vergangenheit liegen'
  } else if (existing.some((e) => e.exceptionDate === form.date)) {
    errors.date = 'Für dieses Datum existiert bereits eine Ausnahme'
  }

  if (form.isOpen) {
    if (!form.openTime) errors.openTime = 'Öffnungszeit erforderlich'
    if (!form.closeTime) errors.closeTime = 'Schließzeit erforderlich'
    if (form.openTime && form.closeTime && form.closeTime <= form.openTime) {
      errors.closeTime = 'Schließzeit muss nach Öffnungszeit liegen'
    }
  }

  return errors
}

function isPast(exceptionDate: string): boolean {
  return exceptionDate < todayInVienna()
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}

interface ExceptionRowProps {
  exception: ScheduleException
  onDelete: (id: string) => void
  mutating: boolean
}

function ExceptionRow({ exception, onDelete, mutating }: ExceptionRowProps) {
  const past = isPast(exception.exceptionDate)

  const handleDelete = () => {
    if (window.confirm(`Ausnahme für ${formatDate(exception.exceptionDate)} wirklich löschen?`)) {
      onDelete(exception.id)
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-stone-700">
          {formatDate(exception.exceptionDate)}
        </span>

        {!exception.isOpen ? (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Geschlossen
          </span>
        ) : (
          <span className="text-sm text-stone-500">
            {exception.customOpenTime} – {exception.customCloseTime}
          </span>
        )}

        {exception.reason && (
          <span className="text-sm text-stone-400">{exception.reason}</span>
        )}

        {past && (
          <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-500">
            Vergangen
          </span>
        )}
      </div>

      {/* Delete is allowed for past entries (cleanup), create/edit is blocked */}
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={mutating}
      >
        Löschen
      </Button>
    </div>
  )
}

interface AddExceptionFormProps {
  existing: ScheduleException[]
  onSubmit: (params: {
    date: string
    isOpen: boolean
    openTime?: string
    closeTime?: string
    reason?: string
  }) => Promise<void>
  onCancel: () => void
  mutating: boolean
}

function AddExceptionForm({ existing, onSubmit, onCancel, mutating }: AddExceptionFormProps) {
  const [form, setForm] = useState<AddFormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AddFormState, boolean>>>({})

  const today = todayInVienna()

  const validateAndSet = (updated: AddFormState) => {
    const errs = validateForm(updated, existing)
    // Only show errors for touched fields (blur-on-submit will catch the rest)
    const visible: FormErrors = {}
    if (touched.date) visible.date = errs.date
    if (touched.openTime) visible.openTime = errs.openTime
    if (touched.closeTime) visible.closeTime = errs.closeTime
    setErrors(visible)
  }

  const handleBlur = (field: keyof AddFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const errs = validateForm(form, existing)
    setErrors((prev) => ({ ...prev, [field]: errs[field as keyof FormErrors] }))
  }

  const handleChange = (patch: Partial<AddFormState>) => {
    const updated = { ...form, ...patch }
    setForm(updated)
    validateAndSet(updated)
  }

  const handleSubmit = async () => {
    // Mark all fields touched and re-validate on submit
    setTouched({ date: true, openTime: true, closeTime: true })
    const errs = validateForm(form, existing)
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) return

    await onSubmit({
      date: form.date,
      isOpen: form.isOpen,
      openTime: form.isOpen ? form.openTime : undefined,
      closeTime: form.isOpen ? form.closeTime : undefined,
      reason: form.reason || undefined,
    })
  }

  return (
    <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
      <p className="mb-3 text-sm font-medium text-stone-700">Neue Ausnahme</p>

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

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.isOpen}
            onClick={() => handleChange({ isOpen: !form.isOpen })}
            className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
              form.isOpen ? 'bg-stone-900' : 'bg-stone-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                form.isOpen ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm text-stone-700">
            {form.isOpen ? 'Geöffnet (eigene Zeiten)' : 'Geschlossen (ganztägig)'}
          </span>
        </div>

        {form.isOpen && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-600">Öffnungszeiten</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                step={900}
                value={form.openTime}
                onChange={(e) => handleChange({ openTime: e.target.value })}
                onBlur={() => handleBlur('openTime')}
                className={`rounded-md border px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 ${
                  errors.openTime ? 'border-red-500' : 'border-stone-300'
                }`}
              />
              <span className="text-stone-400">–</span>
              <input
                type="time"
                step={900}
                value={form.closeTime}
                onChange={(e) => handleChange({ closeTime: e.target.value })}
                onBlur={() => handleBlur('closeTime')}
                className={`rounded-md border px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 ${
                  errors.closeTime ? 'border-red-500' : 'border-stone-300'
                }`}
              />
            </div>
            {errors.openTime && <p className="text-xs text-red-600">{errors.openTime}</p>}
            {errors.closeTime && <p className="text-xs text-red-600">{errors.closeTime}</p>}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-stone-600">Grund (optional)</label>
          <input
            type="text"
            placeholder="z. B. Urlaub, Feiertag"
            value={form.reason}
            onChange={(e) => handleChange({ reason: e.target.value })}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

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

export function ScheduleExceptionsSection({
  exceptions,
  loading,
  loadError,
  mutating,
  mutateError,
  addException,
  removeException,
}: ExceptionsHook) {
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

  const visible = showPast ? exceptions : exceptions.filter((e) => !isPast(e.exceptionDate))

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
            + Ausnahme hinzufügen
          </Button>
        )}
      </div>

      {visible.length === 0 && !showForm ? (
        <EmptyState
          title="Keine Ausnahmen"
          description="Füge Feiertage, Urlaub oder besondere Öffnungszeiten hinzu."
        />
      ) : (
        <div className="space-y-2">
          {visible.map((exception) => (
            <ExceptionRow
              key={exception.id}
              exception={exception}
              onDelete={(id) => { void removeException(id) }}
              mutating={mutating}
            />
          ))}
        </div>
      )}

      {showForm && (
        <AddExceptionForm
          existing={exceptions}
          onSubmit={async (params) => {
            await addException(params)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
          mutating={mutating}
        />
      )}
    </div>
  )
}
