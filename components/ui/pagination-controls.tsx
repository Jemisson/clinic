'use client'

import { Button } from '@/components/ui/button'

interface PaginationControlsProps {
  page: number
  perPage: number
  totalCount: number
  onPageChange: (page: number) => void
  onPerPageChange?: (perPage: number) => void
  perPageOptions?: number[]
  disabled?: boolean
}

export function PaginationControls({
  page,
  perPage,
  totalCount,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 30, 50],
  disabled = false,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div>
        Página {page} de {totalPages} • {totalCount} registros
      </div>

      <div className="flex items-center gap-2">
        {onPerPageChange && (
          <select
            className="h-9 rounded-md border px-2"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            disabled={disabled}
          >
            {perPageOptions.map((n) => (
              <option key={n} value={n}>
                {n} / pág.
              </option>
            ))}
          </select>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || disabled}
        >
          Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || disabled}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}
