'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEventCalendarStore } from '@/hooks/use-event';
import { formatDate } from '@/lib/date';
import { useMemo } from 'react';
import { Events, TimeFormatType } from '@/types/event';
import { EventCard } from './ui/events';
import { getLocaleFromCode } from '@/lib/event';
import { useShallow } from 'zustand/shallow';
import AppointmentService from '@/service/appointment-service';
import { toast } from 'sonner';

const EmptyState = () => (
  <div className="text-muted-foreground py-12 text-center">
    Nenhum agendamento para este dia.
  </div>
);

const EventListContent = ({
  events,
  timeFormat,
  onEventClick,
}: {
  events: Events[];
  timeFormat: TimeFormatType;
  onEventClick: (event: Events) => void | Promise<void>;
}) => (
  <ScrollArea className="h-[400px] w-full rounded-md">
    <div className="flex flex-col gap-2">
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            timeFormat={timeFormat}
            onClick={() => onEventClick(event)}
          />
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  </ScrollArea>
);

export function MonthDayEventsDialog() {
  const {
    openAppointmentEdit,
    closeDayEventsDialog,
    timeFormat,
    dayEventsDialog,
    locale,
  } = useEventCalendarStore(
    useShallow((state) => ({
      openAppointmentEdit: state.openAppointmentEdit,
      closeDayEventsDialog: state.closeDayEventsDialog,
      timeFormat: state.timeFormat,
      dayEventsDialog: state.dayEventsDialog,
      locale: state.locale,
    })),
  );

  const localeObj = getLocaleFromCode(locale);

  const formattedDate = useMemo(
    () =>
      dayEventsDialog.date &&
      formatDate(dayEventsDialog.date, 'EEEE, d MMMM yyyy', {
        locale: localeObj,
      }),
    [dayEventsDialog.date, localeObj],
  );

  const handleEventClick = async (event: Events) => {
    try {
      const appointmentId = Number(event.id);
      const appointment = await AppointmentService.show(appointmentId);

      closeDayEventsDialog();

      openAppointmentEdit(appointment);
    } catch (error) {
      console.error('Erro ao carregar agendamento para edição:', error);
      toast.error('Não foi possível carregar o agendamento para edição.');
    }
  };

  return (
    <Dialog open={dayEventsDialog.open} onOpenChange={closeDayEventsDialog}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle>
            Agendamentos de {formattedDate && <span>{formattedDate}</span>}
          </DialogTitle>
          <DialogDescription>
            Lista de todos os agendamentos deste dia.
          </DialogDescription>
        </DialogHeader>

        <EventListContent
          events={dayEventsDialog.events}
          timeFormat={timeFormat}
          onEventClick={handleEventClick}
        />

        <DialogFooter>
          <Button variant="outline" onClick={closeDayEventsDialog}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
