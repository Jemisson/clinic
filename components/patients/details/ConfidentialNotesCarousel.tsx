"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import dayjs from "dayjs"
import { ConfidentialNotesService, type ConfidentialNote } from "@/service/confidential-notes"
import { cn } from "@/lib/utils"

export default function ConfidentialNotesCarousel({ patientId }: { patientId: string | number }) {
  const [notes, setNotes] = useState<ConfidentialNote[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    ;(async () => {
      const res = await ConfidentialNotesService.list(patientId)
      setNotes(res ?? [])
      setIdx(0)
    })()
  }, [patientId])

  const total = notes.length
  const current = notes[idx] ?? null
  const dots = useMemo(() => Array.from({ length: total }, (_, i) => i), [total])

  if (!total) {
    return (
      <div>
        <h3 className="mb-2 text-xl font-medium">Observações</h3>
        <Card className="rounded-xl">
          <CardContent className="p-3 text-sm text-muted-foreground">
            Nenhuma observação confidencial.
          </CardContent>
        </Card>
      </div>
    )
  }

  const dateStr = dayjs(current?.attributes?.created_at).format("DD/MM/YYYY HH:mm")

  return (
    <div>
      <h3 className="mb-2 text-xl font-medium">Observações</h3>

      <Card className="rounded-xl">
        <CardHeader className="px-3 justify-between">
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="whitespace-nowrap">{dateStr}</span>
            <div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIdx((i) => (i - 1 + total) % total)}
                aria-label="Anterior"
                className="h-7 w-7"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIdx((i) => (i + 1) % total)}
                aria-label="Próxima"
                className="h-7 w-7"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1 px-3 pb-3">
          <div className="space-y-2">
            {current?.attributes?.title && (
              <div className="font-medium">{current.attributes.title}</div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {current?.attributes?.content}
            </p>
          </div>

          <div className="mt-3 flex justify-center gap-1">
            {dots.map((i) => (
              <button
                key={i}
                aria-label={`Ir para ${i + 1}`}
                onClick={() => setIdx(i)}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-opacity",
                  i === idx ? "bg-foreground opacity-90" : "bg-foreground/40 opacity-50"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
