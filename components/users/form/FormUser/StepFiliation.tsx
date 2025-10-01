"use client"

import { useFormContext, Controller, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Undo2, CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import dayjs from "dayjs"
import { cn } from "@/lib/utils"
import type { UserFormInput } from "./index"

const EDUCATION_OPTIONS = [
  { value: "fundamental", label: "Fundamental" },
  { value: "medio",       label: "Médio" },
  { value: "superior",    label: "Superior" },
] as const
type Education = typeof EDUCATION_OPTIONS[number]["value"]

export default function StepFiliation() {
  const { control, register, setValue, getValues, watch } = useFormContext<UserFormInput>()

  const { fields, append, remove } = useFieldArray<UserFormInput, "children">({
    control,
    name: "children",
  })

  const appendEmptyChild = () => {
    append({
      _destroy: false,
      name: "",
      education: undefined as unknown as Education,
      birthDate: "",
    } as any)
  }

  const handleDelete = (index: number) => {
    const id = getValues(`children.${index}.id`)
    if (id) {
      // existente: marca para destruir
      setValue(`children.${index}._destroy`, true, { shouldDirty: true })
    } else {
      // novo: remove de fato
      remove(index)
    }
  }

  const handleUndo = (index: number) => {
    setValue(`children.${index}._destroy`, false, { shouldDirty: true })
  }

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          Nenhum filho adicionado.
          <div className="mt-3">
            <Button type="button" onClick={appendEmptyChild}>
              <Plus className="mr-2" /> Adicionar filho
            </Button>
          </div>
        </div>
      ) : null}

      {fields.map((field, index) => {
        const isDeleted = watch(`children.${index}._destroy` as const) === true
        const hasId = !!watch(`children.${index}.id` as const)

        // inputs ocultos para id / _destroy sempre irem no payload
        const HiddenIds = (
          <>
            {hasId && (
              <input
                type="hidden"
                {...register(`children.${index}.id` as const, { valueAsNumber: true })}
              />
            )}
            <input type="hidden" {...register(`children.${index}._destroy` as const)} />
          </>
        )

        // se marcado para exclusão, mostra cartão resumido com "Desfazer"
        if (isDeleted) {
          return (
            <Card key={field.id} className="p-4 flex items-center justify-between bg-muted/40 border-dashed">
              {HiddenIds}
              <div className="text-sm line-through opacity-70">
                Filho removido {hasId ? "(existente)" : "(novo)"}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => handleUndo(index)}>
                <Undo2 className="mr-2 h-4 w-4" /> Desfazer
              </Button>
            </Card>
          )
        }

        return (
          <Card key={field.id} className="p-4 space-y-4">
            {HiddenIds}

            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filho #{index + 1}</h4>
              <Button type="button" variant="outline" size="icon" onClick={() => handleDelete(index)}>
                <Trash2 />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Nome */}
              <FormField
                control={control}
                name={`children.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Escolaridade */}
              <FormField
                control={control}
                name={`children.${index}.education`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escolaridade</FormLabel>
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EDUCATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Nascimento */}
              <Controller
                control={control}
                name={`children.${index}.birthDate`}
                render={({ field }) => {
                  const selectedDate = field.value
                    ? dayjs(field.value, "YYYY-MM-DD").toDate()
                    : undefined

                  return (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? dayjs(field.value).format("DD/MM/YYYY") : <span>Selecione a Data</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          </Card>
        )
      })}

      {fields.length > 0 ? (
        <div className="flex justify-center">
          <Button type="button" variant="secondary" onClick={appendEmptyChild}>
            <Plus className="mr-2" /> Adicionar mais um
          </Button>
        </div>
      ) : null}
    </div>
  )
}
