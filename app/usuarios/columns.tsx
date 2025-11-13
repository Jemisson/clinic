'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProfileUserData } from '@/types/users'
import { getInitials } from '@/utils/functions'
import { ColumnDef } from '@tanstack/react-table'
import * as LucideIcons from 'lucide-react'
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  CircleCheckBig,
  CircleOff,
  CircleUser,
  Eye,
  IdCardLanyard,
  KeyRound,
  Landmark,
  Menu,
  SquarePen,
} from 'lucide-react'

interface ColumnsHandlers {
  onRequestStatusChange: (
    user: ProfileUserData,
    target: 'active' | 'inactive',
  ) => void
  onEdit?: (user: ProfileUserData) => void
}

export const columns = ({
  onRequestStatusChange,
  onEdit,
}: ColumnsHandlers): ColumnDef<ProfileUserData>[] => [
  {
    id: 'user',
    accessorKey: 'user',
    enableHiding: false,
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === 'asc')}
        >
          <CircleUser /> <span>Usuário</span>
          {sorted === 'asc' ? (
            <ArrowUp />
          ) : sorted === 'desc' ? (
            <ArrowDown />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original.attributes.name
      const email = row.original.attributes.email
      const photo = row.original.attributes.photo_thumb_url
      return (
        <section className="flex gap-1 items-center">
          <Avatar>
            <AvatarImage
              src={photo ?? undefined}
              alt={user}
            />
            <AvatarFallback className="text-xs">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-sm">{user}</p>
            <small className="-mt-1">{email}</small>
          </div>
        </section>
      )
    },
  },
  {
    id: 'role',
    accessorKey: 'role',
    meta: { label: 'Papel' },
    enableHiding: true,
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === 'asc')}
        >
          <KeyRound /> <span>Tipo</span>
          {sorted === 'asc' ? (
            <ArrowUp />
          ) : sorted === 'desc' ? (
            <ArrowDown />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <span className="capitalize">{row.original.attributes.role}</span>
    ),
  },
  {
    id: 'sector',
    accessorKey: 'sector',
    meta: { label: 'Setor' },
    enableHiding: true,
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === 'asc')}
        >
          <Landmark /> <span>Setor</span>
          {sorted === 'asc' ? (
            <ArrowUp />
          ) : sorted === 'desc' ? (
            <ArrowDown />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
      )
    },
    cell: ({ row }) => <span>{row.original.attributes.sector}</span>,
  },
  {
    id: 'job_function',
    accessorKey: 'job_function',
    meta: { label: 'Função' },
    enableHiding: true,
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === 'asc')}
        >
          <IdCardLanyard /> <span>Função</span>
          {sorted === 'asc' ? (
            <ArrowUp />
          ) : sorted === 'desc' ? (
            <ArrowDown />
          ) : (
            <ChevronsUpDown />
          )}
        </Button>
      )
    },
    cell: ({ row }) => <span>{row.original.attributes.job_function}</span>,
  },
  {
    id: 'status',
    accessorKey: 'status',
    meta: { label: 'Status' },
    enableHiding: true,
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === 'asc')}
        >
          <LucideIcons.CircleCheckBig /> <span>Status</span>
          {sorted === 'asc' ? (
            <LucideIcons.ArrowUp />
          ) : sorted === 'desc' ? (
            <LucideIcons.ArrowDown />
          ) : (
            <LucideIcons.ChevronsUpDown />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.original.attributes.status
      return (
        <Badge
          variant={'outline'}
          className="border-none"
        >
          <span
            className={`size-1.5 rounded-full ${
              status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    enableHiding: false,
    header: () => (
      <Button variant={'ghost'}>
        <Menu /> <span>Ações</span>
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original
      const isActive = user.attributes.status === 'active'
      return (
        <div className="flex gap-1">
          <Button
            variant={'ghost'}
            size={'icon'}
            title="Visualizar"
          >
            <Eye />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Editar"
            onClick={() => onEdit?.(user)}
          >
            <SquarePen />
          </Button>
          <Button
            variant={'ghost'}
            size={'icon'}
            title={isActive ? 'Desativar' : 'Ativar'}
            onClick={() =>
              onRequestStatusChange(user, isActive ? 'inactive' : 'active')
            }
          >
            {isActive ? (
              <CircleOff className="text-destructive" />
            ) : (
              <CircleCheckBig className="text-green-600" />
            )}
          </Button>
        </div>
      )
    },
  },
]
