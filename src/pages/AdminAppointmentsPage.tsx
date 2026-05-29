import { useState } from 'react'
import { useCurrentBarber } from '@/features/auth/presentation/hooks/use-current-barber'
import { useAdminAppointments } from '@/features/appointments/presentation/hooks/use-admin-appointments'
import { useCustomers } from '@/features/customers/presentation/hooks/use-customers'
import { AppointmentCard } from '@/features/appointments/presentation/components/AppointmentCard'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { Spinner } from '@/components/Spinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { EmptyState } from '@/components/EmptyState'
import type { Appointment } from '@/features/appointments/domain/Appointment'

type Filter = 'upcoming' | 'past' | 'all'

const filterLabels: Record<Filter, string> = {
  upcoming: 'Bevorstehend',
  past: 'Vergangen',
  all: 'Alle',
}

export function AdminAppointmentsPage() {
  const { barber, loading: barberLoading } = useCurrentBarber()
  const [filter, setFilter] = useState<Filter>('upcoming')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const barberId = barber?.id ?? ''
  const { appointments, loading, error, cancelAppointment } = useAdminAppointments(barberId, filter)
  const { customers } = useCustomers(barberId)

  const customerById = new Map(customers.map((c) => [c.id, c]))

  const handleCancel = async (id: string) => {
    setCancellingId(id)
    try {
      await cancelAppointment(id, 'barber')
    } finally {
      setCancellingId(null)
    }
  }

  if (barberLoading) {
    return (
      <Container>
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader title="Termine" subtitle={barber?.businessName} />

      <div className="mb-6 flex gap-2">
        {(Object.keys(filterLabels) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : appointments.length === 0 ? (
        <EmptyState title="Keine Termine in diesem Zeitraum." />
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((appt: Appointment) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              customer={customerById.get(appt.customerId) ?? null}
              onCancel={handleCancel}
              cancelling={cancellingId === appt.id}
            />
          ))}
        </div>
      )}
    </Container>
  )
}
