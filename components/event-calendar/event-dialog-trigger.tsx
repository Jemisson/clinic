'use client'

import { formatTimeDisplay } from '@/lib/date'
import { getColorClasses } from '@/lib/event'
import { cn } from '@/lib/utils'
import { Events, TimeFormatType } from '@/types/event'
import { Clock } from 'lucide-react'
import { Badge } from '../ui/badge'

type EventDialogTriggerProps = {
  event: Events
  position: {
    top: number
    height: number
  }
  leftOffset: number
  rightOffset: number
  onClick: (event: Events) => void
  timeFormat?: TimeFormatType
}

export function EventDialogTrigger({
  event,
  position,
  leftOffset,
  rightOffset,
  onClick,
  timeFormat = TimeFormatType.HOUR_24,
}: EventDialogTriggerProps) {
  const { bg } = getColorClasses(event.color)
  const { top, height } = position

  const isVeryShort = height < 32

  const start = formatTimeDisplay(event.startTime, timeFormat)
  const end = formatTimeDisplay(event.endTime, timeFormat)

  // calcula duração em minutos
  const durationMinutes = (() => {
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)
    const diff = (endDate.getTime() - startDate.getTime()) / 60000
    return Math.max(0, Math.round(diff))
  })()

  const durationLabel =
    durationMinutes >= 60
      ? `${Math.floor(durationMinutes / 60)}h${
          durationMinutes % 60 ? ` ${durationMinutes % 60}m` : ''
        }`
      : `${durationMinutes}m`

  // texto final: "1h 30m - 12:00 - 13:30"
  const timeLine = `${start} - ${end} - ${durationLabel}`

  console.log(event);
  
  return (
    <div
      className="pointer-events-auto absolute"
      style={{
        top,
        height,
        left: `${leftOffset}%`,
        right: `${rightOffset}%`,
      }}
    >
      <button
        type="button"
        className={cn(
          'flex h-full w-full flex-col justify-center rounded-md px-2 py-1',
          'text-[11px] leading-tight text-white',
          'overflow-hidden text-left',
          'transition-colors hover:opacity-90',
          bg,
        )}
        onClick={() => onClick(event)}
      >
        {/* título só se tiver espaço mínimo */}
        {!isVeryShort && (
          <div className="flex">
            <span className="line-clamp-1 font-medium">{event.title}</span>
            <Badge
              variant="default"
              className={cn('ml-1 h-4 px-1 text-[9px] leading-none', bg)}
            >
              {event.category !== 'Bloqueio' ? event.category : ''}
            </Badge>
          </div>
        )}

        <div className="mt-0.5 flex items-center gap-1 text-[10px] leading-tight">
          <Clock className="h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{timeLine}</span>
        </div>
      </button>
    </div>
  )
}
