import type { PatientUpsertInput } from "@/types/patients"

const isFile = (v: unknown): v is File =>
  typeof File !== "undefined" && v instanceof File

function appendFormData(fd: FormData, value: any, parentKey?: string) {
  if (value == null) return

  if (isFile(value)) {
    if (!parentKey) throw new Error("parentKey é obrigatório p/ File")
    fd.append(parentKey, value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      const key = parentKey ? `${parentKey}[${i}]` : String(i)
      appendFormData(fd, v, key)
    })
    return
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      const key = parentKey ? `${parentKey}[${k}]` : k
      appendFormData(fd, v, key)
    })
    return
  }

  if (!parentKey) throw new Error("parentKey é obrigatório p/ primitivo")
  fd.append(parentKey, String(value))
}

type ExtraUpload = Record<string, File | Blob | string | number | boolean | null | undefined>

export function buildPatientFormData(values: PatientUpsertInput, extra?: ExtraUpload) {
  const fd = new FormData()

  fd.append("patient", JSON.stringify(values.patient))

  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v === undefined || v === null) continue
      if (v instanceof Blob) fd.append(k, v)
      else fd.append(k, String(v))
    }
  }

  return fd
}

export function buildPatientFormDataForUpdate(
  values: PatientUpsertInput,
  extra?: Record<string, File | Blob | string | number | boolean | null | undefined>
) {
  return buildPatientFormData(values, extra)
}
