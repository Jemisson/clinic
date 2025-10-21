"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useFormContext, useFieldArray, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { fetchAddressByCep, onlyDigits } from "@/utils/cep"

export function StepAddress() {
  const { control, setValue, watch } = useFormContext()
  const { fields, append } = useFieldArray({
    control,
    name: "person.addresses_attributes",
  })

  useEffect(() => {
    if (fields.length === 0) {
      append({
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "Brasil",
        zip_code: "",
        observation: "",
        _destroy: false,
      })
    }
  }, [fields.length, append])

  const [loadingCep, setLoadingCep] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  const lastCepRef = useRef<string | null>(null)

  const cepValue = watch("person.addresses_attributes.0.zip_code") as string

  const doLookup = useCallback(async (cleanCep?: string) => {
    const clean = cleanCep ?? onlyDigits(cepValue ?? "")
    if (clean.length !== 8) return

    try {
      setCepError(null)
      setLoadingCep(true)
      const addr = await fetchAddressByCep(clean)
      setValue("person.addresses_attributes.0.street", addr.street, { shouldValidate: true })
      setValue("person.addresses_attributes.0.neighborhood", addr.neighborhood, { shouldValidate: true })
      setValue("person.addresses_attributes.0.city", addr.city, { shouldValidate: true })
      setValue("person.addresses_attributes.0.state", addr.state, { shouldValidate: true })
      lastCepRef.current = clean
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Falha ao buscar o CEP."
      setCepError(msg)
    } finally {
      setLoadingCep(false)
    }
  }, [cepValue, setValue])

  useEffect(() => {
    const clean = onlyDigits(cepValue ?? "")
    if (clean.length !== 8 || clean === lastCepRef.current || loadingCep) return
    const id = setTimeout(() => { void doLookup(clean) }, 500)
    return () => clearTimeout(id)
  }, [cepValue, doLookup, loadingCep])

  if (fields.length === 0) return null
  const idx = 0

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-0">
        <Controller
          name={`person.addresses_attributes.${idx}.zip_code` as const}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="addr_zip">CEP</Label>
              <Input
                id="addr_zip"
                {...field}
                inputMode="numeric"
                placeholder={loadingCep ? "Buscando endereço..." : "Somente números"}
                aria-invalid={!!(fieldState.error || cepError)}
                className={cn(
                  (fieldState.error || cepError) && "border-destructive focus-visible:ring-destructive",
                  loadingCep && "opacity-80"
                )}
                disabled={loadingCep}
              />
              {fieldState.error && (
                <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
              )}
              {!fieldState.error && cepError && (
                <p className="text-xs text-destructive mt-1">{cepError}</p>
              )}
            </div>
          )}
        />

        <Controller
          name={`person.addresses_attributes.${idx}.street` as const}
          control={control}
          render={({ field, fieldState }) => (
            <div className="md:col-span-2">
              <Label htmlFor="addr_street">Rua</Label>
              <Input
                id="addr_street"
                {...field}
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
          name={`person.addresses_attributes.${idx}.number` as const}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="addr_number">Número</Label>
              <Input
                id="addr_number"
                {...field}
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
          name={`person.addresses_attributes.${idx}.neighborhood` as const}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="addr_neighborhood">Bairro</Label>
              <Input
                id="addr_neighborhood"
                {...field}
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
          name={`person.addresses_attributes.${idx}.city` as const}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="addr_city">Cidade</Label>
              <Input
                id="addr_city"
                {...field}
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
          name={`person.addresses_attributes.${idx}.state` as const}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Label htmlFor="addr_state">UF</Label>
              <Input
                id="addr_state"
                {...field}
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
          name={`person.addresses_attributes.${idx}.observation` as const}
          control={control}
          render={({ field }) => (
            <div className="md:col-span-2">
              <Label htmlFor="addr_obs">Observação</Label>
              <Input id="addr_obs" {...field} />
            </div>
          )}
        />
      </div>
    </div>
  )
}
