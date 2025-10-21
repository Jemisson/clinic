'use client'

import ConfirmDialog from '@/components/common/ConfirmDialog'
import ImageLightbox, {
  type LightboxItem,
} from '@/components/media/ImageLightbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import dayjs from '@/lib/dayjs'
import { PatientPhotosService } from '@/service/patient-photos'
import { PATIENT_PHOTO_LABEL_SHORT } from '@/types/patients.enums'
import type {
  PatientPhotoGroups,
  PatientPhotoLabel,
} from '@/types/patients.photos'
import { ImagePlus, Info, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import PatientPhotoDialog from './PatientPhotoDialog'

interface Props {
  patientId: string | number
}

export default function PatientPhotosCard({ patientId }: Props) {
  const {
    data: groups,
    error,
    isLoading,
    mutate,
  } = useSWR<PatientPhotoGroups, Error>(
    patientId ? (['patient_photos', patientId] as const) : null,
    async () => {
      const res = await PatientPhotosService.list(patientId)
      return res.data
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    },
  )

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [targetToDelete, setTargetToDelete] = useState<{
    id: number
    dateKey: string
    title?: string | null
    label?: string
  } | null>(null)

  const orderedDates = useMemo(() => {
    if (!groups) return []
    return Object.keys(groups).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
  }, [groups])

  async function handleSaved() {
    await mutate()
  }

  async function handleConfirmDelete() {
    if (!targetToDelete) return
    try {
      setDeleting(true)
      await PatientPhotosService.destroy(patientId, targetToDelete.id)
      setConfirmOpen(false)
      setTargetToDelete(null)
      await mutate()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Card className="border-none shadow-none p-0">
        <CardContent className="pt-4 px-0 text-muted-foreground">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-medium text-primary">
              Fotos do paciente
            </h3>

            <PatientPhotoDialog
              patientId={patientId}
              onSaved={handleSaved}
            >
              <Button
                size="sm"
                className="gap-2"
              >
                <ImagePlus className="h-4 w-4" />
                Nova imagem
              </Button>
            </PatientPhotoDialog>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground italic">
            <Info className="size-4 mt-0.5 flex-shrink-0" />
            <p className="mb-3 text-xs text-muted-foreground">
              Clique na data para abrir a página com as fotos do dia.
            </p>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground italic">
            <Info className="size-4 flex-shrink-0" />
            <p className="mb-3 text-xs text-muted-foreground">
              Clique em uma miniatura para ver em tamanho maior.
            </p>
          </div>

          {isLoading && (
            <p className="text-muted-foreground">Carregando fotos…</p>
          )}
          {error && (
            <p className="text-destructive">
              Erro: {error.message ?? 'Falha ao carregar fotos'}
            </p>
          )}

          {!isLoading && !error && (!groups || orderedDates.length === 0) && (
            <p className="text-muted-foreground">
              Em breve: galeria de fotos do paciente.
            </p>
          )}

          {!isLoading && !error && groups && orderedDates.length > 0 && (
            <div className="space-y-6">
              {orderedDates.map((date) => {
                const order: Record<PatientPhotoLabel, number> = {
                  before: 0,
                  after: 1,
                  named: 2,
                }
                const itemsSorted = [...groups[date]].sort(
                  (a, b) => order[a.label] - order[b.label],
                )

                const lightboxForDay: LightboxItem[] = itemsSorted.map((p) => {
                  const original = p.image_url
                  const medium = p.image_variants?.medium
                  const thumb = p.image_variants?.thumb
                  const best = original || medium || thumb || ''
                  const label = PATIENT_PHOTO_LABEL_SHORT[p.label]
                  const alt = p.title ?? label
                  return { src: best, alt }
                })

                return (
                  <section
                    key={date}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/pacientes/${patientId}/fotos/${date}`}
                        className="hover:underline"
                      >
                        {dayjs(date).format('DD/MM/YYYY')}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {itemsSorted.length} foto(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {itemsSorted.map((p, idx) => {
                        const thumb =
                          p.image_variants?.thumb ?? p.image_url ?? ''
                        const label = PATIENT_PHOTO_LABEL_SHORT[p.label]
                        const alt = p.title ?? label

                        return (
                          <div
                            key={p.id}
                            className="rounded-md border p-2"
                          >
                            <div className="relative">
                              {thumb ? (
                                <Image
                                  src={thumb}
                                  alt={alt}
                                  width={100}
                                  height={100}
                                  className="w-full h-28 object-cover rounded cursor-zoom-in"
                                  onClick={() => {
                                    setLightboxItems(lightboxForDay)
                                    setLightboxIndex(idx)
                                    setLightboxOpen(true)
                                  }}
                                />
                              ) : (
                                <div className="w-full h-28 bg-muted rounded" />
                              )}

                              <button
                                type="button"
                                aria-label="Excluir foto"
                                title="Excluir foto"
                                className="absolute top-1.5 right-1.5 inline-flex items-center justify-center rounded-md p-1.5
                                           bg-white/90 hover:bg-white shadow-sm
                                           text-red-600 hover:text-red-700
                                           transition focus:outline-none focus:ring-2 focus:ring-red-300"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setTargetToDelete({
                                    id: p.id,
                                    dateKey: date,
                                    title: p.title,
                                    label: label,
                                  })
                                  setConfirmOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-2 text-xs text-muted-foreground">
                              <span className="uppercase">{label}</span>
                              {p.title ? ` — ${p.title}` : null}
                              {p.captured_at && (
                                <span>
                                  {' '}
                                  — {dayjs(p.captured_at).format('HH:mm')}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        items={lightboxItems}
        initialIndex={lightboxIndex}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(o) => {
          if (!o && !deleting) setTargetToDelete(null)
          setConfirmOpen(o)
        }}
        targetStatus="inactive"
        entityLabel="foto"
        entityName={
          targetToDelete?.title
            ? `${targetToDelete.title}`
            : targetToDelete?.label
        }
        title="Excluir foto"
        confirmLabel="Excluir"
        deactivateDescription={
          <>
            Tem certeza que deseja <b>excluir</b> esta foto? Essa ação não pode
            ser desfeita depois.
          </>
        }
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
