import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = '', id, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="font-dm-mono text-[11px] uppercase tracking-[0.12em] text-app-text/70">
            {label}
            {props.required && <span className="ml-0.5 text-app-accent">*</span>}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-[10px] border bg-app-background px-3.5 py-3',
            'font-dm-sans text-sm text-app-text placeholder:text-app-text/35',
            'transition-colors focus:outline-none focus:ring-1 focus:ring-app-primary focus:border-app-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-400 focus:ring-red-400' : 'border-app-border',
            className,
          ].join(' ')}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
