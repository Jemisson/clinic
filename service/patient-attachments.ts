import api from './api';
import {
  CreateOrUpdatePatientAttachmentInput,
  ExtraUpload,
  IndexResponse,
  ShowResponse,
} from '@/types/patient.attachment';
import {
  buildPatientAttachmentFormData,
  buildPatientAttachmentFormDataForUpdate,
} from '@/utils/patient-attachment-formdata';

const RESOURCE = (patientId: string | number) =>
  `/patients/${patientId}/patient_attachments`;

export const PatientAttachmentsService = {
  list: async (
    patientId: string | number,
    params: { page?: number; per_page?: number; kind?: 'document' | 'exam' } = {}
  ) => {
    const { data } = await api.get<IndexResponse>(RESOURCE(patientId), { params });
    return { data: data.data, meta: data.meta };
  },

  show: async (patientId: string | number, id: string | number) => {
    const { data } = await api.get<ShowResponse>(`${RESOURCE(patientId)}/${id}`);
    return data.data;
  },

  create: async (
    patientId: string | number,
    values: CreateOrUpdatePatientAttachmentInput,
    extra?: ExtraUpload
  ) => {
    const formData = buildPatientAttachmentFormData(values, extra);
    const { data } = await api.post(RESOURCE(patientId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (
    patientId: string | number,
    id: string | number,
    values: CreateOrUpdatePatientAttachmentInput,
    extra?: ExtraUpload
  ) => {
    const formData = buildPatientAttachmentFormDataForUpdate(values, extra);
    const { data } = await api.put(`${RESOURCE(patientId)}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  destroy: async (patientId: string | number, id: string | number) => {
    await api.delete(`${RESOURCE(patientId)}/${id}`);
  },
};

export default PatientAttachmentsService;
