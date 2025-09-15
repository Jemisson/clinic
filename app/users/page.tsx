// app/users/page.tsx
'use client'

import { useEffect, useState } from 'react'
import UsersService from '@/service/users'
import type { User } from '@/types'
import { DataTable } from './data-table'
import { userColumns } from './columns'
import { useDebounce } from 'use-debounce'

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ total_count: number; total_pages: number; current_page: number; per_page: number } | null>(null)

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  useEffect(() => {
    let active = true

    const fetchPage = async () => {
      setLoading(true)
      setError(null)
      try {
        const { users, meta } = await UsersService.list({
          page,
          per_page: perPage,
          q: search,
        })
        if (!active) return
        setRows(users)
        setMeta(meta)
      } catch (err: any) {
        if (!active) return
        setError(err?.message ?? 'Falha ao carregar usuários')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchPage()

    return () => {
      active = false
    }
  }, [page, perPage, debouncedSearch])

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

      <DataTable
        columns={userColumns}
        data={rows}
        loading={loading}
        totalCount={meta?.total_count ?? 0}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={(n) => { setPerPage(n); setPage(1) }}
        searchValue={search}
        onSearchChange={(value) => { setSearch(value); setPage(1) }}
        searchPlaceholder="Buscar por nome, email, cpf, setor, função ou papel..."
      />
    </div>
  )
}
