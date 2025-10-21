'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Controller,
  type FieldPath,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import type { PatientFormValues } from '../schema'

export function StepContact() {
  const { control, register } = useFormContext<PatientFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'person.contacts_attributes' as const,
  })

  return (
    <div className="flex flex-col gap-4">
      {fields.map((f, idx) => (
        <div
          key={f.id}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 border rounded p-3"
        >
          <div>
            <Label>Telefone</Label>
            <Input
              {...register(`person.contacts_attributes.${idx}.phone` as const)}
            />
          </div>

          <div>
            <Label>Celular</Label>
            <Input
              {...register(
                `person.contacts_attributes.${idx}.cellphone` as const,
              )}
            />
          </div>

          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
            {(
              [
                'send_sms',
                'send_wpp_confirmation',
                'send_wpp_marketing',
                'send_wpp_congrats',
                'send_email_appointment',
                'send_email_marketing',
              ] as const
            ).map((field) => {
              const name =
                `person.contacts_attributes.${idx}.${field}` as FieldPath<PatientFormValues>

              const labelMap: Record<typeof field, string> = {
                send_sms: 'SMS',
                send_wpp_confirmation: 'WhatsApp Confirmação',
                send_wpp_marketing: 'WhatsApp Marketing',
                send_wpp_congrats: 'WhatsApp Parabéns',
                send_email_appointment: 'Email Agendamento',
                send_email_marketing: 'Email Marketing',
              }

              return (
                <label
                  key={field}
                  className="flex items-center gap-2 text-sm"
                >
                  <Controller<PatientFormValues>
                    name={name}
                    control={control}
                    render={({ field: f }) => (
                      <Switch
                        checked={!!f.value}
                        onCheckedChange={f.onChange}
                      />
                    )}
                  />
                  {labelMap[field]}
                </label>
              )
            })}
          </div>

          <div className="md:col-span-3 flex justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(idx)}
            >
              Remover
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            phone: '',
            cellphone: '',
            send_sms: false,
            send_wpp_confirmation: false,
            send_wpp_marketing: false,
            send_wpp_congrats: false,
            send_email_appointment: false,
            send_email_marketing: false,
            _destroy: false,
          })
        }
      >
        Adicionar contato
      </Button>
    </div>
  )
}
