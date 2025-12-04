import { appointmentKindValues, appointmentStatusValues } from '@/types/appointment'
import { z } from 'zod'

export const appointmentFormSchema = z
  .object({
    kind: z.enum(appointmentKindValues),

    status: z.enum(appointmentStatusValues),

    date: z.string().min(1, 'Data é obrigatória.'),
    startTime: z.string().min(1, 'Horário de início é obrigatório.'),

    durationMinutes: z
      .number({
        message: 'Duração deve ser um número.',
      })
      .int()
      .positive('Duração deve ser maior que zero.'),

    userId: z.string().min(1, 'Médico(a) é obrigatório.'),

    patientId: z.string().nullable(),

    firstVisit: z.boolean().default(false),
    isReturn: z.boolean().default(false),
    aestheticEvaluation: z.boolean().default(false),

    onlineBooking: z.boolean().default(false),
    onlineBookingLink: z.string().trim().optional().nullable(),

    informFacility: z.boolean().default(false),
    facilityItemId: z.string().nullable(),

    repeatEnabled: z.boolean().default(false),
    repeatEndDate: z.string().nullable(),
    repeatDays: z.array(z.string()).default([]),

    notes: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const isConsultationLike =
      data.kind === 'consultation' || data.kind === 'procedure'

    if (isConsultationLike && !data.patientId) {
      ctx.addIssue({
        code: 'custom',
        path: ['patientId'],
        message: 'Paciente é obrigatório.',
      })
    }

    if (data.informFacility && !data.facilityItemId) {
      ctx.addIssue({
        code: 'custom',
        path: ['facilityItemId'],
        message:
          'Sala de atendimento é obrigatória quando o campo está habilitado.',
      })
    }

    if (data.kind === 'block' && data.repeatEnabled) {
      if (!data.repeatEndDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['repeatEndDate'],
          message: 'Data final é obrigatória para bloqueio com repetição.',
        })
      }
      if (!data.repeatDays || data.repeatDays.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['repeatDays'],
          message: 'Selecione ao menos um dia para repetição.',
        })
      }
    }
  })

export type AppointmentFormValues = z.input<typeof appointmentFormSchema>
