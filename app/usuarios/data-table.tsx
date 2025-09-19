"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
import useSWR from "swr"
import { useState } from "react"
import UsersService from "@/service/users"
import { ProfileUserData, UserResponse } from "@/types/users"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Funnel, Plus, Settings2 } from "lucide-react"
import { CustomPagination } from "@/lib/pagination"

interface DataTableProps {
    columns: ColumnDef<ProfileUserData, unknown>[]
}

export function DataTable({
    columns
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data: users } = useSWR<UserResponse>(
        [pagination.pageIndex],
        () =>
            UsersService.list({
                page: pagination.pageIndex + 1,
                per_page: pagination.pageSize,
            })
    )

    console.log(users)


    const data: ProfileUserData[] = users?.data ?? []
    const meta = users?.meta ?? null

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full p-6 flex flex-col gap-4 lg:max-w-7xl lg:mx-auto">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-4 lg:flex-row">
                    <Input
                        type="search"
                        placeholder="Filtrar Usuários..."
                        className="lg:max-w-xs"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} className="border-dashed"><Funnel />Filtrar</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup>
                                <DropdownMenuRadioItem value="active">Ativo</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive">Inativo</DropdownMenuRadioItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Limpar Filtro</DropdownMenuItem>
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
                            <DropdownMenuCheckboxItem>ID</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Usuário</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Tipo</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Setor</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Função</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Criado em</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Atualizado em</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-4">
                        <Button className="w-full">
                            <Plus /> Adicionar Usuário
                        </Button>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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