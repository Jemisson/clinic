'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type RemoteSearchComboboxProps<TItem> = {
  value: string | null
  onChange: (value: string | null, item: TItem | null) => void

  loadItems: (query: string) => Promise<TItem[]>

  getOptionValue: (item: TItem) => string
  getOptionLabel: (item: TItem) => string
  getOptionDescription?: (item: TItem) => string | undefined

  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string

  minSearchChars?: number
  fetchOnEmpty?: boolean

  triggerClassName?: string
  triggerLeftContent?: React.ReactNode
  modal?: boolean
}

export function RemoteSearchCombobox<TItem>({
  value,
  onChange,
  loadItems,
  getOptionValue,
  getOptionLabel,
  getOptionDescription,
  placeholder = 'Selecione uma opção',
  searchPlaceholder = 'Digite para buscar...',
  emptyMessage = 'Nenhum resultado encontrado.',
  minSearchChars = 2,
  fetchOnEmpty = true,
  triggerClassName,
  triggerLeftContent,
  modal = true,
}: RemoteSearchComboboxProps<TItem>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [items, setItems] = useState<TItem[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  const selectedItem = useMemo(
    () => items.find((item) => getOptionValue(item) === (value ?? '')) ?? null,
    [items, value, getOptionValue],
  )

  useEffect(() => {
    if (selectedItem) {
      setSelectedLabel(getOptionLabel(selectedItem))
    }
  }, [selectedItem, getOptionLabel])

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 400)
    return () => window.clearTimeout(id)
  }, [query])

  useEffect(() => {
    if (!open) return
    if (!fetchOnEmpty) return

    if (items.length === 0 && debouncedQuery === '') {
      ;(async () => {
        try {
          setLoading(true)
          const result = await loadItems('')
          setItems(result)
        } catch (error) {
          console.error('Erro ao carregar itens base', error)
          setItems([])
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const run = async () => {
      try {
        setLoading(true)

        if (debouncedQuery === '') {
          if (fetchOnEmpty) {
            const result = await loadItems('')
            setItems(result)
          }
          return
        }

        if (debouncedQuery.length < minSearchChars) return

        const result = await loadItems(debouncedQuery)
        setItems(result)
      } catch (error) {
        console.error('Erro ao buscar itens', error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    void run()
  }, [debouncedQuery, open, fetchOnEmpty, loadItems, minSearchChars])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery('')
      setDebouncedQuery('')
    }
  }

  const handleSelect = (item: TItem) => {
    const id = getOptionValue(item)
    onChange(id, item)
    setSelectedLabel(getOptionLabel(item))
    setOpen(false)
    setQuery('')
  }

  return (
    <Popover
      modal={modal}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'flex w-full items-center justify-between',
            'border bg-background px-3 py-2 text-sm font-normal',
            !selectedLabel && 'text-muted-foreground',
            triggerClassName,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            {triggerLeftContent}
            <span className="truncate">{selectedLabel ?? placeholder}</span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
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
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            {!loading && items.length === 0 && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}

            {!loading && items.length > 0 && (
              <CommandGroup>
                {items.map((item) => {
                  const id = getOptionValue(item)
                  const label = getOptionLabel(item)
                  const description = getOptionDescription?.(item)
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
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{label}</span>
                        {description && (
                          <span className="text-xs text-muted-foreground">
                            {description}
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
  )
}
