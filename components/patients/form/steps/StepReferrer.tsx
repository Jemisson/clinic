"use client"

import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import type { PatientFormValues } from "../schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import PatientsService from "@/service/patients"
import type { PatientData } from "@/types/patients"

type ReferrerItem = {
  personId: number
  name: string
  avatar?: string
}

export function StepReferrer({
  initialReferrerName,
}: {
  initialReferrerName?: string
}) {
  const { register, setValue, watch } = useFormContext<PatientFormValues>()
  const referrerId = watch("referrer_person_id")

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ReferrerItem[]>([])
  const [selected, setSelected] = useState<ReferrerItem | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const idNum = Number(referrerId)
    if (!idNum || Number.isNaN(idNum)) return
    if (selected?.personId === idNum) return

    if (initialReferrerName) {
      const s: ReferrerItem = { personId: idNum, name: initialReferrerName, avatar: undefined }
      setSelected(s)
      setQuery(initialReferrerName)
      setOpen(false)
    }
  }, [referrerId, initialReferrerName, selected?.personId])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setItems([])
      return
    }
    const t = setTimeout(async () => {
      try {
        setLoading(true)
        const { data } = await PatientsService.list({ q, per_page: 8 })
        const mapped: ReferrerItem[] = (data as PatientData[])
          .map((p) => ({
            personId: Number(p.attributes.person?.id),
            name: p.attributes.person?.name ?? "",
            avatar:
              p.attributes.person?.photo_thumb_url ||
              p.attributes.person?.photo_url ||
              undefined,
          }))
          .filter((i) => !!i.personId && !!i.name)
        setItems(mapped)
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const initials = (name?: string | null) => {
    if (!name) return "—"
    const parts = name.trim().split(/\s+/)
    return ((parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase() || "—"
  }

  const handlePick = (it: ReferrerItem) => {
    setSelected(it)
    setQuery(it.name)
    setValue("referrer_person_id", it.personId, { shouldDirty: true })
    setOpen(false)
    inputEl.current?.blur()
  }

  const clearSelection = () => {
    setSelected(null)
    setQuery("")
    setValue("referrer_person_id", null, { shouldDirty: true })
    setItems([])
    setOpen(false)
    inputEl.current?.focus()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="hidden" {...register("referrer_person_id")} />

      <div ref={containerRef} className="relative">
        <Label>Indicação do paciente:</Label>
        <div className="flex gap-2 mt-2">
          <Input
            ref={inputEl}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => query.trim().length >= 2 && setOpen(true)}
            placeholder="Digite o nome da pessoa..."
            autoComplete="off"
          />
          {selected && (
            <Button type="button" variant="outline" onClick={clearSelection}>
              Limpar
            </Button>
          )}
        </div>

        {open && (items.length > 0 || loading) && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow">
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">Buscando…</div>
            )}
            {!loading &&
              items.map((it) => (
                <button
                  key={it.personId}
                  type="button"
                  onClick={() => handlePick(it)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent"
                  )}
                >
                  <Avatar className="size-6">
                    <AvatarImage src={it.avatar} alt={it.name} />
                    <AvatarFallback>{initials(it.name)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{it.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">ID: {it.personId}</span>
                </button>
              ))}
            {!loading && items.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</div>
            )}
          </div>
        )}

        {(selected || initialReferrerName) && (
          <div className="mt-2 flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{selected?.name ?? initialReferrerName}</span>
              <span className="text-xs text-muted-foreground">
                Pessoa ID: {referrerId ?? "—"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
