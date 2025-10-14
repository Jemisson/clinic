'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PatientData } from '@/types/patients'
import { CIVIL_STATUS_LABEL, GENDER_LABEL } from '@/types/patients.enums'
import { formatAddress, formatCPF, formatPhone } from '@/utils/formatters'
import {
  Briefcase,
  CalendarDays,
  Camera,
  HeartHandshake,
  IdCard,
  ImagePlus,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  Tag,
  User,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import PatientPhotoDialog from '../patient-photos/PatientPhotoDialog'
import { Button } from '@/components/ui/button'
import { PatientPhotosService } from '@/service/patient-photos'
import { PatientPhoto } from '@/types/patients.photos'

export default function PatientTabs({ patient }: { patient: PatientData }) {
  const [photos, setPhotos] = useState<PatientPhoto[] | null>(null)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [photosError, setPhotosError] = useState<string | null>(null)
  const [tab, setTab] = useState<'general' | 'contacts' | 'address' | 'tags' | 'photos'>('general')

  const a = patient.attributes
  const p = a.person
  const address = p.addresses?.[0]
  const contacts = p.contacts ?? []
  const tags = p.tags ?? []

  const patientId = useMemo(
    () => patient?.attributes?.id ?? patient?.id ?? null,
    [patient]
  )

  async function loadPhotos(id: string | number) {
    try {
      setLoadingPhotos(true)
      setPhotosError(null)
      const result = await PatientPhotosService.list(id)
      setPhotos(result.data)
    } catch (e: any) {
      setPhotosError(e?.message ?? "Falha ao carregar fotos")
    } finally {
      setLoadingPhotos(false)
    }
  }

  async function handlePhotosSaved() {
    if (patientId == null) return
    await loadPhotos(patientId)
  }

  useEffect(() => {
    if (patientId == null) return
    loadPhotos(patientId)
  }, [patientId])

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as typeof tab)}
      className="w-full mt-4 px-4 sm:px-6 md:px-8"
    >
      <TooltipProvider>
        <div className="flex justify-start">
          <TabsList className="flex h-full items-center gap-1 bg-muted/60 p-1.5 rounded-lg w-fit shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="general"
                  className="
                    group
                    aria-selected:bg-primary aria-selected:text-white
                    rounded-md p-2 transition-all duration-300
                    flex items-center justify-center
                  "
                >
                  <User className="size-5 group-aria-selected:text-white" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Geral</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="contacts"
                  className="
                    group
                    aria-selected:bg-primary aria-selected:text-white
                    rounded-md p-2 transition-all duration-300
                    flex items-center justify-center
                  "
                >
                  <Phone className="size-5 group-aria-selected:text-white" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Contatos</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="address"
                  className="
                    group
                    aria-selected:bg-primary aria-selected:text-white
                    rounded-md p-2 transition-all duration-300
                    flex items-center justify-center
                  "
                >
                  <MapPin className="size-5 group-aria-selected:text-white" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Endereço</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="photos"
                  className="
                    group
                    aria-selected:bg-primary aria-selected:text-white
                    rounded-md p-2 transition-all duration-300
                    flex items-center justify-center
                  "
                >
                  <Camera className="size-5 group-aria-selected:text-white" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Fotos</TooltipContent>
            </Tooltip>
          </TabsList>
        </div>
      </TooltipProvider>

      <TabsContent value="general">
        <Card className="border-none shadow-none p-0">
          <CardContent className="pt-4 px-0 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span>
                <strong>Naturalidade:</strong> {a.naturalness || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              <span>
                <strong>Data de Nascimento:</strong> {a.birthdate || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="size-4 text-muted-foreground" />
              <span>
                <strong>Estado civil:</strong>{' '}
                {a.civil_status
                  ? CIVIL_STATUS_LABEL[
                      a.civil_status as keyof typeof CIVIL_STATUS_LABEL
                    ]
                  : '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span>
                <strong>Gênero:</strong>{' '}
                {a.gender
                  ? GENDER_LABEL[a.gender as keyof typeof GENDER_LABEL]
                  : '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-muted-foreground" />
              <span>
                <strong>Profissão:</strong> {a.occupation || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IdCard className="size-4 text-muted-foreground" />
              <span>
                <strong>CPF:</strong> {formatCPF(a.cpf)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span>
                <strong>Indicado por:</strong> {a.referrer || '—'}
              </span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="address">
        <Card className="border-none shadow-none p-0">
          <CardContent className="pt-4 px-0 space-y-2">
            {address ? (
              <>
                <div>{formatAddress(address)}</div>
                {address.observation && (
                  <p className="text-muted-foreground text-sm italic">
                    {address.observation}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                Nenhum endereço cadastrado.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contacts">
        <Card className="border-none shadow-none p-0">
          <CardContent className="pt-4 px-0 space-y-4">
            {contacts.length ? (
              <>
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="space-y-1 border-b pb-2 last:border-none"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>
                        <strong>Telefone:</strong>{' '}
                        {c.phone ? (
                          <a
                            href={`tel:${c.phone}`}
                            className="text-primary hover:underline"
                          >
                            {formatPhone(c.phone)}
                          </a>
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageCircle className="size-4 text-green-600" />
                      <span>
                        <strong>Celular:</strong>{' '}
                        {c.cellphone ? (
                          <a
                            href={`https://wa.me/55${c.cellphone.replace(
                              /\D/g,
                              '',
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {formatPhone(c.cellphone)}
                          </a>
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-2 pt-3 text-xs text-muted-foreground italic">
                  <Info className="size-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Clique no número para enviar uma mensagem pelo WhatsApp ou
                    fazer uma ligação.
                  </span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Nenhum contato cadastrado.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="photos">
        <Card className="border-none shadow-none p-0">
          <CardContent className="pt-4 px-0 text-muted-foreground">
             <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Fotos do paciente</h3>

                <PatientPhotoDialog
                  patientId={patientId as number}
                  onSaved={handlePhotosSaved}
                >
                  <Button size="sm" className="gap-2">
                    <ImagePlus className="h-4 w-4" />
                    Nova imagem
                  </Button>
                </PatientPhotoDialog>
              </div>

              {loadingPhotos && (
                <p className="text-muted-foreground">Carregando fotos…</p>
              )}

              {photosError && (
                <p className="text-destructive">Erro: {photosError}</p>
              )}

              {!loadingPhotos && !photosError && (!photos || photos.length === 0) && (
                <p className="text-muted-foreground">
                  Em breve: galeria de fotos do paciente.
                </p>
              )}

              {!loadingPhotos && !photosError && photos && photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((p) => {
                    const src =
                      p.attributes.image_variants?.thumb ??
                      p.attributes.image_url ??
                      ""
                    return (
                      <div key={p.id} className="rounded-md border p-2">
                        {src ? (
                          <img
                            src={src}
                            alt={p.attributes.title ?? p.attributes.label}
                            className="w-full h-28 object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-28 bg-muted rounded" />
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span className="uppercase">{p.attributes.label}</span>
                          {p.attributes.title ? ` — ${p.attributes.title}` : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
