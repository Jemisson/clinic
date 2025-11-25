import { StatCard } from '@/components/common/StatCard'
import { DashboardCards } from '@/types/dashboard'
import { CircleDollarSign, Clock3, Stethoscope, UserCheck } from 'lucide-react'

type DashboardStatsSectionProps = {
  summary: DashboardCards
}

export function DashboardStatsSection({ summary }: DashboardStatsSectionProps) {
  return (
    <section className="mt-2 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <StatCard
        title="Agendamento"
        value={summary.appointments.value}
        changePercent={summary.appointments.changePercent}
        changeText={summary.appointments.changeText}
        subtitle={summary.appointments.subtitle}
        icon={Clock3}
        iconBgClassName="bg-purple-100"
        iconClassName="text-purple-600"
      />

      <StatCard
        title="Procedimentos"
        value={summary.procedureAppointments.value}
        changePercent={summary.procedureAppointments.changePercent}
        changeText={summary.procedureAppointments.changeText}
        icon={Stethoscope}
        iconBgClassName="bg-rose-100"
        iconClassName="text-rose-600"
      />

      <StatCard
        title="Finanças"
        value={summary.finances.value.toLocaleString('pt-BR')}
        valuePrefix="R$"
        changePercent={summary.finances.changePercent}
        changeText={summary.finances.changeText}
        icon={CircleDollarSign}
        iconBgClassName="bg-amber-100"
        iconClassName="text-amber-600"
      />

      <StatCard
        title="Pacientes"
        value={summary.patients.value}
        changePercent={summary.patients.changePercent}
        changeText={summary.patients.changeText}
        icon={UserCheck}
        iconBgClassName="bg-emerald-100"
        iconClassName="text-emerald-600"
      />
    </section>
  )
}
