export const appointmentKindValues = [
  'consultation',
  'procedure',
  'block',
  'budget',
] as const

export const appointmentStatusValues = [
  'scheduled',
  'confirmed',
  'canceled',
  'no_show',
] as const

export type AppointmentKind = (typeof appointmentKindValues)[number]

export type AppointmentStatus = (typeof appointmentStatusValues)[number]

export interface AppointmentAttributes {
  id: number
  kind: AppointmentKind
  status: AppointmentStatus
  title: string
  start: string
  end: string
}

export interface AppointmentEventResponse {
  id: string
  type: 'event'
  attributes: AppointmentAttributes
}

export interface AppointmentEventsApiResponse {
  data: AppointmentEventResponse[]
}

export interface AppointmentRepeatOptions {
  end_date: string | null
  days: string[]
}

export interface AppointmentCreatePayload {
  patient_id: number | null
  user_id: number
  facility_item_id: number | null
  kind: AppointmentKind
  status: AppointmentStatus
  starts_at: string
  ends_at: string
  duration_minutes: number
  first_visit: boolean
  is_return: boolean
  aesthetic_evaluation: boolean
  online_booking: boolean
  online_booking_link: string | null
  notes: string | null
  repeat_options?: AppointmentRepeatOptions
}

export interface AppointmentCreateRequest {
  appointment: AppointmentCreatePayload
}

export type AppointmentCreateResponse = unknown

export interface QuickAddData {
  date?: Date | null
  startTime?: string | null
  endTime?: string | null
}

export interface AppointmentForEdit {
  id: number
  kind: AppointmentKind
  status: AppointmentStatus
  starts_at: string
  ends_at: string
  duration_minutes: number
  patient_id: number | null
  user_id: number
  facility_item_id: number | null
  first_visit: boolean
  is_return: boolean
  aesthetic_evaluation: boolean
  online_booking: boolean
  online_booking_link: string | null
  notes: string | null
  repeat_options?: {
    end_date: string | null
    days: string[]
  } | null
}
