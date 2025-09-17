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

export const columns: ColumnDef<TagData, string>[] = [
    {
        accessorKey: "id",
        header: () => (
            <Button variant={"ghost"}><LucideIcons.Hash /><span>ID</span></Button>
        ),
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
        header: () => (
            <Button variant={"ghost"}><LucideIcons.CircleCheckBig /><span>Status</span></Button>
        ),

        cell: () => {
            return <span className="flex items-center"><LucideIcons.Dot className="text-green-500" />Ativo</span>
        },
    },
    {
        id: "createdAt",
        header: () => (
            <Button variant={"ghost"}><LucideIcons.CalendarCheck2 /><span>Criado em</span></Button>
        ),

        cell: () => {
            return <Tooltip>
                <TooltipTrigger asChild>
                    <span>{dayjs(1758108095000).format("DD/MM/YYYY")}</span>
                </TooltipTrigger>
                <TooltipContent>
                    {dayjs(1758108095000).format("HH:mm:ss")}
                </TooltipContent>
            </Tooltip>
        }
    },
    {
        id: "updatedAt",
        header: () => (
            <Button variant={"ghost"}><LucideIcons.CalendarSync /><span>Atualizado em</span></Button>
        ),
        cell: () => {
            return <Tooltip>
                <TooltipTrigger asChild>
                    <span>{dayjs(1760816262000).format("DD/MM/YYYY")}</span>
                </TooltipTrigger>
                <TooltipContent>
                    {dayjs(1760816262000).format("HH:mm:ss")}
                </TooltipContent>
            </Tooltip>
        }
    },
    {
        id: "actions",
        header: () => (
            <Button variant={"ghost"}><LucideIcons.Menu /><span>Ações</span></Button>
        ),
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><span className="flex gap-1 items-center"><LucideIcons.Eye />Visualizar</span></DropdownMenuItem>
                        <DropdownMenuItem><span className="flex gap-1 items-center"><LucideIcons.SquarePen />Editar</span></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><span className="text-destructive flex gap-1 items-center"><LucideIcons.CircleOff className="text-destructive" /> Desativar</span></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]
