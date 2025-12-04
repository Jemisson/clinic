'use client'

import { useFormContext } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AppointmentFormValues } from './form/appointment-form-schema'

type AppointmentValidationSummaryProps = {
  validationErrors: string[]
  submitError: string | null
}

export function AppointmentNotesSection() {
  const { register } = useFormContext<AppointmentFormValues>()

  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Observações</Label>
      <Textarea
        id="notes"
        placeholder="Anotações importantes sobre o atendimento..."
        {...register('notes')}
      />
    </div>
  )
}

export function AppointmentValidationSummary({
  validationErrors,
  submitError,
}: AppointmentValidationSummaryProps) {
  if (validationErrors.length === 0 && !submitError) return null

  return (
    <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
      {submitError && <div>{submitError}</div>}

      {validationErrors.length > 0 && (
        <ul className="list-inside list-disc">
          {validationErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
