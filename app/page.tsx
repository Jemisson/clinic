'use client'

import { useEffect, useState } from 'react'
import DashboardService from '@/service/dashboard'
import { mapDashboardToCards } from '@/lib/dashboard'
import { DashboardCards } from '@/types/dashboard'
import { DashboardStatsSection } from '@/components/dashboard/DashboardStatsSection'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'
import { DashboardUnconfirmedAppointments } from '@/components/dashboard/DashboardUnconfirmedAppointments'
import { DashboardSchedule } from '@/components/dashboard/DashboardSchedule'

export default function HomePage() {
  const [summary, setSummary] = useState<DashboardCards | null>(null)

  useEffect(() => {
    async function load() {
      const response = await DashboardService.list()
      const mapped = mapDashboardToCards(response)

      setSummary(mapped)
    }

    load()
  }, [])

  useEffect(() => {
    if (summary) {
    }
  }, [summary])

  if (!summary) {
    return <div className="p-5">Carregando...</div>
  }

  return (
    <div className="flex gap-4 p-5">
      {/* Coluna principal */}
      <div className="flex flex-1 flex-col gap-4">
        <header>
          <h1 className="text-3xl font-semibold">Olá, Geisa!</h1>
        </header>

        {/* Totais (cards de estatísticas) */}
        <DashboardStatsSection summary={summary} />

        {/* Abaixo dos totais: quadrados verdes + lista lateral */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <DashboardQuickActions />
          <DashboardUnconfirmedAppointments />
        </div>
      </div>

      {/* Coluna lateral direita: agenda do dia */}
      <div className="hidden w-full max-w-xs lg:block">
        <DashboardSchedule />
      </div>
    </div>
  )
}
