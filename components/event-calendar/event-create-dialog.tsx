'use client'

import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useEventCalendarStore } from '@/hooks/use-event'
import AppointmentService from '@/service/appointment-service'
import {
  AppointmentCreateRequest,
  AppointmentKind,
  AppointmentStatus,
} from '@/types/appointment'
import {
  AppointmentNotesSection,
  AppointmentValidationSummary,
} from '../appointments/AppointmentNotesAndErrors'
import { BlockAppointmentSection } from '../appointments/BlockAppointmentSection'
import { ConsultationAppointmentSection } from '../appointments/ConsultationAppointmentSection'
import { EventTypeDoctorSection } from '../appointments/EventTypeDoctorSection'

type SelectOption = { id: number; name: string }

const MOCK_USERS: SelectOption[] = [{ id: 1, name: 'Dra. Geisa Garcia' }]

const MOCK_FACILITIES: SelectOption[] = [
  { id: 1, name: 'Sala 01' },
  { id: 2, name: 'Sala 02' },
]

export function buildDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, minute] = timeStr.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

function formatDateForInput(date: Date | null): string {
  if (!date) return ''
  return format(date, 'yyyy-MM-dd')
}

export function EventCreateDialog() {
  const { isQuickAddDialogOpen, closeQuickAddDialog, quickAddData } =
    useEventCalendarStore(
      useShallow((state) => ({
        isQuickAddDialogOpen: state.isQuickAddDialogOpen,
        closeQuickAddDialog: state.closeQuickAddDialog,
        quickAddData: state.quickAddData,
      })),
    )

  const [kind, setKind] = useState<AppointmentKind>('consultation')
  const [status] = useState<AppointmentStatus>('scheduled')

  // Campos comuns
  const [date, setDate] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('12:00')
  const [durationMinutes, setDurationMinutes] = useState<number>(30)
  const [notes, setNotes] = useState<string>('')

  // Consulta / procedimento
  const [patientId, setPatientId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [informFacility, setInformFacility] = useState<boolean>(false)
  const [facilityItemId, setFacilityItemId] = useState<string>('')

  const [firstVisit, setFirstVisit] = useState<boolean>(false)
  const [isReturn, setIsReturn] = useState<boolean>(false)
  const [aestheticEvaluation, setAestheticEvaluation] = useState<boolean>(false)
  const [onlineBooking, setOnlineBooking] = useState<boolean>(false)
  const [onlineBookingLink, setOnlineBookingLink] = useState<string>('')

  // Bloqueio / repetição
  const [repeatEnabled, setRepeatEnabled] = useState<boolean>(false)
  const [repeatEndDate, setRepeatEndDate] = useState<string>('')
  const [repeatDays, setRepeatDays] = useState<string[]>(['seg', 'qua', 'sex'])

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!isQuickAddDialogOpen) return

    setKind('consultation')
    setSubmitError(null)

    const baseDate = quickAddData.date ?? new Date()
    setDate(formatDateForInput(baseDate))

    if (quickAddData.startTime) {
      setStartTime(quickAddData.startTime)
    } else {
      const now = new Date()
      const minutes = now.getMinutes()
      const roundedMinutes = minutes < 30 ? 0 : 30
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(roundedMinutes).padStart(2, '0')
      setStartTime(`${hh}:${mm}`)
    }

    if (quickAddData.endTime && quickAddData.startTime) {
      const [sh, sm] = quickAddData.startTime.split(':').map(Number)
      const [eh, em] = quickAddData.endTime.split(':').map(Number)
      const diff = eh * 60 + em - (sh * 60 + sm)
      setDurationMinutes(diff > 0 ? diff : 30)
    } else {
      setDurationMinutes(30)
    }

    setPatientId(null)
    setUserId(MOCK_USERS[0]?.id.toString() ?? '')
    setInformFacility(false)
    setFacilityItemId(MOCK_FACILITIES[0]?.id.toString() ?? '')

    setFirstVisit(false)
    setIsReturn(false)
    setAestheticEvaluation(false)
    setOnlineBooking(false)
    setOnlineBookingLink('')

    setRepeatEnabled(false)
    setRepeatEndDate('')
    setRepeatDays(['seg', 'qua', 'sex'])

    setNotes('')
  }, [isQuickAddDialogOpen, quickAddData])

  const validationErrors = useMemo(() => {
    const errors: string[] = []

    if (!date) errors.push('Data é obrigatória.')
    if (!startTime) errors.push('Horário de início é obrigatório.')
    if (!userId) errors.push('Médico(a) é obrigatório.')

    if (kind === 'consultation' || kind === 'procedure') {
      if (!patientId) errors.push('Paciente é obrigatório.')
    }

    if (informFacility && !facilityItemId) {
      errors.push(
        'Sala de atendimento é obrigatória quando o campo está habilitado.',
      )
    }

    if (!durationMinutes || durationMinutes <= 0) {
      errors.push('Duração deve ser maior que zero.')
    }

    if (kind === 'block' && repeatEnabled) {
      if (!repeatEndDate) {
        errors.push('Data final é obrigatória para bloqueio com repetição.')
      }
      if (repeatDays.length === 0) {
        errors.push('Selecione ao menos um dia para repetição.')
      }
    }

    return errors
  }, [
    date,
    startTime,
    userId,
    patientId,
    informFacility,
    facilityItemId,
    durationMinutes,
    kind,
    repeatEnabled,
    repeatEndDate,
    repeatDays,
  ])

  const isSubmitDisabled = validationErrors.length > 0 || isSubmitting
  const isConsultationLike = kind === 'consultation' || kind === 'procedure'

  const handleToggleRepeatDay = (day: string) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  const handleSubmit = async () => {
    if (isSubmitDisabled) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const start = buildDateTime(date, startTime)
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000)

      const patientIdValue =
        kind === 'consultation' || kind === 'procedure' ? patientId : null

      const payload: AppointmentCreateRequest = {
        appointment: {
          patient_id: patientIdValue ? Number(patientIdValue) : null,
          user_id: Number(userId),
          facility_item_id: informFacility ? Number(facilityItemId) : null,
          kind,
          status,
          starts_at: start.toISOString(),
          ends_at: end.toISOString(),
          duration_minutes: durationMinutes,
          first_visit: kind === 'consultation' ? firstVisit : false,
          is_return: kind === 'consultation' ? isReturn : false,
          aesthetic_evaluation:
            kind === 'consultation' || kind === 'procedure'
              ? aestheticEvaluation
              : false,
          online_booking:
            kind === 'consultation' || kind === 'procedure'
              ? onlineBooking
              : false,
          online_booking_link:
            kind === 'consultation' || kind === 'procedure'
              ? onlineBookingLink || null
              : null,
          notes: notes || null,
          ...(kind === 'block' && repeatEnabled
            ? {
                repeat_options: {
                  end_date: repeatEndDate || null,
                  days: repeatDays,
                },
              }
            : {}),
        },
      }

      await AppointmentService.create(payload)
      closeQuickAddDialog()
    } catch (error: unknown) {
      console.error(error)
      setSubmitError(
        'Não foi possível salvar o agendamento. Tente novamente mais tarde.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isQuickAddDialogOpen}
      onOpenChange={(open) => {
        if (!open) closeQuickAddDialog()
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader className="mb-4">
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo agendamento.
          </DialogDescription>
        </DialogHeader>

        <EventTypeDoctorSection
          kind={kind}
          onKindChange={setKind}
          userId={userId}
          onUserChange={setUserId}
        />

        {isConsultationLike ? (
          <ConsultationAppointmentSection
            kind={kind}
            date={date}
            onDateChange={setDate}
            startTime={startTime}
            onStartTimeChange={setStartTime}
            durationMinutes={durationMinutes}
            onDurationChange={setDurationMinutes}
            patientId={patientId}
            onPatientChange={setPatientId}
            firstVisit={firstVisit}
            onFirstVisitChange={setFirstVisit}
            isReturn={isReturn}
            onIsReturnChange={setIsReturn}
            aestheticEvaluation={aestheticEvaluation}
            onAestheticEvaluationChange={setAestheticEvaluation}
            onlineBooking={onlineBooking}
            onOnlineBookingChange={setOnlineBooking}
            onlineBookingLink={onlineBookingLink}
            onOnlineBookingLinkChange={setOnlineBookingLink}
            informFacility={informFacility}
            onInformFacilityChange={setInformFacility}
            facilityItemId={facilityItemId}
            onFacilityItemIdChange={setFacilityItemId}
            facilities={MOCK_FACILITIES}
          />
        ) : (
          <BlockAppointmentSection
            date={date}
            onDateChange={setDate}
            startTime={startTime}
            onStartTimeChange={setStartTime}
            durationMinutes={durationMinutes}
            onDurationChange={setDurationMinutes}
            repeatEnabled={repeatEnabled}
            onRepeatEnabledChange={setRepeatEnabled}
            repeatEndDate={repeatEndDate}
            onRepeatEndDateChange={setRepeatEndDate}
            repeatDays={repeatDays}
            onToggleRepeatDay={handleToggleRepeatDay}
          />
        )}

        <AppointmentNotesSection
          notes={notes}
          onNotesChange={setNotes}
        />

        <AppointmentValidationSummary
          validationErrors={validationErrors}
          submitError={submitError}
        />

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            type="button"
            onClick={closeQuickAddDialog}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
