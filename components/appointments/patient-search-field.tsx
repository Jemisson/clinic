'use client'

import { RemoteSearchCombobox } from '@/components/common/remote-search-combobox'
import { Label } from '@/components/ui/label'
import PatientsService from '@/service/patients'
import { PatientData, PatientResponse } from '@/types/patients'
import { UserRound } from 'lucide-react'

type PatientSearchFieldProps = {
  label?: string
  value: string | null
  onChange: (patientId: string | null, patient: PatientData | null) => void
  required?: boolean
}

export function PatientSearchField({
  label = 'Paciente',
  value,
  onChange,
  required = true,
}: PatientSearchFieldProps) {
  const loadPatients = async (q: string): Promise<PatientData[]> => {
    const params: { page?: number; per_page?: number; q?: string } = {
      page: 1,
      per_page: 20,
    }

    if (q.trim().length >= 2) {
      params.q = q.trim()
    }

    const data: PatientResponse = await PatientsService.list(params)
    return data.data ?? []
  }

  const getCpf = (patient: PatientData): string | undefined => {
    return (
      patient.attributes.person?.profile_user?.cpf ??
      patient.attributes.profile_user?.cpf ??
      undefined
    )
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-xs text-red-500">*</span>}
      </Label>

      <RemoteSearchCombobox<PatientData>
        value={value}
        onChange={onChange}
        loadItems={loadPatients}
        getOptionValue={(patient) => String(patient.id)}
        getOptionLabel={(patient) =>
          patient.attributes.person?.name ?? 'Sem nome'
        }
        getOptionDescription={(patient) => {
          const cpf = getCpf(patient)
          return cpf ? `CPF: ${cpf}` : undefined
        }}
        placeholder="Selecione o paciente"
        searchPlaceholder="Buscar paciente por nome ou CPF..."
        emptyMessage="Nenhum paciente encontrado."
        minSearchChars={2}
        fetchOnEmpty={true}
        triggerLeftContent={<UserRound className="h-4 w-4 opacity-60" />}
      />
    </div>
  )
}
