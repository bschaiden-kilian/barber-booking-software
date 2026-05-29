import { useState, useEffect } from 'react'
import { addDays, startOfWeek, format, isBefore, startOfDay, isSameDay } from 'date-fns'

interface WeekDatePickerProps {
  value: Date | null
  onChange: (date: Date) => void
  minDate?: Date
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function WeekDatePicker({ value, onChange, minDate }: WeekDatePickerProps) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(value ?? new Date(), { weekStartsOn: 1 })
  )

  // Sync week window when value moves outside current week
  useEffect(() => {
    if (!value) return
    const newWeekStart = startOfWeek(value, { weekStartsOn: 1 })
    setWeekStart(prev =>
      newWeekStart.getTime() !== prev.getTime() ? newWeekStart : prev
    )
  }, [value])

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekEnd = days[6]!
  const startMonth = format(weekStart, 'MMMM')
  const endMonth = format(weekEnd, 'MMMM')
  const monthLabel =
    startMonth === endMonth
      ? `${startMonth} ${format(weekStart, 'yyyy')}`
      : `${format(weekStart, 'MMM')} – ${format(weekEnd, 'MMM yyyy')}`

  const prevWeek = () => setWeekStart(d => addDays(d, -7))
  const nextWeek = () => setWeekStart(d => addDays(d, 7))

  return (
    <div>
      {/* Month header row */}
      <div className="flex items-center gap-3.5 pb-3.5 pt-6">
        <span className="font-dm-serif text-lg leading-none tracking-[0.01em] text-app-text">
          {monthLabel}
        </span>
        <span className="h-px flex-1 bg-app-border" />
        <button
          type="button"
          onClick={prevWeek}
          aria-label="Vorherige Woche"
          className="size-[30px] rounded-full border border-app-border grid place-items-center text-app-primary transition-colors hover:bg-app-surface"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={nextWeek}
          aria-label="Nächste Woche"
          className="size-[30px] rounded-full border border-app-border grid place-items-center text-app-primary transition-colors hover:bg-app-surface"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Day strip */}
      <div
        role="radiogroup"
        aria-label="Datum wählen"
        className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {days.map((day, i) => {
          const isDisabled = minDate
            ? isBefore(startOfDay(day), startOfDay(minDate))
            : false
          const isSelected = value ? isSameDay(day, value) : false

          return (
            <button
              key={day.toISOString()}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={format(day, 'EEEE, d. MMMM yyyy')}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(day)}
              className={[
                'flex flex-none flex-col gap-1.5 border-b-[2.5px] pt-3 pb-[11px] transition-all duration-150 focus-visible:outline-none',
                i === 0 ? 'min-w-[42px] pl-0 pr-1.5' : 'min-w-[42px] px-1.5',
                isSelected ? 'border-app-primary' : 'border-transparent',
                isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
              ].join(' ')}
            >
              <span
                className={[
                  'font-dm-mono text-[10px] tracking-[0.06em]',
                  isSelected ? 'text-app-primary' : 'text-app-text/55',
                ].join(' ')}
              >
                {format(day, 'EEE').toUpperCase()}
              </span>
              <span
                className={[
                  'font-dm-serif text-[23px] leading-none',
                  isSelected ? 'text-app-primary' : 'text-app-text',
                ].join(' ')}
              >
                {format(day, 'd')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
