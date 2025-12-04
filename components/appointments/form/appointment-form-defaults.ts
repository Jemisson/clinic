import { AppointmentForEdit, QuickAddData } from '@/types/appointment'
import { format } from 'date-fns'
import { AppointmentFormValues } from './appointment-form-schema'

export function buildDefaultValues(
  quickAddData: QuickAddData | null,
  mode: 'create' | 'edit',
  appointment?: AppointmentForEdit | null,
): AppointmentFormValues {
  if (mode === 'edit' && appointment) {
    const startDate = new Date(appointment.starts_at)

    return {
      kind: appointment.kind,
      status: appointment.status || 'scheduled',

      date: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      durationMinutes: appointment.duration_minutes,

      userId: String(appointment.user_id),
      patientId: appointment.patient_id ? String(appointment.patient_id) : null,

      firstVisit: appointment.first_visit,
      isReturn: appointment.is_return,
      aestheticEvaluation: appointment.aesthetic_evaluation,

      onlineBooking: appointment.online_booking,
      onlineBookingLink: appointment.online_booking_link ?? '',

      informFacility: !!appointment.facility_item_id,
      facilityItemId: appointment.facility_item_id
        ? String(appointment.facility_item_id)
        : null,

      repeatEnabled: !!appointment.repeat_options,
      repeatEndDate: appointment.repeat_options?.end_date ?? null,
      repeatDays: appointment.repeat_options?.days ?? [],

      notes: appointment.notes ?? '',
    }
  }

  const baseDate = quickAddData?.date ?? new Date()
  const dateStr = format(baseDate, 'yyyy-MM-dd')

  let startTime = quickAddData?.startTime
  let durationMinutes = 30

  if (quickAddData?.startTime && quickAddData?.endTime) {
    const [sh, sm] = quickAddData.startTime.split(':').map(Number)
    const [eh, em] = quickAddData.endTime.split(':').map(Number)
    const diff = eh * 60 + em - (sh * 60 + sm)
    durationMinutes = diff > 0 ? diff : 30
  } else {
    const now = new Date()
    const minutes = now.getMinutes()
    const roundedMinutes = minutes < 30 ? 0 : 30
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(roundedMinutes).padStart(2, '0')
    startTime = `${hh}:${mm}`
  }

  return {
    kind: 'consultation',
    status: 'scheduled',

    date: dateStr,
    startTime: startTime ?? '12:00',
    durationMinutes,

    userId: '',
    patientId: null,

    firstVisit: false,
    isReturn: false,
    aestheticEvaluation: false,

    onlineBooking: false,
    onlineBookingLink: '',

    informFacility: false,
    facilityItemId: null,

    repeatEnabled: false,
    repeatEndDate: null,
    repeatDays: [],

    notes: '',
  }
}
