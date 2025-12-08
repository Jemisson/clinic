import {
  AppointmentCreateRequest,
  AppointmentCreateResponse,
  AppointmentForEdit,
} from '@/types/appointment'
import api from './api'

const RESOURCE = '/appointments'

export const AppointmentService = {
  create: async (
    payload: AppointmentCreateRequest,
  ): Promise<AppointmentCreateResponse> => {
    const { data } = await api.post<AppointmentCreateResponse>(
      RESOURCE,
      payload,
    )
    return data
  },

  show: async (id: number): Promise<AppointmentForEdit> => {
    const { data } = await api.get<{
      data: { id: string; type: string; attributes: any }
    }>(`${RESOURCE}/${id}`)

    const a = data.data.attributes

    return {
      id: Number(data.data.id),
      kind: a.kind,
      status: a.status,
      starts_at: a.starts_at,
      ends_at: a.ends_at,
      duration_minutes: a.duration_minutes,
      patient_id: a.patient_id,
      user_id: a.user_id,
      facility_item_id: a.facility_item_id,
      first_visit: a.first_visit,
      is_return: a.is_return,
      aesthetic_evaluation: a.aesthetic_evaluation,
      online_booking: a.online_booking,
      online_booking_link: a.online_booking_link,
      notes: a.notes,
      repeat_options: a.repeat_options ?? null,
    }
  },

  update: async (
    id: number,
    payload: AppointmentCreateRequest,
  ): Promise<AppointmentCreateResponse> => {
    const { data } = await api.put<AppointmentCreateResponse>(
      `${RESOURCE}/${id}`,
      payload,
    )
    return data
  },
}

export default AppointmentService
