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
import { useEffect, useState } from "react"
import useSWR from "swr"
import TagsService from "@/service/tags"
import { TagData } from "@/types/tags"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Settings2 } from "lucide-react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import z from "zod"
import { TagSchema } from "@/lib/schemas/tag"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as LucideIcons from "lucide-react";
import { tagIcons } from "@/utils/tagIcons"
import { CustomPagination } from "@/lib/pagination"

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
    const [showId, setShowId] = useState<Checked>(true)
    const [showStatus, setShowStatus] = useState<Checked>(true)
    const [showCreatedAt, setShowCreatedAt] = useState<Checked>(true)
    const [showUpdatedAt, setShowUpdatedAt] = useState<Checked>(true)

    const [filterActive, setFilterActive] = useState<Checked>(true);
    const [filterInactive, setFilterInactive] = useState<Checked>(true);

    const lucideIcons = LucideIcons as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;

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

    const tagForm = useForm<z.infer<typeof TagSchema>>({
        resolver: zodResolver(TagSchema),
        defaultValues: {
            name: "",
        }
    })

    function onSubmit(data: z.infer<typeof TagSchema>) {
        console.log(data)
    }


    return (
        <div className="w-full p-6 flex flex-col gap-4 lg:max-w-4xl lg:mx-auto">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-4 lg:flex-row">
                    <Input
                        placeholder="Filtrar Tags..."
                        value={globalFilter}
                        onChange={(event) =>
                            table.setGlobalFilter(event.target.value)
                        }
                        className="lg:max-w-xs"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} className="border-dashed"><LucideIcons.Funnel />Filtrar</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuCheckboxItem checked={filterActive} onCheckedChange={setFilterActive}>Ativo</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={filterInactive} onCheckedChange={setFilterInactive}>Inativo</DropdownMenuCheckboxItem>
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

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button><Plus />Adicionar Tag</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-1"><LucideIcons.Bookmark />Adicionar Tag</DialogTitle>
                            </DialogHeader>

                            <Form {...tagForm}>
                                <form onSubmit={tagForm.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                                    <FormField
                                        control={tagForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome da Tag" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={tagForm.control}
                                        name="icon"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ícone</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione um ícone" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tagIcons.map((iconName) => {
                                                                const IconComponent = lucideIcons[iconName];
                                                                return (
                                                                    <SelectItem key={iconName} value={iconName}>
                                                                        {IconComponent && <Button size={"icon"}><IconComponent className="text-background" /></Button>} {iconName}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={tagForm.handleSubmit(onSubmit)}>Adicionar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isValidating ? "Carregando..." : "Nenhum dado encontrado."}
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
