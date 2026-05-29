import { useState, useEffect } from 'react'

interface HoldTimerProps {
  expiresAt: Date
  onExpire: () => void
}

export function HoldTimer({ expiresAt, onExpire }: HoldTimerProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000)),
  )

  useEffect(() => {
    if (remaining <= 0) {
      onExpire()
      return
    }
    const id = setInterval(() => {
      const secs = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
      setRemaining(secs)
      if (secs <= 0) {
        clearInterval(id)
        onExpire()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [expiresAt, onExpire, remaining])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const display = `${String(minutes)}:${String(seconds).padStart(2, '0')}`
  const urgent = remaining <= 60

  return (
    <div className={`flex items-center gap-2 ${urgent ? 'text-red-500' : 'text-app-accent'}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="font-dm-mono text-sm">
        Reserviert für <strong className="font-medium">{display}</strong>
      </span>
    </div>
  )
}
