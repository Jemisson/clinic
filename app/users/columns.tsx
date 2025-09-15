// app/users/columns.tsx
'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { User } from '@/types'

const formatDate = (s?: string) => {
  if (!s) return '—'
  const d = new Date(s)
  return isNaN(d.getTime()) ? s : d.toLocaleDateString('pt-BR')
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
    enableSorting: false,
  },
  {
    accessorKey: 'sector',
    header: 'Setor',
    enableSorting: true,
  },
  {
    accessorKey: 'job_function',
    header: 'Função',
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: 'Papel',
    enableSorting: true,
  },
  {
    id: 'birthdate',
    header: 'Nascimento',
    accessorFn: (row) => row.birthdate,
    cell: ({ getValue }) => formatDate(getValue() as string),
    enableSorting: true,
  },
  {
    id: 'children_count',
    header: 'Filhos',
    accessorFn: (row) => row.children?.length ?? 0,
    enableSorting: true,
  },
]
