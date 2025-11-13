import api from '@/service/api'
import {
  ClinicalProcedureAttributes,
  ClinicalProcedureData,
  ClinicalProcedureListResponse,
} from '@/types/clinical-procedures'

interface ListParams {
  page?: number
  per_page?: number
  q?: string
}

export interface ClinicalProcedurePayload {
  name: string
  price: string
  sessions_count: number
  interval_number: number
  interval_unit: ClinicalProcedureAttributes['interval_unit']
}

const ClinicalProceduresService = {
  async list(params: ListParams): Promise<ClinicalProcedureListResponse> {
    const { data } = await api.get('/clinical_procedures', { params })
    return data
  },

  async create(
    payload: ClinicalProcedurePayload,
  ): Promise<ClinicalProcedureData> {
    const { data } = await api.post('/clinical_procedures', {
      clinical_procedure: payload,
    })
    return data
  },

  async update(
    id: string | number,
    payload: ClinicalProcedurePayload,
  ): Promise<ClinicalProcedureData> {
    const { data } = await api.put(`/clinical_procedures/${id}`, {
      clinical_procedure: payload,
    })
    return data
  },

  async destroy(id: string | number): Promise<void> {
    await api.delete(`/clinical_procedures/${id}`)
  },
}

export default ClinicalProceduresService
