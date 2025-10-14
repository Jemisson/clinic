'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
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
import { PatientPhotosService } from '@/service/patient-photos'
import {
  CreateOrUpdatePatientPhotoInput,
  PatientPhotoLabel,
} from '@/types/patients.photos'
import { toOffsetDateTime } from '@/utils/formatters'
import clsx from 'clsx'
import { CalendarDays, Clock, ImagePlus, Upload } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

interface Props {
  patientId: string | number
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSaved?: () => void | Promise<void>
}

export default function PatientPhotoDialog({
  patientId,
  children,
  open,
  onOpenChange,
  onSaved,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [label, setLabel] = useState<PatientPhotoLabel>('before')
  const [title, setTitle] = useState('')

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`
  })

  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving] = useState(false)
  const canSave = !!file

  function pad(n: number) {
    return String(n).padStart(2, '0')
  }

  function toLocalInputString(date: Date, timeHHmm: string) {
    const [hh, mm] = timeHHmm.split(':').map(Number)
    const d = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hh ?? 0,
      mm ?? 0,
      0,
      0,
    )
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate(),
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  function reset() {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setLabel('before')
    setTitle('')
    const now = new Date()
    setSelectedDate(now)
    setSelectedTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`)
  }

  function handleFile(f: File | null) {
    setFile(f)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  async function handleSave() {
    if (!file) return
    try {
      setSaving(true)

      const localInput =
        selectedDate && selectedTime
          ? toLocalInputString(selectedDate, selectedTime)
          : undefined

      const values: CreateOrUpdatePatientPhotoInput = {
        image: file,
        label,
        title: label === 'named' ? title.trim() || undefined : undefined,
        captured_at: localInput ? toOffsetDateTime(localInput) : undefined,
      }

      await PatientPhotosService.create(patientId, values)
      await onSaved?.()

      setInternalOpen(false)
      onOpenChange?.(false)
      reset()
    } finally {
      setSaving(false)
    }
  }

  const Trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button
        size="sm"
        className="gap-2"
      >
        <ImagePlus className="h-4 w-4" />
        Nova imagem
      </Button>
    </DialogTrigger>
  )

  return (
    <Dialog
      open={open ?? internalOpen}
      onOpenChange={(o) => {
        setInternalOpen(o)
        if (!o) reset()
        onOpenChange?.(o)
      }}
    >
      {Trigger}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar imagem do paciente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div className="space-y-2">
            <Label>Imagem</Label>
            <label
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={clsx(
                'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition',
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 hover:bg-muted/40',
              )}
              htmlFor="patient-photo-input"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-48 rounded-md object-contain"
                />
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-2 opacity-70" />
                  <p className="text-sm text-muted-foreground">
                    Arraste e solte a imagem aqui, ou clique para selecionar.
                  </p>
                </>
              )}
            </label>
            <Input
              id="patient-photo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-2 sm:col-span-1">
              <Label>Tipo da imagem</Label>
              <Select value={label} onValueChange={(v) => setLabel(v as PatientPhotoLabel)}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Antes</SelectItem>
                  <SelectItem value="after">Depois</SelectItem>
                  <SelectItem value="named">Outra (especificar)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Data/Hora da captura
              </Label>

              <div className="grid grid-cols-[1fr_auto] gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-full min-w-0 justify-start font-normal"
                    >
                      <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
                      {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Selecione a data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex items-center">
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="h-10 w-[96px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {label === 'named' && (
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                placeholder="Ex.: Perfil esquerdo / Cicatriz 2cm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setInternalOpen(false)
              onOpenChange?.(false)
            }}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !canSave || (label === 'named' && !title.trim()) || saving
            }
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
