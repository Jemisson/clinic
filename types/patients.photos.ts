import { Meta } from "./meta"

export type PatientPhotoLabel = "before" | "after" | "named"

export interface PatientPhotoFlat {
  id: number
  patient_id: number
  title?: string | null
  label: PatientPhotoLabel
  captured_at?: string | null
  created_at: string
  updated_at: string
  image_url?: string | null
  image_variants?: {
    thumb?: string
    medium?: string
  } | null
}

export type PatientPhotoGroups = Record<string, PatientPhotoFlat[]>

export interface PatientPhotosGroupedResponse {
  data: PatientPhotoGroups
  meta?: Meta
}

export interface PatientPhotoShowResponse {
  data: PatientPhotoFlat
}

export interface CreateOrUpdatePatientPhotoInput {
  image?: File
  label: PatientPhotoLabel
  title?: string
  captured_at?: string
}

export type ExtraUpload = Record<string, File | Blob | string | number | boolean | null | undefined>
