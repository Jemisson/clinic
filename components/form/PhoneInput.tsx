'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import InputMask from 'react-input-mask'

type PhoneInputProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function PhoneInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = '(00) 0 0000-0000',
  disabled,
  className,
}: PhoneInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const raw = (field.value ?? '').toString().replace(/\D/g, '')
        const mask = raw.length > 10 ? '(99) 9 9999-9999' : '(99) 9999-9999'

        return (
          <div className={cn('flex flex-col gap-2', className)}>
            {label && <Label htmlFor={name as string}>{label}</Label>}

            <InputMask
              mask={mask}
              value={field.value ?? ''}
              onChange={field.onChange}
              disabled={disabled}
            >
              {(inputProps: any) => (
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
        )
      }}
    />
  )
}
