"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import dayjs from "dayjs"
import { ConfidentialNotesService, type ConfidentialNote } from "@/service/confidential-notes"
import { cn } from "@/lib/utils"
import ConfidentialNoteDialog from "./ConfidentialNoteDialog"

export default function ConfidentialNotesCarousel({ patientId }: { patientId: string | number }) {
  const [notes, setNotes] = useState<ConfidentialNote[]>([])
  const [idx, setIdx] = useState(0)
  const [openNew, setOpenNew] = useState(false)

  const fetchNotes = useCallback(async () => {
    const res = await ConfidentialNotesService.list(patientId)
    setNotes(res ?? [])
    setIdx(0)
  }, [patientId])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const total = notes.length
  const current = notes[idx] ?? null
  const dots = useMemo(() => Array.from({ length: total }, (_, i) => i), [total])
  const dateStr = current?.attributes?.created_at
    ? dayjs(current.attributes.created_at).format("DD/MM/YYYY HH:mm")
    : ""

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-medium">Observações</h3>

        <ConfidentialNoteDialog
          patientId={patientId}
          open={openNew}
          onOpenChange={setOpenNew}
          onSaved={fetchNotes}
        >
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Nova observação
          </Button>
        </ConfidentialNoteDialog>
      </div>

      <Card className="rounded-xl">
        {total === 0 ? (
          <CardContent className="p-3 text-sm text-muted-foreground">
            Nenhuma observação confidencial.
          </CardContent>
        ) : (
          <>
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
          </>
        )}
      </Card>
    </div>
  )
}
