import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useServices } from '@/providers/service-context'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { BARBER_TIMEZONE } from '@/constants'
import { formatDateLong, formatTimeSlot } from '@/utils/date'
import type { Appointment } from '@/features/appointments/domain/Appointment'

export function CancelPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { appointmentService } = useServices()

  const [appointment, setAppointment] = useState<Appointment | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    if (!token) return
    appointmentService
      .getByCancellationToken(token)
      .then(setAppointment)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err : new Error(String(err))),
      )
      .finally(() => setLoading(false))
  }, [appointmentService, token])

  const handleCancel = async () => {
    if (!token) return
    setCancelling(true)
    try {
      await appointmentService.cancelByToken(token)
      setCancelled(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setCancelling(false)
    }
  }

  if (!token) {
    return (
      <Container>
        <ErrorMessage message="Ungültiger Stornierungslink." />
      </Container>
    )
  }

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage message={error.message} />
      </Container>
    )
  }

  if (cancelled) {
    return (
      <Container>
        <PageHeader title="Termin storniert" />
        <p className="text-stone-600">
          Dein Termin wurde erfolgreich storniert.
        </p>
        <button
          type="button"
          onClick={() => navigate('/book')}
          className="mt-4 text-sm font-medium text-stone-900 underline"
        >
          Neuen Termin buchen
        </button>
      </Container>
    )
  }

  if (!appointment) {
    return (
      <Container>
        <PageHeader title="Termin nicht gefunden" />
        <p className="text-stone-600">
          Dieser Stornierungslink ist ungültig oder der Termin wurde bereits storniert.
        </p>
      </Container>
    )
  }

  if (appointment.status === 'cancelled') {
    return (
      <Container>
        <PageHeader title="Termin bereits storniert" />
        <p className="text-stone-600">Dieser Termin wurde bereits storniert.</p>
      </Container>
    )
  }

  const isPast = appointment.startAt < new Date()
  if (isPast) {
    return (
      <Container>
        <PageHeader title="Termin vergangen" />
        <p className="text-stone-600">Vergangene Termine können nicht storniert werden.</p>
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader title="Termin stornieren" />
      <Card className="mb-6">
        <p className="font-medium text-stone-900">
          {formatDateLong(appointment.startAt, BARBER_TIMEZONE)}
        </p>
        <p className="text-stone-600">
          {formatTimeSlot(appointment.startAt, appointment.endAt, BARBER_TIMEZONE)} Uhr
        </p>
      </Card>
      <p className="mb-4 text-sm text-stone-600">
        Möchtest du diesen Termin wirklich stornieren?
      </p>
      <Button variant="danger" loading={cancelling} onClick={handleCancel}>
        Termin stornieren
      </Button>
    </Container>
  )
}
