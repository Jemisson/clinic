import dayjs from "dayjs"
import type { PatientFormValues } from "./schema"
import type { PatientUpsertInput } from "@/types/patients"

const BLOOD_TO_NUM: Record<string, number> = {
  "A+": 0, "A-": 1, "B+": 2, "B-": 3, "AB+": 4, "AB-": 5, "O+": 6, "O-": 7,
  aPositive: 0, aNegative: 1, bPositive: 2, bNegative: 3,
  abPositive: 4, abNegative: 5, oPositive: 6, oNegative: 7,
}
const GENDER_TO_NUM: Record<string, number> = { male: 0, female: 1, other: 2 }
const CIVIL_TO_NUM:  Record<string, number> = {
  single: 0, married: 1, divorced: 2, widowed: 3, separated: 4, stableUnion: 5, stable_union: 5,
}

function asEnumNum(v: unknown, map?: Record<string, number>): number | null {
  if (v == null || v === "") return null
  if (typeof v === "number" && Number.isFinite(v)) return v
  const n = Number(v)
  if (Number.isFinite(n)) return n
  const key = String(v)
  return map ? (map[key] ?? null) : null
}

export function buildPatientPayload(values: PatientFormValues): PatientUpsertInput {
  const birthdate = values.birthdate ? dayjs(values.birthdate).format("YYYY-MM-DD") : ""
  const deathDate = values.death_date ? dayjs(values.death_date).format("YYYY-MM-DD") : null

  return {
    patient: {
      naturalness: values.naturalness ?? "",
      birthdate,
      rg: values.rg ?? "",
      cpf: values.cpf ?? "",

      blood_type: asEnumNum(values.blood_type, BLOOD_TO_NUM),
      gender:     asEnumNum(values.gender, GENDER_TO_NUM),
      civil_status: asEnumNum(values.civil_status, CIVIL_TO_NUM),

      spouse_name: values.spouse_name ?? "",
      death_date: deathDate,
      occupation: values.occupation ?? "",
      referrer_person_id:
        values.referrer_person_id == null || values.referrer_person_id === ""
          ? null
          : Number(values.referrer_person_id),
      no_cpf: !!values.no_cpf,

      person: {
        id: values.person?.id ?? undefined,
        name: values.person?.name?.trim() || "",
        tag_ids: (values.person?.tag_ids ?? []).map(Number),

        addresses_attributes: (values.person?.addresses_attributes ?? []).map((a) => ({
          id: a.id ?? undefined,
          street: a.street ?? "",
          number: ((): number | string => {
            const n = Number(a.number as any)
            return Number.isFinite(n) ? n : (a.number as any) ?? ""
          })(),
          neighborhood: a.neighborhood ?? "",
          city: a.city ?? "",
          state: a.state ?? "",
          country: a.country ?? "Brasil",
          zip_code: a.zip_code ?? "",
          observation: a.observation ?? "",
          _destroy: !!a._destroy,
        })),

        contacts_attributes: (values.person?.contacts_attributes ?? []).map((c) => ({
          id: c.id ?? undefined,
          phone: c.phone ?? "",
          cellphone: c.cellphone ?? "",
          send_sms: !!c.send_sms,
          send_wpp_confirmation: !!c.send_wpp_confirmation,
          send_wpp_marketing: !!c.send_wpp_marketing,
          send_wpp_congrats: !!c.send_wpp_congrats,
          send_email_appointment: !!c.send_email_appointment,
          send_email_marketing: !!c.send_email_marketing,
          _destroy: !!c._destroy,
        })),
      },
    },
  }
}
