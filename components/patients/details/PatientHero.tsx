'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import pattern from '@/public/pattern.jpg'
import type { PatientData } from '@/types/patients'
import { formatAddress, formatCPF } from '@/utils/formatters'
import dayjs from 'dayjs'
import { CalendarDays, IdCard, MapPin } from 'lucide-react'
import Image from 'next/image'
import { PatientAge } from '../age'

function initials(name?: string | null) {
  if (!name) return '—'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '')).toUpperCase()
}

function age(birth?: string | null, until?: string | null) {
  if (!birth) return null
  const from = dayjs(birth)
  const to = until ? dayjs(until) : dayjs()
  return to.diff(from, 'year')
}

export default function PatientHero({ patient }: { patient: PatientData }) {
  const a = patient.attributes
  const person = a.person ?? {}
  const photo = person.photo_thumb_url || ''
  const name = person.name || '—'
  const addr = formatAddress(person.addresses?.[0])
  const ageNum = age(a.birthdate, a.death_date)

  return (
    <section className="relative">
      <div className="relative h-24 sm:h-28 md:h-32 overflow-hidden rounded-b-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/60 z-10" />
        {photo ? (
          <Image
            src={photo}
            alt=""
            width={600}
            height={400}
            className="absolute inset-0 h-full w-full object-cover object-top blur-md scale-110 opacity-80"
          />
        ) : (
          <Image
            src={pattern}
            alt="background pattern"
            fill
            width={600}
            height={400}
            className="object-cover blur-md scale-110 opacity-60"
            priority
          />
        )}
        <div className="absolute top-2 right-3 z-20  px-3 py-1  text-xs sm:text-sm font-medium text-foreground">
          0 procedimentos
        </div>
      </div>

      <div className="relative z-20 -mt-10 px-4 sm:px-6 md:px-8">
        <div className="flex items-end gap-4">
          <Avatar className="size-20 sm:size-24 ring-2 ring-background shadow-md">
            <AvatarImage
              src={photo || undefined}
              alt={name}
            />
            <AvatarFallback className="text-lg">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="pb-1 flex-1">
          <div className="flex flex-col justify-start gap-3 ">
            <div className="inline-flex items-center gap-2 text-sm">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {name}
              </h1>
              <span className=" gap-2 text-sm text-muted-foreground pt-2">
                {dayjs(a.birthdate).format('DD/MM/YYYY')}
              </span>
            </div>

            {ageNum != null && a.birthdate && (
              <span className="font-bold inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                <PatientAge
                  birthdate={a.birthdate}
                  until={a.death_date}
                  compact={false}
                />
              </span>
            )}
          </div>

          <div className="flex flex-col">
            {addr && (
              <div className="mt-2 inline-flex items-center gap-1 text-bold text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>{addr}</span>
              </div>
            )}

            {a.cpf && (
              <div className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <IdCard className="size-4" />
                <span>CPF: {formatCPF(a.cpf)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
