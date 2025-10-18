import api from "./api"
import {
  CreateOrUpdatePatientPhotoInput,
  ExtraUpload,
  PatientPhotoShowResponse,
  PatientPhotosGroupedResponse,
} from "@/types/patients.photos"
import {
  buildPatientPhotoFormData,
  buildPatientPhotoFormDataForUpdate,
} from "@/utils/patient-photo-formdata"

const RESOURCE = (patientId: string | number) => `/patients/${patientId}/patient_photos`

export const PatientPhotosService = {
  list: async (
    patientId: string | number,
    params: { page?: number; per_page?: number } = {},
  ) => {
    const { data } = await api.get<PatientPhotosGroupedResponse>(RESOURCE(patientId), { params })
    return { data: data.data, meta: data.meta }
  },

  show: async (patientId: string | number, id: string | number) => {
    const response = await api.get<PatientPhotoShowResponse>(`${RESOURCE(patientId)}/${id}`)
    return response.data.data
  },

  create: async (patientId: string | number, values: CreateOrUpdatePatientPhotoInput, extra?: ExtraUpload) => {
    const formData = buildPatientPhotoFormData(values, extra)
    const { data } = await api.post(RESOURCE(patientId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },

  update: async (patientId: string | number, id: string | number, values: CreateOrUpdatePatientPhotoInput, extra?: ExtraUpload) => {
    const formData = buildPatientPhotoFormDataForUpdate(values, extra)
    const { data } = await api.put(`${RESOURCE(patientId)}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },

  destroy: async (patientId: string | number, id: string | number) => {
    await api.delete(`${RESOURCE(patientId)}/${id}`)
  },
}

export default PatientPhotosService
