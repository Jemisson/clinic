import { CreateOrUpdatePatientAttachmentInput, ExtraUpload } from '@/types/patient.attachment';

export function buildPatientAttachmentFormData(
  values: CreateOrUpdatePatientAttachmentInput,
  extra?: ExtraUpload
): FormData {
  const fd = new FormData();

  if (values.title !== undefined && values.title !== null) {
    fd.append('patient_attachment[title]', values.title);
  }
  fd.append('patient_attachment[kind]', values.kind);

  if (values.captured_at) {
    fd.append('patient_attachment[captured_at]', values.captured_at);
  }

  if (extra?.file) {
    fd.append('patient_attachment[file]', extra.file);
  }

  return fd;
}

export function buildPatientAttachmentFormDataForUpdate(
  values: CreateOrUpdatePatientAttachmentInput,
  extra?: ExtraUpload
): FormData {
  const fd = new FormData();

  if (values.title !== undefined) {
    fd.append('patient_attachment[title]', values.title as any);
  }
  if (values.kind !== undefined) {
    fd.append('patient_attachment[kind]', values.kind);
  }
  if (values.captured_at !== undefined) {
    fd.append('patient_attachment[captured_at]', (values.captured_at as any) ?? '');
  }
  if (extra?.file) {
    fd.append('patient_attachment[file]', extra.file);
  }

  return fd;
}
