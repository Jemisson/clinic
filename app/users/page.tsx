// app/users/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import UsersService from '@/service/users'
import type { User } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export default function UsersPage() {
  const fetched = useRef(false)
  const [rows, setRows] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ total_count: number; total_pages: number; current_page: number; per_page: number } | null>(null)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    ;(async () => {
      try {
        const { users, meta } = await UsersService.list({ page: 1, per_page: 10 })
        setRows(users)
        setMeta(meta)
      } catch (err: any) {
        setError(err?.message ?? 'Falha ao carregar usuários')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const formatDate = (s?: string) => {
    if (!s) return '—'
    const d = new Date(s)
    return isNaN(d.getTime()) ? s : d.toLocaleDateString('pt-BR')
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Usuários</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Setor</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Nascimento</TableHead>
            <TableHead>Filhos</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            // linhas de loading
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                <TableCell colSpan={8}>
                  {Skeleton ? (
                    <Skeleton className="h-6 w-full" />
                  ) : (
                    <div className="h-6 w-full animate-pulse rounded bg-gray-200" />
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-sm text-muted-foreground">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.cpf}</TableCell>
                <TableCell>{u.sector}</TableCell>
                <TableCell>{u.job_function}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{formatDate(u.birthdate)}</TableCell>
                <TableCell>{u.children?.length ?? 0}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* rodapé simples com meta */}
      {meta && (
        <div className="text-sm text-muted-foreground">
          Mostrando {rows.length} de {meta.total_count} • Página {meta.current_page} de {meta.total_pages}
        </div>
      )}
    </div>
  )
}
