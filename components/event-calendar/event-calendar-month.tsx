'use client'

import { useMemo, useRef, useState, useCallback } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { useEventCalendarStore } from '@/hooks/use-event'
import { useShallow } from 'zustand/shallow'
import { DayCell } from './ui/day-cell'
import { WeekDayHeaders } from './ui/week-days-header'
import { getLocaleFromCode, useWeekDays } from '@/lib/event'
import { formatDate } from '@/lib/date'
import { Events } from '@/types/event'
import AppointmentService from '@/service/appointment-service'

const DAYS_IN_WEEK = 7

interface CalendarMonthProps {
  events: Events[]
  baseDate: Date
}

export function EventCalendarMonth({ events, baseDate }: CalendarMonthProps) {
  const {
    timeFormat,
    firstDayOfWeek,
    locale,
    weekStartDay,
    viewSettings,
    openDayEventsDialog,
    openQuickAddDialog,
    openAppointmentEdit,
  } = useEventCalendarStore(
    useShallow((state) => ({
      timeFormat: state.timeFormat,
      firstDayOfWeek: state.firstDayOfWeek,
      viewSettings: state.viewSettings.month,
      locale: state.locale,
      weekStartDay: state.firstDayOfWeek,
      openDayEventsDialog: state.openDayEventsDialog,
      openQuickAddDialog: state.openQuickAddDialog,
      openAppointmentEdit: state.openAppointmentEdit,
    })),
  )

  const daysContainerRef = useRef<HTMLDivElement>(null)
  const [focusedDate, setFocusedDate] = useState<Date | null>(null)
  const localeObj = getLocaleFromCode(locale)

  const { weekNumber, weekDays } = useWeekDays(
    baseDate,
    DAYS_IN_WEEK,
    localeObj,
  )

  const visibleDays = useMemo(() => {
    const monthStart = startOfMonth(baseDate)
    const monthEnd = endOfMonth(baseDate)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: weekStartDay })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: weekStartDay })

    return eachDayOfInterval({ start: gridStart, end: gridEnd })
  }, [baseDate, weekStartDay])

  const eventsGroupedByDate = useMemo(() => {
    const groupedEvents: Record<string, Events[]> = {}

    visibleDays.forEach((day) => {
      groupedEvents[format(day, 'yyyy-MM-dd')] = []
    })

    events.forEach((event) => {
      const dateKey = format(event.startDate, 'yyyy-MM-dd')
      if (groupedEvents[dateKey]) {
        groupedEvents[dateKey].push(event)
      }
    })

    return groupedEvents
  }, [events, visibleDays])

  const handleShowDayEvents = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    openDayEventsDialog(date, eventsGroupedByDate[dateKey] || [])
  }

  const handleOpenEvent = useCallback(
    async (event: Events) => {
      try {
        const appointment = await AppointmentService.show(Number(event.id))
        openAppointmentEdit(appointment)
      } catch (error) {
        console.error('Erro ao carregar agendamento para edição (mês):', error)
      }
    },
    [openAppointmentEdit],
  )

  return (
    <div className="flex flex-col border py-2">
      <WeekDayHeaders
        weekNumber={weekNumber}
        daysInWeek={weekDays}
        formatDate={formatDate}
        locale={localeObj}
        firstDayOfWeek={firstDayOfWeek}
      />

      <div
        ref={daysContainerRef}
        className="grid grid-cols-7 gap-1 p-2 sm:gap-2"
        role="grid"
        aria-label="Month calendar grid"
      >
        {visibleDays.map((date, index) => (
          <DayCell
            key={`day-cell-${index}`}
            date={date}
            baseDate={baseDate}
            isOutsideMonth={date.getMonth() !== baseDate.getMonth()}
            eventsByDate={eventsGroupedByDate}
            locale={localeObj}
            timeFormat={timeFormat}
            monthViewConfig={viewSettings}
            focusedDate={focusedDate}
            onQuickAdd={(d) => openQuickAddDialog({ date: d })}
            onFocusDate={setFocusedDate}
            onShowDayEvents={handleShowDayEvents}
            onOpenEvent={handleOpenEvent}
          />
        ))}
      </div>
    </div>
  )
}
