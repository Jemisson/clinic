import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardUnconfirmedAppointments() {
  return (
    <section>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-base font-semibold">
            Agendamentos não confirmados
          </CardTitle>

          <button
            type="button"
            className="text-xs font-medium text-emerald-700 hover:underline"
          >
            Ver todos
          </button>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Em breve você verá aqui uma lista com os agendamentos que ainda não
            foram confirmados, com ações rápidas para reagendar ou ligar para o
            paciente.
          </p>

          {/* Linhas placeholder para dar sensação de lista */}
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-xs"
              >
                <span className="h-3 w-1/2 rounded bg-muted-foreground/20" />
                <span className="h-3 w-16 rounded bg-muted-foreground/15" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
