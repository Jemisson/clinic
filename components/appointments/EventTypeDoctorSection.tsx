'use client'

import { RemoteSearchCombobox } from '@/components/common/remote-search-combobox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UsersService } from '@/service/users'
import { AppointmentKind } from '@/types/appointment'

type DoctorOption = {
  id: string
  name: string
}

interface Props {
  kind: AppointmentKind
  onKindChange: (kind: AppointmentKind) => void
  userId: string
  onUserChange: (id: string) => void
}

export function EventTypeDoctorSection({
  kind,
  onKindChange,
  userId,
  onUserChange,
}: Props) {
  const loadDoctors = async (q: string): Promise<DoctorOption[]> => {
    const params: {
      page?: number
      per_page?: number
      q?: string
      role?: string
    } = {
      page: 1,
      per_page: 20,
      role: 'doctor',
    }

    if (q.trim().length >= 2) {
      params.q = q.trim()
    }

    const { data } = await UsersService.list(params)

    const mapped: DoctorOption[] =
      data?.map((user: any) => ({
        id: String(user.id),
        name:
          user.attributes?.person?.name ??
          user.attributes?.name ??
          user.name ??
          'Sem nome',
      })) ?? []

    return mapped
  }

  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="flex w-full flex-col space-y-2">
        <Label>Tipo de Agendamento</Label>
        <Select
          value={kind}
          onValueChange={(value) => onKindChange(value as AppointmentKind)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consultation">Consulta</SelectItem>
            <SelectItem value="procedure">Procedimento</SelectItem>
            <SelectItem value="block">Bloqueio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full flex-col space-y-2">
        <Label>Médico(a) ou Técnico(a)</Label>

        <RemoteSearchCombobox<DoctorOption>
          value={userId || null}
          onChange={(id, _doctor) => {
            onUserChange(id ?? '')
          }}
          loadItems={loadDoctors}
          getOptionValue={(doctor) => doctor.id}
          getOptionLabel={(doctor) => doctor.name}
          placeholder="Selecione o(a) médico(a)"
          searchPlaceholder="Buscar médico(a) ou Técnico(a) pelo nome..."
          emptyMessage="Nenhum médico(a) ou técnico(a) encontrado."
          minSearchChars={2}
          fetchOnEmpty={true}
        />
      </div>
    </div>
  )
}
