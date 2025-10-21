"use client"

import FormPatient from "@/components/patients/form/FormPatient"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { CustomPagination } from "@/lib/pagination"
import PatientsService from "@/service/patients"
import { PatientData, PatientResponse } from "@/types/patients"
import {
  Column,
  ColumnDef, flexRender, getCoreRowModel, getSortedRowModel,
  PaginationState, SortingState, useReactTable, VisibilityState,
} from "@tanstack/react-table"
import { Plus, Settings2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"

function humanizeId(id: string) {
  return id
    .replace(/[_\-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
function getColumnMenuLabel<TData>(col: Column<TData, unknown>): string {
  const metaLabel = (col?.columnDef?.meta as { label?: string } | undefined)?.label
  if (metaLabel) return String(metaLabel)

  const header = col?.columnDef?.header
  if (typeof header === "string") return header

  return humanizeId(String(col?.id ?? ""))
}

type ColumnBuilders = (handlers: {
  onView: (patient: PatientData) => void
  onEdit: (patient: PatientData) => void
  onOpenNotes: (patient: PatientData) => void
}) => ColumnDef<PatientData, string>[]

export function PatientsDataTable({ columns }: { columns: ColumnBuilders }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const [q, setQ] = useState("")
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceMs = 500

  const [open, setOpen] = useState(false)
  const [createFormKey, setCreateFormKey] = useState(0)

  const [openEdit, setOpenEdit] = useState(false)
  const [editFormKey, setEditFormKey] = useState(0)
  const [editId, setEditId] = useState<string | undefined>(undefined)
  const [editData, setEditData] = useState<PatientData | undefined>(undefined)
  const [editPhotoUrl, setEditPhotoUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const id = setTimeout(() => setQuery(q.trim()), debounceMs)
    return () => clearTimeout(id)
  }, [q])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [query])

  const swrKey = useMemo(
    () => ["patients", pagination.pageIndex, pagination.pageSize, query] as const,
    [pagination.pageIndex, pagination.pageSize, query]
  )

  const { data: patients, isValidating, mutate } = useSWR<PatientResponse>(
    swrKey,
    () =>
      PatientsService.list({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        q: query || undefined,
      }),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 30000,
    }
  )

  const data: PatientData[] = patients?.data ?? []
  const meta = patients?.meta ?? null

  const getId = (p: PatientData) => String(p.attributes.id ?? p.id)

const handleEdit = useCallback(async (p: PatientData) => {
    const id = getId(p)

    setEditId(id)
    setEditData(p)
    setEditPhotoUrl(
      p.attributes.person?.photo_url || p.attributes.person?.photo_thumb_url || undefined
    )
    setOpenEdit(true)

    try {
      const fresh = await PatientsService.show(id)
      setEditData(fresh)
      setEditPhotoUrl(
        fresh.attributes.person?.photo_url || fresh.attributes.person?.photo_thumb_url || undefined
      )
    } catch {
      console.log('Erro ao buscar dados atualizados do paciente');
    }
  }, [])

  const cols = useMemo(
    () =>
      columns({
        onView: (p) => console.log("view", p.id),
        onEdit: handleEdit,
        onOpenNotes: (p) => console.log("notes", p.id),
      }),
    [columns, handleEdit]
  )

  const table = useReactTable({
    data,
    columns: cols as ColumnDef<PatientData, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  })

  const columnsForMenu = useMemo(
    () => table.getAllLeafColumns().filter((c) => c.getCanHide()),
    [table]
  )

  return (
    <div className="w-full p-6 flex flex-col gap-4 lg:max-w-7xl lg:mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="flex gap-3">
          <Input
            type="search"
            placeholder="Buscar por nome, CPF ou cidade..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            ref={inputRef}
            className="lg:max-w-md"
          />
        </div>

        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Settings2 />Colunas</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columnsForMenu.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(Boolean(v))}
                >
                  {getColumnMenuLabel(column)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-4">
            <Button onClick={() => setOpen(true)} className="w-full">
              <Plus /> Adicionar Paciente
            </Button>

            <FormPatient
              key={`create-${createFormKey}`}
              open={open}
              onOpenChange={(v) => {
                if (!v) setCreateFormKey((k) => k + 1)
                setOpen(v)
              }}
              mode="create"
              onSuccess={async () => {
                await mutate(undefined, { revalidate: true })
                setOpen(false)
                setCreateFormKey((k) => k + 1)
              }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={cols.length} className="h-24 text-center">
                  {isValidating ? "Carregando..." : "Não há dados para exibir."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 items-center md:flex-row md:justify-between md:items-center">
        <small className="text-muted-foreground md:flex-1">
          Total de Pacientes: {meta?.total_count ?? 0}
        </small>

        <CustomPagination
          currentPage={meta?.current_page ?? 1}
          totalPages={meta?.total_pages ?? 1}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
        />
      </div>

      <FormPatient
        key={`edit-${editFormKey}-${editId ?? "none"}`}
        open={openEdit}
        onOpenChange={(v) => {
          if (!v) setEditFormKey((k) => k + 1)
          setOpenEdit(v)
        }}
        mode="edit"
        patientId={editId}
        initialData={editData}
        initialPhotoUrl={editPhotoUrl}
        onSuccess={async () => {
          await mutate(undefined, { revalidate: true })
          setOpenEdit(false)
          setEditFormKey((k) => k + 1)
        }}
      />
    </div>
  )
}
