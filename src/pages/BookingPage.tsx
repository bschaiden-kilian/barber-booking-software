import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useCurrentBarber } from '@/features/auth/presentation/hooks/use-current-barber'
import { SlotPicker } from '@/features/slot-holds/presentation/components/SlotPicker'
import { WeekDatePicker } from '@/components/WeekDatePicker'
import { Spinner } from '@/components/Spinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { useAvailableSlots } from './hooks/use-available-slots'
import { useBookingFlow } from './hooks/use-booking-flow'
import { MOCK_BARBER_ID } from '@/constants/mock-ids'
import { todayInVienna } from '@/utils/date'
import type { AvailableSlot } from './hooks/types'

function parseDateString(str: string): Date {
  const [year, month, day] = str.split('-').map(Number)
  // Noon in local zone — only the calendar date matters for slot lookup
  return new Date(year!, month! - 1, day!, 12, 0, 0)
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  )
}

export function BookingPage() {
  const navigate = useNavigate()
  const { barber: _barber } = useCurrentBarber()
  const barberId = MOCK_BARBER_ID

  const todayStr = todayInVienna()
  const todayDate = useMemo(() => parseDateString(todayStr), [todayStr])
  const [dateStr, setDateStr] = useState<string>(todayStr)
  const selectedDate = useMemo(() => parseDateString(dateStr), [dateStr])

  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const { slots, loading, error } = useAvailableSlots(barberId, selectedDate)
  const { holdSlot, loading: holding, error: holdError } = useBookingFlow()

  const handleDateChange = (date: Date) => {
    setDateStr(format(date, 'yyyy-MM-dd'))
    setSelectedSlot(null)
  }

  const handleContinue = async () => {
    if (!selectedSlot) return
    try {
      const { holdToken } = await holdSlot({
        barberId,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
      })
      navigate(`/book/confirm?token=${holdToken}`)
    } catch {
      // error shown via holdError
    }
  }

  const isReady = !!selectedSlot && !holding

  return (
    <div className="min-h-screen bg-app-background">
      <div className="mx-auto flex min-h-screen max-w-sm flex-col px-6 pb-10">
        {/* Top bar */}
        <div className="flex items-center justify-between pt-6 pb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Zurück"
            className="size-10 rounded-full border border-app-border grid place-items-center text-app-primary transition-colors hover:bg-app-surface"
          >
            <ChevronLeftIcon />
          </button>
          <span className="font-dm-mono text-[11px] tracking-[0.16em] text-app-accent">
            02 / 03
          </span>
          <div className="size-10" />
        </div>

        {/* Heading */}
        <div className="pt-5.5 pb-1">
          <span className="font-dm-mono text-[11px] uppercase tracking-[0.28em] text-app-accent">
            Termin reservieren
          </span>
          <h1 className="mt-3.5 font-dm-serif text-[40px] leading-[1.04] text-app-primary">
            Datum &amp; <em>Zeit</em>
            <br />
            wählen
          </h1>
        </div>

        {/* Week date picker */}
        <WeekDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          minDate={todayDate}
        />

        {/* Times section */}
        <div className="flex items-baseline justify-between pt-6 pb-3">
          <h2 className="font-dm-serif text-[19px] text-app-text">Verfügbare Zeiten</h2>
          <span className="font-dm-mono text-[11px] text-app-text/50">GMT+1</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error.message} />
        ) : (
          <SlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        )}

        {holdError && <ErrorMessage message={holdError.message} />}

        {/* CTA */}
        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isReady}
            className={[
              'flex w-full h-15 items-center justify-center gap-3 rounded-[18px]',
              'font-dm-sans text-base font-medium uppercase tracking-[0.06em] transition-all duration-150',
              isReady
                ? 'bg-app-primary text-app-background shadow-[0_14px_26px_-12px_rgba(102,73,48,0.7)] cursor-pointer active:translate-y-0.5'
                : 'cursor-not-allowed bg-app-surface text-app-accent opacity-60',
            ].join(' ')}
          >
            {holding && (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            Weiter
            {!holding && isReady && <ArrowRightIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}
