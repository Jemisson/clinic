import { z } from "zod";

// ---- Roles ----
export const USER_ROLES = ['user', 'manager', 'admin', 'doctor'] as const;
export type UserRole = typeof USER_ROLES[number];
export const ZUserRole = z.enum(USER_ROLES);

// Labels (pt-BR)
export const ROLE_LABEL: Record<UserRole, string> = {
  user: 'Usuário',
  doctor: 'Médico(a)',
  manager: 'Gerente',
  admin: 'Administrador',
};
export const isUserRole = (v: unknown): v is UserRole =>
  USER_ROLES.includes(v as UserRole);

// ---- Sectors ----
export const USER_SECTORS = ['administrative','comercial','clinical','finance','it'] as const;
export type UserSector = typeof USER_SECTORS[number];
export const ZUserSector = z.enum(USER_SECTORS);

export const SECTOR_LABEL: Record<UserSector, string> = {
  administrative: 'Administrativo',
  comercial: 'Comercial',
  clinical: 'Clínico',
  finance: 'Financeiro',
  it: 'TI',
};
export const isUserSector = (v: unknown): v is UserSector =>
  USER_SECTORS.includes(v as UserSector);

// ---- Functions (cargos/funções) ----
export const USER_FUNCTIONS = ['analyst','technique','coordinator','assistant'] as const;
export type UserFunction = typeof USER_FUNCTIONS[number];
export const ZUserFunction = z.enum(USER_FUNCTIONS);

export const FUNCTION_LABEL: Record<UserFunction, string> = {
  analyst: 'Analista',
  technique: 'Técnico(a)',
  coordinator: 'Coordenador(a)',
  assistant: 'Assistente',
};
export const isUserFunction = (v: unknown): v is UserFunction =>
  USER_FUNCTIONS.includes(v as UserFunction);

// ---- Gender ----
export const GENDERS = ['female','male','other'] as const;
export type Gender = typeof GENDERS[number];
export const ZGender = z.enum(GENDERS);

export const GENDER_LABEL: Record<Gender, string> = {
  female: 'Feminino',
  male: 'Masculino',
  other: 'Outro',
};
export const isGender = (v: unknown): v is Gender =>
  GENDERS.includes(v as Gender);

// ---- Helpers para Selects (opcional)
export type Option = { value: string; label: string };

export const USER_ROLE_OPTIONS: Option[] = USER_ROLES.map(r => ({ value: r, label: ROLE_LABEL[r] }));
export const USER_SECTOR_OPTIONS: Option[] = USER_SECTORS.map(s => ({ value: s, label: SECTOR_LABEL[s] }));
export const USER_FUNCTION_OPTIONS: Option[] = USER_FUNCTIONS.map(f => ({ value: f, label: FUNCTION_LABEL[f] }));
export const GENDER_OPTIONS: Option[] = GENDERS.map(g => ({ value: g, label: GENDER_LABEL[g] }));
