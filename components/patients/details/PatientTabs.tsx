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
  Info,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import PatientPhotosCard from '../patient-photos/PatientPhotosCard'

export default function PatientTabs({ patient }: { patient: PatientData }) {
  const [tab, setTab] = useState<
    'general' | 'contacts' | 'address' | 'tags' | 'photos'
  >('general')

  const a = patient.attributes
  const p = a.person
  const address = p.addresses?.[0]
  const contacts = p.contacts ?? []
  const patientId = useMemo(
    () => patient?.attributes?.id ?? patient?.id ?? null,
    [patient],
  )

  return (
    <>
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
                    <span>Clique no número para enviar WhatsApp ou ligar.</span>
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
              {patientId != null ? (
                <PatientPhotosCard patientId={patientId} />
              ) : (
                <p className="text-muted-foreground">Paciente inválido.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
