'use client'

import { format } from 'date-fns'

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

interface Props {
  date: string
  onDateChange: (value: string) => void
  startTime: string
  onStartTimeChange: (value: string) => void
  durationMinutes: number
  onDurationChange: (value: number) => void
  repeatEnabled: boolean
  onRepeatEnabledChange: (value: boolean) => void
  repeatEndDate: string
  onRepeatEndDateChange: (value: string) => void
  repeatDays: string[]
  onToggleRepeatDay: (day: string) => void
}

export function BlockAppointmentSection({
  date,
  onDateChange,
  startTime,
  onStartTimeChange,
  durationMinutes,
  onDurationChange,
  repeatEnabled,
  onRepeatEnabledChange,
  repeatEndDate,
  onRepeatEndDateChange,
  repeatDays,
  onToggleRepeatDay,
}: Props) {
  const effectiveDate = date || format(new Date(), 'yyyy-MM-dd')
  const endTime = format(
    new Date(
      buildDateTime(effectiveDate, startTime).getTime() +
        durationMinutes * 60 * 1000,
    ),
    'HH:mm',
  )

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
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração</Label>
              <Select
                value={durationMinutes.toString()}
                onValueChange={(value) => onDurationChange(parseInt(value, 10))}
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
                onChange={(e) => onStartTimeChange(e.target.value)}
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
                onCheckedChange={onRepeatEnabledChange}
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
                  value={repeatEndDate}
                  onChange={(e) => onRepeatEndDateChange(e.target.value)}
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
                        onClick={() => onToggleRepeatDay(day)}
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
