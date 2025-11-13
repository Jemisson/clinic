'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ClinicalProceduresService, {
  ClinicalProcedurePayload,
} from '@/service/clinical-procedures'
import { ClinicalProcedureData } from '@/types/clinical-procedures'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CurrencyInput } from '@/components/form/CurrencyInput'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  procedure: ClinicalProcedureData | null
  onSuccess?: () => Promise<void> | void
}

type FormValues = ClinicalProcedurePayload

export default function ClinicalProcedureUpsertDialog({
  open,
  onOpenChange,
  procedure,
  onSuccess,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      price: '',
      sessions_count: 1,
      interval_number: 1,
      interval_unit: 'week',
    },
  })

  useEffect(() => {
    if (procedure) {
      const attrs = procedure.attributes
      reset({
        name: attrs.name,
        price: attrs.price,
        sessions_count: attrs.sessions_count,
        interval_number: attrs.interval_number,
        interval_unit: attrs.interval_unit,
      })
    } else {
      reset({
        name: '',
        price: '',
        sessions_count: 1,
        interval_number: 1,
        interval_unit: 'week',
      })
    }
  }, [procedure, reset])

  async function onSubmit(values: FormValues) {
    if (procedure) {
      await ClinicalProceduresService.update(procedure.id, values)
    } else {
      await ClinicalProceduresService.create(values)
    }

    if (onSuccess) await onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {procedure ? 'Editar Procedimento' : 'Novo Procedimento'}
          </DialogTitle>
        </DialogHeader>

        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Limpeza de Pele Profunda"
              {...register('name', { required: true })}
            />
          </div>

          <CurrencyInput
            control={control}
            name="price"
            label="Preço"
            placeholder="Ex: 155,99"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sessions_count">Nº de sessões</Label>
              <Input
                id="sessions_count"
                type="number"
                min={1}
                {...register('sessions_count', {
                  valueAsNumber: true,
                  required: true,
                  min: 1,
                })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="interval_number">Intervalo</Label>
              <Input
                id="interval_number"
                type="number"
                min={1}
                {...register('interval_number', {
                  valueAsNumber: true,
                  required: true,
                  min: 1,
                })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Unidade</Label>
              <Select
                onValueChange={(value) =>
                  setValue(
                    'interval_unit',
                    value as FormValues['interval_unit'],
                  )
                }
                defaultValue={procedure?.attributes.interval_unit ?? 'week'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {procedure ? 'Salvar alterações' : 'Criar procedimento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
