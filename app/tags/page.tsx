'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenuCheckboxItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Columns, Eye, Pencil } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import dayjs from '@/lib/dayjs';

type Checked = DropdownMenuCheckboxItemProps['checked'];

export default function TagsPage() {
  const [showNameColumn, setShowNameColumn] = useState<Checked>(true);
  const [showCreatedAt, setShowCreatedAt] = useState<Checked>(true);
  const [showUpdatedAt, setShowUpdatedAt] = useState<Checked>(true);
  const [showIcon, setShowIcon] = useState<Checked>(true);

  const columns = [
    { title: 'Ícone', visible: showIcon },
    { title: 'Nome', visible: showNameColumn },
    { title: 'Criada em', visible: showCreatedAt },
    { title: 'Atualizada em', visible: showUpdatedAt },
    { title: 'Ações', visible: true },
  ];

  const tags = [
    {
      icon: 'House',
      name: 'Procedimento',
      createdAt: '2024-06-01T09:30:00-03:00',
      updatedAt: '2024-06-02T10:00:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'User',
      name: 'Paciente',
      createdAt: '2024-06-02T10:15:00-03:00',
      updatedAt: '2024-06-03T11:20:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'Calendar',
      name: 'Agendamento',
      createdAt: '2024-06-03T14:45:00-03:00',
      updatedAt: '2024-06-04T09:00:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'FileText',
      name: 'Relatório',
      createdAt: '2024-06-04T08:20:00-03:00',
      updatedAt: '2024-06-05T10:30:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'Settings',
      name: 'Configuração',
      createdAt: '2024-06-05T11:00:00-03:00',
      updatedAt: '2024-06-06T12:15:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'AlertCircle',
      name: 'Alerta',
      createdAt: '2024-06-06T16:10:00-03:00',
      updatedAt: '2024-06-07T17:05:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'CheckCircle',
      name: 'Concluído',
      createdAt: '2024-06-07T13:50:00-03:00',
      updatedAt: '2024-06-08T14:20:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'MessageSquare',
      name: 'Mensagem',
      createdAt: '2024-06-08T15:30:00-03:00',
      updatedAt: '2024-06-09T16:00:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'BookOpen',
      name: 'Manual',
      createdAt: '2024-06-09T09:45:00-03:00',
      updatedAt: '2024-06-10T10:15:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
    {
      icon: 'Clipboard',
      name: 'Tarefa',
      createdAt: '2024-06-10T12:25:00-03:00',
      updatedAt: '2024-06-11T13:00:00-03:00',
      visible: {
        icon: showIcon,
        name: showNameColumn,
        createdAt: showCreatedAt,
        updatedAt: showUpdatedAt,
      },
    },
  ];

  return (
    <section className="w-full lg:max-w-5xl flex flex-col gap-6">
      <header className="flex justify-between gap-6">
        <Input
          type="search"
          placeholder="Procurar..."
          className="flex-grow max-w-md"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'}>
              <Columns />
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={showIcon}
              onCheckedChange={setShowIcon}
            >
              Ícone
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showNameColumn}
              onCheckedChange={setShowNameColumn}
            >
              Nome
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showCreatedAt}
              onCheckedChange={setShowCreatedAt}
            >
              Criada em
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showCreatedAt}
              onCheckedChange={setShowCreatedAt}
            >
              Atualizada em
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.title}
                className={column.visible ? '' : 'hidden'}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.name}>
              {tag.visible.icon && <TableCell>{tag.icon}</TableCell>}
              {tag.visible.name && <TableCell>{tag.name}</TableCell>}
              {tag.visible.createdAt && (
                <TableCell>
                  {dayjs(tag.createdAt).format('DD/MM/YYYY - HH:mm:ss')}
                </TableCell>
              )}
              {tag.visible.updatedAt && (
                <TableCell>
                  {dayjs(tag.updatedAt).format('DD/MM/YYYY - HH:mm:ss')}
                </TableCell>
              )}
              <TableCell>
                <div className="flex gap-1">
                  <Button variant={'ghost'} size={'icon'} className="size-8">
                    <Eye />
                  </Button>
                  <Button variant={'ghost'} size={'icon'} className="size-8">
                    <Pencil />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <footer className="flex flex-col gap-2 items-center md:flex-row">
        <p className="text-muted-foreground flex-grow">
          Total de tags: {tags.length}
        </p>

        <Pagination className="w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </section>
  );
}
