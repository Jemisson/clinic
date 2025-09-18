"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TagData } from "@/types/tags"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, SquareDashed } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import * as LucideIcons from "lucide-react"
import dayjs from "@/lib/dayjs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const lucideIcons = LucideIcons as unknown as Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
>

export const columns = (
  { onEdit, onDeactivate, onReactivate }: { 
                                onEdit: (tag: TagData) => void;
                                onDeactivate: (tag: TagData) => void;
                                onReactivate: (tag: TagData) => void
                            }
): ColumnDef<TagData, string>[] => [
    {
        accessorKey: "id",
        header: ({ column }) => {
            const sorted = column.getIsSorted()
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <LucideIcons.Hash /> <span>ID</span>
                            {sorted === "asc" ? (
                                <LucideIcons.ArrowUp />
                            ) : sorted === "desc" ? (
                                <LucideIcons.ArrowDown />
                            ) : (
                                <LucideIcons.ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => {
            return <span>TAG-{row.original.id}</span>
        },
    },
    {
        id: "tag",
        accessorFn: (row) => row.attributes.name,
        header: ({ column }) => {
            const sorted = column.getIsSorted()
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <LucideIcons.Bookmark /> <span>Tag</span>
                            {sorted === "asc" ? (
                                <LucideIcons.ArrowUp />
                            ) : sorted === "desc" ? (
                                <LucideIcons.ArrowDown />
                            ) : (
                                <LucideIcons.ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => {
            const tag = row.original
            const iconName = row.original.attributes.icon
            const IconComponent = lucideIcons[iconName]

            return (
                <Badge>
                    {IconComponent ? <IconComponent /> : <SquareDashed />} {tag.attributes.name}
                </Badge>
            )
        }
    },
    {
        id: "status",
        header: ({ column }) => {
            const sorted = column.getIsSorted()
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <LucideIcons.CircleCheckBig /> <span>Status</span>
                            {sorted === "asc" ? (
                                <LucideIcons.ArrowUp />
                            ) : sorted === "desc" ? (
                                <LucideIcons.ArrowDown />
                            ) : (
                                <LucideIcons.ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },

        cell: ({ row }) => {
            const status = row.original.attributes.status
            return (
                <Badge variant={"outline"} className="border-none">
                    <span
                        className={`size-1.5 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                    />
                    {status === "active" ? "Ativo" : "Inativo"}
                </Badge>
            )
        },

    },
    {
        id: "createdAt",
        header: ({ column }) => {
            const sorted = column.getIsSorted()
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <LucideIcons.CalendarCheck2 /> <span>Criado em</span>
                            {sorted === "asc" ? (
                                <LucideIcons.ArrowUp />
                            ) : sorted === "desc" ? (
                                <LucideIcons.ArrowDown />
                            ) : (
                                <LucideIcons.ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },

        cell: ({ row }) => {
            const date = row.original.attributes.created_at
            return <Tooltip>
                <TooltipTrigger asChild>
                    <span>{dayjs(date).format("DD/MM/YYYY")}</span>
                </TooltipTrigger>
                <TooltipContent>
                    {dayjs(date).format("HH:mm:ss")}
                </TooltipContent>
            </Tooltip>
        }
    },
    {
        id: "updatedAt",
        header: ({ column }) => {
            const sorted = column.getIsSorted()
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <LucideIcons.CalendarSync /> <span>Atualizado em</span>
                            {sorted === "asc" ? (
                                <LucideIcons.ArrowUp />
                            ) : sorted === "desc" ? (
                                <LucideIcons.ArrowDown />
                            ) : (
                                <LucideIcons.ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => {
            const date = row.original.attributes.updated_at
            return <Tooltip>
                <TooltipTrigger asChild>
                    <span>{dayjs(date).format("DD/MM/YYYY")}</span>
                </TooltipTrigger>
                <TooltipContent>
                    {dayjs(date).format("HH:mm:ss")}
                </TooltipContent>
            </Tooltip>
        }
    },
    {
        id: "actions",
        header: () => (
            <Button variant={"ghost"}><LucideIcons.Menu /><span>Ações</span></Button>
        ),
        cell: ({ row }) => {
            const tag = row.original
            const isInactive = tag.attributes.status === "inactive"

            return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreHorizontal />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(tag)}>
                        <span className="flex gap-1 items-center">
                            <LucideIcons.SquarePen /> Editar
                        </span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {isInactive ? (
                        <DropdownMenuItem onClick={() => onReactivate(tag)}>
                            <span className="text-green-700 flex gap-1 items-center">
                                <LucideIcons.CircleCheckBig className="text-green-700"/> Reativar
                            </span>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => onDeactivate(tag)}>
                            <span className="text-destructive flex gap-1 items-center">
                                <LucideIcons.CircleOff className="text-destructive" /> Desativar
                            </span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            )
        },
    }

]
