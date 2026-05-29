import type { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`font-dm-mono text-[11px] uppercase tracking-[0.12em] text-app-text/70 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-app-accent">*</span>}
    </label>
  )
}
