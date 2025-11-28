'use client'

import { EventCalendar } from '@/components/event-calendar/event-calendar'
import { useEventCalendarStore } from '@/hooks/use-event'
import CalendarService, { CalendarView } from '@/service/calendar-service'
import type { Events } from '@/types/event'
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'nuqs'
import { parseAsIsoDate } from 'nuqs/server'
import { useEffect, useState, useTransition } from 'react'
import { useShallow } from 'zustand/shallow'

export default function AgendaClient() {
  const [events, setEvents] = useState<Events[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [date] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(new Date()).withOptions({
      shallow: false,
      startTransition,
    }),
  )

  const [filters] = useQueryStates({
    categories: parseAsArrayOf(parseAsString).withDefault([]),
    search: parseAsString.withDefault(''),
  })

  const { currentView } = useEventCalendarStore(
    useShallow((state) => ({
      currentView: state.currentView,
    })),
  )

  useEffect(() => {
    async function load() {
      try {
        setError(null)

        const view = (currentView ?? 'day') as CalendarView

        const kinds =
          filters.categories && filters.categories.length > 0
            ? filters.categories
            : undefined

        const data = await CalendarService.list({
          date,
          view,
          daysCount: 1,
          search: filters.search || undefined,
          limit: 1000,
          offset: 0,
          kinds,
        })

        setEvents(data)
      } catch (err) {
        console.error(err)
        setError('Não foi possível carregar a agenda.')
      }
    }

    load()
  }, [date, currentView, filters.categories, filters.search])

  if (isPending && events.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-6">
          <div className="container">
            <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
              <div className="flex h-[700px] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                  <p className="text-muted-foreground text-sm">
                    Carregando agenda...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-6">
          <div className="container">
            <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
              <div className="flex h-[700px] items-center justify-center">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex  flex-col">
      <main className="flex justify-center pt-5">
        <div className="container">
          <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <EventCalendar
              events={events}
              initialDate={date}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
