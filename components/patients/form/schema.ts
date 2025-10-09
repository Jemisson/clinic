import { z } from "zod"
import { ZGender, ZCivilStatus, ZBloodType } from "@/types/patients.enums"

export const AddressSchema = z.object({
  id: z.number().optional(),
  street: z.string().min(1, "Informe a rua"),
    number: z.union([
    z.string().trim().min(1, "Informe o número"),
    z.coerce.number().min(1, "Informe o número"),
  ]),
  neighborhood: z.string().min(1, "Informe o bairro"),
  city: z.string().min(1, "Informe a cidade"),
  state: z.string().min(1, "UF"),
  country: z.string().default("Brasil"),
  zip_code: z.string().min(1, "Informe o CEP"),
  observation: z.string().optional().default(""),
  _destroy: z.boolean().optional().default(false),
})

export const ContactSchema = z.object({
  id: z.number().optional(),
  phone: z.string().optional().default(""),
  cellphone: z.string().optional().default(""),
  send_sms: z.boolean().default(false),
  send_wpp_confirmation: z.boolean().default(false),
  send_wpp_marketing: z.boolean().default(false),
  send_wpp_congrats: z.boolean().default(false),
  send_email_appointment: z.boolean().default(false),
  send_email_marketing: z.boolean().default(false),
  _destroy: z.boolean().optional().default(false),
})

export const PersonSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Informe o nome"),
  tag_ids: z.array(z.number()).default([]),
  addresses_attributes: z.array(AddressSchema).default([]),
  contacts_attributes: z.array(ContactSchema).default([]),
})

export const PatientSchema = z.object({
  naturalness: z.string().min(1, "Informe a naturalidade"),
  birthdate: z.string().min(1, "Informe a data de nascimento"),
  rg: z.string().optional().default(""),
  cpf: z.string().optional().default(""),
  no_cpf: z.boolean().default(false),

  blood_type: ZBloodType.nullable().optional(),
  spouse_name: z.string().optional().default(""),

  gender: ZGender.nullable().optional(),
  civil_status: ZCivilStatus.nullable().optional(),

  death_date: z.string().nullable().optional(),
  occupation: z.string().optional().default(""),

  referrer_person_id: z.union([z.string(), z.number()]).nullable().optional(),

  person: PersonSchema,
}).superRefine((val, ctx) => {
  if (!val.no_cpf && (!val.cpf || !val.cpf.trim())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cpf"], message: "Informe o CPF ou marque “Sem CPF”." })
  }})

export type PatientFormInput  = z.input<typeof PatientSchema>;
export type PatientFormValues = z.output<typeof PatientSchema>;

export const defaultValues: PatientFormValues = {
  naturalness: "",
  birthdate: "",
  rg: "",
  cpf: "",
  no_cpf: false,
  blood_type: null,
  spouse_name: "",
  gender: null,
  civil_status: null,
  death_date: null,
  occupation: "",
  referrer_person_id: null,
  person: {
    name: "",
    tag_ids: [],
    addresses_attributes: [{
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "Brasil",
      zip_code: "",
      observation: "",
      _destroy: false,
    }],
    contacts_attributes: [{
      phone: "",
      cellphone: "",
      send_sms: false,
      send_wpp_confirmation: false,
      send_wpp_marketing: false,
      send_wpp_congrats: false,
      send_email_appointment: false,
      send_email_marketing: false,
      _destroy: false,
    }],
  },
}
