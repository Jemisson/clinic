import { Card, CardContent } from '@/components/ui/card'
import { id } from 'date-fns/locale'
import { CalendarCheck2, FileText, Stethoscope, UserPlus2 } from 'lucide-react'

const actions = [
  {
    id: 1,
    title: 'Agendar Paciente',
    icon: UserPlus2,
  },
  {
    id: 2,
    title: 'Cadastrar Procedimento',
    icon: Stethoscope,
  },
  {
    id: 3,
    title: 'Cadastrar Paciente',
    icon: CalendarCheck2,
  },
  {
    id: 4,
    title: 'Consultar Relatório',
    icon: FileText,
  },
]

export function DashboardQuickActions() {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {actions.map((action) => (
        <Card
          key={action.id}
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
