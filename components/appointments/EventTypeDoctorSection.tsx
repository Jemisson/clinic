'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { UsersService } from '@/service/users'
import { AppointmentKind } from '@/types/appointment'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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
  const [doctorOpen, setDoctorOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [doctors, setDoctors] = useState<DoctorOption[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)

  const [selectedDoctorLabel, setSelectedDoctorLabel] = useState<string | null>(
    null,
  )

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === userId) ?? null,
    [doctors, userId],
  )

  useEffect(() => {
    if (selectedDoctor) {
      setSelectedDoctorLabel(selectedDoctor.name)
    }
  }, [selectedDoctor])

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 400)
    return () => window.clearTimeout(id)
  }, [query])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true)

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

        if (debouncedQuery.length >= 2) {
          params.q = debouncedQuery
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

        setDoctors(mapped)
      } catch (error) {
        console.error('Erro ao buscar médicos', error)
        setDoctors([])
      } finally {
        setLoadingDoctors(false)
      }
    }

    void fetchDoctors()
  }, [debouncedQuery])

  const handleSelectDoctor = (doctor: DoctorOption) => {
    onUserChange(doctor.id)
    setSelectedDoctorLabel(doctor.name)
    setDoctorOpen(false)
    setQuery('')
  }

  const handleDoctorOpenChange = (nextOpen: boolean) => {
    setDoctorOpen(nextOpen)

    if (!nextOpen) {
      setQuery('')
      setDebouncedQuery('')
    }
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

        <Popover
          modal
          open={doctorOpen}
          onOpenChange={handleDoctorOpenChange}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              )}
            >
              <span
                className={cn(
                  !selectedDoctorLabel && 'text-muted-foreground',
                )}
              >
                {selectedDoctorLabel ?? 'Selecione o(a) médico(a)'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command
              shouldFilter={false}
            >
              <CommandInput
                placeholder="Buscar médico(a) pelo nome..."
                value={query}
                onValueChange={setQuery}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                  }
                  e.stopPropagation()
                }}
              />

              <CommandList className="max-h-64 overflow-y-auto">
                {loadingDoctors && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}

                {!loadingDoctors && doctors.length === 0 && (
                  <CommandEmpty>
                    {debouncedQuery.length >= 2
                      ? 'Nenhum médico(a) ou técnico(a) encontrado.'
                      : 'Nenhum médico(a) ou técnico(a) carregado.'}
                  </CommandEmpty>
                )}

                {!loadingDoctors && doctors.length > 0 && (
                  <CommandGroup heading="Médicos(a) e Técnicos(as) disponíveis">
                    {doctors.map((doctor) => {
                      const isSelected = doctor.id === userId

                      return (
                        <CommandItem
                          key={doctor.id}
                          value={doctor.id}
                          onSelect={() => handleSelectDoctor(doctor)}
                          className="flex items-center gap-2"
                        >
                          <Check
                            className={cn(
                              'h-4 w-4',
                              isSelected ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          <span>{doctor.name}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
