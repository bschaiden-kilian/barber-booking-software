import { BARBER_TIMEZONE } from '@/constants'
import { formatDateLong, formatTimeSlot } from '@/utils/date'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import type { Appointment } from '../../domain/Appointment'
import type { Customer } from '@/features/customers/domain/Customer'

interface AppointmentCardProps {
  appointment: Appointment
  customer: Customer | null
  onCancel: (id: string) => void
  cancelling?: boolean
}

const statusLabel: Record<string, string> = {
  confirmed: 'Bestätigt',
  cancelled: 'Storniert',
  completed: 'Abgeschlossen',
  no_show: 'Nicht erschienen',
}

export function AppointmentCard({ appointment, customer, onCancel, cancelling = false }: AppointmentCardProps) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-stone-900">
          {customer?.name ?? 'Unbekannter Kunde'}
        </p>
        {customer?.email && (
          <p className="text-sm text-stone-500">{customer.email}</p>
        )}
        {customer?.phone && (
          <p className="text-sm text-stone-500">{customer.phone}</p>
        )}
        <p className="mt-2 text-sm text-stone-700">
          {formatDateLong(appointment.startAt, BARBER_TIMEZONE)}
        </p>
        <p className="text-sm text-stone-600">
          {formatTimeSlot(appointment.startAt, appointment.endAt, BARBER_TIMEZONE)} Uhr
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            appointment.status === 'confirmed'
              ? 'bg-green-100 text-green-700'
              : appointment.status === 'cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-stone-100 text-stone-600'
          }`}
        >
          {statusLabel[appointment.status] ?? appointment.status}
        </span>
      </div>
      {appointment.status === 'confirmed' && (
        <Button
          variant="danger"
          size="sm"
          loading={cancelling}
          onClick={() => onCancel(appointment.id)}
        >
          Stornieren
        </Button>
      )}
    </Card>
  )
}
