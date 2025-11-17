import {
  DashboardCards,
  DashboardSummary,
  VariationInfo,
} from '@/types/dashboard'

function safeSection(section?: VariationInfo | null): {
  value: number
  changePercent?: number
  changeText?: string
} {
  if (!section) {
    return {
      value: 0,
      changePercent: undefined,
      changeText: undefined,
    }
  }

  return {
    value: section.current ?? 0,
    changePercent: section.variation,
    changeText: 'vs mês passado',
  }
}

export function mapDashboardToCards(data: DashboardSummary): DashboardCards {
  const attrs = data.attributes

  const appointments = safeSection(attrs.appointments)
  const procedureAppointments = safeSection(attrs.procedure_appointments)
  const finances = safeSection(attrs.finances)
  const patients = safeSection(attrs.patients)

  return {
    appointments: {
      ...appointments,
      subtitle:
        attrs.appointments && attrs.appointments.previous != null
          ? `${attrs.appointments.current - attrs.appointments.previous} novos`
          : undefined,
    },
    procedureAppointments: {
      ...procedureAppointments,
    },
    finances: {
      ...finances,
    },
    patients: {
      ...patients,
    },
  }
}
