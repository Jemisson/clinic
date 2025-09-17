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

const lucideIcons = LucideIcons as unknown as Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
>

export const columns: ColumnDef<TagData, string>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            return <span>TAG-{row.original.id}</span>
        },
    },
    {
        id: "tag",
        accessorFn: (row) => row.attributes.name,
        header: ({ column }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">Tag <LucideIcons.ChevronsUpDown /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <LucideIcons.ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <LucideIcons.ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LucideIcons.EyeOff className="text-muted-foreground" /> Mostrar
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
                <Badge>{IconComponent ? <IconComponent /> : <SquareDashed />} {tag.attributes.name}</Badge>
            )
        }
    },
    {
        id: "status",
        header: "Status",
        cell: () => {
            return <span className="flex gap-1 items-center"><LucideIcons.CircleCheck className="text-base text-muted-foreground size-4" /> Ativo</span>
        },
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
            const tag = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Visualizar</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(`TAG-${tag.id}`)}
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><span className="text-destructive">Desativar</span></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]
