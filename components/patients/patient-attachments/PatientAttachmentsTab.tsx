'use client'

import { Button } from '@/components/ui/button'
import PatientAttachmentsService from '@/service/patient-attachments'
import {
  AttachmentAttributes,
  AttachmentResource,
} from '@/types/patient.attachment'
import { buildRequiredAttachmentCards } from '@/utils/requiredAttachments'
import { FilePlus, FileText, Info } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import AddAttachmentDialog from './AddAttachmentDialog'
import AttachmentItem from './AttachmentItem'

interface Props {
  patientId: string | number
}

export default function PatientAttachmentsTabLayout({ patientId }: Props) {
  const {
    data: attachments,
    error,
    isLoading,
    mutate,
  } = useSWR<AttachmentResource[], Error>(
    patientId ? (['patient_attachments', patientId] as const) : null,
    async () => {
      const res = await PatientAttachmentsService.list(patientId, {
        page: 1,
        per_page: 25,
      })
      return res.data
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    },
  )

  const [openDialog, setOpenDialog] = useState(false)

  const requiredCards = useMemo(() => {
    return buildRequiredAttachmentCards(attachments ?? [])
  }, [attachments])

  const consumedIds = new Set(
    requiredCards
      .map((c) => c.matchedAttachmentId)
      .filter((id): id is string => !!id),
  )

  const otherAttachments = useMemo(() => {
    if (!attachments) return []
    return attachments.filter((att) => !consumedIds.has(att.id))
  }, [attachments, consumedIds])

  const formatDate = useCallback((iso?: string | null) => {
    if (!iso) return ''
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-medium text-primary">
          Arquivos e Consentimentos
        </h3>

        <Button
          size="sm"
          className="gap-2"
          onClick={() => setOpenDialog(true)}
        >
          <FilePlus className="h-4 w-4" />
          Adicionar arquivo
        </Button>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground italic">
        <Info className="size-4 mt-0.5 flex-shrink-0" />
        <p className="mb-3 text-xs text-muted-foreground">
          Clique em um arquivo para vê-lo.
        </p>
      </div>

      <p className="text-primary">Documentos Obrigatórios</p>

      <div className="flex flex-wrap justify-start gap-6">
        {requiredCards.map((card) => (
          <AttachmentItem
            icon={<FileText className="h-8 w-8" />}
            title={card.title}
            url={card.url}
            date={card.date}
            status={card.status}
            patientId={patientId}
            attachmentId={card.matchedAttachmentId}
            key={card.key}
            onDeleted={async () => {
              await mutate()
            }}
          />
        ))}

        {isLoading && (
          <div className="text-sm text-muted-foreground">
            Carregando anexos…
          </div>
        )}

        {error && !isLoading && (
          <div className="text-sm text-red-600">
            Não foi possível carregar os anexos.
          </div>
        )}
      </div>

      <div>
        <p className="text-primary mb-2">Outros Documentos</p>

        {!otherAttachments || otherAttachments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic mb-4">
            Não há outros documentos anexados a este paciente.
          </p>
        ) : (
          otherAttachments.map((resource) => {
            const a: AttachmentAttributes = resource.attributes
            return (
              <AttachmentItem
                key={resource.id}
                icon={<FileText className="h-8 w-8" />}
                title={a.title || '(sem título)'}
                url={a.file_url || '#'}
                date={formatDate(a.captured_at || a.created_at)}
                status={'ok'}
                patientId={patientId}
                attachmentId={resource.id}
                onDeleted={async () => {
                  await mutate()
                }}
              />
            )
          })
        )}
      </div>

      <AddAttachmentDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        patientId={patientId}
        onDidUpload={async () => {
          await mutate()
        }}
      />
    </div>
  )
}
