import dayjs from "dayjs"
import type { PatientFormValues } from "./schema"
import type { PatientUpsertInput, PatientData, AddressUpsert, ContactUpsert } from "@/types/patients"

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

const bool = (v: unknown) => !!v

type OrigAddress = {
  id?: number
  street?: string
  number?: number | string | null
  neighborhood?: string
  city?: string
  state?: string
  country?: string
  zip_code?: string
  observation?: string
}
type OrigContact = {
  id?: number
  phone?: string | null
  cellphone?: string | null
  send_sms?: boolean
  send_wpp_confirmation?: boolean
  send_wpp_marketing?: boolean
  send_wpp_congrats?: boolean
  send_email_appointment?: boolean
  send_email_marketing?: boolean
}

function makeOrigAddressesMap(baseline?: PatientData) {
  const m = new Map<number, OrigAddress>()
  const list = baseline?.attributes?.person?.addresses ?? []
  for (const a of list) {
    const id = Number(a.id)
    if (Number.isFinite(id)) {
      m.set(id, {
        id,
        street: a.street ?? "",
        number: a.number as any,
        neighborhood: a.neighborhood ?? "",
        city: a.city ?? "",
        state: a.state ?? "",
        country: a.country ?? "Brasil",
        zip_code: a.zip_code ?? "",
        observation: a.observation ?? "",
      })
    }
  }
  return m
}

function makeOrigContactsMap(baseline?: PatientData) {
  const m = new Map<number, OrigContact>()
  const list = baseline?.attributes?.person?.contacts ?? []
  for (const c of list) {
    const id = Number(c.id)
    if (Number.isFinite(id)) {
      m.set(id, {
        id,
        phone: c.phone ?? "",
        cellphone: c.cellphone ?? "",
        send_sms: !!c.send_sms,
        send_wpp_confirmation: !!c.send_wpp_confirmation,
        send_wpp_marketing: !!c.send_wpp_marketing,
        send_wpp_congrats: !!c.send_wpp_congrats,
        send_email_appointment: !!c.send_email_appointment,
        send_email_marketing: !!c.send_email_marketing,
      })
    }
  }
  return m
}

function isAddressChanged(next: any, orig?: OrigAddress | null): boolean {
  if (!orig) return true
  return (
    (next.street ?? "") !== (orig.street ?? "") ||
    String(next.number ?? "") !== String(orig.number ?? "") ||
    (next.neighborhood ?? "") !== (orig.neighborhood ?? "") ||
    (next.city ?? "") !== (orig.city ?? "") ||
    (next.state ?? "") !== (orig.state ?? "") ||
    (next.country ?? "Brasil") !== (orig.country ?? "Brasil") ||
    (next.zip_code ?? "") !== (orig.zip_code ?? "") ||
    (next.observation ?? "") !== (orig.observation ?? "")
  )
}

function isContactChanged(next: any, orig?: OrigContact | null): boolean {
  if (!orig) return true
  return (
    (next.phone ?? "") !== (orig.phone ?? "") ||
    (next.cellphone ?? "") !== (orig.cellphone ?? "") ||
    bool(next.send_sms) !== bool(orig.send_sms) ||
    bool(next.send_wpp_confirmation) !== bool(orig.send_wpp_confirmation) ||
    bool(next.send_wpp_marketing) !== bool(orig.send_wpp_marketing) ||
    bool(next.send_wpp_congrats) !== bool(orig.send_wpp_congrats) ||
    bool(next.send_email_appointment) !== bool(orig.send_email_appointment) ||
    bool(next.send_email_marketing) !== bool(orig.send_email_marketing)
  )
}

export function buildPatientPayload(
  values: PatientFormValues,
  baseline?: PatientData
): PatientUpsertInput {
  const birthdate = values.birthdate ? dayjs(values.birthdate).format("YYYY-MM-DD") : ""
  const deathDate = values.death_date ? dayjs(values.death_date).format("YYYY-MM-DD") : null

  const origAddrMap = makeOrigAddressesMap(baseline)
  const origContMap = makeOrigContactsMap(baseline)

  const addresses_attributes = (values.person?.addresses_attributes ?? [])
    .map((a) => {
      const baseObj = {
        id: a.id ?? undefined,
        street: a.street ?? "",
        number: (() => {
          const v = a.number as unknown
          const n = typeof v === "string" ? parseInt(v, 10) : Number(v)
          return Number.isFinite(n) ? n : ""
        })(),
        neighborhood: a.neighborhood ?? "",
        city: a.city ?? "",
        state: a.state ?? "",
        country: a.country ?? "Brasil",
        zip_code: a.zip_code ?? "",
        observation: a.observation ?? "",
        _destroy: !!a._destroy,
      }

      const orig = baseObj.id ? origAddrMap.get(Number(baseObj.id)) ?? null : null

      if (baseObj.id && baseObj._destroy) {
        return {
          id: baseObj.id,
          street: orig?.street ?? "",
          number: orig?.number ?? "",
          neighborhood: orig?.neighborhood ?? "",
          city: orig?.city ?? "",
          state: orig?.state ?? "",
          country: orig?.country ?? "Brasil",
          zip_code: orig?.zip_code ?? "",
          observation: orig?.observation ?? "",
          _destroy: true,
        }
      }

      if (!baseObj.id) return baseObj

      return isAddressChanged(baseObj, orig) ? baseObj : null
    })
    .filter(Boolean) as AddressUpsert[]

const contacts_attributes = (values.person?.contacts_attributes ?? [])
  .map((c) => {
    const baseObj = {
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
    }

    const orig = baseObj.id ? origContMap.get(Number(baseObj.id)) ?? null : null

    if (baseObj.id && baseObj._destroy) {
      return {
        id: baseObj.id,
        phone: orig?.phone ?? "",
        cellphone: orig?.cellphone ?? "",
        send_sms: !!orig?.send_sms,
        send_wpp_confirmation: !!orig?.send_wpp_confirmation,
        send_wpp_marketing: !!orig?.send_wpp_marketing,
        send_wpp_congrats: !!orig?.send_wpp_congrats,
        send_email_appointment: !!orig?.send_email_appointment,
        send_email_marketing: !!orig?.send_email_marketing,
        _destroy: true,
      }
    }

    if (!baseObj.id) return baseObj

    return isContactChanged(baseObj, orig) ? baseObj : null
  })
  .filter(Boolean) as ContactUpsert[]


  return {
    patient: {
      naturalness: values.naturalness ?? "",
      birthdate,
      rg: values.rg ?? "",
      cpf: values.cpf ?? "",

      blood_type: asEnumNum(values.blood_type, BLOOD_TO_NUM),
      gender: asEnumNum(values.gender, GENDER_TO_NUM),
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

        addresses_attributes,
        contacts_attributes,
      },
    },
  }
}
