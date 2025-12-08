'use client'

import { useEventCalendarStore } from '@/hooks/use-event'
import { getLocaleFromCode } from '@/lib/event'
import AppointmentService from '@/service/appointment-service'
import { CalendarViewType, Events } from '@/types/event'
import {
  eachMonthOfInterval,
  endOfYear,
  format,
  getMonth,
  isSameYear,
  startOfYear,
} from 'date-fns'
import { parseAsIsoDate, useQueryState } from 'nuqs'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/shallow'
import { MonthCard } from './ui/month-card'

interface CalendarYearProps {
  events: Events[]
  currentDate: Date
}

export function EventCalendarYear({ events, currentDate }: CalendarYearProps) {
  const {
    openQuickAddDialog,
    openDayEventsDialog,
    setView,
    viewSettings,
    locale,
    openAppointmentEdit,
  } = useEventCalendarStore(
    useShallow((state) => ({
      openQuickAddDialog: state.openQuickAddDialog,
      openDayEventsDialog: state.openDayEventsDialog,
      setView: state.setView,
      viewSettings: state.viewSettings.year,
      locale: state.locale,
      openAppointmentEdit: state.openAppointmentEdit,
    })),
  )

  const localeObj = getLocaleFromCode(locale)

  const [, setDate] = useQueryState(
    'date',
    parseAsIsoDate.withDefault(new Date()).withOptions({
      shallow: false,
    }),
  )

  const monthsInYear = useMemo(() => {
    const yearStart = startOfYear(currentDate)
    const yearEnd = endOfYear(currentDate)
    return eachMonthOfInterval({ start: yearStart, end: yearEnd })
  }, [currentDate])

  const { eventsByDate, eventCountByMonth } = useMemo(() => {
    const groupedEvents: Record<string, Events[]> = {}
    const counts = new Array(12).fill(0)

    events.forEach((event) => {
      const eventDate = new Date(event.startDate)
      if (isSameYear(eventDate, currentDate)) {
        const dateKey = format(eventDate, 'yyyy-MM-dd')
        const monthIndex = getMonth(eventDate)

        ;(groupedEvents[dateKey] ||= []).push(event)
        counts[monthIndex]++
      }
    })

    return { eventsByDate: groupedEvents, eventCountByMonth: counts }
  }, [events, currentDate])

  const handleMonthClick = useCallback(
    (month: Date) => {
      setView(CalendarViewType.MONTH)
      const newDate = new Date(
        month.getFullYear(),
        month.getMonth(),
        currentDate.getDate(),
      )
      setDate(newDate)
    },
    [setDate, setView, currentDate],
  )

  const handleDateClick = useCallback(
    (date: Date) => {
      const dateKey = format(date, 'yyyy-MM-dd')
      const eventsOnDate = eventsByDate[dateKey] || []
      if (eventsOnDate.length > 0) {
        openDayEventsDialog(date, eventsOnDate)
      } else {
        openQuickAddDialog({ date })
      }
    },
    [eventsByDate, openDayEventsDialog, openQuickAddDialog],
  )

  const handleQuickAdd = useCallback(
    (date: Date) => openQuickAddDialog({ date }),
    [openQuickAddDialog],
  )

  const handleEventClick = useCallback(
    async (event: Events) => {
      try {
        const appointmentId = Number(event.id)
        const appointment = await AppointmentService.show(appointmentId)
        openAppointmentEdit(appointment)
      } catch (error) {
        console.error('Erro ao carregar agendamento na visão anual:', error)
        toast.error('Não foi possível abrir o agendamento para edição.')
      }
    },
    [openAppointmentEdit],
  )

  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {monthsInYear.map((month) => (
        <MonthCard
          key={getMonth(month)}
          month={month}
          eventsByDate={eventsByDate}
          eventCount={eventCountByMonth[getMonth(month)]}
          yearViewConfig={viewSettings}
          onMonthClick={handleMonthClick}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
          onQuickAdd={handleQuickAdd}
          locale={localeObj}
        />
      ))}
    </div>
  )
}
