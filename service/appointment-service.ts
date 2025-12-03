import api from './api'
import {
  AppointmentCreateRequest,
  AppointmentCreateResponse,
} from '@/types/appointment'

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
}

export default AppointmentService
