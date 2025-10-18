'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ConfidentialNotesService,
  type ConfidentialNoteCreatePayload,
} from '@/service/confidential-notes'
import clsx from 'clsx'
import { Check, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

type Props = {
  patientId: string | number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSaved?: () => Promise<void> | void
  children?: React.ReactNode
}

const ROLES = ['admin', 'manager', 'doctor', 'user'] as const
type Role = (typeof ROLES)[number]

function ToggleChips({
  label,
  values,
  onChange,
  hint,
}: {
  label: string
  values: Role[]
  onChange: (values: Role[]) => void
  hint?: string
}) {
  function toggle(role: Role) {
    if (values.includes(role)) onChange(values.filter((r) => r !== role))
    else onChange([...values, role])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        {hint ? (
          <span className="text-xs text-muted-foreground">— {hint}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {ROLES.map((role) => {
          const active = values.includes(role)
          return (
            <Button
              key={role}
              type="button"
              variant={active ? 'default' : 'outline'}
              className={clsx('h-8 px-3 rounded-full', active && 'shadow-sm')}
              onClick={() => toggle(role)}
            >
              <Check
                className={clsx('mr-1.5 h-4 w-4', !active && 'opacity-0')}
              />
              {role}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default function ConfidentialNoteDialog({
  patientId,
  open,
  onOpenChange,
  onSaved,
  children,
}: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [visibilityRoles, setVisibilityRoles] = useState<Role[]>([])
  const [crudRoles, setCrudRoles] = useState<Role[]>(['doctor'])
  const [saving, setSaving] = useState(false)

  const canSave = useMemo(() => content.trim().length > 0, [content])

  async function handleSave() {
    if (!canSave) return
    try {
      setSaving(true)

      const payload: ConfidentialNoteCreatePayload = {
        title: title.trim() || undefined,
        content: content.trim(),
        visibility_roles: visibilityRoles,
        crud_roles: crudRoles,
      }

      await ConfidentialNotesService.create(patientId, payload)

      // reset simples
      setTitle('')
      setContent('')
      setVisibilityRoles([])
      setCrudRoles(['doctor'])

      await onSaved?.()
      onOpenChange?.(false)
    } finally {
      setSaving(false)
    }
  }

  const Trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button size="sm">
        <Plus className="mr-1.5 h-4 w-4" />
        Nova observação
      </Button>
    </DialogTrigger>
  )

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {Trigger}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova observação confidencial</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (opcional)"
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva aqui…"
            className="min-h-[140px]"
          />

          <ToggleChips
            label="Quem pode ver"
            hint="Deixe vazio para todos os papéis"
            values={visibilityRoles}
            onChange={setVisibilityRoles}
          />

          <ToggleChips
            label="Quem pode editar/excluir"
            hint="Escolha papéis com permissão de gerenciamento"
            values={crudRoles}
            onChange={setCrudRoles}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || !canSave}
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
