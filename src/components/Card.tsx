import type { ReactNode } from 'react'

type Padding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps {
  children: ReactNode
  padding?: Padding
  className?: string
}

const paddingClasses: Record<Padding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
}

export function Card({ children, padding = 'md', className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-stone-200 bg-white shadow-sm ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
