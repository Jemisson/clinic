import { Card, CardContent } from '@/components/ui/card'
import { CalendarCheck2, FileText, Stethoscope, UserPlus2 } from 'lucide-react'

const actions = [
  {
    title: 'Cadastrar Paciente',
    icon: UserPlus2,
  },
  {
    title: 'Cadastrar Procedimento',
    icon: Stethoscope,
  },
  {
    title: 'Agendar Paciente',
    icon: CalendarCheck2,
  },
  {
    title: 'Consultar Relatório',
    icon: FileText,
  },
]

export function DashboardQuickActions() {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="flex cursor-default flex-col items-center justify-center rounded-2xl bg-emerald-900 text-center text-emerald-50 transition hover:bg-emerald-800"
        >
          <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700/60">
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">{action.title}</span>
            <span className="text-xs text-emerald-100/70">
              Em breve essa ação estará disponível.
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
