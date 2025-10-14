import {
  CreateOrUpdatePatientPhotoInput,
  ExtraUpload,
} from '@/types/patients.photos'

export function buildPatientPhotoFormData(
  values: CreateOrUpdatePatientPhotoInput,
  extra?: ExtraUpload,
) {
  const fd = new FormData()

  if (values.image) fd.append('patient_photo[image]', values.image)
  fd.append('patient_photo[label]', values.label)

  if (values.title) fd.append('patient_photo[title]', values.title)
  if (values.captured_at)
    fd.append('patient_photo[captured_at]', values.captured_at)

  if (extra) {
    Object.entries(extra).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      fd.append(k, v as any)
    })
  }

  return fd
}

export function buildPatientPhotoFormDataForUpdate(
  values: CreateOrUpdatePatientPhotoInput,
  extra?: ExtraUpload,
) {
  const fd = new FormData()

  if (values.image) fd.append('patient_photo[image]', values.image)
  if (values.label) fd.append('patient_photo[label]', values.label)

  if (values.title !== undefined)
    fd.append('patient_photo[title]', values.title ?? '')
  if (values.captured_at !== undefined)
    fd.append('patient_photo[captured_at]', values.captured_at ?? '')

  if (extra) {
    Object.entries(extra).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      fd.append(k, v as any)
    })
  }

  return fd
}
