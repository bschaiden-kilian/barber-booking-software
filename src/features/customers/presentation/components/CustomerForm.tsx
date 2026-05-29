import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/FormField'

const schema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().min(6, 'Telefonnummer muss mindestens 6 Zeichen lang sein'),
})

type FormValues = z.infer<typeof schema>

interface CustomerFormProps {
  onSubmit: (data: FormValues) => void
  submitting: boolean
  error?: string
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  )
}

export function CustomerForm({ onSubmit, submitting, error }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField
        label="Name"
        required
        error={errors.name?.message}
        placeholder="Max Mustermann"
        {...register('name')}
      />
      <FormField
        label="E-Mail"
        type="email"
        required
        error={errors.email?.message}
        placeholder="max@beispiel.at"
        {...register('email')}
      />
      <FormField
        label="Telefon"
        type="tel"
        required
        error={errors.phone?.message}
        placeholder="+43 676 1234567"
        {...register('phone')}
      />
      {error && (
        <p className="font-dm-mono text-xs text-red-500">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className={[
          'mt-2 flex h-15 w-full items-center justify-center gap-3 rounded-[18px]',
          'font-dm-sans text-base font-medium uppercase tracking-[0.06em] transition-all duration-150',
          submitting
            ? 'cursor-not-allowed bg-app-surface text-app-accent opacity-60'
            : 'cursor-pointer bg-app-primary text-app-background shadow-[0_14px_26px_-12px_rgba(102,73,48,0.7)] active:translate-y-0.5',
        ].join(' ')}
      >
        {submitting && (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        Termin bestätigen
        {!submitting && <ArrowRightIcon />}
      </button>
    </form>
  )
}
