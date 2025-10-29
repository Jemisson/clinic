import {
  AttachmentAttributes,
  AttachmentResource,
} from '@/types/patient.attachment'

export type RequiredAttachmentCard = {
  key: 'anamnese' | 'uso_imagem'
  title: string
  status: 'ok' | 'missing'
  url: string
  date: string
  matchedAttachmentId: string | null
}

function formatDate(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function buildRequiredAttachmentCards(
  attachments: AttachmentResource[],
): RequiredAttachmentCard[] {
  const REQUIRED_DEFS = [
    { key: 'anamnese' as const, title: 'Anamnese' },
    { key: 'uso_imagem' as const, title: 'Uso de Imagem' },
  ]

  return REQUIRED_DEFS.map((req) => {
    const match = attachments.find((att) => {
      const a: AttachmentAttributes = att.attributes
      const t = (a.title || '').trim().toLowerCase()
      return t === req.title.trim().toLowerCase()
    })

    if (!match) {
      return {
        key: req.key,
        title: req.title,
        status: 'missing',
        url: '#',
        date: '',
        matchedAttachmentId: null,
      }
    }

    const a = match.attributes
    return {
      key: req.key,
      title: req.title,
      status: 'ok',
      url: a.file_url || '#',
      date: formatDate(a.captured_at || a.created_at),
      matchedAttachmentId: match.id,
    }
  })
}
