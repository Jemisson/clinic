'use client'

import {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import { isSameDay } from 'date-fns'
import { useShallow } from 'zustand/shallow'

import { ScrollArea } from '../ui/scroll-area'
import { generateTimeSlots } from '@/lib/date'
import { cn } from '@/lib/utils'
import { Events, HoverPositionType } from '@/types/event'
import { EventDialogTrigger } from './event-dialog-trigger'
import { CurrentTimeIndicator } from './ui/current-time-indicator'
import { HoverTimeIndicator } from './ui/hover-time-indicator'
import { useDayEventPositions } from '@/lib/event'
import { TimeColumn } from './ui/time-column'
import { useEventCalendarStore } from '@/hooks/use-event'
import AppointmentService from '@/service/appointment-service'

const HOUR_HEIGHT = 64
const START_HOUR = 0
const END_HOUR = 23
const COLUMN_WIDTH_TOTAL = 99.5

interface CalendarDayProps {
  events: Events[]
  currentDate: Date
}

export function EventCalendarDay({ events, currentDate }: CalendarDayProps) {
  const { timeFormat, viewSettings, openQuickAddDialog, openAppointmentEdit } =
    useEventCalendarStore(
      useShallow((state) => ({
        timeFormat: state.timeFormat,
        viewSettings: state.viewSettings,
        openQuickAddDialog: state.openQuickAddDialog,
        openAppointmentEdit: state.openAppointmentEdit,
      })),
    )

  const [hoverPosition, setHoverPosition] = useState<
    HoverPositionType | undefined
  >(undefined)

  const timeColumnRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      const eventEndDate = new Date(event.endDate)

      return (
        isSameDay(eventStartDate, currentDate) ||
        isSameDay(eventEndDate, currentDate) ||
        (currentDate > eventStartDate && currentDate < eventEndDate)
      )
    })
  }, [events, currentDate])

  const timeSlots = useMemo(() => generateTimeSlots(START_HOUR, END_HOUR), [])
  const eventsPositions = useDayEventPositions(events, HOUR_HEIGHT)

  const handleTimeHover = useCallback((hour: number) => {
    setHoverPosition((prev) => ({ ...prev, hour, minute: 0, dayIndex: -1 }))
  }, [])

  const handlePreciseHover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, hour: number) => {
      if (!timeColumnRef.current) return

      const slotRect = event.currentTarget.getBoundingClientRect()
      const cursorY = event.clientY - slotRect.top
      const minutes = Math.floor((cursorY / slotRect.height) * 60)

      setHoverPosition({
        hour,
        minute: Math.max(0, Math.min(59, minutes)),
        dayIndex: -1,
      })
    },
    [],
  )

  const handleTimeLeave = useCallback(() => {
    setHoverPosition(undefined)
  }, [])

  const handleTimeSlotClick = useCallback(() => {
    if (!viewSettings.day.enableTimeSlotClick || !hoverPosition) return

    openQuickAddDialog({
      date: currentDate,
      position: hoverPosition,
    })
  }, [
    currentDate,
    hoverPosition,
    openQuickAddDialog,
    viewSettings.day.enableTimeSlotClick,
  ])

  const handleEventClick = useCallback(
    async (event: Events) => {
      try {
        const appointment = await AppointmentService.show(Number(event.id))
        openAppointmentEdit(appointment)
      } catch (error) {
        console.error('Erro ao carregar agendamento para edição:', error)
      }
    },
    [openAppointmentEdit],
  )

  useEffect(() => {
    const root = scrollAreaRef.current
    if (!root) return

    const viewport = root.querySelector(
      '[data-radix-scroll-area-viewport]',
    ) as HTMLElement | null

    if (!viewport) return

    const today = new Date()
    if (!isSameDay(today, currentDate)) return

    const hourOffset = currentHour * HOUR_HEIGHT
    const target = hourOffset - viewport.clientHeight / 7

    window.setTimeout(() => {
      viewport.scrollTo({
        top: Math.max(target, 0),
        behavior: 'smooth',
      })
    }, 50)
  }, [currentDate, currentHour])

  return (
    <div className="flex h-[760px] flex-col py-3">
      <ScrollArea
        ref={scrollAreaRef}
        className="h-full w-full rounded-md px-4"
      >
        <div className="relative mt-2 mb-2">
          <div className="absolute left-0 z-10 w-13">
            <TimeColumn
              ref={timeColumnRef}
              timeSlots={timeSlots}
              timeFormat={timeFormat}
              onTimeHover={handleTimeHover}
              onPreciseHover={handlePreciseHover}
              onLeave={handleTimeLeave}
              onTimeSlotClick={handleTimeSlotClick}
              variant="day"
            />
          </div>
          <div className="relative ml-14">
            {viewSettings.day.showCurrentTimeIndicator && (
              <CurrentTimeIndicator
                currentHour={currentHour}
                currentMinute={currentMinute}
                timeFormat={timeFormat}
                hourHeight={HOUR_HEIGHT}
                className="left-0"
              />
            )}
            {hoverPosition && viewSettings.day.showHoverTimeIndicator && (
              <HoverTimeIndicator
                hour={hoverPosition.hour}
                minute={hoverPosition.minute}
                timeFormat={timeFormat}
                hourHeight={HOUR_HEIGHT}
                className="left-0"
              />
            )}
            {timeSlots.map((_, index) => (
              <div
                key={index}
                data-testid={`time-grid-${index}`}
                className={cn('border-border h-16 border-t')}
              />
            ))}
            {filteredEvents.map((event) => {
              const position = eventsPositions[event.id]
              if (!position) return null

              const columnWidth = COLUMN_WIDTH_TOTAL / position.totalColumns
              const leftPercent = position.column * columnWidth
              const rightPercent =
                COLUMN_WIDTH_TOTAL - (leftPercent + columnWidth)

              return (
                <EventDialogTrigger
                  event={event}
                  key={event.id}
                  position={position}
                  leftOffset={leftPercent}
                  rightOffset={rightPercent}
                  onClick={handleEventClick}
                />
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
