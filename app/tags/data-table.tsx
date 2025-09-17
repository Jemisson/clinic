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
import { useState } from "react"
import useSWR from "swr"
import TagsService from "@/service/tags"
import { TagData } from "@/types/tags"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

interface DataTableProps {
    columns: ColumnDef<TagData, string>[]
}

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DataTable({ columns }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [showStatus, setShowStatus] = useState<Checked>(true)

    const { data: tags, isValidating } = useSWR(
        [pagination.pageIndex, globalFilter],
        () => {
            return TagsService.list({
                page: pagination.pageIndex + 1,
                per_page: pagination.pageSize,
            })
        }
    )

    const data = tags?.data ?? []
    const meta = tags?.meta ?? null

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        rowCount: meta?.total_pages || 0,
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

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between">
                <Input
                    placeholder="Filtrar Tags..."
                    value={globalFilter}
                    onChange={(event) =>
                        table.setGlobalFilter(event.target.value)
                    }
                />

                <div className="flex gap-4"><DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"}><Settings2 />Colunas</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Colunas</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>Status</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                    <Button>Adicionar Tag</Button></div>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isValidating ? "Carregando..." : "Nenhum dado encontrado."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                    disabled={!table.getCanNextPage()}
                >
                    Próxima
                </Button>
            </div>
        </div>
    )
}
