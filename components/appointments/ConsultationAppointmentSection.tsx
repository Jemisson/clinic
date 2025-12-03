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

import { AppointmentKind } from '@/types/appointment'
import { PatientSearchField } from '../appointments/patient-search-field'
import { buildDateTime } from '../event-calendar/event-create-dialog'

type SelectOption = { id: number; name: string }

interface Props {
  kind: AppointmentKind
  date: string
  onDateChange: (value: string) => void
  startTime: string
  onStartTimeChange: (value: string) => void
  durationMinutes: number
  onDurationChange: (value: number) => void
  patientId: string | null
  onPatientChange: (id: string | null) => void
  firstVisit: boolean
  onFirstVisitChange: (value: boolean) => void
  isReturn: boolean
  onIsReturnChange: (value: boolean) => void
  aestheticEvaluation: boolean
  onAestheticEvaluationChange: (value: boolean) => void
  onlineBooking: boolean
  onOnlineBookingChange: (value: boolean) => void
  onlineBookingLink: string
  onOnlineBookingLinkChange: (value: string) => void
  informFacility: boolean
  onInformFacilityChange: (value: boolean) => void
  facilityItemId: string
  onFacilityItemIdChange: (value: string) => void
  facilities: SelectOption[]
}

export function ConsultationAppointmentSection({
  kind,
  date,
  onDateChange,
  startTime,
  onStartTimeChange,
  durationMinutes,
  onDurationChange,
  patientId,
  onPatientChange,
  firstVisit,
  onFirstVisitChange,
  isReturn,
  onIsReturnChange,
  aestheticEvaluation,
  onAestheticEvaluationChange,
  onlineBooking,
  onOnlineBookingChange,
  onlineBookingLink,
  onOnlineBookingLinkChange,
  informFacility,
  onInformFacilityChange,
  facilityItemId,
  onFacilityItemIdChange,
  facilities,
}: Props) {
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
              onChange={onPatientChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
              />
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>De</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
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
                <Switch
                  checked={firstVisit}
                  onCheckedChange={onFirstVisitChange}
                />
                Primeira consulta
              </Label>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Switch
                  checked={isReturn}
                  onCheckedChange={onIsReturnChange}
                />
                Retorno
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Switch
                  checked={aestheticEvaluation}
                  onCheckedChange={onAestheticEvaluationChange}
                />
                Avaliação estética
              </Label>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Switch
                  checked={onlineBooking}
                  onCheckedChange={onOnlineBookingChange}
                />
                Agendamento online
              </Label>
              {onlineBooking && (
                <Input
                  placeholder="Link da videochamada"
                  value={onlineBookingLink}
                  onChange={(e) => onOnlineBookingLinkChange(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Switch
                checked={informFacility}
                onCheckedChange={onInformFacilityChange}
              />
              Informar sala de atendimento
            </Label>
            {informFacility && (
              <Select
                value={facilityItemId}
                onValueChange={onFacilityItemIdChange}
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
