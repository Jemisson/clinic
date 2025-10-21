"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import * as LucideIcons from "lucide-react"
import { MoreHorizontal, SquareDashed } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PatientData, PersonTag } from "@/types/patients"
import { formatCPF, formatPhone } from "@/utils/formatters"
import { PatientAge } from "@/components/patients/age"

const lucideIcons = LucideIcons as unknown as Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
>

const getInitials = (name?: string | null) => {
  if (!name) return "—"
  const parts = name.trim().split(/\s+/)
  const ini = (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  return ini.toUpperCase() || "—"
}

const getFirstPhone = (pd: PatientData): string => {
  const first = pd.attributes.person?.contacts?.[0]
  return formatPhone(first?.cellphone || first?.phone || "")
}

const getCity = (pd: PatientData): string => {
  const firstAddr = pd.attributes.person?.addresses?.[0]
  return firstAddr?.city || "—"
}

export const patientColumns = ({
  onEdit,
  onOpenNotes,
}: {
  onEdit: (patient: PatientData) => void
  onOpenNotes: (patient: PatientData) => void
}): ColumnDef<PatientData, string>[] => [
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
    cell: ({ row }) => <span>P-{row.original.attributes.id ?? row.original.id}</span>,
    enableSorting: true,
  },
  {
    id: "name",
    meta: { label: "Nome" },
    enableHiding: true,
    accessorFn: (row) => row.attributes.person?.name ?? "",
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.User /> <span>Nome</span>
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
      const person = row.original.attributes.person
      const name = person?.name ?? "—"
      const photo = person?.photo_thumb_url || person?.photo_url || undefined

      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium leading-none">{name}</span>
            <PatientAge
              birthdate={row.original.attributes.birthdate}
              until={row.original.attributes.death_date}
              compact={false}
            />
          </div>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    id: "cpf",
    meta: { label: "CPF" },
    accessorFn: (row) => row.attributes.cpf ?? "",
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.IdCard /> <span>CPF</span>
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
    cell: ({ row }) => <span>{formatCPF(row.original.attributes.cpf)}</span>,
    enableSorting: true,
  },
  {
    id: "phone",
    meta: { label: "Telefone" },
    accessorFn: (row) => {
      const c = row.attributes.person?.contacts?.[0]
      return c?.cellphone || c?.phone || ""
    },
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.Phone /> <span>Telefone</span>
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
    cell: ({ row }) => <span>{getFirstPhone(row.original)}</span>,
    enableSorting: true,
  },
  {
    id: "city",
    meta: { label: "Cidade" },
    accessorFn: (row) => row.attributes.person?.addresses?.[0]?.city ?? "",
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <LucideIcons.MapPin /> <span>Cidade</span>
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
    cell: ({ row }) => <span>{getCity(row.original)}</span>,
    enableSorting: true,
  },
  {
    id: "interests",
    meta: { label: "Interesses" },
    accessorFn: (row) => (row.attributes.person?.tags ?? []).map(t => t.name).join(", "),
    header: () => (
      <Button variant="ghost">
        <LucideIcons.Bookmark /> <span>Interesses</span>
      </Button>
    ),
    cell: ({ row }) => {
      const tags = (row.original.attributes.person?.tags ?? []) as PersonTag[]
      if (!tags.length) return <span className="text-muted-foreground">—</span>

      const [first, ...rest] = tags
      const FirstIcon = first.icon ? lucideIcons[first.icon] : null

      return (
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="gap-1">
            {FirstIcon ? <FirstIcon /> : <SquareDashed />}
            {first.name}
          </Badge>

          {rest.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-help"
                  aria-label={`Mostrar mais ${rest.length} interesses`}
                >
                  +{rest.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-[320px]">
                <div className="flex flex-wrap gap-1">
                  {rest.map((t) => {
                    const Icon = t.icon ? lucideIcons[t.icon] : null
                    return (
                      <Badge key={t.id} variant="secondary" className="gap-1">
                        {Icon ? <Icon /> : <SquareDashed />}
                        {t.name}
                      </Badge>
                    )
                  })}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: "actions",
    meta: { label: "Ações" },
    enableHiding: false,
    header: () => (
      <Button variant="ghost">
        <LucideIcons.Menu /> <span>Ações</span>
      </Button>
    ),
    cell: ({ row }) => {
      const patient = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a
                href={`/pacientes/${patient.attributes.id ?? patient.id}`}
                className="flex gap-1 items-center"
              >
                <LucideIcons.Eye /> Ver detalhes
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(patient)}>
              <span className="flex gap-1 items-center">
                <LucideIcons.SquarePen /> Editar
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onOpenNotes(patient)}>
              <span className="flex gap-1 items-center">
                <LucideIcons.FileText /> Notas confidenciais
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
  },
]
