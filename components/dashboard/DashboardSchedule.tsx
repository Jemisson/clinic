import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'

export function DashboardSchedule() {
  return (
    <aside className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="h-4 w-4 text-emerald-700" />
          <span>Hoje</span>
        </div>
        {/* Quando você tiver a data dinâmica, pode trocar isso */}
        <span className="text-xs text-muted-foreground">27 de Junho</span>
      </div>

      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Agenda do dia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Em breve você poderá visualizar aqui a sua agenda detalhada do dia
            com horários, pacientes e procedimentos.
          </p>

          {/* placeholder de alguns slots de agenda */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="rounded-md border bg-muted/40 px-3 py-2 text-xs"
              >
                <div className="mb-1 h-3 w-20 rounded bg-muted-foreground/25" />
                <div className="h-3 w-32 rounded bg-muted-foreground/15" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
