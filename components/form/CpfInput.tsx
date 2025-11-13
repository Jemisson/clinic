'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import InputMask from 'react-input-mask'

type CpfInputProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CpfInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = '000.000.000-00',
  disabled,
  className,
}: CpfInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-2', className)}>
          {label && <Label htmlFor={name as string}>{label}</Label>}

          <InputMask
            mask="999.999.999-99"
            value={field.value ?? ''}
            onChange={field.onChange}
            disabled={disabled}
          >
            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
              <Input
                {...inputProps}
                id={name as string}
                placeholder={placeholder}
              />
            )}
          </InputMask>

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
