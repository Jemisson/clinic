import { Meta } from "./meta";

export type PersonTag = {
  id: number;
  name: string;
  icon?: string | null;
  status: "active" | "inactive";
};

export interface PatientResponse {
  data: PatientData[];
  meta: Meta;
}

export interface PatientData {
  id: string;
  type: "patient";
  attributes: PatientAttributes;
}

export interface Addresses {
  id?: number;
  street: string;
  number: string | number;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  person_id: string;
  observation: string;
  created_at: string;
  updated_at: string;
  _destroy?: false;
}

export interface AddressUpsert {
  id?: number;
  street: string;
  number: string | number;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  observation: string;
  _destroy?: boolean;
}

export interface Contacts {
  id?: number;
  person_id: string;
  phone: string;
  cellphone: string;
  send_sms: boolean;
  send_wpp_confirmation: boolean;
  send_wpp_marketing: boolean;
  send_wpp_congrats: boolean;
  send_email_appointment: boolean;
  send_email_marketing: boolean;
  created_at: string;
  updated_at: string;
  _destroy?: false;
}

export interface ContactUpsert {
  id?: number;
  phone: string;
  cellphone: string;
  send_sms: boolean;
  send_wpp_confirmation: boolean;
  send_wpp_marketing: boolean;
  send_wpp_congrats: boolean;
  send_email_appointment: boolean;
  send_email_marketing: boolean;
  _destroy?: boolean;
}

export interface Person {
  id?: number;
  name: string;
  addresses: Addresses[];
  contacts: Contacts[];
  tags: PersonTag[];
  photo_url?: string | null;
  photo_thumb_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PersonUpsert {
  id?: number;
  name: string;
  tag_ids: number[];
  addresses_attributes: AddressUpsert[];
  contacts_attributes: ContactUpsert[];
}

export interface PatientAttributes {
  id?: number;
  naturalness: string;
  birthdate: string;
  rg: string;
  cpf: string;
  blood_type: string | null;
  spouse_name: string | null;
  gender: string | null;
  civil_status: string | null;
  death_date: string | null;
  occupation: string;
  referrer_person_id: string | number;
  referrer: string | null;
  person: Person;
}

export interface PatientUpsertInput {
  patient: {
    naturalness: string | null;
    birthdate: string | null;
    rg: string | null;
    cpf: string;
    blood_type: number | null;
    spouse_name: string | null;
    gender: number | null;
    civil_status: number | null;
    death_date: string | null;
    occupation: string | null;
    referrer_person_id: number | null;
    no_cpf: boolean;
    person: PersonUpsert;
  };
}

export interface PatientShowResponse {
  data: PatientData;
}
