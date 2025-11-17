'use client'

import { StatCard } from '@/components/common/StatCard'
import { mapDashboardToCards } from '@/lib/dashboard'
import DashboardService from '@/service/dashboard'
import { DashboardCards } from '@/types/dashboard'
import { CircleDollarSign, Clock3, Stethoscope, UserCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [summary, setSummary] = useState<DashboardCards | null>(null)

  useEffect(() => {
    async function load() {
      const response = await DashboardService.list()
      const mapped = mapDashboardToCards(response)

      setSummary(mapped)
      console.log('summary mapped', mapped)
    }

    load()
  }, [])

  useEffect(() => {
    if (summary) {
      console.log('summary state', summary)
    }
  }, [summary])

  if (!summary) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex flex-col gap-4 p-5">
      <h1 className="text-3xl font-semibold">Olá, Geisa!</h1>

      <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2 mt-2">
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
      </div>
    </div>
  )
}
