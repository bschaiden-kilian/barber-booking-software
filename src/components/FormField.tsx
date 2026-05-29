import { forwardRef, type InputHTMLAttributes } from 'react'
import { Label } from './Label'
import { Input } from './Input'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, id, required, ...inputProps }, ref) {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <Input ref={ref} id={fieldId} error={error} required={required} {...inputProps} />
      </div>
    )
  },
)
