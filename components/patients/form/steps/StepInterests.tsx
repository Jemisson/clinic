'use client'

import TagBadges, { TagLike } from '@/components/tags/TagBadges'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TagsService } from '@/service/tags'
import type { TagData } from '@/types/tags'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import useSWRInfinite from 'swr/infinite'
import { PatientFormValues } from '../schema'

const PAGE_SIZE = 24

function toNum(id: string | number): number | null {
  const n = Number(id)
  return Number.isFinite(n) ? n : null
}

type TagsListMeta = {
  current_page: number
  total_pages: number
}
type TagsListResponse = {
  data: TagData[]
  meta: TagsListMeta
}

export function StepInterests() {
  const { control } = useFormContext<PatientFormValues>()
  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onChangeQ = useCallback((val: string) => {
    setQ(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQuery(val.trim()), 350)
  }, [])

  const getKey = (pageIndex: number, previous: TagsListResponse | null) => {
    if (previous && previous.meta && pageIndex + 1 > previous.meta.total_pages) {
      return null
    }
    return ['tags', pageIndex + 1, query, 'active'] as const
  }

  const { data, setSize, isValidating } = useSWRInfinite<TagsListResponse, Error>(
    getKey,
    async (_tag: 'tags', page: number, qParam: string) => {
      return TagsService.list({
        page,
        per_page: PAGE_SIZE,
        q: qParam || undefined,
        t: 'active',
      })
    }
  )

  const items: TagData[] = useMemo(() => {
    if (!data) return []
    return data.flatMap((p) => p.data)
  }, [data])

  const lastMeta = data?.at(-1)?.meta
  const reachedEnd = lastMeta ? lastMeta.current_page >= lastMeta.total_pages : true

  const tagCacheRef = useRef<Map<number, TagData>>(new Map())
  useEffect(() => {
    const cache = tagCacheRef.current
    for (const t of items) {
      const idNum = toNum(t.id)
      if (idNum != null && !cache.has(idNum)) cache.set(idNum, t)
    }
  }, [items])

  const getTag = (idNum: number): TagData | undefined => {
    return tagCacheRef.current.get(idNum)
  }

  const availableTagItems: TagLike[] = useMemo(
    () =>
      items.map((t) => ({
        id: Number(t.id),
        name: t.attributes.name,
        icon: t.attributes.icon ?? undefined,
        status: t.attributes.status as 'active' | 'inactive',
      })),
    [items],
  )

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

          const selectedItems: TagLike[] = selected.map((id) => {
            const t = getTag(id)
            return t
              ? {
                  id,
                  name: t.attributes.name,
                  icon: t.attributes.icon ?? undefined,
                  status: t.attributes.status as 'active' | 'inactive',
                }
              : { id, name: `Tag #${id}` }
          })

          return (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Selecionadas ({selected.length})
              </div>

              <TagBadges
                items={selectedItems}
                selectedIds={selected}
                onToggle={(id) => field.onChange(selected.filter((x) => x !== id))}
                size="md"
              />

              {selected.length === 0 && (
                <span className="text-muted-foreground text-sm">
                  Nenhuma tag selecionada.
                </span>
              )}
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

              <TagBadges
                items={availableTagItems}
                selectedIds={selected}
                onToggle={toggle}
                size="md"
              />

              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isValidating || reachedEnd}
                  onClick={() => setSize((s) => s + 1)}
                >
                  {reachedEnd
                    ? 'Fim da lista'
                    : isValidating
                    ? 'Carregando...'
                    : 'Carregar mais'}
                </Button>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
