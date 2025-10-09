"use client"

import { Controller, useFormContext } from "react-hook-form"
import { useCallback, useMemo, useState } from "react"
import useSWRInfinite from "swr/infinite"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { PatientFormValues } from "../schema"
import { TagsService } from "@/service/tags"
import type { TagData } from "@/types/tags"
import * as LucideIcons from "lucide-react"
import { SquareDashed } from "lucide-react"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 24

function toNum(id: string): number | null {
  const n = Number(id)
  return Number.isFinite(n) ? n : null
}

export function StepInterests() {
  const { control } = useFormContext<PatientFormValues>()
  const [q, setQ] = useState("")
  const [query, setQuery] = useState("")

  const onChangeQ = useCallback((val: string) => {
    setQ(val)
    clearTimeout((onChangeQ as any)._t)
    ;(onChangeQ as any)._t = setTimeout(() => setQuery(val.trim()), 350)
  }, [])

  const getKey = (pageIndex: number, previous: any) => {
    if (previous && previous.meta && pageIndex + 1 > previous.meta.total_pages) return null
    return ["tags", pageIndex + 1, query, status] as const
  }

  const { data, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    ([, page, qParam, tParam]) =>
      TagsService.list({
        page,
        per_page: PAGE_SIZE,
        q: qParam || undefined,
        t: "active",
      })
  )

  const pages = data ?? []
  const lastMeta = pages.at(-1)?.meta
  const items: TagData[] = useMemo(
    () => pages.flatMap((p) => p.data),
    [pages]
  )
  const reachedEnd = lastMeta ? lastMeta.current_page >= lastMeta.total_pages : true

  const tagMap = useMemo(() => {
    const m = new Map<number, TagData>()
    for (const t of items) {
      const n = toNum(t.id)
      if (n != null) m.set(n, t)
    }
    return m
  }, [items])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <Label>Buscar tags</Label>
          <Input
            type="search"
            placeholder="Digite para filtrar (nome, ícone)..."
            value={q}
            onChange={(e) => onChangeQ(e.target.value)}
          />
        </div>
      </div>

      <Controller
        control={control}
        name="person.tag_ids"
        render={({ field }) => {
          const selected: number[] = field.value ?? []
          return (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Selecionadas ({selected.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.length === 0 ? (
                  <span className="text-muted-foreground text-sm">Nenhuma tag selecionada.</span>
                ) : (
                  selected.map((id) => {
                    const t = tagMap.get(id)
                    const iconName = t?.attributes?.icon
                    const Icon = iconName ? (LucideIcons as any)[iconName] : null
                    return (
                      <Badge
                        key={id}
                        variant="default"
                        className="gap-1 cursor-pointer"
                        onClick={() => field.onChange(selected.filter((x) => x !== id))}
                        title="Clique para remover"
                      >
                        {Icon ? <Icon /> : <SquareDashed />}
                        {t?.attributes?.name ?? `Tag #${id}`}
                      </Badge>
                    )
                  })
                )}
              </div>
            </div>
          )
        }}
      />

      <Controller
        control={control}
        name="person.tag_ids"
        render={({ field }) => {
          const selected: number[] = field.value ?? []
          const toggle = (idNum: number) => {
            if (selected.includes(idNum)) {
              field.onChange(selected.filter((x) => x !== idNum))
            } else {
              field.onChange([...selected, idNum])
            }
          }

          return (
            <div className="flex flex-col gap-3">
              <div className="text-sm text-muted-foreground">Tags disponíveis</div>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => {
                  const idNum = toNum(t.id)
                  if (idNum == null) return null
                  const active = selected.includes(idNum)
                  const iconName = t.attributes.icon
                  const Icon = iconName ? (LucideIcons as any)[iconName] : null

                  return (
                    <Badge
                      key={t.id}
                      variant={active ? "default" : "outline"}
                      className={cn("gap-1 cursor-pointer", t.attributes.status === "inactive" && "opacity-70")}
                      onClick={() => toggle(idNum)}
                      title={active ? "Clique para remover" : "Clique para adicionar"}
                    >
                      {Icon ? <Icon /> : <SquareDashed />}
                      {t.attributes.name}
                    </Badge>
                  )
                })}
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isValidating || reachedEnd}
                  onClick={() => setSize(size + 1)}
                >
                  {reachedEnd ? "Fim da lista" : isValidating ? "Carregando..." : "Carregar mais"}
                </Button>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
