import { BARBER_TIMEZONE } from '@/constants'
import { formatDateLong, formatTimeSlot } from '@/utils/date'

interface SlotSummaryProps {
  startAt: Date
  endAt: Date
}

export function SlotSummary({ startAt, endAt }: SlotSummaryProps) {
  return (
    <div className="rounded-[14px] bg-app-surface px-5 py-4">
      <p className="font-dm-serif text-[17px] leading-snug text-app-text">
        {formatDateLong(startAt, BARBER_TIMEZONE)}
      </p>
      <p className="mt-1 font-dm-mono text-sm text-app-text/65">
        {formatTimeSlot(startAt, endAt, BARBER_TIMEZONE)} Uhr
      </p>
    </div>
  )
}
