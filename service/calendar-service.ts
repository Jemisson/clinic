// service/calendar-service.ts
import { Events } from '@/types/event'
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns'
import api from './api'
import {
  AppointmentEventResponse,
  AppointmentEventsApiResponse,
  AppointmentKind,
  AppointmentStatus,
} from '@/types/appointment'

const RESOURCE = '/appointments/calendar'

export type CalendarView = 'day' | 'days' | 'week' | 'month' | 'year'

export type CalendarListParams = {
  date: Date
  view: CalendarView
  daysCount: number
  search?: string
  limit: number
  offset: number
  kinds?: AppointmentKind[] | string[]
}

function buildRange(view: CalendarView, date: Date, daysCount: number) {
  switch (view) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) }

    case 'days': {
      const start = startOfDay(date)
      const end = endOfDay(addDays(date, Math.max(daysCount - 1, 0)))
      return { start, end }
    }

    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      }

    case 'year':
      return { start: startOfYear(date), end: endOfYear(date) }

    case 'month':
    default:
      return { start: startOfMonth(date), end: endOfMonth(date) }
  }
}

function mapKindToCategory(kind: string): string {
  switch (kind) {
    case 'consultation':
      return 'Consulta'
    case 'procedure':
      return 'Procedimento'
    case 'block':
      return 'Bloqueio'
    default:
      return kind
  }
}

function mapKindToColor(kind: string, status: string): string {
  if (kind === 'block') return 'gray'
  if (kind === 'procedure') return 'green'
  if (status === 'confirmed') return 'blue'
  if (status === 'canceled') return 'red'
  return 'yellow'
}

function extractTime(isoString: string): string {
  return isoString.slice(11, 16)
}

function mapAppointmentToEvent(item: AppointmentEventResponse): Events {
  const { id, kind, status, title, start, end } = item.attributes
  const startDate = parseISO(start)
  const endDate = parseISO(end)

  const startTime = extractTime(start)
  const endTime = extractTime(end)

  return {
    id: String(id),
    title,
    description: '',
    startDate,
    endDate,
    startTime,
    endTime,
    isRepeating: false,
    repeatingType: null,
    location: '',
    category: mapKindToCategory(kind),
    color: mapKindToColor(kind, status),
    createdAt: startDate,
    updatedAt: endDate,
  }
}

export const CalendarService = {
  list: async (params: CalendarListParams): Promise<Events[]> => {
    const { date, view, daysCount, search, limit, offset, kinds } = params
    const { start, end } = buildRange(view, date, daysCount)

    const query: Record<string, string | number | string[]> = {
      start: start.toISOString(),
      end: end.toISOString(),
      limit,
      offset,
    }

    if (search) {
      query.search = search
    }

    if (kinds && kinds.length > 0) {
      query.kind = kinds
    }

    const { data } = await api.get<AppointmentEventsApiResponse>(RESOURCE, {
      params: query,
    })

    return data.data.map(mapAppointmentToEvent)
  },
}

export default CalendarService
