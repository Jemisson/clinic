'use client'

import ClinicalProcedureUpsertDialog from '@/components/clinical-procedures/ClinicalProcedureUpsertDialog'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CustomPagination } from '@/lib/pagination'
import ClinicalProceduresService from '@/service/clinical-procedures'
import { ClinicalProcedureData } from '@/types/clinical-procedures'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'

interface DataTableProps {
  columns: (handlers: {
    onEdit: (proc: ClinicalProcedureData) => void
    onDelete: (proc: ClinicalProcedureData) => void
  }) => ColumnDef<ClinicalProcedureData, string>[]
}

export function DataTable({ columns }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [q, setQ] = useState('')
  const [query, setQuery] = useState('')
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const debounceMs = 500

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProcedure, setSelectedProcedure] =
    useState<ClinicalProcedureData | null>(null)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setQuery(q.trim()), debounceMs)
    return () => clearTimeout(id)
  }, [q])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [query])

  useEffect(() => {
    const input = inputSearchRef.current
    if (!input) return

    const handleSearch = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value === '') {
        setQ('')
        setQuery('')
      }
    }

    input.addEventListener('search', handleSearch)
    return () => input.removeEventListener('search', handleSearch)
  }, [])

  function openDelete(proc: ClinicalProcedureData) {
    setSelectedProcedure(proc)
    setIsDeleteOpen(true)
  }

  async function confirmDelete() {
    if (!selectedProcedure) return
    try {
      setDeleteLoading(true)
      await ClinicalProceduresService.destroy(selectedProcedure.id)
      await mutate()
      setIsDeleteOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setDeleteLoading(false)
    }
  }

  const openEdit = useCallback((proc: ClinicalProcedureData) => {
    setSelectedProcedure(proc)
    setIsDialogOpen(true)
  }, [])

  const cols = useMemo(
    () =>
      columns({
        onEdit: openEdit,
        onDelete: openDelete,
      }),
    [columns, openEdit],
  )

  function openCreate() {
    setSelectedProcedure(null)
    setIsDialogOpen(true)
  }

  // chave do SWR incluindo a query
  const swrKey = useMemo(
    () =>
      [
        'clinical_procedures',
        pagination.pageIndex,
        pagination.pageSize,
        query,
      ] as const,
    [pagination.pageIndex, pagination.pageSize, query],
  )

  const {
    data: procedures,
    isValidating,
    mutate,
  } = useSWR(swrKey, () =>
    ClinicalProceduresService.list({
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
      q: query || undefined,
    }),
  )

  const data = procedures?.data ?? []
  const meta = procedures?.meta ?? null

  const table = useReactTable({
    data,
    columns: cols,
    manualPagination: true,
    pageCount: meta?.total_pages ?? 0,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  })

  return (
    <div className="w-full p-6 flex flex-col gap-4 lg:max-w-7xl lg:mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Input
          type="search"
          placeholder="Filtrar Procedimentos..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          ref={inputSearchRef}
          className="lg:max-w-xs"
        />

        <div className="flex gap-4">
          <Button onClick={openCreate}>
            <Plus /> Adicionar Procedimento
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={cols.length}
                  className="h-24 text-center"
                >
                  {isValidating
                    ? 'Carregando...'
                    : 'Nenhum procedimento encontrado.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 items-center md:flex-row md:justify-between md:items-center">
        <small className="text-muted-foreground md:flex-1">
          Total de Procedimentos: {meta?.total_count}
        </small>

        <CustomPagination
          currentPage={meta?.current_page ?? 1}
          totalPages={meta?.total_pages ?? 1}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
          }
        />
      </div>

      <ClinicalProcedureUpsertDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        procedure={selectedProcedure}
        onSuccess={async () => { await mutate() }}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        targetStatus="inactive"
        entityLabel="procedimento"
        entityName={selectedProcedure?.attributes.name}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        deactivateDescription={
          <>
            Tem certeza que deseja excluir o procedimento{' '}
            <b>{selectedProcedure?.attributes.name}</b>? Essa ação não poderá
            ser desfeita.
          </>
        }
        activateDescription={null}
      />
    </div>
  )
}
