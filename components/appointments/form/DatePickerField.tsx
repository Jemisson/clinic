// components/form/DatePickerField.tsx
'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

type DatePickerFieldProps = {
  name: string
  label: string
}

export function DatePickerField({ name, label }: DatePickerFieldProps) {
  const { control } = useFormContext()

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedDate = field.value ? parseISO(field.value) : undefined

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (!date) return
                    field.onChange(format(date, 'yyyy-MM-dd'))
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )
        }}
      />
    </div>
  )
}
