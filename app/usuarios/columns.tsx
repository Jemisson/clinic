"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ProfileUserData } from "@/types/users"
import { getInitials } from "@/utils/functions"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { ArrowDown, ArrowUp, CalendarCheck2, CalendarSync, ChevronsUpDown, CircleUser, Eye, Hash, IdCardLanyard, KeyRound, Landmark, Menu, Pencil } from "lucide-react"

export const columns: ColumnDef<ProfileUserData>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            const sorted = column.getIsSorted()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <Hash /> <span>ID</span>
                            {sorted === "asc" ? (
                                <ArrowUp />
                            ) : sorted === "desc" ? (
                                <ArrowDown />
                            ) : (
                                <ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => <div>USER-{row.original.id}</div>,
    },
    {
        accessorKey: "user",
        header: ({ column }) => {
            const sorted = column.getIsSorted()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <CircleUser /> <span>Usuário</span>
                            {sorted === "asc" ? (
                                <ArrowUp />
                            ) : sorted === "desc" ? (
                                <ArrowDown />
                            ) : (
                                <ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => {
            const user = row.original.attributes.name
            const email = row.original.attributes.email
            const photo = row.original.attributes.photo_thumb_url

            return (
                <section className="flex gap-1 items-center">
                    <Avatar>
                        <AvatarImage src={photo ?? undefined} alt={user} />
                        <AvatarFallback className="text-xs">{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="font-semibold text-sm">{user}</p>
                        <small className="-mt-1">{email}</small>
                    </div>
                </section>
            )
        }
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            const sorted = column.getIsSorted()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <KeyRound /> <span>Tipo</span>
                            {sorted === "asc" ? (
                                <ArrowUp />
                            ) : sorted === "desc" ? (
                                <ArrowDown />
                            ) : (
                                <ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => {
            const role = row.original.attributes.role

            return (
                <span className="capitalize">{role}</span>
            )
        }
    },
    {
        accessorKey: "sector",
        header: ({ column }) => {
            const sorted = column.getIsSorted()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <Landmark /> <span>Setor</span>
                            {sorted === "asc" ? (
                                <ArrowUp />
                            ) : sorted === "desc" ? (
                                <ArrowDown />
                            ) : (
                                <ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => {
            const sector = row.original.attributes.sector

            return (
                <span>{sector}</span>
            )
        }
    },
    {
        accessorKey: "job_function",
        header: ({ column }) => {
            const sorted = column.getIsSorted()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <IdCardLanyard /> <span>Função</span>
                            {sorted === "asc" ? (
                                <ArrowUp />
                            ) : sorted === "desc" ? (
                                <ArrowDown />
                            ) : (
                                <ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: ({ row }) => {
            const job_function = row.original.attributes.job_function

            return (
                <span>{job_function}</span>
            )
        }
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            const sorted = column.getIsSorted()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <CalendarCheck2 /> <span>Criado em</span>
                            {sorted === "asc" ? (
                                <ArrowUp />
                            ) : sorted === "desc" ? (
                                <ArrowDown />
                            ) : (
                                <ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: () => {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>{dayjs(641203200000).format("DD/MM/YYYY")}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>{dayjs(641203200000).format("HH:mm:ss")}</span>
                    </TooltipContent>
                </Tooltip>
            )
        }
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => {
            const sorted = column.getIsSorted()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <CalendarSync /> <span>Atualizado em</span>
                            {sorted === "asc" ? (
                                <ArrowUp />
                            ) : sorted === "desc" ? (
                                <ArrowDown />
                            ) : (
                                <ChevronsUpDown />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                            <ArrowUp className="text-muted-foreground" /> Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                            <ArrowDown className="text-muted-foreground" /> Desc
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        cell: () => {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>{dayjs(651203200000).format("DD/MM/YYYY")}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>{dayjs(651203200000).format("HH:mm:ss")}</span>
                    </TooltipContent>
                </Tooltip>
            )
        }
    },
    {
        accessorKey: "actions",
        header: () => {
            return (
                <Button variant={"ghost"}>
                    <Menu /> <span>Tipo</span>
                </Button>
            )
        },
        cell: () => {
            return (
                <div className="flex">
                    <Button variant={"ghost"} size={"icon"}><Eye /></Button>
                    <Button variant={"ghost"} size={"icon"}><Pencil /></Button>
                </div>
            )
        }
    }
]