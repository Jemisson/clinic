"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import * as LucideIcons from "lucide-react";
import useSWR from "swr"
import TagsService from "@/service/tags"
import {
    TagAttributes,
    TagData,
    TagStatus
} from "@/types/tags"
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
import { Plus, Settings2 } from "lucide-react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { CustomPagination } from "@/lib/pagination"
import TagUpsertDialog from "@/components/tags/TagUpsertDialog"
import TagStatusDialog from "@/components/tags/TagStatusDialog"

interface DataTableProps {
    columns: (
        handlers: {
            onEdit: (tag: TagData) => void;
            onDeactivate: (tag: TagData) => void;
            onReactivate: (tag: TagData) => void
        }
    ) => ColumnDef<TagData, string>[]
}

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DataTable({ columns }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [showId, setShowId] = useState<Checked>(true)
    const [showStatus, setShowStatus] = useState<Checked>(true)
    const [showCreatedAt, setShowCreatedAt] = useState<Checked>(true)
    const [showUpdatedAt, setShowUpdatedAt] = useState<Checked>(true)

    const [searchValue, setSearchValue] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const inputSearchRef = useRef<HTMLInputElement>(null)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedTag, setSelectedTag] = useState<TagData | null>(null)

    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [statusLoading, setStatusLoading] = useState(false)
    const [statusTarget, setStatusTarget] = useState<TagStatus>("inactive")

    function openStatusDialog(tag: TagData, target: TagAttributes["status"]) {
        if (tag.attributes.status === target) return

        setSelectedTag(tag)
        setStatusTarget(target as TagStatus)
        setIsStatusOpen(true)
    }

    async function confirmStatusChange() {
        if (!selectedTag) return
        try {
            setStatusLoading(true)
            await TagsService.setStatus(selectedTag.id, statusTarget)
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
            onEdit: openEdit,
            onDeactivate: (t) => openStatusDialog(t, "inactive"),
            onReactivate: (t) => openStatusDialog(t, "active"),
        }),
        [columns, openEdit]
    )

    function openCreate() {
        setSelectedTag(null)
        setIsDialogOpen(true)
    }

    function openEdit(tag: TagData) {
        setSelectedTag(tag)
        setIsDialogOpen(true)
    }

    const { data: tags, isValidating, mutate } = useSWR(
        [pagination.pageIndex, globalFilter, filterStatus],
        () => {
            return TagsService.list({
                page: pagination.pageIndex + 1,
                per_page: pagination.pageSize,
                q: globalFilter,
                t: filterStatus
            })
        }
    )

    const data = tags?.data ?? []
    const meta = tags?.meta ?? null

    const table = useReactTable({
        data,
        columns: cols,
        manualPagination: true,
        pageCount: meta?.total_pages ?? 0,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
            globalFilter
        },
    })

    useEffect(() => {
        table.getColumn("id")?.toggleVisibility(!!showId)
        table.getColumn("status")?.toggleVisibility(!!showStatus)
        table.getColumn("createdAt")?.toggleVisibility(!!showCreatedAt)
        table.getColumn("updatedAt")?.toggleVisibility(!!showUpdatedAt)
    }, [showId, showStatus, showCreatedAt, showUpdatedAt, table])

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }, [filterStatus])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            table.setGlobalFilter(searchValue)
        }
    }

    useEffect(() => {
        const input = inputSearchRef.current
        if (!input) return

        const handleSearch = (e: Event) => {
            const target = e.target as HTMLInputElement
            if (target.value === "") {
                setSearchValue("")
                table.setGlobalFilter("")
            }
        }

        input.addEventListener("search", handleSearch)
        return () => input.removeEventListener("search", handleSearch)
    }, [table])


    return (
        <div className="w-full p-6 flex flex-col gap-4 lg:max-w-4xl lg:mx-auto">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-4 lg:flex-row">
                    <Input
                        type="search"
                        placeholder="Filtrar Tags..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        ref={inputSearchRef}
                        className="lg:max-w-xs"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} className="border-dashed"><LucideIcons.Funnel />Filtrar</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                                <DropdownMenuRadioItem value="active">Ativo</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive">Inativo</DropdownMenuRadioItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterStatus("")} className="flex justify-center">Limpar Filtro</DropdownMenuItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>


                <div className="flex flex-col gap-4 lg:flex-row">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"}><Settings2 />Colunas</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuCheckboxItem checked={showId} onCheckedChange={setShowId}>ID</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>Status</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={showCreatedAt} onCheckedChange={setShowCreatedAt}>Criado em</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={showUpdatedAt} onCheckedChange={setShowUpdatedAt}>Atualizado em</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-4">
                        <Button onClick={openCreate}>
                            <Plus /> Adicionar Tag
                        </Button>
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
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                    {isValidating ? "Carregando..." : "Nenhum dado encontrado."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                 <TagUpsertDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    tag={selectedTag}
                    onSuccess={async () => await mutate() }
                />

                <TagStatusDialog
                    open={isStatusOpen}
                    onOpenChange={setIsStatusOpen}
                    tag={selectedTag}
                    loading={statusLoading}
                    targetStatus={statusTarget}
                    onConfirm={confirmStatusChange}
                />

            </div>

            <div className="flex flex-col gap-4 items-center md:flex-row md:justify-between md:items-center">
                <small className="text-muted-foreground md:flex-1">Total de Tags: {meta?.total_count}</small>

                <CustomPagination
                    currentPage={meta?.current_page ?? 1}
                    totalPages={meta?.total_pages ?? 1}
                    onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
                />
            </div>
        </div>
    )
}
