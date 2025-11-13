'use client'

import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Card, CardContent } from '@/components/ui/card'
import PatientAttachmentsService from '@/service/patient-attachments'
import { CheckCircle2, Trash2, XCircle } from 'lucide-react'
import { ReactNode, useState } from 'react'

interface Props {
  icon: ReactNode
  title: string
  url: string
  date?: string | null
  status?: 'ok' | 'missing' | null
  patientId?: string | number
  attachmentId?: string | number | null
  onDeleted?: () => Promise<void> | void
}

export default function AttachmentItem({
  icon,
  title,
  url,
  date,
  status = null,
  patientId,
  attachmentId,
  onDeleted,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canDelete = patientId != null && attachmentId != null && !!onDeleted
  const isClickable = !!url && status === 'ok'

  async function handleConfirmDelete() {
    if (!canDelete) return
    try {
      setDeleting(true)
      await PatientAttachmentsService.destroy(patientId!, attachmentId!)
      setConfirmOpen(false)
      if (onDeleted) {
        await onDeleted()
      }
    } finally {
      setDeleting(false)
    }
  }

  const content = (
    <Card className="hover:bg-muted/40 transition border border-muted shadow-none">
      <CardContent className="p-4">
        <div className="relative flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="h-16 w-12 sm:h-20 sm:w-16 rounded-md border flex items-center justify-center bg-white">
              {icon}
            </div>
            {status && <StatusBadge status={status} />}
          </div>

          <div className="space-y-1 w-full">
            <div className="text-sm sm:text-base font-medium leading-tight text-center break-words">
              {title}
            </div>
            {date && (
              <div className="text-xs text-muted-foreground text-center">
                {date}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <div className="relative w-[140px] sm:w-[160px]">
        {canDelete && (
          <button
            type="button"
            aria-label="Excluir arquivo"
            title="Excluir arquivo"
            className="absolute top-2 right-2 z-10 inline-flex items-center justify-center rounded-md p-1.5
                       bg-white/90 hover:bg-white shadow-sm
                       text-red-600 hover:text-red-700
                       transition focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setConfirmOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

        {isClickable ? (
          <a
            href={url}
            target="_blank"
            className="block transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl"
          >
            {content}
          </a>
        ) : (
          <div className="rounded-2xl opacity-70 cursor-not-allowed">
            {content}
          </div>
        )}
      </div>

      {canDelete && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            if (!open && !deleting) {
              setConfirmOpen(false)
            } else {
              setConfirmOpen(open)
            }
          }}
          targetStatus="inactive"
          entityLabel="arquivo"
          entityName={title}
          title="Excluir arquivo"
          confirmLabel="Excluir"
          deactivateDescription={
            <>
              Tem certeza que deseja <b>excluir</b> o arquivo <b>{title}</b>?
              Essa ação não pode ser desfeita depois.
            </>
          }
          loading={deleting}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  )
}

function StatusBadge({ status }: { status: 'ok' | 'missing' }) {
  const ok = status === 'ok'
  return (
    <div className="absolute -right-3 -top-3">
      <div
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        aria-label={ok ? 'preenchido' : 'pendente'}
        title={ok ? 'Preenchido' : 'Pendente'}
      >
        {ok ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        )}
      </div>
    </div>
  )
}
