
export type PatientPhotoLabel = "before" | "after" | "named"

export type PatientPhotoAttributes = {
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

export type PatientPhoto = {
  id: string | number
  type?: string
  attributes: PatientPhotoAttributes
}

export type PatientPhotosResponse = {
  data: PatientPhoto[]
  meta?: {
    total_count?: number
    total_pages?: number
    current_page?: number
    per_page?: number
  }
}

export type PatientPhotoShowResponse = {
  data: PatientPhoto
}

export type CreateOrUpdatePatientPhotoInput = {
  image?: File
  label: PatientPhotoLabel
  title?: string
  captured_at?: string
}

export type ExtraUpload = Record<string, File | Blob | string | number | boolean | null | undefined>
