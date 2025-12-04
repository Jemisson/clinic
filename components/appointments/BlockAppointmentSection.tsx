'use client'

import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { buildDateTime } from '../event-calendar/event-create-dialog'
import { AppointmentFormValues } from './form/appointment-form-schema'

export function BlockAppointmentSection() {
  const { watch, setValue } = useFormContext<AppointmentFormValues>()

  const date = watch('date')
  const startTime = watch('startTime')
  const durationMinutes = watch('durationMinutes') ?? 30

  const repeatEnabled = watch('repeatEnabled') ?? false
  const repeatEndDate = watch('repeatEndDate')
  const repeatDays = watch('repeatDays') ?? []

  const effectiveDate = date || format(new Date(), 'yyyy-MM-dd')

  const endTime = format(
    new Date(
      buildDateTime(effectiveDate, startTime).getTime() +
        durationMinutes * 60 * 1000,
    ),
    'HH:mm',
  )

  const handleDateChange = (value: string) => {
    setValue('date', value)
  }

  const handleStartTimeChange = (value: string) => {
    setValue('startTime', value)
  }

  const handleDurationChange = (value: number) => {
    setValue('durationMinutes', value)
  }

  const handleRepeatEnabledChange = (value: boolean) => {
    setValue('repeatEnabled', value)
  }

  const handleRepeatEndDateChange = (value: string) => {
    setValue('repeatEndDate', value || null)
  }

  const handleToggleRepeatDay = (day: string) => {
    const current = watch('repeatDays') ?? []
    const exists = current.includes(day)

    const next = exists
      ? current.filter((d: string) => d !== day)
      : [...current, day]

    setValue('repeatDays', next)
  }

  return (
    <>
      <Separator className="my-4" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração</Label>
              <Select
                value={durationMinutes.toString()}
                onValueChange={(value) =>
                  handleDurationChange(parseInt(value, 10))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1h</SelectItem>
                  <SelectItem value="90">1h30</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>De</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Até</Label>
            <Input
              type="time"
              value={endTime}
              readOnly
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Switch
                checked={repeatEnabled}
                onCheckedChange={handleRepeatEnabledChange}
              />
              Adicionar repetição
            </Label>
          </div>

          {repeatEnabled && (
            <>
              <div className="space-y-2">
                <Label>Data final</Label>
                <Input
                  type="date"
                  value={repeatEndDate ?? ''}
                  onChange={(e) => handleRepeatEndDateChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Repetir em</Label>
                <div className="flex flex-wrap gap-2">
                  {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map(
                    (day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleRepeatDay(day)}
                        className={cn(
                          'h-8 rounded-full border px-3 text-xs font-medium',
                          repeatDays.includes(day)
                            ? 'bg-black text-white'
                            : 'bg-white text-black',
                        )}
                      >
                        {day}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
