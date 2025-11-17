export interface VariationInfo {
  current: number
  previous: number
  variation: number
}

export interface DashboardPeriod {
  current_month: string
  previous_month: string
}

export interface DashboardAttributes {
  period: DashboardPeriod
  appointments: VariationInfo
  procedure_appointments: VariationInfo
  finances: VariationInfo
  patients: VariationInfo
}

export interface DashboardSummary {
  id: string
  type: string
  attributes: DashboardAttributes
}

export interface DashboardCardMetrics {
  value: number
  changePercent?: number
  changeText?: string
  subtitle?: string
}

export interface DashboardCards {
  appointments: DashboardCardMetrics
  procedureAppointments: DashboardCardMetrics
  finances: DashboardCardMetrics
  patients: DashboardCardMetrics
}
