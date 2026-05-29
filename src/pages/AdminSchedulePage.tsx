import { useState, type ReactNode } from 'react'
import { Container } from '@/components/Container'
import { PageHeader } from '@/components/PageHeader'
import { Spinner } from '@/components/Spinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { useCurrentBarber } from '@/features/auth/presentation/hooks/use-current-barber'
import { useWeeklySchedule } from '@/features/weekly-schedule/presentation/hooks/use-weekly-schedule'
import { useScheduleExceptions } from '@/features/schedule-exceptions/presentation/hooks/use-schedule-exceptions'
import { useTimeBlocks } from '@/features/time-blocks/presentation/hooks/use-time-blocks'
import { WeeklyScheduleSection } from '@/features/weekly-schedule/presentation/components/WeeklyScheduleSection'
import { ScheduleExceptionsSection } from '@/features/schedule-exceptions/presentation/components/ScheduleExceptionsSection'
import { TimeBlocksSection } from '@/features/time-blocks/presentation/components/TimeBlocksSection'

// No beforeunload guard for unsaved weekly-schedule changes — this is a mock
// phase with no persistent data, so data loss on refresh is acceptable. A guard
// would add friction with no real benefit until Supabase is wired up.

interface CollapsibleSectionProps {
  title: string
  defaultOpen: boolean
  dirty?: boolean
  children: ReactNode
}

function CollapsibleSection({ title, defaultOpen, dirty = false, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-900">{title}</span>
          {/* Show unsaved indicator in the header only when the section is collapsed */}
          {!open && dirty && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Nicht gespeichert
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && <div className="border-t border-stone-100 px-5 pb-6 pt-4">{children}</div>}
    </div>
  )
}

export function AdminSchedulePage() {
  const { barber, loading: barberLoading, error: barberError } = useCurrentBarber()
  const barberId = barber?.id ?? ''

  // Each section's hook is independent — dirty state on weekly schedule does NOT
  // affect exceptions state, satisfying the concurrent-edit isolation requirement.
  const weeklySchedule = useWeeklySchedule(barberId)
  const scheduleExceptions = useScheduleExceptions(barberId)
  const timeBlocks = useTimeBlocks(barberId)

  if (barberLoading) {
    return (
      <Container>
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </Container>
    )
  }

  if (barberError || !barber) {
    return (
      <Container>
        <ErrorMessage message="Nicht angemeldet oder Barber nicht gefunden." />
      </Container>
    )
  }

  return (
    <Container className="max-w-3xl">
      <PageHeader
        title="Terminplan"
        subtitle="Wochenplan, Ausnahmen und Zeitblöcke verwalten"
      />

      <div className="space-y-4">
        <CollapsibleSection title="Wochenplan" defaultOpen dirty={weeklySchedule.dirty}>
          <WeeklyScheduleSection {...weeklySchedule} />
        </CollapsibleSection>

        <CollapsibleSection title="Ausnahmen" defaultOpen={false}>
          <ScheduleExceptionsSection {...scheduleExceptions} />
        </CollapsibleSection>

        <CollapsibleSection title="Zeitblöcke" defaultOpen={false}>
          <TimeBlocksSection {...timeBlocks} />
        </CollapsibleSection>
      </div>
    </Container>
  )
}
