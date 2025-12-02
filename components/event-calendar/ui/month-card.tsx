import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isSameDay } from '@/lib/date';
import { getColorClasses } from '@/lib/event';
import { capitalize, cn } from '@/lib/utils';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  isSameMonth,
  isSameYear,
  startOfMonth,
  Locale,
} from 'date-fns';
import { ChevronRight, Plus } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Events, YearViewConfig } from '@/types/event';

interface MonthCardProps {
  month: Date;
  eventsByDate: Record<string, Events[]>;
  eventCount: number;
  yearViewConfig: YearViewConfig;
  onMonthClick: (month: Date) => void;
  onEventClick: (event: Events) => void;
  onDateClick: (date: Date) => void;
  onQuickAdd: (date: Date) => void;
  locale?: Locale;
}

interface DayCellProps {
  day: Date;
  events: Events[];
  isToday: boolean;
  onClick: () => void;
  locale?: Locale;
}

const DayCell = memo(
  ({ day, events, isToday, onClick, locale }: DayCellProps) => {
    const hasDayEvents = events.length > 0;

    const tooltipContent = useMemo(() => {
      const dateLabel = format(day, 'd MMMM yyyy', { locale });
      if (!hasDayEvents) return dateLabel;

      const label =
        events.length === 1
          ? `1 agendamento em ${dateLabel}`
          : `${events.length} agendamentos em ${dateLabel}`;

      return label;
    }, [hasDayEvents, events.length, day, locale]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              'relative flex h-10 w-full items-center justify-center rounded-full p-0 text-[11px] transition-colors',
              isToday ? 'bg-blue-500 font-bold text-white' : '',
              hasDayEvents && !isToday ? 'bg-primary/10 font-medium' : '',
            )}
            onClick={onClick}
          >
            {getDate(day)}
            {hasDayEvents && !isToday && (
              <span className="bg-primary absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    );
  },
);

DayCell.displayName = 'DayCell';

const MonthDaysGrid = memo(
  ({
    month,
    eventsByDate,
    onDateClick,
    locale,
  }: {
    month: Date;
    eventsByDate: Record<string, Events[]>;
    onDateClick: (date: Date) => void;
    locale?: Locale;
  }) => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    const firstDayOfMonth = startOfMonth(month);
    const firstWeekday = firstDayOfMonth.getDay();

    const weekHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return (
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weekHeaders.map((day, i) => (
          <div
            key={i}
            className="text-muted-foreground mb-1 text-[10px] font-medium"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: firstWeekday }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {daysInMonth.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <DayCell
              key={dateKey}
              day={day}
              events={eventsByDate[dateKey] || []}
              isToday={isSameDay(day, new Date())}
              onClick={() => onDateClick(day)}
              locale={locale}
            />
          );
        })}
      </div>
    );
  },
);

MonthDaysGrid.displayName = 'MonthDaysGrid';

const MonthCard = memo(
  ({
    month,
    eventsByDate,
    eventCount,
    yearViewConfig,
    onMonthClick,
    onEventClick,
    onDateClick,
    onQuickAdd,
    locale,
  }: MonthCardProps) => {
    const today = new Date();
    const isCurrentMonth =
      isSameMonth(month, today) && isSameYear(month, today);
    const hasEvents = eventCount > 0;

    const monthLabel = capitalize(format(month, 'MMMM', { locale }));
    const monthYearLabel = format(month, 'MMMM yyyy', { locale });

    return (
      <div
        className={cn(
          'group flex flex-col rounded-lg border p-3 shadow-sm transition-all',
          'hover:border-primary hover:shadow-md',
          isCurrentMonth &&
            yearViewConfig.highlightCurrentMonth &&
            'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10',
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'text-md flex h-auto items-center gap-1 p-0 font-medium hover:cursor-pointer',
                  isCurrentMonth && 'text-blue-600 dark:text-blue-400',
                  'transition-all hover:translate-x-0.5',
                )}
                onClick={() => {
                  onMonthClick(month);
                }}
              >
                {yearViewConfig.showMonthLabels && (
                  <span>{monthLabel}</span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Ver {monthYearLabel}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onQuickAdd(month)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Adicionar agendamento em {capitalize(monthLabel)}
            </TooltipContent>
          </Tooltip>
        </div>

        <MonthDaysGrid
          month={month}
          eventsByDate={eventsByDate}
          onDateClick={onDateClick}
          locale={locale}
        />

        {hasEvents && yearViewConfig.enableEventPreview ? (
          <div className="space-y-1 pt-1">
            {Object.entries(eventsByDate)
              .filter(([key]) => key.startsWith(format(month, 'yyyy-MM')))
              .slice(0, yearViewConfig.previewEventsPerMonth)
              .flatMap(([dateKey, events]) =>
                events.slice(0, 1).map((event) => {
                  const colorClasses = getColorClasses(event.color);
                  return (
                    <button
                      key={event.id}
                      className={cn(
                        'w-full truncate rounded-md px-2 py-1.5 text-left text-xs',
                        colorClasses?.bg,
                      )}
                      onClick={() => onEventClick(event)}
                    >
                      <span className="flex items-center text-white">
                        <span className="mr-1 font-medium">
                          {format(new Date(dateKey), 'd', { locale })}
                        </span>
                        {event.title}
                      </span>
                    </button>
                  );
                }),
              )}
            {eventCount > 3 && yearViewConfig.showMoreEventsIndicator && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent/40 mt-1 h-7 w-full justify-between px-2 py-1 text-xs"
                onClick={() =>
                  onMonthClick(
                    new Date(month.getFullYear(), month.getMonth(), 30),
                  )
                }
              >
                <span>Ver todos os {eventCount} agendamentos</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

MonthCard.displayName = 'MonthCard';

export { MonthCard };
