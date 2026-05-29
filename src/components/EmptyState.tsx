import { Button } from './Button'

interface Action {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  title: string
  description?: string
  action?: Action
  className?: string
}

export function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 py-12 text-center ${className}`}>
      <p className="text-base font-medium text-stone-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-stone-500">{description}</p>}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
