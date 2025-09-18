"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import {
  TagData,
  TagAttributes
} from "@/types/tags"

type TagStatus = TagAttributes["status"]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  tag?: TagData | null
  loading?: boolean
  targetStatus: TagStatus
  onConfirm: () => Promise<void> | void
}

export default function TagStatusDialog({
  open, onOpenChange, tag, loading, targetStatus, onConfirm
}: Props) {
  const isDeactivate = targetStatus === "inactive"

  const TitleIcon = isDeactivate ? AlertTriangle : CheckCircle2
  const title = isDeactivate ? "Desativar tag" : "Reativar tag"
  const confirmLabel = isDeactivate ? "Desativar" : "Reativar"
  const confirmVariant = isDeactivate ? "destructive" : "default"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TitleIcon className={isDeactivate ? "h-5 w-5 text-amber-500" : "h-5 w-5 text-green-600"} />
            {title}
          </DialogTitle>
          <DialogDescription>
            {tag ? <>Você está alterando o status da tag <b>{tag.attributes.name}</b>. </> : null}
            {isDeactivate ? (
              <>Ao desativar, ela <b>não ficará visível na listagem de pacientes</b>, mas continuará disponível em <b>relatórios</b>. Você poderá <b>reativar</b> depois.</>
            ) : (
              <>Ao reativar, ela volta a ficar <b>visível na listagem de pacientes</b> e permanece disponível nos <b>relatórios</b>.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={loading} variant={confirmVariant as any}>
            {loading ? (isDeactivate ? "Desativando..." : "Reativando...") : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
