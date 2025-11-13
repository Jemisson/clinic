import { Meta } from "./meta"

export type IntervalUnit = 'day' | 'week' | 'month'

export interface ClinicalProcedureAttributes {
  id: number
  name: string
  price: string
  sessions_count: number
  interval_number: number
  interval_unit: IntervalUnit
  created_at: string
  updated_at: string
}

export interface ClinicalProcedureData {
  id: string
  type: 'clinical_procedure'
  attributes: ClinicalProcedureAttributes
}

export interface ClinicalProcedureListResponse {
  data: ClinicalProcedureData[]
  meta: Meta
}

export interface FormValues {
  name: string
  price: string
  sessions_count: number
  interval_number: number
  interval_unit: IntervalUnit
}
