'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'

import CalendarService from '@/service/calendar-service'
import type { Events } from '@/types/event'
import { EventCalendarDay } from '@/components/event-calendar/event-calendar-day'

export function DashboardSchedule() {
  const [today] = useState(() => new Date())
  const [events, setEvents] = useState<Events[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await CalendarService.list({
          date: today,
          view: 'day',
          daysCount: 1,
          limit: 1000,
          offset: 0,
        })

        setEvents(data)
      } catch (err) {
        console.error(err)
        setError('Não foi possível carregar a agenda de hoje.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [today])

  return (
    <aside className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="h-4 w-4 text-emerald-700" />
          <span>Hoje</span>
        </div>

        <span className="text-xs text-muted-foreground">
          {format(today, "dd 'de' MMMM", { locale: ptBR })}
        </span>
      </div>

      {/* Card agora é flex e ocupa toda a altura da coluna */}
      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Agenda do dia
          </CardTitle>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col space-y-3 text-sm text-muted-foreground">
          {isLoading && (
            <>
              <p>Carregando agenda de hoje...</p>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="rounded-md border bg-muted/40 px-3 py-2 text-xs"
                  >
                    <div className="mb-1 h-3 w-20 rounded bg-muted-foreground/25" />
                    <div className="h-3 w-32 rounded bg-muted-foreground/15" />
                  </div>
                ))}
              </div>
            </>
          )}

          {error && (
            <p className="text-xs text-destructive">
              {error}
            </p>
          )}

          {!isLoading && !error && events.length === 0 && (
            <p>Você não tem eventos na agenda de hoje.</p>
          )}

          {!isLoading && !error && events.length > 0 && (
            <div className="flex min-h-0 flex-1 rounded-md border">
              <EventCalendarDay
                events={events}
                currentDate={today}
                variant="compact"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}
