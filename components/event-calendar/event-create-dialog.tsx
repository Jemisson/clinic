'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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
  AppointmentForEdit,
  AppointmentKind,
} from '@/types/appointment'

import {
  appointmentFormSchema,
  AppointmentFormValues,
} from '../appointments/form/appointment-form-schema'

import { buildDefaultValues } from '../appointments/form/appointment-form-defaults'

import { AppointmentNotesSection, AppointmentValidationSummary } from '../appointments/AppointmentNotesAndErrors'
import { ConsultationAppointmentSection } from '../appointments/ConsultationAppointmentSection'
import { BlockAppointmentSection } from '../appointments/BlockAppointmentSection'
import { EventTypeDoctorSection } from '../appointments/EventTypeDoctorSection'

// helper
export function buildDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, minute] = timeStr.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

type EventCreateDialogProps = {}

export function EventCreateDialog({}: EventCreateDialogProps) {
  const {
    isQuickAddDialogOpen,
    closeQuickAddDialog,
    quickAddData,
    formMode,
    appointmentToEdit,
  } = useEventCalendarStore(
    useShallow((state) => ({
      isQuickAddDialogOpen: state.isQuickAddDialogOpen,
      closeQuickAddDialog: state.closeQuickAddDialog,
      quickAddData: state.quickAddData,
      formMode: state.formMode,
      appointmentToEdit: state.appointmentToEdit,
    })),
  )

  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    mode: 'onChange',
    defaultValues: buildDefaultValues(
      quickAddData,
      formMode,
      appointmentToEdit,
    ),
  })

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = form

  const kind = watch('kind')
  const isConsultationLike = kind === 'consultation' || kind === 'procedure'

  useEffect(() => {
    if (!isQuickAddDialogOpen) return

    setSubmitError(null)

    reset(
      buildDefaultValues(quickAddData, formMode, appointmentToEdit),
      { keepDefaultValues: false },
    )
  }, [isQuickAddDialogOpen, quickAddData, formMode, appointmentToEdit, reset])

  const isSubmitDisabled = !isValid || isSubmitting

  // ------------------------------
  //  SUBMIT (CREATE or UPDATE)
  // ------------------------------
  const onSubmit = async (values: AppointmentFormValues) => {
    try {
      setSubmitError(null)

      const start = buildDateTime(values.date, values.startTime)
      const end = new Date(start.getTime() + values.durationMinutes * 60 * 1000)

      const isConsultationLikeLocal =
        values.kind === 'consultation' || values.kind === 'procedure'

      const payload: AppointmentCreateRequest = {
        appointment: {
          patient_id:
            isConsultationLikeLocal && values.patientId
              ? Number(values.patientId)
              : null,
          user_id: Number(values.userId),
          facility_item_id:
            values.informFacility && values.facilityItemId
              ? Number(values.facilityItemId)
              : null,
          kind: values.kind,
          status: values.status,
          starts_at: start.toISOString(),
          ends_at: end.toISOString(),
          duration_minutes: values.durationMinutes,
          first_visit:
            values.kind === 'consultation' ? values.firstVisit ?? false : false,
          is_return:
            values.kind === 'consultation' ? values.isReturn ?? false : false,
          aesthetic_evaluation:
            isConsultationLikeLocal ? values.aestheticEvaluation ?? false : false,
          online_booking:
            isConsultationLikeLocal ? values.onlineBooking ?? false : false,
          online_booking_link:
            isConsultationLikeLocal ? values.onlineBookingLink || null : null,
          notes: values.notes || null,
          ...(values.kind === 'block' && values.repeatEnabled
            ? {
                repeat_options: {
                  end_date: values.repeatEndDate || null,
                  days: values.repeatDays || [],
                },
              }
            : {}),
        },
      }

      if (formMode === 'edit' && appointmentToEdit) {
        await AppointmentService.update(appointmentToEdit.id, payload)
      } else {
        await AppointmentService.create(payload)
      }

      closeQuickAddDialog()
    } catch (error) {
      console.error(error)
      setSubmitError(
        'Não foi possível salvar o agendamento. Tente novamente mais tarde.',
      )
    }
  }

  const validationErrors = useMemo(() => {
    const msgs: string[] = []
    Object.values(errors).forEach((err) => {
      if (err?.message) msgs.push(String(err.message))
    })
    return msgs
  }, [errors])

  return (
    <Dialog
      open={isQuickAddDialogOpen}
      onOpenChange={(open) => {
        if (!open) closeQuickAddDialog()
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader className="mb-4">
          <DialogTitle>
            {formMode === 'edit'
              ? 'Editar Agendamento'
              : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para{' '}
            {formMode === 'edit' ? 'editar' : 'criar'} um agendamento.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <EventTypeDoctorSection
              kind={kind as AppointmentKind}
              onKindChange={(k) => form.setValue('kind', k)}
              userId={watch('userId')}
              onUserChange={(id) => form.setValue('userId', id)}
            />

            {isConsultationLike ? (
              <ConsultationAppointmentSection facilities={[]} />
            ) : (
              <BlockAppointmentSection />
            )}

            <AppointmentNotesSection />

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

              <Button type="submit" disabled={isSubmitDisabled}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {formMode === 'edit' ? 'Salvar alterações' : 'Agendar'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
