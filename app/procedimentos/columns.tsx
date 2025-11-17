'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClinicalProcedureData } from '@/types/clinical-procedures'
import { formatCurrencyBRL } from '@/utils/formatters'
import { ColumnDef } from '@tanstack/react-table'
import * as LucideIcons from 'lucide-react'

function intervalLabel(number: number, unit: 'day' | 'week' | 'month'): string {
  const map: Record<typeof unit, { singular: string; plural: string }> = {
    day: { singular: 'dia', plural: 'dias' },
    week: { singular: 'semana', plural: 'semanas' },
    month: { singular: 'mês', plural: 'meses' },
  }

  const { singular, plural } = map[unit]
  const label = number === 1 ? singular : plural

  return `${number} ${label}`
}

export const columns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (proc: ClinicalProcedureData) => void
  onDelete: (proc: ClinicalProcedureData) => void
}): ColumnDef<ClinicalProcedureData, string>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.Hash /> <span>ID</span>
              {sorted === 'asc' ? (
                <LucideIcons.ArrowUp />
              ) : sorted === 'desc' ? (
                <LucideIcons.ArrowDown />
              ) : (
                <LucideIcons.ChevronsUpDown />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    cell: ({ row }) => <span>P-{row.original.id}</span>,
  },
  {
    id: 'name',
    accessorFn: (row) => row.attributes.name,
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.Stethoscope /> <span>Procedimento</span>
              {sorted === 'asc' ? (
                <LucideIcons.ArrowUp />
              ) : sorted === 'desc' ? (
                <LucideIcons.ArrowDown />
              ) : (
                <LucideIcons.ChevronsUpDown />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    cell: ({ row }) => <span>{row.original.attributes.name}</span>,
  },
  {
    id: 'price',
    accessorFn: (row) => row.attributes.price,
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.Coins /> <span>Preço</span>
              {sorted === 'asc' ? (
                <LucideIcons.ArrowUp />
              ) : sorted === 'desc' ? (
                <LucideIcons.ArrowDown />
              ) : (
                <LucideIcons.ChevronsUpDown />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    cell: ({ row }) => (
      <span>{formatCurrencyBRL(row.original.attributes.price)}</span>
    ),
  },
  {
    id: 'sessions',
    accessorFn: (row) => String(row.attributes.sessions_count),
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.ListOrdered /> <span>Sessões</span>
              {sorted === 'asc' ? (
                <LucideIcons.ArrowUp />
              ) : sorted === 'desc' ? (
                <LucideIcons.ArrowDown />
              ) : (
                <LucideIcons.ChevronsUpDown />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    cell: ({ row }) => {
      const count = row.original.attributes.sessions_count
      return (
        <span>
          {count} sess{count > 1 ? 'ões' : 'ão'}
        </span>
      )
    },
  },
  {
    id: 'interval',
    accessorFn: (row) =>
      `${row.attributes.interval_number}_${row.attributes.interval_unit}`,
    header: () => (
      <Button variant="ghost">
        <LucideIcons.AlarmClock /> <span>Intervalo</span>
      </Button>
    ),
    cell: ({ row }) => {
      const { interval_number, interval_unit } = row.original.attributes
      return <span>{intervalLabel(interval_number, interval_unit)}</span>
    },
  },
  {
    id: 'actions',
    header: () => (
      <div className="flex items-center gap-2">
        <LucideIcons.Menu />
        <span>Ações</span>
      </div>
    ),
    cell: ({ row }) => {
      const proc = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Editar"
            onClick={() => onEdit(proc)}
            className="hover:bg-muted"
          >
            <LucideIcons.SquarePen className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Excluir"
            onClick={() => onDelete(proc)}
            className="hover:bg-destructive/10 text-destructive"
          >
            <LucideIcons.Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
