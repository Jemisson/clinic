"use client"

import * as LucideIcons from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { useEffect, useState } from "react"
import { PatientFormValues } from "../schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BLOOD_TYPE_OPTIONS, GENDER_OPTIONS, CIVIL_STATUS_OPTIONS } from "@/types/patients.enums"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

export function StepPersonal() {
  const {
    control,
    register,
    watch,
    getValues,
    clearErrors,
  } = useFormContext<PatientFormValues>()

  const noCpf = watch("no_cpf")
  const [openBirth, setOpenBirth] = useState(false)
  const [openDeath, setOpenDeath] = useState(false)

  const toYMDLocal = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }
  const fromYMD = (s?: string | null) => {
    if (!s) return undefined
    const [y, m, d] = s.split("-").map(Number)
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  }
  const formatBR = (s?: string | null) => {
    const d = fromYMD(s)
    if (!d) return "dd/mm/aaaa"
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const yy = d.getFullYear()
    return `${dd}/${mm}/${yy}`
  }

  useEffect(() => {
    if (noCpf) clearErrors("cpf")
  }, [noCpf, clearErrors])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Controller
        name="person.name"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <Label htmlFor="person.name">Nome</Label>
            <Input
              id="person.name"
              {...field}
              aria-invalid={!!fieldState.error}
              className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
              placeholder="Nome completo"
            />
            {fieldState.error && (
              <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="naturalness"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <Label htmlFor="naturalness">Naturalidade</Label>
            <Input
              id="naturalness"
              {...field}
              placeholder="Cidade natal"
              aria-invalid={!!fieldState.error}
              className={cn(fieldState.error && "border-destructive focus-visible:ring-destructive")}
            />
            {fieldState.error && (
              <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="birthdate"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <Label htmlFor="birthdate">Data de nascimento</Label>

            <Popover open={openBirth} onOpenChange={setOpenBirth}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-between",
                    fieldState.error && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!fieldState.error}
                >
                  <span className={cn(!field.value && "text-muted-foreground")}>
                    {formatBR(field.value)}
                  </span>
                  <LucideIcons.Calendar className="ml-2 h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromYMD(field.value)}
                  onSelect={(d) => {
                    if (d) field.onChange(toYMDLocal(d))
                    else field.onChange("")
                    setOpenBirth(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {fieldState.error && (
              <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />


      <div>
        <Label htmlFor="rg">RG</Label>
        <Input id="rg" {...register("rg")} />
      </div>

      <Controller
        name="cpf"
        control={control}
        rules={{
          validate: (v) => {
            const semCpf = getValues("no_cpf")
            if (semCpf) return true
            return (v && String(v).trim().length > 0) || "Informe o CPF ou marque “Sem CPF”."
          },
        }}
        render={({ field, fieldState }) => (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...field}
                disabled={noCpf}
                placeholder="Somente números"
                aria-invalid={!!fieldState.error}
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive",
                  noCpf && "opacity-70 cursor-not-allowed"
                )}
              />
              {fieldState.error && (
                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
              )}
            </div>

            <div className="pt-6">
              <Label className="flex items-center gap-2" htmlFor="no_cpf">
                <Controller
                  name="no_cpf"
                  control={control}
                  render={({ field }) => (
                    <Switch id="no_cpf" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                Sem CPF
              </Label>
            </div>
          </div>
        )}
      />

      <Controller
        name="blood_type"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <Label>Tipo Sanguíneo</Label>
            <Select value={field.value ?? undefined} onValueChange={field.onChange}>
              <SelectTrigger
                aria-invalid={!!fieldState.error}
                className={cn('w-full', fieldState.error && "border-destructive focus-visible:ring-destructive")}
              >
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <Label>Gênero</Label>
            <Select value={field.value ?? undefined} onValueChange={field.onChange}>
              <SelectTrigger
                aria-invalid={!!fieldState.error}
                className={cn('w-full', fieldState.error && "border-destructive focus-visible:ring-destructive")}
              >
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="civil_status"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <Label>Estado civil</Label>
            <Select value={field.value ?? undefined} onValueChange={field.onChange}>
              <SelectTrigger
                aria-invalid={!!fieldState.error}
                className={cn('w-full', fieldState.error && "border-destructive focus-visible:ring-destructive")}
              >
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {CIVIL_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />

      <div className="md:col-span-2">
        <Label htmlFor="occupation">Ocupação</Label>
        <Input id="occupation" {...register("occupation")} />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="spouse_name">Nome do cônjuge</Label>
        <Input id="spouse_name" {...register("spouse_name")} />
      </div>

      <div>
        <Label htmlFor="death_date">Data de óbito</Label>

        <Controller
          name="death_date"
          control={control}
          render={({ field }) => (
            <Popover open={openDeath} onOpenChange={setOpenDeath}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span className={cn(!field.value && "text-muted-foreground")}>
                    {formatBR(field.value)}
                  </span>
                  <LucideIcons.Calendar className="ml-2 h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromYMD(field.value)}
                  onSelect={(d) => {
                    if (d) field.onChange(toYMDLocal(d))
                    else field.onChange("")
                    setOpenDeath(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>

    </div>
  )
}
