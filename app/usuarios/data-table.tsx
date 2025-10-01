"use client"

import StatusConfirmDialog from "@/components/common/StatusConfirmDialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FormUser from "@/components/users/form/FormUser"
import { CustomPagination } from "@/lib/pagination"
import UsersService from "@/service/users"
import {
  ProfileUserData,
  UserResponse
} from "@/types/users"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Funnel,
  Plus,
  Settings2
} from "lucide-react"
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import useSWR from "swr"

interface DataTableProps {
  columns: (
    handlers: {
      onRequestStatusChange: (user: ProfileUserData, target: "active" | "inactive") => void
      onEdit?: (user: ProfileUserData) => void
    }
  ) => ColumnDef<ProfileUserData, unknown>[]
}

function humanizeId(id: string) {
  return id
    .replace(/[_\-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
function getColumnMenuLabel(col: any): string {
  const metaLabel = (col?.columnDef?.meta as { label?: string } | undefined)?.label
  if (metaLabel) return String(metaLabel)
  const header = col?.columnDef?.header
  if (typeof header === "string") return header
  return humanizeId(String(col?.id ?? ""))
}

export function DataTable({ columns }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [searchValue, setSearchValue] = useState("")
  const [globalFilter, setGlobalFilter] = useState("")
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const debounceMs = 500

  // Modal de CRIAÇÃO
  const [open, setOpen] = useState(false)
  const [createFormKey, setCreateFormKey] = useState(0)

  // Modal de EDIÇÃO
  const [openEdit, setOpenEdit] = useState(false)
  const [selected, setSelected] = useState<ProfileUserData | null>(null)
  const [editFormKey, setEditFormKey] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      setGlobalFilter(searchValue.trim())
    }, debounceMs)
    return () => clearTimeout(id)
  }, [searchValue])

  const [filterStatus, setFilterStatus] = useState<"" | "active" | "inactive">("")

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [globalFilter, filterStatus])

  useEffect(() => {
    const input = inputSearchRef.current
    if (!input) return
    const handleSearch = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value === "") {
        setSearchValue("")
        setGlobalFilter("")
      }
    }
    input.addEventListener("search", handleSearch)
    return () => input.removeEventListener("search", handleSearch)
  }, [])

  const swrKey = useMemo(
    () => [
      "profile_users",
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
      filterStatus,
    ] as const,
    [pagination.pageIndex, pagination.pageSize, globalFilter, filterStatus]
  )

  const { data: users, isValidating, mutate } = useSWR<UserResponse>(
    swrKey,
    () => UsersService.list({
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
      q: globalFilter,
      t: filterStatus || undefined,
    }),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 30000,
    }
  )

  const data: ProfileUserData[] = users?.data ?? []
  const meta = users?.meta ?? null

  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [statusTarget, setStatusTarget] = useState<"active" | "inactive">("inactive")
  const [selectedUser, setSelectedUser] = useState<ProfileUserData | null>(null)

  function onRequestStatusChange(user: ProfileUserData, target: "active" | "inactive") {
    setSelectedUser(user)
    setStatusTarget(target)
    setIsStatusOpen(true)
  }

  async function confirmStatusChange() {
    if (!selectedUser) return
    try {
      setStatusLoading(true)
      await UsersService.setStatus(selectedUser.id, statusTarget)
      await mutate()
      setIsStatusOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setStatusLoading(false)
    }
  }

  const cols = useMemo(
    () => columns({
      onRequestStatusChange,
      onEdit: (user) => {
        setSelected(user)
        setOpenEdit(true)
      },
    }),
    [columns]
  )

  const table = useReactTable({
    data,
    columns: cols,
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
        <div className="flex flex-col gap-4 lg:flex-row">
          <Input
            type="search"
            placeholder="Filtrar Usuários..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            ref={inputSearchRef}
            className="lg:max-w-xs"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="border-dashed"><Funnel />Filtrar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as "active" | "inactive" | "")}
              >
                <DropdownMenuRadioItem value="active">Ativo</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inactive">Inativo</DropdownMenuRadioItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("")} className="flex justify-center">
                  Limpar Filtro
                </DropdownMenuItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}><Settings2 />Colunas</Button>
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
              <Plus /> Adicionar Usuário
            </Button>

            <FormUser
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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
          Total de Usuários: {meta?.total_count ?? 0}
        </small>

        <CustomPagination
          currentPage={meta?.current_page ?? 1}
          totalPages={meta?.total_pages ?? 1}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
        />
      </div>

      <StatusConfirmDialog
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        targetStatus={statusTarget}
        entityLabel="usuário"
        entityName={selectedUser?.attributes.name}
        loading={statusLoading}
        onConfirm={confirmStatusChange}
        deactivateDescription={
          <>
            Ao desativar o usuário <b>{selectedUser?.attributes.name}</b>, ele não poderá mais realizar login no sistema,
            nem efetuar nenhuma operação, mas você ainda pode <b>reativá-lo</b> depois se necessário.
          </>
        }
        activateDescription={
          <>
            Ao reativar o usuário <b>{selectedUser?.attributes.name}</b>, ele voltará a ter todos os acessos ao sistema
            conforme o nível de acesso que possui.
          </>
        }
      />

      <FormUser
        key={`edit-${editFormKey}`}
        open={openEdit}
        onOpenChange={(v) => {
          if (!v) {
            setSelected(null)
            setEditFormKey((k) => k + 1)
          }
          setOpenEdit(v)
        }}
        mode="edit"
        userId={selected?.id}
        initialData={selected ?? undefined}
        initialPhotoUrl={selected?.attributes?.photo_thumb_url ?? undefined}
        onSuccess={async () => {
          await mutate()
          setOpenEdit(false)
          setSelected(null)
          setEditFormKey((k) => k + 1)
        }}
      />
    </div>
  )
}
