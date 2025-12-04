'use client'

import { format } from 'date-fns'
import { Controller, useFormContext } from 'react-hook-form'

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

import { PatientSearchField } from '../appointments/patient-search-field'
import { buildDateTime } from '../event-calendar/event-create-dialog'
import { AppointmentFormValues } from './form/appointment-form-schema'

type SelectOption = { id: number; name: string }

interface Props {
  facilities: SelectOption[]
}

export function ConsultationAppointmentSection({ facilities }: Props) {
  const { control, watch, setValue } = useFormContext<AppointmentFormValues>()

  const kind = watch('kind')
  const date = watch('date')
  const startTime = watch('startTime')
  const durationMinutes = watch('durationMinutes')
  const patientId = watch('patientId')

  const effectiveDate = date || format(new Date(), 'yyyy-MM-dd')
  const endTime = format(
    new Date(
      buildDateTime(effectiveDate, startTime).getTime() +
        durationMinutes * 60 * 1000,
    ),
    'HH:mm',
  )

  const isConsultation = kind === 'consultation'

  return (
    <>
      <Separator className="my-4" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <PatientSearchField
              label="Paciente"
              value={patientId}
              onChange={(id) => setValue('patientId', id)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Controller
                name="durationMinutes"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(parseInt(value, 10))
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
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>De</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Input
                    type="time"
                    {...field}
                  />
                )}
              />
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
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Controller
                  name="firstVisit"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                Primeira consulta
              </Label>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Controller
                  name="isReturn"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                Retorno
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Controller
                  name="aestheticEvaluation"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                Avaliação estética
              </Label>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Controller
                  name="onlineBooking"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                Agendamento online
              </Label>
              {watch('onlineBooking') && (
                <Controller
                  name="onlineBookingLink"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Link da videochamada"
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Controller
                name="informFacility"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              Informar sala de atendimento
            </Label>
            {watch('informFacility') && (
              <Controller
                name="facilityItemId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((f) => (
                        <SelectItem
                          key={f.id}
                          value={f.id.toString()}
                        >
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>

          {isConsultation && (
            <p className="text-xs text-muted-foreground">
              Para retornos, você poderá futuramente vincular à consulta
              original.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
