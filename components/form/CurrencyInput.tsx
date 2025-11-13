'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

type CurrencyInputProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CurrencyInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = 'Ex: 150,50',
  disabled,
  className,
}: CurrencyInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-2', className)}>
          {label && <Label htmlFor={name as string}>{label}</Label>}

          <NumericFormat
            id={name as string}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            allowNegative={false}
            customInput={Input}
            disabled={disabled}
            placeholder={placeholder}
            value={field.value ?? ''}
            onValueChange={(values) => {
              const { floatValue } = values
              field.onChange(floatValue != null ? floatValue.toFixed(2) : '')
            }}
          />

          {fieldState.error?.message && (
            <span className="text-xs text-destructive">
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  )
}
