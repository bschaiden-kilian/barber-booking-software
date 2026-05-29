import { useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSlotHoldByToken } from '@/features/slot-holds/presentation/hooks/use-slot-hold-by-token'
import { HoldTimer } from '@/features/slot-holds/presentation/components/HoldTimer'
import { SlotSummary } from '@/features/slot-holds/presentation/components/SlotSummary'
import { CustomerForm } from '@/features/customers/presentation/components/CustomerForm'
import { Spinner } from '@/components/Spinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { useBookingFlow } from './hooks/use-booking-flow'
import { MOCK_BARBER_ID } from '@/constants/mock-ids'

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app-background">
      <div className="mx-auto flex min-h-screen max-w-sm flex-col px-6 pb-10">
        {children}
      </div>
    </div>
  )
}

export function BookingConfirmPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')

  useEffect(() => {
    if (!token) navigate('/book', { replace: true })
  }, [token, navigate])

  const { hold, loading, error } = useSlotHoldByToken(token)
  const { confirmBooking, loading: confirming, error: confirmError } = useBookingFlow()

  const handleExpire = useCallback(() => {
    navigate('/book?expired=1', { replace: true })
  }, [navigate])

  useEffect(() => {
    if (!loading && !error && hold === null && token) {
      navigate('/book?expired=1', { replace: true })
    }
  }, [loading, error, hold, token, navigate])

  const handleSubmit = async (data: { name: string; email: string; phone: string }) => {
    if (!token) return
    try {
      const result = await confirmBooking({
        barberId: MOCK_BARBER_ID,
        holdToken: token,
        name: data.name,
        email: data.email,
        phone: data.phone,
      })
      if (!result) return
      navigate('/book/success', {
        state: {
          appointmentId: result.appointmentId,
          cancellationToken: result.cancellationToken,
          startAt: hold!.startAt.toISOString(),
          endAt: hold!.endAt.toISOString(),
          customerName: data.name,
        },
      })
    } catch {
      // non-expiry errors surfaced via confirmError state
    }
  }

  if (!token) return null

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-1 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell>
        <div className="pt-20">
          <ErrorMessage message={error.message} />
        </div>
      </PageShell>
    )
  }

  if (!hold) return null

  const isExpired = hold.expiresAt <= new Date()
  if (isExpired) {
    return (
      <PageShell>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-app-surface text-app-accent">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h1 className="font-dm-serif text-[28px] text-app-primary">Reservierung abgelaufen</h1>
            <p className="mt-2 font-dm-sans text-sm text-app-text/70">
              Deine Reservierung ist abgelaufen. Bitte wähle einen neuen Termin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/book')}
            className="flex h-12 w-full items-center justify-center rounded-[14px] bg-app-primary font-dm-sans text-sm font-medium uppercase tracking-[0.06em] text-app-background"
          >
            Neuen Termin wählen
          </button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
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
          03 / 03
        </span>
        <div className="size-10" />
      </div>

      {/* Heading */}
      <div className="pt-5.5 pb-1">
        <span className="font-dm-mono text-[11px] uppercase tracking-[0.28em] text-app-accent">
          Fast geschafft
        </span>
        <h1 className="mt-3.5 font-dm-serif text-[40px] leading-[1.04] text-app-primary">
          Bestätige
          <br />
          deine <em>Buchung</em>
        </h1>
      </div>

      {/* Slot summary */}
      <div className="pt-6">
        <SlotSummary startAt={hold.startAt} endAt={hold.endAt} />
      </div>

      {/* Hold timer */}
      <div className="pt-3 pb-1">
        <HoldTimer expiresAt={hold.expiresAt} onExpire={handleExpire} />
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-app-border/50" />

      {/* Error */}
      {confirmError && <ErrorMessage message={confirmError.message} />}

      {/* Customer form */}
      <CustomerForm
        onSubmit={handleSubmit}
        submitting={confirming}
        error={undefined}
      />
    </PageShell>
  )
}
