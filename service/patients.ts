import {
  PatientResponse,
  PatientShowResponse,
  PatientUpsertInput
} from '@/types/patients';
import api from './api';
import {
  buildPatientFormData,
  buildPatientFormDataForUpdate
} from '@/utils/patient-formdata';

type ExtraUpload = Record<string, File | Blob | string | number | boolean | null | undefined>

const RESOURCE = '/patients';

export const PatientsService = {
  list: async (
    params: { page?: number; per_page?: number; q?: string; t?: string } = {}
  ) => {
    const { data } = await api.get<PatientResponse>(RESOURCE, { params });
    return { data: data.data, meta: data.meta };
  },

  show: async (id: string | number) => {
    const response = await api.get<PatientShowResponse>(`${RESOURCE}/${id}`);
    return response.data.data;
  },

  create: async (values: PatientUpsertInput, extra?: ExtraUpload) => {
    const formData = buildPatientFormData(values, extra)
    const { data } = await api.post(RESOURCE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },

  update: async (id: string | number, values: PatientUpsertInput, extra?: ExtraUpload) => {
    const formData = buildPatientFormDataForUpdate(values, extra)
    const { data } = await api.put(`${RESOURCE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },

  destroy: async (id: string | number) => {
    await api.delete(`${RESOURCE}/${id}`);
  },
};

export default PatientsService;
