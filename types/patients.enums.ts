import { z } from "zod";

// ---- Blood Type ----
export const BLOOD_TYPES =
  ['aPositive', 'aNegative', 'bPositive', 'bNegative', 'abPositive', 'abNegative', 'oPositive', 'oNegative'] as const;
export type BloodType = typeof BLOOD_TYPES[number];
export const ZBloodType = z.enum(BLOOD_TYPES);

export const BLOOD_LABEL: Record<BloodType, string> = {
  aPositive: 'A+',
  aNegative: "A-",
  bPositive: "B+",
  bNegative: "B-",
  abPositive: "AB+",
  abNegative: "AB-",
  oPositive: "O+",
  oNegative: "O-"
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
