'use client'

import ConfidentialNotesCarousel from '@/components/patients/details/ConfidentialNotesCarousel'
import PatientHero from '@/components/patients/details/PatientHero'
import PatientTabs from '@/components/patients/details/PatientTabs'
import PatientsService from '@/service/patients'
import type { PatientData } from '@/types/patients'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import TagBadges, { TagLike } from '@/components/tags/TagBadges'

export default function PatientDetailsPage() {
  const params = useParams()
  const id = String(params.id)
  const [patient, setPatient] = useState<PatientData | null>(null)
  

  useEffect(() => {
    ;(async () => {
      const data = await PatientsService.show(id)
      setPatient(data)
    })()
  }, [id])

  const tagItems: TagLike[] = useMemo(() => {
    if (!patient) return []
    const tags = patient.attributes.person?.tags ?? []
    return tags.map((t) => ({
      id: Number(t.id),
      name: t.name,
      icon: t.icon ?? undefined,
      status: t.status,
    }))
  }, [patient])

  if (!patient) return <div className="p-6">Carregando…</div>

  return (
    <div className="w-full">
      <div
        className="grid gap-4 px-4 sm:px-6 md:px-8"
        style={{ gridTemplateColumns: '1fr minmax(280px,320px)' }}
      >
        <div>
          <PatientHero patient={patient} />
          <PatientTabs patient={patient} />
        </div>

         <div className="pt-4 md:pt-6 space-y-4">
          <ConfidentialNotesCarousel patientId={patient.id} />

          <section>
            <h3 className="mb-2 text-xl font-medium">
              Interesses
            </h3>
            <TagBadges items={tagItems} size="sm" />
          </section>

          <section>
            <h1 className="mt-8 text-2xl font-medium">Últimos Atendimentos</h1>
            <p  className="mt-2 text-sm text-muted-foreground"><b>Em breve:</b> resumos dos últimos atendimentos do paciente</p>
          </section>
        </div>
      </div>

    </div>
  )
}
