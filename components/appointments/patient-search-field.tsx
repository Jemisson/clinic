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
import { cn } from '@/lib/utils'
import PatientsService from '@/service/patients'
import { PatientData, PatientResponse } from '@/types/patients'
import { Check, ChevronsUpDown, Loader2, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<PatientData[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  const selectedPatient = useMemo(
    () => results.find((p) => String(p.id) === value) ?? null,
    [results, value],
  )

  useEffect(() => {
    if (selectedPatient) {
      setSelectedLabel(selectedPatient.attributes.person?.name ?? 'Sem nome')
    }
  }, [selectedPatient])

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 400)
    return () => window.clearTimeout(id)
  }, [query])

  useEffect(() => {
    const doFetch = async () => {
      try {
        setLoading(true)

        const params: { page?: number; per_page?: number; q?: string } = {
          page: 1,
          per_page: 20,
        }

        if (debouncedQuery.length >= 2) {
          params.q = debouncedQuery
        }

        const data: PatientResponse = await PatientsService.list(params)
        setResults(data.data ?? [])
      } catch (error) {
        console.error('Erro ao buscar pacientes', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    void doFetch()
  }, [debouncedQuery])

  const handleSelect = (patient: PatientData) => {
    const id = String(patient.id)
    onChange(id, patient)
    setSelectedLabel(patient.attributes.person?.name ?? 'Sem nome')
    setOpen(false)
    setQuery('')
  }

  const getCpf = (patient: PatientData): string | undefined => {
    return (
      patient.attributes.person?.profile_user?.cpf ??
      patient.attributes.profile_user?.cpf ??
      undefined
    )
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (!nextOpen) {
      setQuery('')
      setDebouncedQuery('')
    }
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-xs text-red-500">*</span>}
      </Label>

      <Popover
        modal
        open={open}
        onOpenChange={handleOpenChange}
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
            <span className="flex items-center gap-2">
              <UserRound className="h-4 w-4 opacity-60" />
              <span
                className={cn(
                  !selectedLabel && 'text-muted-foreground',
                )}
              >
                {selectedLabel ?? 'Selecione o paciente'}
              </span>
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
              placeholder="Buscar paciente por nome ou CPF..."
              value={query}
              onValueChange={setQuery}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
                e.stopPropagation()
              }}
            />

            <CommandList className="max-h-60 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}

              {!loading && results.length === 0 && (
                <CommandEmpty>
                  {debouncedQuery.length >= 2
                    ? 'Nenhum paciente encontrado.'
                    : 'Nenhum paciente carregado.'}
                </CommandEmpty>
              )}

              {!loading && results.length > 0 && (
                <CommandGroup heading="Pacientes disponíveis">
                  {results.map((item) => {
                    const id = String(item.id)
                    const name =
                      item.attributes.person?.name ?? 'Sem nome'
                    const cpf = getCpf(item)
                    const isSelected = value === id

                    return (
                      <CommandItem
                        key={id}
                        value={id}
                        onSelect={() => handleSelect(item)}
                        className="flex items-start gap-2 py-2"
                      >
                        <Check
                          className={cn(
                            'mt-0.5 h-4 w-4',
                            isSelected
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{name}</span>
                          {cpf && (
                            <span className="text-xs text-muted-foreground">
                              CPF: {cpf}
                            </span>
                          )}
                        </div>
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
  )
}
