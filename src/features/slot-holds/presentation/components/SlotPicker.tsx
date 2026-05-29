import { formatInTimeZone } from 'date-fns-tz'
import { BARBER_TIMEZONE } from '@/constants'
import type { AvailableSlot } from '@/pages/hooks/types'

interface SlotPickerProps {
  slots: AvailableSlot[]
  selectedSlot: AvailableSlot | null
  onSelect: (slot: AvailableSlot) => void
}

export function SlotPicker({ slots, selectedSlot, onSelect }: SlotPickerProps) {
  if (slots.length === 0) {
    return (
      <p className="py-6 text-center font-dm-mono text-sm text-app-text/60">
        Kein freier Termin an diesem Tag.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {slots.map((slot) => {
        const label = formatInTimeZone(slot.startAt, BARBER_TIMEZONE, 'HH:mm')
        const isSelected = selectedSlot?.startAt.getTime() === slot.startAt.getTime()
        return (
          <button
            key={slot.startAt.toISOString()}
            type="button"
            onClick={() => onSelect(slot)}
            className={[
              'h-25 rounded-[14px] border font-dm-mono text-sm font-medium',
              'grid place-items-center transition-all duration-150 focus-visible:outline-none',
              isSelected
                ? 'border-app-accent bg-app-accent text-app-background shadow-[0_8px_18px_-8px_rgba(153,126,103,0.8)]'
                : 'border-app-border bg-transparent text-app-text hover:border-app-primary',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
