import { z } from "zod";
import { PatientPhotoLabel } from "./patients.photos";

// ---- Blood Type ----
export const BLOOD_TYPES =
  ['a_positive', 'a_negative', 'b_positive', 'b_negative', 'ab_positive', 'ab_negative', 'o_positive', 'o_negative'] as const;
export type BloodType = typeof BLOOD_TYPES[number];
export const ZBloodType = z.enum(BLOOD_TYPES);

export const BLOOD_LABEL: Record<BloodType, string> = {
  a_positive: 'A+',
  a_negative: "A-",
  b_positive: "B+",
  b_negative: "B-",
  ab_positive: "AB+",
  ab_negative: "AB-",
  o_positive: "O+",
  o_negative: "O-"
};
export const isBloodType = (v: unknown): v is BloodType =>
  BLOOD_TYPES.includes(v as BloodType);

// ---- Gender ----
export const GENDERS = ['male','female','other'] as const;
export type Gender = typeof GENDERS[number];
export const ZGender = z.enum(GENDERS);

export const GENDER_LABEL: Record<Gender, string> = {
  male: 'Masculino',
  female: 'Feminino',
  other: 'Outro',
};
export const isGender = (v: unknown): v is Gender =>
  GENDERS.includes(v as Gender);

// ---- Civil Status ----
export const CIVIL_STATUS =
  ['single','married','divorced','widowed','separated','stableUnion'] as const;
export type CivilStatus = typeof CIVIL_STATUS[number];
export const ZCivilStatus = z.enum(CIVIL_STATUS);

export const CIVIL_STATUS_LABEL: Record<CivilStatus, string> = {
  single: 'Solteiro(a)',
  married: 'Casado(a)',
  divorced: 'Divorciado(a)',
  widowed: 'Viúvo(a)',
  separated: 'Separado(a)',
  stableUnion: 'União Estável',
};
export const isCivilStatus = (v: unknown): v is CivilStatus =>
  CIVIL_STATUS.includes(v as CivilStatus);

// ---- Helpers para Selects ----
export type Option = { value: string; label: string };

export const BLOOD_TYPE_OPTIONS: Option[] = BLOOD_TYPES.map(b => ({ value: b, label: BLOOD_LABEL[b] }));
export const GENDER_OPTIONS: Option[] = GENDERS.map(g => ({ value: g, label: GENDER_LABEL[g] }));
export const CIVIL_STATUS_OPTIONS: Option[] = CIVIL_STATUS.map(c => ({ value: c, label: CIVIL_STATUS_LABEL[c] }));


// ---- Patient Photo Label ----
export const PATIENT_PHOTO_LABEL: Record<PatientPhotoLabel, string> = {
  before: "Antes",
  after: "Depois",
  named: "Outra (especificar)",
}

export const PATIENT_PHOTO_LABEL_SHORT: Record<PatientPhotoLabel, string> = {
  before: "Antes",
  after: "Depois",
  named: "Outra",
}
