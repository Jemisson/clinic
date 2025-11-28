import { enUS, ptBR } from 'date-fns/locale'

export const EVENT_DEFAULTS = {
  START_TIME: '09:00',
  END_TIME: '10:00',
  COLOR: 'blue',
  CATEGORY: 'workshop',
} as const

export const EVENT_COLORS = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'amber', label: 'Amber' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'lime', label: 'Lime' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'teal', label: 'Teal' },
] as const

export const CATEGORY_OPTIONS = [
  { label: 'Consulta', value: 'consultation' },
  { label: 'Procedimento', value: 'procedure' },
  { label: 'Bloqueio', value: 'block' },
  { label: 'Orçamento', value: 'budget' },
] as const

export const LOCALES = [
  { value: 'en-US', label: 'English (US)', locale: enUS },
  { value: 'pt-BR', label: 'Português (Brasil)', locale: ptBR },
] as const
export type LocaleCode = (typeof LOCALES)[number]['value']
