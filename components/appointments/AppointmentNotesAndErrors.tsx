'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface NotesProps {
  notes: string
  onNotesChange: (value: string) => void
}

interface ValidationProps {
  validationErrors: string[]
  submitError: string | null
}

export function AppointmentNotesSection({ notes, onNotesChange }: NotesProps) {
  return (
    <div className="mt-4 space-y-2">
      <Label>Observações</Label>
      <Textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={4}
        placeholder="Anotações gerais sobre o agendamento"
      />
    </div>
  )
}

export function AppointmentValidationSummary({
  validationErrors,
  submitError,
}: ValidationProps) {
  if (validationErrors.length === 0 && !submitError) return null

  return (
    <div className="mt-3 space-y-2">
      {validationErrors.length > 0 && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {validationErrors.map((err) => (
            <div key={err}>• {err}</div>
          ))}
        </div>
      )}

      {submitError && (
        <div className="text-xs text-destructive">{submitError}</div>
      )}
    </div>
  )
}
