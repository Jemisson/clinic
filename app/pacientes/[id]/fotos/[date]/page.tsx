"use client"

import * as React from "react"
import useSWR from "swr"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import dayjs from "@/lib/dayjs"
import { PatientPhotosService } from "@/service/patient-photos"
import type {
  PatientPhotoFlat,
  PatientPhotoGroups,
  PatientPhotoLabel,
} from "@/types/patients.photos"
import { PATIENT_PHOTO_LABEL_SHORT } from "@/types/patients.enums"
import MagnifyImage from "@/components/media/MagnifyImage"
import ImageLightbox, { type LightboxItem } from "@/components/media/ImageLightbox"
import Image from "next/image"
import { useMemo, useState } from "react"

export default function PhotosByDatePage() {
  const params = useParams<{ id: string; date: string }>()
  const patientId = params.id
  const dateKey = params.date

  const [useLens, setUseLens] = useState(true)

  const { data: groups, error, isLoading } = useSWR<PatientPhotoGroups>(
    patientId ? (["patient_photos", patientId] as const) : null,
    async () => {
      const res = await PatientPhotosService.list(patientId)
      return res.data
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 2000 }
  )

  const items = useMemo<PatientPhotoFlat[] | null>(() => {
    if (!groups) return null
    const order: Record<PatientPhotoLabel, number> = { before: 0, after: 1, named: 2 }
    const arr = groups[dateKey] ?? []
    return [...arr].sort((a, b) => order[a.label] - order[b.label])
  }, [groups, dateKey])

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const lightboxItems = useMemo<LightboxItem[]>(() => {
    if (!items) return []
    return items.map((p) => ({
      src: p.image_url ?? p.image_variants?.medium ?? "",
      alt: p.title ?? PATIENT_PHOTO_LABEL_SHORT[p.label],
    }))
  }, [items])

  function openLightboxAt(i: number) {
    setLightboxIndex(i)
    setLightboxOpen(true)
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-4 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">
            Fotos de {dayjs(dateKey).format("DD/MM/YYYY")}
          </h1>
          <div className="flex items-center gap-2">
            <Switch id="lens-switch" checked={useLens} onCheckedChange={setUseLens} />
            <Label htmlFor="lens-switch" className="text-sm text-muted-foreground">
              Usar lente de zoom
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href={`/pacientes/${patientId}`} className="text-sm text-primary hover:underline">
            <b>Em breve:</b> Ver ficha do paciente
          </Link>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Carregando fotos…</p>}
      {error && (
        <p className="text-destructive">
          Erro ao carregar: {error instanceof Error ? error.message : "Falha"}
        </p>
      )}

      {!isLoading && !error && (!items || items.length === 0) && (
        <Card className="p-6">
          <p className="text-muted-foreground">Nenhuma foto encontrada para esta data.</p>
        </Card>
      )}

      {!isLoading && !error && items && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((p, i) => {
            const src = p.image_url
            const label = PATIENT_PHOTO_LABEL_SHORT[p.label]

            return (
              <figure key={p.id} className="rounded-lg border overflow-hidden bg-background">
                <figcaption className="p-3 border-b bg-muted/40">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase font-semibold tracking-wide text-foreground">{label}</span>
                    {p.title ? <span>— {p.title}</span> : null}
                    {p.captured_at ? <span>— {dayjs(p.captured_at).format("HH:mm")}</span> : null}
                  </div>
                </figcaption>

                {src ? (
                  useLens ? (
                    <div className="cursor-zoom-in" onClick={() => openLightboxAt(i)}>
                      <MagnifyImage
                        src={src}
                        alt={p.title ?? label}
                        zoom={3.2}
                        lensSize={200}
                        imgClassName="h-[480px] sm:h-[560px] object-cover"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <Image
                      src={src}
                      width={800}
                      height={800}
                      alt={p.title ?? label}
                      className="w-full h-[480px] sm:h-[560px] object-cover cursor-zoom-in"
                      onClick={() => openLightboxAt(i)}
                    />
                  )
                ) : (
                  <div className="w-full h-[480px] sm:h-[560px] bg-muted" />
                )}
              </figure>
            )
          })}
        </div>
      )}

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        items={lightboxItems}
        initialIndex={lightboxIndex}
      />
    </div>
  )
}
