'use client'

import { EventCalendar } from '@/components/event-calendar/event-calendar'
import { useEventCalendarStore } from '@/hooks/use-event'
import CalendarService, { CalendarView } from '@/service/calendar-service'
import type { Events } from '@/types/event'
import { useQueryState } from 'nuqs'
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

        const data = await CalendarService.list({
          date,
          view,
          daysCount: 1,
          search: undefined,
          limit: 1000,
          offset: 0,
        })

        setEvents(data)
      } catch (err) {
        console.error(err)
        setError('Não foi possível carregar a agenda.')
      }
    }

    load()
  }, [date, currentView])

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
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-6">
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
