import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { BARBER_TIMEZONE } from '@/constants'
import { formatDateLong, formatTimeSlot } from '@/utils/date'

interface SuccessState {
  appointmentId: string
  cancellationToken: string
  startAt: string
  endAt: string
  customerName: string
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
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

export function BookingSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as SuccessState | null

  useEffect(() => {
    if (!state?.cancellationToken) {
      navigate('/book', { replace: true })
    }
  }, [state, navigate])

  if (!state?.cancellationToken) return null

  const startAt = new Date(state.startAt)
  const endAt = new Date(state.endAt)

  return (
    <div className="min-h-screen bg-app-background">
      <div className="mx-auto flex min-h-screen max-w-sm flex-col px-6 pb-10">
        {/* Check mark */}
        <div className="flex flex-col items-center pt-16 pb-8">
          <div className="flex size-20 items-center justify-center rounded-full bg-app-surface text-app-primary shadow-[0_8px_24px_-8px_rgba(102,73,48,0.3)]">
            <CheckIcon />
          </div>
        </div>

        {/* Heading */}
        <div className="pb-8 text-center">
          <span className="font-dm-mono text-[11px] uppercase tracking-[0.28em] text-app-accent">
            Alles klar!
          </span>
          <h1 className="mt-3 font-dm-serif text-[38px] leading-[1.04] text-app-primary">
            Termin <em>bestätigt</em>
          </h1>
        </div>

        {/* Appointment card */}
        <div className="rounded-[18px] bg-app-surface px-6 py-5">
          <p className="font-dm-mono text-[11px] uppercase tracking-[0.14em] text-app-text/55 mb-3">
            Dein Termin
          </p>
          <p className="font-dm-serif text-[20px] leading-snug text-app-text">
            {formatDateLong(startAt, BARBER_TIMEZONE)}
          </p>
          <p className="mt-1 font-dm-mono text-sm text-app-text/65">
            {formatTimeSlot(startAt, endAt, BARBER_TIMEZONE)} Uhr
          </p>
          <div className="my-4 h-px bg-app-border/60" />
          <p className="font-dm-mono text-[11px] uppercase tracking-[0.14em] text-app-text/55 mb-1">
            Name
          </p>
          <p className="font-dm-sans text-sm font-medium text-app-text">
            {state.customerName}
          </p>
        </div>

        {/* Cancellation notice */}
        <div className="mt-4 rounded-[14px] border border-app-border bg-transparent px-5 py-4">
          <p className="font-dm-mono text-[11px] uppercase tracking-[0.12em] text-app-text/55 mb-2">
            Stornierung
          </p>
          <p className="font-dm-sans text-sm text-app-text/70">
            Solltest du den Termin nicht wahrnehmen können:
          </p>
          <Link
            to={`/cancel/${state.cancellationToken}`}
            className="mt-2 inline-block font-dm-mono text-sm text-app-primary underline underline-offset-2"
          >
            Termin stornieren →
          </Link>
        </div>

        {/* New booking CTA */}
        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => navigate('/book')}
            className="flex h-15 w-full items-center justify-center gap-3 rounded-[18px] bg-app-primary font-dm-sans text-base font-medium uppercase tracking-[0.06em] text-app-background shadow-[0_14px_26px_-12px_rgba(102,73,48,0.7)] transition-all duration-150 active:translate-y-0.5"
          >
            Neuen Termin buchen
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
