import AgendaClient from "@/components/agenda/AgendaClient";
import { Suspense } from "react";

export default function AgendaPage() {
  return(
   <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-sm text-muted-foreground">
            Carregando agenda...
          </span>
        </div>
      }
    >
      <AgendaClient />
    </Suspense>
  )
}
