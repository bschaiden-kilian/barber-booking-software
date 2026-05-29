import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Spinner } from '@/components/Spinner'
import type { DayDraft, DayErrors } from '../hooks/use-weekly-schedule'
import type { useWeeklySchedule } from '../hooks/use-weekly-schedule'
import type { DayOfWeek } from '../../domain/WeeklyScheduleEntry'

const DAY_LABELS: Record<DayOfWeek, string> = {
  1: 'Montag',
  2: 'Dienstag',
  3: 'Mittwoch',
  4: 'Donnerstag',
  5: 'Freitag',
  6: 'Samstag',
  7: 'Sonntag',
}

type ScheduleHook = ReturnType<typeof useWeeklySchedule>

interface DayRowProps {
  day: DayDraft
  errors: DayErrors
  onUpdate: (day: DayOfWeek, patch: Partial<Omit<DayDraft, 'dayOfWeek' | 'id'>>) => void
  onBlur: (day: DayOfWeek) => void
}

function DayRow({ day, errors, onUpdate, onBlur }: DayRowProps) {
  return (
    <div className="flex flex-wrap items-start gap-x-4 gap-y-2 rounded-lg bg-stone-50 px-4 py-3">
      <span className="w-28 shrink-0 pt-0.5 text-sm font-medium text-stone-700">
        {DAY_LABELS[day.dayOfWeek]}
      </span>

      {/* Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={day.isWorking}
        aria-label={`${DAY_LABELS[day.dayOfWeek]} ${day.isWorking ? 'offen' : 'geschlossen'}`}
        onClick={() => onUpdate(day.dayOfWeek, { isWorking: !day.isWorking })}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
          day.isWorking ? 'bg-stone-900' : 'bg-stone-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            day.isWorking ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      {/* Status label */}
      <span className="w-20 shrink-0 pt-0.5 text-sm text-stone-500">
        {day.isWorking ? 'Offen' : 'Geschlossen'}
      </span>

      {/* Time inputs — only visible when open */}
      {day.isWorking && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              type="time"
              step={900}
              value={day.openTime}
              onChange={(e) => onUpdate(day.dayOfWeek, { openTime: e.target.value })}
              onBlur={() => onBlur(day.dayOfWeek)}
              className={`rounded-md border px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 ${
                errors.openTime ? 'border-red-500' : 'border-stone-300'
              }`}
            />
            <span className="text-stone-400">–</span>
            <input
              type="time"
              step={900}
              value={day.closeTime}
              onChange={(e) => onUpdate(day.dayOfWeek, { closeTime: e.target.value })}
              onBlur={() => onBlur(day.dayOfWeek)}
              className={`rounded-md border px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900 ${
                errors.closeTime ? 'border-red-500' : 'border-stone-300'
              }`}
            />
          </div>
          {errors.openTime && <p className="text-xs text-red-600">{errors.openTime}</p>}
          {errors.closeTime && <p className="text-xs text-red-600">{errors.closeTime}</p>}
        </div>
      )}
    </div>
  )
}

export function WeeklyScheduleSection({
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
}: ScheduleHook) {
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

  return (
    <div>
      {saveError && <ErrorMessage message={saveError} className="mb-4" />}

      <div className="space-y-2">
        {draft.map((day) => (
          <DayRow
            key={day.dayOfWeek}
            day={day}
            errors={fieldErrors[day.dayOfWeek] ?? {}}
            onUpdate={updateDay}
            onBlur={validateDayField}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={() => { void save() }} loading={saving} disabled={!dirty || saving}>
          Speichern
        </Button>
        {!dirty && !saving && (
          <span className="text-sm text-stone-400">Keine Änderungen</span>
        )}
      </div>
    </div>
  )
}
